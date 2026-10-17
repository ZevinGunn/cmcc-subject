<script setup>
import {computed,ref,watch} from 'vue';
import {LockKeyhole,UnlockKeyhole,Copy,ArrowDownUp,Trash2,RefreshCw,Eye,EyeOff,LoaderCircle} from 'lucide-vue-next';
import {api} from './api';
const direction=ref('request'),operation=ref('decrypt'),input=ref(''),key=ref(''),publicKey=ref('');
const result=ref(null),error=ref(''),notice=ref(''),busy=ref(false),visible=ref(false);
const encrypting=computed(()=>operation.value==='encrypt');
const resultText=computed(()=>result.value?JSON.stringify(result.value.output,null,2):'');
const headerText=computed(()=>JSON.stringify(result.value?.headers,null,2));
const inputPlaceholder=computed(()=>encrypting.value?'粘贴 JSON，可编辑业务字段':direction.value==='request'?'粘贴包含 encryptInStr 的 JSON、{body, headers} 或纯密文':'粘贴包含 secretOutId、encryptOutStr 的响应 JSON，或纯密文');
const title=computed(()=>(direction.value==='request'?'入参':'响应')+(encrypting.value?'加密':'解密'));
watch([direction,operation,input,key,publicKey],()=>{result.value=null;error.value='';notice.value='';},{flush:'sync'});
async function process(){
 busy.value=true;result.value=null;error.value='';notice.value='';
 try{
  const value=await api('/tools/crypto',{direction:direction.value,operation:operation.value,input:input.value,key:key.value,publicKey:publicKey.value});
  if(value.key)key.value=value.key;
  result.value=value;
 }catch(e){error.value=e.message;}finally{busy.value=false;}
}
function generate(){
 const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';let value='';
 while(value.length<16){for(const byte of crypto.getRandomValues(new Uint8Array(32))){if(byte<248)value+=chars[byte%62];if(value.length===16)break;}}
 key.value=value;
}
function format(){try{input.value=JSON.stringify(JSON.parse(input.value),null,2);notice.value='JSON 已格式化';}catch{error.value='当前内容不是有效 JSON，原内容已保留';}}
async function copy(text){try{await navigator.clipboard.writeText(text);notice.value='已复制';}catch{error.value='复制失败，请在文本框内选择内容后复制';}}
function reuse(){const text=resultText.value;operation.value=encrypting.value?'decrypt':'encrypt';input.value=text;}
function clear(){input.value='';key.value='';publicKey.value='';result.value=null;error.value='';notice.value='';visible.value=false;}
</script>

