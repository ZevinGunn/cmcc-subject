const $ = (id) => document.getElementById(id);

let products = [];
let current = null;

const els = {
  productSelect: $("productSelect"),
  configBtn: $("configBtn"),
  toolsBtn: $("toolsBtn"),
  configDialog: $("configDialog"),
  toolsDialog: $("toolsDialog"),
  configText: $("configText"),
  saveConfig: $("saveConfig"),
  addTemplate: $("addTemplate"),
  productName: $("productName"),
  productSummary: $("productSummary"),
  marketStatus: $("marketStatus"),
  productStatus: $("productStatus"),
  loginState: $("loginState"),
  loginStateText: $("loginStateText"),
  loginForm: $("loginForm"),
  logoutBtn: $("logoutBtn"),
  phone: $("phone"),
  loginCode: $("loginCode"),
  orderCode: $("orderCode"),
  sendLoginCode: $("sendLoginCode"),
  loginBtn: $("loginBtn"),
  sendOrderCode: $("sendOrderCode"),
  orderBtn: $("orderBtn"),
  networkBtn: $("networkBtn"),
  confirmHtml: $("confirmHtml"),
  resultLog: $("resultLog"),
  plainText: $("plainText"),
  cipherText: $("cipherText"),
  encryptBtn: $("encryptBtn"),
  parseBtn: $("parseBtn"),
  toolResult: $("toolResult"),
};

let loginInfo = { loggedIn: false, phone: "" };

function selectedProduct() {
  const selectedId = els.productSelect.value || current?.id;
  const product = products.find((item) => item.id === selectedId) || current || products[0];
  current = product || null;
  return current;
}

function log(title, data) {
  els.resultLog.textContent = `${title}\n${JSON.stringify(data, null, 2)}`;
}

function toast(text) {
  els.resultLog.textContent = `${new Date().toLocaleTimeString()}  ${text}\n\n${els.resultLog.textContent}`;
}

async function api(path, body = {}) {
  const product = selectedProduct();
  const productId = product?.id;
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ ...body, productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "请求失败");
  return data;
}

function setLoginState(phone) {
  loginInfo = { loggedIn: Boolean(phone), phone: phone || "" };
  els.loginStateText.textContent = phone ? `已登录 ${phone}` : "未登录";
  els.loginForm.classList.toggle("hidden", Boolean(phone));
  els.logoutBtn.classList.toggle("hidden", !phone);
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();
  products = data.products || [];
  const saved = localStorage.getItem("mqo_product");
  current = products.find((p) => p.id === saved) || products.find((p) => p.enabled !== false) || products[0];
  renderProductSelect();
  renderCurrent();
  els.configText.value = JSON.stringify(products, null, 2);
}

function renderProductSelect() {
  els.productSelect.innerHTML = "";
  for (const product of products) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    option.selected = product.id === current?.id;
    els.productSelect.append(option);
  }
}

function renderCurrent() {
  const product = selectedProduct();
  if (!product) return;
  els.productName.textContent = product.name || "业务快速订购";
  els.productSummary.textContent = product.summary || "请在后台配置业务参数。";
  els.phone.value = localStorage.getItem("mqo_phone") || "";
  els.marketStatus.textContent = "待检测";
  els.productStatus.textContent = "待查询";
  els.confirmHtml.textContent = "登录后查询业务确认信息";
  els.loginCode.value = "";
  els.orderCode.value = "";
  els.plainText.value = JSON.stringify({
    phone: els.phone.value || "13800000000",
    mktCode: product.mktCode,
    channelCode: product.channelCode,
  }, null, 2);
}

function validateProductConfig(product, fields) {
  const missing = fields.filter((field) => !String(product?.[field] || "").trim());
  if (missing.length) {
    throw new Error(`当前业务配置缺少 ${missing.join(", ")}，请先在后台配置中补齐`);
  }
}

function cleanPhone() {
  els.phone.value = els.phone.value.replace(/\D/g, "").slice(0, 11);
  localStorage.setItem("mqo_phone", els.phone.value);
}

function b64ToBytes(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function bytesToBigInt(bytes) {
  let hex = "";
  for (const byte of bytes) hex += byte.toString(16).padStart(2, "0");
  return BigInt(`0x${hex || "0"}`);
}

function bigIntToBytes(value, length) {
  let hex = value.toString(16);
  if (hex.length % 2) hex = `0${hex}`;
  const raw = hex.match(/.{2}/g)?.map((x) => parseInt(x, 16)) || [];
  const out = new Uint8Array(length);
  out.set(raw.slice(-length), length - Math.min(raw.length, length));
  return out;
}

function modPow(base, exponent, modulus) {
  let result = 1n;
  let b = base % modulus;
  let e = exponent;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % modulus;
    e >>= 1n;
    b = (b * b) % modulus;
  }
  return result;
}

