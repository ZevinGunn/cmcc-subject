<script setup>
import {computed,ref,onMounted,onUnmounted,nextTick} from 'vue';
import {Zap,LayoutDashboard,PackageSearch,History,ArrowUpRight,RefreshCw,Check,ChevronRight,Smartphone,LogOut,ShieldCheck,LoaderCircle,X,Info,Search,CheckCircle2,AlertCircle,ExternalLink,Download,ArrowLeft,Monitor,Settings2,Users,Braces} from 'lucide-vue-next';
import {api} from './api';
import ConfigManager from './ConfigManager.vue';
import AccountManager from './AccountManager.vue';
import CryptoTools from './CryptoTools.vue';
import BusinessManager from './BusinessManager.vue';
import AccountActionMenu from './AccountActionMenu.vue';
import UnsubscribeHistory from './UnsubscribeHistory.vue';
const publicMode=import.meta.env.SHANXI_PUBLIC===true;
const logoUrl=import.meta.env.BASE_URL+'shanxi-mobile-logo.png';
const activeSaved=computed(()=>state.value.accounts?.find(a=>a.id===state.value.activeAccountId));
async function switchAccount(id){await run('account-select',async()=>{assign(await api('/accounts/select',{id}));notice.value=account.value?'账号已切换，登录缓存已校验。':'此账号需重新登录。';});}
async function restoreAccount(){await run('account-restore',async()=>{assign(await api('/accounts/restore',{}));notice.value=account.value?'已恢复登录，无需验证码。':'缓存已失效，请重新登录。';});}
async function renameAccount(id,label){await run('account-rename',async()=>{assign(await api('/accounts/rename',{id,label}));notice.value='账号备注已保存。';});}
async function removeAccount(id){await run('account-remove',async()=>{assign(await api('/accounts/remove',{id,confirmed:true}));notice.value='账号与登录缓存已移除，办理记录仍保留。';});}
const configManager=ref(null);
const configContext=()=>({id:state.value.product.id,revision:state.value.configs.find(c=>c.id===state.value.selectedId)?.revision});
async function selectConfig(id){await run('config-select',async()=>{assign(await api('/config/select',{id}));notice.value='已切换业务，原验证码已失效。';});}
async function deleteConfig(id,revision){await run('config-delete',async()=>{assign(await api('/config/delete',{id,revision}));notice.value='业务配置已删除，办理记录仍保留。';});}
async function saveConfig(config,attempt,done){await run('config-save',async()=>{assign(await api('/config/save',config));done();notice.value='业务配置已保存。';if(attempt){tab.value='home';if(account.value)await openDialog(true);else{notice.value='业务已保存，请先登录后尝试订购。';await login();}}});}
async function editCurrent(){tab.value='config';await nextTick();configManager.value?.edit(state.value.configs.find(c=>c.id===state.value.selectedId));}
const state=ref({account:null,product:{requirements:[]},orders:[],challenge:null});
const tab=ref('accounts'),pending=ref(''),error=ref(''),notice=ref(''),search=ref(''),loaded=ref(false),loginOpened=ref(false);
const dialog=ref(null),code=ref(''),consent=ref(false),countdown=ref(0),resolution=ref(null),resConsent=ref(false);
const attemptAnyway=ref(false);
const orderChallenge=computed(()=>state.value.challenge?.attemptAnyway===attemptAnyway.value?state.value.challenge:null);
const loginPhone=ref(''),loginCode=ref(''),loginAgreed=ref(false),loginCountdown=ref(0),sentPhone=ref('');
const dialogRef=ref(null),codeRef=ref(null);let trigger=null,timer,poll;
const q=computed(()=>state.value.qualification);
const product=computed(()=>state.value.product);
const account=computed(()=>state.value.account);
const busy=computed(()=>!!pending.value||state.value.busy);
const blocked=computed(()=>state.value.orders.some(o=>o.product===product.value.orderKey&&['submitting','unknown','success','held'].includes(o.status)));
const unknown=computed(()=>state.value.orders.filter(o=>o.status==='unknown').length);
const accountRows=computed(()=>state.value.accounts|| (account.value?[{id:'current',phone:account.value.phone,status:'valid',profile:account.value.profile,checkedAt:account.value.syncedAt}]:[]));
const currentId=computed(()=>state.value.activeAccountId||accountRows.value[0]?.id);
async function accountNavigate(id,destination){await run('account-navigate',async()=>{if(state.value.accounts?.length&&(id!==state.value.activeAccountId||!account.value))assign(await api('/accounts/select',{id}));tab.value=destination;await nextTick();document.querySelector('main h1')?.focus();});}
const date=v=>v?new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
const statuses={success:['办理成功','success'],failed:['未办理成功','danger'],unknown:['结果待核查','warning'],submitting:['办理中','warning'],held:['已确认享有','success'],released:['已人工核实','muted']};
function assign(data){if('account' in data){if(dialog.value==='order'&&state.value.accountEpoch&&state.value.accountEpoch!==data.accountEpoch)closeDialog();if(dialog.value==='order'&&state.value.configs&&JSON.stringify(configContext())!==JSON.stringify({id:data.product.id,revision:data.configs?.find(c=>c.id===data.selectedId)?.revision}))closeDialog();if(state.value.challenge?.id!==data.challenge?.id){code.value='';consent.value=false;}state.value=data;countdown.value=data.cooldown||0;loginCountdown.value=data.loginCooldown||0;if(!data.account&&dialog.value&&dialog.value!=='login')closeDialog();}}
async function run(name,fn){if(pending.value)return;pending.value=name;error.value='';notice.value='';try{await fn();}catch(e){error.value=e.message;await refresh();if(['AUTH_EXPIRED','ACCOUNT_CHANGED','LOGIN_REQUIRED'].includes(e.code)){if(dialog.value)closeDialog();}}finally{pending.value='';if(name==='sms'){await nextTick();codeRef.value?.focus();}}}
async function refresh(){try{assign(await api('/state'));loaded.value=true;}catch(e){error.value=e.message;loaded.value=true;}}
async function login(){trigger=document.activeElement;dialog.value='login';error.value='';notice.value='';loginCode.value='';loginAgreed.value=false;await nextTick();dialogRef.value.showModal();}
async function openOfficialLogin(){await run('official-login',async()=>{await api('/login/open',{});loginOpened.value=true;notice.value='官方窗口已打开，完成登录后可同步账号。';});}
async function sendLoginSms(){await run('login-sms',async()=>{sentPhone.value=loginPhone.value;const result=await api('/login/sms',{phone:loginPhone.value,agreed:loginAgreed.value});assign(result);loginCode.value='';if(result.loginRestored){dialogRef.value?.close();dialog.value=null;trigger?.focus();notice.value='账号缓存仍有效，已直接恢复登录，未发送验证码。';}else notice.value='官方已受理登录短信请求，请以手机实际收到为准。';});}
async function verifyLogin(){await run('login-verify',async()=>{assign(await api('/login/verify',{id:state.value.login.id,code:loginCode.value,agreed:loginAgreed.value}));loginCode.value='';loginPhone.value='';sentPhone.value='';loginOpened.value=false;dialogRef.value?.close();dialog.value=null;trigger?.focus();notice.value='登录成功，可以查询业务。';});}
async function sync(){await run('sync',async()=>{assign(await api('/login/sync',{}));loginOpened.value=false;closeDialog();loginCode.value='';loginPhone.value='';notice.value='登录已同步，可以查询业务。';});}
async function query(kind){await run(kind,async()=>{assign(await api('/query/'+kind,{}));notice.value=kind==='business'?'已订业务已更新':'业务内容与资格已更新';});}
async function showOfficial(){await run('official',async()=>{await api('/official/open',{});});}
async function logout(){await run('logout',async()=>{assign(await api('/logout',{}));loginOpened.value=false;tab.value='accounts';notice.value='已退出当前账号并清除其登录缓存，其他账号不受影响';});}
async function openDialog(attempt=false){trigger=document.activeElement;attemptAnyway.value=attempt===true;dialog.value='order';error.value='';code.value='';consent.value=false;await nextTick();dialogRef.value.showModal();}
function closeDialog(){if(['submit','login-verify','login-sms'].includes(pending.value))return;dialogRef.value?.close();dialog.value=null;resolution.value=null;code.value='';loginCode.value='';trigger?.focus();}
async function sendSms(){await run('sms',async()=>{assign(await api('/order/sms',{attemptAnyway:attemptAnyway.value,config:configContext()}));code.value='';await nextTick();codeRef.value?.focus();notice.value='官方已受理业务短信请求，请以手机实际收到为准。';});}
async function verify(){await run('verify',async()=>{assign(await api('/order/verify',{id:orderChallenge.value.id,code:code.value}));code.value='';notice.value='验证码已验证，请确认办理';});}
async function submit(){await run('submit',async()=>{assign(await api('/order/submit',{id:orderChallenge.value.id,confirmed:consent.value}));dialogRef.value.close();dialog.value=null;tab.value='history';notice.value='办理结果已更新';});}
async function reconcile(order){await run('reconcile-'+order.id,async()=>{assign(await api('/orders/'+order.id+'/reconcile',{}));notice.value='已核查该订单绑定的业务配置，请查看记录中的核查结果。';});}
async function openResolve(order){trigger=document.activeElement;resolution.value=order;resConsent.value=false;dialog.value='resolve';await nextTick();dialogRef.value.showModal();}
async function resolve(){await run('resolve',async()=>{assign(await api('/orders/'+resolution.value.id+'/resolve',{confirmed:resConsent.value}));closeDialog();notice.value='已记录人工核查结果';});}
async function businessAction(path,body,done){await run('business-action',async()=>{assign(await api(path,body));await nextTick();await done?.();if(path==='/unsubscribe/submit'){tab.value='history';notice.value='退订结果已记录，请查看官方受理结果。';}});}
function download(){const data={orders:state.value.orders,unsubscriptions:state.value.unsubscriptions||[]};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='晋速办办理记录.json';a.click();URL.revokeObjectURL(url);}
onMounted(async()=>{await refresh();if(activeSaved.value?.status==='cached')await restoreAccount();timer=setInterval(()=>{if(countdown.value>0)countdown.value--;if(loginCountdown.value>0)loginCountdown.value--;},1000);poll=setInterval(()=>{if(!pending.value)refresh();},5000);});
onUnmounted(()=>{clearInterval(timer);clearInterval(poll);});
</script>
<template>
 <div class="shell">
  <header class="sidebar">
   <a class="brand" href="#" @click.prevent="tab='accounts'" aria-label="晋速办首页"><img class="brand-mark" :src="logoUrl" alt="山西移动" width="52" height="52"/><div><strong>晋速办</strong><small>山西移动业务办理</small></div></a>
   <nav aria-label="主导航">
    <button :class="{active:['accounts','home','business','history'].includes(tab)}" :aria-current="tab==='accounts'?'page':undefined" @click="tab='accounts'" aria-label="账号管理"><Users :size="17"/>号码管理</button>
    <button :class="{active:tab==='config'}" :aria-current="tab==='config'?'page':undefined" @click="tab='config'"><Settings2 :size="17"/>业务配置</button>
    <button :class="{active:tab==='crypto'}" :aria-current="tab==='crypto'?'page':undefined" @click="tab='crypto'"><Braces :size="17"/>加解密工具</button>
   </nav>
   <div class="account-panel">
    <a v-if="publicMode" class="icon-button" href="https://project.1008086.xyz/home" aria-label="项目维护" title="项目维护"><ArrowLeft :size="17"/></a>
    <button v-if="!publicMode" class="icon-button" @click="showOfficial" :disabled="busy" aria-label="官方窗口" title="打开官方窗口"><ExternalLink :size="17"/></button>
    <button v-if="!account&&!state.accounts?.length" class="button secondary" @click="login" :disabled="busy"><Smartphone :size="15"/>验证码登录</button>
   </div>
  </header>
  <div class="body">
   <main>
    <div v-if="!loaded" class="loading"><LoaderCircle class="spin" :size="20"/>正在连接服务</div>
    <template v-else>
     <div v-if="state.environment==='fixture'" class="feedback warning" role="status">离线验证环境 · 数据仅用于测试，不发送短信或办理真实业务。</div>
     <div v-if="error&&!dialog" class="feedback error" role="alert"><AlertCircle :size="17"/><span>{{error}}</span><button class="icon-button" aria-label="关闭错误提示" @click="error=''"><X :size="15"/></button></div>
     <div v-if="state.cacheError" class="feedback warning" role="status">{{state.cacheError}}</div>
     <div v-if="notice&&!dialog" class="feedback" role="status"><Info :size="17"/><span>{{notice}}</span><button class="icon-button" aria-label="关闭提示" @click="notice=''"><X :size="15"/></button></div>
     <section v-if="!account&&!['accounts','crypto'].includes(tab)" class="login-strip">
      <span class="strip-icon"><Smartphone :size="23"/></span><div><h2>{{activeSaved&&['cached','unavailable'].includes(activeSaved.status)?'恢复已缓存的登录':loginOpened?'在官方窗口完成登录':'登录山西移动账号'}}</h2><p>{{activeSaved&&['cached','unavailable'].includes(activeSaved.status)?'缓存已保留，请重试官方登录状态校验。':loginOpened?'完成官方登录后同步账号。':'查询号码资格，办理专属权益。'}}</p></div>
      <button v-if="activeSaved&&['cached','unavailable'].includes(activeSaved.status)" class="button primary" @click="restoreAccount" :disabled="busy"><RefreshCw :size="15"/>重试恢复</button><button v-else-if="loginOpened" class="button primary" @click="sync" :disabled="busy"><LoaderCircle v-if="pending==='sync'" class="spin" :size="15"/><RefreshCw v-else :size="15"/>同步登录</button><button v-else class="button primary" @click="login" :disabled="busy">验证码登录<ArrowUpRight :size="15"/></button>
     </section>
     <div v-if="['home','business','history'].includes(tab)" class="account-context"><button class="text-button" @click="tab='accounts'"><ArrowLeft :size="15"/>号码列表</button><span class="context-divider"/><div class="context-identity"><strong>{{activeSaved?.label||account?.phone||activeSaved?.phone||'未登录号码'}}</strong><span v-if="activeSaved?.label" class="subtle">{{account?.phone||activeSaved.phone}}</span></div><AccountActionMenu :phone="account?.phone||activeSaved?.phone||'当前号码'" :busy="busy" :can-logout="!!account" @navigate="accountNavigate(currentId,$event)" @logout="logout"/></div>
     <CryptoTools v-show="tab==='crypto'"/>
     <template v-if="tab==='home'">
      <div class="page-heading"><div><h1 tabindex="-1">业务办理</h1><p>查询当前号码资格，选择业务并确认办理。</p></div><button class="button secondary" @click="query('content')" :disabled="busy||!account||product.status==='draft'"><RefreshCw :size="15" :class="{spin:pending==='content'}"/>{{q?'刷新业务内容':'查询业务内容'}}</button></div>
      <div class="business-picker"><label for="selected-business">当前业务</label><select id="selected-business" :value="state.selectedId" :disabled="busy" @change="selectConfig($event.target.value)"><option v-for="c in state.configs" :key="c.id" :value="c.id">{{c.name}}{{c.status==='draft'?' · 待补全':''}}</option></select><button class="text-button" :disabled="busy" @click="editCurrent"><Settings2 :size="14"/>修改配置</button></div>
      <div class="service-layout">
       <article class="product-panel">
        <div class="product-top"><span class="product-symbol"><Zap :size="18"/>{{product.queryMode==='qqt5ga'?'5G-A 权益':'自定义业务'}}</span><span class="tag">山西移动</span></div>
        <h2>{{product.name}}</h2><p class="product-description">{{product.description}}</p>
        <div class="price-row"><strong>{{product.price}}</strong><span>配置资费，以官方受理为准</span></div>
        <dl class="terms"><div><dt>权益期限</dt><dd>{{product.term}}</dd></div><div><dt>生效时间</dt><dd>以开通成功短信为准</dd></div></dl>
        <div class="eligibility" :class="q?.state==='eligible'?'eligible':''"><span class="status-dot"/><div><strong>{{product.status==='draft'?'配置待补全':q?.label||(account?'待查询办理资格':'登录后查询资格')}}</strong><p>{{product.status==='draft'?'当前请求示例缺少完整参数，请补齐配置后再启用查询和办理。':q?.message||(account?'查询后可查看官方业务响应。':'登录不会自动订购任何业务。')}}</p></div></div>
        <button v-if="product.status==='draft'" class="button secondary full" :disabled="busy" @click="editCurrent">补全业务配置<ChevronRight :size="16"/></button>
        <button v-else-if="!account" class="button primary full" :disabled="busy" @click="login">登录后查询资格<ChevronRight :size="16"/></button>
        <button v-else-if="q?.state==='eligible'&&!blocked" class="button primary full" :disabled="busy" @click="openDialog(false)">办理此权益<ChevronRight :size="16"/></button>
        <button v-else-if="!q" class="button secondary full" :disabled="busy||!account" @click="query('content')">{{account?'查询办理资格':'请先登录'}}</button>
        <button v-else-if="blocked" class="button secondary full" @click="tab='history'">查看办理记录<ChevronRight :size="16"/></button>
        <button v-else-if="['included','ordered','unverified'].includes(q.state)" class="button secondary full" :disabled="busy||!account" @click="openDialog(true)">仍尝试办理<ChevronRight :size="16"/></button>
        <button v-else class="button secondary full" disabled>{{q.label}}</button>
       </article>
       <aside class="details-panel"><h3>业务信息</h3><dl class="content-meta"><div><dt>业务编码</dt><dd>{{product.code}}</dd></div><div><dt>查询时间</dt><dd>{{date(state.content?.queriedAt)}}</dd></div></dl><h3>使用条件</h3><ul class="requirements"><li v-for="item in product.requirements" :key="item"><Check :size="14"/><span>{{item}}</span></li></ul><details v-if="state.content" class="query-details"><summary>查看官方资格响应</summary><pre>{{JSON.stringify(state.content.data,null,2)}}</pre></details><div class="detail-bottom"><ShieldCheck :size="16"/><span>短信验证 · 手动确认办理</span></div></aside>
      </div>
      <section class="recent-section"><div class="section-bar"><h2>最近办理</h2><button class="text-button" @click="tab='history'">全部记录<ChevronRight :size="14"/></button></div><div v-if="!state.orders.length" class="inline-empty"><History :size="20"/><span>暂无办理记录</span><span class="subtle">完成办理后，结果会自动保存。</span></div><div v-else v-for="o in state.orders.slice(0,3)" :key="o.id" class="recent-row"><strong>{{o.name}}</strong><span>{{o.phone}}</span><span class="status" :class="statuses[o.status][1]">{{statuses[o.status][0]}}</span><time>{{date(o.createdAt)}}</time></div></section>
     </template>
     <template v-else-if="tab==='business'"><BusinessManager :state="state" :busy="busy" :pending="pending" :error="error" @query="query('business')" @login="login" @action="businessAction"/></template>
     <template v-else-if="tab==='accounts'"><AccountManager :accounts="accountRows" :active-id="currentId" :busy="busy" @login="login" @select="switchAccount" @rename="renameAccount" @remove="removeAccount" @navigate="accountNavigate" @logout="logout"/></template>
     <template v-else-if="tab==='config'"><ConfigManager ref="configManager" :configs="state.configs" :selected-id="state.selectedId" :template="state.configTemplate" :busy="busy" @save="saveConfig" @select="selectConfig" @delete="deleteConfig"/></template>
     <template v-else-if="tab!=='crypto'">
      <div class="page-heading"><div><div class="eyebrow">ORDER HISTORY</div><h1>办理记录</h1><p>当前账号在此工作台发起的办理，不代表全部历史订单。</p></div><button class="button secondary" @click="download" :disabled="!state.orders.length&&!state.unsubscriptions?.length"><Download :size="15"/>导出记录</button></div>
      <div v-if="unknown" class="feedback warning"><AlertCircle :size="18"/><span>{{unknown}} 笔办理结果待核查。请先确认权益状态，避免重复办理。</span></div>
      <div v-if="!state.orders.length" class="empty-state"><History :size="30"/><h3>暂无办理记录</h3><p>当前号码在此工作台尚无订购记录。</p><button class="button secondary" @click="tab='home'">前往业务办理<ChevronRight :size="15"/></button></div>
      <div v-else class="history-list"><article v-for="o in state.orders" :key="o.id"><div class="order-heading"><h3>{{o.name}}</h3><span class="status" :class="statuses[o.status][1]">{{statuses[o.status][0]}}</span></div><div class="order-meta"><span>{{o.phone}}</span><span>{{o.price}}</span><time>{{date(o.createdAt)}}</time></div><p>{{o.message}}</p><p v-if="o.checkedAt" class="subtle">核查于 {{date(o.checkedAt)}} · {{o.checkMessage}}</p><div class="order-bottom"><span class="subtle">本地记录号 {{o.id.slice(0,8)}}</span><div v-if="['unknown','success','held'].includes(o.status)" class="actions"><button class="text-button" :disabled="busy" @click="reconcile(o)"><RefreshCw :size="13"/>核查权益</button><button v-if="o.status==='unknown'" class="text-button muted" :disabled="busy" @click="openResolve(o)">人工核实未生效</button></div></div></article></div>
      <UnsubscribeHistory :state="state" :busy="busy" :error="error" @action="businessAction"/>
     </template>
     <footer><span><span class="live-dot"/>晋速办 · {{publicMode?'公网工作台':'仅在本机运行'}}</span><span>业务与资费以中国移动官方结果为准</span></footer>
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
    <div v-if="!publicMode" class="modal-footer"><button class="text-button" @click="openOfficialLogin" :disabled="busy"><ExternalLink :size="14"/>官方窗口登录</button><button class="button secondary" @click="sync" :disabled="busy">同步官方登录</button></div>
   </template>
   <template v-else-if="dialog==='order'">
    <div class="modal-header"><div><div class="eyebrow">{{attemptAnyway?'尝试办理':'确认办理'}}</div><h2 id="dialog-title">{{product.name}}</h2></div><button class="icon-button" aria-label="关闭办理窗口" @click="closeDialog" :disabled="pending==='submit'"><X :size="20"/></button></div>
    <div class="modal-body"><dl class="confirm-terms"><div><dt>办理号码</dt><dd>{{account?.phone}}</dd></div><div><dt>业务资费</dt><dd>{{product.price}}</dd></div><div><dt>有效期限</dt><dd>{{product.term}}</dd></div></dl>
     <div v-if="error" class="feedback error" role="alert"><AlertCircle :size="16"/><span>{{error}}</span></div>
     <p v-if="attemptAnyway" class="subtle" role="status">官方提示：{{q?.message||'当前业务资格尚未确认。'}} 你仍可尝试提交，是否受理由官方决定。</p>
     <div v-if="!orderChallenge?.verified" class="sms-box"><div class="section-bar"><h3>业务短信验证</h3><button class="text-button" @click="sendSms" :disabled="busy||countdown>0">{{pending==='sms'?'发送中…':countdown>0?`${countdown} 秒后重发`:orderChallenge?'重新发送':'获取验证码'}}</button></div>
      <template v-if="orderChallenge"><p v-if="orderChallenge.sensitive" class="subtle">请填写短信中可输入的 6 位数字，固定位置已自动补齐。</p><p v-else class="subtle">请填写本次业务短信中的 6 位验证码。</p><div v-if="orderChallenge.sensitive" class="fixed-digits" aria-label="验证码固定位置"><span v-for="n in 8" :key="n" :class="{fixed:orderChallenge.fixed.some(f=>f.position===n)}">{{orderChallenge.fixed.find(f=>f.position===n)?.value??'·'}}</span></div><label class="code-label" for="sms-code">业务验证码</label><div class="code-row"><input id="sms-code" ref="codeRef" v-model="code" @input="code=code.replace(/\D/g,'').slice(0,6)" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6 位数字" :disabled="busy"/><button class="button secondary" :disabled="busy||code.length!==6" @click="verify">{{pending==='verify'?'验证中…':'验证'}}</button></div></template>
      <p v-else class="subtle">点击“获取验证码”将向当前号码发送业务确认短信。</p>
     </div><div v-else class="verified"><CheckCircle2 :size="19"/>业务验证码已验证</div>
     <label class="consent"><input v-model="consent" type="checkbox"/><span>{{attemptAnyway?'我已知晓官方提示，仍尝试办理。':''}}我已确认办理号码、{{product.price}}资费及使用条件，实际受理与费用以官方为准，同意办理此业务。</span></label>
    </div><div class="modal-footer"><button class="button secondary" @click="closeDialog" :disabled="pending==='submit'">暂不办理</button><button class="button primary" @click="submit" :disabled="busy||!consent||!orderChallenge?.verified"><LoaderCircle v-if="pending==='submit'" class="spin" :size="15"/>{{pending==='submit'?'等待官方结果…':attemptAnyway?'确认尝试办理':product.price==='0 元'?'确认免费办理':'确认办理'}}</button></div>
   </template>
   <template v-else-if="dialog==='resolve'"><div class="modal-header"><h2 id="dialog-title">记录人工核查结果</h2><button class="icon-button" aria-label="关闭核查窗口" @click="closeDialog"><X :size="20"/></button></div><div class="modal-body"><p>当前办理结果尚未确定。请先通过官方已订业务、成功短信或 10086 核实。</p><p>解除后可以重新办理；如果原请求已生效，重新操作可能重复提交。</p><label class="consent"><input v-model="resConsent" type="checkbox"/><span>我已向官方核实，这笔办理未生效，需要解除重复提交拦截。</span></label><div v-if="error" class="feedback error" role="alert">{{error}}</div></div><div class="modal-footer"><button class="button secondary" @click="closeDialog">继续等待</button><button class="button primary" :disabled="busy||!resConsent" @click="resolve">记录核查结果</button></div></template>
  </dialog>
 </div>
</template>
