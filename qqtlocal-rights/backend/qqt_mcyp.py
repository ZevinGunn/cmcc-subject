# -*- coding: utf-8 -*-
import time
import random
import requests
import asyncio
import aiohttp
import math
from typing import Dict, Any, List, Callable, Optional
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Coroutine

BRAND = "名创优品"
REFERER_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html"
XINGDONG_REFERER_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdractivity.html?sspId=75442"
INFO_URL = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryVipLevel.do"
CLAIM_URL = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/normal/initNormalNewQy?mcyp"
XINGDONG_BRAND = "星动日"
DAILY_XINGDONG_BRAND = "天天星动日"
XINGDONG_CLAIM_URL = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/initQyStatus.do"
XINGDONG_DAYS = {26, 27, 28}
WED_RECHARGE_BRAND = "周三话费券"
WED_RECHARGE_URL = "https://wx.10086.cn/hlwyxhdhub/api/wedrecharge/drawPrize"
WED_RECHARGE_REFERER = "https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716"
WED_RECHARGE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/wkwebview leadeon/12.0.9/CMCCIT"
WED_RECHARGE_FINISH_CODES = {"0", "160003"}
WED_RECHARGE_RETRY_CODES = {"160001", "160005"}

BASE_HEADERS = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "Origin": "https://qqt.cmicrwx.cn",
    "Referer": REFERER_PAGE,
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
}

def now() -> str:
    t = time.time()
    local_t = time.localtime(t)
    return time.strftime("%Y-%m-%d %H:%M:%S", local_t) + f".{int((t % 1) * 1000):03d}"

class RttStats:
    def __init__(self) -> None:
        self._values: List[float] = []
        self._lock = threading.Lock()

    def add(self, ms: float) -> None:
        if ms is None:
            return
        with self._lock:
            self._values.append(ms)

    def summary(self) -> Optional[Dict[str, float]]:
        with self._lock:
            values = list(self._values)
        if not values:
            return None
        values.sort()
        count = len(values)
        total = sum(values)
        avg = total / count
        min_v = values[0]
        max_v = values[-1]
        idx = int(math.ceil(0.95 * count) - 1)
        if idx < 0:
            idx = 0
        p95 = values[idx]
        return {
            "count": float(count),
            "avg": avg,
            "min": min_v,
            "max": max_v,
            "p95": p95,
        }

def get_referer_page(activity_type: str = "normal") -> str:
    return XINGDONG_REFERER_PAGE if activity_type == "xingdong" else REFERER_PAGE

def preheat(session: requests.Session, activity_type: str = "normal") -> None:
    try:
        session.get(get_referer_page(activity_type), timeout=10)
    except requests.RequestException:
        pass

async def preheat_async(session: aiohttp.ClientSession, activity_type: str = "normal") -> None:
    try:
        async with session.get(get_referer_page(activity_type), timeout=10) as resp:
            pass
    except Exception:
        pass

def query_user_info(session: requests.Session, activity_type: str = "normal") -> Dict[str, Any]:
    try:
        ssp_id = "75442" if activity_type == "xingdong" else ""
        resp = session.post(INFO_URL, data={"sspId": ssp_id, "tag": "qqtindex"}, timeout=10)
    except requests.RequestException as e:
        return {"error": f"Network error: {e}"}
    try:
        return resp.json()
    except ValueError:
        return {"error": "Non-JSON response"}

async def query_user_info_async(session: aiohttp.ClientSession, activity_type: str = "normal") -> Dict[str, Any]:
    try:
        ssp_id = "75442" if activity_type == "xingdong" else ""
        async with session.post(INFO_URL, data={"sspId": ssp_id, "tag": "qqtindex"}, timeout=10) as resp:
            try:
                return await resp.json()
            except Exception:
                return {"error": "Non-JSON response"}
    except Exception as e:
        return {"error": f"Network error: {e}"}

