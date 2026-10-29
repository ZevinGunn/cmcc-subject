import {randomBytes,randomInt,createCipheriv,createDecipheriv,createPublicKey,publicEncrypt,constants,createHmac} from 'node:crypto';
import {AppError,safeMessage} from './domain.js';
import {validateConfig,assertConfigReady} from './catalog.js';
import {unsubscribeParams} from './subscriptions.js';

// oHCY in the supplied market bundle: AES-128-CBC, IV prepended as hex,
// RSA PKCS#1 v1.5 wrapping, HMAC-SHA256(timestamp + ciphertext, AES key).
export function seal(data,publicKey){
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 const key=Array.from({length:16},()=>alphabet[randomInt(alphabet.length)]).join(''),iv=randomBytes(16);
 const cipher=createCipheriv('aes-128-cbc',Buffer.from(key),iv);
 const encryptInStr=iv.toString('hex')+Buffer.concat([cipher.update(JSON.stringify(data),'utf8'),cipher.final()]).toString('hex');
 const timestamp=String(Date.now());
 let rsa;
 try{rsa=/^[a-f\d]+$/i.test(publicKey)?createPublicKey({key:Buffer.from(publicKey,'hex'),format:'der',type:'spki'}):createPublicKey(publicKey.includes('BEGIN ')?publicKey:`-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`);}
 catch{throw new AppError('KEY_INVALID','官方加密公钥格式已改变，请更新适配',502);}
 return {key,body:{encryptInStr},headers:{'E-A-K':publicEncrypt({key:rsa,padding:constants.RSA_PKCS1_PADDING},Buffer.from(key)).toString('hex'),'E-T-K':timestamp,'E-S-K':createHmac('sha256',key).update(timestamp+encryptInStr).digest('hex')}};
}
export function unseal(data,key){
 if(!data||typeof data.encryptOutStr!=='string')throw new AppError('INVALID_RESPONSE','官方响应格式异常，请稍后核查',502);
 try{
  if(String(data.secretOutId)==='-1')return JSON.parse(data.encryptOutStr);
  const text=data.encryptOutStr;
  if(!/^[a-f\d]+$/i.test(text)||text.length<64||text.length%32)throw Error('ciphertext');
  const decipher=createDecipheriv('aes-128-cbc',Buffer.from(key),Buffer.from(text.slice(0,32),'hex'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(text.slice(32),'hex')),decipher.final()]).toString('utf8'));
 }catch{throw new AppError('INVALID_RESPONSE','官方响应未能解密，请先核查办理结果',502);}
}
const routes=Object.freeze({
 sendSmsCode:['market','wapLogin/sendSmsCode','SIM认证'],wapLogin:['market','wapLogin/login','SIM认证'],
 checkLoginNew:['market','wapLogin/checkLogin','SIM认证'],
 qqt5gaQryUserQualification:['act','qqt5ga/qryUserQualification','全球通5GA加速权益'],
 qrySensitiveTag:['act','sensitive/qryTag','全球通5GA加速权益'],
 getSmsCodeSmsver:['act','smsver/sendSmsCodeNew','全球通5GA加速权益'],
 chkSmsCodeSmsver:['act','smsver/chkSmsCodeNew','全球通5GA加速权益'],
 qqt5gaSubmitPrcOrder:['act','qqt5ga/submitPrcOrder','全球通5GA加速权益'],
 qryUserOrderInfo:['act','userorderinfo/qryUserOrderInfo','已订业务'],
 getActRecordInfo:['act','batch3/getActRecordInfo','已订业务']
});
export class Protocol {
 constructor(transport){this.transport=transport;this.keys=new Map();this.scopes=new Map();this.subscriptionScope=null;this.lastResult=null;}
 async subscriptionEntry(){
  if(this.subscriptionScope)return this.subscriptionScope;
  let scope='act',key=this.keys.get(scope),result;
  if(!key){
   try{result=await this.transport('/h/act/rest/v1/rsakey/getRsaPubKey',{},{});}
   catch(e){
    // Resolve the entry using a read-only key request BEFORE any business
    // request. Never switch paths after an unsubscribe has been sent.
    if(e.code!=='UPSTREAM_UNAVAILABLE')throw e;
    scope='market';key=this.keys.get(scope);
    if(!key)result=await this.transport('/h/market/rest/v1/rsakey/getRsaPubKey',{},{});
   }
   if(!key){
    if(!['0000','0'].includes(String(result?.retCode))||typeof result?.data!=='string')throw new AppError('KEY_UNAVAILABLE','官方已订业务通道暂不可用，请稍后重试',502);
    key=result.data;this.keys.set(scope,key);
   }
  }
  this.subscriptionScope=scope;return scope;
 }
 async call(method,payload={},proof,config){
  if(['unSubScribeOrder','qryUserOrderDetail'].includes(method)){
   if(config)throw new AppError('UNSUPPORTED','已订业务接口不能由业务配置覆盖');
   const data=method==='unSubScribeOrder'?unsubscribeParams(payload.prod_prcid):{useProd:payload.useProd};
   if(method==='qryUserOrderDetail'&&!['Y','N'].includes(data.useProd))throw new AppError('INVALID_PRODUCT','套餐状态无效');
   // These wrappers have no desRest flag: only entry discovery uses a public
   // key request; the business request remains plain JSON without RSA headers.
   const scope=await this.subscriptionEntry();
   const endpoint=method==='unSubScribeOrder'?'prod/unSubScribeOrder':'userorderinfo/qryUserOrderDetail';
   const result=await this.transport(`/h/${scope}/rest/v1/${endpoint}`,{...data,couponsBusiName:'已订业务'},{});
   if(!result||!['string','number'].includes(typeof result.retCode)||!String(result.retCode))throw new AppError('INVALID_RESPONSE','官方未返回确定业务结果，请核查后再操作',502);
   this.lastResult={operation:method,code:String(result.retCode),message:safeMessage(result.retMsg||''),at:new Date().toISOString()};return result;
  }
  if(!Object.hasOwn(routes,method))throw new AppError('UNSUPPORTED','不支持的业务操作');
  let [preferred,endpoint,title]=routes[method];
  let c;
  if(config){
   if(['sendSmsCode','wapLogin','checkLoginNew','qryUserOrderInfo','getActRecordInfo'].includes(method))throw new AppError('UNSUPPORTED','此接口不能使用业务配置');
   c=validateConfig(config);assertConfigReady(c);preferred=c.scope;title=c.couponsBusiName;
   if(method==='qqt5gaQryUserQualification')endpoint=c.queryPath;
   if(method==='qqt5gaSubmitPrcOrder')endpoint=c.orderPath;
  }
  const fixedScope=['qryUserOrderInfo','getActRecordInfo'].includes(method);
  let scope=fixedScope?await this.subscriptionEntry():this.scopes.get(preferred)||preferred,key=this.keys.get(scope);
  if(!key){
   let result;
   try{result=await this.transport(`/h/${scope}/rest/v1/rsakey/getRsaPubKey`,{},{});}
   catch(e){
    // Only the side-effect-free key discovery may fall back. A business
    // request is sent exactly once to the scope selected BEFORE encryption.
    if(fixedScope||scope!=='act'||e.code!=='UPSTREAM_UNAVAILABLE')throw e;
    scope='market';result=await this.transport('/h/market/rest/v1/rsakey/getRsaPubKey',{},{});
   }
   if(!['0000','0'].includes(String(result?.retCode))||typeof result?.data!=='string')throw new AppError('KEY_UNAVAILABLE','官方加密公钥暂不可用，请稍后重试',502);
   key=result.data;this.keys.set(scope,key);if(!fixedScope)this.scopes.set(preferred,scope);
  }
  const data={...payload,couponsBusiName:title};
  if(method==='qqt5gaSubmitPrcOrder'){
   if(!proof?.uuid)throw new AppError('VERIFY_REQUIRED','缺少业务验证码凭据');
   data.uuid=proof.uuid;data.busiType=c?.sms.busiType||'QQT5GA_SMS';
  }
  const encrypted=seal(data,key);
  // No retry: a lost SMS or order response must never duplicate a side effect.
  const response=await this.transport(`/h/${scope}/rest/v1/${endpoint}`,encrypted.body,encrypted.headers);
  const result=unseal(response,encrypted.key);
  if(!result||typeof result!=='object'||result.retCode===undefined)throw new AppError('INVALID_RESPONSE','官方未返回有效结果，请稍后核查',502);
  this.lastResult={operation:method,code:String(result.retCode),message:safeMessage(result.retMsg||''),detailCode:result.data&&typeof result.data==='object'&&result.data.retCode!==undefined?String(result.data.retCode):null,detailMessage:safeMessage(result.data?.retMsg||''),dataFields:result.data&&typeof result.data==='object'?Object.keys(result.data).filter(k=>!/(cookie|token|secret|password|uuid|sms|phone)/i.test(k)):[],at:new Date().toISOString()};
  if(method==='sendSmsCode')this.lastResult.channelStatus=Object.fromEntries(['NET_FLAG','SEND_TYPE','NET_TYPE'].flatMap(k=>{
   const value=result.data?.[k];return ['string','number','boolean'].includes(typeof value)&&/^[A-Za-z0-9_-]{0,16}$/.test(String(value))&&!/\d{6,}/.test(String(value))?[[k,value]]:[];
  }));
  return result;
 }
 clear(){this.keys.clear();this.scopes.clear();this.subscriptionScope=null;this.lastResult=null;}
}
