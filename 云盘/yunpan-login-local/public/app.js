const state = {
  mode: 'v1',
  lastResult: null,
  builtUrl: '',
  globalUrl: '',
  builtStatus: 'initial',
  globalStatus: 'initial',
  cookieStatus: 'initial'
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
  builtUrl: $('builtUrlOutput'),
  globalUrl: $('globalUrlOutput'),
  wxCookie: $('wxCookieOutput'),
  builtFreshness: $('builtUrlFreshness'),
  globalFreshness: $('globalUrlFreshness'),
  cookieFreshness: $('wxCookieFreshness'),
  copyBuilt: $('copyUrlBtn'),
  copyGlobal: $('copyGlobalUrlBtn'),
  copyCookie: $('copyWxCookieBtn')
};

const defaultSourceId = '001003';
const defaultJumpTemplate =
  `https://wx.10086.cn/website/businessPlatform/flowShop?secondChannel=P00000116110&netToken=#ssoToken&targetSourceId=${defaultSourceId}`;

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
$('globalJumpBtn').addEventListener('click', buildGlobalJump);
$('buildUrlBtn').addEventListener('click', buildUrl);
$('wxCookieBtn').addEventListener('click', getWxCookie);
$('clearBtn').addEventListener('click', clearSession);
$('copyResultBtn').addEventListener('click', () => copyText(JSON.stringify(state.lastResult || {}, null, 2)));
els.copyBuilt.addEventListener('click', () => copyText(els.builtUrl.value));
els.copyGlobal.addEventListener('click', () => copyText(els.globalUrl.value));
els.copyCookie.addEventListener('click', () => copyText(els.wxCookie.value));

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
  const toSourceId = els.sourceId.value.trim();
  if (!toSourceId) {
    setStatus('toSourceId 不能为空', 'err');
    els.sourceId.focus();
    return;
  }
  await runStep('sso', '获取 ssoToken', '/api/auth/sso-token', {
    toSourceId,
    mode: state.mode
  });
}

async function buildUrl() {
  const url = els.url.value.trim() || defaultJumpTemplate;
  if (!url) {
    setStatus('请输入跳转链接', 'err');
    return;
  }
  const toSourceId = els.sourceId.value.trim();
  if (!toSourceId) {
    setStatus('toSourceId 不能为空', 'err');
    els.sourceId.focus();
    return;
  }
  beginLiveOutput('built', '现场换票中');
  setBusy(true);
  setStatus('现场换票并生成认证链接中', 'warn');
  try {
    const result = await api('/api/tools/build-url', {
      url,
      toSourceId,
      mode: state.mode,
      appendAccount: !isDefaultJumpTemplate(url)
    });
    applyLiveBuiltUrl(result);
    state.lastResult = result;
    renderResult(result);
    setStatus(result.success ? '认证链接已现场换票生成' : '生成失败', result.success ? 'ok' : 'err');
    await refreshSession(false);
  } catch (error) {
    handleOutputError('built', error);
    setStatus('生成认证链接失败', 'err');
  } finally {
    setBusy(false);
  }
}

async function buildDefaultJump() {
  beginLiveOutput('built', '现场换票中');
  setBusy(true);
  setStatus('生成 10086 跳转中', 'warn');
  try {
    const result = await api('/api/tools/default-jump', { mode: state.mode });
    applyLiveBuiltUrl(result);
    if (!els.url.value.trim()) els.url.value = result.template || defaultJumpTemplate;
    state.lastResult = result;
    renderResult(result);
    setStatus(result.success ? '10086 跳转链接已生成' : '生成 10086 跳转失败', result.success ? 'ok' : 'err');
    await refreshSession(false);
  } catch (error) {
    handleOutputError('built', error);
    setStatus('生成 10086 跳转失败', 'err');
  } finally {
    setBusy(false);
  }
}

async function buildGlobalJump() {
  beginLiveOutput('global', '现场换票中');
  setBusy(true);
  setStatus('生成全球通跳转中', 'warn');
  try {
    const result = await api('/api/tools/global-jump', { mode: state.mode });
    applyLiveGlobalUrl(result);
    state.lastResult = result;
    renderResult(result);
    setStatus(result.success ? '全球通跳转链接已生成' : '生成全球通跳转失败', result.success ? 'ok' : 'err');
    await refreshSession(false);
  } catch (error) {
    handleOutputError('global', error);
    setStatus('生成全球通跳转失败', 'err');
  } finally {
    setBusy(false);
  }
}

