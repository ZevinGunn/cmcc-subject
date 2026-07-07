const state = {
  mode: 'v1',
  lastResult: null,
  builtUrl: ''
};

const $ = (id) => document.getElementById(id);

const els = {
  phone: $('phoneInput'),
  nation: $('nationSelect'),
  puzzle: $('puzzleInput'),
  smsCode: $('smsCodeInput'),
  sourceId: $('sourceIdInput'),
  url: $('urlInput'),
  result: $('resultOutput'),
  status: $('statusText'),
  loginPill: $('loginPill'),
  sessionList: $('sessionList'),
  sessionTime: $('sessionTime'),
  builtUrl: $('builtUrlOutput')
};

const defaultJumpTemplate =
  'https://wx.10086.cn/website/businessPlatform/flowShop?secondChannel=P00000116110&netToken=#ssoToken&targetSourceId=017018';

const stepMap = {
  key: document.querySelector('[data-step="key"]'),
  sms: document.querySelector('[data-step="sms"]'),
  login: document.querySelector('[data-step="login"]'),
  sso: document.querySelector('[data-step="sso"]')
};

document.querySelectorAll('.segment').forEach((button) => {
  button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    document.querySelectorAll('.segment').forEach((item) => item.classList.toggle('active', item === button));
  });
});

$('refreshSessionBtn').addEventListener('click', refreshSession);
$('publicKeyBtn').addEventListener('click', () => runStep('key', '获取 RSA 公钥', '/api/auth/public-key', {}));
$('smsBtn').addEventListener('click', sendSms);
$('loginBtn').addEventListener('click', login);
$('ssoBtn').addEventListener('click', getSsoToken);
$('defaultJumpBtn').addEventListener('click', buildDefaultJump);
$('buildUrlBtn').addEventListener('click', buildUrl);
$('clearBtn').addEventListener('click', clearSession);
$('copyResultBtn').addEventListener('click', () => copyText(JSON.stringify(state.lastResult || {}, null, 2)));
$('copyUrlBtn').addEventListener('click', () => copyText(state.builtUrl || els.builtUrl.value));

refreshSession();
initCaptcha();

async function sendSms() {
  const phone = requirePhone();
  if (!phone) return;
  await runStep('sms', '发送短信验证码', '/api/auth/send-sms', {
    phone,
    nationCode: els.nation.value,
    puzzleVerifyCode: els.puzzle.value.trim()
  });
}

function initCaptcha() {
  const status = $('captchaStatus');
  const button = '#captchaTriggerBtn';
  const element = '#captcha-element';

  const boot = () => {
    if (!window.initAliyunCaptcha) {
      status.textContent = '官方滑块脚本未加载，可稍后刷新页面或手动填写滑块结果。';
      return;
    }
    try {
      window.initAliyunCaptcha({
        SceneId: '1rmw421p',
        mode: 'popup',
        element,
        button,
        slideStyle: { width: 320, height: 40 },
        language: 'cn',
        getInstance(instance) {
          window.__yunpanCaptcha = instance;
          status.textContent = '官方滑块已就绪。';
        },
        async captchaVerifyCallback(captchaVerifyParam) {
          els.puzzle.value = captchaVerifyParam;
          status.textContent = '滑块完成，已写入验证参数，请重新发送验证码。';
          return { captchaResult: true, bizResult: true };
        },
        onBizResultCallback() {}
      });
    } catch (error) {
      status.textContent = `滑块初始化失败：${error.message}`;
    }
  };

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot, { once: true });
  }
}

async function login() {
  const phone = requirePhone();
  if (!phone) return;
  const smsCode = els.smsCode.value.trim();
  if (!smsCode) {
    setStatus('请输入短信验证码', 'err');
    return;
  }
  await runStep('login', '登录并保存 Token', '/api/auth/login', {
    phone,
    smsCode,
    nationCode: els.nation.value,
    returnToken: true,
    autoLogin: true,
    ssoMode: state.mode
  });
}

async function getSsoToken() {
  await runStep('sso', '获取 ssoToken', '/api/auth/sso-token', {
    toSourceId: els.sourceId.value.trim() || '001005',
    mode: state.mode
  });
}

async function buildUrl() {
  const url = els.url.value.trim() || defaultJumpTemplate;
  if (!url) {
    setStatus('请输入跳转链接', 'err');
    return;
  }
  const result = await api('/api/tools/build-url', {
    url,
    appendAccount: !isDefaultJumpTemplate(url)
  });
  state.builtUrl = result.url || '';
  els.builtUrl.value = state.builtUrl;
  state.lastResult = result;
  renderResult(result);
  setStatus(result.success ? '认证链接已生成' : '生成失败', result.success ? 'ok' : 'err');
}

