import http from 'node:http';
import {readFileSync} from 'node:fs';
import {signGateway,publicPrefix} from '../shanxi-order-local/server/gateway-auth.js';

export {publicPrefix};
export function createShanxiGateway({keyPath,authorize,canAccess=()=>true,sameOrigin,port=4319}){
 let key;
 return (req,res)=>{
  res.setHeader('Cache-Control','no-store');
  const admin=authorize(req);
  if(!admin){
   const isPage=req.method==='GET'&&(req.url===publicPrefix||req.url===publicPrefix+'/');
   res.writeHead(isPage?302:401,isPage?{location:'/login'}:{'content-type':'application/json'});
   return res.end(isPage?'':JSON.stringify({error:{code:'PLATFORM_AUTH_REQUIRED',message:'平台登录已过期，请返回项目管理平台重新登录'}}));
  }
  if(!canAccess(admin)){
   res.writeHead(403,{'content-type':'application/json; charset=utf-8'});
   return res.end(JSON.stringify({error:{code:'SERVICE_SCOPE_DENIED',message:'当前平台账号没有山西移动项目权限，请联系管理员配置'}}));
  }
  if(!['GET','HEAD'].includes(req.method)&&!sameOrigin(req)){
   res.writeHead(403);return res.end();
  }
  if(req.url===publicPrefix){res.writeHead(302,{location:publicPrefix+'/'});return res.end();}
  try{key ||= readFileSync(keyPath);if(key.length!==32)throw Error();}catch{res.writeHead(503);return res.end('Shanxi gateway unavailable');}
  const url=req.url.slice(publicPrefix.length);
  // Forward a small allowlist, stripping cookies, proxy identity and caller-supplied signatures.
  const headers={host:`127.0.0.1:${port}`,...signGateway(key,{tenant:admin.id,method:req.method,url})};
  for(const name of ['content-type','content-length','origin','accept','x-local-csrf','x-account-context'])if(req.headers[name])headers[name]=req.headers[name];
  const upstream=http.request({host:'127.0.0.1',port,path:url,method:req.method,headers},response=>{
   res.writeHead(response.statusCode,Object.fromEntries(Object.entries(response.headers).filter(([name])=>!['set-cookie','connection','transfer-encoding'].includes(name))));
   response.pipe(res);response.on('error',()=>res.destroy());
  });
  upstream.setTimeout(120000,()=>upstream.destroy());
  upstream.on('error',()=>{if(res.headersSent)return res.destroy();res.writeHead(502,{'content-type':'application/json'});res.end(JSON.stringify({error:{code:'SERVICE_UNAVAILABLE',message:'山西移动服务暂不可用，请稍后重试'}}));});
  req.on('aborted',()=>upstream.destroy());res.on('close',()=>{if(!res.writableFinished)upstream.destroy();});req.pipe(upstream);
 };
}
