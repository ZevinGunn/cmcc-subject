import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Catalog,defaultConfig,productKey,validateConfig} from '../server/catalog.js';
const temp=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sx-catalog-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
test('业务新增、修改、选择、删除持久化；乐观锁拒绝覆盖新版本',t=>{
 const dir=temp(t),c=new Catalog(dir);assert.equal(c.get().id,'qqt5ga');const base=c.list().length;const added=c.save({...defaultConfig(),id:'',name:'新增业务'});assert.notEqual(added.id,'qqt5ga');assert.equal(c.list().length,base+1);
 c.save({...added,price:'10 元/月'});assert.throws(()=>c.save(added),{code:'CONFIG_CHANGED'});assert.equal(new Catalog(dir).get().price,'10 元/月');c.select('qqt5ga');assert.equal(new Catalog(dir).get().id,'qqt5ga');c.remove(added.id);assert.equal(new Catalog(dir).list().length,base);for(const row of c.list().filter(c=>c.id!=='qqt5ga'))c.remove(row.id);assert.throws(()=>c.remove('qqt5ga'),{code:'CONFIG_REQUIRED'});assert.equal(fs.statSync(c.file).mode&0o777,0o600);
});
test('保存失败回滚内存配置，原文件保持可恢复',t=>{const c=new Catalog(temp(t)),before=c.list();c.persist=()=>{throw Error('disk full');};assert.throws(()=>c.save({...defaultConfig(),id:'',name:'未保存'}));assert.deepEqual(c.list(),before);assert.equal(c.selectedId,'qqt5ga');});
test('拒绝越界接口、凭据、动态字段和错误的 5G-A 资格解释',()=>{
 for(const orderPath of ['https://evil.example/order','../order','qqt5ga/order?x=1','wapLogin/login','rsakey/getRsaPubKey','moss/config'])assert.throws(()=>validateConfig({...defaultConfig(),orderPath}),{code:'INVALID_CONFIG'});
 for(const orderParams of [{uuid:'static'},{smsCode:'123456'},{phoneNo:'13800000000'},{a:{token:'bad'}},{busiType:'other'},JSON.parse('{"__proto__":{"polluted":true}}')])assert.throws(()=>validateConfig({...defaultConfig(),orderParams}),{code:'INVALID_CONFIG'});
 assert.throws(()=>validateConfig({...defaultConfig(),sms:{...defaultConfig().sms,prcId:'OTHER'}}),{code:'INVALID_CONFIG'});
 const generic=validateConfig({...defaultConfig(),queryMode:'generic',sms:{...defaultConfig().sms,prcId:'OTHER'},orderPath:'other/order',orderParams:{offerId:'OTHER',items:[{type:1}]}});assert.equal(generic.orderParams.offerId,'OTHER');
});
test('改名、资费、入口、额外参数和复制不能绕开同产品的重复订购保护',()=>{
 const c=defaultConfig();assert.equal(productKey(c),'qqt5ga');assert.equal(productKey({...c,id:'copy',name:'副本',price:'20 元',scope:'market',orderParams:{channel:'new'}}),'qqt5ga');assert.notEqual(productKey({...c,sms:{...c.sms,prcId:'OTHER'}}),productKey(c));
 const noCode={...c,sms:{...c.sms,prcId:''},orderParams:{offerId:'A'}};assert.notEqual(productKey(noCode),productKey({...noCode,orderParams:{offerId:'B'}}));
});
