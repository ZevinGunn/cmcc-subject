<template>
  <CryptoDebugPage v-if="view === 'debug'" @back="onDebugBack" />
  <ShopBusinessPage v-else-if="view === 'shop'" @back="onShopBack" @open-debug="pushRoute('/debug')" />
  <ActivityPage v-else-if="view === 'activity'" @back="onActivityBack" />
  <QuickOrderPage v-else-if="view === 'quick-order'" :initial-platform="route.params.platform || 'xyw'" @back="onQuickOrderBack" />
  <LoginPage v-else-if="view === 'login'" :can-return="canReturnToBusiness" @back="onLoginBack" @logged-in="onLoggedIn" @open-shop="pushRoute('/shop')" @open-debug="pushRoute('/debug')" @open-quick-order="pushRoute('/quick-order?platform=xyw')" />
  <BusinessPage v-else @logout="onLogout" @login-new="onLoginNew" @open-activities="onOpenActivities" @open-quick-order="pushRoute('/quick-order')" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LoginPage from './pages/LoginPage.vue'
import BusinessPage from './pages/BusinessPage.vue'
import CryptoDebugPage from './pages/CryptoDebugPage.vue'
import ActivityPage from './pages/ActivityPage.vue'
import ShopBusinessPage from './pages/ShopBusinessPage.vue'
import QuickOrderPage from './pages/QuickOrderPage.vue'
import { api } from './api/client'
import { clearSession, sessionState, setSession } from './stores/session'

const booting = ref(Boolean(sessionState.sessionId))
const route = ref(readRoute())
const view = computed(() => {
  if (route.value.name === 'debug') return 'debug'
  if (route.value.name === 'shop') return 'shop'
  if (route.value.name === 'activity' && sessionState.sessionId) return 'activity'
  if (route.value.name === 'quick-order') return 'quick-order'
  return !booting.value && sessionState.sessionId && route.value.name === 'business' ? 'business' : 'login'
})
const canReturnToBusiness = computed(() => Boolean(sessionState.sessionId && route.value.name === 'login' && route.value.params.from === 'business'))

function readRoute() {
  const raw = window.location.hash.replace(/^#/, '') || ''
  const [path = '', query = ''] = raw.split('?')
  const params = Object.fromEntries(new URLSearchParams(query))
  const name = path.replace(/^\//, '') || ''
  return {
    name: name === 'business' ? 'business' : name === 'activity' ? 'activity' : name === 'shop' ? 'shop' : name === 'quick-order' ? 'quick-order' : name.startsWith('debug') ? 'debug' : 'login',
    params,
  }
}

function replaceRoute(path) {
  if (window.location.hash === `#${path}`) {
    route.value = readRoute()
    return
  }
  window.location.replace(`#${path}`)
}

function pushRoute(path) {
  if (window.location.hash === `#${path}`) {
    route.value = readRoute()
    return
  }
  window.location.hash = path
}

function syncRoute() {
  route.value = readRoute()
  if (['debug', 'shop', 'quick-order'].includes(route.value.name)) return
  if (['business', 'activity'].includes(route.value.name) && !sessionState.sessionId) replaceRoute('/login')
}

function onLoggedIn(payload) {
  setSession({
    sessionId: payload.session?.id,
    phone: payload.phone,
    userInfo: payload.userInfo,
  })
  replaceRoute('/business')
}

function onLogout() {
  clearSession()
  replaceRoute('/login')
}

function onLoginNew() {
  pushRoute('/login?from=business')
}

function onLoginBack() {
  if (sessionState.sessionId) replaceRoute('/business')
}

function onDebugBack() {
  replaceRoute(sessionState.sessionId ? '/business' : '/login')
}

function onShopBack() {
  replaceRoute(sessionState.sessionId ? '/business' : '/login')
}

function onOpenActivities() {
  pushRoute('/activity')
}

function onActivityBack() {
  replaceRoute('/business')
}

function onQuickOrderBack() {
  replaceRoute(sessionState.sessionId ? '/business' : '/login')
}

onMounted(async () => {
  window.addEventListener('hashchange', syncRoute)
  if (!window.location.hash) replaceRoute(sessionState.sessionId ? '/business' : '/login')
  if (['debug', 'shop', 'quick-order'].includes(route.value.name)) {
    booting.value = false
    return
  }
  if (!sessionState.sessionId) {
    booting.value = false
    return
  }
  try {
    const data = await api.getSession(sessionState.sessionId)
    if (!data.session?.hasPortalToken) {
      clearSession()
      replaceRoute('/login')
      return
    }
    setSession({ userInfo: data.session.userInfo })
    if (!['login', 'debug', 'shop', 'activity', 'quick-order'].includes(route.value.name)) replaceRoute('/business')
  } catch {
    clearSession()
    replaceRoute('/login')
  } finally {
    booting.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute)
})
</script>
