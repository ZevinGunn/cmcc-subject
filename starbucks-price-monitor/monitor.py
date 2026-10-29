#!/usr/bin/env python3
"""星巴克 30 元券回收价监控。Python 3.9+，仅使用标准库。"""
from __future__ import annotations

import argparse
from collections import deque
from contextlib import contextmanager
from dataclasses import dataclass, field, replace
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
import fcntl
import hashlib
import json
import logging
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path
import signal
import threading
import time
import urllib.error
import urllib.request

BASE = Path(__file__).resolve().parent
PRICE_URL = "http://meitianwx.kaquan88.cn/ticket/product/getProductInfo"
PUSH_URL = "https://www.pushplus.plus/send"
BEIJING = timezone(timedelta(hours=8))
LOG = logging.getLogger("starbucks")


class MonitorError(Exception):
    """可安全写入日志的错误；不得包含令牌或服务端原始响应。"""


def now() -> datetime:
    return datetime.now(BEIJING)


def money(value) -> Decimal:
    if isinstance(value, bool):
        raise MonitorError("价格必须是有效的正数")
    try:
        result = Decimal(str(value))
    except InvalidOperation:
        raise MonitorError("价格必须是有效的正数") from None
    if not result.is_finite() or not 0 < result <= 30:
        raise MonitorError("价格必须大于 0 且不超过券面值 30 元")
    return result


@dataclass(frozen=True)
class Config:
    interval_seconds: int = 600
    target_price: Decimal | None = None
    low_price_threshold: Decimal | None = None
    high_price_threshold: Decimal | None = None
    threshold_interval_seconds: int = 300
    high_price_notify_interval_seconds: int = 600
    notify_only_high: bool = False
    alert_count: int = 3
    alert_interval_seconds: int = 10
    daily_send_limit: int = 200
    request_timeout_seconds: int = 15
    query_attempts: int = 3
    error_notify_interval_seconds: int = 3600
    pushplus_env_file: Path = BASE.parent / "qqtlocal-rights" / ".env"
    pushplus_users_file: Path | None = None

    @classmethod
    def read(cls, path: Path) -> Config:
        try:
            values = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            raise MonitorError("无法读取配置，请检查文件路径及 JSON 格式") from None
        if not isinstance(values, dict) or set(values) - set(cls.__dataclass_fields__):
            raise MonitorError("配置包含未知字段或不是 JSON 对象")
        limits = {
            "interval_seconds": (60, 86400),
            "threshold_interval_seconds": (60, 86400),
            "high_price_notify_interval_seconds": (60, 86400),
            "alert_count": (1, 5),
            "alert_interval_seconds": (10, 3600),
            "daily_send_limit": (0, 2000),
            "request_timeout_seconds": (1, 60),
            "query_attempts": (1, 3),
            "error_notify_interval_seconds": (60, 86400),
        }
        for key, (low, high) in limits.items():
            v = values.get(key, getattr(cls(), key))
            if type(v) is not int or not low <= v <= high:
                raise MonitorError(f"{key} 必须为 {low}～{high} 的整数")
        if type(values.get("notify_only_high", False)) is not bool:
            raise MonitorError("notify_only_high 必须为布尔值")
        if values.get("target_price") is not None:
            values["target_price"] = money(values["target_price"])
        for key in ("low_price_threshold", "high_price_threshold"):
            if values.get(key) is not None:
                values[key] = money(values[key])
        low = values.get("low_price_threshold")
        high = values.get("high_price_threshold")
        if low is not None and high is not None and low >= high:
            raise MonitorError("low_price_threshold 必须小于 high_price_threshold")
        for key in ("pushplus_env_file", "pushplus_users_file"):
            if key not in values or (key == "pushplus_users_file" and values[key] is None):
                continue
            value = values[key]
            if not isinstance(value, str) or not value.strip():
                raise MonitorError(f"{key} 必须为有效路径")
            values[key] = (path.parent / Path(value).expanduser()).resolve()
        return cls(**values)


