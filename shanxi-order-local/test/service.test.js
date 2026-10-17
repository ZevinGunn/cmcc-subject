import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Service} from '../server/service.js';
import {Ledger} from '../server/ledger.js';
function setup(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sx-order-test-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 let now=1000000;
 const bridge={phone:'13800000000',calls:[],result:{retCode:'0000',retMsg:'办理成功'},sensitive:'N',async authenticate(){return {retCode:'0000',data:{phone_no:this.phone}};},async close(){},async business(){return {retCode:'0000',data:[{prcName:'测试业务',token:'not-exported'}]};},async call(method,data,proof){this.calls.push({method,data,proof});if(this.errorMethod===method)throw Error('network');if(method==='qqt5gaQryUserQualification')return this.qual||{retCode:'0000',gBrandLevel:'02'};if(method==='qrySensitiveTag')return {retCode:'0000',data:{isSensitive:this.sensitive}};if(method==='getSmsCodeSmsver')return {retCode:'0000',uuid:'only-memory',data:{pos1:1,pos2:8,val1:'0',val2:'9'}};if(method==='qqt5gaSubmitPrcOrder')return this.result;return {retCode:'0000'};}};
 const ledger=new Ledger(dir),s=new Service(bridge,ledger,()=>now);
 return {s,bridge,ledger,dir,tick:n=>{now+=n;}};
}
async function verified(s){await s.sync();await s.sendSms();const id=s.challenge.id;await s.verifySms(id,'012345');return id;}
test('完整普通短信闭环，重复请求只提交一次，不落盘验证码或凭据',async t=>{const {s,bridge,dir}=setup(t);const id=await verified(s);const result=await s.submit(id,true);assert.equal(result.orders[0].status,'success');await s.submit(id,true);assert.equal(bridge.calls.filter(c=>c.method==='qqt5gaSubmitPrcOrder').length,1);assert.equal(bridge.calls.at(-1).proof.uuid,'only-memory');const saved=fs.readFileSync(path.join(dir,'orders.json'),'utf8');for(const secret of ['13800000000','012345','only-memory'])assert.equal(saved.includes(secret),false);assert.equal(s.challenge,null);});
test('敏感短信保持验证级别和固定位置',async t=>{const {s,bridge}=setup(t);bridge.sensitive='Y';await verified(s);const check=bridge.calls.find(c=>c.method==='chkSmsCodeSmsver');assert.equal(check.data.smsCode,'00123459');assert.equal(check.data.isSensitive,'Y');assert.equal(bridge.calls.find(c=>c.method==='getSmsCodeSmsver').data.isSensitive,'Y');});
test('未确认、未验证均不能下单',async t=>{const {s,bridge}=setup(t);await s.sync();await s.sendSms();await assert.rejects(s.submit(s.challenge.id,false),{code:'CONFIRM_REQUIRED'});await assert.rejects(s.submit(s.challenge.id,true),{code:'VERIFY_REQUIRED'});assert.equal(bridge.calls.filter(c=>c.method==='qqt5gaSubmitPrcOrder').length,0);});
test('提交前资格变化阻断订购',async t=>{const {s,bridge}=setup(t);const id=await verified(s);bridge.qual={retCode:'900006'};await assert.rejects(s.submit(id,true),{code:'NOT_ELIGIBLE'});assert.equal(bridge.calls.filter(c=>c.method==='qqt5gaSubmitPrcOrder').length,0);});
test('已默认享有和已办理需显式选择尝试，并保持短信验证、确认和官方拒绝结果',async t=>{
 for(const code of ['900005','900006']){
  const {s,bridge}=setup(t);bridge.qual={retCode:code};await s.sync();
  for(const flag of [undefined,false,'true',1])await assert.rejects(s.sendSms(flag),{code:'NOT_ELIGIBLE'});
  assert.equal(bridge.calls.filter(c=>c.method==='getSmsCodeSmsver').length,0);
  const sent=await s.sendSms(true);const id=sent.challenge.id;assert.equal(sent.challenge.attemptAnyway,true);assert.equal(sent.qualification.code,code);
  await assert.rejects(s.submit(id,true),{code:'VERIFY_REQUIRED'});await s.verifySms(id,'012345');await assert.rejects(s.submit(id,false),{code:'CONFIRM_REQUIRED'});
  bridge.result={retCode:code,retMsg:'官方拒绝：该权益无需办理'};const result=await s.submit(id,true);
  assert.equal(result.orders[0].status,'failed');assert.equal(result.orders[0].message,'官方拒绝：该权益无需办理');assert.equal(result.orders[0].attemptAnyway,true);assert.equal(result.orders[0].qualificationCode,code);assert.equal(result.qualification.code,code);
  await s.submit(id,true);assert.equal(bridge.calls.filter(c=>c.method==='qqt5gaSubmitPrcOrder').length,1);assert.deepEqual(bridge.calls.find(c=>c.method==='qqt5gaSubmitPrcOrder').data,{});
 }
});
test('尝试模式仍阻止失效资格、账号切换及结果未知的重复订购',async t=>{
 const {s,bridge}=setup(t);await s.sync();
 for(const code of ['900004','900010']){bridge.qual={retCode:code};await assert.rejects(s.sendSms(true),{code:'NOT_ELIGIBLE'});}
 bridge.qual={retCode:'900005'};await s.sendSms(true);let id=s.challenge.id;await s.verifySms(id,'012345');bridge.qual={retCode:'900010'};await assert.rejects(s.submit(id,true),{code:'NOT_ELIGIBLE'});
 bridge.qual={retCode:'900005'};bridge.errorMethod='qqt5gaSubmitPrcOrder';await s.submit(id,true);assert.equal(s.snapshot().orders[0].status,'unknown');await assert.rejects(s.sendSms(true),{code:'ORDER_EXISTS'});
 const next=setup(t);next.bridge.qual={retCode:'900005'};await next.s.sync();await next.s.sendSms(true);id=next.s.challenge.id;await next.s.verifySms(id,'012345');next.bridge.phone='13900000000';await assert.rejects(next.s.submit(id,true),{code:'ACCOUNT_CHANGED'});
});
test('发送冷却、敏感验证码不可自动降级',async t=>{const {s,bridge}=setup(t);await s.sync();await s.sendSms();await assert.rejects(s.sendSms(),{code:'SMS_COOLDOWN'});assert.equal(bridge.calls.filter(c=>c.method==='getSmsCodeSmsver').length,1);});
test('未知验证方式不能发短信',async t=>{const {s,bridge}=setup(t);bridge.sensitive='';await s.sync();await assert.rejects(s.sendSms(),{code:'SMS_MODE_UNKNOWN'});assert.equal(bridge.calls.filter(c=>c.method==='getSmsCodeSmsver').length,0);});
test('账号切换清除原账号验证码和查询缓存',async t=>{const {s,bridge}=setup(t);const id=await verified(s);bridge.phone='13900000000';await assert.rejects(s.submit(id,true),{code:'ACCOUNT_CHANGED'});assert.equal(s.challenge,null);assert.equal(s.account,null);await s.sync();assert.equal(s.snapshot().orders.length,0);});
test('网络超时记录未知，禁止重发，重启后保留',async t=>{const {s,bridge,dir}=setup(t);const id=await verified(s);bridge.errorMethod='qqt5gaSubmitPrcOrder';await s.submit(id,true);assert.equal(s.snapshot().orders[0].status,'unknown');await assert.rejects(s.sendSms(),{code:'ORDER_EXISTS'});const second=new Service(bridge,new Ledger(dir));await second.sync();await assert.rejects(second.sendSms(),{code:'ORDER_EXISTS'});assert.equal(second.snapshot().orders[0].status,'unknown');});
test('官方明确拒绝允许重新验证，不假报成功',async t=>{const {s,bridge,tick}=setup(t);const id=await verified(s);bridge.result={retCode:'900001',retMsg:'业务不可办理'};await s.submit(id,true);assert.equal(s.snapshot().orders[0].status,'failed');tick(61000);await s.sendSms();assert.notEqual(s.challenge.id,id);});
test('并发操作被拒绝而非重复办理',async t=>{const {s}=setup(t);let release;const task=s.exclusive(()=>new Promise(r=>release=r));await assert.rejects(s.sync(),{code:'BUSY'});release();await task;assert.equal(s.busy,false);});
test('重启恢复提交中为结果未知',t=>{const {ledger,dir}=setup(t);ledger.add({id:'interrupted',account:'a',status:'submitting'});assert.equal(new Ledger(dir).rows[0].status,'unknown');});
test('资格显示已领只能核查享有，不能推断本笔交易成功',async t=>{const {s,bridge}=setup(t);const id=await verified(s);bridge.errorMethod='qqt5gaSubmitPrcOrder';await s.submit(id,true);bridge.qual={retCode:'900006'};await s.reconcile(s.snapshot().orders[0].id);assert.equal(s.snapshot().orders[0].status,'held');});
test('过期本地验证码流程不能提交',async t=>{const {s,tick}=setup(t);const id=await verified(s);tick(600001);await assert.rejects(s.submit(id,true),{code:'CHALLENGE_EXPIRED'});});
test('查询部分失败保留已加载业务',async t=>{const {s,bridge}=setup(t);await s.sync();await s.queryBusiness();const old=s.business;bridge.business=async()=>{throw Error('network');};await assert.rejects(s.queryBusiness());assert.equal(s.business,old);assert.equal(s.business.data[0].token,undefined);});
test('人工核查解除必须确认且属于当前账号',async t=>{const {s,bridge}=setup(t);const id=await verified(s);bridge.errorMethod='qqt5gaSubmitPrcOrder';await s.submit(id,true);const order=s.snapshot().orders[0];await assert.rejects(s.resolve(order.id,false));await s.resolve(order.id,true);assert.equal(s.snapshot().orders[0].status,'released');});
test('操作响应解除忙碌状态，界面不会永久禁用',async t=>{const {s}=setup(t);assert.equal((await s.sync()).busy,false);assert.equal((await s.sendSms()).busy,false);assert.equal(s.busy,false);});

