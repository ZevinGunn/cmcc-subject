export const publicPrefix='/apps/shanxi';
const origin='https://shanxi.1008086.xyz';
// Project Ops maintains the service; business requests run on its own domain.
// Never redirect a POST: an old tab must not replay SMS or order submissions.
export function redirectShanxi(req,res){
 res.setHeader('Cache-Control','no-store');
 const suffix=req.url.slice(publicPrefix.length)||'/';
 if(!['GET','HEAD'].includes(req.method)||suffix.startsWith('/api/')){
  res.writeHead(410,{'content-type':'application/json; charset=utf-8'});
  return res.end(JSON.stringify({error:{code:'SERVICE_MOVED',message:'晋速办已迁至 https://shanxi.1008086.xyz/，请打开新地址继续'}}));
 }
 res.writeHead(302,{location:origin+suffix});res.end();
}
