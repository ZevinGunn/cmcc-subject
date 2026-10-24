#!/usr/bin/env python3
"""北京电信权益任务的本地 Python 执行器适配器。只转发一次性令牌。"""
import json
import sys
from urllib.request import Request, urlopen


def main():
    payload = json.load(sys.stdin)
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = Request(
        payload["callbackUrl"],
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
    print(json.dumps(result, ensure_ascii=False, separators=(",", ":")))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"ok": False, "message": f"Python 执行器失败：{error}"}, ensure_ascii=False))
        raise
