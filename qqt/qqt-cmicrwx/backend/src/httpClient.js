import fetch from "node-fetch";
import { TARGET_BASE, TARGET_ORIGIN, TARGET_REFERER } from "./config.js";

const DEFAULT_HEADERS = {
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
  Origin: TARGET_ORIGIN,
  Referer: TARGET_REFERER,
  "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8",
};

export async function proxyRequest(path, options = {}) {
  const url = `${TARGET_BASE}${path}`;
  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.headers || {}),
  };
  const resp = await fetch(url, {
    ...options,
    headers,
  });
  const cookies = resp.headers.raw()["set-cookie"] || [];
  const contentType = resp.headers.get("content-type") || "";
  let data;
  try {
    if (contentType.includes("application/json")) {
      data = await resp.json();
    } else {
      const text = await resp.text();
      data = parseMaybeJson(text);
    }
  } catch (error) {
    data = {
      status: -1,
      msg: "响应解析失败",
      raw: await resp.text().catch(() => null),
    };
  }
  return {
    data,
    cookies,
    status: resp.status,
  };
}

function parseMaybeJson(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
}