def query_family_members(cookie: str) -> Dict[str, Any]:
    session = requests.Session()
    session.headers.update(BASE_HEADERS)
    session.headers["Cookie"] = cookie
    preheat(session)
    url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/paidpurchase/familyCircle.action"
    try:
        resp = session.post(url, timeout=10)
        return resp.json()
    except Exception as e:
        return {"error": f"Network error: {e}"}

def get_activity_brand(activity_type: str = "normal") -> str:
    if activity_type == "xingdong":
        return XINGDONG_BRAND
    if activity_type == "daily_xingdong":
        return DAILY_XINGDONG_BRAND
    if activity_type == "wed_recharge":
        return WED_RECHARGE_BRAND
    return BRAND

def wed_recharge_retry_interval(code: str) -> float:
    if code == "160001":
        return 0.08
    if code == "160005":
        return 0.25
    return 0.3

def wed_recharge_cookie_valid(cookie: str) -> bool:
    text = str(cookie or "").strip()
    return bool(text) and "HLWHD_SESSION_TOKEN=" in text

def wed_recharge_prize_summary(data: Any) -> str:
    if not isinstance(data, dict):
        return ""
    prizes = data.get("actPrizes") or []
    if not isinstance(prizes, list):
        return ""
    parts = []
    for prize in prizes:
        if not isinstance(prize, dict):
            continue
        name = prize.get("prizeName") or prize.get("shortName") or "未知奖品"
        coupon_code = prize.get("couponCode") or ""
        parts.append(f"{name}/券码:{coupon_code}" if coupon_code else str(name))
    return "；".join(parts)

def wed_recharge_draw_once(session: requests.Session, account: Dict[str, str], idx: int) -> Dict[str, Any]:
    send_time = now()
    start = time.perf_counter()
    try:
        resp = session.post(WED_RECHARGE_URL, json={}, timeout=5)
        recv_time = now()
        rtt_ms = (time.perf_counter() - start) * 1000.0
        text = resp.text
        try:
            payload = resp.json()
        except Exception:
            payload = {}
        code = str(payload.get("code", resp.status_code)) if isinstance(payload, dict) else str(resp.status_code)
        msg = str(payload.get("msg", text[:120])) if isinstance(payload, dict) else text[:120]
        return {
            "account": account.get("display_phone") or account.get("phone") or f"#{idx}",
            "code": code,
            "msg": msg,
            "data": payload.get("data") if isinstance(payload, dict) else None,
            "raw": payload if isinstance(payload, dict) else text,
            "http_status": resp.status_code,
            "send_time": send_time,
            "recv_time": recv_time,
            "rtt_ms": rtt_ms,
        }
    except Exception as e:
        recv_time = now()
        return {
            "account": account.get("display_phone") or account.get("phone") or f"#{idx}",
            "code": "exception",
            "msg": str(e),
            "data": None,
            "raw": None,
            "http_status": 0,
            "send_time": send_time,
            "recv_time": recv_time,
            "rtt_ms": (time.perf_counter() - start) * 1000.0,
        }

