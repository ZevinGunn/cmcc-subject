import base64
import json
import os
from urllib.parse import parse_qs, urlparse


class HarStore:
    def __init__(self, root):
        self.root = os.path.abspath(root)
        self.kcard_har = os.path.join(self.root, "王卡会员开通.har")
        self.super_har = os.path.join(self.root, "订购王卡会员青春版.har")

    def _load(self, path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f).get("log", {}).get("entries", [])

    @staticmethod
    def _response_json(entry):
        content = entry.get("response", {}).get("content", {})
        text = content.get("text") or ""
        if content.get("encoding") == "base64" and text:
            text = base64.b64decode(text).decode("utf-8", errors="replace")
        return json.loads(text) if text else {}

    @staticmethod
    def _post_params(entry):
        post = entry.get("request", {}).get("postData", {}) or {}
        text = post.get("text") or ""
        if not text:
            return {}
        ctype = post.get("mimeType") or ""
        if "json" in ctype:
            try:
                return json.loads(text)
            except Exception:
                return {}
        return {k: v[0] if len(v) == 1 else v for k, v in parse_qs(text).items()}

    @staticmethod
    def _query_params(entry):
        url = entry.get("request", {}).get("url") or ""
        return {k: v[0] if len(v) == 1 else v for k, v in parse_qs(urlparse(url).query).items()}

    def _find(self, entries, marker):
        for entry in entries:
            if marker in entry.get("request", {}).get("url", ""):
                return entry
        raise KeyError("HAR entry not found: %s" % marker)

    def kcard_home(self):
        entry = self._find(self._load(self.kcard_har), "retrieveHomePageInfo")
        return self._response_json(entry)

    def kcard_send_sms(self):
        entry = self._find(self._load(self.kcard_har), "/captcha/op/getCaptcha")
        return self._post_params(entry), self._response_json(entry)

    def kcard_check_sms(self):
        entry = self._find(self._load(self.kcard_har), "/captcha/op/checkCode")
        return self._post_params(entry), self._response_json(entry)

    def kcard_sign(self):
        entry = self._find(self._load(self.kcard_har), "signAgreementNew")
        return self._post_params(entry), self._response_json(entry)

    def super_index(self):
        entry = self._find(self._load(self.super_har), "/KCard/superVip/V3/indexInfo")
        return self._query_params(entry), self._response_json(entry)

    def super_send_sms(self):
        entry = self._find(self._load(self.super_har), "/captcha/op/tc/getCaptcha")
        return self._post_params(entry), self._response_json(entry)

    def super_check_sms(self):
        entry = self._find(self._load(self.super_har), "/captcha/op/tc/checkCode")
        return self._post_params(entry), self._response_json(entry)

    def super_order(self):
        entry = self._find(self._load(self.super_har), "/KCard/superVip/V2/orderSuperVip")
        return self._post_params(entry), self._response_json(entry)
