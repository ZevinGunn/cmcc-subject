import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {capturedBusinessPresets} from '../server/business-presets.js';
import {Catalog,defaultConfig,validateConfig} from '../server/catalog.js';
import {Service} from '../server/service.js';
import {Accounts} from '../server/accounts.js';
import {Ledger} from '../server/ledger.js';
import {Protocol} from '../server/protocol.js';
const temporary=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sx-preset-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};

test('两项抓包业务只预置已确认字段，未知短信参数与订购接口不套用 5G-A',t=>{
 const c=new Catalog(temporary(t));assert.equal(c.list().length,3);assert.equal(c.selectedId,'qqt5ga');
 for(const p of capturedBusinessPresets()){const row=c.get(p.id);assert.equal(row.status,'draft');assert.deepEqual(row.sms,p.sms);assert.equal(row.sms.busiType,'');assert.equal(row.sms.prcId,'');assert.equal(row.sms.channelId,'');assert.deepEqual(row.orderParams,{});assert.equal(row.price,'资费待核实');}
 assert.equal(c.get('har-tech-worker-day').queryPath,'nstwd/qryNstwdAct');assert.equal(c.get('har-tech-worker-day').orderPath,'nstwd/nstwdActCfm');assert.equal(c.get('har-migu-sports').orderPath,'');
});

test('旧配置无损增补、保留选择和修改、重启不重复、删除不复活',t=>{
 const dir=temporary(t),file=path.join(dir,'business-configs.json'),custom={...defaultConfig(),id:'old-custom',name:'原有配置',price:'自定资费'};
 fs.writeFileSync(file,JSON.stringify({selectedId:custom.id,items:[custom]}));
 const before=fs.readFileSync(file,'utf8'),c=new Catalog(dir);assert.equal(c.selectedId,custom.id);assert.equal(c.get().price,custom.price);assert.equal(c.list().length,3);assert.equal(fs.readFileSync(file,'utf8'),before);
 const p=c.get('har-migu-sports');c.save({...p,name:'已修改的体育业务'});assert.equal(new Catalog(dir).get().name,'已修改的体育业务');assert.equal(new Catalog(dir).list().length,3);
 c.remove(p.id);const restored=new Catalog(dir);assert.equal(restored.list().some(v=>v.id===p.id),false);assert.equal(restored.list().length,2);
});

test('已配置同路径业务去重，容量满不覆盖或丢失原配置',t=>{
 const dir=temporary(t),p=capturedBusinessPresets()[0],existing={...defaultConfig(),id:'existing',name:p.name,couponsBusiName:p.couponsBusiName,queryMode:'generic',queryPath:p.queryPath,orderPath:p.orderPath};
 fs.writeFileSync(path.join(dir,'business-configs.json'),JSON.stringify({items:[existing],selectedId:existing.id}));const c=new Catalog(dir);assert.equal(c.list().length,2);assert.equal(c.get().status,'ready');assert.equal(c.list().some(v=>v.id===p.id),false);
 const full=temporary(t),items=Array.from({length:100},(_,i)=>({...defaultConfig(),id:'custom-'+i}));fs.writeFileSync(path.join(full,'business-configs.json'),JSON.stringify({items,selectedId:'custom-50'}));const limit=new Catalog(full);assert.equal(limit.list().length,100);assert.equal(limit.selectedId,'custom-50');
});

test('待补全配置可反复保存，启用必须通过原完整校验，草稿也不能保存凭据或越界路径',t=>{
 const c=new Catalog(temporary(t)),p=c.get('har-migu-sports');const changed=c.save({...p,description:'补充说明'});assert.equal(changed.status,'draft');assert.equal(changed.revision,2);
 assert.throws(()=>c.save({...changed,status:'ready'}),{code:'INVALID_CONFIG'});
 assert.throws(()=>validateConfig({...p,orderPath:'https://evil.example/order'}),{code:'INVALID_CONFIG'});
 assert.throws(()=>validateConfig({...p,orderParams:{uuid:'captured-proof'}}),{code:'INVALID_CONFIG'});
 const enabled=c.save({...changed,status:'ready',sms:{...defaultConfig().sms,busiType:'SYNTHETIC_SMS',prcId:'SYNTHETIC'},orderPath:'fixture/submit'});assert.equal(enabled.status,'ready');assert.equal(new Catalog(c.file.slice(0,-'business-configs.json'.length)).get().status,'ready');
});

test('待补全配置的查询、发码、验证、订购与协议底层均在官方请求前拦截',async t=>{
 const dir=temporary(t),ledger=new Ledger(dir);let calls=0;const bridge={authenticate:async()=>{calls++;throw Error('must not authenticate');},call:async()=>{calls++;throw Error('must not call');},close:async()=>{}};
 const s=new Service(bridge,ledger);s.catalog.select('har-tech-worker-day');
 for(const action of [()=>s.queryQualification(),()=>s.sendSms(true),()=>s.verifySms('fake','001234'),()=>s.submit('fake',true)])await assert.rejects(action(),{code:'CONFIG_INCOMPLETE'});
 const accounts=new Accounts(()=>bridge,new Ledger(temporary(t)));accounts.catalog.select('har-migu-sports');for(const action of [()=>accounts.queryQualification(),()=>accounts.sendSms(true),()=>accounts.verifySms('fake','001234'),()=>accounts.submit('fake',true)])await assert.rejects(action(),{code:'CONFIG_INCOMPLETE'});
 const protocol=new Protocol(async()=>{calls++;throw Error('must not discover RSA');});for(const p of capturedBusinessPresets())await assert.rejects(protocol.call('qqt5gaSubmitPrcOrder',{}, {uuid:'synthetic'},p),{code:'CONFIG_INCOMPLETE'});
 assert.equal(calls,0);assert.equal(ledger.rows.length,0);
});
