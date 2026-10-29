#!/usr/bin/env python3
"""macOS 用户级后台服务：start / stop / restart / status / uninstall。"""
import argparse
import json
import os
from pathlib import Path
import plistlib
import subprocess
import sys

BASE = Path(__file__).resolve().parent
LABEL = "local.starbucks-price-monitor"
PLIST = Path.home() / "Library/LaunchAgents" / f"{LABEL}.plist"
DOMAIN = f"gui/{os.getuid()}"


def launchctl(*args):
    return subprocess.run(["launchctl", *args], text=True, capture_output=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["start", "stop", "restart", "status", "uninstall"])
    action = parser.parse_args().action
    if sys.platform != "darwin":
        parser.error("此服务管理器仅用于 macOS；Linux 可直接运行 monitor.py")
    loaded = launchctl("print", f"{DOMAIN}/{LABEL}").returncode == 0
    if action == "status":
        print("后台服务：" + ("已加载" if loaded else "未加载"))
        if loaded:
            status = launchctl("print", f"{DOMAIN}/{LABEL}").stdout
            shown = set()
            for line in status.splitlines():
                key = line.strip().split(" =", 1)[0]
                if key in {"state", "pid", "last exit code"} and key not in shown:
                    print(line.strip())
                    shown.add(key)
        state = BASE / "data/state.json"
        if state.exists():
            print(json.dumps(json.loads(state.read_text()), ensure_ascii=False, indent=2))
        return 0
    if action in {"stop", "restart", "uninstall"} and loaded:
        result = launchctl("bootout", f"{DOMAIN}/{LABEL}")
        if result.returncode:
            print(result.stderr.strip(), file=sys.stderr)
            return 1
        loaded = False
    if action == "uninstall":
        PLIST.unlink(missing_ok=True)
        print("后台服务已卸载；配置和日志已保留")
        return 0
    if action == "stop":
        # 同时禁用下次登录自动加载；start 会重新启用。
        result = launchctl("disable", f"{DOMAIN}/{LABEL}")
        print("后台服务已停止；使用 start 恢复")
        return result.returncode
    if loaded:
        print("后台服务已在运行")
        return 0
    from monitor import Config, MonitorError, load_recipients
    try:
        load_recipients(Config.read(BASE / "config.json"))
    except MonitorError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    (BASE / "logs").mkdir(exist_ok=True)
    PLIST.parent.mkdir(parents=True, exist_ok=True)
    with PLIST.open("wb") as stream:
        plistlib.dump({
            "Label": LABEL,
            "ProgramArguments": [sys.executable, "-u", str(BASE / "monitor.py")],
            "WorkingDirectory": str(BASE),
            "RunAtLoad": True,
            "KeepAlive": True,
            "ThrottleInterval": 60,
            "ProcessType": "Background",
            "StandardOutPath": "/dev/null",
            "StandardErrorPath": "/dev/null",
            "EnvironmentVariables": {"PYTHONUNBUFFERED": "1"},
        }, stream)
    result = launchctl("enable", f"{DOMAIN}/{LABEL}")
    if result.returncode == 0:
        result = launchctl("bootstrap", DOMAIN, str(PLIST))
    if result.returncode:
        print(result.stderr.strip(), file=sys.stderr)
        return 1
    print("后台服务已启动，立即查询；登录后自动启动，异常退出自动重启")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