async function getWxCookie() {
  beginLiveOutput('cookie', '现场换票并获取中');
  setBusy(true);
  setStatus('现场换票并获取 wx.10086 上游 CK 中', 'warn');
  try {
    const result = await api('/api/tools/wx-cookie', {
      mode: state.mode,
      refreshJump: true
    });
    els.wxCookie.value = result.cookie || '';
    state.cookieStatus = result.success ? 'live' : 'error';
    setFreshness(
      els.cookieFreshness,
      result.success ? liveLabel(result.generatedAt) : '获取失败',
      result.success ? 'live' : 'error'
    );
    els.copyCookie.disabled = !result.success || !result.cookie;
    if (result.jump?.url) {
      applyLiveBuiltUrl({
        success: true,
        url: result.jump.url,
        generatedAt: result.jump.generatedAt,
        upstreamReusedTicket: result.jump.upstreamReusedTicket
      });
    }
    state.lastResult = {
      ...result,
      cookie: result.cookiePreview || result.cookie
    };
    renderResult(state.lastResult);
    setStatus(result.success ? 'wx.10086 上游 CK 已获取' : '未获取到上游 CK', result.success ? 'ok' : 'err');
    await refreshSession(false);
  } catch (error) {
    handleOutputError('cookie', error);
    setStatus('获取 wx.10086 上游 CK 失败', 'err');
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
  state.builtUrl = '';
  state.globalUrl = '';
  state.builtStatus = 'initial';
  state.globalStatus = 'initial';
  state.cookieStatus = 'initial';
  els.builtUrl.value = '';
  els.globalUrl.value = '';
  els.wxCookie.value = '';
  setFreshness(els.builtFreshness, '未生成');
  setFreshness(els.globalFreshness, '未生成');
  setFreshness(els.cookieFreshness, '未获取');
  els.copyBuilt.disabled = true;
  els.copyGlobal.disabled = true;
  els.copyCookie.disabled = true;
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
      applyLiveBuiltUrl(result.defaultJump);
      els.url.value = result.defaultJump.template || els.url.value || defaultJumpTemplate;
    }
    renderResult(result);
    setStatus(result.success ? `${label}成功` : `${label}未完成`, result.success ? 'ok' : 'err');
    stepMap[step].classList.toggle('done', Boolean(result.success));
    await refreshSession(false);
  } catch (error) {
    const payload = errorResult(error);
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
  const requestId = res.headers.get('x-request-id') || '';
  if (requestId && result && typeof result === 'object') result.requestId = requestId;
  if (!res.ok) {
    const error = new Error(result.message || `HTTP ${res.status}`);
    error.requestId = requestId;
    throw error;
  }
  return result;
}

