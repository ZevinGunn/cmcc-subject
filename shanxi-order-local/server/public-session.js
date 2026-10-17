import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';

export const workspaceCookie='__Host-shanxi_workspace';
const lifetime=365*24*60*60;
const signature=(key,value)=>createHmac('sha256',key).update('shanxi-workspace:v1:'+value).digest('hex');
export function workspaceSession(key,req,res,now=Date.now()){
 const cookies=String(req.headers.cookie||'').split(';').map(s=>s.trim().split('='));
 const value=cookies.find(([name])=>name===workspaceCookie)?.[1]||'';
 const [id,expiry,mac]=value.split('.');
 if(/^[a-f0-9]{64}$/.test(id||'')&&/^\d{13}$/.test(expiry||'')&&Number(expiry)>now&&Number(expiry)<=now+lifetime*1000&&/^[a-f0-9]{64}$/.test(mac||'')){
  const expected=signature(key,id+'.'+expiry);
  if(timingSafeEqual(Buffer.from(mac),Buffer.from(expected)))return 'browser:'+id;
 }
 if(!['GET','HEAD'].includes(req.method))return null;
 const nextId=randomBytes(32).toString('hex'),nextExpiry=String(now+lifetime*1000),payload=nextId+'.'+nextExpiry;
 res.setHeader('Set-Cookie',`${workspaceCookie}=${payload}.${signature(key,payload)}; Path=/; Max-Age=${lifetime}; Secure; HttpOnly; SameSite=Strict`);
 return 'browser:'+nextId;
}

// Independent of workspace cookies: clearing cookies cannot reset SMS limits.
export function createSmsLimiter({now=Date.now,maxAddresses=10000}={}){
 const windows=new Map();
 function sweep(){for(const [ip,v] of windows)if(v.start+600000<=now())windows.delete(ip);}
 return {sweep,accept(ip){
  let entry=windows.get(ip);
  if(!entry||entry.start+600000<=now()){
   if(windows.size>=maxAddresses){sweep();if(windows.size>=maxAddresses)return false;}
   windows.set(ip,entry={start:now(),count:0});
  }
  return ++entry.count<=10;
 }};
}
