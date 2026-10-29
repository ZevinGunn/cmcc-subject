<template>
  <main class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand-block">
          <span class="brand-mark"><RadioTower :size="20" /></span>
          <div>
            <h1>北京移动页面快捷入口</h1>
            <p v-if="catalog.updatedAt">{{ routes.length }} 个页面 · 更新于 {{ formatDate(catalog.updatedAt) }}</p>
            <p v-else>业务与权益页面查询访问</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="wechat-button" type="button" @click="openWechatLogin">
            <LogIn :size="18" />
            <span>微信免登录入口</span>
          </button>
          <button class="icon-button" type="button" title="导入管理" aria-label="导入管理" @click="openAdmin">
            <Settings :size="19" />
          </button>
        </div>
      </div>
    </header>

    <nav class="catalog-nav" aria-label="页面类别">
      <div class="catalog-nav-inner">
        <button
          v-for="option in catalogOptions"
          :key="option.value"
          type="button"
          :class="{ active: catalogType === option.value }"
          @click="switchCatalog(option.value)"
        >
          <BriefcaseBusiness v-if="option.value === 'business'" :size="19" />
          <Gift v-else :size="19" />
          <span>{{ option.label }}</span>
          <strong>{{ option.count }}</strong>
        </button>
      </div>
    </nav>

    <section class="search-band">
      <div class="search-inner">
        <div class="search-box" :class="{ focused: searchFocused }">
          <Search :size="21" />
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            autocomplete="off"
            :placeholder="`搜索${catalogLabel}名称、页面 name 或路径`"
            aria-label="搜索页面"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            @keydown.down.prevent="moveSelection(1)"
            @keydown.up.prevent="moveSelection(-1)"
            @keydown.enter.prevent="openSelected"
          >
          <button v-if="query" class="clear-button" type="button" title="清空搜索" aria-label="清空搜索" @click="clearSearch">
            <X :size="18" />
          </button>
          <kbd class="search-shortcut">/</kbd>
        </div>
        <button class="locate-button" type="button" :disabled="!filteredRoutes.length" @click="locateSelected">
          <LocateFixed :size="18" />
          定位
        </button>
      </div>
    </section>

    <section class="content" aria-live="polite">
      <div v-if="loading" class="state-view">
        <LoaderCircle class="spin" :size="26" />
        <span>正在载入{{ catalogLabel }}目录</span>
      </div>
      <div v-else-if="loadError" class="state-view error-state">
        <CircleAlert :size="26" />
        <strong>{{ loadError }}</strong>
        <button type="button" @click="loadCatalog">重新载入</button>
      </div>
      <template v-else>
        <div class="toolbar">
          <div class="segments" :aria-label="`${catalogLabel}筛选`">
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              :class="{ active: filter === option.value }"
              @click="setFilter(option.value)"
            >
              {{ option.label }}
              <span>{{ option.count }}</span>
            </button>
          </div>
          <div class="toolbar-meta">
            <span v-if="query">找到 {{ filteredRoutes.length }} 个页面</span>
            <span v-else>共 {{ groups.length }} 个{{ catalogType === 'business' ? '业务' : '权益' }}分组</span>
            <button type="button" class="text-button" @click="toggleAllGroups">
              {{ allVisibleExpanded ? '收起分组' : '展开分组' }}
              <ChevronDown :size="16" :class="{ rotated: allVisibleExpanded }" />
            </button>
          </div>
        </div>

        <div v-if="!filteredRoutes.length" class="empty-state">
          <SearchX :size="38" />
          <h2>没有找到匹配页面</h2>
          <p>可尝试业务中文名、页面 name 或路径片段。</p>
          <button type="button" @click="resetFilters">清空筛选</button>
        </div>

        <div v-else class="group-list">
          <section v-for="group in visibleGroups" :key="group.key" class="route-group">
            <button class="group-heading" type="button" @click="toggleGroup(group.key)">
              <span class="group-title">
                <span v-for="(part, index) in highlight(group.label)" :key="index" :class="{ highlight: part.match }">{{ part.text }}</span>
              </span>
              <span class="group-count">{{ group.routes.length }} 个页面</span>
              <ChevronDown :size="18" :class="{ rotated: isExpanded(group.key) }" />
            </button>
            <div v-show="isExpanded(group.key)" class="route-list">
              <article
                v-for="route in group.routes"
                :id="`route-${route.id}`"
                :key="route.id"
                class="route-row"
                :class="{ selected: selectedRoute?.id === route.id }"
                @mouseenter="selectedId = route.id"
              >
                <button class="favorite-button" type="button" :title="isFavorite(route.id) ? '取消收藏' : '收藏'" @click="toggleFavorite(route.id)">
                  <Star :size="18" :fill="isFavorite(route.id) ? 'currentColor' : 'none'" />
                </button>
                <div class="route-main">
                  <div class="route-name-line">
                    <h2>
                      <span v-for="(part, index) in highlight(catalogType === 'rights' ? route.displayName : route.name || route.displayName)" :key="index" :class="{ highlight: part.match }">{{ part.text }}</span>
                    </h2>
                    <template v-if="catalogType === 'business'">
                      <span class="type-tag" :class="route.pageType">{{ pageTypeLabel(route.pageType) }}</span>
                      <span v-if="route.requireAuth" class="auth-tag"><LockKeyhole :size="12" />需登录</span>
                      <span v-else class="public-tag"><UnlockKeyhole :size="12" />直接访问</span>
                    </template>
                    <template v-else>
                      <span class="type-tag rights-category">{{ categoryLabel(route.category) }}</span>
                      <span v-if="route.internal" class="internal-tag"><Blocks :size="12" />内部模块</span>
                      <span v-else class="public-tag"><Gift :size="12" />权益页面</span>
                    </template>
                  </div>
                  <p
                    v-if="catalogType === 'rights' && route.title && route.name.replace(/^\/+|\/+$/g, '') !== route.path.replace(/^\/+|\/+$/g, '')"
                    class="route-page-name"
                  >{{ route.name }}</p>
                  <p class="route-path">
                    <span v-for="(part, index) in highlight(route.path)" :key="index" :class="{ highlight: part.match }">{{ part.text }}</span>
                  </p>
                  <p class="route-url">{{ route.url }}</p>
                </div>
                <div class="route-actions">
                  <button class="icon-button subtle" type="button" title="复制链接" aria-label="复制链接" @click="copyRoute(route)">
                    <Check v-if="copiedId === route.id" :size="18" />
                    <Copy v-else :size="18" />
                  </button>
                  <button class="open-button" type="button" @click="openRoute(route)">
                    打开
                    <ExternalLink :size="17" />
                  </button>
                </div>
              </article>
            </div>
          </section>
          <button v-if="visibleGroupLimit < groups.length" class="load-more" type="button" @click="visibleGroupLimit += 40">
            显示更多{{ catalogType === 'business' ? '业务' : '权益' }}
            <ChevronDown :size="18" />
          </button>
        </div>
      </template>
    </section>

    <Transition name="fade">
      <div v-if="adminOpen" class="modal-backdrop" @click.self="closeAdmin">
        <section class="admin-panel" role="dialog" aria-modal="true" aria-labelledby="admin-title">
          <header class="admin-header">
            <div>
              <p>ROUTE CATALOG</p>
              <h2 id="admin-title">{{ catalogLabel }}路由导入管理</h2>
            </div>
            <button class="icon-button" type="button" title="关闭" aria-label="关闭" @click="closeAdmin"><X :size="20" /></button>
          </header>

          <form v-if="!adminAuthenticated" class="admin-login" @submit.prevent="adminLogin">
            <KeyRound :size="28" />
            <h3>验证管理口令</h3>
            <p>使用项目管理后台的管理口令。</p>
            <label>
              <span>管理口令</span>
              <input v-model="adminPassword" type="password" autocomplete="current-password" autofocus>
            </label>
            <button type="submit" :disabled="adminBusy || !adminPassword">{{ adminBusy ? '验证中' : '进入管理' }}</button>
            <p v-if="adminError" class="form-error">{{ adminError }}</p>
          </form>

          <div v-else class="admin-content">
            <div class="import-actions">
              <label class="upload-button" :class="{ disabled: adminBusy }">
                <Upload :size="18" />
                上传新 JS
                <input type="file" accept=".js,text/javascript,application/javascript" :disabled="adminBusy" @change="uploadFile">
              </label>
              <button type="button" :disabled="adminBusy" @click="syncOfficial">
                <RefreshCw :size="18" :class="{ spin: adminBusy && adminAction === 'sync' }" />
                在线同步{{ catalogType === 'business' ? '业务主包' : '权益 umi.js' }}
              </button>
              <button class="secondary-button" type="button" :disabled="adminBusy || adminHistory.length < 2" @click="rollback">
                <Undo2 :size="18" />回滚上一版本
              </button>
              <button class="icon-button subtle admin-logout" type="button" title="退出管理" aria-label="退出管理" @click="adminLogout">
                <LogOut :size="18" />
              </button>
            </div>

            <div v-if="adminError" class="admin-notice error-notice"><CircleAlert :size="18" />{{ adminError }}</div>

            <section v-if="pendingImport" class="preview-section">
              <div class="section-heading">
                <div>
                  <span>待应用版本</span>
                  <h3>{{ pendingImport.source.name }}</h3>
                </div>
                <code>{{ pendingImport.sourceHash.slice(0, 12) }}</code>
              </div>
              <div class="diff-grid">
                <div><span>原始记录</span><strong>{{ pendingImport.stats.rawRoutes }}</strong></div>
                <div><span>逻辑路由</span><strong>{{ pendingImport.stats.logicalRoutes }}</strong></div>
                <div class="added"><span>新增</span><strong>+{{ pendingImport.diff.added.length }}</strong></div>
                <div class="updated"><span>变更</span><strong>{{ pendingImport.diff.updated.length }}</strong></div>
                <div class="removed"><span>下线</span><strong>-{{ pendingImport.diff.removed.length }}</strong></div>
                <div><span>未变化</span><strong>{{ pendingImport.diff.unchanged.length }}</strong></div>
              </div>
              <div class="preview-notes">
                <span>{{ pendingImport.stats.exactDuplicates }} 条完全重复</span>
                <span>{{ pendingImport.stats.pathConflicts }} 组同路径冲突</span>
                <span>{{ pendingImport.stats.emptyTitles }} 条空标题</span>
                <span v-if="catalogType === 'rights'">{{ pendingImport.stats.internalRoutes }} 条内部模块</span>
                <span v-if="pendingImport.duplicateOfImportId" class="warning-text">该文件此前已导入</span>
              </div>
              <div class="preview-actions">
                <button class="secondary-button" type="button" :disabled="adminBusy" @click="discardImport">放弃候选版本</button>
                <button class="apply-button" type="button" :disabled="adminBusy" @click="applyImport">
                  <DatabaseZap :size="18" />确认应用此版本
                </button>
              </div>
            </section>

            <section class="history-section">
              <div class="section-heading">
                <div><span>VERSION HISTORY</span><h3>导入记录</h3></div>
                <span>{{ adminHistory.length }} 个版本</span>
              </div>
              <div v-if="adminHistory.length" class="history-list">
                <div v-for="item in adminHistory" :key="item.id" class="history-row">
                  <GitCommitHorizontal :size="19" />
                  <div>
                    <strong>{{ item.source.name }}</strong>
                    <span>{{ formatDate(item.appliedAt) }} · {{ item.stats.logicalRoutes }} 条路由</span>
                  </div>
                  <span v-if="item.id === catalog.activeImportId" class="current-tag">当前</span>
                  <code v-else>{{ item.sourceHash.slice(0, 8) }}</code>
                </div>
              </div>
              <p v-else class="history-empty">尚无导入记录</p>
            </section>
          </div>
        </section>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toast" class="toast-message"><CheckCircle2 :size="18" />{{ toast }}</div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  Blocks, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, CircleAlert, Copy, DatabaseZap,
  ExternalLink, Gift, GitCommitHorizontal, KeyRound, LoaderCircle, LocateFixed, LockKeyhole,
  LogIn, LogOut, RadioTower, RefreshCw, Search, SearchX, Settings, Star, Undo2, UnlockKeyhole,
  Upload, X,
} from 'lucide-vue-next'
import { api } from './api'

