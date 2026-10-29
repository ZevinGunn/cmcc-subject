import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {Accounts} from './accounts.js';
import {Ledger} from './ledger.js';
import {OfficialBridge} from './bridge.js';
import {createPublicApp} from './public-app.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const directory=path.join(root,'.public');
const key=readFileSync(path.join(directory,'gateway-key'));
if(key.length!==32)throw Error('公网缓存签名密钥无效');
const service=createPublicApp({key,directory,dist:path.join(root,'dist-public'),makeService:dir=>new Accounts(()=>new OfficialBridge({headless:true}),new Ledger(dir))});
const server=service.app.listen(4319,'127.0.0.1',()=>console.log('晋速办公网服务已启动：127.0.0.1:4319'));
const timer=setInterval(()=>service.sweep().catch(()=>{}),60000);timer.unref();
async function shutdown(){clearInterval(timer);await new Promise(resolve=>server.close(resolve));await service.close();process.exit(0);}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
