#!/usr/bin/env python3
import argparse
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from app.upstream import UpstreamClient
from app.utils import json_bytes, parse_json_body


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(APP_ROOT, "public")


class Handler(BaseHTTPRequestHandler):
    client = UpstreamClient(ROOT)

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def write_json(self, value, status=200):
        data = json_bytes(value)
        self.send_response(status)
        self.send_header("Content-Type", "application/json;charset=UTF-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def read_payload(self):
        length = int(self.headers.get("Content-Length") or "0")
        raw = self.rfile.read(length) if length else b""
        return parse_json_body(raw)

    def do_GET(self):
        if self.path == "/" or self.path.startswith("/index.html"):
            return self.serve_file("index.html", "text/html;charset=UTF-8")
        if self.path == "/styles.css":
            return self.serve_file("styles.css", "text/css;charset=UTF-8")
        if self.path == "/app.js":
            return self.serve_file("app.js", "application/javascript;charset=UTF-8")
        if self.path == "/favicon.svg":
            return self.serve_file("favicon.svg", "image/svg+xml;charset=UTF-8")
        if self.path == "/api/status":
            return self.write_json({"ok": True, "live": self.client.live, "mode": "live" if self.client.live else "mock"})
        self.send_error(404)

    def serve_file(self, name, content_type):
        path = os.path.join(PUBLIC_DIR, name)
        with open(path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        payload = self.read_payload()
        routes = {
            "/api/session/cookie": self.client.set_cookie,
            "/api/kcard/home": lambda p: self.client.kcard_home(),
            "/api/kcard/sms/send": self.client.kcard_send_sms,
            "/api/kcard/sms/check": self.client.kcard_check_sms,
            "/api/kcard/sign": self.client.kcard_sign,
            "/api/kcard/refresh": lambda p: self.client.kcard_home(),
            "/api/super-youth/index": self.client.super_index,
            "/api/super-youth/sms/send": self.client.super_send_sms,
            "/api/super-youth/sms/check": self.client.super_check_sms,
            "/api/super-youth/order": self.client.super_order,
            "/api/super-youth/refresh": self.client.super_index,
        }
        fn = routes.get(self.path)
        if not fn:
            return self.write_json({"ok": False, "error": "not found"}, 404)
        try:
            result = fn(payload)
            status = 200 if result.get("ok", True) else 400
            self.write_json(result, status)
        except Exception as e:
            self.write_json({"ok": False, "error": str(e)}, 500)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8787)
    args = parser.parse_args()
    Handler.client = UpstreamClient(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print("Wangka order local server: http://127.0.0.1:%s" % args.port)
    print("Mode:", "live" if Handler.client.live else "mock")
    server.serve_forever()


if __name__ == "__main__":
    main()
