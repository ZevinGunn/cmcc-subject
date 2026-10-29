import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
import {AppError} from './domain.js';

// This local vault protects against accidental plaintext disclosure. Its key
// stays on this machine with owner-only permissions; it is not a cloud vault.
export class AccountStore {
 constructor(directory){
  fs.mkdirSync(directory,{recursive:true,mode:0o700});fs.chmodSync(directory,0o700);
  this.file=path.join(directory,'accounts.enc');const keyFile=path.join(directory,'session-key');
  if(!fs.existsSync(keyFile)){if(fs.existsSync(this.file))throw new AppError('CACHE_KEY_MISSING','登录缓存密钥缺失，请保留缓存文件并恢复原密钥',500);fs.writeFileSync(keyFile,randomBytes(32),{flag:'wx',mode:0o600});}
  fs.chmodSync(keyFile,0o600);this.key=fs.readFileSync(keyFile);if(this.key.length!==32)throw new AppError('CACHE_INVALID','登录缓存密钥异常',500);
  this.data={items:[],selectedId:null};
  if(fs.existsSync(this.file))try{const box=JSON.parse(fs.readFileSync(this.file,'utf8'));const d=createDecipheriv('aes-256-gcm',this.key,Buffer.from(box.iv,'base64'));d.setAAD(Buffer.from('shanxi-accounts-v1'));d.setAuthTag(Buffer.from(box.tag,'base64'));this.data=JSON.parse(Buffer.concat([d.update(Buffer.from(box.data,'base64')),d.final()]).toString());if(!Array.isArray(this.data.items)||this.data.items.length>50||new Set(this.data.items.map(a=>a.id)).size!==this.data.items.length||this.data.items.some(a=>!/^1[3-9]\d{9}$/.test(a.phone)||!a.id))throw Error();}catch{throw new AppError('CACHE_INVALID','登录缓存无法解密，请保留原文件与密钥后恢复',500);}
 }
 save(data){
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',this.key,iv);cipher.setAAD(Buffer.from('shanxi-accounts-v1'));const encrypted=Buffer.concat([cipher.update(JSON.stringify(data),'utf8'),cipher.final()]);
  const tmp=this.file+'.tmp';fs.writeFileSync(tmp,JSON.stringify({v:1,iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:encrypted.toString('base64')}),{mode:0o600});fs.chmodSync(tmp,0o600);const fd=fs.openSync(tmp,'r');try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.renameSync(tmp,this.file);this.data=structuredClone(data);
 }
}