def push_token(config: Config) -> str:
    env = {}
    try:
        for line in config.pushplus_env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.removeprefix("export ").split("=", 1)
                env[key.strip()] = value.strip().strip("\"'")
    except FileNotFoundError:
        pass
    except OSError:
        raise MonitorError("无法读取 pushplus 配置文件") from None
    env.update({k: v for k, v in os.environ.items() if k.startswith("PUSHPLUS_")})
    if env.get("PUSHPLUS_ENABLED", "1").strip().lower() in {"0", "false", "off", "no"}:
        raise MonitorError("PUSHPLUS_ENABLED 已关闭，未发送通知")
    token = env.get("PUSHPLUS_TOKEN", "").strip()
    if not token:
        raise MonitorError("缺少 PUSHPLUS_TOKEN")
    # 此任务只向令牌所属人的微信推送，不继承群组或付费通道。
    return token


@dataclass(frozen=True)
class Recipient:
    name: str
    token: str = field(repr=False)
    is_default: bool = False

    @property
    def key(self) -> str:
        # 状态文件仅保存不可逆指纹；改名不重置额度，日志不记录令牌。
        return hashlib.sha256(self.token.encode("utf-8")).hexdigest()


def load_recipients(config: Config) -> list[Recipient]:
    if config.pushplus_users_file is None:
        return [Recipient("原用户", push_token(config), is_default=True)]
    try:
        data = json.loads(config.pushplus_users_file.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        raise MonitorError("无法读取接收人配置，请检查文件和 JSON 格式；本轮不发送") from None
    if not isinstance(data, list):
        raise MonitorError("接收人配置必须是 JSON 数组")
    recipients = {}
    for index, user in enumerate(data, 1):
        if (not isinstance(user, dict)
                or set(user) - {"name", "enabled", "token", "use_default_token"}):
            raise MonitorError(f"第 {index} 个接收人配置格式错误")
        enabled = user.get("enabled", True)
        if type(enabled) is not bool:
            raise MonitorError(f"第 {index} 个接收人的 enabled 必须为布尔值")
        if not enabled:
            continue
        name = user.get("name", f"用户{index}")
        if not isinstance(name, str) or not name.strip() or len(name) > 50 or not name.isprintable():
            raise MonitorError(f"第 {index} 个接收人名称无效")
        default = user.get("use_default_token", False)
        if type(default) is not bool or (default and "token" in user):
            raise MonitorError(f"第 {index} 个接收人只能选择一种令牌来源")
        if default:
            try:
                token = push_token(config)
            except MonitorError as exc:
                LOG.error("第 %s 个接收人默认令牌不可用，跳过此用户：%s", index, exc)
                continue
        else:
            token = user.get("token")
            if not isinstance(token, str) or not token.strip() or not token.isprintable():
                raise MonitorError(f"第 {index} 个接收人缺少有效 token")
            token = token.strip()
        recipient = Recipient(name.strip(), token, is_default=default)
        if recipient.key in recipients:
            old = recipients[recipient.key]
            recipients[recipient.key] = replace(old, is_default=old.is_default or default)
        else:
            recipients[recipient.key] = recipient
    return list(recipients.values())


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def post_json(url: str, payload: dict, timeout: int) -> dict:
    request = urllib.request.Request(
        url, data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json", "Accept": "application/json",
                 "User-Agent": "StarbucksPriceMonitor/1.0"}, method="POST",
    )
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=timeout) as response:
            raw = response.read(1024 * 1024 + 1)
        if len(raw) > 1024 * 1024:
            raise MonitorError("接口响应过大")
        result = json.loads(raw, parse_float=Decimal)
    except urllib.error.HTTPError as exc:
        raise MonitorError(f"接口 HTTP 错误 {exc.code}") from None
    except (urllib.error.URLError, OSError, TimeoutError):
        raise MonitorError("接口连接失败或超时") from None
    except (ValueError, UnicodeError):
        raise MonitorError("接口未返回有效 JSON") from None
    if not isinstance(result, dict):
        raise MonitorError("接口响应不是 JSON 对象")
    return result


