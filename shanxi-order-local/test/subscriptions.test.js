import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import http from 'node:http';
import {Service} from '../server/service.js';import {Accounts} from '../server/accounts.js';import {Ledger} from '../server/ledger.js';import {subscriptions,activities} from '../server/subscriptions.js';import {createApp} from '../server/app.js';
const info=(code,name,flag='N',extra={})=>({PRC_ID:code,PROD_PRC_NAME:name,UnSubScribe:flag,PRC_PRICE:'10 元/月',OP_TIME:'20260101000000',EFF_DATE:'20260101',EXP_DATE:'20991231',...extra});
const entry=(code,p)=>({ORDER_INFO:{PROD_CODE:code,PROD_INFO:p}});
export const businessFixture=()=>({mainList:[entry('01',info('PLAN','测试套餐','Y',{useProd:'Y'})),entry('01',info('NEXT','下月套餐','Y',{useProd:'N'}))],subList:[entry('02',info('VALUE','测试增值业务','Y')),entry('02',info('LOCKED','不能退订业务'))],svcList:[entry('03',info('BASIC','基础功能','Y'))]});
function setup(t,multi=false){
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'sx-unsubscribe-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));let now=1000000;
 const bridge={data:businessFixture(),calls:[],phone:'13800000000',result:{retCode:'0000',retMsg:'退订成功'},async authenticate(){return {retCode:'0000',data:{phone_no:this.phone}};},async business(){if(this.queryError)throw Error('network');return structuredClone({retCode:'0000',data:this.data});},async close(){},restoreSession(s){this.phone=s?.phone||'13800000000';},async exportSession(){return {phone:this.phone};},async call(method,payload){this.calls.push({method,payload});if(this.throwMethod===method)throw Error('network');if(method==='getActRecordInfo')return this.activityResult||{retCode:'0000',data:{RECORD_LIST:[{MEANS_NAME:'测试活动',ACT_NAME:'活动一',FEE_SUM:'5',token:'private'}]}};if(method==='qryUserOrderDetail')return {retCode:'0000',data:{prodName:'套餐详情',prodPrcDesc:'官方套餐说明'}};if(method==='unSubScribeOrder'){this.wroteBeforeRequest=fs.readFileSync(path.join(directory,'orders.json'),'utf8').includes('submitting');if(this.removeOnSuccess)this.data.subList.shift();return this.result;}throw Error('unsupported');}};
 const ledger=new Ledger(directory);let s;if(multi){s=new Accounts(()=>bridge,ledger,{now:()=>now});s.items=[{id:'a',phone:bridge.phone,status:'valid',session:{phone:bridge.phone}},{id:'b',phone:'13900000000',status:'valid',session:{phone:'13900000000'}}];s.selectedId='a';s.persist();}else s=new Service(bridge,ledger,()=>now);
 return {s,bridge,ledger,directory,tick:n=>now+=n};
}
async function prepare(s){let state=await s.queryBusiness();const row=state.business.items.find(r=>r.code==='VALUE');state=await s.prepareUnsubscribe(row.id,state.business.queryId);return state.unsubscribeIntent.id;}
test('按官方四类嵌套结构提取全部条目，所有具有合法产品编码的业务均可尝试退订，日期和资费保持原值',()=>{
 const rows=subscriptions(businessFixture());assert.equal(rows.length,5);assert.deepEqual(rows.map(r=>r.category),['plan','scheduled','value','value','basic']);assert.equal(rows.every(r=>r.canUnsubscribe),true);assert.deepEqual(rows.filter(r=>r.officialSupported).map(r=>r.code),['VALUE']);assert.equal(rows[0].expiresAt,'20991231');assert.equal(rows[0].price,'10 元/月');
 const d=businessFixture();d.subList.push(d.subList[0]);assert.match(subscriptions(d).find(r=>r.code==='VALUE').reason,/相同编码/);d.subList=[entry('02',info('../invalid','invalid','Y'))];assert.equal(subscriptions(d).find(r=>r.code==='../invalid').canUnsubscribe,false);
 assert.equal(activities({RECORD_LIST:Array.from({length:501},(_,i)=>({MEANS_NAME:'测试'+i}))}).length,501);assert.throws(()=>subscriptions({subList:{}}),{code:'INVALID_RESPONSE'});assert.throws(()=>subscriptions({unexpected:[]}),{code:'INVALID_RESPONSE'});assert.equal(subscriptions({list:[{name:'legacy',UnSubScribe:'Y'}]})[0].canUnsubscribe,false);
});
test('查询套餐和活动、详情；活动部分失败保留已有活动和完整业务列表',async t=>{
 const {s,bridge}=setup(t);let state=await s.queryBusiness();assert.equal(state.business.items.length,5);assert.equal(state.business.activities[0].token,undefined);const row=state.business.items[0];state=await s.queryBusinessDetail(row.id,state.business.queryId);assert.equal(state.businessDetail.description,'官方套餐说明');assert.deepEqual(bridge.calls.at(-1),{method:'qryUserOrderDetail',payload:{useProd:'Y'}});
 bridge.throwMethod='getActRecordInfo';state=await s.queryBusiness();assert.equal(state.business.items.length,5);assert.equal(state.business.activities.length,1);assert.match(state.business.activityError,/活动记录未更新/);const rowNow=state.business.items.find(r=>r.code==='VALUE');state=await s.prepareUnsubscribe(rowNow.id,state.business.queryId);assert.match(state.business.activityError,/活动记录未更新/);bridge.queryError=true;const before=s.business;await assert.rejects(s.queryBusiness());assert.equal(s.business,before);
});
test('退订持久化在先，确认、复查和一次写请求；成功后刷新并与订购记录隔离',async t=>{
 const {s,bridge,directory}=setup(t);const id=await prepare(s);await assert.rejects(s.unsubscribe(id,false),{code:'CONFIRM_REQUIRED'});assert.equal(bridge.calls.some(c=>c.method==='unSubScribeOrder'),false);bridge.removeOnSuccess=true;const result=await s.unsubscribe(id,true);assert.equal(result.unsubscriptions[0].status,'success');assert.equal(result.orders.length,0);assert.equal(result.business.items.length,4);assert.equal(bridge.wroteBeforeRequest,true);assert.equal(result.unsubscriptions[0].productCode,'VALUE');
 await s.unsubscribe(id,true);assert.equal(bridge.calls.filter(c=>c.method==='unSubScribeOrder').length,1);assert.deepEqual(bridge.calls.find(c=>c.method==='unSubScribeOrder').payload,{prod_prcid:'VALUE',couponsBusiName:'已订业务'});assert.equal(fs.readFileSync(path.join(directory,'orders.json'),'utf8').includes('13800000000'),false);
});
test('禁止伪造产品、旧列表、失效产品与过期确认，标记变化不阻止用户尝试',async t=>{
 const {s,bridge,tick}=setup(t);let state=await s.queryBusiness();await assert.rejects(s.prepareUnsubscribe('VALUE',state.business.queryId),{code:'NOT_FOUND'});await assert.rejects(s.prepareUnsubscribe(state.business.items[2].id,'old'),{code:'BUSINESS_CHANGED'});
 const id=await prepare(s);bridge.data.subList[0].ORDER_INFO.PROD_INFO.UnSubScribe='N';const result=await s.unsubscribe(id,true);assert.equal(result.unsubscriptions[0].status,'success');assert.equal(bridge.calls.filter(c=>c.method==='unSubScribeOrder').length,1);s.ledger.rows=[];
 bridge.data=businessFixture();const next=await prepare(s);tick(300001);await assert.rejects(s.unsubscribe(next,true),{code:'UNSUBSCRIBE_INTENT_EXPIRED'});assert.equal(s.unsubscribeIntent,null);
 const last=await prepare(s);bridge.data.subList[0].ORDER_INFO.PROD_INFO.PRC_PRICE='20 元/月';await assert.rejects(s.unsubscribe(last,true),{code:'UNSUBSCRIBE_UNAVAILABLE'});
});
test('超时、损坏结果不重试，重启后拦截；官方核实未生效才可解除',async t=>{
 const {s,bridge,ledger,directory}=setup(t);let id=await prepare(s);bridge.throwMethod='unSubScribeOrder';let state=await s.unsubscribe(id,true);assert.equal(state.unsubscriptions[0].status,'unknown');await s.unsubscribe(id,true);assert.equal(bridge.calls.filter(c=>c.method==='unSubScribeOrder').length,1);
 bridge.data.subList[0].ORDER_INFO.PROD_INFO.PRC_PRICE='20 元/月';const restarted=new Service(bridge,new Ledger(directory));await assert.rejects(prepare(restarted),{code:'UNSUBSCRIBE_EXISTS'});const record=ledger.rows[0];await assert.rejects(restarted.resolveUnsubscribe(record.id,false),{code:'INVALID_RESOLUTION'});await restarted.resolveUnsubscribe(record.id,true);bridge.throwMethod=null;bridge.result={};id=await prepare(restarted);state=await restarted.unsubscribe(id,true);assert.equal(state.unsubscriptions[0].status,'unknown');
 const saved=JSON.parse(fs.readFileSync(path.join(directory,'orders.json')));saved[0].status='submitting';fs.writeFileSync(path.join(directory,'orders.json'),JSON.stringify(saved));assert.equal(new Ledger(directory).rows[0].status,'unknown');
});
test('明确失败可重新准备；落盘失败不发请求，刷新失败不覆盖退订成功',async t=>{
 const {s,bridge,ledger}=setup(t);let id=await prepare(s);bridge.result={retCode:'900001',retMsg:'官方拒绝'};let state=await s.unsubscribe(id,true);assert.equal(state.unsubscriptions[0].status,'failed');id=await prepare(s);const save=ledger.save;ledger.save=()=>{throw Error('disk');};await assert.rejects(s.unsubscribe(id,true));assert.equal(bridge.calls.filter(c=>c.method==='unSubScribeOrder').length,1);ledger.save=save;
 const {s:another,bridge:b}=setup(t);id=await prepare(another);const call=b.call.bind(b);b.call=async(...args)=>{const r=await call(...args);if(args[0]==='unSubScribeOrder')b.queryError=true;return r;};state=await another.unsubscribe(id,true);assert.equal(state.unsubscriptions[0].status,'success');assert.match(state.business.refreshError,/刷新失败/);
});
test('登录过期清空列表与确认；账号切换拒绝原确认且记录隔离',async t=>{
 const {s,bridge}=setup(t,true);const id=await prepare(s);await s.selectAccount('b');await assert.rejects(s.unsubscribe(id,true),{code:'UNSUBSCRIBE_INTENT_INVALID'});assert.equal(s.snapshot().unsubscriptions.length,0);assert.equal(bridge.calls.some(c=>c.method==='unSubScribeOrder'),false);
 const {s:single,bridge:b}=setup(t);await prepare(single);b.authenticate=async()=>({retCode:'777777'});await assert.rejects(single.queryBusiness(),{code:'AUTH_EXPIRED'});assert.equal(single.business,null);assert.equal(single.unsubscribeIntent,null);
});
test('业务详情与退订 API 要求 CSRF、Origin、账号上下文，不接受任意编码直退',async t=>{
 const {s,bridge}=setup(t,true);const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));const port=server.address().port;server.on('request',createApp(s,{port}));const origin=`http://127.0.0.1:${port}`,state=await fetch(origin+'/api/state').then(r=>r.json());const headers={'content-type':'application/json','x-local-csrf':state.csrf,'x-account-context':`${state.activeAccountId}:${state.accountEpoch}`};
 const post=(route,body,extra={})=>fetch(origin+'/api'+route,{method:'POST',headers:{...headers,...extra},body:JSON.stringify(body)});
 for(const route of ['/unsubscribe/prepare','/unsubscribe/submit','/unsubscribe/resolve','/query/business/detail']){assert.equal((await post(route,{}, {'x-local-csrf':'bad'})).status,403);assert.equal((await post(route,{}, {origin:'https://evil.example'})).status,403);assert.equal((await post(route,{}, {'x-account-context':'old'})).status,409);}
 assert.equal((await post('/unsubscribe/submit',{prod_prcid:'VALUE',confirmed:true})).status,409);assert.equal(bridge.calls.some(c=>c.method==='unSubScribeOrder'),false);
 const queried=await post('/query/business',{}).then(r=>r.json()),row=queried.business.items.find(r=>r.code==='VALUE');const prepared=await post('/unsubscribe/prepare',{id:row.id,queryId:queried.business.queryId}).then(r=>r.json());assert.equal((await post('/unsubscribe/submit',{id:prepared.unsubscribeIntent.id,confirmed:true})).status,200);
});

