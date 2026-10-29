import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Accounts} from '../server/accounts.js';
import {Ledger} from '../server/ledger.js';
import {AccountStore} from '../server/account-store.js';
function setup(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sx-accounts-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));let now=1000000;const calls=[],expired=new Set();let offline=false;
 const factory=()=>({phone:null,closed:false,restoreSession(s){this.phone=s?.storage?.phone||null;},async exportSession(){return {storage:{phone:this.phone,cookie:'synthetic-private-cookie'},sessionStorage:{ticket:'synthetic-private-token'}};},async close(){this.closed=true;},async open(){return {opened:true};},async status(){return {open:!this.closed};},async authenticate(){calls.push({type:'auth',phone:this.phone});if(offline)throw Error('network');return expired.has(this.phone)||!this.phone?{retCode:'777777'}:{retCode:'0000',data:{phone_no:this.phone}};},async sendLoginSms(phone){calls.push({type:'login-sms',phone});this.phone=phone;return {retCode:'0000'};},async login(_phone,code){return code==='001234'?{retCode:'0000'}:{retCode:'900001'};},async call(method,data){calls.push({method,data,phone:this.phone});if(method==='qqt5gaQryUserQualification')return {retCode:'0000',gBrandLevel:'02'};if(method==='qrySensitiveTag')return {retCode:'0000',data:{isSensitive:'N'}};if(method==='getSmsCodeSmsver')return {retCode:'0000',uuid:'memory-only-uuid'};return {retCode:'0000'};}});
 const ledger=new Ledger(dir),manager=()=>new Accounts(factory,ledger,{now:()=>now});const a=manager();return {a,manager,calls,expired,dir,tick:()=>{now+=61000;},offline:v=>offline=v};
}
async function login(a,phone){await a.sendLoginSms(phone,true);return a.login(a.snapshot().login.id,'001234',true);}
test('多个账号独立登录切换、备注和记录，重启后缓存直接恢复',async t=>{
 const {a,manager,calls,tick,dir}=setup(t);await login(a,'13800000000');const first=a.selectedId;await a.sendSms(false);const proof=a.snapshot().challenge.id;await a.verifySms(proof,'012345');await a.submit(proof,true);tick();await login(a,'13900000000');const second=a.selectedId;assert.equal(a.snapshot().accounts.length,2);assert.equal(a.snapshot().orders.length,0);await a.renameAccount(first,'工作号');await a.selectAccount(first);assert.equal(a.snapshot().account.phone,'138****0000');assert.equal(a.snapshot().orders.length,1);assert.equal(a.snapshot().challenge,null);assert.equal(a.sessions.get(second).bridge.closed,true);
 const sent=calls.filter(c=>c.type==='login-sms').length;await a.close();const b=manager();assert.equal(b.snapshot().account,null);assert.equal(b.snapshot().accounts[0].status,'cached');await b.restore();assert.equal(b.snapshot().account.phone,'138****0000');assert.equal(b.snapshot().accounts[0].label,'工作号');assert.equal(calls.filter(c=>c.type==='login-sms').length,sent);
 const raw=fs.readFileSync(path.join(dir,'accounts.enc'),'utf8');for(const secret of ['13800000000','13900000000','synthetic-private-cookie','synthetic-private-token','001234','memory-only-uuid'])assert.equal(raw.includes(secret),false);for(const file of ['accounts.enc','session-key'])assert.equal(fs.statSync(path.join(dir,file)).mode&0o777,0o600);assert.equal(JSON.stringify(b.snapshot()).includes('synthetic-private'),false);
});
test('有效缓存不能重复发登录短信，网络异常保留，官方失效才允许重新登录',async t=>{
 const {a,calls,offline,expired,tick}=setup(t);await login(a,'13800000000');const first=a.selectedId;tick();const restored=await a.sendLoginSms('13800000000',true);assert.equal(restored.loginRestored,true);assert.equal(calls.filter(c=>c.type==='login-sms').length,1);
 offline(true);await assert.rejects(a.restore());assert.equal(a.item(first).status,'unavailable');assert.ok(a.item(first).session);await assert.rejects(a.sendLoginSms('13800000000',true));assert.equal(calls.filter(c=>c.type==='login-sms').length,1);
 offline(false);await a.restore();expired.add('13800000000');await assert.rejects(a.restore(),{code:'AUTH_EXPIRED'});assert.equal(a.item(first).status,'expired');assert.equal(a.item(first).session,undefined);await a.sendLoginSms('13800000000',true);assert.equal(calls.filter(c=>c.type==='login-sms').length,2);expired.clear();await a.login(a.snapshot().login.id,'001234',true);assert.equal(a.selectedId,first);assert.equal(a.items.length,1);
});
test('切换失效旧账号的订购短信；旧页面账号上下文被拒绝；登录和业务短信冷却不绕过',async t=>{
 const {a,tick}=setup(t);await login(a,'13800000000');const first=a.selectedId,context=`${first}:${a.epoch}`;await a.sendSms(false);const id=a.snapshot().challenge.id;await assert.rejects(a.sendLoginSms('13900000000',true),{code:'SMS_COOLDOWN'});tick();await login(a,'13900000000');await a.selectAccount(first);assert.throws(()=>a.assertContext(context),{code:'ACCOUNT_CHANGED'});await assert.rejects(a.verifySms(id,'012345'),{code:'CHALLENGE_INVALID'});await a.sendSms(false);await a.selectAccount(a.items[1].id);await a.selectAccount(first);await assert.rejects(a.sendSms(false),{code:'SMS_COOLDOWN'});
});
test('缓存与官方号码不符时拒绝写操作，并清除该缓存',async t=>{
 const {a,calls}=setup(t);await login(a,'13800000000');const s=a.current();s.clear();s.bridge.phone='13900000000';await assert.rejects(a.sendSms(false),{code:'ACCOUNT_CHANGED'});assert.equal(a.item().status,'expired');assert.equal(calls.filter(c=>c.method==='getSmsCodeSmsver').length,0);
});
test('退出和移除仅影响指定账号，移除后仍保留原始订单',async t=>{
 const {a,manager,tick}=setup(t);await login(a,'13800000000');const first=a.selectedId;await a.sendSms(false);let id=a.snapshot().challenge.id;await a.verifySms(id,'012345');await a.submit(id,true);tick();await login(a,'13900000000');await a.logout();assert.equal(a.item().status,'signed_out');assert.equal(a.current().bridge.phone,null);assert.ok(a.item(first).session);await assert.rejects(a.removeAccount(first,false),{code:'CONFIRM_REQUIRED'});await a.removeAccount(first,true);assert.equal(a.ledger.rows.length,1);assert.equal(manager().items.length,1);
});
test('缓存损坏或缺失密钥时不默默清空账号',async t=>{const {a,dir}=setup(t);await login(a,'13800000000');const file=path.join(dir,'accounts.enc'),original=fs.readFileSync(file);const box=JSON.parse(original);box.tag=Buffer.alloc(16).toString('base64');fs.writeFileSync(file,JSON.stringify(box));assert.throws(()=>new AccountStore(dir),{code:'CACHE_INVALID'});fs.writeFileSync(file,original);fs.unlinkSync(path.join(dir,'session-key'));assert.throws(()=>new AccountStore(dir),{code:'CACHE_KEY_MISSING'});assert.deepEqual(fs.readFileSync(file),original);});

