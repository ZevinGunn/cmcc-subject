import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createApp} from '../server/app.js';
test('本地 API 拒绝恶意 Origin、Host 和无 CSRF 的操作',async t=>{
 const state={account:null};let calls=0;
 const service={snapshot:()=>state,sync:async()=>{calls++;return state;}};
 const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));
 const port=server.address().port;server.on('request',createApp(service,{port}));const url='http://127.0.0.1:'+port;
 const call=(path,options={})=>fetch(url+path,options);
 const badHost=await new Promise(resolve=>{http.get(url+'/api/state',{headers:{host:'evil.example'}},r=>{r.resume();resolve(r.statusCode);});});assert.equal(badHost,403);
 assert.equal((await call('/api/state',{headers:{origin:'https://evil.example'}})).status,403);
 const r=await call('/api/state');const data=await r.json();assert.equal(r.headers.get('cache-control'),'no-store');assert.ok(data.csrf);
 assert.equal((await call('/api/login/sync',{method:'POST'})).status,403);
 assert.equal((await call('/api/login/sync',{method:'POST',headers:{'x-local-csrf':data.csrf,origin:'https://evil.example'}})).status,403);
 assert.equal((await call('/api/login/sync',{method:'POST',headers:{'x-local-csrf':data.csrf,origin:url}})).status,200);assert.equal(calls,1);
});
