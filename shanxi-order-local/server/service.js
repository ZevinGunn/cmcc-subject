import {randomUUID} from 'node:crypto';
import {AppError,success,requireSuccess,qualification,sensitiveChallenge,composeCode,maskPhone,publicData,safeMessage} from './domain.js';
import {Catalog,defaultConfig,viewProduct,productKey,assertConfigReady} from './catalog.js';
export class Service {
 constructor(bridge,ledger,now=Date.now,catalog=new Catalog(ledger.directory)){Object.assign(this,{bridge,ledger,now,catalog});this.account=null;this.qual=null;this.business=null;this.content=null;this.challenge=null;this.loginAttempt=null;this.lastLoginSmsAt=-Infinity;this.loginSmsWindow=0;this.loginSmsCount=0;this.busy=false;this.lastSmsAt=-Infinity;this.smsCount=0;this.smsWindow=0;}
 snapshot(){
  return {product:viewProduct(this.catalog.get()),configs:this.catalog.list(),selectedId:this.catalog.selectedId,configTemplate:defaultConfig(),account:this.account?{phone:maskPhone(this.account.phone),syncedAt:this.account.syncedAt}:null,qualification:this.qual,content:this.content,business:this.business,orders:this.account?this.ledger.list(this.account.hash):[],busy:this.busy,challenge:this.publicChallenge(),cooldown:Math.max(0,Math.ceil((this.lastSmsAt+60000-this.now())/1000)),login:this.loginAttempt?{id:this.loginAttempt.id,phone:maskPhone(this.loginAttempt.phone),expiresAt:this.loginAttempt.expiresAt}:null,loginCooldown:Math.max(0,Math.ceil((this.lastLoginSmsAt+60000-this.now())/1000))};
 }
 publicChallenge(){const c=this.challenge;return c?{id:c.id,sensitive:c.sensitive,fixed:c.fixed,verified:c.verified,attemptAnyway:c.attemptAnyway===true,configId:c.configId,revision:c.revision,expiresAt:c.expiresAt}:null;}
 async exclusive(fn){if(this.busy)throw new AppError('BUSY','上一项操作仍在处理中，请稍候',409);this.busy=true;try{const result=await fn();if(result&&Object.hasOwn(result,'busy'))result.busy=false;return result;}catch(e){if(e.status===401)this.clear();throw e;}finally{this.busy=false;}}
 clear(){this.account=null;this.qual=null;this.content=null;this.business=null;this.challenge=null;}
 async sendLoginSms(phone,agreed){return this.exclusive(async()=>{
  if(this.account)throw new AppError('LOGOUT_REQUIRED','请先退出当前账号再登录其他号码',409);
  if(typeof phone!=='string'||!/^1[3-9]\d{9}$/.test(phone))throw new AppError('INVALID_PHONE','请输入正确的 11 位手机号码');
  if(agreed!==true)throw new AppError('AGREEMENT_REQUIRED','请阅读并同意山西移动服务协议与隐私政策');
  if(this.now()-this.lastLoginSmsAt<60000)throw new AppError('SMS_COOLDOWN','请等待 60 秒后再发送登录验证码',429);
  if(this.now()-this.loginSmsWindow>=600000){this.loginSmsWindow=this.now();this.loginSmsCount=0;}
  if(this.loginSmsCount>=5)throw new AppError('SMS_LIMIT','登录短信请求较多，请稍后再试',429);
  this.lastLoginSmsAt=this.now();this.loginSmsCount++;
  // A lost send response may still deliver an SMS; retain its local intent.
  this.loginAttempt={id:randomUUID(),phone,expiresAt:this.now()+600000,attempts:0};
  const result=await this.bridge.sendLoginSms(phone);
  if(!success(result)){this.loginAttempt=null;requireSuccess(result);}
  return this.snapshot();
 });}
 async login(id,code,agreed){return this.exclusive(async()=>{
  if(this.account)throw new AppError('LOGOUT_REQUIRED','请先退出当前账号',409);
  if(agreed!==true)throw new AppError('AGREEMENT_REQUIRED','请阅读并同意山西移动服务协议与隐私政策');
  const attempt=this.loginAttempt;
  if(!attempt||attempt.id!==id)throw new AppError('LOGIN_CHALLENGE_INVALID','请先为当前号码获取登录验证码');
  if(attempt.expiresAt<=this.now()){this.loginAttempt=null;throw new AppError('LOGIN_CHALLENGE_EXPIRED','本地登录流程已超时，请重新获取验证码');}
  if(typeof code!=='string'||!/^\d{6}$/.test(code))throw new AppError('INVALID_CODE','请输入 6 位登录验证码');
  if(attempt.attempts>=5)throw new AppError('LOGIN_ATTEMPTS_EXCEEDED','本轮验证次数过多，请重新获取验证码',429);
  attempt.attempts++;
  requireSuccess(await this.bridge.login(attempt.phone,code));
  await this.auth();
  if(this.account.phone!==attempt.phone){this.clear();this.loginAttempt=null;await this.bridge.close();throw new AppError('ACCOUNT_CHANGED','官方返回的号码与登录号码不一致，请重新登录',409);}
  this.loginAttempt=null;
  return this.snapshot();
 });}
 async auth(){
  let r;
  try{r=requireSuccess(await this.bridge.authenticate());}catch(e){if(e.status===401)this.clear();throw e;}
  const phone=r.data?.phone_no || r.data?.phoneNo || r.data?.custInfo?.phoneNo;
  if(!/^1[3-9]\d{9}$/.test(phone||''))throw new AppError('IDENTITY_UNKNOWN','官方登录状态缺少有效号码，请重新登录',401);
  const changed=this.account&&this.account.phone!==phone;
  if(changed){this.clear();throw new AppError('ACCOUNT_CHANGED','官方窗口的号码已改变，请再次同步后重新操作',409);}
  this.account={phone,hash:this.ledger.account(phone),syncedAt:new Date(this.now()).toISOString()};
  return this.account;
 }
 async sync(){return this.exclusive(async()=>{await this.auth();this.loginAttempt=null;return this.snapshot();});}
 async logout(){return this.exclusive(async()=>{this.clear();this.loginAttempt=null;await this.bridge.close();return this.snapshot();});}
 resetProduct(){this.challenge=null;this.qual=null;this.content=null;}
 async saveConfig(input){return this.exclusive(async()=>{this.catalog.save(input);this.resetProduct();return this.snapshot();});}
 async selectConfig(id){return this.exclusive(async()=>{this.catalog.select(id);this.resetProduct();return this.snapshot();});}
 async deleteConfig(id,revision){return this.exclusive(async()=>{if(this.catalog.get(id).revision!==revision)throw new AppError('CONFIG_CHANGED','业务配置已更新，请刷新后重试',409);const selected=this.catalog.selectedId;this.catalog.remove(id);if(id===selected)this.resetProduct();return this.snapshot();});}
 async queryQualification(){return this.exclusive(async()=>{assertConfigReady(this.catalog.get());await this.auth();await this.refreshQualification();return this.snapshot();});}
 async readQualification(config){
  assertConfigReady(config);
  if(config.queryMode==='none')return {q:{state:'unverified',label:'未核实资格',message:'此业务未配置资格查询，尝试办理的受理结果以官方为准。',code:''},response:null};
  const response=await this.bridge.call('qqt5gaQryUserQualification',config.queryParams,null,config);
  if(config.queryMode==='qqt5ga')return {q:qualification(response),response};
  if(!response||typeof response!=='object'||response.retCode===undefined)throw new AppError('INVALID_RESPONSE','官方查询未返回有效结果',502);
  if(['777777','999999'].includes(String(response.retCode)))requireSuccess(response);
  return {q:{state:'unverified',label:'待确认受理条件',message:safeMessage(response.retMsg||'已获取官方响应，请核对后再尝试办理。'),code:String(response.retCode)},response};
 }
 async refreshQualification(){
  const config=this.catalog.get();const {q,response}=await this.readQualification(config);
  this.qual=q;this.content={product:viewProduct(config),data:publicData(response),queriedAt:new Date(this.now()).toISOString()};return q;
 }
 async queryBusiness(){return this.exclusive(async()=>{await this.auth();const r=requireSuccess(await this.bridge.business());this.business={data:publicData(r.data??r),queriedAt:new Date(this.now()).toISOString(),message:safeMessage(r.retMsg||'查询成功')};return this.snapshot();});}
 assertNoOrder(){const blocking=this.ledger.blocking(this.account.hash,productKey(this.catalog.get()));if(blocking)throw new AppError('ORDER_EXISTS',blocking.status==='unknown'?'已有结果待核查的办理，请先在办理记录中核查':'该权益已有办理记录，请查询当前权益状态',409);}
 assertQualification(q,attemptAnyway){if(q.state!=='eligible'&&!(attemptAnyway===true&&['included','ordered','unverified'].includes(q.state)))throw new AppError('NOT_ELIGIBLE',q.message);}
 async sendSms(attemptAnyway=false,expected){return this.exclusive(async()=>{
  const current=this.catalog.get();if(expected&&(expected.id!==current.id||expected.revision!==current.revision))throw new AppError('CONFIG_CHANGED','当前业务配置已改变，请核对后重新获取验证码',409);
  assertConfigReady(current);
  await this.auth();this.assertNoOrder();const config=this.catalog.get();
  if(this.now()-this.lastSmsAt<60000)throw new AppError('SMS_COOLDOWN','请等待 60 秒后再发送验证码',429);
  const q=await this.refreshQualification();this.assertQualification(q,attemptAnyway);
  const tag=requireSuccess(await this.bridge.call('qrySensitiveTag',{busiType:config.sms.busiType},null,config));
  const value=tag.data?.isSensitive??tag.isSensitive;
  if(!['Y','N'].includes(value))throw new AppError('SMS_MODE_UNKNOWN','无法确认业务验证方式，请在官方窗口检查');
  const sensitive=value==='Y';
  if(this.now()-this.smsWindow>10*60*1000){this.smsWindow=this.now();this.smsCount=0;}
  if(sensitive&&this.smsCount>=3)throw new AppError('SMS_LIMIT','本轮已发送 3 次，请稍后重试',429);
  // Count an attempted send for cooldown even if the response is lost.
  this.lastSmsAt=this.now();this.challenge=null;
  const payload={...config.sms,...(sensitive?{isSensitive:'Y'}:{})};if(!payload.businessCode)delete payload.businessCode;
  this.smsCount++;
  const c=sensitiveChallenge(await this.bridge.call('getSmsCodeSmsver',payload,null,config),sensitive);
  this.challenge={...c,id:randomUUID(),account:this.account.hash,configId:config.id,revision:config.revision,verified:false,attemptAnyway:attemptAnyway===true,expiresAt:this.now()+10*60*1000};
  return this.snapshot();
 });}
 getChallenge(id){const c=this.challenge,config=this.catalog.get();if(!c||c.id!==id||c.account!==this.account?.hash||c.configId!==config.id||c.revision!==config.revision)throw new AppError('CHALLENGE_INVALID','验证码流程已改变，请重新获取');if(c.expiresAt<=this.now()){this.challenge=null;throw new AppError('CHALLENGE_EXPIRED','本地确认流程已超时，请重新获取验证码');}return c;}
 async verifySms(id,input){return this.exclusive(async()=>{
  assertConfigReady(this.catalog.get());
  await this.auth();const c=this.getChallenge(id),config=this.catalog.get();const smsCode=composeCode(input,c);
  c.verified=false;
  requireSuccess(await this.bridge.call('chkSmsCodeSmsver',{uuid:c.uuid,busiType:config.sms.busiType,smsCode,...(c.sensitive?{isSensitive:'Y'}:{})},null,config));
  c.verified=true;return this.snapshot();
 });}
 async submit(id,confirmed){return this.exclusive(async()=>{
  if(confirmed!==true)throw new AppError('CONFIRM_REQUIRED','请确认业务、资费及办理号码');
  assertConfigReady(this.catalog.get());
  await this.auth();
  const existing=this.ledger.rows.find(r=>r.intent===id&&r.account===this.account.hash);
  if(existing)return this.snapshot();
  const c=this.getChallenge(id);if(!c.verified)throw new AppError('VERIFY_REQUIRED','请先验证业务验证码');
  this.assertNoOrder();const q=await this.refreshQualification();this.assertQualification(q,c.attemptAnyway);
  const config=this.catalog.get();
  const order=this.ledger.add({id:randomUUID(),intent:id,account:this.account.hash,phone:maskPhone(this.account.phone),product:productKey(config),config,name:config.name,price:config.price,attemptAnyway:c.attemptAnyway,qualificationCode:q.code,status:'submitting',createdAt:new Date(this.now()).toISOString(),message:'已提交，正在等待官方结果'});
  // Durable write happens BEFORE the irreversible external request.
  this.challenge=null;
  let result;
  try{result=await this.bridge.call('qqt5gaSubmitPrcOrder',config.orderParams,{uuid:c.uuid},config);}
  catch{
   this.ledger.update(order.id,{status:'unknown',message:'未收到确定结果。请先核查权益，勿重复办理。'});return this.snapshot();
  }
  const valid=result&&result.retCode!==undefined;
  this.ledger.update(order.id,{status:!valid?'unknown':success(result)?'success':'failed',code:valid?String(result.retCode):'',message:!valid?'官方返回格式异常，办理结果待核查':safeMessage(result.retMsg || (success(result)?'官方已确认办理成功，生效时间以短信为准':'官方未受理本次办理'))});
  if(success(result))this.qual={...this.qual,state:'ordered',label:'已办理',message:'官方已确认办理成功。'};
  if(['999999','777777'].includes(String(result?.retCode)))this.clear();
  return this.snapshot();
 });}
 async reconcile(id){return this.exclusive(async()=>{
  await this.auth();const row=this.ledger.rows.find(r=>r.id===id&&r.account===this.account.hash);if(!row)throw new AppError('NOT_FOUND','办理记录不存在',404);
  const config=row.config||defaultConfig();const {q,response}=await this.readQualification(config);
  if(productKey(this.catalog.get())===row.product){this.qual=q;this.content={product:viewProduct(config),data:publicData(response),queriedAt:new Date(this.now()).toISOString()};}
  this.ledger.update(id,{checkedAt:new Date(this.now()).toISOString(),checkMessage:q.message});
  if(['ordered','included'].includes(q.state)&&row.status==='unknown')this.ledger.update(id,{status:'held',message:'已核查当前号码享有权益；本次请求的归属仍以官方记录为准',checkedAt:new Date(this.now()).toISOString()});
  return this.snapshot();
 });}
 async resolve(id,confirmed){return this.exclusive(async()=>{
  await this.auth();const row=this.ledger.rows.find(r=>r.id===id&&r.account===this.account.hash);
  if(!row||row.status!=='unknown'||confirmed!==true)throw new AppError('INVALID_RESOLUTION','只有待核查记录可以在人工核实后解除');
  this.ledger.update(id,{status:'released',message:'用户确认已向官方核实未生效，已解除重复办理拦截'});return this.snapshot();
 });}
}