const WECHAT_LOGIN_URL = 'http://serviceimg.bmcc.com.cn/nwx/weixin/home?state=6nckIbvkoi'
const emptyCatalog = (catalogType) => ({ catalogType, routes: [], updatedAt: '', activeImportId: '', summary: null })
const catalogType = ref('business')
const catalogs = ref({ business: emptyCatalog('business'), rights: emptyCatalog('rights') })
const catalog = computed(() => catalogs.value[catalogType.value])
const catalogLabel = computed(() => catalogType.value === 'rights' ? '权益' : '业务')
const loading = ref(true)
const loadError = ref('')
const query = ref('')
const filter = ref('all')
const searchFocused = ref(false)
const searchInput = ref(null)
const selectedId = ref('')
const expandedGroups = ref(new Set())
const visibleGroupLimit = ref(40)
const copiedId = ref('')
const toast = ref('')
const adminOpen = ref(false)
const adminAuthenticated = ref(false)
const adminPassword = ref('')
const adminBusy = ref(false)
const adminAction = ref('')
const adminError = ref('')
const adminHistory = ref([])
const pendingImport = ref(null)
let toastTimer

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const favoriteIds = ref(new Set(readArray('route-hub-favorites')))
const recentIds = ref(readArray('route-hub-recents'))
const routes = computed(() => catalog.value.routes || [])
const catalogOptions = computed(() => [
  { value: 'business', label: '业务', count: catalogs.value.business.routes.length },
  { value: 'rights', label: '权益', count: catalogs.value.rights.routes.length },
])

