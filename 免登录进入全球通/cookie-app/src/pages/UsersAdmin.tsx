import BrandLogo from '@/components/BrandLogo'
import YunpanJumpActions from '@/components/YunpanJumpActions'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  ExternalLink,
  Loader2,
  PackagePlus,
  RefreshCcw,
  Settings,
  Shield,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SsoNavigationDialog from '@/components/SsoNavigationDialog'
import CallbackAppointmentDialog, { type CallbackAccount } from '@/components/CallbackAppointmentDialog'

type ApiOk<T> = { ok: true; data: T; message?: string; requestId?: string }
type ApiErr = { ok: false; message: string; errorCode?: string; requestId?: string }
type ApiResp<T> = ApiOk<T> | ApiErr

type ManagedUser = {
  id: string
  username: string
  displayName?: string
  permissions?: {
    businessQuery?: boolean
    shopQuery?: boolean
    businessOrder?: boolean
    businessIdOverride?: boolean
    benefitActivity?: boolean
  }
  disabledAt?: string
  disabledReason?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  accountCount?: number
  inviteCount?: number
  usedInviteCodes?: string[]
}

type UserDetail = {
  user: ManagedUser
  accounts: {
    id: string
    label?: string
    phone?: string
    displayPhone?: string
    hasCookie: boolean
    hasYunpanSession?: boolean
    qqtAccessToken?: string
    yunpanSessionUpdatedAt?: string
    disabledAt?: string
    disabledReason?: string
    updatedAt: string
  }[]
  linkedInvites: {
    inviteCode: string
    url: string
    accountCount: number
    status: 'active' | 'disabled'
    usedAt?: string
    disabledAt?: string
    createdAt: string
    updatedAt: string
  }[]
}

type AuthPolicy = {
  usernameAllowlist: string[]
  usernameBlocklist: string[]
  defaultResetPassword: string
}

type AccountSummary = {
  id: string
  label?: string
  phone?: string
  phoneMasked: string
  displayPhone?: string
  hasCookie: boolean
  hasYunpanSession?: boolean
  qqtAccessToken?: string
  hasCmccAppCookie?: boolean
  cmccAppCookieUpdatedAt?: string
  hasWedRechargeCookie?: boolean
  wedRechargeCookieUpdatedAt?: string
  disabledAt?: string
}

type YunpanSsoLinkResult = {
  ssoUrl: string
  ssoToken: string
}

type AigouSsoLinkResult = {
  ssoUrl: string
}

type CocPackageTarget = 'building_bricks' | 'diamond_package' | 'age_feed' | 'smart_life' | 'five_ga'

type WorkerResult = {
  id: string
  ok: boolean
  message?: string
  errorCode?: string
  status?: string | number
}

type QqtTokenExport = {
  exportedAt: string
  total: number
  skipped: number
  skipReasons: Record<string, number>
  tokens: {
    accountId: string
    phone?: string
    phoneMasked: string
    displayPhone?: string
    accessToken: string
  }[]
}

type TokenRefreshProgress = {
  running: boolean
  total: number
  done: number
  success: number
  failed: number
  current?: string
  message: string
  results: WorkerResult[]
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { ...init, credentials: 'same-origin' })
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResp<T>> {
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return (await res.json()) as ApiResp<T>
}

async function copyText(text: string): Promise<void> {
  if (!text) return
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d)
}

