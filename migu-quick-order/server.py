#!/usr/bin/env python3
import argparse
import base64
import http.cookiejar
import json
import mimetypes
import os
import shutil
import ssl
import subprocess
import sys
import traceback
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(ROOT, "public")
CONFIG_PATH = os.path.join(ROOT, "config", "products.json")

sessions = {}
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
curl_path = shutil.which("curl")


def load_products():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_products(products):
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
        f.write("\n")


def product_by_id(product_id):
    for product in load_products():
        if product.get("id") == product_id:
            return product
    raise KeyError("业务配置不存在")


def json_bytes(obj):
    return json.dumps(obj, ensure_ascii=False).encode("utf-8")


def normalize_response(raw):
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("utf-8", errors="replace")
    try:
        decoded = base64.b64decode(text, validate=True)
        decoded_text = decoded.decode("utf-8")
        if decoded_text.startswith("{") or decoded_text.startswith("["):
            text = decoded_text
    except Exception:
        pass
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict) and "data" in parsed and isinstance(parsed["data"], dict):
            data = parsed["data"]
            if "code" in data or "msg" in data or "obj" in data:
                out = {"success": parsed.get("success", True)}
                out.update(data)
                return out
        return parsed
    except Exception:
        return {"success": False, "raw": text}


def get_session(session_id):
    if session_id not in sessions:
        jar = http.cookiejar.CookieJar()
        opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(jar),
            urllib.request.HTTPSHandler(context=ssl_context),
        )
        sessions[session_id] = {"jar": jar, "opener": opener, "token": "", "headerName": "vgop_mkt_web_token"}
    return sessions[session_id]


def post_upstream(session_id, product, path, payload, token_required=False):
    session = get_session(session_id)
    host = product.get("host", "https://xyw.bj.10086.cn").rstrip("/")
    url = host + path
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json, text/plain, */*",
        "Origin": host,
        "Referer": host + "/static/pages/vgop/mkt/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    }
    token = session.get("token", "")
    header_name = session.get("headerName", "vgop_mkt_web_token")
    if token_required and token:
        headers[header_name] = token
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with session["opener"].open(req, timeout=20) as resp:
            raw = resp.read()
            data = normalize_response(raw)
            if path.endswith("/login/commonLoginEncipher") and isinstance(data, dict):
                obj = data.get("obj") or {}
                if obj.get("token"):
                    session["token"] = obj["token"]
                    session["headerName"] = obj.get("headerName") or "vgop_mkt_web_token"
            return {"ok": True, "status": getattr(resp, "status", 200), "productId": product.get("id"), "productName": product.get("name"), "data": data}
    except urllib.error.HTTPError as e:
        raw = e.read()
        return {"ok": False, "status": e.code, "productId": product.get("id"), "productName": product.get("name"), "data": normalize_response(raw)}
    except Exception as e:
        if curl_path:
            return post_upstream_curl(session_id, product, path, payload, token_required, str(e))
        return {"ok": False, "status": 0, "productId": product.get("id"), "productName": product.get("name"), "data": {"success": False, "msg": str(e)}}


def cookie_header(session):
    values = []
    for cookie in session["jar"]:
        values.append("%s=%s" % (cookie.name, cookie.value))
    if session.get("token") and not any(v.startswith("vgop_mkt_web=") for v in values):
        values.append("vgop_mkt_web=%s" % session["token"])
    return "; ".join(values)


def post_upstream_curl(session_id, product, path, payload, token_required=False, fallback_reason=""):
    session = get_session(session_id)
    host = product.get("host", "https://xyw.bj.10086.cn").rstrip("/")
    url = host + path
    headers = [
        "Content-Type: application/json;charset=UTF-8",
        "Accept: application/json, text/plain, */*",
        "Origin: " + host,
        "Referer: " + host + "/static/pages/vgop/mkt/",
        "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    ]
    token = session.get("token", "")
    if token_required and token:
        headers.append("%s: %s" % (session.get("headerName", "vgop_mkt_web_token"), token))
    cookies = cookie_header(session)
    if cookies:
        headers.append("Cookie: " + cookies)
    cmd = [curl_path, "-sS", "-k", "-m", "25", "--http1.1", "-X", "POST", url]
    if product.get("proxy"):
        cmd += ["--proxy", product["proxy"]]
    if product.get("resolveIp"):
        parsed = urllib.parse.urlparse(host)
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        cmd += ["--resolve", "%s:%s:%s" % (parsed.hostname, port, product["resolveIp"])]
    for header in headers:
        cmd += ["-H", header]
    cmd += ["--data-binary", json.dumps(payload, ensure_ascii=False)]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        return {
            "ok": False,
            "status": 0,
            "productId": product.get("id"),
            "productName": product.get("name"),
            "data": {
                "success": False,
                "msg": proc.stderr.decode("utf-8", errors="replace") or fallback_reason,
            },
        }
    data = normalize_response(proc.stdout)
    if path.endswith("/login/commonLoginEncipher") and isinstance(data, dict):
        obj = data.get("obj") or {}
        if obj.get("token"):
            session["token"] = obj["token"]
            session["headerName"] = obj.get("headerName") or "vgop_mkt_web_token"
    return {"ok": True, "status": 200, "productId": product.get("id"), "productName": product.get("name"), "data": data, "transport": "curl"}


