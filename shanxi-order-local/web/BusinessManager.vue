<script setup>
import {computed,ref,watch,nextTick} from 'vue';
import {PackageSearch,RefreshCw,Search,X,LoaderCircle,AlertCircle} from 'lucide-vue-next';
import OfficialFields from './OfficialFields.vue';
const props=defineProps({state:Object,busy:Boolean,pending:String,error:String});
const emit=defineEmits(['query','login','action']);
const category=ref('all'),search=ref(''),dialog=ref(null),mode=ref(''),consent=ref(false);let trigger;
const categories=[['all','全部'],['plan','我的套餐'],['scheduled','待生效'],['activity','我的活动'],['value','增值业务'],['basic','基础功能'],['other','其他业务']];
const business=computed(()=>props.state.business);
const rows=computed(()=>{
 if(category.value==='activity')return (business.value?.activities||[]).filter(r=>JSON.stringify(r).toLowerCase().includes(search.value.trim().toLowerCase()));
 return (business.value?.items||[]).filter(r=>(category.value==='all'||r.category===category.value)&&JSON.stringify([r.name,r.code,r.price,r.sourceFields||r.fields]).toLowerCase().includes(search.value.trim().toLowerCase()));
});
const intent=computed(()=>props.state.unsubscribeIntent);
const count=c=>c==='activity'?business.value?.activities?.length||0:(business.value?.items||[]).filter(r=>c==='all'||r.category===c).length;
const categoryName=c=>categories.find(x=>x[0]===c)?.[1]||'业务信息';
const statuses={success:'退订已受理',failed:'退订失败',unknown:'结果待核查',submitting:'退订中',released:'已人工核实',held:'已核查'};
function blocking(row){return props.state.unsubscriptions?.find(r=>((r.productCode===row.code&&['submitting','unknown'].includes(r.status))||(r.fingerprint===row.id&&['success','held'].includes(r.status))));}
function action(path,body,done){emit('action',path,body,done);}
async function show(kind){mode.value=kind;consent.value=false;await nextTick();dialog.value.showModal();}
function close(){if(props.busy)return;dialog.value?.close();mode.value='';trigger?.focus();}
function prepare(row){trigger=document.activeElement;action('/unsubscribe/prepare',{id:row.id,queryId:business.value.queryId},()=>show('unsubscribe'));}
function detail(row){trigger=document.activeElement;action('/query/business/detail',{id:row.id,queryId:business.value.queryId},()=>show('detail'));}
function submit(){action('/unsubscribe/submit',{id:intent.value.id,confirmed:consent.value},()=>{dialog.value.close();mode.value='';trigger?.focus();});}
watch([()=>props.state.accountEpoch,()=>props.state.activeAccountId,()=>props.state.account?.phone],()=>{dialog.value?.close();mode.value='';search.value='';});
watch(()=>props.state.unsubscribeIntent?.id,(id,old)=>{if(mode.value==='unsubscribe'&&old&&id!==old){dialog.value?.close();mode.value='';}});
</script>
<template>
 <div class="page-heading"><div><div class="eyebrow">MY SERVICES</div><h1 tabindex="-1">已订业务</h1><p>查看完整业务字段，逐项核对并尝试退订。</p></div><button class="button primary" :disabled="busy||!state.account" @click="emit('query')"><RefreshCw :size="15" :class="{spin:pending==='business'}"/>{{business?'刷新业务':'查询业务'}}</button></div>
 <div class="list-toolbar"><div class="search-field"><Search :size="16"/><input v-model="search" placeholder="搜索业务名称、编码" aria-label="搜索业务"/></div><span class="subtle">{{business?'查询于 '+new Date(business.queriedAt).toLocaleString('zh-CN'):'尚未查询'}}</span></div>
 <div v-if="business" class="subscription-tabs" role="group" aria-label="业务分类"><button v-for="[key,label] in categories" :key="key" class="button" :class="category===key?'primary':'secondary'" :aria-pressed="category===key" @click="category=key">{{label}} <span>{{count(key)}}</span></button></div>
 <div v-if="business?.activityError" class="feedback warning" role="status">{{business.activityError}}<span v-if="business.activitiesAt">上次更新：{{new Date(business.activitiesAt).toLocaleString('zh-CN')}}</span></div>
 <div v-if="business?.refreshError" class="feedback warning" role="status">{{business.refreshError}}</div>
 <div v-if="pending==='business'" class="inline-empty" role="status"><LoaderCircle class="spin" :size="20"/>正在查询业务与活动记录，已有结果暂时保留。</div>
 <div v-if="!business" class="empty-state"><PackageSearch :size="30"/><h3>{{state.account?'查询当前号码的已订业务':'登录后查看已订业务'}}</h3><p>支持查询套餐、待生效业务、基础功能与增值业务。</p><button class="button secondary" :disabled="busy" @click="state.account?emit('query'):emit('login')">{{state.account?'开始查询':'验证码登录'}}</button></div>
 <div v-else-if="!rows.length" class="empty-state"><PackageSearch :size="30"/><h3>{{search?'没有匹配的业务':category==='activity'&&business.activityError?'活动记录暂不可用':'当前分类暂无业务'}}</h3><p>{{search?'试试其他名称或编码。':'查询结果与可退订范围以官方返回为准。'}}</p></div>
 <div v-else-if="category==='activity'" class="business-list"><article v-for="(row,i) in rows" :key="i"><h3>{{row.MEANS_NAME||row.ACT_NAME||'活动记录'}}</h3><OfficialFields :data="row"/></article></div>
 <div v-else class="business-list"><article v-for="(row,i) in rows" :key="row.id+'-'+i"><div class="business-title"><span class="table-icon"><PackageSearch :size="17"/></span><h3>{{row.name}}</h3><span class="subtle">{{categoryName(row.category)}}</span></div><OfficialFields :data="row.sourceFields||row.fields"/><div class="subscription-actions"><span class="subtle">{{blocking(row)?'已有退订记录：'+statuses[blocking(row).status]:row.reason}}</span><div class="actions"><button v-if="row.useProd&&['plan','scheduled'].includes(row.category)" class="button secondary" :disabled="busy" @click="detail(row)">套餐详情</button><button class="button secondary danger" :disabled="busy||!!blocking(row)" @click="prepare(row)" :aria-label="'退订'+row.name">尝试退订</button></div></div></article></div>
 <details v-if="business" class="raw-details"><summary>官方查询详情</summary><pre>{{JSON.stringify({business:business.data,activities:business.activities},null,2)}}</pre></details>
 <dialog ref="dialog" class="modal" aria-labelledby="subscription-dialog-title" @cancel.prevent="close" @click="e=>{if(e.target===dialog)close()}">
  <div class="modal-header"><h2 id="subscription-dialog-title">{{mode==='unsubscribe'?'确认退订业务':'套餐详情'}}</h2><button class="icon-button" aria-label="关闭退订窗口" :disabled="busy" @click="close"><X :size="20"/></button></div>
  <div class="modal-body">
   <template v-if="mode==='unsubscribe'&&intent"><dl class="content-meta"><div><dt>办理号码</dt><dd>{{state.account?.phone}}</dd></div><div><dt>退订业务</dt><dd>{{intent.name}}</dd></div><div><dt>业务编码</dt><dd>{{intent.code}}</dd></div><div><dt>资费标准</dt><dd>{{intent.price||'以官方为准'}}</dd></div></dl><div class="unsubscribe-request"><h3>退订请求参数</h3><p class="subtle">POST · prod/unSubScribeOrder</p><OfficialFields :data="intent.params"/><pre aria-label="完整退订参数">{{JSON.stringify(intent.params,null,2)}}</pre></div><p v-if="!intent.officialSupported" class="feedback warning">{{intent.notice}}</p><p>退订可能影响当前权益，生效时间和费用结算以官方受理结果为准。</p><label class="consent"><input v-model="consent" type="checkbox" :disabled="busy"/><span>我已核对号码和业务，确认退订该业务。</span></label></template>
   <template v-else-if="mode==='detail'"><h3>{{state.businessDetail?.name}}</h3><p class="subscription-description">{{state.businessDetail?.description||'官方未返回套餐说明'}}</p></template>
   <div v-if="error&&mode" class="feedback error" role="alert"><AlertCircle :size="16"/>{{error}}</div>
  </div>
  <div class="modal-footer"><button class="button secondary" :disabled="busy" @click="close">{{mode==='detail'?'关闭':'取消'}}</button><button v-if="mode==='unsubscribe'" class="button primary" :disabled="busy||!consent||!intent" @click="submit">{{busy?'正在处理…':'确认退订'}}</button></div>
 </dialog>
</template>