def run_wed_recharge_serial(accounts: List[Dict[str, str]],
                            per_account_delay_ms: int = 300,
                            max_account_seconds: float = 18.0,
                            log: Callable[[str], None] = print) -> None:
    brand = get_activity_brand("wed_recharge")
    if not accounts:
        log(f"[{now()}] [{brand}] 无账号可执行。")
        return
    log(f"[{now()}] [{brand}] 严格串行开始：账号数 {len(accounts)}，账号间隔 {per_account_delay_ms}ms。")
    stats = RttStats()
    success = participated = invalid = failed = 0
    for idx, account in enumerate(accounts, start=1):
        label = account.get("display_phone") or account.get("phone") or f"#{idx}"
        cookie = str(account.get("cookie") or "").strip()
        if not wed_recharge_cookie_valid(cookie):
            invalid += 1
            log(f"[{now()}] [{brand}] 账号 {label} 跳过 => 缺少 HLWHD_SESSION_TOKEN，请先完成周三活动会话置换。")
            continue
        session = requests.Session()
        session.headers.update({
            "Host": "wx.10086.cn",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://wx.10086.cn",
            "Sec-Fetch-Site": "same-origin",
            "login-check": "1",
            "Sec-Fetch-Mode": "cors",
            "User-Agent": WED_RECHARGE_UA,
            "Referer": WED_RECHARGE_REFERER,
            "Sec-Fetch-Dest": "empty",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Priority": "u=3, i",
            "Connection": "keep-alive",
            "Cookie": cookie,
        })
        deadline = time.monotonic() + max_account_seconds
        attempt = 0
        final_code = "timeout"
        failed_counted = False
        try:
            while time.monotonic() <= deadline:
                attempt += 1
                res = wed_recharge_draw_once(session, account, idx)
                stats.add(res.get("rtt_ms"))
                code = res.get("code", "")
                final_code = code
                rtt_text = f"{res.get('rtt_ms', 0):.1f}ms"
                detail = ""
                if code not in WED_RECHARGE_RETRY_CODES:
                    detail = f" raw={res.get('raw')}"
                log(
                    f"[{now()}] [{brand}] 账号 {label} 第{attempt}次 请求发送 {res.get('send_time')} "
                    f"返回 {res.get('recv_time')} RTT {rtt_text} HTTP {res.get('http_status')} "
                    f"领取结果 => {code} {res.get('msg', '')}{detail}"
                )
                if code in WED_RECHARGE_FINISH_CODES:
                    if code == "0":
                        success += 1
                        prize = wed_recharge_prize_summary(res.get("data"))
                        if prize:
                            log(f"[{now()}] [{brand}] 账号 {label} 抢购成功 => {prize}")
                    else:
                        participated += 1
                    break
                if code not in WED_RECHARGE_RETRY_CODES:
                    failed += 1
                    failed_counted = True
                    log(f"[{now()}] [{brand}] 账号 {label} 非可重试状态，停止该账号。")
                    break
                time.sleep(wed_recharge_retry_interval(code))
            else:
                failed += 1
                failed_counted = True
                log(f"[{now()}] [{brand}] 账号 {label} 超过 {max_account_seconds:.0f}s 未完成，停止该账号。")
        finally:
            session.close()
        if not failed_counted and final_code not in WED_RECHARGE_FINISH_CODES and final_code != "timeout":
            failed += 1
        if idx < len(accounts):
            time.sleep(max(0, per_account_delay_ms) / 1000.0)
    summary = stats.summary()
    if summary:
        log(
            f"[{now()}] [{brand}] RTT统计: count={int(summary['count'])} "
            f"avg={summary['avg']:.1f}ms min={summary['min']:.1f}ms "
            f"max={summary['max']:.1f}ms p95={summary['p95']:.1f}ms"
        )
    log(f"[{now()}] [{brand}] 串行完成：成功 {success}，已参与 {participated}，CK异常 {invalid}，失败 {failed}。")

def is_xingdong_day() -> bool:
    return time.localtime().tm_mday in XINGDONG_DAYS

def access_token_cookie(cookie: str) -> str:
    text = str(cookie or "").strip()
    if not text:
        return ""
    for part in text.split(";"):
        item = part.strip()
        if item.startswith("access_token="):
            return item
    if "=" not in text:
        return f"access_token={text}"
    return text

def parse_net_age(info: Dict[str, Any]) -> Optional[int]:
    if not isinstance(info, dict):
        return None
    data = info.get("data") or {}
    try:
        return int(data.get("netAge"))
    except Exception:
        return None