def parse_price(result: dict) -> Decimal:
    if type(result.get("code")) is not int or result["code"] != 0:
        raise MonitorError("价格接口业务状态异常")
    data = result.get("data")
    if not isinstance(data, dict) or str(data.get("id")) != "473":
        raise MonitorError("接口返回的商品不匹配，未发送价格")
    name = data.get("productName")
    if not isinstance(name, str) or "星巴克30元" not in name.replace(" ", ""):
        raise MonitorError("商品名称发生变化，请重新核对券种")
    if data.get("isDeleted") not in (0, "0") or data.get("status") not in (0, "0"):
        raise MonitorError("商品状态异常或已删除，未发送价格")
    return money(data.get("recoveryPrice"))


def message(price: Decimal, config: Config, queried_at: str, index: int, count: int):
    band = price_band(price, config)[0]
    reached = band == "target" or band in {"low", "high"}
    label = {"low": "【低价】", "high": "【高价】", "target": "【重点·达标】"}.get(band, "")
    title = f"¥{price:.2f} {label}星巴克30元券回收价"
    if band == "target":
        title += f"（{index}/{count}）"
    target = f"¥{config.target_price:.2f}" if config.target_price is not None else "未设置"
    thresholds = []
    if config.low_price_threshold is not None:
        thresholds.append(f"低价 ≤ ¥{config.low_price_threshold:.2f}")
    if config.high_price_threshold is not None:
        thresholds.append(f"高价 ≥ ¥{config.high_price_threshold:.2f}")
    status = {
        "low": "低价阈值已触发",
        "high": "高价阈值已触发",
        "target": "已达到目标价格",
    }.get(band, "普通价格通知" if not thresholds else "处于阈值区间内")
    content = (f"**¥{price:.2f} · 当前回收价**\n\n"
               f"价格阈值：{'；'.join(thresholds) if thresholds else target}\n\n"
               f"状态：{status}\n\n"
               f"查询时间：{queried_at}（北京时间）\n\n"
               f"商品：星巴克30元代金券（ID 473）\n\n"
               f"查询周期：{price_band(price, config)[1]} 秒；本轮通知 {index}/{count}\n\n"
               "来源：meitianwx.kaquan88.cn；回收价以实际交易时平台展示为准。")
    return title, content


def price_band(price: Decimal, config: Config) -> tuple[str, int]:
    """Return (band, polling interval). Equality belongs to the threshold band."""
    if config.low_price_threshold is not None and price <= config.low_price_threshold:
        return "low", config.threshold_interval_seconds
    if config.high_price_threshold is not None and price >= config.high_price_threshold:
        return "high", config.threshold_interval_seconds
    if config.target_price is not None and price >= config.target_price:
        return "target", config.interval_seconds
    return "normal", config.interval_seconds


