export class AppError extends Error {
  constructor(code, message, status = 400) { super(message); this.code = code; this.status = status; }
}
export const success = r => r != null && /^(0|0000)$/.test(String(r.retCode));
export const maskPhone = phone => String(phone).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
export const product = Object.freeze({id:'qqt5ga',name:'全球通 5G-A 加速权益',price:'0 元',fee:'免费办理',code:'BCAT5075',term:'与当前全球通身份有效期一致',description:'面向符合条件的全球通客户，提供游戏、视频、直播、办公等场景的网络加速服务。',requirements:['全球通金卡、银卡、普卡客户，具体以资格查询为准','使用支持 5G-A 的终端，并接入 5G 网络','不可共享、不可转赠；生效时间以成功短信为准']});
export function qualification(r) {
  const level=String(r?.gBrandLevel ?? r?.data?.gBrandLevel ?? '');
  const code=String(r?.retCode ?? '');
  const base={code,level,checkedAt:new Date().toISOString()};
  if(['999999','777777'].includes(code)) throw new AppError('AUTH_EXPIRED','登录已失效，请重新验证码登录',401);
  if(code==='900005'||(success(r)&&['08','04','03'].includes(level))) return {...base,state:'included',label:'已默认享有',message:'当前全球通等级已默认享有，无需再次办理。'};
  if(code==='900006') return {...base,state:'ordered',label:'已办理',message:'已领取该权益，无需重复办理。'};
  if(success(r)&&['02','01','00'].includes(level)) return {...base,state:'eligible',label:'可免费办理',message:'当前号码符合办理条件。'};
  if(code==='900010') return {...base,state:'expired',label:'资格已过期',message:'当前权益资格已过期。'};
  if(code==='900004'||success(r)) return {...base,state:'ineligible',label:'暂无办理资格',message:'当前号码暂无可领取权益。'};
  throw new AppError('UPSTREAM_REJECTED',safeMessage(r?.retMsg || '资格查询失败，请稍后重试'));
}
export function safeMessage(value,limit=300) {
 return String(value).slice(0,limit).replace(/\b1[3-9]\d{9}\b/g, maskPhone).replace(/\b[A-Za-z0-9+/_=-]{40,}\b/g,'[已隐藏]');
}
export function requireSuccess(r) {
 if(['999999','777777'].includes(String(r?.retCode))) throw new AppError('AUTH_EXPIRED','登录已失效，请重新验证码登录',401);
 if(!success(r)) throw new AppError('UPSTREAM_REJECTED',safeMessage(r?.retMsg||'服务暂未返回有效业务结果'));
 return r;
}
export function sensitiveChallenge(r,sensitive) {
 requireSuccess(r); const d=r.data || {}; const uuid=r.uuid || d.uuid;
 if(typeof uuid!=='string'||!uuid) throw new AppError('INVALID_SMS','验证码凭据未返回，请在官方窗口检查结果');
 const out={uuid,sensitive,fixed:[]};
 if(sensitive){
  const p=[r.pos1??d.pos1,r.pos2??d.pos2].map(Number),v=[r.val1??d.val1,r.val2??d.val2].map(String);
  if(p.some(n=>!Number.isInteger(n)||n<1||n>8)||p[0]===p[1]||v.some(x=>!/^\d$/.test(x))) throw new AppError('INVALID_SMS','验证码固定位置异常，请在官方窗口核对');
  out.fixed=p.map((position,i)=>({position,value:v[i]}));
 }
 return out;
}
export function composeCode(input, challenge) {
 if(typeof input!=='string'||!/^\d{6}$/.test(input)) throw new AppError('INVALID_CODE','请输入短信中的 6 位验证码');
 if(!challenge.sensitive) return input;
 let i=0; return Array.from({length:8},(_,j)=>challenge.fixed.find(x=>x.position===j+1)?.value??input[i++]).join('');
}
const PRIVATE=/cookie|token|secret|password|uuid|authorization|signature|^sign$|encrypt|session|smsCode|verifyCode/i;
export function publicData(value,depth=0,fullText=false) {
 if(depth>(fullText?32:8)) return '[嵌套数据]';
 if(Array.isArray(value)) return (fullText?value:value.slice(0,500)).map(v=>publicData(v,depth+1,fullText));
 if(value&&typeof value==='object') return Object.fromEntries(Object.entries(value).filter(([k])=>!PRIVATE.test(k)).map(([k,v])=>[k,publicData(v,depth+1,fullText)]));
 return typeof value==='string'?safeMessage(value,fullText?Infinity:300):value;
}
