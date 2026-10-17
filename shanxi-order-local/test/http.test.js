import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createApp} from '../server/app.js';
test('本地 API 拒绝恶意 Origin、Host 和无 CSRF 的操作',async t=>{
 const state={account:null};let calls=0,smsFlag;
 const service={snapshot:()=>state,sync:async()=>{calls++;return state;},sendSms:async flag=>{smsFlag=flag;return state;}};
 const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));
 const port=server.address().port;server.on('request',createApp(service,{port}));const url='http://127.0.0.1:'+port;
 const call=(path,options={})=>fetch(url+path,options);
 const badHost=await new Promise(resolve=>{http.get(url+'/api/state',{headers:{host:'evil.example'}},r=>{r.resume();resolve(r.statusCode);});});assert.equal(badHost,403);
 assert.equal((await call('/api/state',{headers:{origin:'https://evil.example'}})).status,403);
 const r=await call('/api/state');const data=await r.json();assert.equal(r.headers.get('cache-control'),'no-store');assert.ok(data.csrf);
 assert.equal((await call('/api/login/sync',{method:'POST'})).status,403);
 assert.equal((await call('/api/login/sync',{method:'POST',headers:{'x-local-csrf':data.csrf,origin:'https://evil.example'}})).status,403);
 assert.equal((await call('/api/login/sync',{method:'POST',headers:{'x-local-csrf':data.csrf,origin:url}})).status,200);assert.equal(calls,1);
 assert.equal((await call('/api/order/sms',{method:'POST',headers:{'x-local-csrf':data.csrf,'content-type':'application/json'},body:JSON.stringify({attemptAnyway:true})})).status,200);assert.equal(smsFlag,true);
});

test('业务配置 API 可保存修改切换删除，拒绝旧版本发码和无 CSRF 修改',async t=>{
 const fs=await import('node:fs'),os=await import('node:os'),path=await import('node:path');const {Service}=await import('../server/service.js'),{Ledger}=await import('../server/ledger.js'),{defaultConfig}=await import('../server/catalog.js');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sx-config-http-'));let officialCalls=0;const service=new Service({authenticate:async()=>{officialCalls++;throw Error('must not contact official');}},new Ledger(dir));
 const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(async()=>{await new Promise(r=>server.close(r));fs.rmSync(dir,{recursive:true,force:true});});const port=server.address().port;server.on('request',createApp(service,{port}));const url=`http://127.0.0.1:${port}`;
 const state=await (await fetch(url+'/api/state')).json();const post=(route,data,csrf=state.csrf)=>fetch(url+'/api'+route,{method:'POST',headers:{'content-type':'application/json','x-local-csrf':csrf},body:JSON.stringify(data)});
 const input={...defaultConfig(),id:'',name:'离线 HTTP 配置'};assert.equal((await post('/config/save',input,'missing')).status,403);let r=await post('/config/save',input);assert.equal(r.status,200);let saved=await r.json();const id=saved.selectedId;assert.equal(saved.configs.length,state.configs.length+1);
 const config=saved.configs.find(c=>c.id===id);r=await post('/config/save',{...config,price:'10 元/月'});saved=await r.json();assert.equal(saved.product.price,'10 元/月');assert.equal((await post('/order/sms',{attemptAnyway:true,config:{id,revision:1}})).status,409);assert.equal((await post('/order/sms',{attemptAnyway:true})).status,409);assert.equal(officialCalls,0);
 assert.equal((await post('/config/select',{id:'qqt5ga'})).status,200);assert.equal((await post('/config/delete',{id,revision:1})).status,409);r=await post('/config/delete',{id,revision:2});assert.equal((await r.json()).configs.length,state.configs.length);for(const c of state.configs.filter(c=>c.id!=='qqt5ga'))assert.equal((await post('/config/delete',{id:c.id,revision:c.revision})).status,200);assert.equal((await post('/config/delete',{id:'qqt5ga',revision:1})).status,400);
});

test('公网受控上游失败保留 JSON 诊断，避免 502 被代理替换；本机状态码不变',async t=>{
 const {AppError}=await import('../server/domain.js');
 for(const publicMode of [false,true]){
  const service={snapshot:()=>({account:null}),queryBusiness:async()=>{throw new AppError('KEY_UNAVAILABLE','官方已订业务通道暂不可用，请稍后重试',502);}};
  const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));const port=server.address().port;server.on('request',createApp(service,{port,publicMode}));const url=`http://127.0.0.1:${port}`;const state=await fetch(url+'/api/state').then(r=>r.json());const r=await fetch(url+'/api/query/business',{method:'POST',headers:{'x-local-csrf':state.csrf,'content-type':'application/json'},body:'{}'});assert.equal(r.status,publicMode?503:502);assert.match(r.headers.get('content-type'),/application\/json/);assert.equal((await r.json()).error.code,'KEY_UNAVAILABLE');
 }
});
