"""Real local engine and XHR integration; every URL is intercepted."""
import base64
import json
from pathlib import Path
import sys
import tempfile
import unittest
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import ct189 as app


class BrowserTests(unittest.TestCase):
    def test_local_engine_waf_retry_encryption_and_isolation(self):
        account = app.Account('18900000001', '001234')
        with tempfile.TemporaryDirectory() as directory, sync_playwright() as playwright:
            client = app.TelecomClient(playwright.chromium, Path(directory) / 'first')
            other = None
            try:
                state = {'entries': 0, 'queries': 0, 'submissions': 0, 'logged_in': False}
                def route_fixture(route):
                    path = route.request.url.split('wapbj.189.cn')[-1]
                    if path == '/echnwap/scratchLogon':
                        state['entries'] += 1
                        route.fulfill(content_type='text/html', body='<!doctype html><title>Local test</title>')
                        return
                    self.assertIn(path, [app.IDENTITY, app.PASSWORD])
                    if path == app.IDENTITY:
                        state['queries'] += 1
                        if state['queries'] == 1:
                            route.fulfill(status=412, content_type='text/html', body='Local WAF fixture')
                            return
                    else:
                        state['submissions'] += 1
                        self.assertEqual(route.request.post_data_json, {'phoneNum':account.phone, 'password':app.encrypt_password(account.password)})
                        state['logged_in'] = True
                    data = {'result':0, 'retCode':'000000', 'object':account.phone if state['logged_in'] else None}
                    route.fulfill(content_type='application/json', body=base64.b64encode(json.dumps(data).encode()).decode())
                client.context.route('**/*', route_fixture)
                self.assertIn('登录成功', app.authenticate(account, client.request))
                self.assertEqual(state['entries'], 2)
                self.assertEqual(state['submissions'], 1)
                self.assertEqual(len(client.context.pages), 1)
                self.assertIn('复用', app.authenticate(account, client.request))
                self.assertEqual(state['submissions'], 1)
                client.context.add_cookies([{'name':'fixture', 'value':'local-only', 'url':app.ORIGIN}])
                other = app.TelecomClient(playwright.chromium, Path(directory) / 'second')
                self.assertEqual(other.context.cookies(), [])
                client.page.goto('about:blank')
                client.close()
                client = None
                self.assertEqual((Path(directory) / 'first' / 'session.json').stat().st_mode & 0o777, 0o600)
                client = app.TelecomClient(playwright.chromium, Path(directory) / 'first')
                self.assertTrue(any(cookie['name'] == 'fixture' and cookie['value'] == 'local-only' for cookie in client.context.cookies()))
            finally:
                if client: client.close()
                if other: other.close()


if __name__ == '__main__':
    unittest.main()
