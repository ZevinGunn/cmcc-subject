import os
import unittest

from app.har_store import HarStore


ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class HarStoreTest(unittest.TestCase):
    def setUp(self):
        self.store = HarStore(ROOT)

    def test_kcard_home_contains_sms_infos(self):
        data = self.store.kcard_home()
        self.assertIn("data", data)
        sms = data["data"].get("smsInfos", {}).get("signKcardVip", {})
        self.assertTrue(sms.get("encryptPhpne", "").startswith("RNC("))
        self.assertTrue(sms.get("encryptTmpId", "").startswith("RNC("))

    def test_super_index_contains_youth_package(self):
        _, data = self.store.super_index()
        packages = data["data"].get("enableOrderPackagesInfo", [])
        self.assertTrue(any(item.get("type") == "LT_YOUTH" for item in packages))

    def test_order_sample_has_expected_fields(self):
        sent, data = self.store.super_order()
        self.assertEqual(sent["type"], "LT_YOUTH")
        self.assertEqual(sent["effectiveMode"], "00")
        self.assertEqual(data["code"], "00000")


if __name__ == "__main__":
    unittest.main()
