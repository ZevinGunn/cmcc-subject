#!/usr/bin/env python3
"""北京电信本地登录与青龙任务入口。cron: 17 7 * * *"""
from __future__ import annotations

import argparse
import base64
from contextlib import contextmanager
from dataclasses import dataclass, field
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
from typing import Callable
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

ORIGIN = "https://wapbj.189.cn"
IDENTITY = "/wap2017/re/activity/qryLoginAccno"
PASSWORD = "/wap2017/re/wapFree/cancelAccount/passwordCheck"


class ConfigError(Exception):
    pass


class TaskError(Exception):
    """Only fixed, non-sensitive messages may be used here."""


class TransportError(Exception):
    def __init__(self, category):
        self.category = category
        super().__init__(category)


def transport_category(error):
    message = str(error).lower()
    if 'execution context' in message or 'frame was detached' in message or 'err_aborted' in message:
        return '页面重载'
    if 'timeout' in message or 'timed out' in message:
        return '请求超时'
    if 'closed' in message:
        return '引擎关闭'
    return '网络连接'


@dataclass(frozen=True)
class Account:
    phone: str
    password: str = field(repr=False)
    label: str = ""
    enabled: bool = True

    @property
    def masked(self):
        return self.phone[:3] + "****" + self.phone[-4:]


def parse_accounts(raw: str) -> list[Account]:
    raw = raw.strip()
    if not raw:
        raise ConfigError("请设置 CT189_ACCOUNTS")
    try:
        if raw.startswith("["):
            rows = json.loads(raw)
        else:
            rows = []
            for line in raw.splitlines():
                if not line.strip():
                    continue
                parts = line.strip().split("#")
                if len(parts) not in (2, 3):
                    raise ValueError()
                rows.append(dict(zip(("phone", "password", "label"), parts)))
        if not isinstance(rows, list) or not 1 <= len(rows) <= 200:
            raise ValueError()
        result, known = [], set()
        for index, row in enumerate(rows, 1):
            if not isinstance(row, dict):
                raise ValueError()
            phone, password = row.get("phone"), row.get("password")
            enabled = row.get("enabled", True)
            if not isinstance(phone, str) or not re.fullmatch(r"1[0-9]{10}", phone):
                raise ConfigError(f"第 {index} 行手机号格式错误")
            if not isinstance(password, str) or not re.fullmatch(r"[0-9]{1,32}", password):
                raise ConfigError(f"第 {index} 行服务密码须为 1–32 位数字字符串")
            if type(enabled) is not bool or not isinstance(row.get("label", ""), str):
                raise ConfigError(f"第 {index} 行 enabled 或 label 类型错误")
            if phone in known:
                raise ConfigError(f"第 {index} 行手机号重复，请合并后运行")
            known.add(phone)
            result.append(Account(phone, password, row.get("label", "")[:80], enabled))
        return result
    except (ValueError, TypeError, KeyError):
        raise ConfigError("账号格式错误：使用 JSON 数组或每行 手机号#服务密码#备注") from None


def decode_payload(text):
    for candidate in (text,):
        try:
            return json.loads(candidate)
        except (ValueError, TypeError):
            pass
    try:
        return json.loads(base64.b64decode(text, validate=True).decode("utf-8"))
    except (ValueError, TypeError, UnicodeError):
        return None


def success(response):
    data = response.get("data")
    if not response.get("ok") or not isinstance(data, dict):
        return False
    result, code = data.get("result"), data.get("retCode")
    return (result is not None or code is not None) and (result is None or str(result) == "0") and (code is None or str(code) == "000000")


def encrypt_password(password):
    from Crypto.Cipher import DES3
    from Crypto.Util.Padding import pad
    cipher = DES3.new(b"askgakjgidign399ew3593er", DES3.MODE_CBC, iv=b"2156ghrb")
    return base64.b64encode(cipher.encrypt(pad(password.encode(), 8))).decode()


