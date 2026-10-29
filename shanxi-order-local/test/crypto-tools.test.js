import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {generateKeyPairSync,privateDecrypt,constants,createDecipheriv,createCipheriv,createHmac} from 'node:crypto';
import {transformCrypto} from '../server/crypto-tools.js';
import {seal,unseal} from '../server/protocol.js';
import {createApp} from '../server/app.js';
const key='0123456789AbCdEf';
const data={pubInfo:{smsCode:'001234'},busiInfo:{name:'山西移动',items:[true,null,0]},longId:'12345678901234567890'};
const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const spki=publicKey.export({format:'der',type:'spki'});
const run=(direction,operation,input,extra={})=>transformCrypto({direction,operation,input:typeof input==='string'?input:JSON.stringify(input),key,...extra});
function oracleDecrypt(text,aes){const iv=Buffer.from(text.slice(0,32),'hex'),decipher=createDecipheriv('aes-128-cbc',Buffer.from(aes),iv);return JSON.parse(Buffer.concat([decipher.update(Buffer.from(text.slice(32),'hex')),decipher.final()]).toString());}
function oracleEncrypt(value){const iv=Buffer.from('000102030405060708090a0b0c0d0e0f','hex'),cipher=createCipheriv('aes-128-cbc',Buffer.from(key),iv);return iv.toString('hex')+Buffer.concat([cipher.update(JSON.stringify(value)),cipher.final()]).toString('hex');}

test('工具的四种操作与官方协议及独立 AES 实现兼容，保留中文、前导零与 JSON 值',()=>{
 for(const value of [data,[null,true,12,'中文'],null,'001234',0,false]){
  const expected=oracleEncrypt(value);
  assert.deepEqual(run('request','decrypt',{encryptInStr:expected}).output,value);
  assert.deepEqual(run('response','decrypt',{secretOutId:'0',encryptOutStr:expected}).output,value);
  for(const direction of ['request','response']){
   const encrypted=run(direction,'encrypt',JSON.stringify(value));
   const text=encrypted.output[direction==='request'?'encryptInStr':'encryptOutStr'];
   assert.deepEqual(oracleDecrypt(text,key),value);
   assert.deepEqual(run(direction,'decrypt',encrypted.output).output,value);
   assert.deepEqual(run(direction,'decrypt',text).output,value);
   assert.deepEqual(run(direction,'decrypt',JSON.stringify(text)).output,value);
   if(direction==='response')assert.deepEqual(unseal(encrypted.output,key),value);
  }
 }
 const sealed=seal(data,spki.toString('hex'));
 assert.deepEqual(run('request','decrypt',{body:sealed.body,headers:sealed.headers},{key:sealed.key}),{output:data,key:sealed.key,signature:'verified'});
 assert.equal(run('request','decrypt',sealed.body,{key:sealed.key}).signature,'absent');
 const plain=run('response','decrypt',{secretOutId:-1,encryptOutStr:JSON.stringify(data)},{key:''});assert.deepEqual(plain,{output:data,plaintext:true});
});

test('可选 RSA 请求头符合官方 PKCS#1 v1.5 与 HMAC，支持三种公钥格式',()=>{
 for(const rsa of [spki.toString('hex'),spki.toString('base64'),publicKey.export({format:'pem',type:'spki'})]){
  const encrypted=run('request','encrypt',data,{publicKey:rsa});assert.equal(encrypted.complete,true);
  const block=privateDecrypt({key:privateKey,padding:constants.RSA_NO_PADDING},Buffer.from(encrypted.headers['E-A-K'],'hex'));
  assert.equal(block[0],0);assert.equal(block[1],2);const separator=block.indexOf(0,2);assert.ok(separator>=10);assert.equal(block.subarray(separator+1).toString(),key);
  assert.equal(encrypted.headers['E-S-K'],createHmac('sha256',key).update(encrypted.headers['E-T-K']+encrypted.output.encryptInStr).digest('hex'));
  assert.deepEqual(oracleDecrypt(encrypted.output.encryptInStr,key),data);
  assert.equal(run('request','decrypt',{body:encrypted.output,headers:encrypted.headers}).signature,'verified');
 }
 const a=run('request','encrypt',data,{key:''}),b=run('request','encrypt',data,{key:''});
 assert.match(a.key,/^[A-Za-z0-9]{16}$/);assert.notEqual(a.key,b.key);assert.notEqual(a.output.encryptInStr,b.output.encryptInStr);assert.deepEqual(a.headers,{});assert.equal(a.complete,false);
 const c=run('response','encrypt',data),d=run('response','encrypt',data);assert.notEqual(c.output.encryptOutStr,d.output.encryptOutStr);
});

