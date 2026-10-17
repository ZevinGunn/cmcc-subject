import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4318),url=`http://127.0.0.1:${port}`;
async function running(){try{const r=await fetch(url+'/api/health',{signal:AbortSignal.timeout(1000)});return (await r.json()).app==='shanxi-order-local';}catch{return false;}}
if(!await running()){
 if(!fs.existsSync(path.join(root,'dist/index.html')))throw Error('尚未构建，请先运行 npm run build');
 const dir=path.join(root,'.local');fs.mkdirSync(dir,{recursive:true,mode:0o700});const out=fs.openSync(path.join(dir,'server.log'),'a',0o600);
 const child=spawn(process.execPath,[path.join(root,'server/index.js')],{cwd:root,detached:true,stdio:['ignore',out,out],env:process.env});child.unref();fs.closeSync(out);
 for(let i=0;i<40&&!await running();i++)await new Promise(r=>setTimeout(r,200));
 if(!await running())throw Error('启动失败。请检查 .local/server.log，或确认端口未被其他程序占用');
 fs.writeFileSync(path.join(dir,'server.pid'),String(child.pid),{mode:0o600});
}
console.log(`晋速办已启动：${url}`);
if(!process.argv.includes('--no-open')){
 const cmd=process.platform==='darwin'?'open':process.platform==='win32'?'explorer':'xdg-open';
 const child=spawn(cmd,[url],{stdio:'ignore',detached:true});child.on('error',()=>console.log('请在浏览器中打开上面的地址'));child.unref();
}