function errorResult(error) {
  return {
    success: false,
    message: error.message,
    requestId: error.requestId || ''
  };
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
  const authLabels = {
    active: '本轮登录成功',
    cached: '已缓存，待验证',
    failed: '本轮登录失败',
    'signed-out': '未登录'
  };
  const authLabel = authLabels[session.authState] || '未登录';
  const rows = [
    ['账号', session.account || '-'],
    ['完整账号', session.completeAccount || '-'],
    ['登录状态', authLabel],
    ['登录错误', session.lastLoginErrorCode ? `${session.lastLoginErrorCode} ${session.lastLoginErrorMessage || ''}`.trim() : '-'],
    ['Authorization', session.hasAuthorization ? '已生成' : '未生成'],
    ['authToken', secrets.authToken || (session.hasAuthToken ? '已保存' : '-')],
    ['token', secrets.token || (session.hasEncryptedToken ? '已保存' : '-')],
    ['ssoToken', secrets.ssoToken || (session.hasLastSsoToken ? '已保存' : '-')],
    ['用户域', session.userDomainId || '-'],
    ['切流状态', session.cutoverStatus || '-'],
    ['平台', session.belongsPlatform || '-'],
    ['国家码', session.nationCode || '-'],
    ['上次 sourceId', session.lastSsoSourceId || '-'],
    ['上次换票', session.lastSsoReceivedAt ? formatTime(session.lastSsoReceivedAt) : '-'],
    ['上次跳转', session.lastBuiltUrl ? cachedLabel(session.lastBuiltAt) : '-'],
    ['wx CK', secrets.wxCookie || (session.hasLastWxCookie ? '已保存' : '-')],
    ['CK 来源', session.lastWxCookieSource === 'upstream-set-cookie' ? '上游 Set-Cookie' : '-'],
    ['上游 CK 项', session.lastWxUpstreamCookieNames?.join(', ') || '-'],
    ['wx 认证', session.hasLastWxAuthToken ? '已完成' : '-'],
    ['全球通跳转', session.lastGlobalTelecomUrl ? cachedLabel(session.lastGlobalTelecomAt) : '-'],
    ['短信随机串', session.lastSmsRandom || '-'],
    ['模块数', session.routerModules?.length || 0]
  ];
  els.sessionList.innerHTML = rows
    .map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(String(value))}</dd></div>`)
    .join('');
  els.sessionTime.textContent = session.updatedAt ? new Date(session.updatedAt).toLocaleString() : '-';
  els.loginPill.textContent = authLabel;
  els.loginPill.classList.toggle('ok', session.authState === 'active');
  els.loginPill.classList.toggle('err', session.authState === 'failed');
  if (session.completeAccount && !els.phone.value.trim()) {
    els.phone.value = session.completeAccount;
  }
  if (session.lastSsoSourceId && !els.sourceId.value.trim()) {
    els.sourceId.value = session.lastSsoSourceId;
  }
  if (session.lastJumpTemplate && !els.url.value.trim()) {
    els.url.value = session.lastJumpTemplate;
  }
  if (session.lastBuiltUrl && state.builtStatus === 'initial') {
    state.builtUrl = session.lastBuiltUrl;
    els.builtUrl.value = session.lastBuiltUrl;
    state.builtStatus = 'cached';
    setFreshness(els.builtFreshness, cachedLabel(session.lastBuiltAt), 'cached');
    els.copyBuilt.disabled = true;
  }
  if (session.lastGlobalTelecomUrl && state.globalStatus === 'initial') {
    state.globalUrl = session.lastGlobalTelecomUrl;
    els.globalUrl.value = session.lastGlobalTelecomUrl;
    state.globalStatus = 'cached';
    setFreshness(els.globalFreshness, cachedLabel(session.lastGlobalTelecomAt), 'cached');
    els.copyGlobal.disabled = true;
  }
  if (secrets.wxCookieValue && state.cookieStatus === 'initial') {
    els.wxCookie.value = secrets.wxCookieValue;
    state.cookieStatus = 'cached';
    setFreshness(els.cookieFreshness, cachedLabel(session.lastWxCookieAt), 'cached');
    els.copyCookie.disabled = true;
  } else if (secrets.wxCookie && state.cookieStatus === 'initial') {
    els.wxCookie.placeholder = `已缓存：${secrets.wxCookie}`;
  }
}

function beginLiveOutput(kind, label) {
  if (kind === 'built') {
    state.builtUrl = '';
    state.builtStatus = 'loading';
    els.builtUrl.value = '';
    els.copyBuilt.disabled = true;
    setFreshness(els.builtFreshness, label, 'loading');
  } else if (kind === 'global') {
    state.globalUrl = '';
    state.globalStatus = 'loading';
    els.globalUrl.value = '';
    els.copyGlobal.disabled = true;
    setFreshness(els.globalFreshness, label, 'loading');
  } else {
    state.cookieStatus = 'loading';
    els.wxCookie.value = '';
    els.copyCookie.disabled = true;
    setFreshness(els.cookieFreshness, label, 'loading');
  }
}

function applyLiveBuiltUrl(result = {}) {
  const success = Boolean(result.success && result.url);
  state.builtUrl = success ? result.url : '';
  state.builtStatus = success ? 'live' : 'error';
  els.builtUrl.value = state.builtUrl;
  els.copyBuilt.disabled = !success;
  setFreshness(
    els.builtFreshness,
    success ? liveLabel(result.generatedAt, result.upstreamReusedTicket) : '生成失败',
    success ? 'live' : 'error'
  );
}

function applyLiveGlobalUrl(result = {}) {
  const success = Boolean(result.success && result.url);
  state.globalUrl = success ? result.url : '';
  state.globalStatus = success ? 'live' : 'error';
  els.globalUrl.value = state.globalUrl;
  els.copyGlobal.disabled = !success;
  setFreshness(
    els.globalFreshness,
    success ? liveLabel(result.generatedAt, result.upstreamReusedTicket) : '生成失败',
    success ? 'live' : 'error'
  );
}

function handleOutputError(kind, error) {
  const payload = errorResult(error);
  state.lastResult = payload;
  renderResult(payload);
  if (kind === 'built') {
    state.builtStatus = 'error';
    setFreshness(els.builtFreshness, '生成失败', 'error');
  } else if (kind === 'global') {
    state.globalStatus = 'error';
    setFreshness(els.globalFreshness, '生成失败', 'error');
  } else {
    state.cookieStatus = 'error';
    setFreshness(els.cookieFreshness, '获取失败', 'error');
  }
}

function setFreshness(element, text, tone = '') {
  element.textContent = text;
  element.className = `freshness${tone ? ` ${tone}` : ''}`;
}

function liveLabel(generatedAt, upstreamReusedTicket = false) {
  const prefix = upstreamReusedTicket ? '实时请求 · 上游复用票据' : '实时请求';
  return generatedAt ? `${prefix} · ${formatTime(generatedAt)}` : prefix;
}

function cachedLabel(generatedAt) {
  return generatedAt ? `缓存 · ${formatTime(generatedAt)}` : '缓存';
}

function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
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
