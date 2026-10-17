import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync,copyFileSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import './prepare-public.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const cloudflared=process.env.CLOUDFLARED_BIN||'/opt/homebrew/bin/cloudflared';
const pm2=process.env.PM2_BIN||path.join(homedir(),'.nvm/versions/node/v18.20.8/bin/pm2');
const run=(bin,args)=>execFileSync(bin,args,{cwd:root,encoding:'utf8',timeout:60000,stdio:['ignore','pipe','pipe']});
const tunnels=()=>JSON.parse(run(cloudflared,['tunnel','list','--output','json']));
let tunnel=tunnels().find(t=>t.name==='cmcc-shanxi');
if(!tunnel){run(cloudflared,['tunnel','create','cmcc-shanxi']);tunnel=tunnels().find(t=>t.name==='cmcc-shanxi');}
if(!tunnel||!/^[a-f0-9-]{36}$/.test(tunnel.id))throw Error('无法确认晋速办独立隧道');
const credential=path.join(homedir(),'.cloudflared',tunnel.id+'.json');
if(!existsSync(credential))throw Error('独立隧道凭据不存在');
const config=path.join(root,'.public/tunnel.yml');
const candidate=config+'.next';
writeFileSync(candidate,`tunnel: ${tunnel.id}
credentials-file: ${credential}
protocol: http2
originRequest:
  connectTimeout: 3s
ingress:
  - hostname: shanxi.1008086.xyz
    service: http://127.0.0.1:4319
    originRequest:
      httpHostHeader: 127.0.0.1:4319
  - service: http_status:404
`,{mode:0o600});
run(cloudflared,['tunnel','--config',candidate,'ingress','validate']);
if(existsSync(config))copyFileSync(config,config+'.previous');
writeFileSync(config,readFileSync(candidate),{mode:0o600});
// No overwrite flag: an unrelated DNS record must never be replaced silently.
run(cloudflared,['tunnel','route','dns',tunnel.id,'shanxi.1008086.xyz']);
run(pm2,['startOrRestart','ecosystem.public.config.cjs','--only','shanxi-public,shanxi-tunnel','--silent']);
run(pm2,['save','--silent']);
console.log('已发布独立域名：https://shanxi.1008086.xyz/（仅更新晋速办服务与独立隧道）');