function searchable(route) {
  return `${route.title} ${route.displayName} ${route.name} ${(route.aliases || []).join(' ')} ${route.category || ''} ${route.path} ${route.url}`.toLocaleLowerCase('zh-CN')
}

const queryTokens = computed(() => query.value.trim().toLocaleLowerCase('zh-CN').split(/\s+/).filter(Boolean))
const filteredRoutes = computed(() => {
  const tokens = queryTokens.value
  const values = routes.value.filter((route) => {
    if (filter.value === 'auth' && !route.requireAuth) return false
    if (filter.value === 'public' && route.requireAuth) return false
    if (filter.value === 'rights-pages' && route.internal) return false
    if (filter.value === 'internal' && !route.internal) return false
    if (filter.value === 'activity' && (route.category !== 'activity' || route.internal)) return false
    if (filter.value === 'favorites' && !favoriteIds.value.has(route.id)) return false
    if (filter.value === 'recent' && !recentIds.value.includes(route.id)) return false
    const haystack = searchable(route)
    return tokens.every((token) => haystack.includes(token))
  })
  return values.sort((a, b) => {
    if (filter.value === 'recent') return recentIds.value.indexOf(a.id) - recentIds.value.indexOf(b.id)
    if (!tokens.length) return a.displayName.localeCompare(b.displayName, 'zh-CN') || a.path.localeCompare(b.path)
    const score = (route) => {
      const name = route.name.toLocaleLowerCase('zh-CN')
      const title = route.displayName.toLocaleLowerCase('zh-CN')
      const path = route.path.toLocaleLowerCase('zh-CN')
      const token = tokens[0]
      if ([name, title, path].includes(token)) return 0
      if (name.startsWith(token) || title.startsWith(token) || path.startsWith(token)) return 1
      return 2
    }
    return score(a) - score(b) || a.displayName.localeCompare(b.displayName, 'zh-CN')
  })
})

