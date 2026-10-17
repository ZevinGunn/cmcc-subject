import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApp} from './app.js';
import {OfficialBridge} from './bridge.js';
import {Ledger} from './ledger.js';
import {Accounts} from './accounts.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT || 4318);
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('PORT 无效');
const service=new Accounts(()=>new OfficialBridge(),new Ledger(path.join(root,'.local')));
const server=createApp(service,{port,dist:path.join(root,'dist'),devOrigin:process.env.DEV_ORIGIN||''}).listen(port,'127.0.0.1',()=>console.log(`晋速办已启动：http://127.0.0.1:${port}`));
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'端口已被占用，请打开现有页面或更换 PORT':'本地服务启动失败');process.exitCode=1;});
async function shutdown(){server.close();await service.close();process.exit(0);}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
