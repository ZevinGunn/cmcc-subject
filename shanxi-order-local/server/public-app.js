import express from 'express';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {createApp} from './app.js';
import {verifyGateway} from './gateway-auth.js';

// Identity is accepted only from the authenticated platform gateway, never from
// cookies or caller-selected account headers. Storage is independent of .local.
export function createPublicApp({key,directory,dist,port=4319,origin='https://project.1008086.xyz',makeService,maxTenants=32,now=Date.now,idleMs=30*60000}){
 const app=express(),tenants=new Map();let closing=false;
 app.disable('x-powered-by');
 app.use((req,res,next)=>{
  res.set({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host))return res.status(403).end();
  if(req.method==='GET'&&req.path==='/api/health')return res.json({ok:true,app:'shanxi-public',version:'1.4.0'});
  const tenant=verifyGateway(key,req,now());
  if(!tenant)return res.status(401).json({error:{code:'GATEWAY_REQUIRED',message:'请通过项目管理平台访问'}});
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
 async function sweep(){for(const [id,e] of tenants){if(e.closing||e.inflight||e.service.busy||now()-e.touched<idleMs)continue;e.closing=true;try{await e.service.close();tenants.delete(id);}catch{e.closing=false;}}}
 async function close(){closing=true;await Promise.all([...tenants.values()].map(e=>e.service.close()));tenants.clear();}
 return {app,sweep,close};
}
