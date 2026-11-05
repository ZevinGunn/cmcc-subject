'use strict';
/**
 * 资费公示专区的网关加密实现
 * ------------------------------------------------------------------
 * 全部算法由逆向 chunk-common.js 得出，并经真实报文逐字节验证：
 *   - 密钥与 IV 在源码里是拼接出来的，不是字面量，直接搜是搜不到的
 *   - 请求体/响应体走 AES-128-CBC + Pkcs7，密文以【大写十六进制】传输
 *     （CryptoJS 的 ciphertext.toString() 默认输出 hex，这就是 postData 是 hex 的原因）
 *   - x-sign 是 MD5，拼接串末尾的 JSESSIONID 为空时会变成字符串 "null"
 *
 * 站点改版即失效 —— 这是这套方案的固有代价，换来的是无需浏览器、速度快两个数量级。
 */

const crypto = require('crypto');

// ── 密钥：源码里由 '1234,1234,12' 与 'FEDCBA' 反转拼接而成 ──
// key 生成器: "1234" + "1234" + "12" + reverse("FEDCBA")
// iv  生成器: reverse("FEDCBA") + "1234" + "1234" + "12"
const KEY = Buffer.from('1234123412ABCDEF', 'utf8'); // 16 字节
const IV = Buffer.from('ABCDEF1234123412', 'utf8');  // 16 字节

/** AES-128-CBC 加密，输出大写十六进制 */
function encrypt(plain) {
  const c = crypto.createCipheriv('aes-128-cbc', KEY, IV);
  return Buffer.concat([c.update(String(plain), 'utf8'), c.final()]).toString('hex').toUpperCase();
}

/** AES-128-CBC 解密，输入十六进制（大小写均可） */
function decrypt(hex) {
  const d = crypto.createDecipheriv('aes-128-cbc', KEY, IV);
  return Buffer.concat([d.update(Buffer.from(String(hex), 'hex')), d.final()]).toString('utf8');
}

const md5 = (s) => crypto.createHash('md5').update(s, 'utf8').digest('hex');

/** 生成一个 UUID 形态的 xk（与页面 wc() 的输出格式一致） */
function uuid() {
  const seg = () => crypto.randomBytes(2).toString('hex');
  return `${seg()}${seg()}-${seg()}-${seg()}-${seg()}-${seg()}${seg()}${seg()}`;
}

/** 8 位数字随机串，对应页面 jG(8) */
function nonce() {
  let s = '';
  for (let i = 0; i < 8; i++) s += Math.floor(Math.random() * 10);
  return s;
}

/**
 * 为一组请求参数生成三件套请求头。
 * x-token 的明文是 xk_urlPath_time_nonce，其中 urlPath 从 /website 起算。
 */
function buildAuth(urlPath, sessionId) {
  const xk = uuid();
  const time = String(Date.now());
  const nc = nonce();
  const xToken = encrypt(`${xk}_${urlPath}_${time}_${nc}`);
  // JSESSIONID 缺失时拼接结果里会出现字面量 "null"，这是源站行为，必须照搬
  const xSign = md5(`${xToken}_${time}_${nc}_${sessionId || 'null'}`);
  return { xToken, xSign, xTime: time, xNonce: nc, xk };
}

module.exports = { encrypt, decrypt, md5, uuid, nonce, buildAuth, KEY, IV };