def xingdong_skip_reason(net_age: Optional[int], slot: str) -> str:
    if slot == "early":
        if net_age is None:
            return "网龄未知，不能参加 09:30 提前场"
        if net_age < 15:
            return f"网龄 {net_age} 年，未满 15 年，跳过 09:30 提前场"
    if slot == "normal" and net_age is not None and net_age >= 15:
        return f"网龄 {net_age} 年，已归入 09:30 提前场，跳过 10:00 普通场"
    return ""

def product_id_value(product_id: str, activity_type: str = "normal") -> Any:
    text = str(product_id or "").strip()
    if activity_type == "xingdong":
        try:
            return int(text)
        except Exception:
            return text
    return text

def resolve_xingdong_runtime(
    activity_type: str,
    product_id: str,
    xingdong_product_id: str = "",
    daily_xingdong_product_id: str = "",
) -> Dict[str, str]:
    if activity_type != "xingdong":
        return {
            "activity_type": activity_type,
            "product_id": str(product_id or "").strip(),
            "variant": "normal",
        }
    if is_xingdong_day():
        return {
            "activity_type": "xingdong",
            "product_id": str(xingdong_product_id or product_id or "").strip(),
            "variant": "xingdong",
        }
    return {
        "activity_type": "daily_xingdong",
        "product_id": str(daily_xingdong_product_id or product_id or "").strip(),
        "variant": "daily_xingdong",
    }

def build_claim_payload(
    receive_phone: str,
    channel_code: str,
    is_random: str,
    source: str,
    product_id: str,
    activity_type: str = "normal",
) -> Dict[str, Any]:
    if activity_type == "xingdong":
        return {
            "productId": product_id_value(product_id, activity_type),
            "receivePhone": receive_phone or "",
            "channelCode": channel_code or "75442",
            "mailCheck": "1",
            "ischeck": "1",
            "sourece": source or "1",
        }
    return {
        "productId": str(product_id),
        "receivePhone": receive_phone or "",
        "channelCode": channel_code or "",
        "isRandom": is_random or "0",
        "sourece": source or "1",
    }

def get_claim_url(activity_type: str = "normal") -> str:
    return XINGDONG_CLAIM_URL if activity_type == "xingdong" else CLAIM_URL

def claim_with_cookie(session: requests.Session, receive_phone: str, channel_code: str, is_random: str, source: str, product_id: str, activity_type: str = "normal") -> Dict[str, Any]:
    data = build_claim_payload(receive_phone, channel_code, is_random, source, product_id, activity_type)
    send_time = now()
    start = time.perf_counter()
    try:
        resp = session.post(get_claim_url(activity_type), data=data, timeout=15)
    except requests.RequestException as e:
        rtt_ms = (time.perf_counter() - start) * 1000.0
        return {
            "status_code": 0,
            "msg": f"Network error: {e}",
            "send_time": send_time,
            "recv_time": now(),
            "rtt_ms": rtt_ms,
        }
    rtt_ms = (time.perf_counter() - start) * 1000.0
    recv_time = now()
    try:
        j = resp.json()
    except ValueError:
        return {
            "status_code": resp.status_code,
            "msg": resp.text,
            "send_time": send_time,
            "recv_time": recv_time,
            "rtt_ms": rtt_ms,
        }
    status = j.get("status") or j.get("code") or resp.status_code
    msg = j.get("msg") or j.get("message") or ""
    return {
        "status_code": status,
        "msg": msg,
        "send_time": send_time,
        "recv_time": recv_time,
        "rtt_ms": rtt_ms,
    }

def build_session(cookie: str, activity_type: str = "normal") -> requests.Session:
    session = requests.Session()
    session.headers.update(BASE_HEADERS)
    session.headers["Referer"] = get_referer_page(activity_type)
    session.headers["Cookie"] = access_token_cookie(cookie) if activity_type == "xingdong" else cookie
    if activity_type == "xingdong":
        session.headers["Cache-Control"] = "no-cache"
        session.headers["Pragma"] = "no-cache"
    preheat(session, activity_type)
    return session

