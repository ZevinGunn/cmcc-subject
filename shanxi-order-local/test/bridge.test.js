import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';
import {installBridge,OfficialBridge} from '../server/bridge.js';
function context(){
 const handlers=[],modules={'w//H':{a:class Api{}},j2NP:{},mtWM:{interceptors:{response:{use:fn=>handlers.push(fn)}}}};const cache={};
 const req=id=>{if(modules[id]===undefined)throw Error('missing module');return modules[id];};
 const window={vm:{$router:{}},webpackJsonp(_chunks,definitions,entries){let result;for(const id of entries){if(!cache[id]){cache[id]={exports:{}};definitions[id](cache[id],cache[id].exports,req);}result=cache[id].exports;}return result;}};
 const ctx=vm.createContext({window,location:{origin:'https://wap.sx.10086.cn',pathname:'/h/act/index.html'}});return {ctx,window,handlers,modules};
}
test('兼容已分析 webpack 运行时，复用官方接口与已解密响应',()=>{const {ctx,window,handlers}=context();assert.equal(vm.runInContext(`(${installBridge.toString()})()`,ctx),true);assert.ok(window.__sxLocalBridge.api);const response={config:{url:'rest/v1/userorderinfo/qryUserOrderInfo'},data:{retCode:'0000',data:[]}};assert.equal(handlers[0](response),response);assert.equal(window.__sxLocalBridge.business.result,response.data);assert.equal(vm.runInContext(`(${installBridge.toString()})()`,ctx),true);assert.equal(handlers.length,1);});
test('模块加载失败后可重试，不永久污染桥接模块缓存',()=>{const {ctx,modules}=context();const api=modules['w//H'];delete modules['w//H'];assert.equal(vm.runInContext(`(${installBridge.toString()})()`,ctx),false);modules['w//H']=api;assert.equal(vm.runInContext(`(${installBridge.toString()})()`,ctx),true);});
test('非官方源或未加载的页面不能初始化桥接',()=>{const {ctx}=context();ctx.location.origin='https://other.example';assert.equal(vm.runInContext(`(${installBridge.toString()})()`,ctx),false);});
test('官方窗口被导航到其他域名时不发送手机号或验证码',async()=>{const bridge=new OfficialBridge();let evaluated=false;bridge.open=async()=>({opened:true});bridge.page={url:()=> 'https://other.example/login',evaluate:async()=>{evaluated=true;}};await assert.rejects(bridge.request('/h/market/rest/v1/wapLogin/login',{private:'synthetic'},{}),{code:'OFFICIAL_ORIGIN_CHANGED'});assert.equal(evaluated,false);});