const groups = computed(() => {
  const map = new Map()
  for (const route of filteredRoutes.value) {
    const label = catalogType.value === 'rights'
      ? categoryLabel(route.category)
      : route.title || route.name || route.path
    const key = catalogType.value === 'rights'
      ? `category:${route.category}`
      : route.title ? `title:${route.title}` : `route:${route.id}`
    if (!map.has(key)) map.set(key, { key, label, routes: [] })
    map.get(key).routes.push(route)
  }
  return [...map.values()]
})

const visibleGroups = computed(() => groups.value.slice(0, query.value ? groups.value.length : visibleGroupLimit.value))
const selectedRoute = computed(() => filteredRoutes.value.find((route) => route.id === selectedId.value) || filteredRoutes.value[0] || null)
const allVisibleExpanded = computed(() => visibleGroups.value.length > 0 && visibleGroups.value.every((group) => isExpanded(group.key)))
const filterOptions = computed(() => {
  const currentIds = new Set(routes.value.map((route) => route.id))
  const common = [
    { value: 'favorites', label: '收藏', count: [...favoriteIds.value].filter((id) => currentIds.has(id)).length },
    { value: 'recent', label: '最近', count: recentIds.value.filter((id) => currentIds.has(id)).length },
  ]
  if (catalogType.value === 'rights') {
    return [
      { value: 'all', label: '全部', count: routes.value.length },
      { value: 'rights-pages', label: '权益页面', count: routes.value.filter((route) => !route.internal).length },
      { value: 'activity', label: '活动', count: routes.value.filter((route) => route.category === 'activity' && !route.internal).length },
      { value: 'internal', label: '内部模块', count: routes.value.filter((route) => route.internal).length },
      ...common,
    ]
  }
  return [
    { value: 'all', label: '全部', count: routes.value.length },
    { value: 'auth', label: '需登录', count: routes.value.filter((route) => route.requireAuth).length },
    { value: 'public', label: '直接访问', count: routes.value.filter((route) => !route.requireAuth).length },
    ...common,
  ]
})