async def claim_with_cookie_async(session: aiohttp.ClientSession, receive_phone: str, channel_code: str, is_random: str, source: str, product_id: str, activity_type: str = "normal") -> Dict[str, Any]:
    data = build_claim_payload(receive_phone, channel_code, is_random, source, product_id, activity_type)
    try:
        send_time = now()
        start = time.perf_counter()
        async with session.post(get_claim_url(activity_type), data=data, timeout=15) as resp:
            rtt_ms = (time.perf_counter() - start) * 1000.0
            recv_time = now()
            try:
                j = await resp.json()
            except Exception:
                text = await resp.text()
                return {
                    "status_code": resp.status,
                    "msg": text,
                    "send_time": send_time,
                    "recv_time": recv_time,
                    "rtt_ms": rtt_ms,
                }
            status = j.get("status") or j.get("code") or resp.status
            msg = j.get("msg") or j.get("message") or ""
            return {
                "status_code": status,
                "msg": msg,
                "send_time": send_time,
                "recv_time": recv_time,
                "rtt_ms": rtt_ms,
            }
    except Exception as e:
        rtt_ms = (time.perf_counter() - start) * 1000.0
        return {
            "status_code": 0,
            "msg": f"Network error: {e}",
            "send_time": send_time,
            "recv_time": now(),
            "rtt_ms": rtt_ms,
        }

def _process_one(idx: int,
                 session: requests.Session,
                 jitter_ms: int,
                 receive_phone: str,
                 channel_code: str,
                 is_random: str,
                 source: str,
                 product_id: str,
                 activity_type: str,
                 xingdong_slot: str,
                 rtt_stats: Optional[RttStats],
                 log: Callable[[str], None]) -> None:
    if jitter_ms and jitter_ms > 0:
        time.sleep(random.uniform(0, jitter_ms/1000.0))

    info = query_user_info(session, activity_type)
    phone = province = level = "-"
    if isinstance(info, dict):
        data = info.get("data") or {}
        phone = data.get("phone", "-")
        province = data.get("province", "-")
        level = data.get("levelName", "-")
    brand = get_activity_brand(activity_type)
    net_age = parse_net_age(info)
    if activity_type == "xingdong":
        reason = xingdong_skip_reason(net_age, xingdong_slot)
        if reason:
            log(f"[{now()}] [{brand}] 账号 {phone} {province} {level} 跳过 => {reason}")
            return

    res = claim_with_cookie(session, receive_phone, channel_code, is_random, source, product_id, activity_type)
    status = res.get("status_code")
    msg = res.get("msg", "")
    send_time = res.get("send_time", "-")
    recv_time = res.get("recv_time", "-")
    rtt_ms = res.get("rtt_ms")
    if rtt_stats and rtt_ms is not None:
        rtt_stats.add(rtt_ms)
    rtt_text = f"{rtt_ms:.1f}ms" if rtt_ms is not None else "-"

    # log(f"[{now()}] [{BRAND}] 账号#{idx} 用户信息 => {phone} {province} {level}")
    # log(f"[{now()}] [{BRAND}] 账号#{idx} 领取结果 => {status} {msg}")
    
    # 优化日志格式：一行展示所有关键信息
    net_age_text = f" 网龄 {net_age}" if activity_type == "xingdong" and net_age is not None else ""
    log(f"[{now()}] [{brand}] 账号 {phone} {province}{net_age_text} 请求发送 {send_time} 返回 {recv_time} RTT {rtt_text} 领取结果 => {status} {msg}")