<template>
 <section class="crypto-tools" aria-labelledby="crypto-title">
  <div class="page-heading"><div><h1 id="crypto-title">加解密工具</h1><p>查看业务入参与响应明文，编辑后重新加密。</p></div><button class="button secondary" @click="clear" :disabled="busy"><Trash2 :size="15"/>清空内容</button></div>
  <div class="crypto-toolbar">
   <div class="crypto-segment" role="group" aria-label="数据类型"><button v-for="item in [['request','请求入参'],['response','响应值']]" :key="item[0]" :aria-pressed="direction===item[0]" :disabled="busy" @click="direction=item[0]">{{item[1]}}</button></div>
   <div class="crypto-segment" role="group" aria-label="处理方式"><button :aria-pressed="!encrypting" :disabled="busy" @click="operation='decrypt'"><UnlockKeyhole :size="15"/>解密</button><button :aria-pressed="encrypting" :disabled="busy" @click="operation='encrypt'"><LockKeyhole :size="15"/>加密</button></div>
   <span class="crypto-protocol">AES-128-CBC · PKCS#7</span>
  </div>
  <fieldset class="crypto-key-panel" :disabled="busy">
   <label for="crypto-key">AES 密钥<span>{{encrypting&&direction==='request'?'可留空，自动生成':'与对应请求使用同一密钥'}}</span></label>
   <div class="crypto-key-row"><input id="crypto-key" v-model="key" :type="visible?'text':'password'" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="128" placeholder="16 位 ASCII 字符"/><button class="icon-button" :aria-label="visible?'隐藏密钥':'显示密钥'" @click="visible=!visible"><EyeOff v-if="visible" :size="17"/><Eye v-else :size="17"/></button><button v-if="encrypting" class="button secondary" @click="generate"><RefreshCw :size="14"/>生成密钥</button><button class="button secondary" :disabled="!key" @click="copy(key)"><Copy :size="14"/>复制密钥</button></div>
   <p class="crypto-help">解密需原请求的 AES 密钥。E-A-K 是 RSA 加密后的密钥，不能直接使用，也无法仅用 RSA 公钥还原。</p>
   <details v-if="encrypting&&direction==='request'" class="crypto-rsa"><summary>RSA 公钥与完整请求头（可选）</summary><label for="crypto-rsa">RSA 公钥</label><textarea id="crypto-rsa" v-model="publicKey" rows="4" spellcheck="false" maxlength="8192" placeholder="粘贴 PEM、SPKI DER 十六进制或 Base64 公钥"/><p class="crypto-help">填写后生成 E-A-K、E-T-K、E-S-K；留空仅生成 encryptInStr。</p></details>
  </fieldset>
  <div class="crypto-editors">
   <fieldset class="crypto-editor" :disabled="busy"><div class="crypto-editor-heading"><label for="crypto-input">{{encrypting?'JSON 明文':direction==='request'?'入参密文':'响应密文'}}</label><button class="text-button" :disabled="!input" @click="format">格式化 JSON</button></div><textarea id="crypto-input" v-model="input" spellcheck="false" :placeholder="inputPlaceholder"/><div class="crypto-editor-bottom"><span>{{input.length.toLocaleString()}} 字符</span><button class="button primary" :disabled="!input.trim()" @click="process"><LoaderCircle v-if="busy" :size="15" class="spin"/><component :is="encrypting?LockKeyhole:UnlockKeyhole" v-else :size="15"/>{{busy?'处理中':title}}</button></div></fieldset>
   <div class="crypto-editor"><div class="crypto-editor-heading"><label for="crypto-output">{{encrypting?'加密结果':'解密明文'}}</label><button class="text-button" :disabled="!result||busy" @click="copy(resultText)"><Copy :size="14"/>复制结果</button></div><textarea id="crypto-output" :value="resultText" readonly spellcheck="false" placeholder="处理结果将在这里显示"/><div class="crypto-editor-bottom"><span v-if="result?.plaintext">secretOutId = -1 · 未加密响应</span><span v-else-if="result?.signature==='verified'">E-S-K 签名校验通过</span><span v-else-if="result&&!encrypting&&direction==='request'">未提供签名 · 已解析明文</span><span v-else-if="result&&encrypting&&direction==='request'">{{result.complete?'密文与完整请求头已生成':'仅生成密文，未生成请求头'}}</span><span v-else>{{result?'处理完成':'等待处理'}}</span><button class="text-button" :disabled="!result||busy" @click="reuse"><ArrowDownUp :size="14"/>结果作为输入</button></div></div>
  </div>
  <div v-if="error" class="feedback error" role="alert">{{error}}</div><div v-if="notice" class="feedback" role="status">{{notice}}</div>
  <section v-if="result?.complete" class="crypto-headers"><div class="crypto-editor-heading"><h2>请求头</h2><div class="actions"><button class="text-button" @click="copy(headerText)"><Copy :size="14"/>复制请求头</button><button class="text-button" @click="copy(JSON.stringify({body:result.output,headers:result.headers},null,2))">复制完整请求</button></div></div><textarea aria-label="加密请求头" :value="headerText" readonly rows="7" spellcheck="false"/></section>
  <p class="crypto-footnote">输入、密钥和结果仅在当前页面保留，刷新即清空。计算由当前服务完成，不保存内容，不调用移动业务接口。secretOutId = -1 的响应可直接解析，无需密钥。</p>
 </section>
