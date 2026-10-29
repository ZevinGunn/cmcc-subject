<script setup>
import {ref,computed,nextTick} from 'vue';
import {Plus,Copy,Settings2,ArrowLeft,Check,Trash2} from 'lucide-vue-next';
const props=defineProps({configs:Array,selectedId:String,template:Object,busy:Boolean});
const emit=defineEmits(['save','select','delete']);
const draft=ref(null),queryJson=ref('{}'),orderJson=ref('{}'),requirements=ref(''),formError=ref(''),deleteId=ref('');
const nameRef=ref(null);
const smsFields=[['busiType','短信业务类型',true],['prcId','产品编码'],['busiId','业务编码'],['actId','活动编码'],['actType','活动类型'],['meansId','渠道手段编码'],['busiName','短信业务名称',true],['prodDesc','产品描述'],['effDate','生效说明'],['channelId','渠道标识',true],['sendType','发送类型',true],['businessCode','业务路由编码']];
async function edit(config,copy=false){draft.value=JSON.parse(JSON.stringify(config));if(copy){draft.value.id='';draft.value.revision=1;draft.value.name+='（副本）';}queryJson.value=JSON.stringify(config.queryParams,null,2);orderJson.value=JSON.stringify(config.orderParams,null,2);requirements.value=config.requirements.join('\n');formError.value='';deleteId.value='';await nextTick();nameRef.value?.focus();}
function create(){edit({...props.template,id:'',name:'',price:'资费待核实',term:'',description:'',requirements:[],queryMode:'none',queryPath:'',orderPath:'',couponsBusiName:'',sms:{...props.template.sms,busiType:'',busiName:'',prodDesc:'',prcId:''}});}
function save(attempt){formError.value='';try{const config={...draft.value,requirements:requirements.value.split('\n').map(x=>x.trim()).filter(Boolean),queryParams:JSON.parse(queryJson.value),orderParams:JSON.parse(orderJson.value)};emit('save',config,attempt,()=>{draft.value=null;});}catch{formError.value='查询参数和订购参数必须填写合法 JSON 对象。';}}
const preview=computed(()=>{try{return JSON.stringify({...JSON.parse(orderJson.value),couponsBusiName:draft.value?.couponsBusiName,busiType:draft.value?.sms.busiType,uuid:'〈当次短信验证凭据，自动填入〉'},null,2);}catch{return '请先修正订购 JSON 参数';}});
// Parent snapshots refresh independently; editing remains stable until explicitly saved.
defineExpose({edit,create});
</script>
<template>
 <template v-if="!draft">
  <div class="page-heading"><div><h1>业务配置</h1><p>保存不同业务的接口参数，选择后查询与办理。</p></div><button class="button primary" :disabled="busy" @click="create"><Plus :size="16"/>新增业务</button></div>
  <div class="config-list">
   <article v-for="c in configs" :key="c.id" class="config-row">
    <div class="config-info"><h2>{{c.name}} <span v-if="c.id===selectedId" class="tag">当前业务</span> <span v-if="c.status==='draft'" class="status warning">待补全</span></h2><p>{{c.price}} · {{c.sms.prcId||'未配置产品编码'}} · {{c.sms.busiType||'未配置短信类型'}}</p><code>{{c.orderPath?c.scope+' / '+c.orderPath:'订购接口待补全'}}</code><p v-if="c.status==='draft'">{{c.description}}</p></div>
    <div class="actions"><button class="button secondary" :disabled="busy||c.id===selectedId" @click="emit('select',c.id)"><Check :size="14"/>使用</button><button class="button secondary" :disabled="busy" @click="edit(c)"><Settings2 :size="14"/>修改</button><button class="icon-button" :disabled="busy" @click="edit(c,true)" :aria-label="'复制'+c.name" title="复制业务配置"><Copy :size="16"/></button><button class="icon-button" :disabled="busy||configs.length===1" @click="deleteId=c.id" :aria-label="'删除'+c.name" title="删除配置"><Trash2 :size="16"/></button></div>
    <div v-if="deleteId===c.id" class="delete-confirm"><span>删除“{{c.name}}”的配置？办理记录会保留。</span><button class="text-button danger" :disabled="busy" @click="emit('delete',c.id,c.revision);deleteId=''">确认删除</button><button class="text-button" @click="deleteId=''">取消</button></div>
   </article>
  </div>
 </template>
 <template v-else>
  <div class="page-heading"><div><button class="text-button" :disabled="busy" @click="draft=null"><ArrowLeft :size="14"/>返回配置列表</button><h1>{{draft.id?'修改业务配置':'新增业务配置'}}</h1></div><span class="subtle">{{draft.id?'版本 '+draft.revision:'保存后可选择办理'}}</span></div>
  <form class="config-form" @submit.prevent="save(false)">
   <fieldset :disabled="busy"><legend>配置状态</legend><label class="consent"><input type="checkbox" :checked="draft.status==='draft'" @change="draft.status=$event.target.checked?'draft':'ready'"/><span>配置待补全 · 仅保存，不启用查询与办理</span></label><p v-if="draft.status==='draft'" class="subtle">补齐目标业务的实际参数、资费与条件后，取消勾选并保存以启用。未知字段不使用其他业务的默认值。</p></fieldset>
   <fieldset :disabled="busy"><legend>业务信息</legend><div class="form-grid">
    <label>业务名称 *<input ref="nameRef" v-model="draft.name" required maxlength="100"/></label>
    <label>资费说明 *<input v-model="draft.price" required maxlength="100" placeholder="例如 10 元/月，以官方受理为准"/></label>
    <label>有效期<input v-model="draft.term" maxlength="200"/></label>
    <label>页面业务名称 · couponsBusiName *<input v-model="draft.couponsBusiName" required maxlength="100"/></label>
    <label class="wide">业务说明<input v-model="draft.description" maxlength="600"/></label>
    <label class="wide">使用条件 · 每行一项<textarea v-model="requirements" rows="3"/></label>
   </div></fieldset>
   <fieldset :disabled="busy"><legend>短信参数</legend><p class="subtle">* 为本地发码流程必填项。产品、活动等编码按目标业务的实际请求填写，空值不会自动推断。</p><div class="form-grid">
    <label v-for="[key,label,required] in smsFields" :key="key">{{label}} · {{key}}{{required?' *':''}}<input v-model="draft.sms[key]" :required="required&&draft.status!=='draft'" maxlength="200" :autocomplete="'off'"/></label>
   </div></fieldset>
   <fieldset :disabled="busy"><legend>订购与查询接口</legend><div class="form-grid">
    <label>接口入口<select v-model="draft.scope"><option value="act">act · 活动入口</option><option value="market">market · 营销入口</option></select></label>
    <label>订购相对路径 *<input v-model="draft.orderPath" :required="draft.status!=='draft'" placeholder="qqt5ga/submitPrcOrder" maxlength="160"/></label>
    <label>资格查询模式<select v-model="draft.queryMode"><option value="qqt5ga">原 5G-A 资格解释</option><option value="generic">通用查询 · 手动核对结果</option><option value="none">不查询 · 显式尝试办理</option></select></label>
    <label>查询相对路径<input v-model="draft.queryPath" :required="draft.queryMode!=='none'&&draft.status!=='draft'" placeholder="qqt5ga/qryUserQualification" maxlength="160"/></label>
    <label>订购额外参数 · JSON<textarea class="json-input" v-model="orderJson" rows="6" spellcheck="false"/></label>
    <label>查询参数 · JSON<textarea class="json-input" v-model="queryJson" rows="6" spellcheck="false"/></label>
   </div><p class="subtle">路径位于 /h/{入口}/rest/v1/ 下。uuid、验证码及敏感验证标记由当次流程提供；busiType 与短信业务类型保持一致。更换产品编码时，也需核对该产品的订购接口与必填参数。</p><details class="query-details"><summary>查看订购请求参数预览</summary><pre>{{preview}}</pre></details></fieldset>
   <div v-if="formError" class="feedback error" role="alert">{{formError}}</div>
   <div class="config-save"><span class="subtle">点击保存后生效。保存不会发送短信或提交订单。</span><div class="actions"><button type="submit" class="button secondary" :disabled="busy">保存配置</button><button type="button" class="button primary" :disabled="busy||draft.status==='draft'" @click="e=>{if(e.target.closest('form').reportValidity())save(true)}">保存并尝试订购</button></div></div>
  </form>
 </template>
</template>