test('套餐、待生效、基础功能与未标记业务可确认尝试，预览参数与实际提交及记录相同',async t=>{
 for(const code of ['PLAN','NEXT','BASIC','LOCKED']){
  const {s,bridge}=setup(t);const queried=await s.queryBusiness(),row=queried.business.items.find(r=>r.code===code);assert.equal(row.officialSupported,false);
  const prepared=await s.prepareUnsubscribe(row.id,queried.business.queryId),params={prod_prcid:code,couponsBusiName:'已订业务'};
  assert.deepEqual(prepared.unsubscribeIntent.params,params);assert.equal(bridge.calls.some(c=>c.method==='unSubScribeOrder'),false);
  const result=await s.unsubscribe(prepared.unsubscribeIntent.id,true);assert.deepEqual(bridge.calls.find(c=>c.method==='unSubScribeOrder').payload,params);assert.deepEqual(result.unsubscriptions[0].params,params);assert.equal(result.unsubscriptions[0].attemptAnyway,true);
 }
});
test('完整展示字段包含外层元数据、零值、布尔值、长说明与数组，仍过滤凭据',()=>{
 const d=businessFixture(),e=d.mainList[0];e.EXTRA={zero:0,enabled:false,description:'完整业务说明'.repeat(100),list:Array.from({length:501},(_,i)=>i),token:'private'};e.ORDER_INFO.PROD_INFO.uuid='private';
 const row=subscriptions(d)[0];assert.equal(row.sourceFields.EXTRA.zero,0);assert.equal(row.sourceFields.EXTRA.enabled,false);assert.equal(row.sourceFields.EXTRA.description.length,600);assert.equal(row.sourceFields.EXTRA.list.length,501);assert.equal(row.sourceFields.EXTRA.token,undefined);assert.equal(row.fields.uuid,undefined);
});
test('未知业务类型保留所有条目与原始字段，不因类型未识别而静默丢弃',()=>{
 const d=businessFixture();d.subList.push(entry('99',info('OTHER','其他已订产品')));const row=subscriptions(d).find(r=>r.code==='OTHER');assert.equal(row.category,'other');assert.equal(row.sourceFields.ORDER_INFO.PROD_CODE,'99');assert.equal(row.canUnsubscribe,true);
});
