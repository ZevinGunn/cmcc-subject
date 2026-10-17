import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,privateDecrypt,constants,createDecipheriv,createCipheriv,createHmac,randomBytes} from 'node:crypto';
import {seal,unseal,Protocol} from '../server/protocol.js';

const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const hex=publicKey.export({format:'der',type:'spki'}).toString('hex');
function open(body,headers){
 // Raw RSA lets this independent server oracle inspect PKCS#1 v1.5 padding
 // even on Node/OpenSSL builds that disable privateDecrypt's legacy mode.
 const block=privateDecrypt({key:privateKey,padding:constants.RSA_NO_PADDING},Buffer.from(headers['E-A-K'],'hex'));
 assert.equal(block[0],0);assert.equal(block[1],2);const separator=block.indexOf(0,2);assert.ok(separator>=10);
 const key=block.subarray(separator+1).toString('utf8');assert.match(key,/^[A-Za-z0-9]{16}$/);
 assert.equal(headers['E-S-K'],createHmac('sha256',key).update(headers['E-T-K']+body.encryptInStr).digest('hex'));
 const decipher=createDecipheriv('aes-128-cbc',Buffer.from(key),Buffer.from(body.encryptInStr.slice(0,32),'hex'));
 return {key,data:JSON.parse(Buffer.concat([decipher.update(Buffer.from(body.encryptInStr.slice(32),'hex')),decipher.final()]).toString())};
}
function response(data,key){const iv=randomBytes(16),cipher=createCipheriv('aes-128-cbc',Buffer.from(key),iv);return {secretOutId:'0',encryptOutStr:iv.toString('hex')+Buffer.concat([cipher.update(JSON.stringify(data)),cipher.final()]).toString('hex')};}
test('兼容官方十六进制 DER 公钥和 AES/RSA/HMAC 格式，保留验证码前导零',()=>{
 const input={pubInfo:{phoneNo:'13800000000',smsCode:'001234'},busiInfo:{},couponsBusiName:'登录'};
 for(const rsa of [hex,publicKey.export({format:'pem',type:'spki'})]){const sealed=seal(input,rsa);const opened=open(sealed.body,sealed.headers);assert.deepEqual(opened.data,input);assert.deepEqual(unseal(response({retCode:'0000',data:{label:'中文'}},opened.key),opened.key),{retCode:'0000',data:{label:'中文'}});}
 const a=seal(input,hex),b=seal(input,hex);assert.notEqual(a.key,b.key);assert.notEqual(a.body.encryptInStr,b.body.encryptInStr);
});
test('响应损坏不能视为业务结果，支持官方明文包装',()=>{
 assert.deepEqual(unseal({secretOutId:'-1',encryptOutStr:'{"retCode":"777777"}'},'abcdefghijklmnop'),{retCode:'777777'});
 for(const r of [{retCode:'0000'},{encryptOutStr:'broken'},response({retCode:'0000'},'abcdefghijklmnop')])assert.throws(()=>unseal(r,'0000000000000000'),e=>['INVALID_RESPONSE'].includes(e.code));
 assert.throws(()=>seal({},'invalid'),{code:'KEY_INVALID'});
});
test('登录与订购使用独立公钥缓存，验证凭据只绑定一次请求，无自动重试',async()=>{
 const requests=[];const p=new Protocol(async(url,body,headers)=>{
  if(url.endsWith('/getRsaPubKey')){requests.push({url});return {retCode:'0000',data:hex};}
  const opened=open(body,headers);requests.push({url,data:opened.data});return response({retCode:'0000'},opened.key);
 });
 await p.call('sendSmsCode',{pubInfo:{phoneNo:'13800000000',busiType:'SSO_LOGIN'},busiInfo:{}});
 await p.call('wapLogin',{pubInfo:{phoneNo:'13800000000',smsCode:'001234'},busiInfo:{}});
 await p.call('qqt5gaSubmitPrcOrder',{}, {uuid:'synthetic-proof'});
 await p.call('qqt5gaQryUserQualification');
 assert.equal(requests.filter(r=>r.url.endsWith('/getRsaPubKey')).length,2);
 const order=requests.find(r=>r.url.endsWith('/submitPrcOrder'));assert.equal(order.data.uuid,'synthetic-proof');assert.equal(order.data.busiType,'QQT5GA_SMS');
 assert.equal(requests.at(-1).data.uuid,undefined);assert.equal(requests[1].url,'/h/market/rest/v1/wapLogin/sendSmsCode');assert.equal(requests[1].data.couponsBusiName,'SIM认证');
 await assert.rejects(p.call('arbitrary'),{code:'UNSUPPORTED'});await assert.rejects(p.call('qqt5gaSubmitPrcOrder'),{code:'VERIFY_REQUIRED'});
 let attempts=0;const failing=new Protocol(async url=>{if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};attempts++;throw Error('timeout');});
 await assert.rejects(failing.call('qqt5gaSubmitPrcOrder',{}, {uuid:'synthetic-proof'}));assert.equal(attempts,1);
 p.clear();assert.equal(p.keys.size,0);
});
test('仅在只读公钥探测失败后选择兼容入口，写操作不切入口、不重试',async()=>{
 const calls=[];const p=new Protocol(async(url,body,headers)=>{calls.push(url);if(url==='/h/act/rest/v1/rsakey/getRsaPubKey'){const e=new Error('unavailable');e.code='UPSTREAM_UNAVAILABLE';throw e;}if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};const {key}=open(body,headers);if(url.endsWith('/submitPrcOrder'))throw Error('lost-order-response');return response({retCode:'0000'},key);});
 await p.call('qqt5gaQryUserQualification');await assert.rejects(p.call('qqt5gaSubmitPrcOrder',{}, {uuid:'synthetic-proof'}));assert.equal(calls.filter(u=>u.endsWith('/submitPrcOrder')).length,1);assert.equal(calls.at(-1),'/h/market/rest/v1/qqt5ga/submitPrcOrder');assert.equal(p.scopes.get('act'),'market');
});
test('官方业务诊断区分响应码与嵌套状态，过滤号码和敏感字段',async()=>{const p=new Protocol(async(url,body,headers)=>{if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};const {key}=open(body,headers);return response({retCode:'0000',retMsg:'已受理 13800000000',data:{retCode:'900001',retMsg:'通道拒绝',token:'synthetic-private',phoneNo:'13800000000'}},key);});await p.call('sendSmsCode',{pubInfo:{phoneNo:'13800000000'}});assert.equal(p.lastResult.code,'0000');assert.equal(p.lastResult.detailCode,'900001');assert.equal(p.lastResult.message,'已受理 138****0000');assert.equal(JSON.stringify(p.lastResult).includes('synthetic-private'),false);assert.equal(p.lastResult.dataFields.includes('phoneNo'),false);});
test('仅保留发码响应中有限的通道状态，不将其推断为送达或暴露号码',async()=>{
 const p=new Protocol(async(url,body,headers)=>{if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};const {key}=open(body,headers);return response({retCode:'0000',data:{NET_FLAG:'Y',SEND_TYPE:'2',NET_TYPE:'13800000000',unknown:'private'}},key);});
 await p.call('sendSmsCode');assert.deepEqual(p.lastResult.channelStatus,{NET_FLAG:'Y',SEND_TYPE:'2'});assert.equal(JSON.stringify(p.lastResult).includes('13800000000'),false);assert.equal(p.lastResult.delivered,undefined);
});

