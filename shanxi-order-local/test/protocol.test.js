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
 assert.equal(requests.at(-1).data.uuid,undefined);assert.equal(requests[1].url,'/h/market/rest/v1/wapLogin/sendSmsCode');
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
