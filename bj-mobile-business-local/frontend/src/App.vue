<template>
  <LoginPage v-if="view === 'login'" :can-return="canReturnToBusiness" @back="onLoginBack" @logged-in="onLoggedIn" />
  <BusinessPage v-else @logout="onLogout" @login-new="onLoginNew" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LoginPage from './pages/LoginPage.vue'
import BusinessPage from './pages/BusinessPage.vue'
import { api } from './api/client'
import { clearSession, sessionState, setSession } from './stores/session'

const booting = ref(Boolean(sessionState.sessionId))
const route = ref(readRoute())
const view = computed(() => (!booting.value && sessionState.sessionId && route.value.name === 'business' ? 'business' : 'login'))
const canReturnToBusiness = computed(() => Boolean(sessionState.sessionId && route.value.name === 'login' && route.value.params.from === 'business'))

function readRoute() {
  const raw = window.location.hash.replace(/^#/, '') || ''
  const [path = '', query = ''] = raw.split('?')
  const params = Object.fromEntries(new URLSearchParams(query))
  const name = path.replace(/^\//, '') || ''
  return {
    name: name === 'business' ? 'business' : 'login',
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
    if (route.value.name !== 'login') replaceRoute('/business')
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