test('自定义业务路径、名称、额外参数和当次 uuid 在实际加密报文中保持一致',async()=>{
 const {defaultConfig}=await import('../server/catalog.js');const requests=[];
 const p=new Protocol(async(url,body,headers)=>{if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};const {key,data}=open(body,headers);requests.push({url,data});return response({retCode:'0000'},key);});
 const c={...defaultConfig(),scope:'market',queryMode:'generic',couponsBusiName:'自定义流量包',queryPath:'traffic/query',orderPath:'traffic/submit',orderParams:{offerId:'SYNTHETIC'},sms:{...defaultConfig().sms,busiType:'TRAFFIC_SMS',prcId:'SYNTHETIC'}};
 await p.call('qqt5gaSubmitPrcOrder',c.orderParams,{uuid:'dynamic-proof'},c);assert.deepEqual(requests[0],{url:'/h/market/rest/v1/traffic/submit',data:{offerId:'SYNTHETIC',couponsBusiName:'自定义流量包',uuid:'dynamic-proof',busiType:'TRAFFIC_SMS'}});
 await p.call('qqt5gaQryUserQualification',{offerId:'SYNTHETIC'},null,c);assert.equal(requests[1].url,'/h/market/rest/v1/traffic/query');assert.equal(requests[1].data.uuid,undefined);await assert.rejects(p.call('wapLogin',{},null,c),{code:'UNSUPPORTED'});
 await assert.rejects(p.call('qqt5gaSubmitPrcOrder',{}, {uuid:'dynamic-proof'},{...c,orderPath:'https://other.example/order'}),{code:'INVALID_CONFIG'});
});

