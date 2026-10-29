<template>
  <main class="business-page">
    <section class="business-hero">
      <div class="hero-actions">
        <button type="button" @click="$emit('open-quick-order')">
          <ShoppingCart :size="16" />
          快捷订购
        </button>
        <button type="button" @click="$emit('open-activities')">
          <TicketCheck :size="16" />
          活动办理
        </button>
        <button type="button" @click="showAccountPanel = true">切换账号</button>
        <button type="button" @click="clearCache">清缓存</button>
      </div>
      <h1>已订业务</h1>
      <strong>{{ maskedMobile }}</strong>
      <span class="brand-pill">{{ brandLabel }}</span>
      <button class="query-btn" type="button" :disabled="loading" @click="loadBusiness">
        <Search :size="22" stroke-width="2.6" />
        {{ loading ? '查询中' : '查询' }}
      </button>
    </section>

    <section class="business-shell">
      <div class="business-sticky-controls">
        <nav class="month-strip" aria-label="查询月份">
          <button
            v-for="item in recentMonths"
            :key="item.value"
            class="month-chip"
            :class="{ active: selectedMonth === item.value }"
            type="button"
            @click="selectMonth(item.value)"
          >
            <strong>{{ item.month }}月</strong>
            <span>{{ item.year }}</span>
          </button>
          <button class="month-calendar" type="button" aria-label="展开月份筛选" @click="monthPanelOpen = !monthPanelOpen">
            <CalendarDays :size="28" stroke-width="2.2" />
          </button>
        </nav>

        <section v-if="monthPanelOpen" class="month-panel">
          <button
            v-for="item in pickerMonths"
            :key="item.value"
            class="month-option"
            :class="{ active: selectedMonth === item.value }"
            type="button"
            @click="selectMonth(item.value)"
          >
            <strong>{{ item.month }}月</strong>
            <span>{{ item.year }}年</span>
          </button>
        </section>

        <BusinessTabs v-model="activeTab" />
      </div>

      <section v-if="loading" class="skeleton-list" aria-label="正在加载业务列表">
        <article v-for="item in 3" :key="item" class="skeleton-card">
          <span class="sk-line sk-title"></span>
          <span class="sk-line sk-mid"></span>
          <span class="sk-line sk-long"></span>
          <span class="sk-line sk-mid"></span>
          <div class="sk-actions">
            <span></span>
            <span></span>
          </div>
        </article>
      </section>
      <section v-else-if="!items.length" class="empty">当前分类暂无业务</section>
      <section v-else class="business-list">
        <BusinessItem
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :index="index"
          @unsubscribe="openConfirm"
          @detail="openDetail"
        />
      </section>
    </section>

    <section v-if="showAccountPanel" class="account-mask" @click.self="showAccountPanel = false">
      <div class="account-panel">
        <header>
          <h2>切换账号</h2>
          <button type="button" @click="showAccountPanel = false">关闭</button>
        </header>
        <button
          v-for="account in sessionState.accounts"
          :key="account.id"
          class="account-row"
          :class="{ active: account.id === activeAccountId }"
          type="button"
          @click="chooseAccount(account.id)"
        >
          <strong>{{ formatAccountPhone(account) }}</strong>
          <span>{{ account.userInfo?.brand || '账号缓存' }}</span>
        </button>
        <button class="account-new" type="button" @click="$emit('login-new')">登录新账号</button>
      </div>
    </section>

    <ConfirmDialog
      v-if="pendingBusiness"
      :message="confirmMessage"
      :loading="unsubscribing"
      :initial-parameters="pendingParameters"
      @cancel="pendingBusiness = null"
      @confirm="confirmUnsubscribe"
    />

    <BusinessDetailDrawer v-if="detailItem" :item="detailItem" @close="detailItem = null" />

    <MessageDialog
      v-if="messageDialog"
      :title="messageDialog.title"
      :message="messageDialog.message"
      :type="messageDialog.type"
      @close="messageDialog = null"
    />
  </main>
</template>

<script setup>
import { CalendarDays, Search, ShoppingCart, TicketCheck } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import BusinessDetailDrawer from '../components/BusinessDetailDrawer.vue'
import BusinessItem from '../components/BusinessItem.vue'
import BusinessTabs from '../components/BusinessTabs.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import MessageDialog from '../components/MessageDialog.vue'
import { api } from '../api/client'
import {
  clearCurrentBusinessCache,
  clearSession,
  sessionState,
  setBusinessCache,
  setSession,
  switchAccount,
} from '../stores/session'

const emit = defineEmits(['logout', 'login-new', 'open-activities', 'open-quick-order'])

const activeTab = ref(sessionState.activeTab || 'valueAdded')
const categories = ref(sessionState.businessCache?.categories || { base: [], package: [], valueAdded: [] })
const selectedMonth = ref(sessionState.selectedMonth || currentMonth())
const loading = ref(false)
const unsubscribing = ref(false)
const pendingBusiness = ref(null)
const detailItem = ref(null)
const messageDialog = ref(null)
const monthPanelOpen = ref(false)
const showAccountPanel = ref(false)

