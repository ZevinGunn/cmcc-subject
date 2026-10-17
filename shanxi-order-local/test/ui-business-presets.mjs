import {numberView,logoutNumber} from './ui-navigation.mjs';
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const live=process.argv.includes('--live'),publicMode=live||process.argv.includes('--public');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'sx-ui-presets-'));let fixture,browser,url;
if(live)url='https://shanxi.1008086.xyz';else{
 const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const port=server.address().port;await new Promise(r=>server.close(r));url=`http://127.0.0.1:${port}`;
 fixture=spawn(process.execPath,['test/ui-fixture.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,UI_FIXTURE_PORT:String(port),UI_FIXTURE_PUBLIC:publicMode?'1':'0'},stdio:['ignore','pipe','inherit']});
}
try{
 if(fixture)await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('fixture timeout')),10000);fixture.once('error',reject);fixture.once('exit',code=>reject(Error(`fixture exit ${code}`)));fixture.stdout.once('data',()=>{clearTimeout(timer);resolve();});});
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.getByRole('button',{name:'业务配置',exact:true}).click();await page.getByRole('heading',{name:'业务配置',exact:true}).waitFor();
 const state=await page.request.get(url+'/api/state').then(r=>r.json());if(!live)assert.equal(state.environment,'fixture');
 for(const id of ['har-tech-worker-day','har-migu-sports'])assert.equal(state.configs.find(c=>c.id===id)?.status,'draft');
 assert.equal(await page.getByText('待补全',{exact:true}).count(),2);
 const sports=()=>page.locator('.config-row').filter({has:page.getByRole('heading',{name:/^咪咕体育/})});
 await sports().getByRole('button',{name:'修改',exact:true}).click();assert.equal(await page.getByLabel('配置待补全 · 仅保存，不启用查询与办理').isChecked(),true);assert.equal(await page.getByRole('button',{name:'保存并尝试订购',exact:true}).isDisabled(),true);
 assert.equal(await page.getByLabel('短信业务类型 · busiType').inputValue(),'');assert.equal(await page.getByLabel('订购相对路径').inputValue(),'');
 if(!live){
  await page.getByLabel('业务说明',{exact:true}).fill('离线测试补充说明，仍缺真实业务参数');await page.getByRole('button',{name:'保存配置',exact:true}).click();await page.getByRole('heading',{name:'业务配置',exact:true}).waitFor();await page.reload();await page.getByRole('button',{name:'业务配置',exact:true}).click();await sports().getByRole('button',{name:'修改',exact:true}).click();assert.equal(await page.getByLabel('业务说明',{exact:true}).inputValue(),'离线测试补充说明，仍缺真实业务参数');
 }
 for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);if([1440,390].includes(width)){await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await page.screenshot({path:`${directory}/edit-${width}.png`,fullPage:false});await page.getByRole('button',{name:'保存配置',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:`${directory}/edit-bottom-${width}.png`,fullPage:false});}}
 await page.setViewportSize({width:1440,height:1000});
 if(!live){
  await page.getByLabel('配置待补全 · 仅保存，不启用查询与办理').uncheck();assert.equal(await page.locator('form').evaluate(el=>el.checkValidity()),false);
  for(const [label,value] of [['短信业务类型 · busiType','SYNTHETIC_SMS'],['短信业务名称 · busiName','离线测试体育业务'],['渠道标识 · channelId','SYNTHETIC_CHANNEL'],['发送类型 · sendType','2'],['产品编码 · prcId','SYNTHETIC_PRODUCT'],['订购相对路径','fixture/submit']])await page.getByLabel(label).fill(value);
  assert.equal(await page.locator('form').evaluate(el=>el.checkValidity()),true);assert.equal(await page.getByRole('button',{name:'保存并尝试订购',exact:true}).isEnabled(),true);
  await page.getByRole('button',{name:'保存配置',exact:true}).click();await page.getByRole('heading',{name:'业务配置',exact:true}).waitFor();const enabled=await page.request.get(url+'/api/state').then(r=>r.json());assert.equal(enabled.configs.find(c=>c.id==='har-migu-sports').status,'ready');
 }else await page.getByRole('button',{name:'返回配置列表',exact:true}).click();
 await numberView(page,'业务办理');await page.locator('#selected-business').selectOption('har-tech-worker-day');await page.getByRole('button',{name:'补全业务配置',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'查询业务内容',exact:true}).isDisabled(),true);assert.equal(await page.getByRole('button',{name:'仍尝试办理',exact:true}).count(),0);
 if(!live){
  const r=await page.evaluate(async()=>{const state=await fetch('/api/state').then(r=>r.json());const response=await fetch('/api/order/sms',{method:'POST',headers:{'content-type':'application/json','x-local-csrf':state.csrf},body:JSON.stringify({attemptAnyway:true,config:{id:state.selectedId,revision:state.configs.find(c=>c.id===state.selectedId).revision}})});return {status:response.status,body:await response.json()};});assert.equal(r.status,409);assert.equal(r.body.error.code,'CONFIG_INCOMPLETE');
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:directory+'/home-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,live,publicMode,scenarios:['two-captured-drafts','empty-unknown-fields','edit','persist-reload','blocked-attempt','responsive'],screenshots:directory}));
}finally{await browser?.close();fixture?.kill('SIGTERM');}
