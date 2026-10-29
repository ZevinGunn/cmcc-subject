import {randomBytes,randomInt,createCipheriv,createDecipheriv,createPublicKey,publicEncrypt,createHmac,timingSafeEqual,constants} from 'node:crypto';
import {TextDecoder} from 'node:util';
import {AppError} from './domain.js';

const fail=(code,message)=>{throw new AppError(code,message);};
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function aesKey(value,generate=false){
 if(generate&&value==='')return Array.from({length:16},()=>alphabet[randomInt(62)]).join('');
 if(typeof value!=='string'||!/^[\x20-\x7e]{16}$/.test(value))fail('AES_KEY_INVALID','请输入 16 位 ASCII 字符的 AES 密钥（不是 E-A-K，也不是 32 位十六进制编码）');
 return value;
}
function parse(text){try{return JSON.parse(text);}catch{fail('JSON_INVALID','JSON 格式不正确，请检查引号、逗号与括号');}}
function encrypt(data,key){
 const iv=randomBytes(16),cipher=createCipheriv('aes-128-cbc',Buffer.from(key),iv);
 return iv.toString('hex')+Buffer.concat([cipher.update(JSON.stringify(data),'utf8'),cipher.final()]).toString('hex');
}
function decrypt(text,key){
 if(typeof text!=='string'||!/^[a-f\d]+$/i.test(text)||text.length<64||text.length%32)fail('CIPHERTEXT_INVALID','密文应为十六进制：前 32 位为 IV，后续为完整 AES 密文块');
 let plain;
 try{
  const decipher=createDecipheriv('aes-128-cbc',Buffer.from(key),Buffer.from(text.slice(0,32),'hex'));
  plain=new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat([decipher.update(Buffer.from(text.slice(32),'hex')),decipher.final()]));
 }catch{fail('DECRYPT_FAILED','解密失败，请检查 AES 密钥是否属于这次请求，以及密文是否完整');}
 try{return JSON.parse(plain);}catch{fail('DECRYPT_FAILED','解密结果不是有效 JSON，请检查密钥与密文');}
}
function wrapKey(publicKey,key){
 try{
  if(typeof publicKey!=='string'||publicKey.length>8192||publicKey.includes('PRIVATE KEY'))throw Error();
  const rsa=/^[a-f\d]+$/i.test(publicKey)?createPublicKey({key:Buffer.from(publicKey,'hex'),format:'der',type:'spki'}):createPublicKey(publicKey.includes('BEGIN ')?publicKey:`-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`);
  if(rsa.asymmetricKeyType!=='rsa'||rsa.asymmetricKeyDetails.modulusLength<1024||rsa.asymmetricKeyDetails.modulusLength>8192)throw Error();
  return publicEncrypt({key:rsa,padding:constants.RSA_PKCS1_PADDING},Buffer.from(key)).toString('hex');
 }catch{fail('RSA_KEY_INVALID','RSA 公钥无效；支持 PEM、SPKI DER 十六进制或 Base64 公钥');}
}
function verifySignature(headers,text,key){
 if(headers===undefined)return 'absent';
 if(!headers||typeof headers!=='object'||Array.isArray(headers))fail('SIGNATURE_INVALID','请求头应为 JSON 对象');
 const lower=Object.fromEntries(Object.entries(headers).map(([k,v])=>[k.toLowerCase(),v]));
 const timestamp=lower['e-t-k'],signature=lower['e-s-k'];
 if(timestamp===undefined&&signature===undefined)return 'absent';
 if(!/^\d{1,20}$/.test(String(timestamp))||typeof signature!=='string'||!/^[a-f\d]{64}$/i.test(signature))fail('SIGNATURE_INVALID','校验签名需要完整的 E-T-K 和 E-S-K 请求头');
 const expected=createHmac('sha256',key).update(String(timestamp)+text).digest();
 if(!timingSafeEqual(expected,Buffer.from(signature,'hex')))fail('SIGNATURE_INVALID','请求签名不匹配，请核对密钥、密文及 E-T-K / E-S-K');
 return 'verified';
}

// Stateless: no ledger, account lookup, upstream request, logging or disk writes.
export function transformCrypto(options={}){
 if(!options||typeof options!=='object'||Array.isArray(options))fail('CRYPTO_MODE_INVALID','加解密参数应为 JSON 对象');
 const {direction,operation,input,key='',publicKey=''}=options;
 if(!['request','response'].includes(direction)||!['encrypt','decrypt'].includes(operation))fail('CRYPTO_MODE_INVALID','请选择入参或响应，以及加密或解密操作');
 if(typeof input!=='string'||!input.trim())fail('INPUT_REQUIRED','请先粘贴需要处理的内容');
 if(Buffer.byteLength(input)>48*1024)fail('INPUT_TOO_LARGE','输入内容超过 48 KiB，请缩小内容后重试');
 if(operation==='encrypt'){
  if(Buffer.byteLength(input)>16*1024)fail('INPUT_TOO_LARGE','单次加密明文不能超过 16 KiB');
  const data=parse(input),aes=aesKey(key,direction==='request');
  const ciphertext=encrypt(data,aes);
  if(direction==='response')return {output:{secretOutId:'0',encryptOutStr:ciphertext},key:aes};
  const headers={};
  if(publicKey){
   if(typeof publicKey!=='string'||publicKey.length>8192)fail('RSA_KEY_INVALID','RSA 公钥格式或长度不正确');
   headers['E-A-K']=wrapKey(publicKey.trim(),aes);
   headers['E-T-K']=String(Date.now());
   headers['E-S-K']=createHmac('sha256',aes).update(headers['E-T-K']+ciphertext).digest('hex');
  }
  return {output:{encryptInStr:ciphertext},key:aes,headers,complete:!!publicKey};
 }
 const trimmed=input.trim();
 const data=/^[a-f\d]+$/i.test(trimmed)?trimmed:parse(trimmed);
 const envelope=direction==='request'&&data?.body!==undefined?data.body:data;
 if(direction==='response'&&envelope&&String(envelope.secretOutId)==='-1'){
  if(typeof envelope.encryptOutStr!=='string')fail('CIPHERTEXT_INVALID','未加密响应的 encryptOutStr 应为 JSON 字符串');
  return {output:parse(envelope.encryptOutStr),plaintext:true};
 }
 const field=direction==='request'?'encryptInStr':'encryptOutStr';
 const text=typeof envelope==='string'?envelope:envelope?.[field];
 if(typeof text!=='string')fail('CIPHERTEXT_INVALID',`未找到 ${field}，请粘贴完整 JSON 或该字段的密文`);
 const aes=aesKey(key),signature=direction==='request'?verifySignature(data?.headers,text,aes):undefined;
 return {output:decrypt(text,aes),key:aes,...(signature?{signature}:{})};
}
