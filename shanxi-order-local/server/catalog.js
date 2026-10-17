import fs from 'node:fs';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {AppError,product} from './domain.js';
import {capturedBusinessPresets} from './business-presets.js';
export const SMS_FIELDS=['channelId','busiType','busiName','prodDesc','effDate','sendType','actType','busiId','prcId','actId','meansId','businessCode'];
export const defaultConfig=()=>({id:'qqt5ga',revision:1,name:product.name,price:product.price,term:product.term,description:product.description,requirements:[...product.requirements],scope:'act',couponsBusiName:'全球通5GA加速权益',queryMode:'qqt5ga',queryPath:'qqt5ga/qryUserQualification',queryParams:{},orderPath:'qqt5ga/submitPrcOrder',orderParams:{},sms:{channelId:'llwap0',busiType:'QQT5GA_SMS',busiName:'全球通5GA加速权益',prodDesc:'5GA加速权益',effDate:'立即生效',sendType:'2',actType:'',busiId:'',prcId:'BCAT5075',actId:'',meansId:'',businessCode:''}});
const RESERVED=/cookie|token|secret|password|uuid|authorization|signature|^sign$|encrypt|session|smsCode|verifyCode|phone|mobile|__proto__|constructor|prototype|couponsBusiName|isSensitive/i;
function text(value,label,max=200,required=false){if(typeof value!=='string'||value.length>max||/[\x00-\x1f]/.test(value)||(required&&!value.trim()))throw new AppError('INVALID_CONFIG',`${label}格式不正确${required?'或未填写':''}`);return value.trim();}
export function endpoint(value,required=true){value=text(value,'接口相对路径',160,required);if(!value&&!required)return '';if(!/^[A-Za-z][A-Za-z0-9_-]*(?:\/[A-Za-z0-9_-]+)+$/.test(value)||/^(?:wapLogin|rsakey|moss)\//i.test(value))throw new AppError('INVALID_CONFIG','接口请填写 rest/v1 下的业务相对路径，例如 qqt5ga/submitPrcOrder');return value;}
export function parameters(value,label='额外参数'){
 if(!value||Array.isArray(value)||typeof value!=='object'||Buffer.byteLength(JSON.stringify(value),'utf8')>4096)throw new AppError('INVALID_CONFIG',`${label}必须是 4KB 以内的 JSON 对象`);
 const walk=(v,depth)=>{if(depth>5)throw new AppError('INVALID_CONFIG',`${label}嵌套过深`);if(v&&typeof v==='object'){for(const [k,x] of Object.entries(v)){if(RESERVED.test(k))throw new AppError('INVALID_CONFIG',`${label}不能保存身份凭据、号码或验证码字段：${k}`);walk(x,depth+1);}}else if(!['string','number','boolean'].includes(typeof v)&&v!==null)throw new AppError('INVALID_CONFIG',`${label}字段类型不支持`);};walk(value,0);return structuredClone(value);
}
export function validateConfig(input){
 if(!input||typeof input!=='object')throw new AppError('INVALID_CONFIG','缺少业务配置');
 const status=input.status??'ready';if(!['draft','ready'].includes(status))throw new AppError('INVALID_CONFIG','业务配置状态不正确');
 const draft=status==='draft';
 const c={id:text(input.id||'', '配置 ID',80),revision:input.revision??1,status,name:text(input.name,'业务名称',100,true),price:text(input.price,'资费说明',100,true),term:text(input.term??'','有效期',200),description:text(input.description??'','业务说明',600),requirements:[]};
 if(c.id&&!/^[A-Za-z0-9_-]{1,80}$/.test(c.id)||!Number.isSafeInteger(c.revision)||c.revision<1)throw new AppError('INVALID_CONFIG','配置 ID 或版本格式错误');
 if(!Array.isArray(input.requirements)||input.requirements.length>20)throw new AppError('INVALID_CONFIG','使用条件最多 20 项');c.requirements=input.requirements.map(v=>text(v,'使用条件',300));
 if(!['act','market'].includes(input.scope)||!['qqt5ga','generic','none'].includes(input.queryMode))throw new AppError('INVALID_CONFIG','请选择正确的接口入口和查询模式');
 c.scope=input.scope;c.queryMode=input.queryMode;c.couponsBusiName=text(input.couponsBusiName,'页面业务名称 couponsBusiName',100,true);c.orderPath=endpoint(input.orderPath||'',!draft);c.queryPath=endpoint(input.queryPath||'',!draft&&input.queryMode!=='none');c.orderParams=parameters(input.orderParams,'订购额外参数');c.queryParams=parameters(input.queryParams,'查询参数');
 if(Object.hasOwn(c.orderParams,'busiType'))throw new AppError('INVALID_CONFIG','订购 busiType 由短信业务类型统一提供');
 c.sms={};for(const key of SMS_FIELDS)c.sms[key]=text(input.sms?.[key]??'',key,200,!draft&&['busiType','busiName','channelId','sendType'].includes(key));
 if((!draft||c.sms.busiType)&&!/^[A-Za-z0-9_-]{1,80}$/.test(c.sms.busiType))throw new AppError('INVALID_CONFIG','busiType 仅支持字母、数字、下划线和短横线');
 if(c.queryMode==='qqt5ga'&&(c.sms.prcId!=='BCAT5075'||c.sms.busiType!=='QQT5GA_SMS'||c.queryPath!=='qqt5ga/qryUserQualification'||c.orderPath!=='qqt5ga/submitPrcOrder'))throw new AppError('INVALID_CONFIG','5G-A 资格解释仅适用于原 BCAT5075 配置；其他业务请选择通用查询或不查询');
 return c;
}
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export function productKey(c){
 // Known product codes define identity independently of labels, tariffs, API
 // aliases or optional request parameters. Cloning a profile cannot reset it.
 const identity=c.sms.prcId||c.sms.busiId?{busiType:c.sms.busiType,prcId:c.sms.prcId,busiId:c.sms.busiId}:{busiType:c.sms.busiType,orderPath:c.orderPath,actType:c.sms.actType,actId:c.sms.actId,orderParams:c.orderParams};
 if(c.sms.busiType==='QQT5GA_SMS'&&c.sms.prcId==='BCAT5075'&&!c.sms.busiId)return 'qqt5ga';
 return createHash('sha256').update(JSON.stringify(canonical(identity))).digest('hex');
}
export function assertConfigReady(c){if(c.status==='draft')throw new AppError('CONFIG_INCOMPLETE','此业务配置待补全，请先在业务配置中核对参数并启用',409);}
export const viewProduct=c=>({id:c.id,status:c.status||'ready',name:c.name,price:c.price,fee:c.price,code:c.sms.prcId||c.sms.busiId||'未配置',term:c.term||'以官方结果为准',description:c.description,requirements:c.requirements,queryMode:c.queryMode,orderKey:productKey(c)});
export class Catalog {
 constructor(directory){
  this.file=path.join(directory,'business-configs.json');const data=fs.existsSync(this.file)?JSON.parse(fs.readFileSync(this.file,'utf8')):null;
  this.items=data?.items?.map(validateConfig)||[defaultConfig()];if(!this.items.length||this.items.length>100||new Set(this.items.map(c=>c.id)).size!==this.items.length)throw new AppError('INVALID_CONFIG','业务配置文件格式异常');
  if(data?.importedPresets!==undefined&&(!Array.isArray(data.importedPresets)||data.importedPresets.some(id=>typeof id!=='string')))throw new AppError('INVALID_CONFIG','业务预置版本记录格式异常');
  this.importedPresets=new Set(data?.importedPresets||[]);
  for(const preset of capturedBusinessPresets()){
   if(this.importedPresets.has(preset.id))continue;
   const existing=this.items.some(c=>c.id===preset.id||c.couponsBusiName===preset.couponsBusiName&&((preset.queryPath&&c.queryPath===preset.queryPath)||(preset.orderPath&&c.orderPath===preset.orderPath)));
   if(existing)this.importedPresets.add(preset.id);
   else if(this.items.length<100){this.items.push(validateConfig(preset));this.importedPresets.add(preset.id);}
  }
  this.selectedId=this.items.some(c=>c.id===data?.selectedId)?data.selectedId:this.items[0].id;
 }
 get(id=this.selectedId){const c=this.items.find(c=>c.id===id);if(!c)throw new AppError('CONFIG_NOT_FOUND','业务配置不存在',404);return structuredClone(c);}
 list(){return structuredClone(this.items);}
 persist(){fs.mkdirSync(path.dirname(this.file),{recursive:true,mode:0o700});const tmp=this.file+'.tmp';fs.writeFileSync(tmp,JSON.stringify({selectedId:this.selectedId,items:this.items,importedPresets:[...this.importedPresets]},null,2),{mode:0o600});const fd=fs.openSync(tmp,'r');try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.renameSync(tmp,this.file);}
 mutate(fn){const items=structuredClone(this.items),selectedId=this.selectedId;try{const result=fn();this.persist();return result;}catch(e){this.items=items;this.selectedId=selectedId;throw e;}}
 save(input){return this.mutate(()=>{const c=validateConfig(input),index=this.items.findIndex(v=>v.id===c.id);if(c.id&&index<0)throw new AppError('CONFIG_NOT_FOUND','业务配置不存在',404);if(index>=0&&input.revision!==this.items[index].revision)throw new AppError('CONFIG_CHANGED','业务配置已更新，请重新打开编辑',409);if(index<0&&this.items.length>=100)throw new AppError('CONFIG_LIMIT','最多保存 100 个业务配置');c.id=index<0?randomUUID():c.id;c.revision=index<0?1:this.items[index].revision+1;if(index<0)this.items.push(c);else this.items[index]=c;this.selectedId=c.id;return this.get();});}
 select(id){return this.mutate(()=>{this.get(id);this.selectedId=id;return this.get();});}
 remove(id){return this.mutate(()=>{this.get(id);if(this.items.length===1)throw new AppError('CONFIG_REQUIRED','请至少保留一个业务配置');this.items=this.items.filter(c=>c.id!==id);if(this.selectedId===id)this.selectedId=this.items[0].id;});}
}
