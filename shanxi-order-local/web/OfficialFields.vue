<script setup>
import {computed} from 'vue';
const props=defineProps({data:Object});
const labels={PROD_CODE:'业务类型',PRC_ID:'产品编码',PROD_PRC_NAME:'业务名称',PRC_PRICE:'资费标准',OP_TIME:'订购时间',EFF_DATE:'生效时间',EXP_DATE:'到期时间',useProd:'当前使用',UnSubScribe:'官方退订标记',MEANS_NAME:'活动权益',ACT_NAME:'活动名称',FEE_SUM:'活动费用',OPER_DATE:'办理时间',OPER_NAME:'操作工号姓名',OPER_NO:'办理工号',prcId:'产品编码',prcName:'业务名称',status:'状态',effDate:'生效时间',expDate:'到期时间',prod_prcid:'退订产品编码',couponsBusiName:'页面业务名称'};
const fields=computed(()=>{const out=[];function walk(value,path=[]){if(value===null||value===undefined||value==='')return;if(typeof value==='object'){for(const [key,v]of Object.entries(value))walk(v,[...path,key]);return;}const key=path.at(-1);out.push({key,path:path.join('.'),label:labels[key]||key,value:String(value)});}walk(props.data);return out;});
</script>
<template><dl class="official-fields"><div v-for="f in fields" :key="f.path"><dt><span>{{f.label}}</span><code :title="f.path">{{f.key}}</code></dt><dd>{{f.value}}</dd></div></dl></template>
