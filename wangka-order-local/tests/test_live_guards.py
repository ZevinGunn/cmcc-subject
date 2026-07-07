import os
import unittest

from app.upstream import UpstreamClient
from app.utils import CONFIRM_TEXT


ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class LiveGuardTest(unittest.TestCase):
    def setUp(self):
        self.client = UpstreamClient(ROOT, live=True)

    def test_cookie_payload_is_stored(self):
        res = self.client.set_cookie({"cookie_header": "KSESSIONID=abc; tfstk=def"})
        self.assertTrue(res["hasCookie"])
        self.assertEqual(self.client.manual_cookie, "KSESSIONID=abc; tfstk=def")

    def test_live_kcard_submit_requires_confirm_text(self):
        res = self.client.kcard_sign({"confirmText": "wrong"})
        self.assertFalse(res["ok"])
        self.assertIn(CONFIRM_TEXT, res["error"])

    def test_live_super_submit_requires_confirm_text(self):
        res = self.client.super_order({"confirmText": "wrong"})
        self.assertFalse(res["ok"])
        self.assertIn(CONFIRM_TEXT, res["error"])

    def test_live_sms_send_requires_captcha_tokens(self):
        res = self.client.kcard_send_sms({})
        self.assertFalse(res["ok"])
        self.assertIn("nvct", res["error"])

        res = self.client.super_send_sms({})
        self.assertFalse(res["ok"])
        self.assertIn("tencentCaptcha", res["error"])


if __name__ == "__main__":
    unittest.main()
