# -*- coding: utf-8 -*-
import os
import sys
import uuid
import subprocess
import shutil
import json
import re
import requests
import secrets
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Literal, Dict, Any
from urllib.parse import urlencode

from fastapi import FastAPI, HTTPException, Form, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger

try:
    from backend.qqt_mcyp import BRAND, run_poll, now, query_family_members
    from backend.pushplus import send_pushplus
except ImportError:
    from qqt_mcyp import BRAND, run_poll, now, query_family_members
    from pushplus import send_pushplus

# ============ 基础配置 ============
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
LOG_DIR = BASE_DIR / "logs"
WEB_DIR = BASE_DIR / "web"
JOBS_FILE = DATA_DIR / "jobs.json"
DATA_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)

def load_env_file(file_path: Path) -> None:
    if not file_path.exists():
        return
    for line in file_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        text = line.strip()
        if not text or text.startswith("#") or "=" not in text:
            continue
        key, value = text.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = value

load_env_file(BASE_DIR / ".env")
load_env_file(BASE_DIR / ".env.local")

APP_STARTED_AT = time.monotonic()
APP_STARTED_AT_ISO = datetime.now().astimezone().isoformat()
EXECUTION_INSTANCE_ID = uuid.uuid4().hex[:12]

def execution_node() -> Dict[str, Any]:
    return {
        "instance_id": EXECUTION_INSTANCE_ID,
        "hostname": os.uname().nodename if hasattr(os, "uname") else os.getenv("HOSTNAME", "unknown"),
        "service_pid": os.getpid(),
        "python": str(Path(sys.executable).resolve()),
        "base_dir": str(BASE_DIR.resolve()),
        "bind_host": os.getenv("QQT_HOST", "127.0.0.1"),
        "bind_port": int(os.getenv("QQT_PORT", os.getenv("PORT", "8899"))),
        "started_at": APP_STARTED_AT_ISO,
        "execution_mode": "server-local",
    }

app = FastAPI(title="QQT Scheduler")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

scheduler = BackgroundScheduler(timezone="Asia/Shanghai")
scheduler.start()

# 访问控制白名单
PUBLIC_API_PATHS = {
    "/api/health",
    "/api/auth/key/login",
    "/api/admin/login",
    "/api/admin/login_key",
}

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path
    if path.startswith("/api"):
        if path in PUBLIC_API_PATHS:
            response = await call_next(request)
            response.headers["X-QQT-Execution-Node"] = EXECUTION_INSTANCE_ID
            return response
        if path.startswith("/api/admin"):
            token = request.headers.get("X-Admin-Token", "").strip()
            if not token or not is_valid_admin_token(token):
                return JSONResponse(status_code=401, content={"detail": "admin unauthorized"})
        else:
            key = get_auth_key_from_request(request)
            if not key or not is_valid_key(key):
                return JSONResponse(status_code=401, content={"detail": "unauthorized"})
    response = await call_next(request)
    response.headers["X-QQT-Execution-Node"] = EXECUTION_INSTANCE_ID
    return response

# 内存登记：任务配置（若需持久化可替换为 sqlite/json）
JOBS: Dict[str, Dict[str, Any]] = {}

# ============ 访问控制 ============
AUTH_KEYS_FILE = DATA_DIR / "auth_keys.json"
DEFAULT_KEY_TTL_SECONDS = 24 * 3600
DEFAULT_ADMIN_TTL_SECONDS = 24 * 3600
ADMIN_USER = os.getenv("QQT_ADMIN_USER", "ZevinGunn")
ADMIN_PASSWORD = os.getenv("QQT_ADMIN_PASSWORD", "Wadlam961125.")
ADMIN_MASTER_KEY = os.getenv("QQT_ADMIN_MASTER_KEY", "Korza3-vedbim-kurzuj")
CMCC_MANAGER_BASE_URL = os.getenv("CMCC_MANAGER_BASE_URL", "http://127.0.0.1:3101").rstrip("/")
CMCC_MANAGER_ADMIN_KEY = os.getenv("CMCC_MANAGER_ADMIN_KEY", "").strip()
CMCC_TOKEN_SYNC_TIMEOUT = max(5, int(os.getenv("CMCC_TOKEN_SYNC_TIMEOUT", "25")))
CMCC_WED_RECHARGE_EXPORT_TIMEOUT = max(30, int(os.getenv("CMCC_WED_RECHARGE_EXPORT_TIMEOUT", "180")))
CMCC_TOKEN_SYNC_CONCURRENCY = max(1, min(10, int(os.getenv("CMCC_TOKEN_SYNC_CONCURRENCY", "4"))))
CMCC_TOKEN_SYNC_REFRESH_DEFAULT = os.getenv("CMCC_TOKEN_SYNC_REFRESH", "1").strip().lower() not in {"0", "false", "no", "off"}
CMCC_TOKEN_SYNC_LEAD_SECONDS = max(10, int(os.getenv("CMCC_TOKEN_SYNC_LEAD_SECONDS", "1800")))
CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES = max(1, min(24 * 60, int(os.getenv("CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES", "60"))))
CMCC_TOKEN_SYNC_VALID_FOR_MINUTES = max(1, min(24 * 60, int(os.getenv("CMCC_TOKEN_SYNC_VALID_FOR_MINUTES", "120"))))

KEYS: Dict[str, Dict[str, Any]] = {}
ADMIN_TOKENS: Dict[str, float] = {}

def load_jobs():
    if JOBS_FILE.exists():
        try:
            with JOBS_FILE.open("r", encoding="utf-8") as f:
                saved = json.load(f)
                for jid, cfg in saved.items():
                    JOBS[jid] = cfg
                    # 恢复调度
                    add_job_to_scheduler(jid, cfg)
        except Exception as e:
            print(f"Load jobs error: {e}")