const items = computed(() => categories.value[activeTab.value] || [])
const activeAccountId = computed(() => sessionState.userInfo?.mobile || sessionState.phone || sessionState.sessionId || '')
const maskedMobile = computed(() => maskMobile(sessionState.userInfo?.mobile || sessionState.phone || '未识别手机号'))
const brandLabel = computed(() => sessionState.userInfo?.brand || '北京移动')
const recentMonths = computed(() => buildMonths(5))
const pickerMonths = computed(() => buildMonths(13))
const pendingParameters = computed(() => ({
  phoneNum: String(sessionState.userInfo?.mobile || sessionState.phone || '').trim(),
  brand: String(sessionState.userInfo?.brand || '').trim(),
  field1: businessCode(pendingBusiness.value),
}))
const confirmMessage = computed(() => {
  const name = pendingBusiness.value?.name || '当前业务'
  return `请确认“${name}”本次退订提交的接口参数。`
})

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function buildMonths(count) {
  const [year, month] = currentMonth().split('-').map(Number)
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, month - 1 - index, 1)
    const itemYear = date.getFullYear()
    const itemMonth = date.getMonth() + 1
    return {
      year: itemYear,
      month: itemMonth,
      value: `${itemYear}-${String(itemMonth).padStart(2, '0')}`,
    }
  })
}

function maskMobile(value) {
  return String(value || '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

function formatAccountPhone(account) {
  return maskMobile(account.userInfo?.mobile || account.phone || account.sessionId)
}

function businessCode(item) {
  return String(item?.unsubscribeCode || item?.ywCode || item?.ywcode || item?.offerId || item?.offerid || item?.code || '').trim()
}

function showMessage(message, type = 'info', title = '提示') {
  messageDialog.value = { message, type, title }
}

function persistCache(lastResult) {
  setBusinessCache({
    businessCache: { categories: categories.value, cachedAt: Date.now() },
    activeTab: activeTab.value,
    selectedMonth: selectedMonth.value,
    ...(lastResult !== undefined ? { lastResult } : {}),
  })
}

async function loadBusiness() {
  if (!sessionState.sessionId) return
  loading.value = true
  try {
    const data = await api.queryBusiness({
      sessionId: sessionState.sessionId,
      bgnMonth: selectedMonth.value,
      endMonth: selectedMonth.value,
    })
    categories.value = data.business.categories
    if (data.session?.userInfo) setSession({ userInfo: data.session.userInfo })
    persistCache()
  } catch (e) {
    if (['SESSION_NOT_FOUND', 'NOT_LOGGED_IN'].includes(e.payload?.errorCode)) {
      clearSession()
      emit('logout')
      return
    }
    showMessage(e.message, 'error', '查询失败')
  } finally {
    loading.value = false
  }
}

function selectMonth(month) {
  selectedMonth.value = month
  monthPanelOpen.value = false
  loadBusiness()
}

function clearCache() {
  categories.value = { base: [], package: [], valueAdded: [] }
  clearCurrentBusinessCache()
  showMessage('当前账号本地缓存已清除。', 'success', '已清缓存')
}

function chooseAccount(accountId) {
  if (!switchAccount(accountId)) return
  activeTab.value = sessionState.activeTab || 'valueAdded'
  selectedMonth.value = sessionState.selectedMonth || currentMonth()
  categories.value = sessionState.businessCache?.categories || { base: [], package: [], valueAdded: [] }
  showAccountPanel.value = false
  loadBusiness()
}

function openConfirm(item) {
  pendingBusiness.value = item
}

function openDetail(item) {
  detailItem.value = item
}

async function confirmUnsubscribe(parameters = {}) {
  if (!pendingBusiness.value) return
  const phoneNum = String(parameters.phoneNum || '').trim()
  const brand = String(parameters.brand || '').trim()
  const field1 = String(parameters.field1 || '').trim()
  if (!phoneNum || !brand || !field1) {
    showMessage('phoneNum、brand 和 field1 均不能为空。', 'error')
    return
  }
  const business = {
    ...pendingBusiness.value,
    phoneNum,
    brand,
    field1,
    unsubscribeCode: field1,
    code: field1,
  }
  unsubscribing.value = true
  try {
    const data = await api.unsubscribe({ sessionId: sessionState.sessionId, business })
    const result = data.result || {}
    const success = Boolean(result.success)
    const text = result.message || (success ? '退订成功' : '退订失败')
    persistCache()
    pendingBusiness.value = null
    showMessage(text, success ? 'success' : 'error', success ? '退订成功' : '退订失败')
    await loadBusiness()
  } catch (e) {
    showMessage(e.message, 'error', '退订失败')
  } finally {
    unsubscribing.value = false
  }
}

watch(activeTab, () => persistCache())
watch(selectedMonth, () => persistCache())

onMounted(() => {
  loadBusiness()
})
</script>