function isExpanded(key) {
  return Boolean(query.value) || expandedGroups.value.has(key)
}

function toggleGroup(key) {
  const next = new Set(expandedGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedGroups.value = next
}

function toggleAllGroups() {
  if (allVisibleExpanded.value) expandedGroups.value = new Set()
  else expandedGroups.value = new Set(visibleGroups.value.map((group) => group.key))
}

function setFilter(value) {
  filter.value = value
  visibleGroupLimit.value = 40
  selectedId.value = ''
}

function switchCatalog(value) {
  if (value === catalogType.value) return
  catalogType.value = value
  query.value = ''
  filter.value = value === 'rights' ? 'rights-pages' : 'all'
  selectedId.value = ''
  visibleGroupLimit.value = 40
  pendingImport.value = null
  expandedGroups.value = new Set()
  nextTick(() => {
    const initialGroups = value === 'rights' ? groups.value : groups.value.slice(0, 8)
    expandedGroups.value = new Set(initialGroups.map((group) => group.key))
  })
  if (adminAuthenticated.value) loadAdminHistory().catch((error) => { adminError.value = error.message })
}

function clearSearch() {
  query.value = ''
  selectedId.value = ''
  searchInput.value?.focus()
}

function resetFilters() {
  query.value = ''
  filter.value = 'all'
}

function moveSelection(step) {
  const values = filteredRoutes.value
  if (!values.length) return
  const current = values.findIndex((route) => route.id === selectedRoute.value?.id)
  const index = (Math.max(current, 0) + step + values.length) % values.length
  selectedId.value = values[index].id
  locateSelected()
}

function locateSelected() {
  const route = selectedRoute.value
  if (!route) return
  selectedId.value = route.id
  const group = groups.value.find((item) => item.routes.some((value) => value.id === route.id))
  if (group) expandedGroups.value = new Set([...expandedGroups.value, group.key])
  nextTick(() => document.getElementById(`route-${route.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}

function openSelected() {
  if (selectedRoute.value) openRoute(selectedRoute.value)
}

function rememberRoute(route) {
  recentIds.value = [route.id, ...recentIds.value.filter((id) => id !== route.id)].slice(0, 20)
  localStorage.setItem('route-hub-recents', JSON.stringify(recentIds.value))
}

function openRoute(route) {
  rememberRoute(route)
  const mobile = matchMedia('(max-width: 760px)').matches || /MicroMessenger/i.test(navigator.userAgent)
  if (mobile) window.location.href = route.url
  else window.open(route.url, '_blank', 'noopener,noreferrer')
}

function openWechatLogin() {
  window.location.href = WECHAT_LOGIN_URL
}

function isFavorite(id) {
  return favoriteIds.value.has(id)
}

function toggleFavorite(id) {
  const next = new Set(favoriteIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  favoriteIds.value = next
  localStorage.setItem('route-hub-favorites', JSON.stringify([...next]))
}

async function copyRoute(route) {
  try {
    await navigator.clipboard.writeText(route.url)
    copiedId.value = route.id
    showToast('链接已复制')
    setTimeout(() => { if (copiedId.value === route.id) copiedId.value = '' }, 1600)
  } catch {
    showToast('浏览器未允许复制，请长按链接复制')
  }
}

function highlight(value) {
  const text = String(value || '')
  const tokens = queryTokens.value.filter((token) => token.length)
  if (!tokens.length) return [{ text, match: false }]
  const pattern = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const regex = new RegExp(`(${pattern})`, 'ig')
  return text.split(regex).filter(Boolean).map((part) => ({
    text: part,
    match: tokens.some((token) => part.toLocaleLowerCase('zh-CN') === token),
  }))
}

function pageTypeLabel(type) {
  return { main: '入口', success: '成功页', failure: '失败页', detail: '详情', list: '查询页' }[type] || '页面'
}

function categoryLabel(category) {
  return {
    activity: '活动权益',
    member: '会员权益',
    voucher: '卡券与订单',
    zone: '权益专区',
    other: '其他页面',
  }[category] || '其他页面'
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '-'
}

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2200)
}

async function loadCatalog(type = catalogType.value, showLoading = true) {
  const targetType = typeof type === 'string' ? type : catalogType.value
  if (showLoading) loading.value = true
  loadError.value = ''
  try {
    const data = await api.catalog(targetType)
    catalogs.value = { ...catalogs.value, [targetType]: data }
    if (targetType === catalogType.value) {
      const initialGroups = targetType === 'rights' ? groups.value : groups.value.slice(0, 8)
      expandedGroups.value = new Set(initialGroups.map((group) => group.key))
    }
  } catch (error) {
    loadError.value = error.message
  } finally {
    if (showLoading) loading.value = false
  }
}

async function loadCatalogs() {
  loading.value = true
  loadError.value = ''
  try {
    const [business, rights] = await Promise.all([api.catalog('business'), api.catalog('rights')])
    catalogs.value = { business, rights }
    expandedGroups.value = new Set(groups.value.slice(0, 8).map((group) => group.key))
  } catch (error) {
    loadError.value = error.message
  } finally {
    loading.value = false
  }
}

async function openAdmin() {
  adminOpen.value = true
  adminError.value = ''
  try {
    adminAuthenticated.value = (await api.adminSession()).authenticated
    if (adminAuthenticated.value) await loadAdminHistory()
  } catch (error) {
    adminError.value = error.message
  }
}

function closeAdmin() {
  if (!adminBusy.value) adminOpen.value = false
}

async function adminLogin() {
  adminBusy.value = true
  adminError.value = ''
  try {
    await api.login(adminPassword.value)
    adminAuthenticated.value = true
    adminPassword.value = ''
    await loadAdminHistory()
  } catch (error) {
    adminError.value = error.message
  } finally {
    adminBusy.value = false
  }
}

async function adminLogout() {
  await api.logout().catch(() => {})
  adminAuthenticated.value = false
  pendingImport.value = null
  adminHistory.value = []
}

async function loadAdminHistory() {
  adminHistory.value = await api.imports(catalogType.value)
}

async function runImport(action, runner) {
  adminBusy.value = true
  adminAction.value = action
  adminError.value = ''
  try {
    pendingImport.value = await runner()
  } catch (error) {
    if (error.status === 401) adminAuthenticated.value = false
    adminError.value = error.message
  } finally {
    adminBusy.value = false
    adminAction.value = ''
  }
}

function uploadFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  runImport('upload', () => api.upload(file, catalogType.value))
}

function syncOfficial() {
  runImport('sync', () => api.sync(catalogType.value))
}

async function applyImport() {
  if (!pendingImport.value) return
  adminBusy.value = true
  adminError.value = ''
  try {
    await api.apply(pendingImport.value.id)
    pendingImport.value = null
    await Promise.all([loadCatalog(catalogType.value, false), loadAdminHistory()])
    showToast('新路由版本已应用')
  } catch (error) {
    adminError.value = error.message
  } finally {
    adminBusy.value = false
  }
}

async function discardImport() {
  if (!pendingImport.value) return
  adminBusy.value = true
  adminError.value = ''
  try {
    await api.discard(pendingImport.value.id)
    pendingImport.value = null
    showToast('候选版本已放弃')
  } catch (error) {
    adminError.value = error.message
  } finally {
    adminBusy.value = false
  }
}

async function rollback() {
  if (!window.confirm('确认回滚到上一个路由版本？')) return
  adminBusy.value = true
  adminError.value = ''
  try {
    await api.rollback(catalogType.value)
    await Promise.all([loadCatalog(catalogType.value, false), loadAdminHistory()])
    showToast('已回滚到上一版本')
  } catch (error) {
    adminError.value = error.message
  } finally {
    adminBusy.value = false
  }
}

function globalKeydown(event) {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault()
    searchInput.value?.focus()
  }
  if (event.key === 'Escape' && adminOpen.value) closeAdmin()
}

onMounted(() => {
  loadCatalogs()
  window.addEventListener('keydown', globalKeydown)
})

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('keydown', globalKeydown)
})
</script>
