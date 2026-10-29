import { chromium } from 'playwright';
import { AppError } from './domain.js';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {Protocol} from './protocol.js';
const ORIGIN='https://wap.sx.10086.cn';
const ACT=ORIGIN+'/h/act/index.html#/qqt5ga';
const LOGIN=ORIGIN+'/h/market/index.html#/loginSim?back='+encodeURIComponent(ACT)+'&busiType=SSO_LOGIN';
const SDK=fileURLToPath(new URL('./vendor/kjjssdk.min.js',import.meta.url));
// Evaluated inside the official origin. Identifiers come from the original SDK,
// never from the HAR or a fabricated device profile.
export async function browserRequest({endpoint,body,headers}){
 if(location.origin!=='https://wap.sx.10086.cn')return {foreign:true};
 const environment={sdk:false,telemetry:false};
 const extra={};
 const deadline=async promise=>{let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('SDK_TIMEOUT')),8000);})]);}finally{clearTimeout(timer);}};
 try{
  if(typeof window.YWKJ?.getHeader!=='function')return {environmentUnavailable:true,environment};
  const generated=await deadline(window.YWKJ.getHeader());
  if(generated?.url!==location.href||!/^[a-f0-9]{32}$/i.test(generated?.uuid||''))return {environmentUnavailable:true,environment};
  extra['Content-M-CODE']=generated.uuid;extra['Content-M-URL']=generated.url;environment.sdk=true;
  if(typeof window.vm?.$fchama?.httpReady==='function'){
   const value=await deadline(window.vm.$fchama.httpReady());
   if(typeof value==='string'){extra.restParams=value;environment.telemetry=true;}
  }
 }catch{return {environmentUnavailable:true,environment};}
 // Header collection can yield; check the origin again before exposing payloads.
 if(location.origin!=='https://wap.sx.10086.cn')return {foreign:true};
 const response=await fetch(endpoint,{method:'POST',credentials:'same-origin',redirect:'error',headers:{'Content-Type':'application/json',cookieid:'wapapp',...headers,...extra},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
 if(!response.ok)return {status:response.status,environment};
 try{return {status:response.status,data:await response.json(),environment};}catch{return {status:response.status,invalid:true,environment};}
}
// Runs only inside the dedicated official-site browser. The official interceptor
// owns encryption, environment headers and cookies. No session data is exported.
export function installBridge(){
 if(location.origin!=='https://wap.sx.10086.cn'||!location.pathname.startsWith('/h/act/')) return false;
 if(window.__sxLocalBridge) return true;
 if(typeof window.webpackJsonp!=='function'||!window.vm?.$router)return false;
 const id='sxLocalBridge_v1';
 const req=window.webpackJsonp([], {[id]:(m,e,r)=>{m.exports=r;}},[id]);
 try{
  const Api=req('w//H').a;
  if(typeof Api!=='function')return false;
  window.__sxLocalBridge={api:new Api(),cookie:req('j2NP'),axios:req('mtWM'),business:null};
  window.__sxLocalBridge.axios.interceptors.response.use(response=>{
   if(String(response?.config?.url).includes('/userorderinfo/qryUserOrderInfo')) window.__sxLocalBridge.business={at:Date.now(),result:response.data};
   return response;
  });
  return true;
 }catch{return false;}
}
// The signed adapter uses the browser's ordinary fetch and cookie jar. It does
// not require Vue, a specific webpack module ID, or the telemetry SDK to finish.
export class OfficialBridge {
 constructor({headless=false,browserType=chromium}={}){this.browser=null;this.context=null;this.page=null;this.launching=null;this.headless=headless;this.browserType=browserType;this.lastRequest=null;this.savedSession=null;this.protocol=new Protocol((...args)=>this.request(...args));}
 async open(){
  if(this.page&&!this.page.isClosed())return {opened:true,ready:true};
  if(this.launching)return this.launching;
  this.launching=(async()=>{
   if(this.browser)await this.close();
   const chrome=process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined;
   try{
    this.browser=await this.browserType.launch({headless:this.headless,chromiumSandbox:true,...(chrome&&fs.existsSync(chrome)?{executablePath:chrome}:{})});
    this.browser.on('disconnected',()=>{this.page=null;this.context=null;this.browser=null;this.protocol.clear();});
    this.context=await this.browser.newContext({...(this.savedSession?{storageState:this.savedSession.storage}:{}),viewport:{width:480,height:820},locale:'zh-CN'});
    if(this.savedSession?.sessionStorage)await this.context.addInitScript(values=>{if(location.origin==='https://wap.sx.10086.cn'&&!sessionStorage.getItem('__localSessionRestored')){for(const [key,value] of Object.entries(values))sessionStorage.setItem(key,value);sessionStorage.setItem('__localSessionRestored','1');}},this.savedSession.sessionStorage);
    this.page=await this.context.newPage();
    this.page.on('requestfailed',request=>{
     if(!this.lastRequest)return;
     try{const url=new URL(request.url());if(url.origin===ORIGIN&&url.pathname===this.lastRequest.path){const error=request.failure()?.errorText||'';this.lastRequest.networkError=/^net::ERR_[A-Z_]+$/.test(error)?error:'REQUEST_FAILED';}}catch{}
    });
    this.page.on('response',response=>{
     if(!this.lastRequest)return;
     try{const url=new URL(response.url());if(url.origin===ORIGIN&&url.pathname===this.lastRequest.path)this.lastRequest.httpStatus=response.status();}catch{}
    });
    await this.page.goto(LOGIN,{waitUntil:'domcontentloaded',timeout:15000});
    // The supplied public SDK can run even when the official HTML is empty.
    if(!await this.page.evaluate(()=>typeof window.YWKJ?.getHeader==='function'))await this.page.addScriptTag({path:SDK});
    return {opened:true,ready:true};
   }catch{await this.close();throw new AppError('BROWSER_UNAVAILABLE','官方会话未能打开，请检查网络与 Chrome 安装',503);}
  })().finally(()=>{this.launching=null;});
  return this.launching;
 }
 restoreSession(session){this.savedSession=session?structuredClone(session):null;}
 async exportSession(){
  if(!this.context||!this.page||this.page.isClosed())return this.savedSession;
  if(new URL(this.page.url()).origin!==ORIGIN)throw new AppError('OFFICIAL_ORIGIN_CHANGED','官方窗口已离开山西移动站点，未缓存当前页面',409);
  const storage=await this.context.storageState({indexedDB:true});
  storage.cookies=storage.cookies.filter(c=>{const host=c.domain.replace(/^\./,'');return host==='10086.cn'||host==='sx.10086.cn'||host==='wap.sx.10086.cn';});
  storage.origins=storage.origins.filter(o=>o.origin===ORIGIN);for(const o of storage.origins)o.localStorage=o.localStorage.filter(x=>!/(smsCode|verifyCode|password)/i.test(x.name));
  const sessionStorage=await this.page.evaluate(()=>Object.fromEntries(Object.entries(window.sessionStorage).filter(([k])=>!/(smsCode|verifyCode|password|__localSessionRestored)/i.test(k))));
  this.savedSession={storage,sessionStorage};return this.savedSession;
 }
 async close(){const browser=this.browser;this.page=null;this.context=null;this.browser=null;this.protocol.clear();if(browser)await browser.close().catch(()=>{});}
 async request(endpoint,body,headers){
  await this.open();
  this.lastRequest={path:endpoint,phase:'sending',at:new Date().toISOString()};
  try{
   if(new URL(this.page.url()).origin!==ORIGIN)throw new AppError('OFFICIAL_ORIGIN_CHANGED','官方窗口已离开山西移动站点，请退出并重新登录',409);
   const result=await this.page.evaluate(browserRequest,{endpoint,body,headers});
   this.lastRequest.environment=result.environment;
   if(result.environmentUnavailable)throw new AppError('OFFICIAL_ENV_UNAVAILABLE','官方环境参数未准备好，本次未发送请求，请重新打开官方窗口',503);
   this.lastRequest.phase='received';this.lastRequest.httpStatus=result.status;
   if(result.foreign)throw new AppError('OFFICIAL_ORIGIN_CHANGED','官方窗口已离开山西移动站点，请退出并重新登录',409);
   if([412,403,429].includes(result.status))throw new AppError('OFFICIAL_VERIFICATION_REQUIRED',this.headless?`官方返回 HTTP ${result.status}，需要官方人工验证；请稍后重试或使用本机版完成验证`:`官方返回 HTTP ${result.status}，请在官方窗口完成页面验证后重试`,503);
   if(result.status!==200||result.invalid)throw new AppError('UPSTREAM_UNAVAILABLE','官方服务暂不可用，请稍后重试或打开官方窗口检查',502);
   return result.data;
  }catch(e){this.lastRequest.phase='failed';if(e instanceof AppError)throw e;throw new AppError('UPSTREAM_UNCERTAIN','官方请求未返回确定结果，请稍后核查；短信与订购不会自动重试',502);}
 }
 async call(method,payload={},proof=null,config){return this.protocol.call(method,payload,proof,config);}
 async authenticate(){return this.call('checkLoginNew',{pubInfo:{busiType:'SSO_LOGIN'},busiInfo:{}});}
 async sendLoginSms(phone){return this.call('sendSmsCode',{pubInfo:{busiType:'SSO_LOGIN',phoneNo:phone},busiInfo:{}});}
 async login(phone,code){return this.call('wapLogin',{pubInfo:{busiType:'SSO_LOGIN',loginSourceCode:'BROWSER',loginType:'sms',phoneNo:phone,smsCode:code},busiInfo:{}});}
 async business(){return this.call('qryUserOrderInfo');}
 async status(){
  if(!this.page||this.page.isClosed())return {open:false,stage:'closed'};
  return {open:true,stage:'session',transport:'signed-browser',lastRequest:this.lastRequest,officialResult:this.protocol.lastResult};
 }
 async visible(){await this.open();await this.page.bringToFront();return {opened:true};}
}