def save_jobs():
    try:
        with JOBS_FILE.open("w", encoding="utf-8") as f:
            # datetime 对象无法直接 json dump，这里简单处理，因为 cfg 中 datetime 是 Optional
            # 但实际上 JobCreate 里的 run_at 是 datetime，需要序列化
            # 为了简化，我们在存之前把 datetime 转 iso string
            dump_data = {}
            for k, v in JOBS.items():
                dump_data[k] = v.copy()
                if isinstance(dump_data[k].get("run_at"), datetime):
                    dump_data[k]["run_at"] = dump_data[k]["run_at"].isoformat()
            json.dump(dump_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Save jobs error: {e}")

def cleanup_expired_admin_tokens():
    now_ts = time.time()
    expired = [token for token, exp in ADMIN_TOKENS.items() if exp <= now_ts]
    for token in expired:
        ADMIN_TOKENS.pop(token, None)

def cleanup_expired_keys() -> None:
    now_ts = time.time()
    expired = [k for k, v in KEYS.items() if v.get("expires_at", 0) <= now_ts]
    if not expired:
        return
    for k in expired:
        KEYS.pop(k, None)
    save_keys()

def load_keys():
    if AUTH_KEYS_FILE.exists():
        try:
            with AUTH_KEYS_FILE.open("r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    for key, meta in data.items():
                        KEYS[key] = meta
                elif isinstance(data, list):
                    for item in data:
                        key = item.get("key")
                        if key:
                            KEYS[key] = item
        except Exception as e:
            print(f"Load keys error: {e}")
    cleanup_expired_keys()

def save_keys():
    try:
        with AUTH_KEYS_FILE.open("w", encoding="utf-8") as f:
            json.dump(KEYS, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Save keys error: {e}")

def get_auth_key_from_request(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return request.headers.get("X-Auth-Key", "").strip()

def is_valid_key(key: str) -> bool:
    cleanup_expired_keys()
    meta = KEYS.get(key)
    if not meta:
        return False
    exp = meta.get("expires_at", 0)
    if exp <= time.time():
        KEYS.pop(key, None)
        save_keys()
        return False
    return True

def is_valid_admin_token(token: str) -> bool:
    cleanup_expired_admin_tokens()
    exp = ADMIN_TOKENS.get(token)
    if not exp:
        return False
    if exp <= time.time():
        ADMIN_TOKENS.pop(token, None)
        return False
    return True

# ============ 数据模型 ============
class CronSpec(BaseModel):
    second: str = "0"       # 0-59
    minute: str = "*"       # 0-59 或 */5
    hour: str = "*"         # 0-23
    day: str = "*"          # 1-31
    month: str = "*"        # 1-12
    day_of_week: str = "*"  # 0-6（或 mon-sun）

class AccountConfig(BaseModel):
    cookie: str
    receive_phone: str = ""
    phone: str = ""
    display_phone: str = ""

class JobCreate(BaseModel):
    name: str
    cookies_text: str = ""           # Keep for compatibility, parsed if accounts not provided
    accounts: List[AccountConfig] = [] # New: Structured input
    run_mode: Literal["concurrent", "sequential"] = "concurrent"
    max_workers: int = 0
    jitter_ms: int = 0
    poll_times: int = 10
    poll_interval_ms: int = 0
    start_delay_ms: int = 0        
    is_random: str = "0"
    source: str = "1"
    receive_phone: str = ""        # Global fallback
    channel_code: str = ""
    product_id: str = "3442"
    activity_type: Literal["normal", "xingdong", "wed_recharge"] = "normal"
    xingdong_slot: Literal["all", "early", "normal"] = "all"
    xingdong_product_id: str = ""
    daily_xingdong_product_id: str = ""
    executor: Literal["python", "go", "java"] = "python"
    schedule_type: Literal["immediate", "date", "cron"] = "immediate"
    run_at: Optional[datetime] = None
    cron: Optional[CronSpec] = None
    use_server_time: bool = True
    monitor_mode: bool = False
    per_account_delay_ms: int = 0
    accounts_per_poll: int = 0
    burst_mode: bool = False
    per_round_gap_ms: int = 0
    per_account_gap_ms: int = 0
    sync_cmcc_tokens_before_run: bool = False
    cmcc_token_updated_within_minutes: int = CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES
    cmcc_token_valid_for_minutes: int = CMCC_TOKEN_SYNC_VALID_FOR_MINUTES
    is_test_run: bool = False
    force_sequential_run_once: bool = False

class KeyLoginRequest(BaseModel):
    key: str

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminKeyLoginRequest(BaseModel):
    key: str

class KeyCreateRequest(BaseModel):
    key: Optional[str] = None
    label: str = ""
    ttl_hours: int = 24

class KeyExtendRequest(BaseModel):
    extend_hours: int = 24

def write_log(job_id: str) -> Any:
    log_file = LOG_DIR / f"{job_id}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
    def _log(line: str):
        print(line)
        with log_file.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
    return _log, log_file

RESULT_LINE_RE = re.compile(
    r"账号(?P<account>.*?)请求发送 (?P<send>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) "
    r"返回 (?P<recv>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?领取结果 => "
    r"(?P<status>\S+)\s*(?P<msg>.*)$"
)

def _is_success_result(status: str, msg: str) -> bool:
    status_text = str(status or "").strip()
    msg_text = str(msg or "").strip()
    if status_text in {"1", "200", "0000"}:
        return True
    if "成功" in msg_text and all(x not in msg_text for x in ["失败", "已领完", "抢光", "库存不足", "异常"]):
        return True
    return False

def build_log_summary(log_file: Path, expected_total: int = 0) -> Dict[str, Any]:
    if not log_file.exists():
        return {
            "total": 0,
            "success": 0,
            "total_requests": 0,
            "success_requests": 0,
            "success_rate": 0.0,
            "success_accounts": [],
            "success_time_start": None,
            "success_time_end": None,
        }
    lines = log_file.read_text(encoding="utf-8", errors="ignore").splitlines()
    attempts: List[Dict[str, str]] = []
    for line in lines:
        m = RESULT_LINE_RE.search(line)
        if not m:
            continue
        account_text = (m.group("account") or "").strip()
        if account_text.startswith("#"):
            account_text = f"账号{account_text}"
        account_label = account_text or "未知账号"
        attempts.append(
            {
                "account": account_label,
                "send": m.group("send"),
                "recv": m.group("recv"),
                "status": m.group("status"),
                "msg": (m.group("msg") or "").strip(),
            }
        )

    success_rows = [row for row in attempts if _is_success_result(row["status"], row["msg"])]
    total_accounts = sorted({row["account"] for row in attempts})
    success_accounts = sorted({row["account"] for row in success_rows})
    recv_times = sorted([row["recv"] for row in success_rows if row.get("recv")])
    total = len(total_accounts) if total_accounts else max(0, int(expected_total or 0))
    success = len(success_accounts)
    total_requests = len(attempts)
    success_requests = len(success_rows)
    success_rate = round((success / total) * 100, 2) if total > 0 else 0.0
    return {
        "total": total,
        "success": success,
        "total_requests": total_requests,
        "success_requests": success_requests,
        "success_rate": success_rate,
        "success_accounts": success_accounts,
        "success_time_start": recv_times[0] if recv_times else None,
        "success_time_end": recv_times[-1] if recv_times else None,
    }

def append_log_summary(job_id: str, log_file: Path, log_fn: Any, expected_total: int = 0) -> None:
    summary = build_log_summary(log_file, expected_total=expected_total)
    log_fn(
        f"[{now()}] [JOB {job_id}] 自动总结：总账号 {summary['total']}，成功账号 {summary['success']}，成功率 {summary['success_rate']}%"
    )
    log_fn(
        f"[{now()}] [JOB {job_id}] 自动总结：总请求 {summary['total_requests']}，成功请求 {summary['success_requests']}"
    )
    if summary["success_accounts"]:
        log_fn(
            f"[{now()}] [JOB {job_id}] 自动总结：成功账号 => {', '.join(summary['success_accounts'])}"
        )
    else:
        log_fn(f"[{now()}] [JOB {job_id}] 自动总结：成功账号 => 无")
    if summary["success_time_start"] and summary["success_time_end"]:
        log_fn(
            f"[{now()}] [JOB {job_id}] 自动总结：成功时间范围 => {summary['success_time_start']} ~ {summary['success_time_end']}"
        )
    else:
        log_fn(f"[{now()}] [JOB {job_id}] 自动总结：成功时间范围 => 无成功记录")
    try:
        send_pushplus(
            title=f"全球通抢购结果: {job_id}",
            content="\n".join([
                "### 全球通权益抢购结果",
                f"- 任务ID: {job_id}",
                f"- 总账号: {summary['total']}",
                f"- 成功账号: {summary['success']}",
                f"- 成功率: {summary['success_rate']}%",
                f"- 总请求: {summary['total_requests']}",
                f"- 成功请求: {summary['success_requests']}",
                f"- 成功账号: {', '.join(summary['success_accounts']) if summary['success_accounts'] else '无'}",
                f"- 成功时间范围: {summary['success_time_start']} ~ {summary['success_time_end']}"
                if summary["success_time_start"] and summary["success_time_end"]
                else "- 成功时间范围: 无成功记录",
            ]),
        )
    except Exception as e:
        log_fn(f"[{now()}] [JOB {job_id}] PushPlus 推送失败: {e}")
    try:
        post_cmcc_rush_result(job_id, summary)
    except Exception as e:
        log_fn(f"[{now()}] [JOB {job_id}] CMCC 结果分发失败: {e}")

def parse_cookies(text: str) -> List[str]:
    lines = [ln.strip() for ln in (text or "").splitlines()]
    return [ln for ln in lines if ln]

def _parse_int(value: Any) -> Optional[int]:
    try:
        return int(value)
    except Exception:
        return None

def format_dt_ms(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

def compute_target_time(cfg: Dict[str, Any]) -> Optional[datetime]:
    schedule_type = cfg.get("schedule_type")
    if schedule_type == "date":
        run_at = cfg.get("run_at")
        if isinstance(run_at, str) and run_at:
            try:
                run_at = datetime.fromisoformat(run_at)
            except Exception:
                return None
        if isinstance(run_at, datetime):
            return run_at
        return None
    if schedule_type != "cron":
        return None

    c = cfg.get("cron") or {}
    if hasattr(c, "dict"):
        c = c.dict()
    hour = _parse_int(c.get("hour"))
    minute = _parse_int(c.get("minute"))
    second = _parse_int(c.get("second", 0))
    if hour is None or minute is None or second is None:
        return None
    now_dt = datetime.now()
    return now_dt.replace(hour=hour, minute=minute, second=second, microsecond=0)

def precise_wait_until(target: datetime) -> None:
    now_dt = datetime.now()
    if target <= now_dt:
        return
    remaining = (target - now_dt).total_seconds()
    if remaining > 0.2:
        time.sleep(remaining - 0.2)
    while datetime.now() < target:
        time.sleep(0.005)

def build_cmcc_token_cookie(access_token: str) -> str:
    return f"access_token={str(access_token or '').strip()}"

def fetch_cmcc_unclaimed_tokens(
    refresh: bool = True,
    updated_within_minutes: int = CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES,
    valid_for_minutes: int = CMCC_TOKEN_SYNC_VALID_FOR_MINUTES,
    min_valid_until: Optional[datetime] = None,
) -> Dict[str, Any]:
    if not CMCC_MANAGER_BASE_URL:
        raise RuntimeError("CMCC_MANAGER_BASE_URL not configured")

    query_params = {
        "refresh": "1" if refresh else "0",
        "concurrency": str(CMCC_TOKEN_SYNC_CONCURRENCY),
        "updatedWithinMinutes": str(max(1, int(updated_within_minutes or CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES))),
        "validForMinutes": str(max(1, int(valid_for_minutes or CMCC_TOKEN_SYNC_VALID_FOR_MINUTES))),
    }
    if min_valid_until is not None:
        query_params["minValidUntil"] = min_valid_until.isoformat()
    query = urlencode(query_params)
    url = f"{CMCC_MANAGER_BASE_URL}/api/accounts/qqt/tokens/export?{query}"
    headers = {"Content-Type": "application/json"}
    if CMCC_MANAGER_ADMIN_KEY:
        headers["x-admin-key"] = CMCC_MANAGER_ADMIN_KEY

    try:
        resp = requests.post(url, headers=headers, json={}, timeout=CMCC_TOKEN_SYNC_TIMEOUT)
    except Exception as e:
        raise RuntimeError(f"CMCC token sync request failed: {e}") from e

    try:
        payload = resp.json()
    except Exception as e:
        raise RuntimeError(f"CMCC token sync invalid response: {e}") from e

    if not resp.ok or not payload.get("ok"):
        detail = payload.get("message") or payload.get("detail") or f"HTTP {resp.status_code}"
        raise RuntimeError(f"CMCC token sync failed: {detail}")

    data = payload.get("data") or {}
    raw_tokens = data.get("tokens") or []
    tokens: List[Dict[str, Any]] = []
    for item in raw_tokens:
        if not isinstance(item, dict):
            continue
        access_token = str(item.get("accessToken") or "").strip()
        if not access_token:
            continue
        tokens.append({
            "accountId": str(item.get("accountId") or "").strip(),
            "phone": str(item.get("phone") or "").strip(),
            "phoneMasked": str(item.get("phoneMasked") or "").strip(),
            "displayPhone": str(item.get("displayPhone") or "").strip(),
            "accessToken": access_token,
            "accessTokenCheckedAt": item.get("accessTokenCheckedAt"),
            "accessTokenUpdatedAt": item.get("accessTokenUpdatedAt"),
            "accessTokenExpiresAt": item.get("accessTokenExpiresAt"),
            "xdrReceiveUpdatedAt": item.get("xdrReceiveUpdatedAt"),
            "qqtSignUpdatedAt": item.get("qqtSignUpdatedAt"),
            "isQqtUser": item.get("isQqtUser"),
            "monthlyReceived": item.get("monthlyReceived"),
            "xdrReceived": item.get("xdrReceived"),
        })
    return {
        "exported_at": data.get("exportedAt"),
        "total": data.get("total", len(tokens)),
        "skipped": data.get("skipped", 0),
        "skip_reasons": data.get("skipReasons") or {},
        "tokens": tokens,
    }

def merge_cmcc_tokens_into_accounts(existing_accounts: List[Dict[str, Any]], token_rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    receive_phone_by_phone: Dict[str, str] = {}
    receive_phone_by_display: Dict[str, str] = {}
    for account in existing_accounts or []:
        if not isinstance(account, dict):
            continue
        receive_phone = str(account.get("receive_phone") or "").strip()
        if not receive_phone:
            continue
        phone = str(account.get("phone") or "").strip()
        display_phone = str(account.get("display_phone") or "").strip()
        if phone:
            receive_phone_by_phone[phone] = receive_phone
        if display_phone:
            receive_phone_by_display[display_phone] = receive_phone

    merged: List[Dict[str, Any]] = []
    for item in token_rows:
        phone = str(item.get("phone") or "").strip()
        display_phone = str(item.get("displayPhone") or "").strip()
        receive_phone = receive_phone_by_phone.get(phone) or receive_phone_by_display.get(display_phone) or ""
        merged.append({
            "cookie": build_cmcc_token_cookie(item.get("accessToken", "")),
            "receive_phone": receive_phone,
            "phone": phone,
            "display_phone": display_phone,
        })
    return merged

def post_cmcc_rush_result(job_id: str, summary: Dict[str, Any]) -> None:
    if not CMCC_MANAGER_BASE_URL:
        return
    url = f"{CMCC_MANAGER_BASE_URL}/api/accounts/notify/rush-result"
    headers = {"Content-Type": "application/json"}
    if CMCC_MANAGER_ADMIN_KEY:
        headers["x-admin-key"] = CMCC_MANAGER_ADMIN_KEY
    payload = {
        "jobId": job_id,
        "total": summary.get("total", 0),
        "success": summary.get("success", 0),
        "successRate": summary.get("success_rate", 0),
        "successAccounts": summary.get("success_accounts", []),
        "successTimeStart": summary.get("success_time_start"),
        "successTimeEnd": summary.get("success_time_end"),
        "totalRequests": summary.get("total_requests", 0),
        "successRequests": summary.get("success_requests", 0),
    }
    try:
        requests.post(url, headers=headers, json=payload, timeout=10)
    except Exception as e:
        print(f"CMCC rush result dispatch failed: {e}")

def build_token_sync_job_id(job_id: str) -> str:
    return f"{job_id}:token-sync"

def compute_token_sync_time(cfg: Dict[str, Any]) -> Optional[datetime]:
    target = compute_target_time(cfg)
    if target is None:
        return None
    sync_time = target - timedelta(seconds=CMCC_TOKEN_SYNC_LEAD_SECONDS)
    now_dt = datetime.now()
    if cfg.get("schedule_type") == "date" and sync_time <= now_dt:
        return now_dt
    return sync_time

def sync_tokens_for_job(job_id: str, refresh: bool = True, log_fn: Any = None) -> Dict[str, Any]:
    cfg = JOBS.get(job_id)
    if not cfg:
        raise RuntimeError("job not found")
    target_time = compute_target_time(cfg)
    sync_res = fetch_cmcc_unclaimed_tokens(
        refresh=refresh,
        updated_within_minutes=int(cfg.get("cmcc_token_updated_within_minutes") or CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES),
        valid_for_minutes=int(cfg.get("cmcc_token_valid_for_minutes") or CMCC_TOKEN_SYNC_VALID_FOR_MINUTES),
        min_valid_until=target_time,
    )
    merged_accounts = merge_cmcc_tokens_into_accounts(
        cfg.get("accounts") or [],
        sync_res.get("tokens") or [],
    )
    if merged_accounts:
        cfg["accounts"] = merged_accounts
        save_jobs()
    if log_fn:
        skip_reasons = sync_res.get("skip_reasons") or {}
        reason_text = "，".join([f"{k}:{v}" for k, v in skip_reasons.items() if v]) or "无"
        log_fn(
            f"[{now()}] [JOB {job_id}] Token 预获取完成："
            f"导入 {len(merged_accounts)} 个未领取账号，跳过 {sync_res.get('skipped', 0)} 个，跳过原因 {reason_text}"
        )
    return {
        "imported": len(merged_accounts),
        "skipped": sync_res.get("skipped", 0),
        "skip_reasons": sync_res.get("skip_reasons") or {},
        "exported_at": sync_res.get("exported_at"),
    }

def run_token_sync_job(job_id: str):
    log_fn, _ = write_log(job_id)
    try:
        sync_tokens_for_job(job_id, refresh=CMCC_TOKEN_SYNC_REFRESH_DEFAULT, log_fn=log_fn)
    except Exception as e:
        log_fn(f"[{now()}] [JOB {job_id}] Token 预获取失败: {e}")

def build_accounts_list(cfg_run: Dict[str, Any]) -> List[Dict[str, Any]]:
    accounts_list = []
    if cfg_run.get("accounts"):
        accounts_list = cfg_run["accounts"]
    else:
        cks = parse_cookies(cfg_run.get("cookies_text", ""))
        for ck in cks:
            accounts_list.append({"cookie": ck, "receive_phone": ""})
    return accounts_list

def run_python_executor(cfg_run: Dict[str, Any], log_fn: Any) -> bool:
    accounts_list = build_accounts_list(cfg_run)
    if not accounts_list:
        log_fn(f"[{now()}] [{BRAND}] 未检测到账号，任务跳过。")
        return False

    run_poll(
        accounts=accounts_list,
        poll_times=cfg_run["poll_times"],
        poll_interval_ms=cfg_run["poll_interval_ms"],
        start_delay_ms=cfg_run.get("start_delay_ms", 0),
        run_mode=cfg_run["run_mode"],
        max_workers=cfg_run["max_workers"],
        jitter_ms=cfg_run["jitter_ms"],
        is_random=cfg_run["is_random"],
        source=cfg_run["source"],
        global_receive_phone=cfg_run["receive_phone"],
        channel_code=cfg_run["channel_code"],
        product_id=cfg_run.get("product_id", "3442"),
        activity_type=cfg_run.get("activity_type", "normal"),
        xingdong_slot=cfg_run.get("xingdong_slot", "all"),
        xingdong_product_id=cfg_run.get("xingdong_product_id", ""),
        daily_xingdong_product_id=cfg_run.get("daily_xingdong_product_id", ""),
        per_account_delay_ms=cfg_run.get("per_account_delay_ms", 0),
        accounts_per_poll=cfg_run.get("accounts_per_poll", 0),
        is_test_run=cfg_run.get("is_test_run", False),
        force_sequential_run_once=cfg_run.get("force_sequential_run_once", False),
        log=log_fn,
    )
    return True

def run_job(job_id: str):
    cfg = JOBS.get(job_id)
    if not cfg:
        return
    log_fn, log_file = write_log(job_id)
    time_source = "Beijing" if cfg.get("use_server_time", True) else "Local"
    monitor_status = "on" if cfg.get("monitor_mode") else "off"
    activity_type = cfg.get("activity_type", "normal")
    activity_text = {
        "xingdong": "星动日",
        "wed_recharge": "周三话费券",
    }.get(activity_type, "常态权益")
    slot_text = cfg.get("xingdong_slot", "all")
    node = execution_node()
    cfg["last_execution_node"] = node
    cfg["last_started_at"] = datetime.now().astimezone().isoformat()
    save_jobs()
    log_fn(
        f"[{now()}] [JOB {job_id}] 本地执行节点：host={node['hostname']} "
        f"service_pid={node['service_pid']} instance={node['instance_id']} base={node['base_dir']}"
    )
    log_fn(f"[{now()}] [JOB {job_id}] 任务开始：{cfg.get('name')} [Activity={activity_text}] [Slot={slot_text}] [TimeSource={time_source}] [Monitor={monitor_status}]")
    
    executor = cfg.get("executor", "python")
    cfg_run = cfg

    if cfg.get("monitor_mode"):
        target = compute_target_time(cfg)
        delay_ms = cfg.get("start_delay_ms", 0) or 0
        if target is not None:
            target = target + timedelta(milliseconds=delay_ms)
            if target > datetime.now():
                log_fn(f"[{now()}] [JOB {job_id}] 监控模式等待到 {format_dt_ms(target)}")
                precise_wait_until(target)
                cfg_run = cfg.copy()
                cfg_run["start_delay_ms"] = 0
    
    executed = False
    if activity_type == "wed_recharge":
        cfg_run = cfg.copy()
        cfg_run["run_mode"] = "sequential"
        cfg_run["max_workers"] = 1
        cfg_run["poll_times"] = 1
        cfg_run["poll_interval_ms"] = 0
        cfg_run["accounts_per_poll"] = 0
        if int(cfg_run.get("per_account_delay_ms") or 0) <= 0:
            cfg_run["per_account_delay_ms"] = 300
        log_fn(
            f"[{now()}] [JOB {job_id}] 周三话费券强制串行：max_workers=1 poll_times=1 "
            f"account_gap={cfg_run.get('per_account_delay_ms')}ms"
        )

    if executor == "python":
        executed = run_python_executor(cfg_run, log_fn)
    elif executor == "go":
        executed = run_external_worker("go", cfg_run, log_fn)
        if not executed:
            log_fn(f"[{now()}] [JOB {job_id}] Go worker 未正常启动，自动降级到 Python 执行器。")
            executed = run_python_executor(cfg_run, log_fn)
    elif executor == "java":
        executed = run_external_worker("java", cfg_run, log_fn)
        if not executed:
            log_fn(f"[{now()}] [JOB {job_id}] Java worker 未正常启动，自动降级到 Python 执行器。")
            executed = run_python_executor(cfg_run, log_fn)
    else:
        log_fn(f"[{now()}] [JOB {job_id}] 未知执行器 {executor}，自动降级到 Python 执行器。")
        executed = run_python_executor(cfg_run, log_fn)

    if not executed:
        log_fn(f"[{now()}] [JOB {job_id}] 任务未执行账号请求。")
        log_fn(f"[{now()}] [JOB {job_id}] 任务结束：{cfg.get('name')}")
        return
        
    expected_total = len(cfg_run.get("accounts") or [])
    if expected_total <= 0:
        expected_total = len(parse_cookies(cfg_run.get("cookies_text", "")))
    append_log_summary(job_id, log_file, log_fn, expected_total=expected_total)
    log_fn(f"[{now()}] [JOB {job_id}] 任务结束：{cfg.get('name')}")

def run_external_worker(worker_type: str, cfg: Dict[str, Any], log_fn: Any) -> bool:
    cfg_run = dict(cfg)
    accounts = cfg_run.get("accounts") or []
    if accounts and not cfg_run.get("cookies_text"):
        cfg_run["cookies_text"] = "\n".join(
            str(item.get("cookie") or "").strip()
            for item in accounts
            if str(item.get("cookie") or "").strip()
        )
    cfg_json = json.dumps(cfg_run, ensure_ascii=False)

    cmd = []
    cwd = BASE_DIR
    worker_target = None

    def newest_mtime(paths: List[Path]) -> float:
        times = []
        for path in paths:
            if path.exists():
                if path.is_dir():
                    times.extend(p.stat().st_mtime for p in path.rglob("*") if p.is_file())
                else:
                    times.append(path.stat().st_mtime)
        return max(times) if times else 0.0

    def needs_rebuild(target: Path, sources: List[Path]) -> bool:
        if not target.exists():
            return True
        return newest_mtime(sources) > target.stat().st_mtime

    def try_build(command: List[str], build_cwd: Path, target: Path, missing_tool: str, sources: List[Path]) -> bool:
        if not needs_rebuild(target, sources):
            return True
        exe = shutil.which(command[0])
        if not exe and not Path(command[0]).exists():
            log_fn(f"Error: {missing_tool} not found in PATH, cannot build {worker_type} worker")
            return False
        try:
            log_fn(f"Building {worker_type} worker...")
            result = subprocess.run(
                command,
                cwd=build_cwd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
            output = (result.stdout or "").strip()
            if output:
                for line in output.splitlines():
                    log_fn(line)
            if result.returncode != 0:
                log_fn(f"Error: failed to build {worker_type} worker (exit {result.returncode})")
                return False
            if not target.exists():
                log_fn(f"Error: build completed but target not found at {target}")
                return False
            return True
        except Exception as e:
            log_fn(f"Error: failed to build {worker_type} worker: {e}")
            return False

    def check_command(command: List[str], label: str) -> bool:
        try:
            result = subprocess.run(
                command,
                cwd=BASE_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
            output = (result.stdout or "").strip()
            if output:
                first_line = output.splitlines()[0]
                log_fn(f"{label}: {first_line}")
            if result.returncode != 0:
                log_fn(f"Error: {label} check failed (exit {result.returncode})")
                if output:
                    for line in output.splitlines()[1:4]:
                        log_fn(line)
                return False
            return True
        except Exception as e:
            log_fn(f"Error: {label} check failed: {e}")
            return False

    if worker_type == "go":
        worker_path = BASE_DIR / "go-worker" / "worker"
        worker_target = worker_path
        ok = try_build(
            ["go", "build", "-o", str(worker_path), "main.go"],
            BASE_DIR / "go-worker",
            worker_path,
            "go",
            [BASE_DIR / "go-worker" / "main.go", BASE_DIR / "go-worker" / "go.mod"],
        )
        if not ok:
            log_fn(f"Error: Go worker binary not available at {worker_path}")
            return False
        cmd = [str(worker_path), cfg_json]
    elif worker_type == "java":
        worker_jar = BASE_DIR / "java-worker" / "target" / "worker-1.0-SNAPSHOT-shaded.jar"
        worker_target = worker_jar
        java_bin = shutil.which("java")
        if not java_bin:
            log_fn("Error: java not found in PATH, cannot run java worker. Install JDK 11+ or set JAVA_HOME.")
            return False
        if not check_command([java_bin, "-version"], "Java runtime"):
            log_fn("Error: java command exists but no usable runtime was found. Install a JDK 11+ and restart the service.")
            return False
        java_worker_dir = BASE_DIR / "java-worker"
        mvnw = java_worker_dir / "mvnw"
        if mvnw.exists():
            if not os.access(mvnw, os.X_OK):
                try:
                    mvnw.chmod(mvnw.stat().st_mode | 0o111)
                    log_fn(f"Made Maven wrapper executable: {mvnw}")
                except Exception as e:
                    log_fn(f"Error: Maven wrapper exists but is not executable: {e}")
                    return False
            maven_cmd = [str(mvnw), "clean", "package", "-q"]
        elif shutil.which("mvn"):
            maven_cmd = ["mvn", "clean", "package", "-q"]
        else:
            log_fn("Error: Maven not found and java-worker/mvnw is missing. Install Maven or restore the Maven wrapper.")
            return False
        ok = try_build(
            maven_cmd,
            java_worker_dir,
            worker_jar,
            "maven",
            [java_worker_dir / "pom.xml", java_worker_dir / "src", java_worker_dir / "mvnw"],
        )
        if not ok:
            log_fn(f"Error: Java worker jar not available at {worker_jar}. Check JDK 11+, Maven wrapper, and dependency download access.")
            return False
        cmd = [java_bin, "-jar", str(worker_jar), cfg_json]
    else:
        log_fn(f"Error: unsupported worker type {worker_type}")
        return False

    try:
        account_count = len(accounts) if accounts else len(parse_cookies(cfg_run.get("cookies_text", "")))
        if account_count <= 0:
            log_fn(f"Error: {worker_type} worker received no accounts")
            return False
        if worker_target is not None:
            log_fn(f"Starting {worker_type} worker... [accounts={account_count}] [target={worker_target}]")
        else:
            log_fn(f"Starting {worker_type} worker... [accounts={account_count}]")
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            cwd=cwd
        )
        log_fn(
            f"[{now()}] [JOB] 本地 worker 已启动：pid={process.pid} "
            f"type={worker_type} path={worker_target or cmd[0]}"
        )
        
        # Read output line by line
        for line in process.stdout:
            log_fn(line.strip())
            
        process.wait()
        if process.returncode != 0:
            log_fn(f"{worker_type} worker exited with code {process.returncode}")
            return False
        return True
            
    except Exception as e:
        log_fn(f"Failed to run {worker_type} worker: {e}")
        return False

def build_job_id(cfg: Dict[str, Any]) -> str:
    account_count = len(cfg.get("accounts") or [])
    ts = datetime.now().strftime("%Y%m%d%H%M")
    return f"{ts}-{account_count}"

# ============ 接口 ============
def add_job_to_scheduler(job_id: str, cfg: Dict[str, Any]):
    sync_job_id = build_token_sync_job_id(job_id)
    try:
        scheduler.remove_job(sync_job_id)
    except Exception:
        pass

    # 兼容处理 run_at 字符串转 datetime
    run_at = cfg.get("run_at")
    if isinstance(run_at, str) and run_at:
        try:
            run_at = datetime.fromisoformat(run_at)
            cfg["run_at"] = run_at
        except:
            pass

    if cfg["schedule_type"] == "immediate":
        # immediate 仅在创建时执行一次，重启后不自动恢复执行，或者你可以选择恢复
        # 这里为了避免重启雪崩，immediate 任务重启后不自动加回 scheduler，除非它是未来的
        pass 
        # scheduler.add_job(run_job, args=[job_id], id=job_id, replace_existing=True, next_run_time=datetime.now())
    elif cfg["schedule_type"] == "date":
        if not run_at:
            return
        # 如果时间已过，apscheduler 会根据 misfire_grace_time 决定是否执行，这里暂不特殊处理
        scheduler.add_job(run_job, args=[job_id], id=job_id, replace_existing=True,
                          trigger=DateTrigger(run_date=run_at))
    else:  # cron
        c = cfg.get("cron") or {}
        # 兼容 cron 对象可能是 dict 或 Pydantic model
        if hasattr(c, "dict"): c = c.dict()
        
        trigger = CronTrigger(
            second=c.get("second", "0"),
            minute=c.get("minute", "*"),
            hour=c.get("hour", "*"),
            day=c.get("day", "*"),
            month=c.get("month", "*"),
            day_of_week=c.get("day_of_week", "*"),
        )
        scheduler.add_job(run_job, args=[job_id], id=job_id, replace_existing=True, trigger=trigger)

    if cfg.get("sync_cmcc_tokens_before_run") and cfg["schedule_type"] in {"date", "cron"}:
        if cfg.get("activity_type") == "wed_recharge":
            return
        sync_time = compute_token_sync_time(cfg)
        if sync_time is not None:
            scheduler.add_job(
                run_token_sync_job,
                args=[job_id],
                id=sync_job_id,
                replace_existing=True,
                trigger=DateTrigger(run_date=sync_time) if cfg["schedule_type"] == "date" else CronTrigger(
                    second=sync_time.second,
                    minute=sync_time.minute,
                    hour=sync_time.hour,
                    day="*",
                    month="*",
                    day_of_week="*",
                ),
            )

@app.on_event("startup")
def startup_event():
    load_jobs()
    load_keys()
    scheduler.add_job(
        cleanup_expired_keys,
        id="cleanup_keys",
        replace_existing=True,
        trigger=CronTrigger(second="*/30"),
    )

@app.post("/api/jobs")
def create_job(payload: JobCreate):
    cfg = payload.dict()
    job_id = build_job_id(cfg)
    suffix = 1
    while job_id in JOBS:
        suffix += 1
        job_id = f"{build_job_id(cfg)}-{suffix}"
    cfg["created_at"] = datetime.now().astimezone().isoformat()
    cfg["created_on"] = execution_node()
    JOBS[job_id] = cfg
    
    # 立即添加到调度
    if cfg["schedule_type"] == "immediate":
        scheduler.add_job(run_job, args=[job_id], id=job_id, replace_existing=True, next_run_time=datetime.now())
    else:
        add_job_to_scheduler(job_id, cfg)
    
    save_jobs()
    return {"job_id": job_id, "message": "created", "execution_node": execution_node()}

@app.get("/api/sys/time")
def get_sys_time():
    return {"timestamp": time.time(), "iso": now()}

@app.get("/api/health")
def get_health():
    return {
        "ok": True,
        "service": "qqtlocal",
        "uptimeSeconds": int(time.monotonic() - APP_STARTED_AT),
        "execution_node": execution_node(),
        "scheduler_running": scheduler.running,
    }

@app.get("/api/runtime")
def get_runtime():
    return {
        "ok": True,
        "execution_node": execution_node(),
        "scheduler_running": scheduler.running,
        "jobs_total": len(JOBS),
        "worker_paths": {
            "python": str((BASE_DIR / "backend" / "qqt_mcyp.py").resolve()),
            "go": str((BASE_DIR / "go-worker" / "worker").resolve()),
            "java": str((BASE_DIR / "java-worker" / "target" / "worker-1.0-SNAPSHOT-shaded.jar").resolve()),
        },
    }

@app.post("/api/auth/key/login")
def login_key(payload: KeyLoginRequest):
    key = (payload.key or "").strip()
    if not key:
        raise HTTPException(status_code=400, detail="key required")
    if not is_valid_key(key):
        raise HTTPException(status_code=401, detail="invalid or expired key")
    meta = KEYS.get(key, {})
    return {"ok": True, "expires_at": meta.get("expires_at", 0)}

@app.post("/api/admin/login")
def admin_login(payload: AdminLoginRequest):
    if payload.username != ADMIN_USER or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = secrets.token_urlsafe(24)
    expires_at = time.time() + DEFAULT_ADMIN_TTL_SECONDS
    ADMIN_TOKENS[token] = expires_at
    return {"token": token, "expires_at": expires_at}

@app.post("/api/admin/login_key")
def admin_login_key(payload: AdminKeyLoginRequest):
    key = (payload.key or "").strip()
    if not key or key != ADMIN_MASTER_KEY:
        raise HTTPException(status_code=401, detail="invalid admin key")
    token = secrets.token_urlsafe(24)
    expires_at = time.time() + DEFAULT_ADMIN_TTL_SECONDS
    ADMIN_TOKENS[token] = expires_at
    return {"token": token, "expires_at": expires_at}

@app.get("/api/admin/keys")
def list_keys():
    cleanup_expired_keys()
    items = []
    for key, meta in KEYS.items():
        item = meta.copy()
        if "key" not in item:
            item["key"] = key
        items.append(item)
    items.sort(key=lambda x: x.get("expires_at", 0))
    return {"keys": items}

@app.post("/api/admin/keys")
def create_key(payload: KeyCreateRequest):
    cleanup_expired_keys()
    ttl_hours = payload.ttl_hours if payload.ttl_hours and payload.ttl_hours > 0 else 24
    key = (payload.key or "").strip()
    if not key:
        key = secrets.token_urlsafe(24)
    if key in KEYS:
        raise HTTPException(status_code=409, detail="key exists")
    now_ts = time.time()
    meta = {
        "key": key,
        "label": payload.label or "",
        "created_at": now_ts,
        "expires_at": now_ts + (ttl_hours * 3600),
    }
    KEYS[key] = meta
    save_keys()
    return meta

@app.post("/api/admin/keys/{key}/extend")
def extend_key(key: str, payload: KeyExtendRequest):
    cleanup_expired_keys()
    if key not in KEYS:
        raise HTTPException(status_code=404, detail="key not found")
    extend_hours = payload.extend_hours if payload.extend_hours and payload.extend_hours > 0 else 24
    now_ts = time.time()
    base = KEYS[key].get("expires_at", now_ts)
    if base < now_ts:
        base = now_ts
    KEYS[key]["expires_at"] = base + (extend_hours * 3600)
    save_keys()
    return KEYS[key]

@app.delete("/api/admin/keys/{key}")
def delete_key(key: str):
    if key in KEYS:
        KEYS.pop(key, None)
        save_keys()
    return {"deleted": key}

@app.get("/api/jobs")
def list_jobs():
    out = []
    for jid, cfg in JOBS.items():
        job = scheduler.get_job(jid)
        out.append({
            "job_id": jid,
            "name": cfg.get("name", ""),
            "next_run_time": job.next_run_time if job else None,
            "schedule_type": cfg.get("schedule_type"),
            "product_id": cfg.get("product_id", "3566"),
            "activity_type": cfg.get("activity_type", "normal"),
            "xingdong_slot": cfg.get("xingdong_slot", "all"),
            "xingdong_product_id": cfg.get("xingdong_product_id", ""),
            "daily_xingdong_product_id": cfg.get("daily_xingdong_product_id", ""),
            "executor": cfg.get("executor", "python"),
            "account_count": len(cfg.get("accounts") or parse_cookies(cfg.get("cookies_text", ""))),
            "created_at": cfg.get("created_at"),
            "last_started_at": cfg.get("last_started_at"),
            "execution_node": cfg.get("last_execution_node") or cfg.get("created_on"),
            "state": "scheduled" if job else ("completed" if list(LOG_DIR.glob(f"{jid}-*.log")) else "saved"),
        })
    return out

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: str):
    if job_id in JOBS:
        JOBS.pop(job_id, None)
        save_jobs()
    try:
        scheduler.remove_job(job_id)
    except Exception:
        pass
    try:
        scheduler.remove_job(build_token_sync_job_id(job_id))
    except Exception:
        pass
    return {"deleted": job_id}

@app.post("/api/jobs/{job_id}/run")
def run_now(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(404, "job not found")
    scheduler.add_job(run_job, args=[job_id])
    return {"message": "queued"}

@app.get("/api/logs/{job_id}")
def list_logs(job_id: str):
    files = sorted([p.name for p in LOG_DIR.glob(f"{job_id}-*.log")], reverse=True)
    return {"files": files}

@app.get("/api/logs/{job_id}/{log_name}")
def get_log(job_id: str, log_name: str):
    p = LOG_DIR / log_name
    if not p.exists() or not p.name.startswith(job_id + "-"):
        raise HTTPException(404, "log not found")
    return {"content": p.read_text(encoding="utf-8")}

@app.get("/api/logs/{job_id}/{log_name}/summary")
def get_log_summary(job_id: str, log_name: str):
    p = LOG_DIR / log_name
    if not p.exists() or not p.name.startswith(job_id + "-"):
        raise HTTPException(404, "log not found")
    return build_log_summary(p)

# 静态托管前端（放在最后，避免覆盖 API 路由）
# app.mount("/", StaticFiles(directory=WEB_DIR, html=True), name="web")

# ============ Auth Router (整合登录功能) ============
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    phone: str
    smsCode: str

class SmsRequest(BaseModel):
    phone: str

@auth_router.post("/sms/send")
def send_sms(payload: SmsRequest):
    phone = payload.phone
    ssp_id = "66013" # Default
    
    # Run Node.js crypto script
    script_path = BASE_DIR / "backend/js_utils/encrypt.js"
    try:
        result = subprocess.run(
            ["node", str(script_path), "sm2", phone],
            capture_output=True, text=True, check=True
        )
        encrypted_phone = result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Crypto Error: {e.stderr}")
        raise HTTPException(status_code=500, detail=f"Encryption failed: {e.stderr}")
    
    url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/cmpSmsSend.action"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "Referer": "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html"
    }
    data = {
        "phone": encrypted_phone,
        "sspId": ssp_id
    }
    
    try:
        resp = requests.post(url, data=data, headers=headers, timeout=10)
        return resp.json()
    except Exception as e:
        print(f"SMS Error: {e}")
        raise HTTPException(status_code=502, detail="SMS request failed")

@auth_router.post("/login")
def login(payload: LoginRequest):
    phone = payload.phone
    code = payload.smsCode
    
    script_path = BASE_DIR / "backend/js_utils/encrypt.js"
    try:
        res_phone = subprocess.run(["node", str(script_path), "aes", phone], capture_output=True, text=True, check=True)
        enc_phone = res_phone.stdout.strip()
        
        res_code = subprocess.run(["node", str(script_path), "aes", code], capture_output=True, text=True, check=True)
        enc_code = res_code.stdout.strip()
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Encryption failed: {e.stderr}")
    
    url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/login.action"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "Referer": "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html"
    }
    data = {
        "phone": enc_phone,
        "smsCode": enc_code
    }
    
    try:
        resp = requests.post(url, data=data, headers=headers, timeout=10)
        resp_data = resp.json()
        
        # Parse cookies
        cookies_list = []
        for c in resp.cookies:
            cookies_list.append({
                "name": c.name,
                "value": c.value,
                "domain": c.domain,
                "path": c.path
            })
            
        # Also check response body for cookies if any (the original proxy relayed them)
        return {
            "status": resp_data.get("status"),
            "msg": resp_data.get("msg"),
            "data": resp_data.get("data"),
            "cookies": cookies_list
        }
    except Exception as e:
        print(f"Login Error: {e}")
        raise HTTPException(status_code=502, detail="Login request failed")

@auth_router.post("/manual/token")
def manual_token(payload: Dict[str, str]):
    # This endpoint is kept for compatibility but frontend now handles formatting
    token = payload.get("accessToken")
    return {"cookies": [{"name": "access_token", "value": token}]}

@auth_router.get("/user/profile")
def get_user_profile(request: Request):
    # Extract cookies from header or query
    # In a real scenario, the frontend should pass the cookies it got from login
    # But here we probably expect the frontend to send them in the header 'Cookie'
    # requests.get will need to forward them.
    
    # However, our frontend client stores cookies in text area. 
    # Let's allow passing cookies via query param or header.
    # For simplicity, let's accept 'cookies_text' in a POST or header.
    pass

class CookiePayload(BaseModel):
    cookies_text: str

@auth_router.post("/user/profile")
def user_profile(payload: CookiePayload):
    url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryVipLevel.do"
    headers = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "Referer": "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html",
        "Cookie": payload.cookies_text
    }
    try:
        resp = requests.post(url, headers=headers, timeout=10)
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@auth_router.post("/products/list")
def list_products(payload: CookiePayload):
    url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/normal/normalNewProdList?phase=2"
    headers = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "Referer": "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html",
        "Cookie": payload.cookies_text
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/api/user/family")
def get_user_family(payload: CookiePayload):
    return query_family_members(payload.cookies_text)

def build_cmcc_sync_response(
    refresh: bool,
    updated_within_minutes: int = CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES,
    valid_for_minutes: int = CMCC_TOKEN_SYNC_VALID_FOR_MINUTES,
):
    sync_res = fetch_cmcc_unclaimed_tokens(
        refresh=refresh,
        updated_within_minutes=updated_within_minutes,
        valid_for_minutes=valid_for_minutes,
    )
    users = []
    for item in sync_res.get("tokens") or []:
        phone = str(item.get("phone") or "").strip()
        access_token = str(item.get("accessToken") or "").strip()
        if not phone or not access_token:
            continue
        users.append({
            "phone": phone,
            "province": "",
            "level": "",
            "cookie": build_cmcc_token_cookie(access_token),
            "status": 1,
            "updateTime": int(time.time() * 1000),
            "display_phone": str(item.get("displayPhone") or "").strip(),
            "phone_masked": str(item.get("phoneMasked") or "").strip(),
            "accessTokenCheckedAt": item.get("accessTokenCheckedAt"),
            "accessTokenUpdatedAt": item.get("accessTokenUpdatedAt"),
            "accessTokenExpiresAt": item.get("accessTokenExpiresAt"),
            "xdrReceiveUpdatedAt": item.get("xdrReceiveUpdatedAt"),
            "qqtSignUpdatedAt": item.get("qqtSignUpdatedAt"),
            "isQqtUser": item.get("isQqtUser"),
            "monthlyReceived": item.get("monthlyReceived"),
            "xdrReceived": item.get("xdrReceived"),
        })
    return {
        "ok": True,
        "exported_at": sync_res.get("exported_at"),
        "total": sync_res.get("total", len(users)),
        "skipped": sync_res.get("skipped", 0),
        "skip_reasons": sync_res.get("skip_reasons") or {},
        "users": users,
    }

def fetch_cmcc_wed_recharge_cookies(
    refresh: bool = True,
    query_info: bool = False,
    concurrency: int = 2,
) -> Dict[str, Any]:
    if not CMCC_MANAGER_BASE_URL:
        raise RuntimeError("CMCC_MANAGER_BASE_URL not configured")
    url = f"{CMCC_MANAGER_BASE_URL}/api/accounts/wed-recharge/cookies/export"
    headers = {"Content-Type": "application/json"}
    if CMCC_MANAGER_ADMIN_KEY:
        headers["x-admin-key"] = CMCC_MANAGER_ADMIN_KEY
    payload = {
        "refresh": refresh,
        "queryInfo": query_info,
        "concurrency": max(1, min(3, int(concurrency or 2))),
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=CMCC_WED_RECHARGE_EXPORT_TIMEOUT)
    except Exception as e:
        raise RuntimeError(f"CMCC wed recharge export request failed: {e}") from e
    try:
        body = resp.json()
    except Exception as e:
        raise RuntimeError(f"CMCC wed recharge export invalid response: {e}") from e
    if not resp.ok or not body.get("ok"):
        detail = body.get("message") or body.get("detail") or f"HTTP {resp.status_code}"
        raise RuntimeError(f"CMCC wed recharge export failed: {detail}")
    return body.get("data") or {}

def build_cmcc_wed_recharge_response(
    refresh: bool = True,
    query_info: bool = False,
    concurrency: int = 2,
) -> Dict[str, Any]:
    data = fetch_cmcc_wed_recharge_cookies(
        refresh=refresh,
        query_info=query_info,
        concurrency=concurrency,
    )
    users = []
    for item in data.get("accounts") or []:
        cookie = str(item.get("cookie") or "").strip()
        if not cookie:
            continue
        display_phone = str(item.get("displayPhone") or item.get("phoneMasked") or item.get("phone") or "").strip()
        phone = str(item.get("phone") or item.get("phoneMasked") or display_phone or item.get("accountId") or "").strip()
        users.append({
            "phone": phone,
            "province": "周三话费券",
            "level": "活动CK",
            "cookie": cookie,
            "status": 1,
            "updateTime": int(time.time() * 1000),
            "display_phone": display_phone,
            "phone_masked": str(item.get("phoneMasked") or "").strip(),
            "account_id": str(item.get("accountId") or "").strip(),
            "wedRechargeInfo": item.get("wedRechargeInfo"),
            "wedRechargeUpdatedAt": item.get("wedRechargeUpdatedAt"),
        })
    return {
        "ok": True,
        "exported_at": data.get("exportedAt"),
        "total": data.get("total", len(users)),
        "skipped": data.get("skipped", 0),
        "skip_reasons": data.get("skipReasons") or {},
        "users": users,
    }

@app.get("/api/integrations/cmcc/sync-tokens")
def sync_cmcc_tokens_get(
    refresh: int = 1,
    updated_within_minutes: int = CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES,
    valid_for_minutes: int = CMCC_TOKEN_SYNC_VALID_FOR_MINUTES,
):
    try:
        result = build_cmcc_sync_response(
            refresh=bool(refresh),
            updated_within_minutes=updated_within_minutes,
            valid_for_minutes=valid_for_minutes,
        )
        try:
            send_pushplus(
                title="全球通权益抢购 Token 同步结果",
                content="\n".join([
                    "### 全球通权益抢购 Token 同步结果",
                    f"- 同步有效 Token: {len(result.get('users', []))}",
                    f"- 上游导出总数: {result.get('total', 0)}",
                    f"- 跳过数量: {result.get('skipped', 0)}",
                    f"- 跳过原因: {result.get('skip_reasons', {})}",
                    f"- 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                ]),
            )
        except Exception as e:
            print(f"PushPlus sync notify failed: {e}")
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/api/integrations/cmcc/sync-tokens")
def sync_cmcc_tokens(payload: Optional[Dict[str, Any]] = None):
    refresh = CMCC_TOKEN_SYNC_REFRESH_DEFAULT
    updated_within_minutes = CMCC_TOKEN_SYNC_UPDATED_WITHIN_MINUTES
    valid_for_minutes = CMCC_TOKEN_SYNC_VALID_FOR_MINUTES
    if isinstance(payload, dict) and "refresh" in payload:
        refresh = bool(payload.get("refresh"))
    if isinstance(payload, dict) and "updated_within_minutes" in payload:
        updated_within_minutes = int(payload.get("updated_within_minutes") or updated_within_minutes)
    if isinstance(payload, dict) and "valid_for_minutes" in payload:
        valid_for_minutes = int(payload.get("valid_for_minutes") or valid_for_minutes)
    try:
        result = build_cmcc_sync_response(
            refresh=refresh,
            updated_within_minutes=updated_within_minutes,
            valid_for_minutes=valid_for_minutes,
        )
        try:
            send_pushplus(
                title="全球通权益抢购 Token 同步结果",
                content="\n".join([
                    "### 全球通权益抢购 Token 同步结果",
                    f"- 同步有效 Token: {len(result.get('users', []))}",
                    f"- 上游导出总数: {result.get('total', 0)}",
                    f"- 跳过数量: {result.get('skipped', 0)}",
                    f"- 跳过原因: {result.get('skip_reasons', {})}",
                    f"- 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                ]),
            )
        except Exception as e:
            print(f"PushPlus sync notify failed: {e}")
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/api/integrations/cmcc/wed-recharge/cookies")
def sync_cmcc_wed_recharge_cookies(payload: Optional[Dict[str, Any]] = None):
    refresh = True
    query_info = False
    concurrency = 2
    if isinstance(payload, dict) and "refresh" in payload:
        refresh = bool(payload.get("refresh"))
    if isinstance(payload, dict) and "query_info" in payload:
        query_info = bool(payload.get("query_info"))
    if isinstance(payload, dict) and "queryInfo" in payload:
        query_info = bool(payload.get("queryInfo"))
    if isinstance(payload, dict) and "concurrency" in payload:
        concurrency = int(payload.get("concurrency") or concurrency)
    try:
        return build_cmcc_wed_recharge_response(
            refresh=refresh,
            query_info=query_info,
            concurrency=concurrency,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

app.include_router(auth_router)

# 静态托管前端（放在最后）
app.mount("/", StaticFiles(directory=WEB_DIR, html=True), name="web")
