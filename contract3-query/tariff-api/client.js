'use strict';
/**
 * 资费接口客户端 —— 纯 HTTP，不依赖浏览器
 * ------------------------------------------------------------------
 * 请求体与响应体都是 AES 密文，请求头带 x-token / x-sign / x-time / x-nonce 四件套，
 * 全部由 src/crypto.js 本地计算。
 */

const https = require('https');
const crypto = require('crypto');
const { encrypt, decrypt, buildAuth } = require('./crypto');

// 站点部分服务器要求「不安全的重协商」（老式 TLS 行为），现代 OpenSSL 默认拒绝，
// 表现为 fetch failed / EPROTO。curl 能通是因为它放宽了这一项。
// 不打开这个开关，脚本会时好时坏 —— 连到哪台服务器全看运气。
// 用 https 模块而非 fetch：undici 不暴露这个 OpenSSL 选项。
const agent = new https.Agent({
  keepAlive: true,
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

/** 发一个 POST，返回 { status, text }。 */
function httpsPost(url, body, headers, timeoutMs) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      agent,
      headers: { ...headers, 'content-length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { data += c; });
      res.on('error', reject);
      res.on('aborted', () => reject(new Error('响应流中断 (aborted)')));
      res.on('end', () => resolve({ status: res.statusCode, text: data }));
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error('超时')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const ORIGIN = 'https://h.app.coc.10086.cn';
const CELL_NUM = '99999999999';           // 未登录态的占位手机号，照抄页面行为
const API_BASE = '/website/nrapigate/nrtariff/new/Tariff/';
const TIMEOUT_MS = 20000;                 // 单次请求超时，避免服务端不响应时永久挂起

/** 省份名 → 省级编码。从页面 tariffZonePers.js 的省份列表提取，共 31 项。 */
const PROVINCE_CODE = {
  北京市: '100', 广东省: '200', 上海市: '210', 天津市: '220',
  重庆市: '230', 辽宁省: '240', 江苏省: '250', 湖北省: '270',
  四川省: '280', 陕西省: '290', 河北省: '311', 山西省: '351',
  河南省: '371', 吉林省: '431', 黑龙江省: '451', 内蒙古: '471',
  山东省: '531', 安徽省: '551', 浙江省: '571', 福建省: '591',
  湖南省: '731', 广西: '771', 江西省: '791', 贵州省: '851',
  云南省: '871', 西藏: '891', 海南省: '898', 甘肃省: '931',
  宁夏: '951', 青海省: '971', 新疆: '991',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 请求头里与签名无关的固定部分，抽出来避免每次重建 */
function baseHeaders() {
  return {
    'content-type': 'application/json; charset=UTF-8',
    accept: 'application/json, text/plain, */*',
    origin: ORIGIN,
    referer: `${ORIGIN}/cmcc-app/pc-pages/tariffZonePers.html`,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
    'x-app-version': '1.0.1',
    'x-apptoken': 'JSESSIONID=;UID=;ticketID=;Comment=SessionServer-unity',
    'x-group-env': '',
    pagetype: '',
  };
}

/**
 * 调用一个资费接口，返回解密后的 JSON。
 *
 * 重试策略：网络异常与 5xx（服务端问题）重试；4xx 与解密失败不重试 ——
 * 后者说明算法或参数已失效，重试只是白白多打几次，徒增被封风险。
 *
 * @param {string} api    接口名，如 'getTariffListInfo'
 * @param {object} params 业务参数
 */
async function call(api, params = {}) {
  const urlPath = API_BASE + api;
  const url = ORIGIN + urlPath;
  let lastErr;

  for (let attempt = 0; attempt <= 1; attempt++) {
    const auth = buildAuth(urlPath);
    const body = encrypt(JSON.stringify({ ...params, xk: auth.xk }));

    let resp;
    try {
      resp = await httpsPost(url, body, {
        ...baseHeaders(),
        'x-token': auth.xToken,
        'x-sign': auth.xSign,
        'x-time': auth.xTime,
        'x-nonce': auth.xNonce,
        trace: `${auth.xk}_${urlPath}_${auth.xTime}_${auth.xNonce}`,
      }, TIMEOUT_MS);
    } catch (e) {
      lastErr = new Error(`请求 ${api} 失败: ${e.message}`);
      if (attempt === 0) { await sleep(1000); continue; }
      throw lastErr;
    }

    const text = resp.text;
    if (resp.status < 200 || resp.status >= 300) {
      lastErr = new Error(`${api} HTTP ${resp.status}: ${text.slice(0, 120)}`);
      if (resp.status >= 500 && attempt === 0) { await sleep(1000); continue; }
      throw lastErr;
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      // 返回非 JSON（例如网关的 HTML 错误页）时直接报错，
      // 不能把原文当数据往上抛，那会让调用方拿到一坨 HTML 还以为是业务数据
      throw new Error(`${api} 响应不是 JSON（前 120 字符）: ${text.slice(0, 120)}`);
    }

    if (payload && typeof payload.body === 'string') {
      try {
        return JSON.parse(decrypt(payload.body));
      } catch (e) {
        // 解密失败通常是密钥或算法变了，重试无意义
        throw new Error(`${api} 响应解密失败: ${e.message}`);
      }
    }
    return payload;
  }
  throw lastErr;
}

module.exports = { call, PROVINCE_CODE, ORIGIN, CELL_NUM };