</template>

<style scoped>
.crypto-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px}.crypto-segment{display:flex;padding:3px;border:1px solid var(--line);border-radius:7px;background:#f5f9fc}.crypto-segment button{display:flex;align-items:center;gap:7px;justify-content:center;min-height:36px;padding:7px 18px;border:0;border-radius:4px;background:transparent;color:var(--muted)}.crypto-segment button[aria-pressed=true]{background:white;color:var(--primary-dark);box-shadow:0 1px 3px #20394c1a;font-weight:600}.crypto-protocol{font-size:12px;color:var(--muted);margin-left:auto}.crypto-tools fieldset{margin:0;min-width:0}.crypto-key-panel{border:1px solid var(--line);background:white;border-radius:8px;padding:18px 20px;margin-bottom:18px!important}.crypto-key-panel>label{display:flex;align-items:baseline;gap:12px;font-weight:600;margin-bottom:8px}.crypto-key-panel label span{font-size:12px;font-weight:400;color:var(--muted)}.crypto-key-row{display:flex;align-items:center;gap:8px}.crypto-key-row input{width:270px;max-width:100%;min-width:0;letter-spacing:.08em}.crypto-tools input,.crypto-tools textarea{border:1px solid #cedfe9;border-radius:5px;padding:10px 12px;color:var(--text);background:#fff;font:13px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace}.crypto-tools textarea:focus-visible{outline:3px solid #65b9df;outline-offset:2px}.crypto-help,.crypto-footnote{font-size:12px;line-height:1.7;color:var(--muted);margin-top:10px;overflow-wrap:anywhere}.crypto-rsa{margin-top:14px;border-top:1px solid var(--line);padding-top:12px}.crypto-rsa summary{cursor:pointer;color:var(--primary-dark);font-size:13px}.crypto-rsa label{display:block;margin:12px 0 6px}.crypto-rsa textarea,.crypto-headers textarea{display:block;width:100%;resize:vertical}.crypto-editors{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;margin-bottom:16px}.crypto-editor{min-width:0;padding:0;border:1px solid var(--line);border-radius:8px;background:white;overflow:hidden}.crypto-editor-heading{min-height:50px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;border-bottom:1px solid var(--line)}.crypto-editor-heading label{font-weight:600}.crypto-editor>textarea{display:block;width:100%;min-height:340px;resize:vertical;border:0;border-radius:0;padding:16px;overflow-wrap:anywhere;white-space:pre-wrap;word-break:break-all}.crypto-editor>textarea:focus-visible{outline-offset:-3px}.crypto-editor>textarea[readonly]{background:#fbfdfe}.crypto-editor-bottom{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 16px;border-top:1px solid var(--line)}.crypto-editor-bottom>span{font-size:11px;color:var(--muted)}.crypto-headers{border:1px solid var(--line);border-radius:8px;background:white;margin-bottom:16px;overflow:hidden}.crypto-headers h2{font-size:14px}.crypto-headers textarea{border:0;border-radius:0}.crypto-footnote{margin:18px 0 26px;max-width:820px}
@media(max-width:700px){.crypto-editors{grid-template-columns:1fr}.crypto-editor>textarea{min-height:260px}.crypto-key-row{flex-wrap:wrap}.crypto-key-row input{flex:1;width:auto;min-width:140px}.crypto-key-row .button{flex:1}.crypto-protocol{margin-left:0;width:100%}.crypto-toolbar{gap:8px}.crypto-segment{flex:1}.crypto-segment button{flex:1;padding:7px 12px}.crypto-key-panel{padding:16px}.crypto-key-panel>label{flex-wrap:wrap;gap:4px 12px}.crypto-editor-bottom{padding:10px 12px}}
@media(max-width:420px){.crypto-segment{flex-basis:100%}.crypto-segment button{white-space:nowrap}}
</style>
