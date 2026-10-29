import {createHash} from 'node:crypto';
import {AppError,publicData,safeMessage} from './domain.js';

export function productCode(value){
 if(typeof value!=='string'||!/^[A-Za-z0-9_-]{1,160}$/.test(value))throw new AppError('INVALID_PRODUCT','官方产品编码缺失或格式异常，不能退订');
 return value;
}
export const unsubscribeParams=code=>({prod_prcid:productCode(code),couponsBusiName:'已订业务'});
function allowAttempt(row){
 row.officialSupported=row.category==='value'&&row.fields?.UnSubScribe==='Y';
 try{row.code=productCode(row.code);row.canUnsubscribe=true;row.reason=row.officialSupported?'官方标记可退订':'官方未标记可在线退订，可尝试提交，受理结果以官方为准';}
 catch{row.canUnsubscribe=false;row.reason='官方产品编码缺失或格式异常，无法提交退订';}
 return row;
}
const text=v=>['string','number'].includes(typeof v)?safeMessage(v):'';
export const subscriptionKey=row=>createHash('sha256').update(JSON.stringify([row.category,row.code,row.name,row.price,row.orderedAt,row.effectiveAt,row.expiresAt])).digest('hex');
export function subscriptions(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw new AppError('INVALID_RESPONSE','官方已订业务结构异常，原查询结果已保留',502);
 const items=[];
 for(const [key,category,type] of [['mainList','plan',null],['subList','value','02'],['svcList','basic','03']]){
  if(data[key]!==undefined&&!Array.isArray(data[key]))throw new AppError('INVALID_RESPONSE','官方业务列表格式异常，原查询结果已保留',502);
  for(const entry of data[key]||[]){
   const order=entry?.ORDER_INFO,p=order?.PROD_INFO;if(!p||typeof p!=='object'||Array.isArray(p))continue;
   const row=allowAttempt({category:category==='plan'&&p.useProd==='N'?'scheduled':type&&order.PROD_CODE!==type?'other':category,code:text(p.PRC_ID),name:text(p.PROD_PRC_NAME)||'未命名业务',price:text(p.PRC_PRICE),orderedAt:text(p.OP_TIME),effectiveAt:text(p.EFF_DATE),expiresAt:text(p.EXP_DATE),useProd:['Y','N'].includes(p.useProd)?p.useProd:null,fields:publicData(p,0,true),sourceFields:publicData(entry,0,true)});
   row.id=subscriptionKey(row);items.push(row);
  }
 }
 // Older adapters still use the same product-code-only unsubscribe payload.
 if(!['mainList','subList','svcList'].some(k=>Object.hasOwn(data,k))){
  if(!Array.isArray(data.list))throw new AppError('INVALID_RESPONSE','官方未返回已知业务列表结构，原查询结果已保留',502);
  for(const p of data.list){if(!p||typeof p!=='object')continue;const row=allowAttempt({category:'other',name:text(p.prcName||p.prodName||p.name)||'业务信息',code:text(p.prcId),price:text(p.price),orderedAt:'',effectiveAt:text(p.effDate),expiresAt:text(p.expDate),fields:publicData(p,0,true),sourceFields:publicData(p,0,true)});row.id=subscriptionKey(row);items.push(row);}
 }
 const counts=new Map();for(const row of items)counts.set(row.code,(counts.get(row.code)||0)+1);
 for(const row of items)if(row.canUnsubscribe&&counts.get(row.code)>1)row.reason+='；存在相同编码的多条业务，接口仅按产品编码提交';
 return items;
}
export function activities(data){
 if(!Array.isArray(data?.RECORD_LIST))throw new AppError('INVALID_RESPONSE','官方活动记录格式异常',502);
 return data.RECORD_LIST.map(row=>publicData(row,0,true));
}
