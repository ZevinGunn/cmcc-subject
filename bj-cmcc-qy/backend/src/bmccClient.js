import { config } from "./config.js";
import { aesCbcEncryptJson, sortedTruthyPayload, timestamp14, randomString, tryBase64Json, tryJson } from "./utils/crypto.js";

export class BmccClient {
  constructor(session = null) {
    this.session = session;
  }

  async invoke(abilityCode, body = {}, options = {}) {
    const rowPayload = this.buildRowPayload(abilityCode, body, options);
    const signed = sortedTruthyPayload(rowPayload);
    const encrypted = aesCbcEncryptJson(signed, config.aesKey, config.aesIv);
    const payload = this.buildTransportPayload(encrypted);

    const response = await fetch(`${config.bmccBaseUrl}/api/outer/invoke.do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        source: config.source,
        ...(this.session?.sessKey ? { sessKey: this.session.sessKey } : {}),
        ...(options.headers || {})
      },
      body: payload
    });

    const rawText = await response.text();
    const raw = tryJson(rawText);
    const normalized = this.normalizeResponse(raw, response.status);
    normalized._debug = {
      status: response.status,
      abilityCode,
      requestBody: body,
      rowPayload,
      transportMode: config.requestMode
    };
    return normalized;
  }

  async getToken() {
    const signed = sortedTruthyPayload({ appid: "1", key: config.tokenKey });
    const response = await fetch(`${config.bmccBaseUrl}/api/outer/getToken.do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        source: config.source
      },
      body: JSON.stringify(signed)
    });
    return this.normalizeResponse(tryJson(await response.text()), response.status);
  }

  buildRowPayload(abilityCode, body, options = {}) {
    const payload = {
      sessKey: this.session?.sessKey || null,
      sessType: this.session?.sessType || null,
      body: JSON.stringify(body || {}) || null,
      accessToken: config.accessToken,
      abilityCode,
      transactionId: `1${timestamp14()}${randomString(8)}`
    };

    const phoneNo = options.traceMemberPhone || this.session?.userInfo?.phoneNo || body?.receviNo || body?.phoneNo;
    if (phoneNo) payload.traceMemberPhone = phoneNo;
    return payload;
  }

  buildTransportPayload(encrypted) {
    if (config.requestMode === "json-data") return JSON.stringify({ data: encrypted });
    if (config.requestMode === "raw") return encrypted;
    return JSON.stringify(encrypted);
  }

  normalizeResponse(raw, status) {
    raw = tryBase64Json(raw);
    const fallback = {
      resultCode: status >= 200 && status < 300 ? "-1" : String(status),
      resultMsg: "",
      data: null,
      raw
    };
    if (!raw || typeof raw !== "object") return fallback;

    const normalized = {
      resultCode: raw.resultCode || fallback.resultCode,
      resultMsg: raw.resultMsg || raw.message || "",
      data: null,
      raw
    };

    if (raw.body != null) normalized.data = tryJson(raw.body);
    if (raw.resultData != null) normalized.data = tryJson(raw.resultData);
    if (raw.data != null && normalized.data == null) normalized.data = tryJson(raw.data);
    return normalized;
  }
}

export function clientFor(session) {
  return new BmccClient(session);
}
