<template>
  <main class="shop-page">
    <header class="shop-header">
      <button type="button" title="返回" @click="$emit('back')"><ChevronLeft :size="20" /></button>
      <div>
        <h1>商城业务查询与退订</h1>
        <span>shop.10086.cn</span>
      </div>
      <button type="button" title="加解密调试" @click="$emit('open-debug')"><KeyRound :size="19" /></button>
    </header>

    <section class="shop-credentials-band">
      <form class="shop-credentials" @submit.prevent="queryBusiness">
        <label>
          <span>手机号</span>
          <input v-model.trim="phone" inputmode="numeric" maxlength="11" autocomplete="off" placeholder="11 位北京移动号码" />
        </label>
        <label class="shop-cookie-field">
          <span>商城 Cookie</span>
          <textarea v-model.trim="cookie" spellcheck="false" placeholder="粘贴 shop.10086.cn 请求中的 Cookie"></textarea>
        </label>
        <div class="shop-credential-actions">
          <label class="shop-remember"><input v-model="rememberForSession" type="checkbox" /> <span>本次标签页记住 Cookie</span></label>
          <button class="shop-query-btn" type="submit" :disabled="loading || !canQuery">
            <Search :size="18" /> {{ loading ? '查询中' : '查询业务' }}
          </button>
        </div>
      </form>
    </section>

    <section class="shop-workspace">
      <div class="shop-summary">
        <div><span>业务总数</span><strong>{{ allItems.length }}</strong></div>
        <div><span>可尝试退订</span><strong>{{ unsubscribableCount }}</strong></div>
        <div><span>查询时间</span><strong>{{ formattedQueriedAt || '--' }}</strong></div>
      </div>

      <div class="shop-filters">
        <nav aria-label="业务分类">
          <button type="button" :class="{ active: activeType === 'all' }" @click="activeType = 'all'">全部 <span>{{ allItems.length }}</span></button>
          <button v-for="group in groups" :key="group.prodType" type="button" :class="{ active: activeType === group.prodType }" @click="activeType = group.prodType">
            {{ group.label }} <span>{{ group.items.length }}</span>
          </button>
        </nav>
        <label class="shop-search"><Search :size="17" /><input v-model.trim="keyword" placeholder="业务名称或编码" /></label>
      </div>

      <div v-if="loading" class="shop-loading"><RefreshCw class="spinning" :size="24" /> 正在读取业务数据</div>
      <div v-else-if="!filteredItems.length" class="shop-empty"><Inbox :size="32" /><span>{{ groups.length ? '当前筛选无结果' : '暂无查询结果' }}</span></div>
      <div v-else class="shop-table-wrap">
        <table class="shop-table">
          <thead><tr><th>业务名称</th><th>分类</th><th>业务编码</th><th>订购 / 生效</th><th>失效时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td data-label="业务名称"><strong>{{ item.busiName || '--' }}</strong><small>{{ item.busiFee || '资费未返回' }}</small></td>
              <td data-label="分类"><span class="shop-category">{{ item.categoryLabel }}</span></td>
              <td data-label="业务编码"><code>{{ item.busiCode || '--' }}</code></td>
              <td data-label="订购 / 生效">{{ formatDate(item.orderedTime) }}<small>{{ formatDate(item.effectTime) }}</small></td>
              <td data-label="失效时间">{{ formatDate(item.extinctTime) }}</td>
              <td data-label="状态"><span :class="['shop-status', item.isOrdered === '01' ? 'locked' : 'open']">{{ originalStatus(item) }}</span></td>
              <td data-label="操作"><button class="shop-unsubscribe-btn" type="button" @click="openUnsubscribe(item)">尝试退订</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="pendingBusiness" class="shop-dialog-mask" @click.self="closeDialog">
      <div class="shop-dialog" role="dialog" aria-modal="true" aria-labelledby="shop-dialog-title">
        <header><div><span>业务退订</span><h2 id="shop-dialog-title">{{ pendingBusiness.busiName }}</h2></div><button type="button" title="关闭" @click="closeDialog"><X :size="20" /></button></header>
        <dl>
          <div><dt>业务编码</dt><dd>{{ pendingBusiness.busiCode }}</dd></div>
          <div><dt>业务分类</dt><dd>{{ pendingBusiness.categoryLabel }}</dd></div>
          <div><dt>生效时间</dt><dd>{{ formatDate(pendingBusiness.effectTime) }}</dd></div>
        </dl>
        <label class="shop-sms-field"><span>短信验证码</span><div><input v-model.trim="smsCode" inputmode="numeric" maxlength="6" placeholder="6 位验证码" /><button type="button" :disabled="sendingSms || countdown > 0" @click="sendSms">{{ countdown > 0 ? `${countdown}s` : sendingSms ? '发送中' : '发送验证码' }}</button></div></label>
        <label class="shop-confirm-check"><input v-model="confirmed" type="checkbox" /> <span>确认退订当前业务</span></label>
        <button class="shop-danger-btn" type="button" :disabled="unsubscribing || !confirmed || !/^\d{6}$/.test(smsCode)" @click="confirmUnsubscribe">
          <LoaderCircle v-if="unsubscribing" class="spinning" :size="18" />
          <Trash2 v-else :size="18" />
          {{ unsubscribing ? '提交中' : '确认退订' }}
        </button>
      </div>
    </section>

    <MessageDialog v-if="messageDialog" :title="messageDialog.title" :message="messageDialog.message" :type="messageDialog.type" @close="messageDialog = null" />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ChevronLeft, Inbox, KeyRound, LoaderCircle, RefreshCw, Search, Trash2, X } from 'lucide-vue-next'
