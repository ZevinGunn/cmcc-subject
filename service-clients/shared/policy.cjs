const config = require('./services.json');
const internalOrigins = new Set([config.origin, ...config.services.map(item => new URL(item.url).origin), ...(config.aliases || [])]);
function parseURL(value) { try { return new URL(value); } catch { return null; } }
function isInternal(value) {
  const url = parseURL(value);
  return Boolean(url && internalOrigins.has(url.origin) && !url.username && !url.password);
}
function isExternal(value) {
  const url = parseURL(value);
  return Boolean(url && url.protocol === 'https:' && !url.username && !url.password);
}
function serviceURL(id) {
  const service = config.services.find(item => item.id === id);
  if (!service) throw new Error('未知工具');
  return service.url;
}
function invitationURL(value) {
  const text = String(value || '').trim();
  let code = text;
  if (/^https?:/i.test(text)) {
    const url = parseURL(text);
    if (!url || !isInternal(text) || url.origin !== config.origin || !['/public', '/app/cmcc-public', '/app/cmcc-public/', '/app/cmcc-public/public'].includes(url.pathname)) {
      throw new Error('请使用本站的 HTTPS 专属链接或邀请码');
    }
    code = url.searchParams.get('link') || '';
  }
  if (!/^[a-zA-Z0-9_-]{6,128}$/.test(code)) throw new Error('请输入有效的专属链接或邀请码');
  const url = new URL('/public', config.origin);
  url.searchParams.set('link', code);
  return url.href;
}
function navigationKind(value) {
  if (isInternal(value)) return 'internal';
  if (isExternal(value)) return 'external';
  return 'blocked';
}
module.exports = { config, isInternal, isExternal, serviceURL, invitationURL, navigationKind };
