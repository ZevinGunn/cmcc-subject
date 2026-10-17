<script setup>
import {computed,ref,onMounted,onUnmounted,nextTick} from 'vue';
import {Zap,LayoutDashboard,PackageSearch,History,ArrowUpRight,RefreshCw,Check,ChevronRight,Smartphone,LogOut,ShieldCheck,LoaderCircle,X,Info,Search,CheckCircle2,AlertCircle,ExternalLink,Download,ArrowLeft,Monitor} from 'lucide-vue-next';
import {api} from './api';
const state=ref({account:null,product:{requirements:[]},orders:[],challenge:null});
const tab=ref('home'),pending=ref(''),error=ref(''),notice=ref(''),search=ref(''),loaded=ref(false),loginOpened=ref(false);
const dialog=ref(null),code=ref(''),consent=ref(false),countdown=ref(0),resolution=ref(null),resConsent=ref(false);
const loginPhone=ref(''),loginCode=ref(''),loginAgreed=ref(false),loginCountdown=ref(0),sentPhone=ref('');
const dialogRef=ref(null),codeRef=ref(null);let trigger=null,timer,poll;
const q=computed(()=>state.value.qualification);
const product=computed(()=>state.value.product);
const account=computed(()=>state.value.account);
const busy=computed(()=>!!pending.value||state.value.busy);
const blocked=computed(()=>state.value.orders.some(o=>['submitting','unknown','success','held'].includes(o.status)));
const unknown=computed(()=>state.value.orders.filter(o=>o.status==='unknown').length);
const date=v=>v?new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
const statuses={success:['办理成功','success'],failed:['未办理成功','danger'],unknown:['结果待核查','warning'],submitting:['办理中','warning'],held:['已确认享有','success'],released:['已人工核实','muted']};
function assign(data){if('account' in data){if(state.value.challenge?.id!==data.challenge?.id){code.value='';consent.value=false;}state.value=data;countdown.value=data.cooldown||0;loginCountdown.value=data.loginCooldown||0;if(!data.account&&dialog.value&&dialog.value!=='login')closeDialog();}}
async function run(name,fn){if(pending.value)return;pending.value=name;error.value='';notice.value='';try{await fn();}catch(e){error.value=e.message;await refresh();if(['AUTH_EXPIRED','ACCOUNT_CHANGED','LOGIN_REQUIRED'].includes(e.code)){if(dialog.value)closeDialog();}}finally{pending.value='';if(name==='sms'){await nextTick();codeRef.value?.focus();}}}
async function refresh(){try{assign(await api('/state'));loaded.value=true;}catch(e){error.value=e.message;loaded.value=true;}}
async function login(){trigger=document.activeElement;dialog.value='login';error.value='';notice.value='';loginCode.value='';loginAgreed.value=false;await nextTick();dialogRef.value.showModal();}
async function openOfficialLogin(){await run('official-login',async()=>{await api('/login/open',{});loginOpened.value=true;notice.value='官方窗口已打开，完成登录后可同步账号。';});}
async function sendLoginSms(){await run('login-sms',async()=>{sentPhone.value=loginPhone.value;assign(await api('/login/sms',{phone:loginPhone.value,agreed:loginAgreed.value}));loginCode.value='';notice.value='登录验证码已发送';});}
async function verifyLogin(){await run('login-verify',async()=>{assign(await api('/login/verify',{id:state.value.login.id,code:loginCode.value,agreed:loginAgreed.value}));loginCode.value='';loginPhone.value='';sentPhone.value='';loginOpened.value=false;dialogRef.value?.close();dialog.value=null;trigger?.focus();notice.value='登录成功，可以查询业务。';});}
async function sync(){await run('sync',async()=>{assign(await api('/login/sync',{}));loginOpened.value=false;closeDialog();loginCode.value='';loginPhone.value='';notice.value='登录已同步，可以查询业务。';});}
async function query(kind){await run(kind,async()=>{assign(await api('/query/'+kind,{}));notice.value=kind==='business'?'已订业务已更新':'业务内容与资格已更新';});}
async function showOfficial(){await run('official',async()=>{await api('/official/open',{});});}
async function logout(){await run('logout',async()=>{assign(await api('/logout',{}));loginOpened.value=false;tab.value='home';notice.value='已退出，官方浏览器会话已清除';});}
async function openDialog(){trigger=document.activeElement;dialog.value='order';error.value='';code.value='';consent.value=false;await nextTick();dialogRef.value.showModal();}
function closeDialog(){if(['submit','login-verify','login-sms'].includes(pending.value))return;dialogRef.value?.close();dialog.value=null;resolution.value=null;code.value='';loginCode.value='';trigger?.focus();}
async function sendSms(){await run('sms',async()=>{assign(await api('/order/sms',{}));code.value='';await nextTick();codeRef.value?.focus();notice.value='业务验证码已发送';});}
async function verify(){await run('verify',async()=>{assign(await api('/order/verify',{id:state.value.challenge.id,code:code.value}));code.value='';notice.value='验证码已验证，请确认办理';});}
async function submit(){await run('submit',async()=>{assign(await api('/order/submit',{id:state.value.challenge.id,confirmed:consent.value}));dialogRef.value.close();dialog.value=null;tab.value='history';notice.value='办理结果已更新';});}
async function reconcile(order){await run('reconcile-'+order.id,async()=>{assign(await api('/orders/'+order.id+'/reconcile',{}));notice.value=['ordered','included'].includes(q.value?.state)?'已核查当前权益状态':'当前未确认权益生效。请向官方核实后再决定是否重新办理。';});}
async function openResolve(order){trigger=document.activeElement;resolution.value=order;resConsent.value=false;dialog.value='resolve';await nextTick();dialogRef.value.showModal();}
async function resolve(){await run('resolve',async()=>{assign(await api('/orders/'+resolution.value.id+'/resolve',{confirmed:resConsent.value}));closeDialog();notice.value='已记录人工核查结果';});}
const labels={prcName:'业务名称',prodName:'产品名称',productName:'产品名称',busiName:'业务名称',offerName:'套餐名称',name:'名称',prcId:'产品编码',prodId:'产品编码',price:'资费',fee:'费用',effDate:'生效时间',effectiveDate:'生效时间',expDate:'失效时间',expireDate:'失效时间',status:'状态',orderTime:'订购时间',startDate:'开始时间',endDate:'结束时间',phoneNo:'手机号码',phone_no:'手机号码'};
function extractRows(data){
 const arrays=[];
 const walk=(v,depth=0)=>{if(depth>7||v==null)return;if(Array.isArray(v)){if(v.length&&v.some(x=>x&&typeof x==='object'&&!Array.isArray(x)))arrays.push(v);for(const x of v)walk(x,depth+1);}else if(typeof v==='object')Object.values(v).forEach(x=>walk(x,depth+1));};walk(data);
 const list=arrays.sort((a,b)=>b.length-a.length)[0];
 if(list)return list.map((item,index)=>({index,fields:Object.entries(item??{}).filter(([,v])=>v!==null&&typeof v!=='object').map(([key,value])=>({key,label:labels[key]||key,value:String(value)}))})).filter(x=>x.fields.length);
 if(data&&typeof data==='object'&&Object.keys(data).length)return [{index:0,fields:Object.entries(data).filter(([,v])=>v!==null&&typeof v!=='object').map(([key,value])=>({key,label:labels[key]||key,value:String(value)}))}].filter(x=>x.fields.length);
 return [];
}
const businessRows=computed(()=>extractRows(state.value.business?.data));
const filtered=computed(()=>businessRows.value.filter(r=>r.fields.some(f=>f.value.toLowerCase().includes(search.value.trim().toLowerCase()))));
function rowTitle(row){return row.fields.find(f=>['prcName','prodName','productName','busiName','offerName','name'].includes(f.key))?.value||'业务信息 '+(row.index+1);}
function download(){const data=state.value.orders;const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='晋速办办理记录.json';a.click();URL.revokeObjectURL(url);}
onMounted(async()=>{await refresh();timer=setInterval(()=>{if(countdown.value>0)countdown.value--;if(loginCountdown.value>0)loginCountdown.value--;},1000);poll=setInterval(()=>{if(!pending.value)refresh();},5000);});
onUnmounted(()=>{clearInterval(timer);clearInterval(poll);});
</script>
<template>
 <div class="shell">
  <aside class="sidebar">
   <a class="brand" href="#" @click.prevent="tab='home'"><span class="brand-mark"><Zap :size="21" fill="currentColor"/></span><div><strong>晋速办</strong><small>山西移动 · 本地业务台</small></div></a>
   <div class="workspace-label">工作空间 <span>LOCAL</span></div>
   <nav aria-label="主导航">
    <button :class="{active:tab==='home'}" @click="tab='home'"><LayoutDashboard :size="18"/>快捷办理<ChevronRight class="nav-arrow" :size="15"/></button>
    <button :class="{active:tab==='business'}" @click="tab='business'"><PackageSearch :size="18"/>已订业务</button>
    <button :class="{active:tab==='history'}" @click="tab='history'"><History :size="18"/>办理记录<span v-if="unknown" class="nav-count">{{unknown}}</span></button>
   </nav>
   <div class="account-panel">
    <div class="eyebrow">当前账号</div>
    <div class="account-line"><span class="account-icon"><Smartphone :size="18"/></span><div><strong>{{account?.phone||'尚未登录'}}</strong><small>{{account?'山西移动 · 已同步':'使用手机验证码登录'}}</small></div></div>
    <template v-if="account"><button class="text-button account-action" @click="showOfficial" :disabled="busy">官方窗口<ArrowUpRight :size="14"/></button><button class="text-button account-action" @click="logout" :disabled="busy"><LogOut :size="13"/>退出登录</button></template>
    <button v-else class="button primary full" @click="login" :disabled="busy"><LoaderCircle v-if="pending==='login'" class="spin" :size="15"/><Smartphone v-else :size="15"/>验证码登录</button>
   </div>
   <div class="local-note"><span class="live-dot"></span>仅在本机运行 <span>v1.1</span></div>
  </aside>
  <div class="body">
   <header class="topbar"><div class="breadcrumb">业务工作台 <ChevronRight :size="13"/><span>{{{home:'快捷办理',business:'已订业务',history:'办理记录'}[tab]}}</span></div><div class="topbar-actions"><span v-if="account" class="mobile-account">{{account.phone}}</span><button v-if="account" class="text-button mobile-account" @click="logout" :disabled="busy">退出</button><button class="text-button" @click="showOfficial" :disabled="busy"><ExternalLink :size="14"/>官方窗口</button></div></header>
   <main>
    <div v-if="!loaded" class="loading"><LoaderCircle class="spin" :size="20"/>正在连接本地服务</div>
    <template v-else>
     <div v-if="state.environment==='fixture'" class="feedback warning" role="status">离线验证环境 · 数据仅用于测试，不发送短信或办理真实业务。</div>
     <div v-if="error&&!dialog" class="feedback error" role="alert"><AlertCircle :size="17"/><span>{{error}}</span><button class="icon-button" aria-label="关闭错误提示" @click="error=''"><X :size="15"/></button></div>
     <div v-if="notice&&!dialog" class="feedback" role="status"><Info :size="17"/><span>{{notice}}</span><button class="icon-button" aria-label="关闭提示" @click="notice=''"><X :size="15"/></button></div>
     <section v-if="!account" class="login-strip">
      <span class="strip-icon"><ShieldCheck :size="24"/></span><div><h2>{{loginOpened?'在官方窗口完成登录':'登录后查询山西移动业务并办理'}}</h2><p>{{loginOpened?'完成官方登录后同步账号。':'输入手机号获取验证码，官方校验后登录。'}}</p></div>
      <button v-if="loginOpened" class="button primary" @click="sync" :disabled="busy"><LoaderCircle v-if="pending==='sync'" class="spin" :size="15"/><RefreshCw v-else :size="15"/>同步登录</button><button v-else class="button primary" @click="login" :disabled="busy">验证码登录<ArrowUpRight :size="15"/></button>
     </section>
     <template v-if="tab==='home'">
      <div class="page-heading"><div><div class="eyebrow">QUICK SERVICE</div><h1>快捷办理</h1><p>查询当前号码资格，确认后直接办理。</p></div><button class="button secondary" @click="query('content')" :disabled="busy||!account"><RefreshCw :size="15" :class="{spin:pending==='content'}"/>{{q?'刷新业务内容':'查询业务内容'}}</button></div>
      <div class="section-bar"><h2>可办权益 <span class="count">1</span></h2><span class="subtle">{{q?'更新于 '+date(q.checkedAt):'资格待查询'}}</span></div>
      <div class="service-layout">
       <article class="product-panel">
        <div class="product-top"><div class="product-symbol">5G<span>A</span></div><span class="tag">全球通专属</span></div>
        <h2>{{product.name}}</h2><p class="product-description">{{product.description}}</p>
        <div class="price-row"><strong>0<span>元</span></strong><span>免费办理</span></div>
        <dl class="terms"><div><dt>权益期限</dt><dd>{{product.term}}</dd></div><div><dt>生效时间</dt><dd>以开通成功短信为准</dd></div><div><dt>适用场景</dt><dd>游戏、视频、直播、办公等</dd></div></dl>
        <div class="eligibility" :class="q?.state==='eligible'?'eligible':''"><span class="status-dot"/><div><strong>{{q?.label||(account?'待查询办理资格':'登录后查询资格')}}</strong><p>{{q?.message||(account?'查询后可查看是否符合免费办理条件。':'登录不会自动订购任何业务。')}}</p></div></div>
        <button v-if="q?.state==='eligible'&&!blocked" class="button primary full" :disabled="busy||!account" @click="openDialog">办理此权益<ChevronRight :size="16"/></button>
        <button v-else-if="!q" class="button secondary full" :disabled="busy||!account" @click="query('content')">{{account?'查询办理资格':'请先登录'}}</button>
        <button v-else-if="blocked" class="button secondary full" @click="tab='history'">查看办理记录<ChevronRight :size="16"/></button>
        <button v-else class="button secondary full" disabled>{{q.label}}</button>
       </article>
       <aside class="details-panel"><h3>业务内容</h3><dl class="content-meta"><div><dt>业务编码</dt><dd>{{product.code}}</dd></div><div><dt>资费</dt><dd>{{product.fee}}</dd></div><div><dt>查询时间</dt><dd>{{date(state.content?.queriedAt)}}</dd></div></dl><details v-if="state.content" class="query-details"><summary>官方资格响应</summary><pre>{{JSON.stringify(state.content.data,null,2)}}</pre></details><h3>办理说明</h3><div class="steps"><div><span>01</span><section><strong>查询号码资格</strong><p>以当前账号的官方查询结果为准。</p></section></div><div><span>02</span><section><strong>验证业务短信</strong><p>业务验证码与登录验证码不同。</p></section></div><div><span>03</span><section><strong>确认办理结果</strong><p>服务端确认后显示结果并留存记录。</p></section></div></div><div class="divider"/><h3>使用条件</h3><ul class="requirements"><li v-for="item in product.requirements" :key="item"><Check :size="14"/><span>{{item}}</span></li></ul><div class="detail-bottom"><ShieldCheck :size="17"/><span>每笔办理均需手动确认</span></div></aside>
      </div>
      <section class="recent-section"><div class="section-bar"><h2>最近办理</h2><button class="text-button" @click="tab='history'">全部记录<ChevronRight :size="14"/></button></div><div v-if="!state.orders.length" class="inline-empty"><History :size="20"/><span>暂无办理记录</span><span class="subtle">完成办理后，结果会保存在本机。</span></div><div v-else v-for="o in state.orders.slice(0,3)" :key="o.id" class="recent-row"><strong>{{o.name}}</strong><span>{{o.phone}}</span><span class="status" :class="statuses[o.status][1]">{{statuses[o.status][0]}}</span><time>{{date(o.createdAt)}}</time></div></section>
     </template>
     <template v-else-if="tab==='business'">
      <div class="page-heading"><div><div class="eyebrow">MY SERVICES</div><h1>已订业务</h1><p>查看当前号码的官方业务信息。</p></div><button class="button primary" @click="query('business')" :disabled="busy||!account"><RefreshCw :size="15" :class="{spin:pending==='business'}"/>{{state.business?'刷新业务':'查询业务'}}</button></div>
      <div class="list-toolbar"><div class="search-field"><Search :size="16"/><input v-model="search" placeholder="搜索业务名称、编码" aria-label="搜索业务"/></div><span class="subtle">{{state.business?'查询于 '+date(state.business.queriedAt):'尚未查询'}}</span></div>
      <div v-if="pending==='business'" class="empty-state"><LoaderCircle class="spin" :size="26"/><h3>正在查询已订业务</h3><p>首次查询需要加载官方业务页面，请稍候。</p></div>
      <div v-else-if="!state.business" class="empty-state"><PackageSearch :size="30"/><h3>{{account?'查询当前号码的已订业务':'登录后查看已订业务'}}</h3><p>{{account?'点击查询，获取官方返回的业务信息。':'请先使用手机验证码登录。'}}</p><button class="button secondary" :disabled="busy" @click="account?query('business'):login()">{{account?'开始查询':'验证码登录'}}</button></div>
      <div v-else-if="!filtered.length" class="empty-state"><PackageSearch :size="30"/><h3>{{search?'没有匹配的业务':'未返回可展示的业务条目'}}</h3><p>{{search?'试试其他名称或编码。':'可展开下方查询详情，或在官方窗口核对。'}}</p></div>
      <div v-else class="business-list"><article v-for="row in filtered" :key="row.index"><div class="business-title"><span class="table-icon"><PackageSearch :size="17"/></span><h3>{{rowTitle(row)}}</h3></div><dl><div v-for="field in row.fields" :key="field.key"><dt>{{field.label}}</dt><dd>{{field.value}}</dd></div></dl></article></div>
      <details v-if="state.business" class="raw-details"><summary>官方查询详情</summary><p class="subtle">保留官方字段与原始单位；部分字段名称可能未转换。</p><pre>{{JSON.stringify(state.business.data,null,2)}}</pre></details>
     </template>
     <template v-else>
      <div class="page-heading"><div><div class="eyebrow">ORDER HISTORY</div><h1>办理记录</h1><p>当前账号在本机发起的办理，不代表全部历史订单。</p></div><button class="button secondary" @click="download" :disabled="!state.orders.length"><Download :size="15"/>导出记录</button></div>
      <div v-if="unknown" class="feedback warning"><AlertCircle :size="18"/><span>{{unknown}} 笔办理结果待核查。请先确认权益状态，避免重复办理。</span></div>
      <div v-if="!state.orders.length" class="empty-state"><History :size="30"/><h3>暂无办理记录</h3><p>账号登录后，可在快捷办理中查询资格。</p><button class="button secondary" @click="tab='home'">前往快捷办理<ChevronRight :size="15"/></button></div>
      <div v-else class="history-list"><article v-for="o in state.orders" :key="o.id"><div class="order-heading"><h3>{{o.name}}</h3><span class="status" :class="statuses[o.status][1]">{{statuses[o.status][0]}}</span></div><div class="order-meta"><span>{{o.phone}}</span><span>{{o.price}}</span><time>{{date(o.createdAt)}}</time></div><p>{{o.message}}</p><div class="order-bottom"><span class="subtle">本地记录号 {{o.id.slice(0,8)}}</span><div v-if="['unknown','success','held'].includes(o.status)" class="actions"><button class="text-button" :disabled="busy" @click="reconcile(o)"><RefreshCw :size="13"/>核查权益</button><button v-if="o.status==='unknown'" class="text-button muted" :disabled="busy" @click="openResolve(o)">人工核实未生效</button></div></div></article></div>
     </template>
     <footer><span>晋速办 · 本地业务工具</span><span>业务与资费以中国移动官方结果为准</span></footer>
    </template>
   </main>
  </div>
  <dialog ref="dialogRef" class="modal" aria-labelledby="dialog-title" aria-modal="true" @cancel="['submit','login-verify','login-sms'].includes(pending)?$event.preventDefault():closeDialog()" @click="e=>{if(e.target===dialogRef)closeDialog()}">
   <template v-if="dialog==='login'">
    <div class="modal-header"><h2 id="dialog-title">手机验证码登录</h2><button class="icon-button" aria-label="关闭登录窗口" @click="closeDialog" :disabled="busy"><X :size="20"/></button></div>
    <form class="modal-body login-form" @submit.prevent="verifyLogin">
     <div v-if="error" class="feedback error" role="alert"><AlertCircle :size="16"/><span>{{error}}</span></div>
     <div v-if="notice" class="feedback" role="status">{{notice}}</div>
     <label for="login-phone">手机号码</label><input id="login-phone" v-model="loginPhone" @input="loginPhone=loginPhone.replace(/\D/g,'').slice(0,11);loginCode=''" type="tel" inputmode="numeric" autocomplete="tel" maxlength="11" placeholder="11 位山西移动号码" :disabled="busy" autofocus/>
     <label for="login-code">登录验证码</label><div class="code-row"><input id="login-code" v-model="loginCode" @input="loginCode=loginCode.replace(/\D/g,'').slice(0,6)" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6 位数字" :disabled="busy"/><button type="button" class="button secondary" @click="sendLoginSms" :disabled="busy||loginCountdown>0||!/^1[3-9]\d{9}$/.test(loginPhone)||!loginAgreed">{{pending==='login-sms'?'发送中…':loginCountdown>0?`${loginCountdown} 秒后重发`:'获取验证码'}}</button></div>
     <p v-if="state.login" class="subtle">当前验证码对应 {{state.login.phone}}；更换号码后请重新获取。</p>
     <label class="consent"><input v-model="loginAgreed" type="checkbox" :disabled="busy"/><span>我已阅读并同意<a href="https://wap.sx.10086.cn/h/index.html#/xieyi" target="_blank" rel="noopener noreferrer">《山西移动服务协议》</a>和<a href="https://wap.sx.10086.cn/h/index.html#/yinsi" target="_blank" rel="noopener noreferrer">《山西移动隐私政策》</a></span></label>
     <button type="submit" class="button primary full" :disabled="busy||!loginAgreed||!state.login||sentPhone!==loginPhone||loginCode.length!==6"><LoaderCircle v-if="pending==='login-verify'" class="spin" :size="15"/>{{pending==='login-verify'?'登录中…':'登录'}}</button>
    </form>
    <div class="modal-footer"><button class="text-button" @click="openOfficialLogin" :disabled="busy"><ExternalLink :size="14"/>官方窗口登录</button><button class="button secondary" @click="sync" :disabled="busy">同步官方登录</button></div>
   </template>
   <template v-else-if="dialog==='order'">
    <div class="modal-header"><div><div class="eyebrow">确认办理</div><h2 id="dialog-title">{{product.name}}</h2></div><button class="icon-button" aria-label="关闭办理窗口" @click="closeDialog" :disabled="pending==='submit'"><X :size="20"/></button></div>
    <div class="modal-body"><dl class="confirm-terms"><div><dt>办理号码</dt><dd>{{account?.phone}}</dd></div><div><dt>业务资费</dt><dd class="green">0 元 · 免费办理</dd></div><div><dt>有效期限</dt><dd>{{product.term}}</dd></div></dl>
     <div v-if="error" class="feedback error" role="alert"><AlertCircle :size="16"/><span>{{error}}</span></div>
     <div v-if="!state.challenge?.verified" class="sms-box"><div class="section-bar"><h3>业务短信验证</h3><button class="text-button" @click="sendSms" :disabled="busy||countdown>0">{{pending==='sms'?'发送中…':countdown>0?`${countdown} 秒后重发`:state.challenge?'重新发送':'获取验证码'}}</button></div>
      <template v-if="state.challenge"><p v-if="state.challenge.sensitive" class="subtle">请填写短信中可输入的 6 位数字，固定位置已自动补齐。</p><p v-else class="subtle">请填写本次业务短信中的 6 位验证码。</p><div v-if="state.challenge.sensitive" class="fixed-digits" aria-label="验证码固定位置"><span v-for="n in 8" :key="n" :class="{fixed:state.challenge.fixed.some(f=>f.position===n)}">{{state.challenge.fixed.find(f=>f.position===n)?.value??'·'}}</span></div><label class="code-label" for="sms-code">业务验证码</label><div class="code-row"><input id="sms-code" ref="codeRef" v-model="code" @input="code=code.replace(/\D/g,'').slice(0,6)" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6 位数字" :disabled="busy"/><button class="button secondary" :disabled="busy||code.length!==6" @click="verify">{{pending==='verify'?'验证中…':'验证'}}</button></div></template>
      <p v-else class="subtle">点击“获取验证码”将向当前号码发送业务确认短信。</p>
     </div><div v-else class="verified"><CheckCircle2 :size="19"/>业务验证码已验证</div>
     <label class="consent"><input v-model="consent" type="checkbox"/><span>我已确认办理号码、0 元资费及使用条件，同意办理该权益。</span></label>
    </div><div class="modal-footer"><button class="button secondary" @click="closeDialog" :disabled="pending==='submit'">暂不办理</button><button class="button primary" @click="submit" :disabled="busy||!consent||!state.challenge?.verified"><LoaderCircle v-if="pending==='submit'" class="spin" :size="15"/>{{pending==='submit'?'等待官方结果…':'确认免费办理'}}</button></div>
   </template>
   <template v-else-if="dialog==='resolve'"><div class="modal-header"><h2 id="dialog-title">记录人工核查结果</h2><button class="icon-button" aria-label="关闭核查窗口" @click="closeDialog"><X :size="20"/></button></div><div class="modal-body"><p>当前办理结果尚未确定。请先通过官方已订业务、成功短信或 10086 核实。</p><p>解除后可以重新办理；如果原请求已生效，重新操作可能重复提交。</p><label class="consent"><input v-model="resConsent" type="checkbox"/><span>我已向官方核实，这笔办理未生效，需要解除重复提交拦截。</span></label><div v-if="error" class="feedback error" role="alert">{{error}}</div></div><div class="modal-footer"><button class="button secondary" @click="closeDialog">继续等待</button><button class="button primary" :disabled="busy||!resConsent" @click="resolve">记录核查结果</button></div></template>
  </dialog>
 </div>
</template>
