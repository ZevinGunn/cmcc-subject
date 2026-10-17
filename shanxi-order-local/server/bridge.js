import { chromium } from 'playwright';
import { AppError } from './domain.js';
import fs from 'node:fs';
import {Protocol} from './protocol.js';
const ORIGIN='https://wap.sx.10086.cn';
const ACT=ORIGIN+'/h/act/index.html#/qqt5ga';
const LOGIN=ORIGIN+'/h/market/index.html#/loginSim?back='+encodeURIComponent(ACT)+'&busiType=SSO_LOGIN';
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
 constructor({headless=false}={}){this.browser=null;this.context=null;this.page=null;this.launching=null;this.headless=headless;this.lastRequest=null;this.protocol=new Protocol((...args)=>this.request(...args));}
 async open(){
  if(this.page&&!this.page.isClosed())return {opened:true,ready:true};
  if(this.launching)return this.launching;
  this.launching=(async()=>{
   if(this.browser)await this.close();
   const chrome=process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined;
   try{
    this.browser=await chromium.launch({headless:this.headless,chromiumSandbox:true,...(chrome&&fs.existsSync(chrome)?{executablePath:chrome}:{})});
    this.browser.on('disconnected',()=>{this.page=null;this.context=null;this.browser=null;this.protocol.clear();});
    this.context=await this.browser.newContext({viewport:{width:480,height:820},locale:'zh-CN'});
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
    return {opened:true,ready:true};
   }catch{await this.close();throw new AppError('BROWSER_UNAVAILABLE','官方会话未能打开，请检查网络与 Chrome 安装',503);}
  })().finally(()=>{this.launching=null;});
  return this.launching;
 }
 async close(){const browser=this.browser;this.page=null;this.context=null;this.browser=null;this.protocol.clear();if(browser)await browser.close().catch(()=>{});}
 async request(endpoint,body,headers){
  await this.open();
  this.lastRequest={path:endpoint,phase:'sending',at:new Date().toISOString()};
  try{
   if(new URL(this.page.url()).origin!==ORIGIN)throw new AppError('OFFICIAL_ORIGIN_CHANGED','官方窗口已离开山西移动站点，请退出并重新登录',409);
   const result=await this.page.evaluate(async({endpoint,body,headers})=>{
    if(location.origin!=='https://wap.sx.10086.cn')return {foreign:true};
    // Let the official page own browser security cookies and URL processing.
    const response=await fetch(endpoint,{method:'POST',credentials:'same-origin',redirect:'error',headers:{'Content-Type':'application/json',cookieid:'wapapp','Content-M-URL':location.href,...headers},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
    if(!response.ok)return {status:response.status};
    try{return {status:response.status,data:await response.json()};}catch{return {status:response.status,invalid:true};}
   },{endpoint,body,headers});
   this.lastRequest.phase='received';this.lastRequest.httpStatus=result.status;
   if(result.foreign)throw new AppError('OFFICIAL_ORIGIN_CHANGED','官方窗口已离开山西移动站点，请退出并重新登录',409);
   if([412,403,429].includes(result.status))throw new AppError('OFFICIAL_VERIFICATION_REQUIRED',`官方返回 HTTP ${result.status}，请在官方窗口完成页面验证后重试`,503);
   if(result.status!==200||result.invalid)throw new AppError('UPSTREAM_UNAVAILABLE','官方服务暂不可用，请稍后重试或打开官方窗口检查',502);
   return result.data;
  }catch(e){this.lastRequest.phase='failed';if(e instanceof AppError)throw e;throw new AppError('UPSTREAM_UNCERTAIN','官方请求未返回确定结果，请稍后核查；短信与订购不会自动重试',502);}
 }
 async call(method,payload={},proof=null){return this.protocol.call(method,payload,proof);}
 async authenticate(){return this.call('checkLoginNew',{pubInfo:{busiType:'SSO_LOGIN'},busiInfo:{}});}
 async sendLoginSms(phone){return this.call('sendSmsCode',{pubInfo:{busiType:'SSO_LOGIN',phoneNo:phone},busiInfo:{}});}
 async login(phone,code){return this.call('wapLogin',{pubInfo:{busiType:'SSO_LOGIN',loginSourceCode:'BROWSER',loginType:'sms',phoneNo:phone,smsCode:code},busiInfo:{}});}
 async business(){
  await this.open();
  if(!new URL(this.page.url()).pathname.startsWith('/h/act/'))await this.page.goto(ACT,{waitUntil:'domcontentloaded',timeout:15000}).catch(()=>{});
  try{
   await this.page.waitForFunction(installBridge,null,{timeout:12000});
   return await this.page.evaluate(async()=>{
    const b=window.__sxLocalBridge;b.business=null;
    if(window.vm.$route.path==='/commserver/userBuss')await window.vm.$router.push('/qqt5ga').catch(()=>{});
    await window.vm.$router.push('/commserver/userBuss').catch(()=>{});
    const deadline=Date.now()+20000;
    while(Date.now()<deadline){if(b.business)return b.business.result;await new Promise(r=>setTimeout(r,100));}
    throw Error('BUSINESS_TIMEOUT');
   });
  }catch{throw new AppError('BUSINESS_UNAVAILABLE','官方已订业务页面暂不可用；可继续查询 5G-A 资格，或稍后重新查询',502);}
 }
 async status(){
  if(!this.page||this.page.isClosed())return {open:false,stage:'closed'};
  return {open:true,stage:'session',transport:'signed-browser',lastRequest:this.lastRequest};
 }
 async visible(){await this.open();await this.page.bringToFront();return {opened:true};}
}