test('缓存保存失败会明确提示，有效内存会话仍优先恢复而不重发登录短信',async t=>{const {a,calls,tick}=setup(t);a.store.save=()=>{throw Error('disk full');};await login(a,'13800000000');assert.ok(a.snapshot().cacheError);tick();const restored=await a.sendLoginSms('13800000000',true);assert.equal(restored.loginRestored,true);assert.equal(calls.filter(c=>c.type==='login-sms').length,1);assert.equal(a.snapshot().accounts.length,1);});

test('号码资料仅保留运营字段并加密缓存，切换、重启与失效时不串号、不泄漏身份信息',async t=>{
 const {a,manager,tick}=setup(t);await login(a,'13800000000');const first=a.selectedId,s=a.current();
 s.bridge.authenticate=async()=>({retCode:'0000',data:{phone_no:'13800000000',sinfo:{loginNoInfo:{login_passwd:'never-public'},custInfo:{regionName:'太原',town_name:'小店',runCodeName:'正常',smName:'全球通',create_time:'20200101',user_grade_code_name:'银卡',custName:'真实姓名',idNo:'private-id',contact_address:'private-address'},prdInfo:{prod_prc_name:'离线套餐',mainPrcFee:'58'}}}});
 await a.restore();const profile=a.snapshot().accounts[0].profile;assert.equal(profile.region,'太原');assert.equal(profile.plan,'离线套餐');assert.equal(profile.planFee,'58');assert.equal(Object.keys(profile).length,8);for(const secret of ['never-public','真实姓名','private-id','private-address'])assert.equal(JSON.stringify(a.snapshot()).includes(secret),false);
 tick();await login(a,'13900000000');assert.deepEqual(a.snapshot().account.profile,{});assert.deepEqual(a.snapshot().accounts[1].profile,{});await a.close();const b=manager();assert.deepEqual(b.snapshot().accounts.find(r=>r.id===first).profile,profile);assert.equal(fs.readFileSync(path.join(a.ledger.directory,'accounts.enc'),'utf8').includes('离线套餐'),false);
});
