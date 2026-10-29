import json
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from http.cookiejar import CookieJar

from .har_store import HarStore
from .utils import form_encode, is_live_enabled, mask_phone, redact_value, require_confirm, sanitize_for_output


KAPI = "https://kapi.10010.com"
ORIGIN = "https://txwk.10010.com"
MOBILE_UA = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1"
)


class UpstreamClient:
    def __init__(self, root, live=None):
        self.root = root
        self.live = is_live_enabled() if live is None else live
        self.har = HarStore(root)
        self.jar = CookieJar()
        ctx = ssl.create_default_context()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.jar),
            urllib.request.HTTPSHandler(context=ctx),
        )
        self.manual_cookie = ""
        self.kcard_context = {}
        self.super_context = {}

    def set_cookie(self, payload):
        if isinstance(payload, dict):
            cookie_header = payload.get("cookie_header") or payload.get("cookie") or ""
        else:
            cookie_header = payload
        self.manual_cookie = str(cookie_header or "").strip()
        return {"ok": True, "live": self.live, "hasCookie": bool(self.manual_cookie)}

    def _request(self, method, path, params=None, json_body=None, form_body=None, extra_headers=None):
        if not self.live:
            raise RuntimeError("live upstream disabled")
        url = KAPI + path
        body = None
        headers = {
            "Origin": ORIGIN,
            "Referer": ORIGIN + "/",
            "User-Agent": MOBILE_UA,
            "Accept": "application/json, text/plain, */*",
        }
        if params:
            url += "?" + urllib.parse.urlencode(params)
        if json_body is not None:
            body = json.dumps(json_body, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"
        if form_body is not None:
            body = form_encode(form_body).encode("utf-8")
            headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"
        if self.manual_cookie:
            headers["Cookie"] = self.manual_cookie
        if extra_headers:
            headers.update(extra_headers)
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        started = time.time()
        try:
            with self.opener.open(req, timeout=20) as resp:
                text = resp.read().decode("utf-8", errors="replace")
                data = json.loads(text) if text else {}
                return {"ok": True, "status": getattr(resp, "status", 200), "elapsedMs": int((time.time() - started) * 1000), "data": data}
        except urllib.error.HTTPError as e:
            text = e.read().decode("utf-8", errors="replace")
            try:
                data = json.loads(text)
            except Exception:
                data = {"raw": text}
            return {"ok": False, "status": e.code, "elapsedMs": int((time.time() - started) * 1000), "data": data}

    def kcard_home(self):
        if self.live:
            res = self._request("POST", "/KCard/tencent/kcard/vip/retrieveHomePageInfo", json_body={"openid": ""})
            data = res.get("data") or {}
        else:
            data = self.har.kcard_home()
            res = {"ok": True, "mock": True, "data": data}
        home = data.get("data") or {}
        sms = ((home.get("smsInfos") or {}).get("signKcardVip") or {})
        vip = home.get("vipInfo") or {}
        self.kcard_context = {
            "rncPhone": sms.get("encryptPhpne") or "",
            "rncTemplateId": sms.get("encryptTmpId") or "",
            "flowTag": vip.get("flowTag"),
            "phoneMasked": mask_phone(vip.get("phone")),
        }
        res["data"] = sanitize_for_output(res.get("data"))
        res["summary"] = {
            "phoneMasked": self.kcard_context["phoneMasked"],
            "signed": vip.get("signed"),
            "cardTag": vip.get("cardTag"),
            "hasRncPhone": bool(self.kcard_context["rncPhone"]),
            "hasRncTemplate": bool(self.kcard_context["rncTemplateId"]),
        }
        return res

    def kcard_send_sms(self, payload):
        if self.live:
            nvct = payload.get("nvct")
            if not nvct:
                return {"ok": False, "error": "真实模式需要先由用户完成阿里 NVC/滑块并提供 nvct"}
            if not self.kcard_context.get("rncPhone"):
                self.kcard_home()
            form = {
                "phone": self.kcard_context.get("rncPhone"),
                "templateId": self.kcard_context.get("rncTemplateId"),
                "key": "10010",
                "nvct": nvct,
            }
            return self._request("POST", "/captcha/op/getCaptcha", form_body=form, extra_headers={"X-Referer": ORIGIN + "/KCard/page/wkfuliNew2/index.html?ADTAG=MENU#/"})
        sent, data = self.har.kcard_send_sms()
        return {
            "ok": True,
            "mock": True,
            "notice": "当前是 mock 模式：仅回放 HAR 样例，不会真实发送短信。",
            "sent": {k: redact_value(v) for k, v in sent.items()},
            "data": sanitize_for_output(data),
        }

    def kcard_check_sms(self, payload):
        code = str(payload.get("code") or "").strip()
        if not code:
            return {"ok": False, "error": "请输入短信验证码"}
        if self.live:
            if not self.kcard_context.get("rncPhone"):
                self.kcard_home()
            form = {
                "phone": self.kcard_context.get("rncPhone"),
                "templateId": self.kcard_context.get("rncTemplateId"),
                "key": "10010",
                "code": code,
            }
            return self._request("POST", "/captcha/op/checkCode", form_body=form, extra_headers={"X-Referer": ORIGIN + "/KCard/page/wkfuliNew2/index.html?ADTAG=MENU#/"})
        sent, data = self.har.kcard_check_sms()
        return {"ok": True, "mock": True, "sent": {k: redact_value(v) for k, v in sent.items()}, "data": sanitize_for_output(data)}

    def kcard_sign(self, payload):
        if self.live and not require_confirm(payload):
            return {"ok": False, "error": "真实提交需要确认短语：我确认本人办理"}
        body = {"duration": 12, "channel": payload.get("channel", "MENU"), "inviteId": payload.get("inviteId", ""), "actId": payload.get("actId", "")}
        if self.live:
            path = "/KCard/tencent/kcard/vip/welfare/conduct10Gb" if self.kcard_context.get("flowTag") == 2 else "/KCard/tencent/kcard/vip/signAgreementNew"
            return self._request("POST", path, json_body=body)
        sent, data = self.har.kcard_sign()
        return {"ok": True, "mock": True, "sent": sanitize_for_output(sent), "data": sanitize_for_output(data)}

    def super_index(self, payload):
        channel = payload.get("channel") or "CJHY_LTYOUTH_fulishe1"
        params = {"channel": channel, "from": "unicom", "data": payload.get("data", ""), "k": payload.get("k", ""), "v": payload.get("v", ""), "t": str(int(time.time() * 1000))}
        if self.live:
            res = self._request("GET", "/KCard/superVip/V3/indexInfo", params=params)
            data = res.get("data") or {}
        else:
            _, data = self.har.super_index()
            res = {"ok": True, "mock": True, "data": data}
        info = data.get("data") or {}
        packages = info.get("enableOrderPackagesInfo") or []
        package = next((x for x in packages if x.get("type") == "LT_YOUTH"), packages[0] if packages else {})
        mode = (package.get("effectiveModeList") or [{}])[0]
        self.super_context = {
            "channel": channel,
            "data": params["data"],
            "k": params["k"],
            "v": params["v"],
            "rncPhone": info.get("encryptedData") or "",
            "rncTemplateId": mode.get("msgTemplateId") or "",
            "msgKey": mode.get("msgKey") or "superVip",
            "type": package.get("type") or "LT_YOUTH",
            "effectiveMode": mode.get("value") or "00",
            "isPromotion": str(package.get("isPromotion", 0)),
            "phoneMasked": mask_phone(info.get("phone")),
        }
        res["data"] = sanitize_for_output(res.get("data"))
        res["summary"] = {
            "phoneMasked": self.super_context["phoneMasked"],
            "orderStatus": info.get("orderStatus"),
            "selectedType": self.super_context["type"],
            "effectiveMode": self.super_context["effectiveMode"],
            "hasRncPhone": bool(self.super_context["rncPhone"]),
            "hasRncTemplate": bool(self.super_context["rncTemplateId"]),
        }
        return res

    def super_send_sms(self, payload):
        required = ["tencentCaptchaCode", "tencentCaptchaTicket", "tencentCaptchaRandstr", "tencentCaptchaAppId"]
        if self.live and any(not payload.get(k) for k in required):
            return {"ok": False, "error": "真实模式需要用户完成腾讯验证码并提供 tencentCaptcha* 字段"}
        if self.live:
            if not self.super_context.get("rncPhone"):
                self.super_index(payload)
            form = {
                "phone": self.super_context.get("rncPhone"),
                "templateId": self.super_context.get("rncTemplateId"),
                "key": self.super_context.get("msgKey") or "superVip",
                **{k: payload.get(k) for k in required},
            }
            return self._request("POST", "/captcha/op/tc/getCaptcha", form_body=form)
        sent, data = self.har.super_send_sms()
        return {
            "ok": True,
            "mock": True,
            "notice": "当前是 mock 模式：仅回放 HAR 样例，不会真实发送短信。",
            "sent": {k: redact_value(v) for k, v in sent.items()},
            "data": sanitize_for_output(data),
        }

    def super_check_sms(self, payload):
        code = str(payload.get("code") or "").strip()
        if not code:
            return {"ok": False, "error": "请输入短信验证码"}
        if self.live:
            if not self.super_context.get("rncPhone"):
                self.super_index(payload)
            form = {"phone": self.super_context.get("rncPhone"), "templateId": self.super_context.get("rncTemplateId"), "key": self.super_context.get("msgKey") or "superVip", "code": code}
            return self._request("POST", "/captcha/op/tc/checkCode", form_body=form)
        sent, data = self.har.super_check_sms()
        return {"ok": True, "mock": True, "sent": {k: redact_value(v) for k, v in sent.items()}, "data": sanitize_for_output(data)}

    def super_order(self, payload):
        if self.live and not require_confirm(payload):
            return {"ok": False, "error": "真实提交需要确认短语：我确认本人办理"}
        if self.live and not self.super_context.get("rncPhone"):
            self.super_index(payload)
        form = {
            "channel": self.super_context.get("channel") or payload.get("channel") or "CJHY_LTYOUTH_fulishe1",
            "data": self.super_context.get("data") or payload.get("data", ""),
            "k": self.super_context.get("k") or payload.get("k", ""),
            "v": self.super_context.get("v") or payload.get("v", ""),
            "effectiveMode": self.super_context.get("effectiveMode") or "00",
            "agreement": "true",
            "type": self.super_context.get("type") or "LT_YOUTH",
            "isPromotion": str(self.super_context.get("isPromotion") or "0"),
        }
        if self.live:
            return self._request("POST", "/KCard/superVip/V2/orderSuperVip", form_body=form)
        sent, data = self.har.super_order()
        return {"ok": True, "mock": True, "sent": sanitize_for_output(sent), "data": sanitize_for_output(data)}
