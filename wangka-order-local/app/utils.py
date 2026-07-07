import json
import re
from urllib.parse import urlencode


CONFIRM_TEXT = "我确认本人办理"


def json_bytes(value):
    return json.dumps(value, ensure_ascii=False, indent=None).encode("utf-8")


def parse_json_body(raw):
    if not raw:
        return {}
    return json.loads(raw.decode("utf-8"))


def form_encode(params):
    return urlencode(params, doseq=False)


def mask_phone(value):
    text = str(value or "")
    return re.sub(r"(1\d{2})\d{4}(\d{4})", r"\1****\2", text)


def redact_value(value):
    text = str(value or "")
    if not text:
        return ""
    if text.startswith("RNC("):
        return "RNC(...redacted...)"
    if len(text) > 32:
        return text[:8] + "...redacted..." + text[-4:]
    return mask_phone(text)


def sanitize_for_output(value):
    if isinstance(value, dict):
        out = {}
        for key, item in value.items():
            lower = str(key).lower()
            if lower in {"encryptphpne", "encrypttmpid", "encrypteddata", "msgtemplateid"}:
                out[key] = redact_value(item)
            elif lower in {"phone", "curphone", "mobile"}:
                out[key] = mask_phone(item)
            elif "ticket" in lower or lower in {"nvct", "cookie", "tencentcaptcharandstr"}:
                out[key] = redact_value(item)
            else:
                out[key] = sanitize_for_output(item)
        return out
    if isinstance(value, list):
        return [sanitize_for_output(item) for item in value]
    if isinstance(value, str) and value.startswith("RNC("):
        return redact_value(value)
    return value


def require_confirm(payload):
    return str(payload.get("confirmText") or "").strip() == CONFIRM_TEXT


def is_live_enabled():
    import os

    return os.environ.get("WANGKA_LIVE") == "1"