def authenticate(account: Account, request: Callable, encrypt=encrypt_password):
    """Retry only the anonymous initialization. Never replay a password POST."""
    initial = None
    for attempt in range(2):
        try:
            initial = request(IDENTITY, {}, reinitialize=attempt > 0)
        except Exception:
            if attempt == 0:
                continue
            raise TaskError("会话初始化连接失败") from None
        if success(initial):
            break
        if initial.get("status") not in (0, 400, 408, 412, 502, 503, 504) and isinstance(initial.get("data"), dict):
            break
    if not initial or not success(initial):
        raise TaskError("会话初始化失败，未提交密码")
    number = initial["data"].get("object")
    if number == account.phone:
        return "复用会话，号码核验通过"
    if number:
        raise TaskError("缓存会话号码不匹配，已拒绝使用")
    try:
        login = request(PASSWORD, {"phoneNum": account.phone, "password": encrypt(account.password)})
    except Exception as error:
        category = error.category if isinstance(error, TransportError) else '网络连接'
        raise TaskError(f"密码提交连接失败（{category}），本次不自动重试") from None
    if not success(login):
        raise TaskError("登录失败，请检查服务密码或官网限制")
    try:
        confirmed = request(IDENTITY, {})
    except Exception:
        raise TaskError("登录号码核验连接失败，本次不重新提交密码") from None
    if not success(confirmed) or confirmed["data"].get("object") != account.phone:
        raise TaskError("登录号码核验失败")
    return "登录成功，号码核验通过"


class TelecomClient:
    def __init__(self, browser_type, profile: Path):
        self.profile = profile
        self.profile.mkdir(parents=True, exist_ok=True, mode=0o700)
        binary = browser_type.executable_path
        version = subprocess.check_output([binary, "--version"], timeout=10, stderr=subprocess.DEVNULL).decode()
        match = re.search(r"\b(\d+)\.", version)
        if not match:
            raise TaskError("无法识别 Chromium 版本")
        platform_token = "Macintosh; Intel Mac OS X 10_15_7" if sys.platform == "darwin" else "X11; Linux x86_64"
        ua = f"Mozilla/5.0 ({platform_token}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{match[1]}.0.0.0 Safari/537.36"
        self.context = browser_type.launch_persistent_context(
            str(profile), headless=True, user_agent=ua, viewport={"width": 390, "height": 844},
            args=["--disable-blink-features=AutomationControlled"], ignore_default_args=["--enable-automation"],
        )
        try:
            self.state_file = profile / "session.json"
            if self.state_file.exists():
                cookies = json.loads(self.state_file.read_text(encoding='utf-8'))
                self.context.add_cookies(cookies)
            self.page = self.context.pages[0] if self.context.pages else self.context.new_page()
            self.page.set_default_timeout(30000)
            self.page.set_default_navigation_timeout(30000)
        except Exception:
            self.context.close()
            raise
        self.initialized = False

    def request(self, endpoint, data, reinitialize=False):
        if endpoint not in {IDENTITY, PASSWORD, *ACTIVITY_ENDPOINTS}:
            raise TaskError("任务请求路径未注册")
        if reinitialize or not self.initialized:
            self.page.goto(ORIGIN + "/echnwap/scratchLogon", wait_until="domcontentloaded")
            if not self.page.url.startswith(ORIGIN + "/"):
                raise TaskError("官网跳转异常")
            self.initialized = True
        try:
            response = self.page.evaluate("""({endpoint, data}) => new Promise(resolve => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', endpoint, true); xhr.timeout = 30000; xhr.withCredentials = true;
          xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) resolve({ok: xhr.status >= 200 && xhr.status < 300, status:xhr.status, text:xhr.responseText});
          };
          xhr.onerror = xhr.ontimeout = xhr.onabort = () => resolve({ok:false,status:xhr.status || 0,text:''});
          xhr.send(JSON.stringify(data));
        })""", {"endpoint": endpoint, "data": data})
        except Exception as error:
            self.initialized = False
            raise TransportError(transport_category(error)) from None
        if not response["ok"]:
            self.initialized = False
        return {"ok": response["ok"], "status": response["status"], "data": decode_payload(response["text"])}

    def close(self):
        try:
            cookies = [cookie for cookie in self.context.cookies() if cookie['domain'].lstrip('.') == '189.cn' or cookie['domain'].lstrip('.').endswith('.189.cn')]
            temporary = self.state_file.with_suffix('.tmp')
            temporary.write_text(json.dumps(cookies), encoding='utf-8')
            temporary.chmod(0o600)
            temporary.replace(self.state_file)
        finally:
            self.context.close()
            worker = getattr(self, "worker_playwright", None)
            if worker:
                worker.stop()