import { api } from '../api/client'
import MessageDialog from '../components/MessageDialog.vue'

defineEmits(['back', 'open-debug'])

const phone = ref(sessionStorage.getItem('bmcc-shop-phone') || '')
const cookie = ref(sessionStorage.getItem('bmcc-shop-cookie') || '')
const rememberForSession = ref(Boolean(cookie.value))
const groups = ref([])
const queriedAt = ref('')
const activeType = ref('all')
const keyword = ref('')
const loading = ref(false)
const pendingBusiness = ref(null)
const smsCode = ref('')
const confirmed = ref(false)
const sendingSms = ref(false)
const unsubscribing = ref(false)
const countdown = ref(0)
const messageDialog = ref(null)
let timer = null

const canQuery = computed(() => /^1\d{10}$/.test(phone.value) && cookie.value.length > 10)
const allItems = computed(() => groups.value.flatMap((group) => group.items || []))
const unsubscribableCount = computed(() => allItems.value.filter((item) => item.canUnsubscribe).length)
const filteredItems = computed(() => {
  const source = activeType.value === 'all' ? allItems.value : groups.value.find((group) => group.prodType === activeType.value)?.items || []
  const needle = keyword.value.toLowerCase()
  return needle ? source.filter((item) => `${item.busiName} ${item.busiCode}`.toLowerCase().includes(needle)) : source
})
const formattedQueriedAt = computed(() => formatDateTime(queriedAt.value))

function credentials() {
  return { phone: phone.value, cookie: cookie.value }
}

function show(message, type = 'info', title = '提示') {
  messageDialog.value = { message, type, title }
}

async function queryBusiness(notify = false) {
  if (!canQuery.value) return show('请输入正确手机号和商城 Cookie', 'error', '参数有误')
  loading.value = true
  try {
    const data = await api.queryShopBusiness(credentials())
    groups.value = data.groups || []
    queriedAt.value = data.queriedAt || ''
    activeType.value = groups.value.some((group) => group.prodType === activeType.value) ? activeType.value : 'all'
    persistCredentials()
    if (notify) show(`已刷新 ${allItems.value.length} 项业务`, 'success', '查询完成')
  } catch (error) {
    show(error.message || '业务查询失败', 'error', '查询失败')
  } finally {
    loading.value = false
  }
}

function openUnsubscribe(item) {
  pendingBusiness.value = item
  smsCode.value = ''
  confirmed.value = false
  countdown.value = 0
  clearInterval(timer)
}

function closeDialog() {
  if (unsubscribing.value) return
  pendingBusiness.value = null
  clearInterval(timer)
}

function startCountdown() {
  countdown.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function sendSms() {
  sendingSms.value = true
  try {
    await api.sendShopUnsubscribeSms({ ...credentials(), business: pendingBusiness.value })
    startCountdown()
    show('退订验证码已发送', 'success', '发送成功')
  } catch (error) {
    show(error.message || '验证码发送失败', 'error', '发送失败')
  } finally {
    sendingSms.value = false
  }
}

async function confirmUnsubscribe() {
  unsubscribing.value = true
  try {
    const data = await api.unsubscribeShopBusiness({ ...credentials(), business: pendingBusiness.value, smsCode: smsCode.value })
    pendingBusiness.value = null
    clearInterval(timer)
    show(data.message || '退订成功', 'success', '退订成功')
    await queryBusiness()
  } catch (error) {
    show(error.message || '退订失败', 'error', '退订失败')
  } finally {
    unsubscribing.value = false
  }
}

function persistCredentials() {
  sessionStorage.setItem('bmcc-shop-phone', phone.value)
  if (rememberForSession.value) sessionStorage.setItem('bmcc-shop-cookie', cookie.value)
  else sessionStorage.removeItem('bmcc-shop-cookie')
}

function formatDate(value) {
  const raw = String(value || '')
  if (!raw) return '--'
  if (/^\d{8}$/.test(raw)) return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  return raw
}

function formatDateTime(value) {
  const raw = String(value || '')
  if (/^\d{14}$/.test(raw)) return `${raw.slice(4, 6)}-${raw.slice(6, 8)} ${raw.slice(8, 10)}:${raw.slice(10, 12)}`
  return raw
}

function originalStatus(item) {
  if (item.isOrdered === '01') return '已退订，可重试'
  if (item.isUnOrder === '01') return '原页面可退订'
  return '可尝试退订'
}

watch(rememberForSession, persistCredentials)
onBeforeUnmount(() => clearInterval(timer))
</script>
