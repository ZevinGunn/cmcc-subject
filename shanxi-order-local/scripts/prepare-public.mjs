import {mkdirSync,readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const directory=fileURLToPath(new URL('../.public/',import.meta.url));
mkdirSync(directory,{recursive:true,mode:0o700});chmodSync(directory,0o700);
const file=new URL('../.public/gateway-key',import.meta.url);
try{writeFileSync(file,randomBytes(32),{mode:0o600,flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
if(readFileSync(file).length!==32)throw Error('已有公网缓存签名密钥无效，请保留并核查');
chmodSync(file,0o600);console.log('公网运行目录及缓存签名密钥已准备好（未输出密钥）');