ACTIVITY_ENDPOINTS = {
    "/wap2017/re/wapFree/rightsInterestsAct/queryPreactiveInfo": {"activeId": "310", "channelId": "", "staffCode": ""},
    "/wap2017/re/wapFree/rightsInterestsAct/activityCheckV3": {"activeId": "310"},
}

CLASSIC_RIGHTS = {
    "friday_wdmei": {
        "title": "周五狂欢日 · 味多美 10 元兑换券",
        "activity_id": "315",
        "offer_code": "2025091810194425",
        "offer_name": "味多美10元服务兑换券(周五狂欢日专属)",
    },
    "rights_bag_cash": {
        "title": "权益福袋 · 10 元翼支付通用权益金",
        # The live bag activity number can change independently. Discover it
        # from the detail response instead of baking in a stale number.
        "activity_ids": [
            value
            for value in list(dict.fromkeys(
                [os.getenv("CT189_RIGHTS_BAG_ACTIVITY_ID", "")]
                + [str(i) for i in range(300, 331)]
            ))
            if value
        ],
        "offer_code": "202408071136574",
        "offer_name": "10元翼支付通用权益金(福袋)",
    },
}
CLASSIC_ACTIVITY_PAGE = "/wap2017/index_highcvip/highMember_cvip_qy_activity.html"
CLASSIC_ACTIVITY_DETAIL = "/wap2017/re/wapFree/rightsInterests/interestsActivityDetaiList"
CLASSIC_PRECHECK = "/wap2017/re/wapFree/rightsInterests/doCheckRightsInterests"
CLASSIC_CLAIM = "/wap2017/re/wapFree/rightsInterests/doRightsInterests"


def login_task(client, account):
    return "登录会话已就绪"


def activity_task(client, account):
    # Read-only queries. Do not infer qualification or a reward from HTTP 200.
    for endpoint, data in ACTIVITY_ENDPOINTS.items():
        result = client.request(endpoint, data)
        if not success(result):
            raise TaskError("活动资格查询失败")
    return "活动资格查询完成（未领取）"


def classic_success(data):
    return (
        isinstance(data, dict)
        and ("result" in data or "retCode" in data)
        and (data.get("result") is None or str(data.get("result")) == "0")
        and (data.get("retCode") is None or str(data.get("retCode")) == "000000")
    )


def classic_offer(activity, definition):
    if not classic_success(activity):
        return None
    for column in (activity.get("object") or {}).get("columnList") or []:
        for offer in column.get("offerList") or []:
            if str(offer.get("offercode")) == definition["offer_code"]:
                result = dict(offer)
                result["realNumber"] = column.get("realNumber")
                return result
    return None


def classic_detail(client, activity_id):
    client.page.goto(
        f"{ORIGIN}{CLASSIC_ACTIVITY_PAGE}?activityId={activity_id}&level=1",
        wait_until="domcontentloaded",
    )
    client.page.wait_for_function(
        "() => typeof window.rights_interests?.interestsActivityDetaiList === 'function'"
    )
    with client.page.expect_response(
        lambda response: response.url.split("?", 1)[0] == ORIGIN + CLASSIC_ACTIVITY_DETAIL,
        timeout=30000,
    ) as event:
        client.page.evaluate(
            "activityId => window.rights_interests.interestsActivityDetaiList(Number(activityId))",
            activity_id,
        )
    return decode_payload(event.value.text())