async def _process_one_async(idx: int,
                             ck: str,
                             jitter_ms: int,
                             stagger_ms: int,
                             receive_phone: str,
                             channel_code: str,
                             is_random: str,
                             source: str,
                             product_id: str,
                             activity_type: str,
                             xingdong_slot: str,
                             rtt_stats: Optional[RttStats],
                             log: Callable[[str], None]) -> None:
    if stagger_ms and stagger_ms > 0:
        await asyncio.sleep(((idx - 1) * stagger_ms) / 1000.0)
    if jitter_ms and jitter_ms > 0:
        await asyncio.sleep(random.uniform(0, jitter_ms/1000.0))

    headers = BASE_HEADERS.copy()
    headers["Referer"] = get_referer_page(activity_type)
    headers["Cookie"] = access_token_cookie(ck) if activity_type == "xingdong" else ck
    if activity_type == "xingdong":
        headers["Cache-Control"] = "no-cache"
        headers["Pragma"] = "no-cache"

    async with aiohttp.ClientSession(headers=headers) as session:
        await preheat_async(session, activity_type)
        info = await query_user_info_async(session, activity_type)
        phone = province = level = "-"
        if isinstance(info, dict):
            data = info.get("data") or {}
            phone = data.get("phone", "-")
            province = data.get("province", "-")
            level = data.get("levelName", "-")
        brand = get_activity_brand(activity_type)
        net_age = parse_net_age(info)
        if activity_type == "xingdong":
            reason = xingdong_skip_reason(net_age, xingdong_slot)
            if reason:
                log(f"[{now()}] [{brand}] 账号 {phone} {province} {level} 跳过 => {reason}")
                return

        res = await claim_with_cookie_async(session, receive_phone, channel_code, is_random, source, product_id, activity_type)
        status = res.get("status_code")
        msg = res.get("msg", "")
        send_time = res.get("send_time", "-")
        recv_time = res.get("recv_time", "-")
        rtt_ms = res.get("rtt_ms")
        if rtt_stats and rtt_ms is not None:
            rtt_stats.add(rtt_ms)
        rtt_text = f"{rtt_ms:.1f}ms" if rtt_ms is not None else "-"

        # log(f"[{now()}] [{BRAND}] 账号#{idx} 用户信息 => {phone} {province} {level}")
        # log(f"[{now()}] [{BRAND}] 账号#{idx} 领取结果 => {status} {msg}")
        
        # 优化日志格式：一行展示所有关键信息
        net_age_text = f" 网龄 {net_age}" if activity_type == "xingdong" and net_age is not None else ""
        log(f"[{now()}] [{brand}] 账号 {phone} {province}{net_age_text} 请求发送 {send_time} 返回 {recv_time} RTT {rtt_text} 领取结果 => {status} {msg}")

