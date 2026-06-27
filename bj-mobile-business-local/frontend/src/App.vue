<template>
  <LoginPage v-if="view === 'login'" @logged-in="onLoggedIn" />
  <BusinessPage v-else @logout="onLogout" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import LoginPage from './pages/LoginPage.vue'
import BusinessPage from './pages/BusinessPage.vue'
import { api } from './api/client'
import { clearSession, sessionState, setSession } from './stores/session'

const booting = ref(Boolean(sessionState.sessionId))
const screen = ref('login')
const view = computed(() => (!booting.value && sessionState.sessionId && screen.value === 'business' ? 'business' : 'login'))

function onLoggedIn(payload) {
  setSession({
    sessionId: payload.session?.id,
    phone: payload.phone,
    userInfo: payload.userInfo,
  })
  screen.value = 'business'
}

function onLogout() {
  clearSession()
  screen.value = 'login'
}

onMounted(async () => {
  if (!sessionState.sessionId) {
    booting.value = false
    return
  }
  try {
    const data = await api.getSession(sessionState.sessionId)
    if (!data.session?.hasPortalToken) {
      clearSession()
      screen.value = 'login'
      return
    }
    setSession({ userInfo: data.session.userInfo })
    screen.value = 'business'
  } catch {
    clearSession()
    screen.value = 'login'
  } finally {
    booting.value = false
  }
})
</script>