function readDerLength(bytes, state) {
  let length = bytes[state.i++];
  if (length < 0x80) return length;
  const count = length & 0x7f;
  length = 0;
  for (let j = 0; j < count; j += 1) length = (length << 8) | bytes[state.i++];
  return length;
}

function readDer(bytes, state, expectedTag) {
  const tag = bytes[state.i++];
  if (expectedTag !== undefined && tag !== expectedTag) throw new Error("公钥 DER 格式不符合预期");
  const length = readDerLength(bytes, state);
  const start = state.i;
  state.i += length;
  return bytes.slice(start, start + length);
}

function parseSpkiPublicKey(publicKey) {
  const root = { i: 0 };
  const seq = readDer(b64ToBytes(publicKey), root, 0x30);
  const state = { i: 0 };
  readDer(seq, state, 0x30);
  const bitString = readDer(seq, state, 0x03);
  const inner = bitString.slice(1);
  const innerState = { i: 0 };
  const rsaSeq = readDer(inner, innerState, 0x30);
  const rsaState = { i: 0 };
  let nBytes = readDer(rsaSeq, rsaState, 0x02);
  let eBytes = readDer(rsaSeq, rsaState, 0x02);
  if (nBytes[0] === 0) nBytes = nBytes.slice(1);
  if (eBytes[0] === 0) eBytes = eBytes.slice(1);
  return { n: bytesToBigInt(nBytes), e: bytesToBigInt(eBytes), keyBytes: nBytes.length };
}

function randomNonZeroBytes(length) {
  const out = new Uint8Array(length);
  let offset = 0;
  while (offset < length) {
    const chunk = new Uint8Array(length - offset);
    crypto.getRandomValues(chunk);
    for (const byte of chunk) {
      if (byte !== 0 && offset < length) out[offset++] = byte;
    }
  }
  return out;
}

async function encryptJson(obj) {
  const product = selectedProduct();
  if (!product?.publicKey) throw new Error("当前业务未配置 publicKey");
  const { n, e, keyBytes } = parseSpkiPublicKey(product.publicKey);
  const encoded = new TextEncoder().encode(JSON.stringify(obj));
  const psLength = keyBytes - encoded.length - 3;
  if (psLength < 8) throw new Error("明文过长，无法用当前 RSA 公钥加密");
  const block = new Uint8Array(keyBytes);
  block[0] = 0;
  block[1] = 2;
  block.set(randomNonZeroBytes(psLength), 2);
  block[2 + psLength] = 0;
  block.set(encoded, 3 + psLength);
  const encrypted = modPow(bytesToBigInt(block), e, n);
  return bytesToBase64(bigIntToBytes(encrypted, keyBytes));
}

function extractData(resp) {
  return resp?.data || resp;
}

async function bootstrapStatus() {
  try {
    const status = await api("/api/status");
    const market = await api("/api/market-status");
    const product = await api("/api/product-info");
    els.marketStatus.textContent = extractData(market).obj?.status === 1 ? "可办理" : "异常";
    const item = extractData(product).obj?.[0];
    els.productStatus.textContent = item?.productName ? "已读取" : "未返回";
    if (item?.productName) els.productName.textContent = item.productName;
    log("初始化完成", { status, market, product });
  } catch (err) {
    log("初始化失败", { msg: err.message });
  }
}

async function networkCheck() {
  const data = await api("/api/network-check");
  if (data.data?.hint) els.marketStatus.textContent = "网络异常";
  log("网络诊断", data);
}

async function sendLoginCode() {
  const product = selectedProduct();
  validateProductConfig(product, ["mktCode", "channelCode", "publicKey"]);
  cleanPhone();
  if (!/^1\d{10}$/.test(els.phone.value)) {
    toast("请输入正确手机号");
    return;
  }
  const plain = {
    phone: els.phone.value,
    mktCode: product.mktCode,
    channelCode: product.channelCode,
  };
  const encipherParam = await encryptJson(plain);
  const data = await api("/api/login/send", { encipherParam });
  log("登录验证码发送结果", { plain, data });
}

async function login() {
  const product = selectedProduct();
  validateProductConfig(product, ["mktCode", "channelCode", "pageCode", "publicKey"]);
  cleanPhone();
  if (!els.loginCode.value.trim()) {
    toast("请输入登录验证码");
    return;
  }
  const plain = {
    mobile: els.phone.value,
    verifyCode: els.loginCode.value.trim(),
    channelCode: product.channelCode,
    mktCode: product.mktCode,
    pageCode: product.pageCode,
  };
  const encipherParam = await encryptJson(plain);
  const data = await api("/api/login/confirm", { encipherParam });
  const obj = extractData(data).obj || {};
  if (obj.phone) setLoginState(obj.phone);
  log("登录结果", { plain, data });
  await loadOrderInfo();
}

