import { reactive } from 'vue'

const saved = JSON.parse(localStorage.getItem('bmcc-business-session') || '{}')
const savedBusiness = JSON.parse(localStorage.getItem('bmcc-business-cache') || '{}')

export const sessionState = reactive({
  sessionId: saved.sessionId || '',
  phone: saved.phone || '',
  userInfo: saved.userInfo || null,
  businessCache: savedBusiness.businessCache || null,
  activeTab: savedBusiness.activeTab || 'valueAdded',
  lastResult: savedBusiness.lastResult || null,
})

export function setSession({ sessionId, phone, userInfo }) {
  if (sessionId !== undefined) sessionState.sessionId = sessionId
  if (phone !== undefined) sessionState.phone = phone
  if (userInfo !== undefined) sessionState.userInfo = userInfo
  localStorage.setItem(
    'bmcc-business-session',
    JSON.stringify({
      sessionId: sessionState.sessionId,
      phone: sessionState.phone,
      userInfo: sessionState.userInfo,
    }),
  )
}

export function clearSession() {
  sessionState.sessionId = ''
  sessionState.phone = ''
  sessionState.userInfo = null
  sessionState.businessCache = null
  sessionState.activeTab = 'valueAdded'
  sessionState.lastResult = null
  localStorage.removeItem('bmcc-business-session')
  localStorage.removeItem('bmcc-business-cache')
}

export function setBusinessCache({ businessCache, activeTab, lastResult }) {
  if (businessCache !== undefined) sessionState.businessCache = businessCache
  if (activeTab !== undefined) sessionState.activeTab = activeTab
  if (lastResult !== undefined) sessionState.lastResult = lastResult
  localStorage.setItem(
    'bmcc-business-cache',
    JSON.stringify({
      businessCache: sessionState.businessCache,
      activeTab: sessionState.activeTab,
      lastResult: sessionState.lastResult,
    }),
  )
}
