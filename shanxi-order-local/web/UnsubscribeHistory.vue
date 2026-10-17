<script setup>
import {ref,nextTick,watch} from 'vue';
import {X} from 'lucide-vue-next';
const props=defineProps({state:Object,busy:Boolean,error:String});
const emit=defineEmits(['action']);
const dialog=ref(null),selected=ref(null),consent=ref(false);let trigger;
const statuses={success:'退订已受理',failed:'退订失败',unknown:'结果待核查',submitting:'退订中',released:'已人工核实',held:'已核查'};
async function prepare(row){trigger=document.activeElement;selected.value=row;consent.value=false;await nextTick();dialog.value.showModal();}
function close(){if(props.busy)return;dialog.value.close();trigger?.focus();}
function resolve(){emit('action','/unsubscribe/resolve',{id:selected.value.id,confirmed:consent.value},()=>{dialog.value.close();trigger?.focus();});}
watch(()=>props.state.accountEpoch,()=>dialog.value?.close());
</script>
<template>
 <section class="recent-section unsubscribe-history"><div class="section-bar"><h2>退订记录</h2><span class="subtle">{{state.unsubscriptions?.length||0}} 条</span></div><div v-if="!state.unsubscriptions?.length" class="inline-empty">暂无退订记录</div><div v-else class="history-list"><article v-for="r in state.unsubscriptions" :key="r.id"><div class="order-heading"><h3>{{r.name}}</h3><span class="status" :class="r.status==='success'?'success':r.status==='unknown'?'warning':'muted'">{{statuses[r.status]}}</span></div><div class="order-meta"><span>{{r.phone}}</span><span>{{r.productCode}}</span><time>{{new Date(r.createdAt).toLocaleString('zh-CN')}}</time></div><p>{{r.message}}</p><p v-if="r.code" class="subtle">官方结果码：{{r.code}}</p><details v-if="r.params" class="query-details"><summary>提交的退订参数</summary><pre>{{JSON.stringify(r.params,null,2)}}</pre></details><button v-if="r.status==='unknown'" class="text-button" :disabled="busy" @click="prepare(r)">已向官方核实退订未生效</button></article></div></section>
 <dialog ref="dialog" class="modal" aria-labelledby="resolve-unsubscribe-title" @cancel.prevent="close" @click="e=>{if(e.target===dialog)close()}"><div class="modal-header"><h2 id="resolve-unsubscribe-title">记录退订核查结果</h2><button class="icon-button" aria-label="关闭退订核查窗口" :disabled="busy" @click="close"><X :size="20"/></button></div><div class="modal-body"><p>{{selected?.name}} 的退订结果尚未确定，请先通过官方业务列表、短信或 10086 核实。</p><label class="consent"><input v-model="consent" type="checkbox" :disabled="busy"/><span>我已向官方核实本次退订未生效，确认解除重复提交拦截。</span></label><div v-if="error" class="feedback error" role="alert">{{error}}</div></div><div class="modal-footer"><button class="button secondary" :disabled="busy" @click="close">取消</button><button class="button primary" :disabled="busy||!consent" @click="resolve">记录核查结果</button></div></dialog>
</template>
