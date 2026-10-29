import {randomUUID} from 'node:crypto';
import {Service} from './service.js';
import {Catalog,assertConfigReady} from './catalog.js';
import {AccountStore} from './account-store.js';
import {AppError,maskPhone} from './domain.js';

export class Accounts {
 constructor(bridgeFactory,ledger,{now=Date.now,store=new AccountStore(ledger.directory)}={}){
  Object.assign(this,{bridgeFactory,ledger,now,store});this.catalog=new Catalog(ledger.directory);this.items=structuredClone(store.data.items);this.selectedId=store.data.selectedId;this.sessions=new Map();this.draft=null;this.busy=false;this.epoch=randomUUID();this.cacheError='';
  for(const item of this.items)item.status=item.session?'cached':item.status==='signed_out'?'signed_out':'expired';
  if(!this.items.some(a=>a.id===this.selectedId))this.selectedId=this.items[0]?.id||null;
  this.empty=new Service(bridgeFactory(),ledger,now,this.catalog);this.loginRate={lastLoginSmsAt:-Infinity,loginSmsWindow:0,loginSmsCount:0};
 }
 item(id=this.selectedId){const a=this.items.find(a=>a.id===id);if(!a)throw new AppError('ACCOUNT_NOT_FOUND','账号不存在',404);return a;}
 current(){return this.selectedId?this.session(this.item()):this.empty;}
 session(item){if(!this.sessions.has(item.id)){const bridge=this.bridgeFactory();bridge.restoreSession?.(item.session);this.sessions.set(item.id,new Service(bridge,this.ledger,this.now,this.catalog));}return this.sessions.get(item.id);}
 get bridge(){return this.current().bridge;}
 snapshot(){
  const service=this.current(),base=service.snapshot();const login=this.draft?.snapshot().login||null;
  return {...base,busy:this.busy,account:base.account?{...base.account,id:this.selectedId}:null,accounts:this.items.map(({id,phone,label,status,checkedAt,savedAt,profile})=>({id,phone:maskPhone(phone),label,status,checkedAt,savedAt,profile:profile||{}})),activeAccountId:this.selectedId,accountEpoch:this.epoch,login,loginCooldown:Math.max(0,Math.ceil((this.loginRate.lastLoginSmsAt+60000-this.now())/1000)),cacheError:this.cacheError};
 }
 assertContext(context){if(context!==`${this.selectedId||''}:${this.epoch}`)throw new AppError('ACCOUNT_CHANGED','当前账号已切换，请核对号码后重新操作',409);}
 persist(){this.store.save({items:this.items,selectedId:this.selectedId});}
 tryPersist(){try{this.persist();}catch{this.cacheError='登录仍可使用，但本次缓存未保存；请重试校验缓存后再关闭程序。';}}
 async exclusive(fn){if(this.busy)throw new AppError('BUSY','上一项操作仍在处理中，请稍候',409);this.busy=true;try{const r=await fn();if(r&&Object.hasOwn(r,'busy'))r.busy=false;return r;}finally{this.busy=false;}}
 async capture(item,service){
  if(!service.account)return;
  item.profile=structuredClone(service.account.profile||{});
  try{const session=await service.bridge.exportSession();if(!session)throw Error();item.session=session;item.status='valid';item.savedAt=new Date(this.now()).toISOString();this.persist();this.cacheError='';}
  catch{this.cacheError='登录仍可使用，但本次缓存未保存；请重试校验缓存后再关闭程序。';}
 }
 expire(item,service,status='expired'){delete item.session;service.bridge.restoreSession?.(null);item.status=status;item.checkedAt=new Date(this.now()).toISOString();service.clear();this.persist();}
 async authenticate(item){
  const service=this.session(item);
  try{await service.auth();if(service.account.phone!==item.phone){service.clear();throw new AppError('ACCOUNT_CHANGED','缓存身份与保存的账号不一致，请重新登录',401);}item.checkedAt=new Date(this.now()).toISOString();item.status='valid';await this.capture(item,service);return service;}
  catch(e){if(e.status===401||e.code==='ACCOUNT_CHANGED'){this.expire(item,service);await service.bridge.close();}else{item.status='unavailable';service.clear();}throw e;}
 }
 async release(id){if(!id||!this.sessions.has(id))return;const item=this.item(id),s=this.sessions.get(id);if(s.account)await this.capture(item,s);s.resetProduct();await s.bridge.close();}
 hasSession(item){return !!item.session||(['valid','unavailable'].includes(item.status)&&this.sessions.has(item.id));}
 async selectAccount(id){return this.exclusive(async()=>{
  const item=this.item(id);if(this.selectedId!==id){await this.release(this.selectedId);this.selectedId=id;this.epoch=randomUUID();this.persist();}
  if(this.hasSession(item))await this.authenticate(item);return this.snapshot();
 });}
 async restore(){return this.exclusive(async()=>{if(this.selectedId&&this.hasSession(this.item()))await this.authenticate(this.item());return this.snapshot();});}
 async renameAccount(id,label){return this.exclusive(async()=>{if(typeof label!=='string'||label.length>40||/[\x00-\x1f]/.test(label))throw new AppError('INVALID_LABEL','账号备注最多 40 字');const item=this.item(id),previous=item.label;item.label=label.trim();try{this.persist();}catch(e){item.label=previous;throw e;}return this.snapshot();});}
 async removeAccount(id,confirmed){return this.exclusive(async()=>{
  if(confirmed!==true)throw new AppError('CONFIRM_REQUIRED','请确认移除账号及其登录缓存');this.item(id);const oldItems=this.items,oldSelected=this.selectedId;this.items=this.items.filter(a=>a.id!==id);if(this.selectedId===id){this.selectedId=this.items[0]?.id||null;this.epoch=randomUUID();}
  try{this.persist();}catch(e){this.items=oldItems;this.selectedId=oldSelected;throw e;}const s=this.sessions.get(id);await s?.bridge.close();this.sessions.delete(id);this.current().resetProduct();return this.snapshot();
 });}
 async newDraft(){if(!this.draft){this.draft=new Service(this.bridgeFactory(),this.ledger,this.now,this.catalog);Object.assign(this.draft,this.loginRate);}return this.draft;}
 async openLogin(){return this.exclusive(async()=>{const d=await this.newDraft();return d.bridge.open();});}
 async sendLoginSms(phone,agreed){return this.exclusive(async()=>{
  if(typeof phone!=='string'||!/^1[3-9]\d{9}$/.test(phone))throw new AppError('INVALID_PHONE','请输入正确的 11 位手机号码');if(agreed!==true)throw new AppError('AGREEMENT_REQUIRED','请阅读并同意山西移动服务协议与隐私政策');
  const cached=this.items.find(a=>a.phone===phone);if(cached&&this.hasSession(cached)){try{await this.authenticate(cached);if(this.selectedId!==cached.id)await this.release(this.selectedId);this.selectedId=cached.id;this.epoch=randomUUID();this.tryPersist();await this.draft?.bridge.close();this.draft=null;return {...this.snapshot(),loginRestored:true};}catch(e){if(e.status!==401&&e.code!=='ACCOUNT_CHANGED')throw e;}}
  if(!cached&&this.items.length>=50)throw new AppError('ACCOUNT_LIMIT','最多保存 50 个账号，请先移除不使用的账号');
  const d=await this.newDraft();Object.assign(d,this.loginRate);try{await d.sendLoginSms(phone,agreed);}finally{for(const key of Object.keys(this.loginRate))this.loginRate[key]=d[key];}return this.snapshot();
 });}
 async acceptDraft(){
  const d=this.draft;if(!d?.account)throw new AppError('LOGIN_REQUIRED','请先登录账号',401);const existing=this.items.find(a=>a.phone===d.account.phone);
  if(existing&&this.hasSession(existing)){try{await this.authenticate(existing);await d.bridge.close();this.draft=null;if(this.selectedId!==existing.id)await this.release(this.selectedId);this.selectedId=existing.id;this.epoch=randomUUID();this.tryPersist();return this.snapshot();}catch(e){if(e.status!==401&&e.code!=='ACCOUNT_CHANGED')throw e;}}
  if(!existing&&this.items.length>=50)throw new AppError('ACCOUNT_LIMIT','最多保存 50 个账号');
  const item=existing||{id:randomUUID(),phone:d.account.phone,label:'',status:'valid'};
  await this.release(this.selectedId);const previous=this.sessions.get(item.id);if(previous&&previous!==d)await previous.bridge.close();if(!existing)this.items.push(item);this.sessions.set(item.id,d);this.selectedId=item.id;this.epoch=randomUUID();this.draft=null;item.status='valid';item.checkedAt=new Date(this.now()).toISOString();await this.capture(item,d);return this.snapshot();
 }
 async login(id,code,agreed){return this.exclusive(async()=>{if(!this.draft)throw new AppError('LOGIN_CHALLENGE_INVALID','请先获取当前号码的登录验证码');await this.draft.login(id,code,agreed);return this.acceptDraft();});}
 async sync(){return this.exclusive(async()=>{const d=await this.newDraft();await d.sync();return this.acceptDraft();});}
 async logout(){return this.exclusive(async()=>{if(this.selectedId){const item=this.item(),s=this.current();this.expire(item,s,'signed_out');await s.bridge.close();}return this.snapshot();});}
 async act(method,...args){return this.exclusive(async()=>{
  if(['queryQualification','sendSms','verifySms','submit'].includes(method))assertConfigReady(this.catalog.get());
  const item=this.selectedId?this.item():null;if(!item?.session&& !this.current().account)throw new AppError('LOGIN_REQUIRED','请先登录或恢复账号缓存',401);const s=this.current();
  // Business operations re-check identity inside Service; a cold cache first
  // validates against its saved phone before any SMS or order can be sent.
  if(!s.account)await this.authenticate(item);
  try{await s[method](...args);if(!s.account){this.expire(item,s);await s.bridge.close();}else await this.capture(item,s);return this.snapshot();}catch(e){if(e.status===401||e.code==='ACCOUNT_CHANGED'){this.expire(item,s);await s.bridge.close();}throw e;}
 });}
 async config(method,...args){return this.exclusive(async()=>{await this.current()[method](...args);for(const s of this.sessions.values())s.resetProduct();return this.snapshot();});}
 saveConfig(...args){return this.config('saveConfig',...args);}selectConfig(...args){return this.config('selectConfig',...args);}deleteConfig(...args){return this.config('deleteConfig',...args);}
 queryQualification(...args){return this.act('queryQualification',...args);}queryBusiness(...args){return this.act('queryBusiness',...args);}sendSms(...args){return this.act('sendSms',...args);}verifySms(...args){return this.act('verifySms',...args);}submit(...args){return this.act('submit',...args);}reconcile(...args){return this.act('reconcile',...args);}resolve(...args){return this.act('resolve',...args);}
 queryBusinessDetail(...args){return this.act('queryBusinessDetail',...args);}prepareUnsubscribe(...args){return this.act('prepareUnsubscribe',...args);}unsubscribe(...args){return this.act('unsubscribe',...args);}resolveUnsubscribe(...args){return this.act('resolveUnsubscribe',...args);}
 async close(){for(const [id,s] of this.sessions){await this.capture(this.item(id),s);await s.bridge.close();}await this.draft?.bridge.close();await this.empty.bridge.close();}
}