def classic_exchange(client, definition, activity_id):
    responses = []

    def on_response(response):
        path = response.url.split("?", 1)[0]
        if path in (ORIGIN + CLASSIC_PRECHECK, ORIGIN + CLASSIC_CLAIM):
            try:
                responses.append((path, decode_payload(response.text())))
            except Exception:
                responses.append((path, None))

    client.page.on("response", on_response)
    try:
        client.page.evaluate(
            "args => window.rights_interests.doCheckRightsInterests(...args)",
            [definition["offer_code"], definition["offer_name"], activity_id, "1", "2"],
        )
        deadline = time.monotonic() + 30
        while time.monotonic() < deadline:
            client.page.wait_for_timeout(100)
            check = next((item[1] for item in responses if item[0].endswith(CLASSIC_PRECHECK)), None)
            if check is not None and check.get("object", {}).get("resultCode") != "0":
                return check, None
            claim = next((item[1] for item in responses if item[0].endswith(CLASSIC_CLAIM)), None)
            if check is not None and claim is not None:
                return check, claim
        raise TaskError("经典权益领取接口响应超时")
    finally:
        client.page.off("response", on_response)


def classic_rights_task(client, account, task_name):
    definition = CLASSIC_RIGHTS[task_name]
    activity_ids = [definition["activity_id"]] if "activity_id" in definition else definition["activity_ids"]
    activity = None
    offer = None
    activity_id = None
    for candidate in activity_ids:
        activity = classic_detail(client, candidate)
        offer = classic_offer(activity, definition)
        if offer:
            activity_id = candidate
            break
    if not classic_success(activity):
        raise TaskError((activity or {}).get("retMsg", "活动资格查询失败"))
    obj = activity.get("object") or {}
    if obj.get("handle") == "2" or obj.get("receive") not in (None, "0", 0):
        raise TaskError("当前号码暂不具备该活动资格")
    if not offer:
        raise TaskError("活动未提供默认权益")
    if obj.get("handle") == "3" or str(offer.get("realNumber")) == "0":
        raise TaskError("本周期已达到领取上限或权益已领取")
    if offer.get("receiveMark") != "P":
        raise TaskError("默认权益当前不可领取，可能已领取或库存不足")
    check, claim = classic_exchange(client, definition, activity_id)
    if not check or check.get("object", {}).get("resultCode") != "0":
        raise TaskError((check or {}).get("object", {}).get("resultMessage", "活动预校验失败"))
    if not claim or claim.get("object", {}).get("resultCode") != "0":
        raise TaskError((claim or {}).get("object", {}).get("resultMessage", "权益领取失败"))
    return "领取请求已提交，请以电信权益列表最终状态为准"


# Future tasks receive an authenticated client and the exact verified account.
# Register only verified official endpoints and add them to the request allowlist.
TASKS = {
    "login": login_task,
    "activity": activity_task,
    "friday_wdmei": lambda client, account: classic_rights_task(client, account, "friday_wdmei"),
    "rights_bag_cash": lambda client, account: classic_rights_task(client, account, "rights_bag_cash"),
}


def parse_tasks(raw):
    names = list(dict.fromkeys(name.strip() for name in raw.split(",") if name.strip()))
    if not names or any(name not in TASKS for name in names):
        raise ConfigError("未知任务；支持 login、activity、friday_wdmei、rights_bag_cash")
    return names


@contextmanager
def run_lock(cache: Path):
    import fcntl
    cache.mkdir(parents=True, exist_ok=True, mode=0o700)
    cache.chmod(0o700)
    with (cache / ".run.lock").open("a") as handle:
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ConfigError("已有任务使用此缓存目录，本次不重复运行") from None
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