test('错误密钥、损坏格式、签名篡改与超限输入明确失败，不返回伪明文',()=>{
 const sealed=run('request','encrypt',data,{publicKey:spki.toString('hex')});
 const cases=[
  [{direction:'unknown',operation:'encrypt',input:'{}'},'CRYPTO_MODE_INVALID'],
  [null,'CRYPTO_MODE_INVALID'],[[],'CRYPTO_MODE_INVALID'],
  [{direction:'request',operation:'encrypt',input:' '},'INPUT_REQUIRED'],
  [{direction:'request',operation:'encrypt',input:'{bad}'},'JSON_INVALID'],
  ...['short','0'.repeat(32),'密'.repeat(16)].map(key=>[{direction:'request',operation:'decrypt',input:JSON.stringify(sealed.output),key},'AES_KEY_INVALID']),
  [{direction:'request',operation:'decrypt',input:JSON.stringify(sealed.output),key:'1111111111111111'},'DECRYPT_FAILED'],
  ...['abcd','0'.repeat(65),'0'.repeat(62)+'gg'].map(input=>[{direction:'response',operation:'decrypt',input:JSON.stringify({encryptOutStr:input}),key},'CIPHERTEXT_INVALID']),
  [{direction:'request',operation:'decrypt',input:JSON.stringify({encryptOutStr:sealed.output.encryptInStr}),key},'CIPHERTEXT_INVALID'],
  [{direction:'request',operation:'encrypt',input:'{}',publicKey:'bad',key},'RSA_KEY_INVALID'],
  [{direction:'request',operation:'encrypt',input:'{}',publicKey:{key:'bad'},key},'RSA_KEY_INVALID'],
  [{direction:'request',operation:'encrypt',input:'{}',publicKey:privateKey.export({format:'pem',type:'pkcs8'}),key},'RSA_KEY_INVALID'],
  [{direction:'response',operation:'encrypt',input:'{}',key:''},'AES_KEY_INVALID'],
  [{direction:'request',operation:'encrypt',input:'{}',key:0},'AES_KEY_INVALID'],
  [{direction:'request',operation:'encrypt',input:JSON.stringify('大'.repeat(6000)),key},'INPUT_TOO_LARGE'],
  [{direction:'request',operation:'decrypt',input:'a'.repeat(50000),key},'INPUT_TOO_LARGE'],
  [{direction:'request',operation:'decrypt',input:JSON.stringify({body:sealed.output,headers:{...sealed.headers,'E-S-K':'0'.repeat(64)}}),key},'SIGNATURE_INVALID'],
  [{direction:'request',operation:'decrypt',input:JSON.stringify({body:sealed.output,headers:{'e-t-k':sealed.headers['E-T-K']}}),key},'SIGNATURE_INVALID'],
  [{direction:'response',operation:'decrypt',input:JSON.stringify({secretOutId:'-1',encryptOutStr:'bad'}),key:''},'JSON_INVALID']
 ];
 for(const [options,code] of cases)assert.throws(()=>transformCrypto(options),{code});
 const lower=Object.fromEntries(Object.entries(sealed.headers).map(([k,v])=>[k.toLowerCase(),v]));assert.equal(run('request','decrypt',{body:sealed.output,headers:lower}).signature,'verified');
});

test('工具 API 无需移动账号，保留 Host/Origin/CSRF 保护且不保存内容',async()=>{
 let contextCalls=0,snapshotCalls=0;
 const service={snapshot(){snapshotCalls++;return {accounts:[],busy:false};},assertContext(){contextCalls++;throw Error('tools must not use account context');}};
 const server=http.createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;
 server.on('request',createApp(service,{port}));const base=`http://127.0.0.1:${port}`;
 try{
  const state=await (await fetch(base+'/api/state')).json();
  const options={direction:'request',operation:'encrypt',input:JSON.stringify(data)};
  const request=(body,headers={})=>fetch(base+'/api/tools/crypto',{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});
  assert.equal((await request(options)).status,403);
  assert.equal((await request(options,{'x-local-csrf':state.csrf,origin:'https://evil.example'})).status,403);
  const encrypted=await request(options,{'x-local-csrf':state.csrf,origin:base});assert.equal(encrypted.status,200);assert.equal(encrypted.headers.get('cache-control'),'no-store');
  const result=await encrypted.json();assert.deepEqual(oracleDecrypt(result.output.encryptInStr,result.key),data);
  const headers={'x-local-csrf':state.csrf};
  assert.equal((await request(null,headers)).status,400);
  const invalid=await request({...options,input:'private-invalid-json'},headers);assert.equal(invalid.status,400);assert.equal(JSON.stringify(await invalid.json()).includes('private-invalid-json'),false);
  const oversized=await request({...options,input:'a'.repeat(70000)},headers);assert.equal(oversized.status,413);
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 assert.equal(contextCalls,0);assert.equal(snapshotCalls,1);
});
