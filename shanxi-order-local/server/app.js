import express from 'express';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {AppError} from './domain.js';
import {transformCrypto} from './crypto-tools.js';
export function createApp(service,{port=4318,dist=path.resolve('dist'),devOrigin='',publicMode=false}={}){
 const app=express();const csrf=randomBytes(32).toString('hex');
 const allowedHosts=new Set([`127.0.0.1:${port}`,`localhost:${port}`]);
 const origins=new Set([...allowedHosts].map(h=>'http://'+h));if(devOrigin)origins.add(devOrigin);
 app.disable('x-powered-by');
 app.use((req,res,next)=>{
  res.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});
  if(!allowedHosts.has(req.headers.host))return res.status(403).json({error:{code:'HOST_REJECTED',message:'仅允许本机访问'}});
  if(req.path.startsWith('/api/')){
   res.set('Cache-Control','no-store');
   if(req.headers.origin&&!origins.has(req.headers.origin))return res.status(403).json({error:{code:'ORIGIN_REJECTED',message:'请求来源不受信任'}});
   if(req.method!=='GET'){
    const token=Buffer.from(String(req.headers['x-local-csrf']||''));const expected=Buffer.from(csrf);
    if(token.length!==expected.length||!timingSafeEqual(token,expected))return res.status(403).json({error:{code:'CSRF_REJECTED',message:'页面凭据已更新，请刷新页面'}});
   }
  }
  next();
 });
 app.use(express.json({limit:'64kb'}));
 const route=(fn)=>(req,res,next)=>Promise.resolve().then(()=>fn(req)).then(data=>res.json(data)).catch(next);
 // Account context is checked immediately before invoking the operation lock.
 const guarded=(fn)=>route(req=>{service.assertContext?.(req.headers['x-account-context']);return fn(req);});
 app.get('/api/health',(_req,res)=>res.json({ok:true,app:'shanxi-order-local',version:'1.8.0'}));
 app.get('/api/state',(_req,res)=>res.json({...service.snapshot(),csrf,publicMode}));
 app.post('/api/tools/crypto',route(req=>transformCrypto(req.body)));
 if(publicMode)app.post(['/api/login/open','/api/login/sync','/api/official/open'],(_req,res)=>res.status(409).json({error:{code:'REMOTE_WINDOW_UNAVAILABLE',message:'公网版请使用手机验证码登录；官方人工验证需在本机版完成'}}));
 app.get('/api/connection',route(()=>service.bridge.status()));
 app.post('/api/login/open',route(()=>service.openLogin?service.openLogin():service.exclusive(()=>service.bridge.open())));
 app.post('/api/login/sms',route(req=>service.sendLoginSms(req.body?.phone,req.body?.agreed)));
 app.post('/api/login/verify',route(req=>service.login(req.body?.id,req.body?.code,req.body?.agreed)));
 app.post('/api/login/sync',route(()=>service.sync()));
 app.post('/api/logout',guarded(()=>service.logout()));
 app.post('/api/official/open',guarded(()=>service.exclusive(()=>service.bridge.visible())));
 app.post('/api/query/qualification',guarded(()=>service.queryQualification()));
 app.post('/api/query/content',guarded(()=>service.queryQualification()));
 app.post('/api/query/business',guarded(()=>service.queryBusiness()));
 app.post('/api/query/business/detail',guarded(req=>service.queryBusinessDetail(req.body?.id,req.body?.queryId)));
 app.post('/api/unsubscribe/prepare',guarded(req=>service.prepareUnsubscribe(req.body?.id,req.body?.queryId)));
 app.post('/api/unsubscribe/submit',guarded(req=>service.unsubscribe(req.body?.id,req.body?.confirmed)));
 app.post('/api/unsubscribe/resolve',guarded(req=>service.resolveUnsubscribe(req.body?.id,req.body?.confirmed)));
 app.post('/api/accounts/restore',route(()=>service.restore()));
 app.post('/api/accounts/select',route(req=>service.selectAccount(req.body?.id)));
 app.post('/api/accounts/rename',route(req=>service.renameAccount(req.body?.id,req.body?.label)));
 app.post('/api/accounts/remove',route(req=>service.removeAccount(req.body?.id,req.body?.confirmed)));
 app.post('/api/config/save',route(req=>service.saveConfig(req.body)));
 app.post('/api/config/select',route(req=>service.selectConfig(req.body?.id)));
 app.post('/api/config/delete',route(req=>service.deleteConfig(req.body?.id,req.body?.revision)));
 app.post('/api/order/sms',guarded(req=>service.sendSms(req.body?.attemptAnyway,req.body?.config||{})));
 app.post('/api/order/verify',guarded(req=>service.verifySms(req.body.id,req.body.code)));
 app.post('/api/order/submit',guarded(req=>service.submit(req.body.id,req.body.confirmed)));
 app.post('/api/orders/:id/reconcile',guarded(req=>service.reconcile(req.params.id)));
 app.post('/api/orders/:id/resolve',guarded(req=>service.resolve(req.params.id,req.body.confirmed)));
 app.use('/api',(_req,res)=>res.status(404).json({error:{code:'NOT_FOUND',message:'接口不存在'}}));
 app.use(express.static(dist,{index:'index.html'}));
 app.get('*',(_req,res)=>res.sendFile(path.join(dist,'index.html')));
 app.use((err,_req,res,_next)=>{
  const originalStatus=err instanceof AppError?err.status:err.type==='entity.parse.failed'?400:err.type==='entity.too.large'?413:500;
  // The public proxy replaces origin 502 bodies with an HTML gateway page.
  // Preserve actionable JSON for a controlled upstream failure instead.
  const status=publicMode&&err instanceof AppError&&originalStatus===502?503:originalStatus;
  res.status(status).json({error:{code:err instanceof AppError?err.code:'LOCAL_ERROR',message:err instanceof AppError?err.message:status===400?'请求内容格式错误':status===413?'请求内容超过 64 KiB，请缩小内容后重试':'本地服务发生异常，请保留办理记录并重新启动'}});
 });
 return app;
}