def run_accounts(accounts, names, cache, factory, delay=2, emit=print, concurrency=1):
    if not isinstance(concurrency, int) or not 1 <= concurrency <= 8:
        raise ConfigError("并发数必须是 1–8 的整数")
    counts = {"success": 0, "failed": 0, "skipped": 0}
    output_lock = threading.Lock()
    def increment(key):
        with output_lock:
            counts[key] += 1
    def log(message):
        with output_lock:
            emit(message)
    def run_one(index, account):
        if not account.enabled:
            increment("skipped")
            log(f"[{account.masked}] 已停用，跳过")
            return
        profile = cache / hashlib.sha256(account.phone.encode()).hexdigest()[:24]
        client, authenticated, failed = None, False, False
        try:
            client = factory(profile)
            message = authenticate(account, client.request)
            authenticated = True
            log(f"[{account.masked}] {message}")
            for name in names:
                try:
                    message = TASKS[name](client, account)
                    log(f"[{account.masked}] {name}: {message}")
                except TaskError as error:
                    failed = True
                    log(f"[{account.masked}] {name}: {error}")
                except Exception:
                    failed = True
                    log(f"[{account.masked}] {name}: 任务连接失败")
        except TaskError as error:
            failed = True
            log(f"[{account.masked}] {error}")
        except Exception:
            failed = True
            log(f"[{account.masked}] 本地引擎或网络异常；请检查 Chromium 安装和网络")
        finally:
            closed = client is None
            if client:
                try:
                    client.close()
                    closed = True
                except Exception:
                    failed = True
                    log(f"[{account.masked}] 引擎关闭失败，请检查残留进程")
            if not authenticated and closed:
                shutil.rmtree(profile, ignore_errors=True)
        increment("failed" if failed else "success")
        if index < len(accounts) - 1 and delay:
            time.sleep(delay)
    if concurrency == 1:
        for index, account in enumerate(accounts):
            run_one(index, account)
    else:
        with ThreadPoolExecutor(max_workers=concurrency, thread_name_prefix="ct189") as pool:
            futures = [pool.submit(run_one, index, account) for index, account in enumerate(accounts)]
            for future in as_completed(futures):
                future.result()
    log(f"执行完成：成功 {counts['success']}，失败 {counts['failed']}，跳过 {counts['skipped']}")
    return counts


def main(argv=None):
    parser = argparse.ArgumentParser(description="北京电信青龙批量登录与任务入口")
    parser.add_argument("--tasks", default=os.getenv("CT189_TASKS", "login"), help="login,activity；默认 login")
    parser.add_argument("--cache-dir", default=os.getenv("CT189_CACHE_DIR", str(Path(__file__).resolve().parent / ".ct189-cache")))
    parser.add_argument("--interval", type=float, default=2, help="账号间隔秒数，0–60，默认 2")
    parser.add_argument("--concurrency", type=int, default=int(os.getenv("CT189_CONCURRENCY", "1")), help="账号并发数，1–8，默认 1")
    parser.add_argument("--validate", action="store_true", help="仅验证变量格式，不联网")
    parser.add_argument("--list-tasks", action="store_true")
    args = parser.parse_args(argv)
    os.umask(0o077)
    try:
        if args.list_tasks:
            print("login: 登录并核验号码\nactivity: 查询活动 310 资格（只读）\nfriday_wdmei: 领取味多美 10 元兑换券\nrights_bag_cash: 领取 10 元翼支付通用权益金")
            return 0
        accounts = parse_accounts(os.getenv("CT189_ACCOUNTS", ""))
        names = parse_tasks(args.tasks)
        if not 0 <= args.interval <= 60:
            raise ConfigError("账号间隔必须为 0–60 秒")
        if not 1 <= args.concurrency <= 8:
            raise ConfigError("并发数必须是 1–8 的整数")
        if args.validate:
            print(f"配置通过：{len(accounts)} 个账号，{sum(a.enabled for a in accounts)} 个启用；任务 {','.join(names)}")
            return 0
        try:
            from playwright.sync_api import sync_playwright
            from Crypto.Cipher import DES3  # Verify encryption dependency before any network request.
        except ImportError:
            raise ConfigError("缺少依赖：pip3 install -r requirements.txt，并安装 Playwright Chromium") from None
        cache = Path(args.cache_dir).expanduser().resolve()
        def factory(profile):
            # Playwright 的同步 API 不跨线程共享；每个 worker 自己创建运行时。
            worker_playwright = sync_playwright().start()
            try:
                client = TelecomClient(worker_playwright.chromium, profile)
                client.worker_playwright = worker_playwright
                return client
            except Exception:
                worker_playwright.stop()
                raise
        with run_lock(cache):
            counts = run_accounts(accounts, names, cache, factory, args.interval, concurrency=args.concurrency)
        return 1 if counts["failed"] else 0
    except ConfigError as error:
        print(f"配置错误：{error}", file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        print("任务已中断，不自动重试", file=sys.stderr)
        return 130
    except Exception:
        print("运行失败：请检查依赖、Chromium 和缓存目录权限", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
