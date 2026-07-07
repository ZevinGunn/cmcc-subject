<template>
  <CryptoDebugPage v-if="view === 'debug'" @back="onDebugBack" />
  <LoginPage v-else-if="view === 'login'" :can-return="canReturnToBusiness" @back="onLoginBack" @logged-in="onLoggedIn" />
  <BusinessPage v-else @logout="onLogout" @login-new="onLoginNew" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LoginPage from './pages/LoginPage.vue'
import BusinessPage from './pages/BusinessPage.vue'
import CryptoDebugPage from './pages/CryptoDebugPage.vue'
import { api } from './api/client'
import { clearSession, sessionState, setSession } from './stores/session'

const booting = ref(Boolean(sessionState.sessionId))
const route = ref(readRoute())
const view = computed(() => {
  if (route.value.name === 'debug') return 'debug'
  return !booting.value && sessionState.sessionId && route.value.name === 'business' ? 'business' : 'login'
})
const canReturnToBusiness = computed(() => Boolean(sessionState.sessionId && route.value.name === 'login' && route.value.params.from === 'business'))

function readRoute() {
  const raw = window.location.hash.replace(/^#/, '') || ''
  const [path = '', query = ''] = raw.split('?')
  const params = Object.fromEntries(new URLSearchParams(query))
  const name = path.replace(/^\//, '') || ''
  return {
    name: name === 'business' ? 'business' : name.startsWith('debug') ? 'debug' : 'login',
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
  if (route.value.name === 'debug') return
  if (route.value.name === 'business' && !sessionState.sessionId) replaceRoute('/login')
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

onMounted(async () => {
  window.addEventListener('hashchange', syncRoute)
  if (!window.location.hash) replaceRoute(sessionState.sessionId ? '/business' : '/login')
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
    if (!['login', 'debug'].includes(route.value.name)) replaceRoute('/business')
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
