#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
【CMCC Cookie 刷新 · 最终稳定版（青龙 2.20.1）】

- curl 获取 newHome 响应头 Set-Cookie
- Patch → Merge 增量更新 Cookie
- 多账号逐行处理
- CLI → OpenAPI 自动切换
- 写后双重校验
"""

import os
import time
import subprocess
import hashlib
import requests

# =========================
# 基础配置
# =========================
ENV_NAME = "CMCC_COOKIE"
REFRESH_URL = "https://wx.10086.cn/website/spa/main/newHome"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/118.0.0.0 Safari/537.36"
)

# =========================
# 工具函数
# =========================
def now():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

def fp(val: str) -> str:
    return hashlib.md5(val.encode("utf-8")).hexdigest()[:8]

def mask(cookie: str, keep=4):
    out = []
    for kv in cookie.split(";"):
        kv = kv.strip()
        if "=" not in kv:
            continue
        k, v = kv.split("=", 1)
        if len(v) <= keep * 2:
            out.append(f"{k}={v}")
        else:
            out.append(f"{k}={v[:keep]}****{v[-keep:]}")
    return "; ".join(out)

def parse_cookie(cookie: str) -> dict:
    d = {}
    for part in cookie.split(";"):
        part = part.strip()
        if "=" not in part:
            continue
        k, v = part.split("=", 1)
        d[k] = v
    return d

def merge_cookie(old_cookie: str, patch_cookie: str) -> str:
    old_map = parse_cookie(old_cookie)
    patch_map = parse_cookie(patch_cookie)

    merged = old_map.copy()
    merged.update(patch_map)

    return "; ".join(f"{k}={v}" for k, v in merged.items())

# =========================
# Step 1: curl 刷新 Cookie
# =========================
def refresh_cookie(old_cookie: str) -> str:
    result = subprocess.check_output(
        [
            "curl", "-k", "-s",
            "-D", "-", "-o", "/dev/null",
            REFRESH_URL,
            "-H", f"Cookie: {old_cookie}",
            "-H", f"User-Agent: {UA}",
        ],
        text=True
    )

    cookies = []
    for line in result.splitlines():
        if line.lower().startswith("set-cookie:"):
            kv = line.split(":", 1)[1].strip().split(";", 1)[0]
            cookies.append(kv)

    return "; ".join(cookies)

# =========================
# Step 2: CLI 写回（不可信）
# =========================
def cli_update_env(name, value) -> bool:
    cmds = [
        ["ql", "env", "update", name, value],
        ["ql", "env", "set", f"{name}={value}"],
    ]
    for cmd in cmds:
        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass
    return os.getenv(name, "").strip() == value

# =========================
# Step 3: OpenAPI 写回
# =========================
def ql_token():
    base = os.getenv("BASE_URL")
    cid = os.getenv("CLIENT_ID")
    secret = os.getenv("CLIENT_SECRET")
    if not all([base, cid, secret]):
        return None, None

    r = requests.get(
        f"{base}/open/auth/token",
        params={"client_id": cid, "client_secret": secret},
        timeout=10
    )
    r.raise_for_status()
    return base, r.json()["data"]["token"]

def ql_upsert(base, token, name, value) -> bool:
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 查询 env
    r = requests.get(
        f"{base}/open/envs",
        headers=headers,
        params={"searchValue": name},
        timeout=10
    )
    r.raise_for_status()

    data = r.json().get("data", {})
    envs = data.get("data", []) if isinstance(data, dict) else data

    # 更新 or 新增
    if envs:
        env = envs[0]
        env_id = env.get("id") or env.get("_id")
        body = {
            "id": env_id,
            "name": name,
            "value": value,
            "remarks": env.get("remarks", "")
        }
        r = requests.put(
            f"{base}/open/envs",
            headers=headers,
            json=body,
            timeout=10
        )
    else:
        body = [{
            "name": name,
            "value": value,
            "remarks": ""
        }]
        r = requests.post(
            f"{base}/open/envs",
            headers=headers,
            json=body,
            timeout=10
        )

    if r.status_code not in (200, 201):
        raise RuntimeError(f"OpenAPI 写入失败: {r.status_code} {r.text}")

    # 写后校验
    r = requests.get(
        f"{base}/open/envs",
        headers=headers,
        params={"searchValue": name},
        timeout=10
    )
    r.raise_for_status()

    data = r.json().get("data", {})
    envs = data.get("data", []) if isinstance(data, dict) else data

    return bool(envs and envs[0].get("value") == value)

# =========================
# 主流程（多账号）
# =========================
def main():
    raw = os.getenv(ENV_NAME, "")
    cookies = [c.strip() for c in raw.splitlines() if c.strip()]

    if not cookies:
        print(f"[{now()}] ❌ 未检测到 {ENV_NAME}")
        return

    print(f"[{now()}] 🚀 开始刷新 CMCC Cookie，共 {len(cookies)} 个账号")

    new_cookies = []
    changed = False

    for idx, old_cookie in enumerate(cookies, 1):
        print(f"\n[{now()}] ===== 账号 #{idx} =====")
        print(f"[{now()}] 🧾 旧 CK: {mask(old_cookie)}  fp={fp(old_cookie)}")

        try:
            patch_cookie = refresh_cookie(old_cookie)
        except Exception as e:
            print(f"[{now()}] ❌ 刷新异常，保留原 CK：{e}")
            new_cookies.append(old_cookie)
            continue

        if not patch_cookie:
            print(f"[{now()}] ❌ 未获取 Patch CK，保留原 CK")
            new_cookies.append(old_cookie)
            continue

        print(f"[{now()}] 🧩 Patch CK: {mask(patch_cookie)}")

        merged_cookie = merge_cookie(old_cookie, patch_cookie)
        print(f"[{now()}] 🧾 合并后 CK: {mask(merged_cookie)}  fp={fp(merged_cookie)}")

        if fp(old_cookie) == fp(merged_cookie):
            print(f"[{now()}] ℹ️ Cookie 未变化")
            new_cookies.append(old_cookie)
        else:
            print(f"[{now()}] 🔄 Cookie 已增量更新")
            new_cookies.append(merged_cookie)
            changed = True

    if not changed:
        print(f"\n[{now()}] ℹ️ 所有 Cookie 均未变化，结束")
        return

    final_value = "\n".join(new_cookies)
    print(f"\n[{now()}] 🔄 写回更新后的 Cookie")

    if cli_update_env(ENV_NAME, final_value):
        print(f"[{now()}] ✅ CLI 写回并校验成功")
        return

    print(f"[{now()}] ⚠️ CLI 不可信，切换 OpenAPI")

    base, token = ql_token()
    if not token:
        print(f"[{now()}] ❌ 未配置 OpenAPI，终止")
        return

    if ql_upsert(base, token, ENV_NAME, final_value):
        print(f"[{now()}] ✅ OpenAPI 写回并校验成功")
    else:
        print(f"[{now()}] ❌ OpenAPI 写回失败（需人工介入）")

if __name__ == "__main__":
    main()