class State:
    def __init__(self, path: Path):
        self.path = path
        try:
            self.data = json.loads(path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            self.data = {}
        except (OSError, ValueError):
            raise MonitorError("运行状态文件不可读，停止运行以免丢失推送计数") from None
        if not isinstance(self.data, dict):
            raise MonitorError("运行状态文件格式错误")
        count = self.data.get("daily_attempts", 0)
        if type(count) is not int or count < 0:
            raise MonitorError("运行状态中的推送计数无效")
        users = self.data.get("recipients", {})
        if not isinstance(users, dict):
            raise MonitorError("接收人运行状态格式错误")
        for value in users.values():
            if (not isinstance(value, dict) or type(value.get("daily_attempts", 0)) is not int
                    or value.get("daily_attempts", 0) < 0):
                raise MonitorError("接收人运行状态中的推送计数无效")

    def recipient(self, recipient: Recipient) -> dict:
        users = self.data.setdefault("recipients", {})
        record = users.setdefault(recipient.key, {})
        if recipient.is_default and not self.data.get("legacy_migrated"):
            # 仅原用户继承升级前的单人额度，不把旧计数分配给新用户。
            for key in ("quota_date", "daily_attempts", "last_push_accepted_at",
                        "last_push_status", "last_error_notice"):
                if key in self.data:
                    record[key] = self.data.pop(key)
            self.data["legacy_migrated"] = True
        record["name"] = recipient.name
        return record

    def save(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".tmp")
        try:
            with tmp.open("w", encoding="utf-8") as stream:
                json.dump(self.data, stream, ensure_ascii=False, indent=2)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(tmp, self.path)
        except OSError:
            raise MonitorError("无法保存运行状态，停止本轮推送以免丢失计数") from None

    def reserve_send(self, limit: int, recipient: Recipient) -> bool:
        record = self.recipient(recipient)
        day = now().date().isoformat()
        if record.get("quota_date") != day:
            record.update(quota_date=day, daily_attempts=0)
        if record.get("daily_attempts", 0) >= limit:
            return False
        record["daily_attempts"] = record.get("daily_attempts", 0) + 1
        # 在网络请求前落盘；失败请求也消耗 pushplus 额度。
        self.save()
        return True


@contextmanager
def single_instance(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise MonitorError("已有监控实例运行，请先停止后台服务") from None
        yield


class Monitor:
    def __init__(self, state: State, stop: threading.Event):
        self.state, self.stop = state, stop
        self.send_times = {}

    def query(self, config: Config) -> Decimal:
        for attempt in range(config.query_attempts):
            try:
                return parse_price(post_json(PRICE_URL, {"id": "473"}, config.request_timeout_seconds))
            except MonitorError:
                if attempt == config.query_attempts - 1 or self.stop.wait(2 ** attempt):
                    raise

    def send(self, config: Config, title: str, content: str, recipient: Recipient,
             expires_seconds: int | None = None, high_push: bool = False) -> bool:
        send_times = self.send_times.setdefault(recipient.key, deque())
        record = self.state.recipient(recipient)
        # 按令牌跨轮次限制为每 61 秒至多 5 次。
        while not self.stop.is_set():
            tick = time.monotonic()
            while send_times and tick - send_times[0] >= 61:
                send_times.popleft()
            if len(send_times) < 5:
                break
            if self.stop.wait(max(0.1, 61 - (tick - send_times[0]))):
                return False
        if self.stop.is_set():
            return False
        if not self.state.reserve_send(config.daily_send_limit, recipient):
            record["last_push_status"] = "daily_limit"
            self.state.save()
            LOG.warning("[%s] 达到每日推送上限 %s；其他用户继续发送", recipient.name, config.daily_send_limit)
            return False
        send_times.append(time.monotonic())
        result = post_json(PUSH_URL, {
            "token": recipient.token, "title": title, "content": content,
            "template": "markdown", "channel": "wechat",
            "timestamp": int((time.time() + (expires_seconds or config.interval_seconds)) * 1000),
        }, config.request_timeout_seconds)
        if type(result.get("code")) is not int or result["code"] != 200:
            code = result.get("code") if type(result.get("code")) is int else "未知"
            raise MonitorError(f"pushplus 拒绝请求，业务码 {code}；本轮不重试")
        record.update(last_push_accepted_at=now().isoformat(), last_push_status="accepted", last_error=None)
        if high_push:
            record["last_high_push_at"] = time.time()
        self.state.save()
        LOG.info("[%s] pushplus 已受理（不代表微信已送达）：%s", recipient.name, title)
        return True

    def deliver(self, config: Config, recipients: list[Recipient], build_message, count: int,
                expires_seconds: int | None = None, high_push: bool = False) -> bool:
        active = list(recipients)
        success = bool(active)
        for index in range(1, count + 1):
            title, content = build_message(index)
            for recipient in active[:]:
                if self.stop.is_set():
                    return False
                try:
                    accepted = self.send(config, title, content, recipient, expires_seconds, high_push)
                except MonitorError as exc:
                    self.state.recipient(recipient).update(last_error=str(exc), last_push_status="unconfirmed")
                    self.state.save()
                    LOG.error("[%s] 推送未确认受理：%s", recipient.name, exc)
                    accepted = False
                if not accepted:
                    success = False
                    active.remove(recipient)
            if not active:
                break
            if index < count and self.stop.wait(config.alert_interval_seconds):
                return False
        return success

    def cycle(self, config: Config) -> bool:
        try:
            recipients = load_recipients(config)
        except MonitorError as exc:
            LOG.error("接收人配置错误：%s", exc)
            return False
        try:
            price = self.query(config)
        except MonitorError as exc:
            LOG.error("查询失败：%s", exc)
            self.state.data.update(last_query_at=now().isoformat(), last_query_ok=False, last_error=str(exc))
            self.state.save()
            eligible = []
            for recipient in recipients:
                record = self.state.recipient(recipient)
                if time.time() - record.get("last_error_notice", 0) >= config.error_notify_interval_seconds:
                    record["last_error_notice"] = time.time()
                    eligible.append(recipient)
            self.state.save()
            title = "【查询异常】星巴克回收价"
            content = f"{now().isoformat()}\n\n{exc}。\n\n本轮无有效价格，将在下一轮重试。"
            self.deliver(config, eligible, lambda _: (title, content), 1)
            return False
        queried_at = now().strftime("%Y-%m-%d %H:%M:%S")
        self.state.data.update(last_query_at=now().isoformat(), last_query_ok=True,
                               last_price=str(price), last_price_at=queried_at, last_error=None)
        self.state.save()
        band, next_interval = price_band(price, config)
        count = config.alert_count if band == "target" else 1
        LOG.info("当前回收价 ¥%.2f；价格档位 %s；%s 位接收人，每人计划推送 %s 次；下次查询间隔 %s 秒",
                 price, band, len(recipients), count, next_interval)
        if config.notify_only_high and band != "high":
            LOG.info("当前价格未达到高价阈值，按配置仅查询不推送")
            return True
        high_recipients = recipients
        if band == "high":
            current_time = time.time()
            high_recipients = [
                recipient for recipient in recipients
                if current_time - float(self.state.recipient(recipient).get("last_high_push_at", 0))
                >= config.high_price_notify_interval_seconds
            ]
            if not high_recipients:
                LOG.info("高价通知仍在 %s 秒冷却期内，本轮只记录价格", config.high_price_notify_interval_seconds)
                return True
        return self.deliver(config, high_recipients,
                            lambda index: message(price, config, queried_at, index, count), count,
                            expires_seconds=next_interval, high_push=(band == "high"))


def setup_logging():
    (BASE / "logs").mkdir(exist_ok=True)
    handler = RotatingFileHandler(BASE / "logs/monitor.log", maxBytes=2_000_000,
                                  backupCount=3, encoding="utf-8")
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    formatter.converter = lambda ts: (datetime.fromtimestamp(ts, BEIJING)).timetuple()
    handler.setFormatter(formatter)
    LOG.setLevel(logging.INFO)
    LOG.addHandler(handler)
    console = logging.StreamHandler()
    console.setFormatter(formatter)
    LOG.addHandler(console)


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=BASE / "config.json")
    parser.add_argument("--once", action="store_true", help="只查询并推送一轮")
    parser.add_argument("--dry-run", action="store_true", help="只查询并预览一轮，绝不推送")
    args = parser.parse_args(argv)
    setup_logging()
    stop = threading.Event()
    for sig in (signal.SIGTERM, signal.SIGINT):
        signal.signal(sig, lambda *_: stop.set())
    try:
        config_path = args.config.resolve()
        config = Config.read(config_path)
        if args.dry_run:
            price = Monitor(State(BASE / "data/state.json"), stop).query(config)
            band, _ = price_band(price, config)
            count = config.alert_count if band == "target" else 1
            title, content = message(price, config, now().strftime("%Y-%m-%d %H:%M:%S"), 1, count)
            print(title + "\n" + content)
            return 0
        with single_instance(BASE / "data/monitor.lock"):
            monitor = Monitor(State(BASE / "data/state.json"), stop)
            LOG.info("监控启动；每轮重新读取配置；时间均为北京时间")
            while not stop.is_set():
                started = time.monotonic()
                try:
                    config = Config.read(config_path)
                except MonitorError as exc:
                    LOG.error("配置更新无效，沿用上一份有效配置：%s", exc)
                success = monitor.cycle(config)
                if args.once:
                    return 0 if success else 1
                # 请求耗时计入周期；过慢的轮次不追赶、不集中补发。
                elapsed = time.monotonic() - started
                _, next_interval = price_band(Decimal(monitor.state.data["last_price"]), config) \
                    if monitor.state.data.get("last_query_ok") else ("normal", config.interval_seconds)
                delay = next_interval - elapsed if elapsed < next_interval else next_interval
                stop.wait(delay)
            LOG.info("监控已停止")
    except MonitorError as exc:
        LOG.error("%s", exc)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
