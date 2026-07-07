import json
import os
import threading
import unittest
import urllib.request
from http.server import ThreadingHTTPServer

import server


ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class ServerApiTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server.Handler.client = server.UpstreamClient(ROOT, live=False)
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        cls.port = cls.httpd.server_address[1]
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.thread.join(timeout=2)

    def post(self, path, payload=None):
        data = json.dumps(payload or {}, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:%s%s" % (self.port, path),
            data=data,
            headers={"Content-Type": "application/json;charset=UTF-8"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def test_status_and_mock_home(self):
        with urllib.request.urlopen("http://127.0.0.1:%s/api/status" % self.port, timeout=5) as resp:
            status = json.loads(resp.read().decode("utf-8"))
        self.assertEqual(status["mode"], "mock")

        home = self.post("/api/kcard/home")
        self.assertTrue(home["summary"]["hasRncPhone"])

    def test_mock_super_order(self):
        index = self.post("/api/super-youth/index", {"channel": "CJHY_LTYOUTH_fulishe1"})
        self.assertEqual(index["summary"]["selectedType"], "LT_YOUTH")
        order = self.post("/api/super-youth/order", {})
        self.assertEqual(order["data"]["code"], "00000")


if __name__ == "__main__":
    unittest.main()
