<script setup>
import {ref,nextTick,onBeforeUnmount,watch} from 'vue';
import {Ellipsis,PackageSearch,Zap,History,LogOut} from 'lucide-vue-next';
const props=defineProps({phone:String,busy:Boolean,canLogout:Boolean});
const emit=defineEmits(['navigate','logout']);
const open=ref(false),trigger=ref(null),menu=ref(null),position=ref({});
function close(restore=true){open.value=false;if(restore)trigger.value?.focus();}
function place(){if(!open.value||!trigger.value||!menu.value)return;const r=trigger.value.getBoundingClientRect(),width=Math.min(280,innerWidth-16),height=Math.min(menu.value.scrollHeight,innerHeight-16);const below=innerHeight-r.bottom-8;position.value={width:width+'px',left:Math.max(8,Math.min(r.right-width,innerWidth-width-8))+'px',top:Math.max(8,below>=height?r.bottom+6:r.top-height-6)+'px',maxHeight:(innerHeight-16)+'px'};}
async function toggle(){if(open.value){close();return;}open.value=true;await nextTick();place();menu.value?.querySelector('button:not(:disabled)')?.focus({preventScroll:true});}
function choose(value){close();emit('navigate',value);}
function keyboard(e){if(e.key==='Escape'){e.preventDefault();close();return;}if(e.key==='Tab'){close(false);return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const items=[...menu.value.querySelectorAll('button:not(:disabled)')],i=items.indexOf(document.activeElement);items[e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();}
const dismiss=e=>{if(!menu.value?.contains(e.target))place();};
watch(()=>props.busy,b=>{if(b)close(false);});
window.addEventListener('resize',dismiss);window.addEventListener('scroll',dismiss,true);
onBeforeUnmount(()=>{window.removeEventListener('resize',dismiss);window.removeEventListener('scroll',dismiss,true);});
</script>
<template>
 <button ref="trigger" class="button secondary account-menu-trigger" :disabled="busy" :aria-label="phone+'功能菜单'" aria-haspopup="menu" :aria-expanded="open" @click="toggle"><Ellipsis :size="18"/>功能菜单</button>
 <Teleport to="body"><template v-if="open"><div class="account-menu-backdrop" @pointerdown.prevent="close()"/><div ref="menu" class="account-action-menu" role="menu" :aria-label="phone+'功能菜单'" :style="position" @keydown="keyboard"><div class="menu-identity">{{phone}}</div><button role="menuitem" @click="choose('home')"><Zap :size="16"/>业务办理</button><button role="menuitem" @click="choose('business')"><PackageSearch :size="16"/>已订业务</button><button role="menuitem" @click="choose('history')"><History :size="16"/>办理记录</button><button v-if="canLogout" role="menuitem" class="danger menu-logout" @click="close();emit('logout')"><LogOut :size="16"/>退出登录</button></div></template></Teleport>
</template>