function loginBridge(bridge){bridge.sendLoginSms=async phone=>{bridge.loginPhone=phone;return {retCode:'0000'};};bridge.login=async(phone,code)=>{bridge.loginCode=code;bridge.phone=phone;return {retCode:'0000'};};}
test('登录短信、登录、查询内容到订购的完整状态链',async t=>{const {s,bridge,dir}=setup(t);loginBridge(bridge);await s.sendLoginSms('13900000000',true);const snapshot=s.snapshot();assert.equal(snapshot.login.phone,'139****0000');assert.equal(JSON.stringify(snapshot).includes('13900000000'),false);const logged=await s.login(snapshot.login.id,'001234',true);assert.equal(logged.account.phone,'139****0000');assert.equal(logged.login,null);assert.equal(bridge.loginCode,'001234');await s.queryQualification();assert.equal(s.snapshot().content.product.code,'BCAT5075');assert.equal(s.snapshot().content.data.gBrandLevel,'02');await s.sendSms();const id=s.challenge.id;await s.verifySms(id,'012345');await s.submit(id,true);assert.equal(s.snapshot().orders[0].status,'success');const saved=fs.readFileSync(path.join(dir,'orders.json'),'utf8');assert.equal(saved.includes('001234'),false);assert.equal(saved.includes('13900000000'),false);});
test('无协议、非法号码、伪造或过期登录挑战均被拒绝',async t=>{const {s,bridge,tick}=setup(t);loginBridge(bridge);await assert.rejects(s.sendLoginSms('13900000000',false),{code:'AGREEMENT_REQUIRED'});await assert.rejects(s.sendLoginSms('123',true),{code:'INVALID_PHONE'});assert.equal(bridge.loginPhone,undefined);await s.sendLoginSms('13900000000',true);const id=s.loginAttempt.id;await assert.rejects(s.login('forged','001234',true),{code:'LOGIN_CHALLENGE_INVALID'});await assert.rejects(s.login(id,'001234',false),{code:'AGREEMENT_REQUIRED'});tick(600001);await assert.rejects(s.login(id,'001234',true),{code:'LOGIN_CHALLENGE_EXPIRED'});assert.equal(bridge.loginCode,undefined);});
test('登录短信丢失响应保留挑战并限制冷却，官方拒绝会清除挑战',async t=>{const {s,bridge,tick}=setup(t);loginBridge(bridge);bridge.sendLoginSms=async()=>{throw Error('timeout');};await assert.rejects(s.sendLoginSms('13900000000',true));assert.ok(s.snapshot().login.id);await assert.rejects(s.sendLoginSms('13800000000',true),{code:'SMS_COOLDOWN'});tick(61000);bridge.sendLoginSms=async()=>({retCode:'900001',retMsg:'拒绝发送'});await assert.rejects(s.sendLoginSms('13800000000',true),{code:'UPSTREAM_REJECTED'});assert.equal(s.loginAttempt,null);});
test('错误登录验证码不产生账号，校验次数有界',async t=>{const {s,bridge}=setup(t);loginBridge(bridge);await s.sendLoginSms('13900000000',true);bridge.login=async()=>({retCode:'900001',retMsg:'验证码错误'});const id=s.loginAttempt.id;for(let i=0;i<5;i++)await assert.rejects(s.login(id,'001234',true),{code:'UPSTREAM_REJECTED'});await assert.rejects(s.login(id,'001234',true),{code:'LOGIN_ATTEMPTS_EXCEEDED'});assert.equal(s.account,null);});
test('登录后的官方身份不一致会关闭会话',async t=>{const {s,bridge}=setup(t);loginBridge(bridge);let closed=false;bridge.close=async()=>{closed=true;};bridge.login=async()=>({retCode:'0000'});await s.sendLoginSms('13900000000',true);await assert.rejects(s.login(s.loginAttempt.id,'001234',true),{code:'ACCOUNT_CHANGED'});assert.equal(s.account,null);assert.equal(closed,true);});
test('再次校验业务验证码失败会撤销已验证状态',async t=>{const {s,bridge}=setup(t);const id=await verified(s);bridge.errorMethod='chkSmsCodeSmsver';await assert.rejects(s.verifySms(id,'999999'));assert.equal(s.challenge.verified,false);await assert.rejects(s.submit(id,true),{code:'VERIFY_REQUIRED'});});