test('已订业务与活动固定 act 入口加密；退订和套餐详情按源码明文发送且不重试',async()=>{
 const requests=[];const p=new Protocol(async(url,body,headers)=>{requests.push({url,body,headers});if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};if(body.encryptInStr){const {key,data}=open(body,headers);assert.deepEqual(data,{couponsBusiName:'已订业务'});return response({retCode:'0000',data:{}},key);}return {retCode:'0000',data:{}};});
 p.scopes.set('act','market');await p.call('qryUserOrderInfo');await p.call('getActRecordInfo');assert.equal(p.scopes.get('act'),'market');assert(requests.some(r=>r.url==='/h/act/rest/v1/userorderinfo/qryUserOrderInfo'));assert(requests.some(r=>r.url==='/h/act/rest/v1/batch3/getActRecordInfo'));
 await p.call('unSubScribeOrder',{prod_prcid:'SYNTHETIC',uuid:'ignored',couponsBusiName:'ignored'});assert.deepEqual(requests.at(-1),{url:'/h/act/rest/v1/prod/unSubScribeOrder',body:{prod_prcid:'SYNTHETIC',couponsBusiName:'已订业务'},headers:{}});await p.call('qryUserOrderDetail',{useProd:'N'});assert.deepEqual(requests.at(-1).body,{useProd:'N',couponsBusiName:'已订业务'});await assert.rejects(p.call('unSubScribeOrder',{prod_prcid:'../bad'}),{code:'INVALID_PRODUCT'});
 let count=0;const failing=new Protocol(async url=>{if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};count++;assert.equal(url,'/h/act/rest/v1/prod/unSubScribeOrder');throw Error('timeout');});await assert.rejects(failing.call('unSubScribeOrder',{prod_prcid:'SYNTHETIC'}));assert.equal(count,1);
 for(const result of [{secretOutId:'0',encryptOutStr:'invalid'},{retCode:null},{retCode:''}]){const invalid=new Protocol(async url=>url.endsWith('/getRsaPubKey')?{retCode:'0000',data:hex}:result);await assert.rejects(invalid.call('unSubScribeOrder',{prod_prcid:'SYNTHETIC'}),{code:'INVALID_RESPONSE'});}
});

test('已订业务在只读公钥探测 400 后选择 market，查询、详情和退订保持同一入口且不重复写',async()=>{
 const requests=[];let failWrite=false;
 const p=new Protocol(async(url,body,headers)=>{
  requests.push({url,body,headers});if(url==='/h/act/rest/v1/rsakey/getRsaPubKey'){const e=Error('HTTP 400');e.code='UPSTREAM_UNAVAILABLE';throw e;}
  if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};
  if(body.encryptInStr){const {key,data}=open(body,headers);assert.deepEqual(data,{couponsBusiName:'已订业务'});return response({retCode:'0000',data:{}},key);}
  if(failWrite&&url.endsWith('/unSubScribeOrder'))throw Error('uncertain');return {retCode:'0',data:{}};
 });
 p.scopes.set('act','act');await p.call('qryUserOrderInfo');await p.call('getActRecordInfo');await p.call('qryUserOrderDetail',{useProd:'Y'});failWrite=true;await assert.rejects(p.call('unSubScribeOrder',{prod_prcid:'SYNTHETIC'}));
 assert.equal(p.subscriptionScope,'market');assert.equal(p.scopes.get('act'),'act');assert.equal(requests.filter(r=>r.url==='/h/act/rest/v1/rsakey/getRsaPubKey').length,1);
 for(const endpoint of ['userorderinfo/qryUserOrderInfo','batch3/getActRecordInfo','userorderinfo/qryUserOrderDetail','prod/unSubScribeOrder'])assert.equal(requests.filter(r=>r.url==='/h/market/rest/v1/'+endpoint).length,1);
 const write=requests.at(-1);assert.deepEqual(write.body,{prod_prcid:'SYNTHETIC',couponsBusiName:'已订业务'});assert.deepEqual(write.headers,{});p.clear();assert.equal(p.subscriptionScope,null);
});
test('通道探测复用登录公钥，人工验证、业务请求错误不会触发切入口或写操作重试',async()=>{
 let calls=[];const p=new Protocol(async(url,body,headers)=>{calls.push(url);if(url.endsWith('/getRsaPubKey')){const e=Error('HTTP 400');e.code='UPSTREAM_UNAVAILABLE';throw e;}if(body.encryptInStr){const {key}=open(body,headers);return response({retCode:'0'},key);}return {retCode:'0'};});p.keys.set('market',hex);await p.call('qryUserOrderInfo');assert.equal(calls.includes('/h/market/rest/v1/rsakey/getRsaPubKey'),false);
 calls=[];const rejected=new Protocol(async url=>{calls.push(url);const e=Error('verification');e.code='OFFICIAL_VERIFICATION_REQUIRED';throw e;});await assert.rejects(rejected.call('qryUserOrderInfo'),{code:'OFFICIAL_VERIFICATION_REQUIRED'});assert.equal(calls.length,1);assert.equal(rejected.subscriptionScope,null);
 calls=[];const businessFails=new Protocol(async url=>{calls.push(url);if(url.endsWith('/getRsaPubKey'))return {retCode:'0000',data:hex};const e=Error('business unavailable');e.code='UPSTREAM_UNAVAILABLE';throw e;});await assert.rejects(businessFails.call('qryUserOrderInfo'),{code:'UPSTREAM_UNAVAILABLE'});assert.equal(calls.some(u=>u.includes('/market/')),false);assert.equal(businessFails.subscriptionScope,'act');
});