def network_check(product):
    host = product.get("host", "https://xyw.bj.10086.cn").rstrip("/")
    parsed = urllib.parse.urlparse(host)
    hostname = parsed.hostname or "xyw.bj.10086.cn"
    info = {
        "host": hostname,
        "proxy": product.get("proxy", ""),
        "resolveIp": product.get("resolveIp", ""),
    }
    try:
        import socket
        info["systemDns"] = sorted({x[4][0] for x in socket.getaddrinfo(hostname, 443, proto=socket.IPPROTO_TCP)})
    except Exception as e:
        info["systemDnsError"] = str(e)
    if curl_path:
        cmd = [
            curl_path,
            "-sS",
            "-k",
            "-m",
            "10",
            "--http1.1",
            "-o",
            "/dev/null",
            "-w",
            "%{http_code} %{remote_ip} %{errormsg}",
            host + "/static/pages/vgop/mkt/",
        ]
        if product.get("proxy"):
            cmd += ["--proxy", product["proxy"]]
        if product.get("resolveIp"):
            cmd += ["--resolve", "%s:443:%s" % (hostname, product["resolveIp"])]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        info["curlReturnCode"] = proc.returncode
        info["curlResult"] = proc.stdout.decode("utf-8", errors="replace")
        info["curlError"] = proc.stderr.decode("utf-8", errors="replace")
    fake_ips = [ip for ip in info.get("systemDns", []) if ip.startswith("198.18.") or ip.startswith("198.19.")]
    if fake_ips and not product.get("proxy"):
        info["hint"] = "当前域名解析到 Fake-IP，后台直连会失败。请关闭 Fake-IP/TUN，或在配置里填写可用 HTTP/SOCKS 代理。"
    return info