test('查询过程中会话失效会清空账号与查询缓存',async t=>{const {s,bridge}=setup(t);await s.sync();await s.queryQualification();bridge.business=async()=>({retCode:'777777'});await assert.rejects(s.queryBusiness(),{code:'AUTH_EXPIRED'});assert.equal(s.account,null);assert.equal(s.content,null);assert.equal(s.qual,null);});

test('保存或切换业务使旧短信失效；过时页面不能为另一个业务发码',async t=>{
 const {s,bridge,tick}=setup(t);const id=await verified(s);const original=s.catalog.get();
 await s.saveConfig({...original,price:'资费已更新'});assert.equal(s.challenge,null);assert.equal(s.qual,null);assert.ok(s.account);await assert.rejects(s.submit(id,true),{code:'CHALLENGE_INVALID'});
 tick(61000);await assert.rejects(s.sendSms(false,{id:original.id,revision:original.revision}),{code:'CONFIG_CHANGED'});
 await s.sendSms();const second=s.challenge.id;await s.saveConfig({...s.catalog.get(),id:'',name:'另一配置'});await assert.rejects(s.verifySms(second,'012345'),{code:'CHALLENGE_INVALID'});assert.equal(bridge.calls.filter(c=>c.method==='qqt5gaSubmitPrcOrder').length,0);
});
test('自定义业务发码、验证、额外参数及配置快照进入订单；不同产品独立防重复',async t=>{
 const {s,bridge,tick}=setup(t);await s.submit(await verified(s),true);
 const base=s.catalog.get(),custom={...base,id:'',name:'自定义流量包',price:'10 元/月',queryMode:'none',queryPath:'',orderPath:'traffic/submitOrder',orderParams:{offerId:'TRAFFIC_A',months:1},sms:{...base.sms,prcId:'TRAFFIC_A',busiType:'TRAFFIC_SMS',businessCode:'T_A'}};
 await s.saveConfig(custom);tick(61000);await assert.rejects(s.sendSms(),{code:'NOT_ELIGIBLE'});await s.sendSms(true);
 const sms=bridge.calls.findLast(c=>c.method==='getSmsCodeSmsver');assert.equal(sms.data.prcId,'TRAFFIC_A');assert.equal(sms.data.businessCode,'T_A');
 const id=s.challenge.id;await s.verifySms(id,'012345');assert.equal(bridge.calls.findLast(c=>c.method==='chkSmsCodeSmsver').data.busiType,'TRAFFIC_SMS');await s.submit(id,true);
 const row=s.snapshot().orders[0];assert.equal(row.name,custom.name);assert.equal(row.price,'10 元/月');assert.deepEqual(bridge.calls.at(-1).data,custom.orderParams);assert.equal(row.config.orderPath,custom.orderPath);assert.notEqual(row.product,'qqt5ga');
 await assert.rejects(s.sendSms(true),{code:'ORDER_EXISTS'});await s.saveConfig({...s.catalog.get(),id:'',name:'同业务改名副本'});await assert.rejects(s.sendSms(true),{code:'ORDER_EXISTS'});
});
test('通用业务不套用 5G-A 响应码；核查始终使用订单保存的配置',async t=>{
 const {s,bridge,tick}=setup(t);await s.saveConfig({...s.catalog.get(),id:'',name:'通用业务',queryMode:'generic',queryPath:'custom/check',orderPath:'custom/order',sms:{...s.catalog.get().sms,prcId:'CUSTOM',busiType:'CUSTOM_SMS'}});
 bridge.qual={retCode:'900005',retMsg:'另一业务的专用提示'};await s.sync();await s.queryQualification();assert.equal(s.qual.state,'unverified');await s.sendSms(true);const id=s.challenge.id;await s.verifySms(id,'012345');bridge.errorMethod='qqt5gaSubmitPrcOrder';await s.submit(id,true);const row=s.snapshot().orders[0];
 const used=[];const call=bridge.call.bind(bridge);bridge.call=async(...args)=>{used.push(args);return call(...args);};await s.saveConfig({...s.catalog.get(),queryPath:'custom/newCheck'});await s.selectConfig('qqt5ga');await s.queryQualification();const builtin=s.qual;await s.deleteConfig(row.config.id,row.config.revision+1);await s.reconcile(row.id);
 assert.equal(used.at(-1)[3].queryPath,'custom/check');assert.equal(s.qual,builtin);assert.equal(s.snapshot().orders[0].status,'unknown');assert.equal(s.snapshot().orders[0].checkMessage,'另一业务的专用提示');
});

test('内置配置重构后仍发送原始完整短信字段，无附加空 businessCode',async t=>{const {s,bridge}=setup(t);await s.sync();await s.sendSms();assert.deepEqual(bridge.calls.find(c=>c.method==='getSmsCodeSmsver').data,{channelId:'llwap0',busiType:'QQT5GA_SMS',busiName:'全球通5GA加速权益',prodDesc:'5GA加速权益',effDate:'立即生效',sendType:'2',actType:'',busiId:'',prcId:'BCAT5075',actId:'',meansId:''});});