def run_once(accounts: List[Dict[str, str]],
             run_mode: str = "concurrent",
             max_workers: int = 0,
             jitter_ms: int = 0,
             is_random: str = "0",
             source: str = "1",
             global_receive_phone: str = "", # Renamed from receive_phone
             channel_code: str = "",
             product_id: str = "3566",
             activity_type: str = "normal",
             xingdong_slot: str = "all",
             xingdong_product_id: str = "",
             daily_xingdong_product_id: str = "",
             rtt_stats: Optional[RttStats] = None,
             per_account_delay_ms: int = 0,
             log: Callable[[str], None] = print) -> bool:
    """
    accounts: List of dict, e.g. [{"cookie": "...", "receive_phone": "..."}]
    If account has receive_phone, use it; else use global_receive_phone.
    """
    runtime = resolve_xingdong_runtime(activity_type, product_id, xingdong_product_id, daily_xingdong_product_id)
    activity_type = runtime["activity_type"]
    product_id = runtime["product_id"]
    if not accounts:
        log(f"[{now()}] [{get_activity_brand(activity_type)}] 无账号可执行。")
        return True

    any_fail = False
    workers = max_workers if (max_workers and max_workers > 0) else len(accounts)

    sessions: Dict[str, requests.Session] = {}

    def _get_session(ck: str) -> requests.Session:
        sess = sessions.get(ck)
        if sess is None:
            sess = build_session(ck, activity_type)
            sessions[ck] = sess
        return sess

    # 封装单个处理逻辑，方便复用
    def _do_process(idx, acc):
        ck = acc.get("cookie")
        # 优先使用账号维度的转赠号码
        rp = acc.get("receive_phone") or global_receive_phone
        session = _get_session(ck)
        return _process_one(idx, session, jitter_ms, rp, channel_code, is_random, source, product_id, activity_type, xingdong_slot, rtt_stats, log)

    async def _do_process_async(idx, acc):
        ck = acc.get("cookie")
        rp = acc.get("receive_phone") or global_receive_phone
        stagger_ms = per_account_delay_ms if run_mode == "concurrent" else 0
        return await _process_one_async(idx, ck, jitter_ms, stagger_ms, rp, channel_code, is_random, source, product_id, activity_type, xingdong_slot, rtt_stats, log)

    def _close_sessions():
        for sess in sessions.values():
            try:
                sess.close()
            except Exception:
                pass

    if run_mode == "concurrent":
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            tasks = []
            for idx, acc in enumerate(accounts, start=1):
                tasks.append(_do_process_async(idx, acc))
            
            loop.run_until_complete(asyncio.gather(*tasks))
            loop.close()
            _close_sessions()
            return False
        except Exception as e:
            log(f"[{now()}] [{get_activity_brand(activity_type)}] 异步执行异常，降级为多线程: {e}")
            pass

    if run_mode == "sequential" or workers <= 1:
        delay_sec = (per_account_delay_ms or 0) / 1000.0
        for idx, acc in enumerate(accounts, start=1):
            try:
                _do_process(idx, acc)
            except Exception as e:
                log(f"[{now()}] [{get_activity_brand(activity_type)}] 账号#{idx} 执行异常 => {e}")
                any_fail = True
            if delay_sec > 0:
                if idx < len(accounts):
                    time.sleep(delay_sec)
            else:
                time.sleep(0.2)
    else:
        with ThreadPoolExecutor(max_workers=workers) as ex:
            futures = {
                ex.submit(_do_process, idx, acc): idx
                for idx, acc in enumerate(accounts, start=1)
            }
            for fut in as_completed(futures):
                try:
                    fut.result()
                except Exception as e:
                    i = futures.get(fut, "?")
                    log(f"[{now()}] [{get_activity_brand(activity_type)}] 账号#{i} 执行异常 => {e}")
                    any_fail = True
    _close_sessions()
    return any_fail

