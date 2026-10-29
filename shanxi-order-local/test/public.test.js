import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {randomBytes} from 'node:crypto';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {workspaceSession,createSmsLimiter} from '../server/public-session.js';
import {createPublicApp} from '../server/public-app.js';
import {Accounts} from '../server/accounts.js';
import {Ledger} from '../server/ledger.js';
import {redirectShanxi} from '../../project-manager/shanxi-gateway.js';

const origin='https://shanxi.1008086.xyz';
async function listen(server){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return server.address().port;}
async function stop(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}

test('persistent workspace cookie is secure, signed, expiring and cannot select another browser',()=>{
 const key=randomBytes(32),now=Date.now();let cookie;
 const res={setHeader(_name,value){cookie=value;}};
 const tenant=workspaceSession(key,{method:'GET',headers:{}},res,now);
 assert.match(cookie,/; Secure; HttpOnly; SameSite=Strict/);assert.match(cookie,/; Path=\/; Max-Age=31536000/);
 const request={method:'POST',headers:{cookie:cookie.split(';')[0]}};
 assert.equal(workspaceSession(key,request,res,now),tenant);
 assert.equal(workspaceSession(randomBytes(32),request,res,now),null);
 assert.equal(workspaceSession(key,request,res,now+366*86400000),null);
 assert.equal(workspaceSession(key,{method:'POST',headers:{}},res,now),null);
 request.headers.cookie=request.headers.cookie.replace(/=[a-f0-9]/,'=z');assert.equal(workspaceSession(key,request,res,now),null);
});

test('network SMS limits span workspaces and expire without unbounded address growth',()=>{
 let now=0;const limiter=createSmsLimiter({now:()=>now,maxAddresses:1});
 for(let n=0;n<10;n++)assert.equal(limiter.accept('a'),true);
 assert.equal(limiter.accept('a'),false);assert.equal(limiter.accept('b'),false);
 now=600001;assert.equal(limiter.accept('b'),true);
});

test('independent public site isolates browser data, preserves cache and blocks CSRF and forged identities',async()=>{
 const directory=mkdtempSync(path.join(os.tmpdir(),'shanxi-public-')),key=randomBytes(32);writeFileSync(path.join(directory,'index.html'),'<!doctype html><title>晋速办</title>');
 let now=Date.now();const dirs=[];
 const makeService=dir=>{dirs.push(dir);return new Accounts(()=>({close:async()=>{}}),new Ledger(dir));};
 const backend=http.createServer(),port=await listen(backend);
 const actual=createPublicApp({key,directory,dist:directory,port,makeService,now:()=>now,idleMs:0});backend.on('request',actual.app);
 const base=`http://127.0.0.1:${port}`;
 const request=(route,cookie,body,csrf)=>fetch(base+route,{method:body===undefined?'GET':'POST',headers:{...(cookie?{cookie}:{}),...(body===undefined?{}:{origin,'content-type':'application/json','x-local-csrf':csrf||''}),'x-shanxi-tenant':'bootstrap-admin','x-shanxi-signature':'0'.repeat(64)},...(body===undefined?{}:{body:JSON.stringify(body)})});
 try{
  const httpRedirect=await fetch(base+'/?from=http',{redirect:'manual',headers:{'x-forwarded-proto':'http'}});assert.equal(httpRedirect.status,308);assert.equal(httpRedirect.headers.get('location'),origin+'/?from=http');
  assert.equal((await request('/api/order/submit',null,{id:'forged',confirmed:true})).status,401);
  const responseA=await request('/api/state'),responseB=await request('/api/state');
  const cookieA=responseA.headers.get('set-cookie').split(';')[0],cookieB=responseB.headers.get('set-cookie').split(';')[0];
  const a=await responseA.json(),b=await responseB.json();
  assert.equal(a.publicMode,true);assert.notEqual(a.csrf,b.csrf);assert.notEqual(dirs[0],dirs[1]);assert.equal(a.accounts.length,0);
  assert.equal((await request('/',cookieA)).status,200);
  assert.equal((await request('/api/config/select',cookieA,{id:a.selectedId},b.csrf)).status,403);
  assert.equal((await request('/api/official/open',cookieA,{},a.csrf)).status,409);
  const config={...a.configs[0],name:'浏览器 A 独有业务'};
  assert.equal((await request('/api/config/save',cookieA,config,a.csrf)).status,200);
  assert.equal((await (await request('/api/state',cookieB)).json()).configs[0].name,b.configs[0].name);
  assert.equal((await (await request('/api/state',cookieA)).json()).configs[0].name,config.name);
  assert.equal((await fetch(base+'/api/login/sms',{method:'POST',headers:{cookie:cookieA,origin:'https://evil.example'}})).status,403);
  assert.equal((await fetch(base+'/api/login/sms',{method:'POST',headers:{cookie:cookieA}})).status,403);
  now+=1;await actual.sweep();
  const restored=await (await request('/api/state',cookieA)).json();assert.equal(restored.configs[0].name,config.name);assert.notEqual(restored.csrf,a.csrf);
  // Invalid phone numbers never contact an official bridge; test the outer limiter.
  for(let n=0;n<10;n++)assert.equal((await request('/api/login/sms',n%2?cookieA:cookieB,{phone:'0',agreed:true},n%2?restored.csrf:b.csrf)).status, n%2?400:403);
  assert.equal((await request('/api/login/sms',cookieA,{phone:'0',agreed:true},restored.csrf)).status,429);
 }finally{await stop(backend);await actual.close();rmSync(directory,{recursive:true,force:true});}
});

test('old project address redirects pages only and never replays SMS or orders',async()=>{
 const server=http.createServer(redirectShanxi),port=await listen(server),base=`http://127.0.0.1:${port}/apps/shanxi`;
 try{
  const page=await fetch(base+'/',{redirect:'manual'});assert.equal(page.status,302);assert.equal(page.headers.get('location'),origin+'/');
  assert.equal((await fetch(base+'/api/state')).status,410);
  assert.equal((await fetch(base+'/api/order/submit',{method:'POST',redirect:'manual'})).status,410);
 }finally{await stop(server);}
});
