import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';
import {installBridge,OfficialBridge,browserRequest} from '../server/bridge.js';
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
test('请求诊断仅保留接口路径和状态，不暴露验证码、号码或加密头',async()=>{const bridge=new OfficialBridge();bridge.open=async()=>({opened:true});bridge.page={url:()=> 'https://wap.sx.10086.cn/h/market/index.html',isClosed:()=>false,evaluate:async()=>{throw Error('fetch failed');}};await assert.rejects(bridge.request('/h/market/rest/v1/wapLogin/sendSmsCode',{phone:'13800000000',code:'012345'},{'E-A-K':'synthetic-secret'}),{code:'UPSTREAM_UNCERTAIN'});const status=await bridge.status();assert.equal(status.lastRequest.phase,'failed');assert.equal(status.lastRequest.path,'/h/market/rest/v1/wapLogin/sendSmsCode');for(const privateValue of ['13800000000','012345','synthetic-secret'])assert.equal(JSON.stringify(status).includes(privateValue),false);});
test('传输使用官方 SDK 当前会话环境头，诊断只暴露可用性',async()=>{
 const calls=[],location={origin:'https://wap.sx.10086.cn',href:'https://wap.sx.10086.cn/h/market/index.html#/loginSim'};
 const window={YWKJ:{getHeader:async()=>({url:location.href,uuid:'a'.repeat(32)})},vm:{$fchama:{httpReady:async()=>'{"session":"synthetic"}'}}};
 const ctx=vm.createContext({window,location,setTimeout,clearTimeout,AbortSignal,fetch:async(endpoint,options)=>{calls.push({endpoint,options});return {ok:true,status:200,json:async()=>({retCode:'0000'})};}});
 const result=await vm.runInContext(`(${browserRequest.toString()})({endpoint:'/h/market/rest/v1/wapLogin/sendSmsCode',body:{encryptInStr:'synthetic'},headers:{'E-S-K':'signature'}})`,ctx);
 assert.equal(calls.length,1);assert.equal(calls[0].options.headers['Content-M-CODE'],'a'.repeat(32));assert.equal(calls[0].options.headers['Content-M-URL'],location.href);assert.equal(calls[0].options.headers.restParams,'{"session":"synthetic"}');assert.equal(calls[0].options.headers['E-S-K'],'signature');assert.equal(calls[0].options.redirect,'error');assert.equal(result.environment.sdk,true);assert.equal(result.environment.telemetry,true);assert.equal(JSON.stringify(result).includes('synthetic'),false);
 delete window.vm;const withoutTelemetry=await vm.runInContext(`(${browserRequest.toString()})({endpoint:'/h/market/rest/v1/wapLogin/sendSmsCode',body:{},headers:{}})`,ctx);assert.equal(withoutTelemetry.environment.telemetry,false);assert.equal(calls.at(-1).options.headers.restParams,undefined);
});
test('环境头缺失、失败或收集期间离开官方源时不发送敏感请求',async()=>{
 let calls=0;const location={origin:'https://wap.sx.10086.cn',href:'https://wap.sx.10086.cn/h/market/index.html'};const window={};
 const ctx=vm.createContext({window,location,setTimeout,clearTimeout,AbortSignal,fetch:()=>{calls++;throw Error('must not send');}});
 const invoke=()=>vm.runInContext(`(${browserRequest.toString()})({endpoint:'/h/market/rest/v1/wapLogin/login',body:{smsCode:'001234'},headers:{}})`,ctx);
 assert.equal((await invoke()).environmentUnavailable,true);
 window.YWKJ={getHeader:async()=>{throw Error('sdk error');}};assert.equal((await invoke()).environmentUnavailable,true);
 window.YWKJ.getHeader=async()=>{location.origin='https://other.example';return {url:location.href,uuid:'a'.repeat(32)};};assert.equal((await invoke()).foreign,true);assert.equal(calls,0);
});

test('已订业务查询直接调用签名协议，不依赖 Vue 或官网路由加载',async()=>{const bridge=new OfficialBridge();const calls=[];bridge.call=async(...args)=>{calls.push(args);return {retCode:'0000',data:{mainList:[]}};};bridge.open=async()=>{throw Error('business must not navigate');};assert.equal((await bridge.business()).retCode,'0000');assert.deepEqual(calls,[['qryUserOrderInfo']]);});