class Handler(BaseHTTPRequestHandler):
    server_version = "MiguQuickOrder/0.1"

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def read_json(self):
        length = int(self.headers.get("Content-Length") or "0")
        if length == 0:
            return {}
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8"))

    def write_json(self, obj, status=200):
        data = json_bytes(obj)
        self.send_response(status)
        self.send_header("Content-Type", "application/json;charset=UTF-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def session_id(self):
        cookie = self.headers.get("Cookie", "")
        for part in cookie.split(";"):
            part = part.strip()
            if part.startswith("mqo_session="):
                return part.split("=", 1)[1]
        sid = base64.urlsafe_b64encode(os.urandom(18)).decode("ascii").rstrip("=")
        self.pending_sid = sid
        return sid

    def write_json_with_session(self, obj, status=200):
        data = json_bytes(obj)
        self.send_response(status)
        if getattr(self, "pending_sid", None):
            self.send_header("Set-Cookie", "mqo_session=%s; Path=/; SameSite=Lax" % self.pending_sid)
        self.send_header("Content-Type", "application/json;charset=UTF-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        try:
            if parsed.path == "/api/products":
                self.write_json({"ok": True, "products": load_products()})
                return
            if parsed.path == "/api/session":
                sid = self.session_id()
                session = get_session(sid)
                self.write_json_with_session({"ok": True, "token": bool(session.get("token")), "headerName": session.get("headerName")})
                return
            self.serve_static(parsed.path)
        except Exception as e:
            traceback.print_exc()
            self.write_json({"ok": False, "msg": str(e)}, 500)

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        path = "/index.html" if parsed.path == "/" else parsed.path
        safe = os.path.normpath(path.lstrip("/"))
        full = os.path.join(PUBLIC_DIR, safe)
        if not full.startswith(PUBLIC_DIR) or not os.path.isfile(full):
            self.send_response(404)
            self.end_headers()
            return
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(os.path.getsize(full)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        try:
            body = self.read_json()
            if parsed.path == "/api/products":
                products = body.get("products")
                if not isinstance(products, list):
                    self.write_json({"ok": False, "msg": "products 必须是数组"}, 400)
                    return
                save_products(products)
                self.write_json({"ok": True, "products": products})
                return
            if parsed.path == "/api/reset-session":
                sid = self.session_id()
                sessions.pop(sid, None)
                self.write_json_with_session({"ok": True})
                return
            product = product_by_id(body.get("productId", "migu-video-year"))
            sid = self.session_id()
            if parsed.path == "/api/status":
                page_url = product["host"].rstrip("/") + "/static/pages/vgop/mkt/#" + product["route"]
                data = post_upstream(sid, product, "/vbss/s/page/status/check", {"mkt_id": product["mktId"], "page_url": page_url})
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/market-status":
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/marketInfo/getMarketStatus", {"mktCode": product["mktCode"], "channelCode": product["channelCode"]})
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/product-info":
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/productInfo/getProductInfo", {"channelCode": product["channelCode"], "productCode": product["productCode"]})
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/network-check":
                self.write_json_with_session({"ok": True, "data": network_check(product)})
                return
            if parsed.path == "/api/login/send":
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/login/sendVerifyCodeEncipher", {"encipherParam": body.get("encipherParam", "")})
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/login/confirm":
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/login/commonLoginEncipher", {"encipherParam": body.get("encipherParam", "")})
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/order/info":
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/orderConfirm/getMarketProInfo", {"productCode": product["productCode"], "mktCode": product["mktCode"]}, True)
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/order/send":
                payload = {"productCode": product["productCode"], "mktCode": product["mktCode"], "channelCode": product["channelCode"]}
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/orderConfirm/sendOrderConfirmVerifyCode", payload, True)
                self.write_json_with_session(data)
                return
            if parsed.path == "/api/order/confirm":
                payload = {"mktCode": product["mktCode"], "productCode": product["productCode"], "verifyCode": body.get("verifyCode", ""), "channelCode": product["channelCode"]}
                data = post_upstream(sid, product, product.get("baseApi", "/mkt_web") + "/s/marketInfo/marketOrder", payload, True)
                self.write_json_with_session(data)
                return
            self.write_json({"ok": False, "msg": "接口不存在"}, 404)
        except Exception as e:
            traceback.print_exc()
            self.write_json({"ok": False, "msg": str(e)}, 500)

    def serve_static(self, path):
        if path == "/":
            path = "/index.html"
        safe = os.path.normpath(path.lstrip("/"))
        full = os.path.join(PUBLIC_DIR, safe)
        if not full.startswith(PUBLIC_DIR) or not os.path.isfile(full):
            self.write_json({"ok": False, "msg": "Not found"}, 404)
            return
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        with open(full, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=5708, type=int)
    args = parser.parse_args()
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print("Migu quick order running at http://%s:%s" % (args.host, args.port))
    httpd.serve_forever()


if __name__ == "__main__":
    main()