def run_poll(accounts: List[Dict[str, str]], # Changed from cookies: List[str]
             poll_times: int = 10,
             poll_interval_ms: int = 0,
             start_delay_ms: int = 0,
             **kwargs) -> None:
    """
    accounts: List[Dict] with 'cookie' and optional 'receive_phone'
    """
    raw_log = kwargs.get("log", print)
    is_test_run = bool(kwargs.pop("is_test_run", False))
    def log(msg: str) -> None:
        if is_test_run:
            raw_log(f"[测试模式] {msg}")
        else:
            raw_log(msg)

    if kwargs.get("activity_type") == "wed_recharge":
        if start_delay_ms > 0:
            log(f"[{now()}] [{get_activity_brand('wed_recharge')}] 等待 {start_delay_ms}ms 后启动...")
            time.sleep(start_delay_ms / 1000.0)
        run_wed_recharge_serial(
            accounts,
            per_account_delay_ms=int(kwargs.get("per_account_delay_ms", 300) or 300),
            log=log,
        )
        return
    
    if start_delay_ms > 0:
        log(f"[{now()}] [{get_activity_brand(kwargs.get('activity_type', 'normal'))}] 等待 {start_delay_ms}ms 后启动...")
        time.sleep(start_delay_ms / 1000.0)

    configured_activity_type = kwargs.get("activity_type", "normal")
    runtime = resolve_xingdong_runtime(
        configured_activity_type,
        str(kwargs.get("product_id", "") or ""),
        str(kwargs.get("xingdong_product_id", "") or ""),
        str(kwargs.get("daily_xingdong_product_id", "") or ""),
    )
    activity_type = runtime["activity_type"]
    kwargs["activity_type"] = activity_type
    kwargs["product_id"] = runtime["product_id"]
    brand = get_activity_brand(activity_type)
    xingdong_slot = kwargs.get("xingdong_slot", "all")
    if configured_activity_type == "xingdong":
        if not str(kwargs.get("product_id", "")).strip().isdigit():
            log(f"[{now()}] [{brand}] productId 必须是数字，当前值：{kwargs.get('product_id', '')}")
            return
        debug_payload = build_claim_payload(
            receive_phone="",
            channel_code=str(kwargs.get("channel_code", "") or ""),
            is_random=str(kwargs.get("is_random", "0") or "0"),
            source=str(kwargs.get("source", "1") or "1"),
            product_id=str(kwargs.get("product_id", "") or ""),
            activity_type=activity_type,
        )
        mode_text = "星动日" if activity_type == "xingdong" else "天天星动日"
        log(f"[{now()}] [{brand}] 自动模式：{mode_text}，批次：{xingdong_slot}，权益ID：{kwargs.get('product_id', '')}")
        log(f"[{now()}] [{brand}] 请求配置：url={get_claim_url(activity_type)} referer={get_referer_page(activity_type)} form={debug_payload}")

    log(f"[{now()}] [{brand}] 开始轮询：{poll_times} 次。")
    rtt_stats = RttStats()
    run_kwargs = kwargs.copy()
    run_kwargs["log"] = log
    run_kwargs["rtt_stats"] = rtt_stats
    threads: List[threading.Thread] = []
    per_account_delay_ms = int(run_kwargs.pop("per_account_delay_ms", 0) or 0)
    accounts_per_poll = int(run_kwargs.pop("accounts_per_poll", 0) or 0)
    force_sequential = bool(run_kwargs.pop("force_sequential_run_once", False))

    if per_account_delay_ms > 0:
        log(f"[{now()}] [{brand}] 每轮账号间隔 {per_account_delay_ms}ms，单轮账号数 {accounts_per_poll or len(accounts)}")

    def _select_accounts_for_poll(all_accounts, poll_index):
        if not all_accounts:
            return []
        total = len(all_accounts)
        if not accounts_per_poll or accounts_per_poll <= 0 or accounts_per_poll >= total:
            return all_accounts
        start = ((poll_index - 1) * accounts_per_poll) % total
        chunk = []
        for j in range(accounts_per_poll):
            idx = (start + j) % total
            chunk.append(all_accounts[idx])
        return chunk

    run_kwargs["per_account_delay_ms"] = per_account_delay_ms

    use_threads = not force_sequential
    for i in range(1, poll_times + 1):
        chunk = _select_accounts_for_poll(accounts, i)
        if not chunk:
            continue
        log(f"[{now()}] [{brand}] ===== 轮询 {i}/{poll_times} 发起 (账号 {len(chunk)}) =====")
        if use_threads:
            t = threading.Thread(target=run_once, args=(chunk,), kwargs=run_kwargs)
            t.start()
            threads.append(t)
        else:
            run_once(chunk, **run_kwargs)
        if i < poll_times and poll_interval_ms > 0:
            time.sleep(poll_interval_ms / 1000.0)

    if use_threads:
        for t in threads:
            t.join()

    summary = rtt_stats.summary()
    if summary:
        log(
            f"[{now()}] [{brand}] RTT统计: count={int(summary['count'])} "
            f"avg={summary['avg']:.1f}ms min={summary['min']:.1f}ms "
            f"max={summary['max']:.1f}ms p95={summary['p95']:.1f}ms"
        )
    else:
        log(f"[{now()}] [{brand}] RTT统计: 无数据。")

    log(f"[{now()}] [{brand}] 轮询执行完成。")
