import {createHmac,timingSafeEqual} from 'node:crypto';

export const publicPrefix='/apps/shanxi';
export function signGateway(key,{tenant,method,url,time=Date.now()}){
 const value=JSON.stringify([tenant,method,url,String(time)]);
 return {'x-shanxi-tenant':tenant,'x-shanxi-time':String(time),'x-shanxi-signature':createHmac('sha256',key).update(value).digest('hex')};
}
export function verifyGateway(key,req,now=Date.now()){
 const tenant=req.headers['x-shanxi-tenant'],time=req.headers['x-shanxi-time'],signature=req.headers['x-shanxi-signature'];
 if(typeof tenant!=='string'||!tenant||tenant.length>200||typeof time!=='string'||!/^\d{13}$/.test(time)||Math.abs(now-Number(time))>30000||typeof signature!=='string'||!/^[a-f0-9]{64}$/.test(signature))return null;
 const expected=signGateway(key,{tenant,method:req.method,url:req.url,time})['x-shanxi-signature'];
 return timingSafeEqual(Buffer.from(signature),Buffer.from(expected))?tenant:null;
}
