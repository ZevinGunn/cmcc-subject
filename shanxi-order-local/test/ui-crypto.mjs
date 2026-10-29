// All inputs are synthetic. Only the stateless crypto API is invoked.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {generateKeyPairSync,createDecipheriv} from 'node:crypto';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const publicMode=process.argv.includes('--public'),live=process.argv.includes('--live');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'sx-ui-crypto-'));
let fixture,browser,url;
if(live){url='https://shanxi.1008086.xyz';}else{
 const server=http.createServer().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const port=server.address().port;await new Promise(r=>server.close(r));url=`http://127.0.0.1:${port}`;
 fixture=spawn(process.execPath,['test/ui-fixture.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,UI_FIXTURE_PORT:String(port),UI_FIXTURE_PUBLIC:publicMode?'1':'0'},stdio:['ignore','pipe','inherit']});
}
try{
 if(fixture)await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('fixture startup timeout')),10000);fixture.once('error',reject);fixture.once('exit',code=>reject(Error(`fixture exit ${code}`)));fixture.stdout.once('data',()=>{clearTimeout(timer);resolve();});});
 browser=await chromium.launch({headless:true,...(fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage(),errors=[],businessWrites=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('request',req=>{if(req.method()==='POST'&&!req.url().endsWith('/api/tools/crypto'))businessWrites.push(req.url());});
 await page.goto(url);await page.getByRole('button',{name:'加解密工具',exact:true}).click();await page.getByRole('heading',{name:'加解密工具'}).waitFor();
 if(!live)assert.equal((await page.request.get(url+'/api/state').then(r=>r.json())).environment,'fixture');
 const input=page.locator('#crypto-input'),output=page.locator('#crypto-output'),keyField=page.locator('#crypto-key');
 const plain={pubInfo:{smsCode:'001234'},busiInfo:{name:'山西移动',items:[true,null,0]},longId:'12345678901234567890'};
 const text=JSON.stringify(plain);
 await page.getByRole('button',{name:'加密',exact:true}).click();await input.fill(text);await page.getByRole('button',{name:'入参加密',exact:true}).click();await page.getByText('仅生成密文，未生成请求头',{exact:true}).waitFor();
 const key=await keyField.inputValue();assert.match(key,/^[A-Za-z0-9]{16}$/);
 const encrypted=JSON.parse(await output.inputValue());
 const cipher=encrypted.encryptInStr,decipher=createDecipheriv('aes-128-cbc',Buffer.from(key),Buffer.from(cipher.slice(0,32),'hex'));
 assert.deepEqual(JSON.parse(Buffer.concat([decipher.update(Buffer.from(cipher.slice(32),'hex')),decipher.final()]).toString()),plain);
 await page.getByRole('button',{name:'复制结果',exact:true}).click();assert.deepEqual(JSON.parse(await page.evaluate(()=>navigator.clipboard.readText())),encrypted);
 await page.getByRole('button',{name:'结果作为输入',exact:true}).click();await page.getByRole('button',{name:'入参解密',exact:true}).click();await page.getByText('未提供签名 · 已解析明文',{exact:true}).waitFor();assert.deepEqual(JSON.parse(await output.inputValue()),plain);
 await page.getByRole('button',{name:'业务配置',exact:true}).click();await page.getByRole('button',{name:'加解密工具',exact:true}).click();assert.deepEqual(JSON.parse(await output.inputValue()),plain);
 await keyField.fill('1111111111111111');assert.equal(await output.inputValue(),'');await page.getByRole('button',{name:'入参解密',exact:true}).click();await page.getByRole('alert').filter({hasText:'解密失败'}).waitFor();assert.equal(await output.inputValue(),'');
 await keyField.fill(key);await page.getByRole('button',{name:'加密',exact:true}).click();await input.fill('{invalid');await page.getByRole('button',{name:'格式化 JSON',exact:true}).click();await page.getByRole('alert').filter({hasText:'不是有效 JSON'}).waitFor();assert.equal(await input.inputValue(),'{invalid');
 await input.fill(text);await page.getByRole('button',{name:'格式化 JSON',exact:true}).click();assert.equal(await input.inputValue(),JSON.stringify(plain,null,2));
 const {publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});await page.getByText('RSA 公钥与完整请求头（可选）',{exact:true}).click();await page.locator('#crypto-rsa').fill(publicKey.export({format:'pem',type:'spki'}));
 await page.getByRole('button',{name:'入参加密',exact:true}).click();await page.getByText('密文与完整请求头已生成',{exact:true}).waitFor();
 await page.getByRole('button',{name:'复制完整请求',exact:true}).click();const full=await page.evaluate(()=>navigator.clipboard.readText());
 for(const width of [1440,1024,768,390,320]){
  await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
  const nav=await page.locator('nav').boundingBox();assert.ok(nav.x>=0&&nav.x+nav.width<=width,`nav outside ${width}`);
  const navItems=await page.locator('nav button').evaluateAll(nodes=>nodes.map(el=>({width:el.clientWidth,scroll:el.scrollWidth})));assert.ok(navItems.every(el=>el.scroll<=el.width),`nav label clipped ${width}`);
  if([1440,390,320].includes(width)){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${directory}/${width}.png`,fullPage:true});}
 }
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'解密',exact:true}).click();await input.fill(full);await page.getByRole('button',{name:'入参解密',exact:true}).click();await page.getByText('E-S-K 签名校验通过',{exact:true}).waitFor();assert.deepEqual(JSON.parse(await output.inputValue()),plain);
 await page.getByRole('button',{name:'响应值',exact:true}).click();await page.getByRole('button',{name:'加密',exact:true}).click();await input.fill(text);await page.getByRole('button',{name:'响应加密',exact:true}).click();await page.getByText('处理完成',{exact:true}).waitFor();
 const response=JSON.parse(await output.inputValue());assert.equal(response.secretOutId,'0');assert.match(response.encryptOutStr,/^[a-f0-9]+$/);
 await page.getByRole('button',{name:'结果作为输入',exact:true}).click();await page.getByRole('button',{name:'响应解密',exact:true}).click();await page.getByText('处理完成',{exact:true}).waitFor();assert.deepEqual(JSON.parse(await output.inputValue()),plain);
 await keyField.fill('');await input.fill(JSON.stringify({secretOutId:'-1',encryptOutStr:text}));await page.getByRole('button',{name:'响应解密',exact:true}).click();await page.getByText('secretOutId = -1 · 未加密响应',{exact:true}).waitFor();assert.deepEqual(JSON.parse(await output.inputValue()),plain);
 await page.getByRole('button',{name:'清空内容',exact:true}).click();assert.equal(await input.inputValue(),'');assert.equal(await output.inputValue(),'');assert.equal(await keyField.inputValue(),'');
 await input.fill(text);await keyField.fill(key);await page.reload();await page.getByRole('button',{name:'加解密工具',exact:true}).click();assert.equal(await input.inputValue(),'');assert.equal(await keyField.inputValue(),'');assert.equal(await output.inputValue(),'');
 assert.equal(await page.evaluate(secret=>Object.values(localStorage).concat(Object.values(sessionStorage)).some(v=>v.includes(secret)),key),false);
 assert.deepEqual(errors,[]);assert.deepEqual(businessWrites,[]);
 console.log(JSON.stringify({passed:true,live,publicMode,scenarios:['four-operations','independent-aes-oracle','rsa-headers','hmac-validation','plaintext-response','invalid-key','format-error','copy','navigation-preservation','clear','refresh-no-secrets','responsive'],screenshots:directory}));
}finally{await browser?.close();fixture?.kill('SIGTERM');}