export default function UsersAdmin({ embedded = false }: { embedded?: boolean }) {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [callbackAccount, setCallbackAccount] = useState<CallbackAccount | null>(null)
  const [policy, setPolicy] = useState<AuthPolicy>({
    usernameAllowlist: [],
    usernameBlocklist: [],
    defaultResetPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [detail, setDetail] = useState<UserDetail | null>(null)
  const [allowText, setAllowText] = useState('')
  const [blockText, setBlockText] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [usernameDraft, setUsernameDraft] = useState('')
  const [reasonDraft, setReasonDraft] = useState('')
  const [showDisabledOnly, setShowDisabledOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [tokenProgress, setTokenProgress] = useState<TokenRefreshProgress | null>(null)
  const [exportedTokens, setExportedTokens] = useState<QqtTokenExport | null>(null)
  const [copyingTokens, setCopyingTokens] = useState(false)
  const [bindAccountText, setBindAccountText] = useState('')
  const [bindingAccount, setBindingAccount] = useState(false)
  const [generatingSsoLinkId, setGeneratingSsoLinkId] = useState<string | null>(null)
  const [yunpanSsoLinks, setYunpanSsoLinks] = useState<Record<string, string>>({})
  const [pendingSso, setPendingSso] = useState<{ url: string; destination: string } | null>(null)
  const [showUserSettings, setShowUserSettings] = useState(false)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showTokenTools, setShowTokenTools] = useState(false)
  const [showPolicySettings, setShowPolicySettings] = useState(false)

  async function refreshAll() {
    setLoading(true)
    setError(null)
    try {
      const [usersRes, policyRes] = await Promise.all([
        apiFetch('/api/auth/admin/users'),
        apiFetch('/api/auth/admin/policy'),
      ])
      const usersJson = (await usersRes.json()) as ApiResp<{ users: ManagedUser[] }>
      const policyJson = (await policyRes.json()) as ApiResp<{ policy: AuthPolicy }>
      if (!usersJson.ok) throw new Error(usersJson.message || '加载用户失败')
      if (!policyJson.ok) throw new Error(policyJson.message || '加载策略失败')
      setUsers(usersJson.data.users)
      setPolicy(policyJson.data.policy)
      setAllowText(policyJson.data.policy.usernameAllowlist.join('\n'))
      setBlockText(policyJson.data.policy.usernameBlocklist.join('\n'))
      setResetPassword(policyJson.data.policy.defaultResetPassword)
      if (!selectedUserId && usersJson.data.users.length > 0) {
        setSelectedUserId(usersJson.data.users[0].id)
      }
      return usersJson.data.users
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
      return []
    } finally {
      setLoading(false)
    }
  }

  async function loadDetail(userId: string) {
    setSelectedUserId(userId)
    setError(null)
    try {
      const res = await apiFetch(`/api/auth/admin/users/${userId}/accounts`)
      const data = (await res.json()) as ApiResp<UserDetail>
      if (!data.ok) throw new Error(data.message || '加载详情失败')
      setDetail(data.data)
      setUsernameDraft(data.data.user.username)
      setReasonDraft(data.data.user.disabledReason || '')
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载详情失败')
    }
  }

  async function openUserDetail(userId: string) {
    setShowUserDetail(true)
    await loadDetail(userId)
  }

  async function savePolicy() {
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ policy: AuthPolicy }>('/api/auth/admin/policy', {
        usernameAllowlist: allowText.split(/\s+/).map((x) => x.trim()).filter(Boolean),
        usernameBlocklist: blockText.split(/\s+/).map((x) => x.trim()).filter(Boolean),
        defaultResetPassword: resetPassword.trim(),
      })
      if (!r.ok) throw new Error(r.message || '保存失败')
      setPolicy(r.data.policy)
      setSuccess('注册策略已保存')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
    }
  }

  async function resetUserPassword() {
    if (!selectedUserId) return
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ password: string }>(
        `/api/auth/admin/users/${selectedUserId}/reset-password`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '重置失败')
      setSuccess(`已重置为 ${r.data.password}`)
      setResetPassword(r.data.password)
    } catch (e) {
      setError(e instanceof Error ? e.message : '重置失败')
    }
  }

  async function changeUsername() {
    if (!selectedUserId || !usernameDraft.trim()) return
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${selectedUserId}/username`,
        { username: usernameDraft },
      )
      if (!r.ok) throw new Error(r.message || '修改失败')
      setSuccess('用户名已修改')
      void refreshAll()
      void loadDetail(selectedUserId)
    } catch (e) {
      setError(e instanceof Error ? e.message : '修改失败')
    }
  }

  async function toggleDisabled() {
    if (!selectedUserId) return
    const target = detail?.user.disabledAt ? false : true
    setError(null)
    setSuccess(null)
    try {
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${selectedUserId}/status`,
        { disabled: target, reason: reasonDraft },
      )
      if (!r.ok) throw new Error(r.message || '更新失败')
      setSuccess(target ? '用户已禁用' : '用户已启用')
      void refreshAll()
      void loadDetail(selectedUserId)
    } catch (e) {
      setError(e instanceof Error ? e.message : '更新失败')
    }
  }

  async function toggleBusinessQueryPermission() {
    if (!detail) return
    setError(null)
    setSuccess(null)
    try {
      const enabled = !detail.user.permissions?.businessQuery
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${detail.user.id}/permissions`,
        { businessQuery: enabled },
      )
      if (!r.ok) throw new Error(r.message || '保存权限失败')
      setDetail((current) =>
        current
          ? {
              ...current,
              user: r.data.user,
            }
          : current,
      )
      setUsers((list) => list.map((user) => (user.id === r.data.user.id ? { ...user, ...r.data.user } : user)))
      setSuccess(enabled ? '已开启已订业务退订/撤回权限' : '已关闭已订业务退订/撤回权限')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存权限失败')
    }
  }

  async function toggleShopQueryPermission() {
    if (!detail) return
    setError(null)
    setSuccess(null)
    try {
      const enabled = !detail.user.permissions?.shopQuery
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${detail.user.id}/permissions`,
        { shopQuery: enabled },
      )
      if (!r.ok) throw new Error(r.message || '保存权限失败')
      const verifyRes = await apiFetch(`/api/auth/admin/users/${detail.user.id}/accounts`)
      const verified = (await verifyRes.json()) as ApiResp<UserDetail>
      if (!verified.ok) throw new Error(verified.message || '权限保存后校验失败')
      const actual = Boolean(verified.data.user.permissions?.shopQuery)
      setDetail(verified.data)
      if (actual !== enabled) throw new Error('查询和退订权限保存未生效，请刷新后重试')
      setUsers((list) => list.map((user) =>
        user.id === verified.data.user.id ? { ...user, ...verified.data.user } : user,
      ))
      setSuccess(actual ? '已开启商城业务退订权限' : '已关闭商城业务退订权限')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存权限失败')
    }
  }

  async function toggleBusinessOrderPermission() {
    if (!detail) return
    setError(null)
    setSuccess(null)
    try {
      const enabled = !detail.user.permissions?.businessOrder
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${detail.user.id}/permissions`,
        { businessOrder: enabled },
      )
      if (!r.ok) throw new Error(r.message || '保存权限失败')
      setDetail((current) => current ? { ...current, user: r.data.user } : current)
      setUsers((list) => list.map((user) => user.id === r.data.user.id ? { ...user, ...r.data.user } : user))
      setSuccess(enabled ? '已开启业务订购入口权限' : '已关闭业务订购入口权限')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存权限失败')
    }
  }

  async function toggleBusinessIdOverridePermission() {
    if (!detail) return
    setError(null)
    setSuccess(null)
    try {
      const enabled = !detail.user.permissions?.businessIdOverride
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${detail.user.id}/permissions`,
        { businessIdOverride: enabled },
      )
      if (!r.ok) throw new Error(r.message || '保存权限失败')
      setDetail((current) =>
        current
          ? {
              ...current,
              user: r.data.user,
            }
          : current,
      )
      setUsers((list) => list.map((user) => (user.id === r.data.user.id ? { ...user, ...r.data.user } : user)))
      setSuccess(enabled ? '已开启自定义业务ID权限' : '已关闭自定义业务ID权限')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存权限失败')
    }
  }

  async function toggleBenefitActivityPermission() {
    if (!detail) return
    setError(null)
    setSuccess(null)
    try {
      const enabled = !detail.user.permissions?.benefitActivity
      const r = await postJson<{ user: ManagedUser }>(
        `/api/auth/admin/users/${detail.user.id}/permissions`,
        { benefitActivity: enabled },
      )
      if (!r.ok) throw new Error(r.message || '保存权限失败')
      setDetail((current) => current ? { ...current, user: r.data.user } : current)
      setUsers((list) => list.map((user) => (user.id === r.data.user.id ? { ...user, ...r.data.user } : user)))
      setSuccess(enabled ? '已开启权益活动权限' : '已关闭权益活动权限')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存权限失败')
    }
  }

  async function bindAccountToSelectedUser() {
    if (!selectedUserId || bindingAccount) return
    const text = bindAccountText.trim()
    if (!text) {
      setError('请输入手机号或账号ID')
      return
    }
    setError(null)
    setSuccess(null)
    setBindingAccount(true)
    try {
      const digits = text.replace(/\D+/g, '')
      const body =
        /^1\d{10}$/.test(digits) && digits.length === 11
          ? { phone: digits }
          : { accountId: text }
      const r = await postJson<{ account: AccountSummary }>(
        `/api/auth/admin/users/${selectedUserId}/accounts/bind`,
        body,
      )
      if (!r.ok) throw new Error(r.message || '绑定失败')
      setBindAccountText('')
      setSuccess('账号已绑定到当前注册用户')
      await refreshAll()
      await loadDetail(selectedUserId)
    } catch (e) {
      setError(e instanceof Error ? e.message : '绑定失败')
    } finally {
      setBindingAccount(false)
    }
  }

  async function syncInviteAccounts() {
    if (!selectedUserId || bindingAccount) return
    setError(null)
    setSuccess(null)
    setBindingAccount(true)
    try {
      const r = await postJson<{ boundCount: number }>(
        `/api/auth/admin/users/${selectedUserId}/accounts/sync-invites`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '同步失败')
      setSuccess(`已同步 ${r.data.boundCount} 个邀请码账号`)
      await refreshAll()
      await loadDetail(selectedUserId)
    } catch (e) {
      setError(e instanceof Error ? e.message : '同步失败')
    } finally {
      setBindingAccount(false)
    }
  }

  async function generateYunpanSsoLink(accountId: string) {
    if (generatingSsoLinkId) return
    setError(null)
    setSuccess(null)
    setGeneratingSsoLinkId(accountId)
    try {
      const r = await postJson<YunpanSsoLinkResult>(
        `/api/accounts/${accountId}/yunpan/sso-link`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '生成 86 优惠商城链接失败')
      setYunpanSsoLinks((prev) => ({ ...prev, [accountId]: r.data.ssoUrl }))
      setPendingSso({ url: r.data.ssoUrl, destination: '86 优惠商城' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成 86 优惠商城链接失败')
    } finally {
      setGeneratingSsoLinkId(null)
    }
  }

  async function generateAigouSsoLink(accountId: string) {
    if (generatingSsoLinkId) return
    setError(null)
    setSuccess(null)
    setGeneratingSsoLinkId(accountId)
    try {
      const r = await postJson<AigouSsoLinkResult>(
        `/api/accounts/${accountId}/aigou/sso-link`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '生成爱购商城链接失败')
      setPendingSso({ url: r.data.ssoUrl, destination: '爱购商城' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成爱购商城链接失败')
    } finally {
      setGeneratingSsoLinkId(null)
    }
  }

  async function generateQqtSsoLink(accountId: string) {
    if (generatingSsoLinkId) return
    setError(null)
    setSuccess(null)
    setGeneratingSsoLinkId(accountId)
    try {
      const r = await postJson<AigouSsoLinkResult>(
        `/api/accounts/${accountId}/qqt/sso-link`,
        {},
      )
      if (!r.ok) throw new Error(r.message || '生成全球通专区链接失败')
      setPendingSso({ url: r.data.ssoUrl, destination: '全球通专区' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成全球通专区链接失败')
    } finally {
      setGeneratingSsoLinkId(null)
    }
  }

  async function generateCocPackageSsoLink(
    accountId: string,
    target: CocPackageTarget,
    destination: string,
  ) {
    if (generatingSsoLinkId) return
    setError(null)
    setSuccess(null)
    setGeneratingSsoLinkId(accountId)
    try {
      const r = await postJson<AigouSsoLinkResult>(
        `/api/accounts/${accountId}/coc-package/${target}/sso-link`,
        {},
      )
      if (!r.ok) throw new Error(r.message || `生成${destination}链接失败`)
      setPendingSso({ url: r.data.ssoUrl, destination })
    } catch (e) {
      setError(e instanceof Error ? e.message : `生成${destination}链接失败`)
    } finally {
      setGeneratingSsoLinkId(null)
    }
  }

  function openPendingSsoUrl() {
    if (!pendingSso) return
    window.open(pendingSso.url, '_blank', 'noopener,noreferrer')
    setSuccess(`已在新标签页打开${pendingSso.destination}`)
    setPendingSso(null)
  }

  async function copyPendingSsoUrl() {
    if (!pendingSso) return
    try {
      await copyText(pendingSso.url)
      setSuccess(`${pendingSso.destination}跳转链接已复制`)
      setPendingSso(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '复制链接失败')
    }
  }

  async function loadAccounts(): Promise<AccountSummary[]> {
    const res = await apiFetch('/api/accounts?includeDisabled=1')
    const data = (await res.json()) as ApiResp<{ accounts: AccountSummary[] }>
    if (!data.ok) throw new Error(data.message || '加载账号失败')
    return data.data.accounts
  }

  function accountName(account: AccountSummary): string {
    return account.displayPhone || account.phoneMasked || account.phone || account.label || account.id
  }

  async function exportUnreceivedQqtTokens(): Promise<QqtTokenExport> {
    const r = await postJson<QqtTokenExport>('/api/accounts/qqt/tokens/export', {
      refresh: true,
      strict: true,
      concurrency: 4,
      updatedWithinMinutes: 30,
      validForMinutes: 120,
    })
    if (!r.ok) throw new Error(r.message || '导出 token 失败')
    setExportedTokens(r.data)
    return r.data
  }

  async function refreshQqtTokensAndExport() {
    if (tokenProgress?.running) return
    setError(null)
    setSuccess(null)
    setExportedTokens(null)
    try {
      const accounts = await loadAccounts()
      const targets = accounts.filter((account) => account.hasCookie && !account.disabledAt)
      if (targets.length === 0) {
        setError('暂无可刷新 CK 的账号')
        return
      }

      setTokenProgress({
        running: true,
        total: targets.length,
        done: 0,
        success: 0,
        failed: 0,
        message: '准备刷新 CK 并置换全球通 token',
        results: [],
      })

      const results: WorkerResult[] = []
      for (const account of targets) {
        setTokenProgress((prev) =>
          prev
            ? {
                ...prev,
                current: accountName(account),
                message: `正在处理 ${accountName(account)}`,
              }
            : prev,
        )
        try {
          const r = await postJson<{
            total: number
            success: number
            failed: number
            results: WorkerResult[]
          }>('/api/worker/refresh-cookies-then-tokens', {
            accountIds: [account.id],
          })
          if (r.ok) {
            results.push(
              r.data.results[0] || { id: account.id, ok: false, message: '未返回处理结果' },
            )
          } else {
            const err = r as ApiErr
            results.push({
              id: account.id,
              ok: false,
              message: err.message || '刷新失败',
              errorCode: err.errorCode,
            })
          }
        } catch (e) {
          results.push({
            id: account.id,
            ok: false,
            message: e instanceof Error ? e.message : '刷新失败',
          })
        }
        const successCount = results.filter((item) => item.ok).length
        setTokenProgress((prev) =>
          prev
            ? {
                ...prev,
                done: results.length,
                success: successCount,
                failed: results.length - successCount,
                results: [...results],
                message: `已处理 ${results.length}/${targets.length}`,
              }
            : prev,
        )
      }

      setTokenProgress((prev) =>
        prev
          ? {
              ...prev,
              current: undefined,
              message: '正在过滤全球通未领取 token',
            }
          : prev,
      )
      const exported = await exportUnreceivedQqtTokens()
      const successCount = results.filter((item) => item.ok).length
      setTokenProgress((prev) =>
        prev
          ? {
              ...prev,
              running: false,
              done: targets.length,
              success: successCount,
              failed: targets.length - successCount,
              current: undefined,
              message: `完成：成功 ${successCount}，失败 ${targets.length - successCount}，可复制 ${exported.tokens.length} 个`,
              results,
            }
          : prev,
      )
      setSuccess(`已刷新并过滤，未领取权益全球通 token 共 ${exported.tokens.length} 个`)
      void refreshAll()
      if (selectedUserId) void loadDetail(selectedUserId)
    } catch (e) {
      setTokenProgress((prev) => (prev ? { ...prev, running: false } : prev))
      setError(e instanceof Error ? e.message : '刷新 token 失败')
    }
  }

  async function copyUnreceivedQqtTokens() {
    if (copyingTokens) return
    setError(null)
    setSuccess(null)
    setCopyingTokens(true)
    try {
      const exported = exportedTokens || (await exportUnreceivedQqtTokens())
      const tokens = Array.from(
        new Set(exported.tokens.map((item) => item.accessToken.trim()).filter(Boolean)),
      )
      if (tokens.length === 0) {
        setError('暂无未领取权益的全球通用户 token')
        return
      }
      await copyText(tokens.join('\n'))
      setSuccess(`已复制 ${tokens.length} 个未领取权益的全球通用户 token`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '复制 token 失败')
    } finally {
      setCopyingTokens(false)
    }
  }

  useEffect(() => {
    document.title = '用户管理'
    void refreshAll()
  }, [])

  useEffect(() => {
    if (selectedUserId && !detail) {
      void loadDetail(selectedUserId)
    }
  }, [selectedUserId])

  useEffect(() => {
    if (!error && !success) return
    const timer = window.setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [error, success])

  const filteredUsers = useMemo(() => {
    const key = search.trim().toLowerCase()
    return users.filter((user) => {
      if (showDisabledOnly && !user.disabledAt) return false
      if (!key) return true
      return (
        user.username.includes(key) ||
        (user.displayName || '').includes(key) ||
        (user.usedInviteCodes || []).some((code) => code.includes(key))
      )
    })
  }, [users, search, showDisabledOnly])

  const toastMessage = error || success
  const toastType = error ? 'error' : 'success'

  return (
    <div className={cn('text-zinc-900', embedded ? 'bg-transparent' : 'brand-page min-h-screen')}>
      <SsoNavigationDialog
        url={pendingSso?.url ?? null}
        destination={pendingSso?.destination}
        onOpen={openPendingSsoUrl}
        onCopy={() => void copyPendingSsoUrl()}
      />
      <CallbackAppointmentDialog account={callbackAccount} onClose={() => setCallbackAccount(null)} />
      <div className={cn('mx-auto max-w-[1540px]', embedded ? '' : 'px-2 py-2')}>
        {toastMessage ? (
          <div className="fixed left-1/2 top-3 z-[80] w-[calc(100%-24px)] max-w-[460px] -translate-x-1/2">
            <div
              className={cn(
                'flex items-start gap-2 rounded-lg px-3 py-2 text-sm shadow-lg',
                toastType === 'error' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-white',
              )}>
              {toastType === 'error' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              <span className="min-w-0 flex-1">{toastMessage}</span>
              <button type="button" onClick={() => { setError(null); setSuccess(null) }}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
            embedded
              ? 'mb-4'
              : 'mb-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm',
          )}>
          <h1 className={cn('brand-heading font-semibold', embedded ? 'text-xl' : 'text-base')}>
            {!embedded ? <BrandLogo className="h-7 w-7" /> : null}
            {embedded ? '用户与权限' : '用户管理'}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/starbucks?from=users" className="inline-flex h-8 items-center rounded-md border border-zinc-300 px-3 text-xs font-medium text-emerald-800">星巴克卡券</a>
            <Link to={`/benefits/wed-puzzle?from=${embedded ? 'v2-users' : 'users'}`} className="inline-flex h-8 items-center rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-700">周三拼图互转</Link>
            <button
              type="button"
              onClick={() => setShowTokenTools(true)}
              className="inline-flex h-8 items-center gap-1 rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700">
              <RefreshCcw className="h-3.5 w-3.5" />
              token 工具
            </button>
            <button
              type="button"
              onClick={() => setShowPolicySettings(true)}
              className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-200">
              <Shield className="h-3.5 w-3.5" />
              注册策略
            </button>
            <Link to={embedded ? '/v2/links' : '/links'} className="inline-flex h-8 items-center rounded-md bg-zinc-900 px-3 text-xs font-medium text-white hover:bg-zinc-800">
              邀请码管理
            </Link>
            {!embedded ? (
              <Link to="/" className="inline-flex h-8 items-center rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-200">
                返回主页
              </Link>
            ) : null}
          </div>
        </div>

        {showUserSettings && detail ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
            onClick={() => setShowUserSettings(false)}>
            <div
              className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-zinc-900">用户资料与权限</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {detail.user.username} · 注册 {formatDate(detail.user.createdAt)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUserSettings(false)}
                  className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
                  关闭
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-xs">
                  <span className="text-zinc-600">修改用户名</span>
                  <input
                    value={usernameDraft}
                    onChange={(e) => setUsernameDraft(e.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => void changeUsername()}
                    className="h-9 w-full rounded-md bg-zinc-900 px-3 font-medium text-white hover:bg-zinc-800">
                    保存用户名
                  </button>
                </label>

                <label className="space-y-1 text-xs">
                  <span className="text-zinc-600">默认重置密码</span>
                  <input
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => void resetUserPassword()}
                    className="h-9 w-full rounded-md bg-blue-50 px-3 font-medium text-blue-700 hover:bg-blue-100">
                    重置密码
                  </button>
                </label>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <label className="space-y-1 text-xs">
                  <span className="text-zinc-600">禁用原因</span>
                  <input
                    value={reasonDraft}
                    onChange={(e) => setReasonDraft(e.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="可选"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void toggleDisabled()}
                  className={cn(
                    'mt-5 h-10 rounded-md px-3 font-medium text-white md:mt-5',
                    detail.user.disabledAt ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700',
                  )}>
                  {detail.user.disabledAt ? '启用用户' : '禁用用户'}
                </button>
              </div>

              <div className="mt-3 rounded-lg border border-zinc-200 p-3 text-xs">
                <div className="mb-2 font-medium text-zinc-900">用户权限</div>
                <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
                  <span>
                    <span className="block font-medium text-zinc-800">已订业务退订/撤回权限</span>
                    <span className="mt-0.5 block text-zinc-500">入口和查询默认开放；开启后展示并允许使用退订或撤回按钮。</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(detail.user.permissions?.businessQuery)}
                    onChange={() => void toggleBusinessQueryPermission()}
                    className="h-5 w-5 rounded border-zinc-300 text-blue-600"
                  />
                </label>
                <label className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
                  <span>
                    <span className="block font-medium text-zinc-800">专属页权益活动入口</span>
                    <span className="mt-0.5 block text-zinc-500">默认关闭；开启后该用户可进入幸运三日签并领取权益。</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(detail.user.permissions?.benefitActivity)}
                    onChange={() => void toggleBenefitActivityPermission()}
                    className="h-5 w-5 rounded border-zinc-300 text-rose-600"
                  />
                </label>
                <label className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
                  <span>
                    <span className="block font-medium text-zinc-800">专属页业务订购入口</span>
                    <span className="mt-0.5 block text-zinc-500">开启后该用户可为已关联账号进入验证码订购流程。</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(detail.user.permissions?.businessOrder)}
                    onChange={() => void toggleBusinessOrderPermission()}
                    className="h-5 w-5 rounded border-zinc-300 text-violet-600"
                  />
                </label>
                <label className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
                  <span>
                    <span className="block font-medium text-zinc-800">商城业务退订权限</span>
                    <span className="mt-0.5 block text-zinc-500">查询入口默认开放；开启后展示并允许使用商城业务退订按钮。</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(detail.user.permissions?.shopQuery)}
                    onChange={() => void toggleShopQueryPermission()}
                    className="h-5 w-5 rounded border-zinc-300 text-blue-600"
                  />
                </label>
                <label className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-zinc-50 px-3 py-2">
                  <span>
                    <span className="block font-medium text-zinc-800">自定义业务ID权限</span>
                    <span className="mt-0.5 block text-zinc-500">开启后退订或撤销业务时可修改 planId、productCode、offerId。</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(detail.user.permissions?.businessIdOverride)}
                    onChange={() => void toggleBusinessIdOverridePermission()}
                    className="h-5 w-5 rounded border-zinc-300 text-blue-600"
                  />
                </label>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showTokenTools ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
            onClick={() => setShowTokenTools(false)}>
            <div
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-zinc-900">全球通 token 置换</div>
                  <div className="mt-1 text-xs text-zinc-500">刷新 CK、置换 token，并过滤未领取权益账号。</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTokenTools(false)}
                  className="rounded-md bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void refreshQqtTokensAndExport()}
                disabled={Boolean(tokenProgress?.running)}
                className={cn(
                  'inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-white',
                  tokenProgress?.running ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700',
                )}>
                {tokenProgress?.running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                一键刷新 token
              </button>
              <button
                type="button"
                onClick={() => void copyUnreceivedQqtTokens()}
                disabled={copyingTokens || Boolean(tokenProgress?.running)}
                className={cn(
                  'inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium',
                  copyingTokens || tokenProgress?.running
                    ? 'bg-zinc-100 text-zinc-400'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800',
                )}>
                {copyingTokens ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                复制未领取 token
              </button>
            </div>
              {tokenProgress ? (
                <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                    <span>{tokenProgress.message}</span>
                    <span>
                      成功 {tokenProgress.success} · 失败 {tokenProgress.failed} · 可复制 {exportedTokens?.tokens.length ?? 0}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{
                        width:
                          tokenProgress.total > 0
                            ? `${Math.round((tokenProgress.done / tokenProgress.total) * 100)}%`
                            : '0%',
                      }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>
                      {tokenProgress.done}/{tokenProgress.total}
                    </span>
                    {tokenProgress.current ? <span>当前：{tokenProgress.current}</span> : null}
                    {!tokenProgress.running && exportedTokens ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        已过滤非全球通和已领取账号
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {showPolicySettings ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
            onClick={() => setShowPolicySettings(false)}>
            <div
              className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-zinc-900">注册策略</div>
                <button
                  type="button"
                  onClick={() => setShowPolicySettings(false)}
                  className="rounded-md bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                <label className="space-y-1 text-xs">
                  <span>用户名白名单</span>
                  <textarea value={allowText} onChange={(e) => setAllowText(e.target.value)} className="h-36 w-full resize-y rounded-md border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="space-y-1 text-xs">
                  <span>用户名黑名单</span>
                  <textarea value={blockText} onChange={(e) => setBlockText(e.target.value)} className="h-36 w-full resize-y rounded-md border border-zinc-200 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="space-y-1 text-xs">
                  <span>默认重置密码</span>
                  <input value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="h-10 w-full rounded-md border border-zinc-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  <button type="button" onClick={() => void savePolicy()} className="h-10 w-full rounded-md bg-zinc-900 px-3 font-medium text-white hover:bg-zinc-800">
                    保存策略
                  </button>
                </label>
              </div>
            </div>
          </div>
        ) : null}

        {showUserDetail && detail ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
            onClick={() => setShowUserDetail(false)}>
            <div
              className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-zinc-900">{detail.user.username}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    注册 {formatDate(detail.user.createdAt)} · 最近登录 {formatDate(detail.user.lastLoginAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDetail(false)
                      setShowUserSettings(true)
                    }}
                    className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-900 px-3 text-xs font-medium text-white hover:bg-zinc-800">
                    <Settings className="h-3.5 w-3.5" />
                    资料/权限
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserDetail(false)}
                    className="rounded-md bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">状态</div>
                  <div className={cn('mt-1 font-semibold', detail.user.disabledAt ? 'text-rose-700' : 'text-emerald-700')}>
                    {detail.user.disabledAt ? '已禁用' : '正常'}
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">关联账号</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.accounts.length}</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">邀请码</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.user.inviteCount ?? 0}</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">已订业务退订/撤回</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.user.permissions?.businessQuery ? '已开启' : '未开启'}</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">商城业务退订</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.user.permissions?.shopQuery ? '已开启' : '未开启'}</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">业务订购入口</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.user.permissions?.businessOrder ? '已开启' : '未开启'}</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">自定义业务ID</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.user.permissions?.businessIdOverride ? '已开启' : '未开启'}</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs">
                  <div className="text-zinc-500">权益活动入口</div>
                  <div className="mt-1 font-semibold text-zinc-900">{detail.user.permissions?.benefitActivity ? '已开启' : '未开启'}</div>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-zinc-200 p-3 text-xs">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="font-medium text-zinc-900">关联账号</div>
                  <button
                    type="button"
                    onClick={() => void syncInviteAccounts()}
                    disabled={bindingAccount}
                    className={cn(
                      'h-8 rounded-md px-3 font-medium',
                      bindingAccount ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
                    )}>
                    同步邀请码账号
                  </button>
                </div>
                <div className="mb-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    value={bindAccountText}
                    onChange={(e) => setBindAccountText(e.target.value)}
                    placeholder="手机号或账号ID"
                    className="h-9 w-full rounded-md border border-zinc-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => void bindAccountToSelectedUser()}
                    disabled={bindingAccount}
                    className={cn(
                      'h-9 rounded-md px-3 font-medium text-white',
                      bindingAccount ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700',
                    )}>
                    {bindingAccount ? '处理中' : '绑定账号'}
                  </button>
                </div>
                <div className="max-h-[42vh] overflow-auto rounded-lg border border-zinc-100">
                  <table className="w-full min-w-[720px] table-fixed text-left">
                    <colgroup>
                      <col className="w-[25%]" />
                      <col className="w-[16%]" />
                      <col className="w-[13%]" />
                      <col className="w-[31%]" />
                      <col className="w-[15%]" />
                    </colgroup>
                    <thead className="sticky top-0 bg-zinc-50 text-zinc-500">
                      <tr>
                        <th className="px-3 py-2 font-medium">账号</th>
                        <th className="px-3 py-2 font-medium">手机号</th>
                        <th className="px-3 py-2 font-medium">登录态</th>
                        <th className="px-3 py-2 font-medium">业务功能</th>
                        <th className="px-3 py-2 font-medium">外部跳转</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {detail.accounts.map((account) => {
                        const generatedUrl = yunpanSsoLinks[account.id]
                        const generating = generatingSsoLinkId === account.id
                        return (
                          <tr key={account.id}>
                            <td className="px-3 py-2">
                              <div className="truncate font-medium text-zinc-900" title={account.label || account.id}>{account.label || account.id}</div>
                              <div className="mt-0.5 whitespace-nowrap text-[10px] text-zinc-400">{formatDate(account.updatedAt)}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-600">{account.displayPhone || account.phone || '—'}</td>
                            <td className={cn('px-3 py-2 font-medium', account.hasCookie ? 'text-emerald-700' : 'text-zinc-400')}>
                              {account.hasCookie ? '有 Cookie' : '无 Cookie'}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex flex-nowrap gap-1">
                                <Link
                                  to={`/business-query?accountId=${encodeURIComponent(account.id)}`}
                                  aria-disabled={!account.hasCookie}
                                  onClick={(event) => {
                                    if (!account.hasCookie) event.preventDefault()
                                  }}
                                  className={cn(
                                    'inline-flex h-7 items-center whitespace-nowrap rounded-md px-2 font-medium',
                                    account.hasCookie
                                      ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                                  )}>
                                  已订
                                </Link>
                                <Link
                                  to={`/legacy-business-query?accountId=${encodeURIComponent(account.id)}&returnTo=${encodeURIComponent('/users')}`}
                                  className="inline-flex h-7 items-center whitespace-nowrap rounded-md bg-sky-50 px-2 font-medium text-sky-700 hover:bg-sky-100">
                                  旧版已订
                                </Link>
                                <Link
                                  to={`/shop-query?accountId=${encodeURIComponent(account.id)}`}
                                  aria-disabled={!account.hasCookie}
                                  onClick={(event) => {
                                    if (!account.hasCookie) event.preventDefault()
                                  }}
                                  className={cn(
                                    'inline-flex h-7 items-center whitespace-nowrap rounded-md px-2 font-medium',
                                    account.hasCookie
                                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                                  )}>
                                  退订
                                </Link>
                                <Link
                                  to={`/business-order?accountId=${encodeURIComponent(account.id)}`}
                                  aria-disabled={!detail.user.permissions?.businessOrder}
                                  onClick={(event) => {
                                    if (!detail.user.permissions?.businessOrder) event.preventDefault()
                                  }}
                                  className={cn(
                                    'inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-md px-2 font-medium',
                                    detail.user.permissions?.businessOrder
                                      ? 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                                      : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                                  )}>
                                  <PackagePlus className="h-3 w-3" />
                                  订购
                                </Link>
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              {account.hasYunpanSession || account.qqtAccessToken ? <YunpanJumpActions accountId={account.id} canRefreshGlobal={Boolean(account.hasYunpanSession || account.hasCookie)} disabled={Boolean(account.disabledAt)} /> : null}
                              {account.hasYunpanSession || account.hasCookie ? (
                                <div className="flex flex-wrap items-center gap-2">

                                  <button
                                    type="button"
                                    onClick={() => setCallbackAccount(account)}
                                    disabled={!account.hasCookie || Boolean(account.disabledAt)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-blue-50 px-2 font-medium text-blue-700 hover:bg-blue-100 disabled:text-zinc-400">
                                    10086 预约回访
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateQqtSsoLink(account.id)}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-indigo-50 px-2 font-medium text-indigo-800 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    全球通专区
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateAigouSsoLink(account.id)}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className={cn(
                                      'inline-flex h-8 items-center gap-1 rounded-md px-2 font-medium',
                                      generating
                                        ? 'bg-cyan-100 text-cyan-600'
                                        : generatingSsoLinkId
                                          ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                                          : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100',
                                    )}>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    爱购商城
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateCocPackageSsoLink(account.id, 'building_bricks', '积木套餐')}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-50 px-2 font-medium text-emerald-800 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    积木套餐
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateCocPackageSsoLink(account.id, 'diamond_package', '全球通卓越钻石')}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-amber-50 px-2 font-medium text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    全球通卓越钻石
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateCocPackageSsoLink(account.id, 'age_feed', '全球通网龄直升')}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-amber-50 px-2 font-medium text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    全球通网龄直升
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateCocPackageSsoLink(account.id, 'smart_life', '智臻会员')}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-rose-50 px-2 font-medium text-rose-800 hover:bg-rose-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    智臻会员
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void generateCocPackageSsoLink(account.id, 'five_ga', '全球通 5GA')}
                                    disabled={Boolean(generatingSsoLinkId)}
                                    className="inline-flex h-8 items-center gap-1 rounded-md bg-blue-50 px-2 font-medium text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    全球通 5GA
                                  </button>
                                </div>
                              ) : (
                                <span className="text-zinc-400">无可用 CK</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      {detail.accounts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-6 text-center text-zinc-400">暂无关联账号</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-zinc-200 p-3 text-xs">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="font-medium text-zinc-900">关联专属链接与邀请码</div>
                  <span className="text-zinc-500">共 {detail.linkedInvites.length} 条</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-zinc-100">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-zinc-50 text-zinc-500">
                      <tr>
                        <th className="px-3 py-2 font-medium">邀请码</th>
                        <th className="px-3 py-2 font-medium">专属链接</th>
                        <th className="px-3 py-2 font-medium">账号数</th>
                        <th className="px-3 py-2 font-medium">状态</th>
                        <th className="px-3 py-2 font-medium">使用时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {detail.linkedInvites.map((invite) => (
                        <tr key={invite.inviteCode}>
                          <td className="whitespace-nowrap px-3 py-2 font-mono font-medium text-zinc-800">
                            {invite.inviteCode}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex min-w-0 items-center gap-1">
                              <a
                                href={invite.url}
                                target="_blank"
                                rel="noreferrer"
                                title={invite.url}
                                className="max-w-[320px] truncate text-blue-600 hover:underline">
                                {invite.url}
                              </a>
                              <button
                                type="button"
                                title="复制专属链接"
                                onClick={() => void copyText(invite.url).then(() => setSuccess('专属链接已复制'))}
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <a
                                href={invite.url}
                                target="_blank"
                                rel="noreferrer"
                                title="打开专属链接"
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-zinc-600">{invite.accountCount}</td>
                          <td className="px-3 py-2">
                            <span className={cn('font-medium', invite.status === 'active' ? 'text-emerald-700' : 'text-zinc-400')}>
                              {invite.status === 'active' ? '有效' : '已失效'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-zinc-500">{formatDate(invite.usedAt)}</td>
                        </tr>
                      ))}
                      {detail.linkedInvites.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-6 text-center text-zinc-400">暂无关联专属链接或邀请码</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm">
          <div className="mb-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-zinc-900">
                用户列表
                <span className="ml-2 text-xs font-normal text-zinc-500">共 {users.length} 个，当前 {filteredUsers.length} 个</span>
              </div>
            </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索用户名/昵称/邀请码"
                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowDisabledOnly((v) => !v)}
                className={cn(
                  'h-10 rounded-md px-3 text-sm font-medium',
                  showDisabledOnly ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700',
                )}>
                {showDisabledOnly ? '仅看禁用' : '筛选禁用'}
              </button>
              <button type="button" onClick={() => void refreshAll()} className="h-10 rounded-md bg-blue-50 px-3 text-sm font-medium text-blue-700 hover:bg-blue-100">
                {loading ? '刷新中' : '刷新'}
              </button>
          </div>

          <div className="space-y-2 md:hidden">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => void openUserDetail(user.id)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition',
                    selectedUserId === user.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50',
                  )}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-900">{user.username}</div>
                      {user.displayName ? <div className="mt-0.5 truncate text-xs text-zinc-500">{user.displayName}</div> : null}
                    </div>
                    <span className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                      user.disabledAt ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700',
                    )}>
                      {user.disabledAt ? '已禁用' : '正常'}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-md bg-zinc-50 px-2 py-1.5">
                      <div className="font-semibold text-zinc-900">{user.accountCount ?? 0}</div>
                      <div className="text-zinc-500">账号</div>
                    </div>
                    <div className="rounded-md bg-zinc-50 px-2 py-1.5">
                      <div className="font-semibold text-zinc-900">{user.inviteCount ?? 0}</div>
                      <div className="text-zinc-500">邀请码</div>
                    </div>
                    <div className="rounded-md bg-zinc-50 px-2 py-1.5">
                      <div className="font-semibold text-zinc-900">{formatDate(user.createdAt)}</div>
                      <div className="text-zinc-500">注册</div>
                    </div>
                  </div>
                </button>
              ))}
              {filteredUsers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-sm text-zinc-500">暂无匹配用户</div>
              ) : null}
          </div>

          <div className="hidden max-h-[calc(100vh-120px)] overflow-auto rounded-lg border border-zinc-200 md:block">
              <table className="min-w-[980px] w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="px-3 py-2">用户名</th>
                    <th className="px-3 py-2">关联账号</th>
                    <th className="px-3 py-2">邀请码</th>
                    <th className="px-3 py-2">功能权限</th>
                    <th className="px-3 py-2">最近登录</th>
                    <th className="px-3 py-2">状态</th>
                    <th className="px-3 py-2">注册</th>
                    <th className="sticky right-0 bg-zinc-50 px-3 py-2 text-right shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => void openUserDetail(user.id)}
                      className={cn(
                        'cursor-pointer hover:bg-zinc-50',
                        selectedUserId === user.id ? 'bg-blue-50/60' : '',
                      )}>
                      <td className="px-3 py-2">
                        <div className="font-medium text-zinc-900">{user.username}</div>
                        {user.displayName ? <div className="text-zinc-500">{user.displayName}</div> : null}
                      </td>
                      <td className="px-3 py-2">{user.accountCount ?? 0}</td>
                      <td className="px-3 py-2">{user.inviteCount ?? 0}</td>
                      <td className="px-3 py-2">
                        {user.permissions?.businessQuery ? '业务退订开' : '业务退订关'}
                        <span className="ml-1 text-zinc-400">/</span>
                        <span className="ml-1">{user.permissions?.shopQuery ? '商城退订开' : '商城退订关'}</span>
                        <span className="ml-1 text-zinc-400">/</span>
                        <span className="ml-1">{user.permissions?.businessOrder ? '订购开' : '订购关'}</span>
                        <span className="ml-1 text-zinc-400">/</span>
                        <span className="ml-1">{user.permissions?.businessIdOverride ? 'ID开' : 'ID关'}</span>
                        <span className="ml-1 text-zinc-400">/</span>
                        <span className="ml-1">{user.permissions?.benefitActivity ? '权益开' : '权益关'}</span>
                      </td>
                      <td className="px-3 py-2">{formatDate(user.lastLoginAt)}</td>
                      <td className={cn('px-3 py-2 font-medium', user.disabledAt ? 'text-rose-700' : 'text-emerald-700')}>
                        {user.disabledAt ? '已禁用' : '正常'}
                      </td>
                      <td className="px-3 py-2">{formatDate(user.createdAt)}</td>
                      <td className="sticky right-0 bg-white px-3 py-2 text-right shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              void openUserDetail(user.id)
                            }}
                            className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-100 px-2 font-medium text-zinc-700 hover:bg-zinc-200">
                            <Eye className="h-3.5 w-3.5" />
                            详情
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowUserDetail(false)
                              void loadDetail(user.id).then(() => setShowUserSettings(true))
                            }}
                            className="inline-flex h-8 items-center gap-1 rounded-md bg-zinc-900 px-2 font-medium text-white hover:bg-zinc-800">
                            <Wrench className="h-3.5 w-3.5" />
                            管理
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-zinc-400">暂无匹配用户</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
          </div>
        </section>
      </div>
    </div>
  )
}
