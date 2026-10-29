const $ = (id) => document.getElementById(id);
const result = $("result");

function show(title, data) {
  result.textContent = `${title}\n${JSON.stringify(data, null, 2)}`;
}

async function api(path, body = {}) {
  const res = await fetch(path, {
    method: path === "/api/status" ? "GET" : "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: path === "/api/status" ? undefined : JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    show("请求失败", data);
    return data;
  }
  show(path, data);
  return data;
}

async function refreshStatus() {
  const res = await fetch("/api/status");
  const data = await res.json();
  $("modeText").textContent = data.live ? "真实模式：会调用上游接口，提交前需要确认短语。" : "Mock 模式：只读取 HAR 样例，不会发送短信或订购。";
  show("运行状态", data);
}

$("statusBtn").onclick = refreshStatus;
$("saveCookieBtn").onclick = () => api("/api/session/cookie", { cookie_header: $("cookieText").value });

$("kHomeBtn").onclick = () => api("/api/kcard/home");
$("kSendBtn").onclick = () => api("/api/kcard/sms/send", { nvct: $("nvctText").value });
$("kCheckBtn").onclick = () => api("/api/kcard/sms/check", { code: $("kCode").value });
$("kSignBtn").onclick = () => api("/api/kcard/sign", { confirmText: $("kConfirm").value, channel: "MENU" });

$("sIndexBtn").onclick = () => api("/api/super-youth/index", { channel: $("channel").value });
$("sSendBtn").onclick = () => api("/api/super-youth/sms/send", {
  channel: $("channel").value,
  tencentCaptchaCode: $("tcCode").value,
  tencentCaptchaTicket: $("tcTicket").value,
  tencentCaptchaRandstr: $("tcRandstr").value,
  tencentCaptchaAppId: $("tcAppId").value,
});
$("sCheckBtn").onclick = () => api("/api/super-youth/sms/check", { code: $("sCode").value, channel: $("channel").value });
$("sOrderBtn").onclick = () => api("/api/super-youth/order", { confirmText: $("sConfirm").value, channel: $("channel").value });

refreshStatus();
