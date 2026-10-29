import base64
import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import ct189 as app


def response(number=None, **patches):
    data = {"result": 0, "retCode": "000000", "object": number}
    data.update(patches)
    return {"ok": True, "status": 200, "data": data}


class ScriptTests(unittest.TestCase):
    def setUp(self):
        self.account = app.Account("18900000001", "001234", "sensitive-remark")

    def test_parse_formats_and_no_secret_repr(self):
        parsed = app.parse_accounts("18900000001#001234#主号\n18900000002#005678")
        self.assertEqual(parsed[0].password, "001234")
        self.assertNotIn("001234", repr(parsed[0]))
        rows = app.parse_accounts('[{"phone":"18900000001","password":"001234","enabled":false}]')
        self.assertFalse(rows[0].enabled)
        for raw in ['[{"phone":"18900000001","password":1234}]', '18900000001#001234\n18900000001#005678', '18900000001#secret#bad#row', '[]']:
            with self.assertRaises(app.ConfigError) as caught:
                app.parse_accounts(raw)
            self.assertNotIn("secret", str(caught.exception))
            self.assertNotIn("18900000001", str(caught.exception))

    def test_encoding_and_business_success(self):
        data = {"result": 0, "retCode": "000000"}
        self.assertEqual(app.decode_payload(base64.b64encode(json.dumps(data).encode()).decode()), data)
        self.assertEqual(app.decode_payload(json.dumps(data)), data)
        self.assertIsNone(app.decode_payload('<html>WAF</html>'))
        self.assertFalse(app.success(response(retCode="FAILED")))
        self.assertFalse(app.success({"ok": True, "data": {}}))
        self.assertFalse(app.success({"ok": False, "data": data}))

    def test_encryption_matches_node_fixture(self):
        self.assertEqual(app.encrypt_password("001234"), "pXqg8qPPFHI=")

    def test_cached_identity_does_not_submit_password(self):
        calls = []
        def request(endpoint, data, **kwargs):
            calls.append(endpoint)
            return response(self.account.phone)
        self.assertIn("复用", app.authenticate(self.account, request))
        self.assertEqual(calls, [app.IDENTITY])

    def test_initialization_retry_and_single_password(self):
        calls = []
        replies = iter([{"ok":False,"status":412,"data":None}, response(), response(), response(self.account.phone)])
        def request(endpoint, data, **kwargs):
            calls.append((endpoint, data, kwargs))
            return next(replies)
        app.authenticate(self.account, request, lambda _: "encrypted")
        self.assertTrue(calls[1][2]["reinitialize"])
        self.assertEqual([c[0] for c in calls].count(app.PASSWORD), 1)
        self.assertEqual(calls[2][1]["password"], "encrypted")

    def test_password_failure_never_replayed(self):
        calls = []
        def request(endpoint, data, **kwargs):
            calls.append(endpoint)
            if endpoint == app.PASSWORD:
                raise RuntimeError("secret upstream failure")
            return response()
        with self.assertRaises(app.TaskError) as caught:
            app.authenticate(self.account, request, lambda _: "encrypted")
        self.assertEqual(calls.count(app.PASSWORD), 1)
        self.assertNotIn("secret", str(caught.exception))

    def test_wrong_cached_and_confirmed_identity_rejected(self):
        with self.assertRaises(app.TaskError):
            app.authenticate(self.account, lambda *args, **kwargs: response("18900000002"))
        replies = iter([response(), response(), response("18900000002")])
        with self.assertRaises(app.TaskError):
            app.authenticate(self.account, lambda *args, **kwargs: next(replies), lambda _: "encrypted")

    def test_failed_account_isolated_and_logs_redacted(self):
        lines, profiles = [], []
        class Client:
            def __init__(self, good): self.good = good
            def request(self, *args, **kwargs):
                if not self.good: raise RuntimeError("001234 secret cookie")
                return response("18900000002")
            def close(self): pass
        def factory(profile):
            profiles.append(profile)
            return Client(len(profiles) == 2)
        with tempfile.TemporaryDirectory() as directory:
            counts = app.run_accounts([self.account, app.Account("18900000002", "005678"), app.Account("18900000003", "001234", enabled=False)], ["login"], Path(directory), factory, delay=0, emit=lines.append)
        self.assertEqual(counts, {"success": 1, "failed": 1, "skipped": 1})
        self.assertNotEqual(profiles[0], profiles[1])
        for secret in ["18900000001", "001234", "sensitive-remark", "cookie"]:
            self.assertNotIn(secret, "\n".join(lines))

    def test_unknown_task_and_validation_do_not_load_browser(self):
        with self.assertRaises(app.ConfigError): app.parse_tasks("login,signin")
        with patch.dict(os.environ, {"CT189_ACCOUNTS": "18900000001#001234"}), contextlib.redirect_stdout(io.StringIO()) as output:
            self.assertEqual(app.main(["--validate"]), 0)
        self.assertNotIn("001234", output.getvalue())

    def test_activity_business_failure(self):
        class Client:
            def request(self, *args): return response(retCode="NO_RIGHTS")
        with self.assertRaises(app.TaskError): app.activity_task(Client(), self.account)

    def test_lock_rejects_overlapping_run(self):
        with tempfile.TemporaryDirectory() as directory:
            with app.run_lock(Path(directory)):
                with self.assertRaises(app.ConfigError):
                    with app.run_lock(Path(directory)): pass

    def test_controlled_concurrency_keeps_accounts_isolated(self):
        lines = []
        class Client:
            def request(self, endpoint, data, **kwargs):
                return response(self.phone)
            def close(self):
                pass
        def factory(profile):
            client = Client()
            client.phone = phone_by_profile[profile.name]
            return client
        with tempfile.TemporaryDirectory() as directory:
            accounts = [self.account, app.Account("18900000002", "005678")]
            phone_by_profile = {hashlib.sha256(account.phone.encode()).hexdigest()[:24]: account.phone for account in accounts}
            counts = app.run_accounts(accounts, ["login"], Path(directory), factory, delay=0, emit=lines.append, concurrency=2)
        self.assertEqual(counts, {"success": 2, "failed": 0, "skipped": 0})


if __name__ == "__main__":
    unittest.main()
