import { reactive } from 'vue'

const saved = JSON.parse(localStorage.getItem('bmcc-business-session') || '{}')
const savedAccounts = JSON.parse(localStorage.getItem('bmcc-business-accounts') || '[]')
const legacyBusiness = JSON.parse(localStorage.getItem('bmcc-business-cache') || '{}')

function accountIdOf({ sessionId, phone, userInfo } = {}) {
  return userInfo?.mobile || phone || sessionId || ''
}

function normalizeAccount(account = {}) {
  return {
    id: account.id || accountIdOf(account),
    sessionId: account.sessionId || '',
    phone: account.phone || '',
    userInfo: account.userInfo || null,
    businessCache: account.businessCache || null,
    activeTab: account.activeTab || 'valueAdded',
    lastResult: account.lastResult || null,
    selectedMonth: account.selectedMonth || '',
    updatedAt: account.updatedAt || Date.now(),
  }
}

function readAccounts() {
  return savedAccounts.map(normalizeAccount).filter((item) => item.id)
}

let accounts = readAccounts()
const activeAccountId = saved.activeAccountId || accountIdOf(saved)
const activeAccount = accounts.find((item) => item.id === activeAccountId)
const initialBusiness = activeAccount?.businessCache ? activeAccount : legacyBusiness

export const sessionState = reactive({
  sessionId: activeAccount?.sessionId || saved.sessionId || '',
  phone: activeAccount?.phone || saved.phone || '',
  userInfo: activeAccount?.userInfo || saved.userInfo || null,
  businessCache: initialBusiness?.businessCache || null,
  activeTab: initialBusiness?.activeTab || 'valueAdded',
  lastResult: initialBusiness?.lastResult || null,
  selectedMonth: initialBusiness?.selectedMonth || '',
  accounts,
})

function persistAccounts() {
  localStorage.setItem('bmcc-business-accounts', JSON.stringify(sessionState.accounts))
}

function persistSession() {
  localStorage.setItem(
    'bmcc-business-session',
    JSON.stringify({
      sessionId: sessionState.sessionId,
      phone: sessionState.phone,
      userInfo: sessionState.userInfo,
      activeAccountId: currentAccountId(),
    }),
  )
}

function currentAccountId() {
  return accountIdOf(sessionState)
}

function upsertCurrentAccount() {
  const id = currentAccountId()
  if (!id) return
  const next = normalizeAccount({
    id,
    sessionId: sessionState.sessionId,
    phone: sessionState.phone,
    userInfo: sessionState.userInfo,
    businessCache: sessionState.businessCache,
    activeTab: sessionState.activeTab,
    lastResult: sessionState.lastResult,
    selectedMonth: sessionState.selectedMonth,
    updatedAt: Date.now(),
  })
  for (let i = sessionState.accounts.length - 1; i >= 0; i -= 1) {
    const item = sessionState.accounts[i]
    const sameSession = next.sessionId && item.sessionId === next.sessionId
    const samePhone = next.phone && item.phone === next.phone
    if (item.id !== id && (sameSession || samePhone)) sessionState.accounts.splice(i, 1)
  }
  const index = sessionState.accounts.findIndex((item) => item.id === id)
  if (index >= 0) {
    sessionState.accounts.splice(index, 1, next)
  } else {
    sessionState.accounts.unshift(next)
  }
  persistAccounts()
}

export function setSession({ sessionId, phone, userInfo }) {
  if (sessionId !== undefined) sessionState.sessionId = sessionId
  if (phone !== undefined) sessionState.phone = phone
  if (userInfo !== undefined) sessionState.userInfo = userInfo
  persistSession()
  upsertCurrentAccount()
}

export function clearSession() {
  sessionState.sessionId = ''
  sessionState.phone = ''
  sessionState.userInfo = null
  sessionState.businessCache = null
  sessionState.activeTab = 'valueAdded'
  sessionState.lastResult = null
  sessionState.selectedMonth = ''
  localStorage.removeItem('bmcc-business-session')
  localStorage.removeItem('bmcc-business-cache')
}

export function setBusinessCache({ businessCache, activeTab, lastResult, selectedMonth }) {
  if (businessCache !== undefined) sessionState.businessCache = businessCache
  if (activeTab !== undefined) sessionState.activeTab = activeTab
  if (lastResult !== undefined) sessionState.lastResult = lastResult
  if (selectedMonth !== undefined) sessionState.selectedMonth = selectedMonth
  localStorage.setItem(
    'bmcc-business-cache',
    JSON.stringify({
      businessCache: sessionState.businessCache,
      activeTab: sessionState.activeTab,
      lastResult: sessionState.lastResult,
      selectedMonth: sessionState.selectedMonth,
    }),
  )
  persistSession()
  upsertCurrentAccount()
}

export function clearCurrentBusinessCache() {
  sessionState.businessCache = null
  sessionState.lastResult = null
  setBusinessCache({
    businessCache: null,
    lastResult: null,
    activeTab: sessionState.activeTab,
    selectedMonth: sessionState.selectedMonth,
  })
}

export function switchAccount(accountId) {
  const account = sessionState.accounts.find((item) => item.id === accountId)
  if (!account) return false
  sessionState.sessionId = account.sessionId
  sessionState.phone = account.phone
  sessionState.userInfo = account.userInfo
  sessionState.businessCache = account.businessCache
  sessionState.activeTab = account.activeTab || 'valueAdded'
  sessionState.lastResult = account.lastResult || null
  sessionState.selectedMonth = account.selectedMonth || ''
  persistSession()
  return true
}
