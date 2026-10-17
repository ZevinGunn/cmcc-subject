<script setup>
import {ref} from 'vue';
import {UserPlus,RefreshCw,Check,Trash2} from 'lucide-vue-next';
defineProps({accounts:Array,activeId:String,busy:Boolean});
const emit=defineEmits(['select','rename','remove','login']);
const editing=ref(''),label=ref(''),removing=ref('');
const statuses={valid:'登录有效',cached:'缓存待校验',expired:'登录已过期',unavailable:'暂未确认登录',signed_out:'已退出登录'};
const date=v=>v?new Date(v).toLocaleString('zh-CN'):'尚未校验';
</script>
<template>
 <div class="page-heading"><div><h1>账号管理</h1><p>各账号独立登录，切换时校验缓存，无需重复收取验证码。</p></div><button class="button primary" :disabled="busy" @click="emit('login')"><UserPlus :size="16"/>添加账号</button></div>
 <div v-if="!accounts.length" class="empty-state"><UserPlus :size="28"/><h3>尚未保存账号</h3><p>登录成功后自动保存登录缓存。</p><button class="button primary" :disabled="busy" @click="emit('login')">验证码登录</button></div>
 <div v-else class="config-list account-list">
  <article v-for="a in accounts" :key="a.id" class="config-row">
   <div class="config-info"><h2>{{a.label||a.phone}} <span v-if="a.id===activeId" class="tag">当前账号</span></h2><p>{{a.label?a.phone+' · ':''}}{{statuses[a.status]||'待校验'}}</p><small class="subtle">上次校验：{{date(a.checkedAt)}}</small></div>
   <div class="actions"><button v-if="['expired','signed_out'].includes(a.status)" class="button secondary" :disabled="busy" @click="emit('login')">重新登录</button><button v-else class="button secondary" :disabled="busy" @click="emit('select',a.id)"><RefreshCw v-if="a.id===activeId" :size="14"/><Check v-else :size="14"/>{{a.id===activeId?'校验缓存':'切换账号'}}</button><button class="text-button" :disabled="busy" @click="editing=a.id;label=a.label||''">备注</button><button class="icon-button" :disabled="busy" @click="removing=a.id" :aria-label="'移除'+a.phone" title="移除账号与缓存"><Trash2 :size="16"/></button></div>
   <form v-if="editing===a.id" class="account-edit" @submit.prevent="emit('rename',a.id,label);editing=''"><label :for="'account-label-'+a.id">账号备注</label><input :id="'account-label-'+a.id" v-model="label" maxlength="40" placeholder="例如 工作号"/><button class="button secondary" :disabled="busy">保存备注</button><button type="button" class="text-button" @click="editing=''">取消</button></form>
   <div v-if="removing===a.id" class="delete-confirm"><span>移除 {{a.phone}} 及其登录缓存？办理记录会保留。</span><button class="text-button danger" :disabled="busy" @click="emit('remove',a.id);removing=''">确认移除</button><button class="text-button" @click="removing=''">取消</button></div>
  </article>
 </div>
 <p class="account-cache-note subtle">登录缓存加密保存。有效期由官方判定；网络异常时保留缓存供重试，确认失效后才需要重新登录。验证码不缓存。</p>
</template>
