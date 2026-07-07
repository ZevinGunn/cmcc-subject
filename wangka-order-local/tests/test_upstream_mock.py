import os
import unittest

from app.upstream import UpstreamClient


ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class UpstreamMockTest(unittest.TestCase):
    def setUp(self):
        self.client = UpstreamClient(ROOT, live=False)

    def test_kcard_mock_flow(self):
        home = self.client.kcard_home()
        self.assertTrue(home["ok"])
        self.assertTrue(home["summary"]["hasRncPhone"])
        self.assertTrue(home["summary"]["hasRncTemplate"])

        send = self.client.kcard_send_sms({"nvct": "mock"})
        self.assertTrue(send["ok"])
        self.assertEqual(send["data"]["code"], "00000")
        self.assertIn("redacted", send["sent"]["phone"])

        check = self.client.kcard_check_sms({"code": "1234"})
        self.assertTrue(check["ok"])
        self.assertEqual(check["data"]["code"], "00000")

        sign = self.client.kcard_sign({})
        self.assertTrue(sign["ok"])
        self.assertEqual(sign["data"]["code"], "0")

    def test_super_youth_mock_flow(self):
        index = self.client.super_index({"channel": "CJHY_LTYOUTH_fulishe1"})
        self.assertTrue(index["ok"])
        self.assertEqual(index["summary"]["selectedType"], "LT_YOUTH")
        self.assertTrue(index["summary"]["hasRncPhone"])

        send = self.client.super_send_sms({})
        self.assertTrue(send["ok"])
        self.assertEqual(send["data"]["code"], "00000")
        self.assertIn("redacted", send["sent"]["phone"])

        check = self.client.super_check_sms({"code": "1234"})
        self.assertTrue(check["ok"])
        self.assertEqual(check["data"]["code"], "00000")

        order = self.client.super_order({})
        self.assertTrue(order["ok"])
        self.assertEqual(order["sent"]["type"], "LT_YOUTH")
        self.assertEqual(order["data"]["code"], "00000")

    def test_missing_sms_code_is_rejected_even_in_mock(self):
        self.assertFalse(self.client.kcard_check_sms({})["ok"])
        self.assertFalse(self.client.super_check_sms({})["ok"])


if __name__ == "__main__":
    unittest.main()
