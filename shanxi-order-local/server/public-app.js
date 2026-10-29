import express from 'express';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {isIP} from 'node:net';
import {createApp} from './app.js';
import {workspaceSession,createSmsLimiter} from './public-session.js';

// Each browser owns a persistent, signed, HttpOnly workspace cookie. A mobile
// account still requires official SMS login. Platform and local data stay private.
export function createPublicApp({key,directory,dist,port=4319,origin='https://shanxi.1008086.xyz',makeService,maxTenants=32,now=Date.now,idleMs=30*60000}){
 const app=express(),tenants=new Map(),smsLimiter=createSmsLimiter({now});let closing=false;
 app.disable('x-powered-by');
 app.use((req,res,next)=>{
  res.set({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Strict-Transport-Security':'max-age=31536000'});
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host))return res.status(403).end();
  if(req.headers['x-forwarded-proto']==='http')return res.redirect(308,origin+req.url);
  if(req.method==='GET'&&req.path==='/api/health')return res.json({ok:true,app:'shanxi-public',version:'1.8.0'});
  if(req.headers.origin&&req.headers.origin!==origin)return res.status(403).json({error:{code:'ORIGIN_REJECTED',message:'请求来源不受信任'}});
  if(!['GET','HEAD'].includes(req.method)&&req.headers.origin!==origin)return res.status(403).json({error:{code:'ORIGIN_REJECTED',message:'请从山西移动业务页面操作'}});
  const tenant=workspaceSession(key,req,res,now());
  if(!tenant)return res.status(401).json({error:{code:'WORKSPACE_REQUIRED',message:'页面缓存凭据已失效，请刷新页面后重试'}});
  if(req.method==='POST'&&['/api/login/sms','/api/order/sms'].includes(req.path)){
   // This listener is loopback-only; its dedicated Cloudflare Tunnel supplies IP.
   const forwarded=req.headers['cf-connecting-ip'];
   const ip=typeof forwarded==='string'&&isIP(forwarded)?forwarded:req.socket.remoteAddress;
   if(!smsLimiter.accept(ip)){res.set('Retry-After','600');return res.status(429).json({error:{code:'SMS_RATE_LIMITED',message:'当前网络短信请求过于频繁，请稍后重试'}});}
  }
  if(closing)return res.status(503).end();
  if(!tenants.has(tenant)){
   if(tenants.size>=maxTenants)return res.status(503).json({error:{code:'CAPACITY',message:'当前使用人数较多，请稍后重试'}});
   const id=createHash('sha256').update(tenant).digest('hex');
   try{
    const service=makeService(path.join(directory,'users',id));
    tenants.set(tenant,{service,app:createApp(service,{port,dist,devOrigin:origin,publicMode:true}),inflight:0,touched:now(),closing:false});
   }catch{return res.status(503).json({error:{code:'CACHE_UNAVAILABLE',message:'账号缓存暂不可用，原缓存已保留'}});}
  }
  const entry=tenants.get(tenant);
  if(entry.closing)return res.status(503).end();
  entry.inflight++;entry.touched=now();
  let finished=false;const done=()=>{if(finished)return;finished=true;entry.inflight--;entry.touched=now();};res.once('finish',done);res.once('close',done);
  entry.app(req,res,next);
 });
 app.use((_req,res)=>res.status(404).end());
 async function sweep(){smsLimiter.sweep();for(const [id,e] of tenants){if(e.closing||e.inflight||e.service.busy||now()-e.touched<idleMs)continue;e.closing=true;try{await e.service.close();tenants.delete(id);}catch{e.closing=false;}}}
 async function close(){closing=true;await Promise.all([...tenants.values()].map(e=>e.service.close()));tenants.clear();}
 return {app,sweep,close};
}