async function buildDefaultJump() {
  setBusy(true);
  setStatus('生成 10086 跳转中', 'warn');
  try {
    const result = await api('/api/tools/default-jump', { mode: state.mode });
    state.builtUrl = result.url || '';
    els.builtUrl.value = state.builtUrl;
    if (!els.url.value.trim()) els.url.value = result.template || defaultJumpTemplate;
    state.lastResult = result;
    renderResult(result);
    setStatus(result.success ? '10086 跳转链接已生成' : '生成 10086 跳转失败', result.success ? 'ok' : 'err');
    await refreshSession(false);
  } catch (error) {
    const payload = { success: false, message: error.message };
    state.lastResult = payload;
    renderResult(payload);
    setStatus('生成 10086 跳转失败', 'err');
  } finally {
    setBusy(false);
  }
}

async function clearSession() {
  const result = await api('/api/session/clear', {});
  state.lastResult = result;
  renderResult(result);
  updateSession(result.session);
  setStatus('本地会话已清空', 'warn');
  Object.values(stepMap).forEach((step) => step.classList.remove('done', 'active'));
}

async function runStep(step, label, url, body) {
  markActive(step);
  setBusy(true);
  setStatus(`${label}中`, 'warn');
  try {
    const result = await api(url, body);
    state.lastResult = result;
    if (result.defaultJump?.url) {
      state.builtUrl = result.defaultJump.url;
      els.builtUrl.value = result.defaultJump.url;
      els.url.value = result.defaultJump.template || els.url.value || defaultJumpTemplate;
    }
    renderResult(result);
    setStatus(result.success ? `${label}成功` : `${label}未完成`, result.success ? 'ok' : 'err');
    stepMap[step].classList.toggle('done', Boolean(result.success));
    await refreshSession(false);
  } catch (error) {
    const payload = { success: false, message: error.message };
    state.lastResult = payload;
    renderResult(payload);
    setStatus(`${label}失败`, 'err');
  } finally {
    setBusy(false);
    stepMap[step].classList.remove('active');
  }
}

async function refreshSession(showStatus = true) {
  const res = await fetch('/api/session');
  const result = await res.json();
  updateSession(result.session, result.secrets);
  if (showStatus) setStatus('会话已刷新', result.session?.hasAuthorization ? 'ok' : 'warn');
}

async function api(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);
  return result;
}

function requirePhone() {
  const phone = els.phone.value.trim();
  if (!phone) {
    setStatus('请输入手机号', 'err');
    return '';
  }
  return phone;
}

function renderResult(result) {
  els.result.textContent = JSON.stringify(result, null, 2);
}

function updateSession(session = {}, secrets = {}) {
  const rows = [
    ['账号', session.account || '-'],
    ['完整账号', session.completeAccount || '-'],
    ['Authorization', session.hasAuthorization ? '已生成' : '未生成'],
    ['authToken', secrets.authToken || (session.hasAuthToken ? '已保存' : '-')],
    ['token', secrets.token || (session.hasEncryptedToken ? '已保存' : '-')],
    ['ssoToken', secrets.ssoToken || (session.hasLastSsoToken ? '已保存' : '-')],
    ['用户域', session.userDomainId || '-'],
    ['切流状态', session.cutoverStatus || '-'],
    ['平台', session.belongsPlatform || '-'],
    ['国家码', session.nationCode || '-'],
    ['上次 sourceId', session.lastSsoSourceId || '-'],
    ['上次跳转', session.lastBuiltUrl ? '已缓存' : '-'],
    ['短信随机串', session.lastSmsRandom || '-'],
    ['模块数', session.routerModules?.length || 0]
  ];
  els.sessionList.innerHTML = rows
    .map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(String(value))}</dd></div>`)
    .join('');
  els.sessionTime.textContent = session.updatedAt ? new Date(session.updatedAt).toLocaleString() : '-';
  els.loginPill.textContent = session.hasAuthorization ? '已登录' : '未登录';
  els.loginPill.classList.toggle('ok', Boolean(session.hasAuthorization));
  els.loginPill.classList.toggle('err', false);
  if (session.completeAccount && !els.phone.value.trim()) {
    els.phone.value = session.completeAccount;
  }
  if (session.lastSsoSourceId && !els.sourceId.value.trim()) {
    els.sourceId.value = session.lastSsoSourceId;
  }
  if (session.lastJumpTemplate && !els.url.value.trim()) {
    els.url.value = session.lastJumpTemplate;
  }
  if (session.lastBuiltUrl) {
    state.builtUrl = session.lastBuiltUrl;
    els.builtUrl.value = session.lastBuiltUrl;
  }
}

function setStatus(text, tone) {
  els.status.textContent = text;
  els.loginPill.classList.toggle('err', tone === 'err');
  if (tone === 'ok') els.loginPill.classList.add('ok');
}

function markActive(step) {
  Object.values(stepMap).forEach((item) => item.classList.remove('active'));
  stepMap[step].classList.add('active');
}

function setBusy(busy) {
  document.body.classList.toggle('busy', busy);
}

async function copyText(text) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  setStatus('已复制', 'ok');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isDefaultJumpTemplate(url) {
  return /wx\.10086\.cn\/website\/businessPlatform\/flowShop/.test(url);
}