async function logout() {
  await api("/api/reset-session");
  setLoginState("");
  els.loginCode.value = "";
  els.orderCode.value = "";
  els.confirmHtml.textContent = "登录后查询业务确认信息";
  toast("已退出登录，可以重新登录");
}

async function loadOrderInfo() {
  validateProductConfig(selectedProduct(), ["mktCode", "productCode"]);
  const data = await api("/api/order/info");
  const obj = extractData(data).obj || {};
  els.confirmHtml.innerHTML = obj.full_descr || obj.short_descr || "未获取到确认信息";
  log("订购确认信息", data);
}

async function sendOrderCode() {
  validateProductConfig(selectedProduct(), ["mktCode", "productCode", "channelCode"]);
  const data = await api("/api/order/send");
  log("订购验证码发送结果", data);
}

async function confirmOrder() {
  validateProductConfig(selectedProduct(), ["mktCode", "productCode", "channelCode"]);
  const verifyCode = els.orderCode.value.trim();
  if (!verifyCode) {
    toast("请输入订购验证码");
    return;
  }
  const data = await api("/api/order/confirm", { verifyCode });
  log("确认订购结果", data);
}

function addTemplate() {
  const arr = JSON.parse(els.configText.value || "[]");
  arr.push({
    id: `new-product-${Date.now()}`,
    name: "新业务",
    host: "https://xyw.bj.10086.cn",
    proxy: "",
    resolveIp: "",
    baseApi: "/mkt_web",
    route: "/example",
    mktId: 0,
    channelCode: "173",
    pageCode: "",
    mktCode: "",
    productCode: "",
    offerId: "",
    publicKey: selectedProduct()?.publicKey || "",
    summary: "",
    enabled: true,
  });
  els.configText.value = JSON.stringify(arr, null, 2);
}

async function saveConfig() {
  const next = JSON.parse(els.configText.value);
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ products: next }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.msg || "保存失败");
  products = data.products;
  current = products.find((p) => p.id === els.productSelect.value) || products.find((p) => p.id === current?.id) || products[0];
  renderProductSelect();
  renderCurrent();
  toast("配置已保存");
}

async function encryptTool() {
  const plain = JSON.parse(els.plainText.value || "{}");
  const encipherParam = await encryptJson(plain);
  els.cipherText.value = encipherParam;
  els.toolResult.textContent = JSON.stringify({ encipherParam }, null, 2);
}

function parseTool() {
  const text = els.cipherText.value.trim();
  if (!text) return;
  try {
    const parsed = JSON.parse(text);
    els.toolResult.textContent = JSON.stringify(parsed, null, 2);
    return;
  } catch {}
  try {
    const decoded = atob(text);
    const parsed = JSON.parse(decoded);
    els.toolResult.textContent = JSON.stringify(parsed, null, 2);
    return;
  } catch {}
  els.toolResult.textContent = [
    "无法解析为 JSON 或 Base64 JSON。",
    "如果这是 encipherParam，它是 RSA 公钥加密后的密文；没有私钥无法解密。",
  ].join("\n");
}

function bindEvents() {
  els.productSelect.addEventListener("change", () => {
    current = selectedProduct();
    localStorage.setItem("mqo_product", current.id);
    renderCurrent();
    if (loginInfo.loggedIn) loadOrderInfo().catch((err) => log("切换业务后查询确认信息失败", { msg: err.message }));
    bootstrapStatus();
  });
  els.phone.addEventListener("input", cleanPhone);
  els.configBtn.addEventListener("click", () => els.configDialog.showModal());
  els.toolsBtn.addEventListener("click", () => els.toolsDialog.showModal());
  els.addTemplate.addEventListener("click", addTemplate);
  els.saveConfig.addEventListener("click", () => saveConfig().catch((err) => toast(err.message)));
  els.sendLoginCode.addEventListener("click", () => sendLoginCode().catch((err) => log("发送登录验证码失败", { msg: err.message })));
  els.loginBtn.addEventListener("click", () => login().catch((err) => log("登录失败", { msg: err.message })));
  els.logoutBtn.addEventListener("click", () => logout().catch((err) => log("退出登录失败", { msg: err.message })));
  els.sendOrderCode.addEventListener("click", () => sendOrderCode().catch((err) => log("发送订购验证码失败", { msg: err.message })));
  els.orderBtn.addEventListener("click", () => confirmOrder().catch((err) => log("确认订购失败", { msg: err.message })));
  els.networkBtn.addEventListener("click", () => networkCheck().catch((err) => log("网络诊断失败", { msg: err.message })));
  els.encryptBtn.addEventListener("click", () => encryptTool().catch((err) => { els.toolResult.textContent = err.message; }));
  els.parseBtn.addEventListener("click", parseTool);
}

bindEvents();
loadProducts().then(bootstrapStatus).catch((err) => log("启动失败", { msg: err.message }));
