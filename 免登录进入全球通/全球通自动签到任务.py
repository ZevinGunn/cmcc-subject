#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
【全球通自动签到 · 修复 415 版】
- curl 获取 access_token
- queryVipLevel.do 查询用户信息输出
- POST /sign/sign 按抓包实例发送 JSON: {"sspid":"xxxx"}（注意全小写 sspid）
"""

import os
import re
import html
import time
import urllib.parse
import subprocess
import tempfile
import requests

ENV_NAME = "CMCC_COOKIE"
SSPID_ENV_NAME = "QQT_SSPID"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/118.0.0.0 Safari/537.36"
)

BIND_URL = (
    "https://wx.10086.cn/website/bind/bindAccount/new"
    "?netUniChannelId=001191&tokenKey=token&netUniBackUrl="
    + urllib.parse.quote(
        "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/new/ssoTokenLogin.action?"
        "backUrl=" + urllib.parse.quote(
            "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/index2.html?sspId=66411"
        )
    )
    + "&ys=&yx=&touch_id="
)

INDEX_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/index2.html"
# 抓包里的 Referer 是 xdrNormal.html（带 sspId 等参数），更贴近真实行为
XDR_NORMAL_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html"

INFO_URL  = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryVipLevel.do"
SIGN_URL  = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/sign/info"
SIGN_URL  = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/sign/sign"

BASE_HEADERS = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": UA,
    "X-Requested-With": "XMLHttpRequest",
    "Origin": "https://qqt.cmicrwx.cn",
    "Referer": INDEX_PAGE,
}

def now():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

def extract_qqt_url(text: str) -> str:
    text = html.unescape(text)
    m = re.search(
        r"https://qqt\.cmicrwx\.cn/[^\s\"'<>]+ssoTokenLogin\.action[^\s\"'<>]+",
        text
    )
    return m.group(0) if m else ""

def extract_access_token_from_jar(jar_path: str) -> str:
    with open(jar_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#"):
                continue
            parts = line.strip().split("\t")
            if len(parts) >= 7 and parts[5] == "access_token":
                return parts[6]
    return ""

def safe_json(resp: requests.Response):
    try:
        return resp.json()
    except Exception:
        return {"raw": resp.text, "status_code": resp.status_code}

def get_access_token(cmcc_cookie: str) -> str:
    with tempfile.NamedTemporaryFile(prefix="qqt_", suffix=".jar", delete=True) as jar:
        jar_path = jar.name

        html_text = subprocess.check_output(
            [
                "curl", "-k", "-s", "-L", BIND_URL,
                "-H", f"Cookie: {cmcc_cookie}",
                "-H", f"User-Agent: {UA}",
                "-c", jar_path,
            ],
            text=True
        )

        qqt_url = extract_qqt_url(html_text)
        if not qqt_url:
            return ""

        subprocess.check_output(
            [
                "curl", "-k", "-s", "-L", qqt_url,
                "-H", f"User-Agent: {UA}",
                "-b", jar_path,
                "-c", jar_path,
            ],
            text=True
        )

        return extract_access_token_from_jar(jar_path)

def build_session(token: str) -> requests.Session:
    s = requests.Session()
    s.headers.update(BASE_HEADERS)
    # 关键：access_token 必须进 Cookie
    s.headers["Cookie"] = f"access_token={token}"
    # preheat：建立 JSESSIONID 等（抓包里也有）
    s.get(INDEX_PAGE, timeout=10)
    return s

def sign(session: requests.Session, sspid: str):
    """
    按抓包：Content-Type=application/json，body={"sspid":"75442"}
    注意：参数名 sspid 全小写。:contentReference[oaicite:3]{index=3}
    """
    # 构造更接近抓包的 Referer（至少带上 sspId）
    referer = f"{XDR_NORMAL_PAGE}?sspId={sspid}"

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "User-Agent": UA,
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://qqt.cmicrwx.cn",
        "Referer": referer,
        "Content-Type": "application/json",  # 抓包是 application/json :contentReference[oaicite:4]{index=4}
    }

    # 用 data 发送 JSON 字符串，与抓包一致（Content-Length 17）:contentReference[oaicite:5]{index=5}
    payload = f'{{"sspid":"{sspid}"}}'
    resp = session.post(SIGN_URL, headers=headers, data=payload, timeout=10)
    return safe_json(resp)

def main():
    cookies = [c.strip() for c in os.getenv(ENV_NAME, "").splitlines() if c.strip()]
    print(f"[{now()}] 共检测到 {len(cookies)} 个账号，开始签到")

    for idx, cmcc_cookie in enumerate(cookies, 1):
        print(f"\n[{now()}] ===== 账号 #{idx} =====")

        token = get_access_token(cmcc_cookie)
        if not token:
            print("❌ access_token 获取失败")
            continue
        print(f"✔ access_token = {token}")

        session = build_session(token)

        # 用户信息（验证 token 及输出用户信息）
        info = safe_json(session.post(INFO_URL, data={"sspId": "", "tag": "qqtindex"}, timeout=10))
        if "data" not in info:
            print(f"❌ 用户信息获取失败：{info}")
            continue

        d = info["data"]
        sspid = os.getenv(SSPID_ENV_NAME, "").strip()
        print(f"👤 用户：{d.get('phone')} {d.get('province')} {d.get('levelName')} sspid={sspid}")

        if not sspid:
            print("❌ 未配置 QQT_SSPID（sspid），无法签到")
            continue

        # 签到
        result = sign(session, sspid)
        if result.get("status") == "1":
            prizes = result.get("data") or []
            if prizes:
                for p in prizes:
                    print(f"🎁 签到成功：{p.get('prizeName')}")
            else:
                print("✔ 签到成功（无奖励）")
        else:
            print(f"❌ 签到失败：{result.get('msg')}")

if __name__ == "__main__":
    main()
