import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {randomBytes} from 'node:crypto';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {signGateway,verifyGateway} from '../server/gateway-auth.js';
import {createPublicApp} from '../server/public-app.js';
import {Accounts} from '../server/accounts.js';
import {Ledger} from '../server/ledger.js';
import {createShanxiGateway} from '../../project-manager/shanxi-gateway.js';

test('gateway signatures bind identity, method, URL and expiry',()=>{
 const key=randomBytes(32),now=Date.now();
 const req={method:'POST',url:'/api/config/save',headers:signGateway(key,{tenant:'a',method:'POST',url:'/api/config/save',time:now})};
 assert.equal(verifyGateway(key,req,now),'a');
 for(const invalid of [{...req,method:'GET'},{...req,url:'/api/order/submit'},{...req,headers:{...req.headers,'x-shanxi-tenant':'b'}}])assert.equal(verifyGateway(key,invalid,now),null);
 assert.equal(verifyGateway(key,req,now+30001),null);
 assert.equal(verifyGateway(randomBytes(32),req,now),null);
});

async function listen(server){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return server.address().port;}
async function stop(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}

test('authenticated public gateway isolates caches and blocks forged identity, CSRF and remote windows',async()=>{
 const directory=mkdtempSync(path.join(os.tmpdir(),'shanxi-public-')),key=randomBytes(32);writeFileSync(path.join(directory,'key'),key);
 let now=Date.now();const dirs=[];
 const makeService=dir=>{dirs.push(dir);return new Accounts(()=>({close:async()=>{}}),new Ledger(dir));};
 const backend=http.createServer(),backendPort=await listen(backend);
 const gateway=createShanxiGateway({keyPath:path.join(directory,'key'),port:backendPort,authorize:req=>req.headers['test-admin']?{id:req.headers['test-admin']}:null,canAccess:admin=>admin.id!=='blocked',sameOrigin:req=>req.headers.origin==='https://project.1008086.xyz'});
 const actual=createPublicApp({key,directory,dist:directory,port:backendPort,makeService,now:()=>now,idleMs:0});
 backend.on('request',actual.app);
 const frontend=http.createServer(gateway),gatewayPort=await listen(frontend);
 const base=`http://127.0.0.1:${gatewayPort}/apps/shanxi`;
 const request=(route,admin,body,csrf)=>fetch(base+route,{method:body===undefined?'GET':'POST',redirect:'manual',headers:{...(admin?{'test-admin':admin}:{}),...(body===undefined?{}:{origin:'https://project.1008086.xyz','content-type':'application/json','x-local-csrf':csrf||''}),'x-shanxi-tenant':'victim','x-shanxi-signature':'0'.repeat(64)},...(body===undefined?{}:{body:JSON.stringify(body)})});
 try{
  assert.equal((await request('/api/state')).status,401);
  assert.equal((await request('/')).status,302);
  assert.equal((await request('/api/state','blocked')).status,403);
  assert.equal((await fetch(`http://127.0.0.1:${backendPort}/api/state`,{headers:{'x-shanxi-tenant':'victim'}})).status,401);
  const a=await (await request('/api/state','a')).json(),b=await (await request('/api/state','b')).json();
  assert.equal(a.publicMode,true);assert.notEqual(a.csrf,b.csrf);assert.notEqual(dirs[0],dirs[1]);assert.equal(a.accounts.length,0);
  assert.equal((await request('/api/config/select','a',{id:a.selectedId},b.csrf)).status,403);
  assert.equal((await request('/api/official/open','a',{},a.csrf)).status,409);
  const config={...a.configs[0],name:'用户 A 独有业务'};
  const saved=await request('/api/config/save','a',config,a.csrf);assert.equal(saved.status,200);
  assert.equal((await (await request('/api/state','b')).json()).configs[0].name,b.configs[0].name);
  assert.equal((await (await request('/api/state','a')).json()).configs[0].name,config.name);
  const cross=await fetch(base+'/api/login/sms',{method:'POST',headers:{'test-admin':'a',origin:'https://evil.example'}});assert.equal(cross.status,403);
  now+=1;await actual.sweep();
  const restored=await (await request('/api/state','a')).json();assert.equal(restored.configs[0].name,config.name);assert.notEqual(restored.csrf,a.csrf);
 }finally{await stop(frontend);await stop(backend);await actual.close();rmSync(directory,{recursive:true,force:true});}
});
