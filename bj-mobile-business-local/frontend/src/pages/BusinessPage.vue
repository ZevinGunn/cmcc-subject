<template>
  <main class="business-page">
    <TopBar title="业务查询" @back="loadBusiness" @home="$emit('logout')" />
    <BusinessTabs v-model="activeTab" />

    <section class="month-filter">
      <label>
        <span>查询月份</span>
        <input v-model="selectedMonth" type="month" @change="loadBusiness" />
      </label>
      <button type="button" :disabled="loading" @click="resetMonth">本月</button>
    </section>

    <section class="status-line">
      <span>{{ userLabel }}</span>
      <div class="status-actions">
        <button type="button" :disabled="loading" @click="loadBusiness">
          {{ loading ? '刷新中' : '刷新' }}
        </button>
      </div>
    </section>

    <section class="waf-token-line">
      <input v-model.trim="wafToken" placeholder="XEbtxIBt 防护 token" />
      <button type="button" :disabled="savingWaf || !wafToken" @click="saveWafToken">
        {{ savingWaf ? '保存中' : '保存' }}
      </button>
    </section>

    <section v-if="loading && !items.length" class="empty">正在查询业务...</section>
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

    <ConfirmDialog
      v-if="pendingBusiness"
      :message="confirmMessage"
      :loading="unsubscribing"
      :needs-code="pendingNeedsCode"
      :initial-code="pendingInitialCode"
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
import { computed, onMounted, ref, watch } from 'vue'
import BusinessDetailDrawer from '../components/BusinessDetailDrawer.vue'
import BusinessItem from '../components/BusinessItem.vue'
import BusinessTabs from '../components/BusinessTabs.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import MessageDialog from '../components/MessageDialog.vue'
import TopBar from '../components/TopBar.vue'
import { api } from '../api/client'
import { clearSession, sessionState, setBusinessCache, setSession } from '../stores/session'

const emit = defineEmits(['logout'])

const activeTab = ref(sessionState.activeTab || 'valueAdded')
const categories = ref(sessionState.businessCache?.categories || { base: [], package: [], valueAdded: [] })
const selectedMonth = ref(sessionState.selectedMonth || currentMonth())
const loading = ref(false)
const unsubscribing = ref(false)
const savingWaf = ref(false)
const pendingBusiness = ref(null)
const detailItem = ref(null)
const wafToken = ref('')
const messageDialog = ref(null)

const items = computed(() => categories.value[activeTab.value] || [])
const userLabel = computed(() => {
  const mobile = sessionState.userInfo?.mobile || sessionState.phone || '未识别手机号'
  const brand = sessionState.userInfo?.brand ? ` · ${sessionState.userInfo.brand}` : ''
  return `${mobile}${brand}`
})
const pendingInitialCode = computed(() => businessCode(pendingBusiness.value))
const pendingNeedsCode = computed(() => Boolean(pendingBusiness.value && !pendingInitialCode.value))
const confirmMessage = computed(() => {
  const name = pendingBusiness.value?.name || '当前业务'
  return pendingNeedsCode.value
    ? `“${name}”缺少 ywCode/offerId，请输入 ywCode 后继续退订。`
    : `确定退订“${name}”？`
})

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function businessCode(item) {
  return String(item?.ywCode || item?.ywcode || item?.offerId || item?.offerid || item?.code || '').trim()
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

function resetMonth() {
  selectedMonth.value = currentMonth()
  loadBusiness()
}

function openConfirm(item) {
  pendingBusiness.value = item
}

function openDetail(item) {
  detailItem.value = item
}

async function saveWafToken() {
  if (!sessionState.sessionId || !wafToken.value) return
  savingWaf.value = true
  try {
    await api.setWafToken({ sessionId: sessionState.sessionId, wafToken: wafToken.value })
    showMessage('防护 token 已保存，将重新查询业务。', 'success', '保存成功')
    await loadBusiness()
  } catch (e) {
    showMessage(e.message, 'error', '保存失败')
  } finally {
    savingWaf.value = false
  }
}

async function confirmUnsubscribe(manualCode = '') {
  if (!pendingBusiness.value) return
  const code = businessCode(pendingBusiness.value) || String(manualCode || '').trim()
  if (!code) {
    showMessage('请输入 ywCode 后再退订。', 'error')
    return
  }
  const business = {
    ...pendingBusiness.value,
    ywCode: code,
    offerId: pendingBusiness.value.offerId || code,
    code,
  }
  unsubscribing.value = true
  try {
    const data = await api.unsubscribe({ sessionId: sessionState.sessionId, business })
    const result = data.result || {}
    const success = Boolean(result.success)
    const text = result.message || (success ? '退订成功' : '退订失败')
    persistCache(result)
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
  if (sessionState.lastResult?.message) {
    showMessage(
      sessionState.lastResult.message,
      sessionState.lastResult.success ? 'success' : 'error',
      sessionState.lastResult.success ? '退订成功' : '退订失败',
    )
  }
  loadBusiness()
})
</script>
