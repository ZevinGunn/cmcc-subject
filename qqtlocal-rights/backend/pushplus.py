import os
from typing import Optional

import requests


def _is_enabled() -> bool:
    token = (os.getenv("PUSHPLUS_TOKEN") or "").strip()
    if not token:
        return False
    raw = (os.getenv("PUSHPLUS_ENABLED") or "1").strip().lower()
    return raw not in {"0", "false", "off", "no"}


def send_pushplus(title: str, content: str, template: str = "markdown") -> None:
    if not _is_enabled():
        return
    token = (os.getenv("PUSHPLUS_TOKEN") or "").strip()
    if not token:
        return
    payload = {
        "token": token,
        "title": title,
        "content": content,
        "template": template,
    }
    channel = (os.getenv("PUSHPLUS_CHANNEL") or "").strip()
    if channel:
      payload["channel"] = channel
    try:
        requests.post("http://www.pushplus.plus/send", json=payload, timeout=10)
    except Exception as e:
        print(f"PushPlus send failed: {e}")
