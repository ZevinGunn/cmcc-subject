import BrandLogo from '@/components/BrandLogo'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type ApiOk<T> = { ok: true; data: T; message?: string; requestId?: string }
type ApiErr = {
  ok: false
  message: string
  errorCode?: string
  requestId?: string
}
type ApiResp<T> = ApiOk<T> | ApiErr

type PublicLinkSummary = {
  linkId: string
  createdAt: string
  updatedAt: string
  accountCount: number
  url: string
  ipUrl?: string
  pushplusEnabled: boolean
  pushplusBound: boolean
  notifyLogin: boolean
  notifyCookieInvalid: boolean
  notifyRushResult: boolean
  pushplusSubscribeUrl?: string
  pushplusQrImageUrl?: string
  pushplusQrNote?: string
  redirectEnabled: boolean
  redirectUrl?: string
  redirectNote?: string
}

type PushConfigDraft = {
  pushplusToken: string
  pushplusEnabled: boolean
  notifyLogin: boolean
  notifyCookieInvalid: boolean
  notifyRushResult: boolean
  pushplusSubscribeUrl: string
  pushplusQrImageUrl: string
  pushplusQrNote: string
  redirectEnabled: boolean
  redirectUrl: string
  redirectNote: string
}

type AccountSummary = {
  id: string
  label?: string
  phone?: string
  phoneMasked: string
  displayPhone?: string
  hasCookie: boolean
  qqtInfo?: Record<string, unknown>
  qqtSignInfo?: Record<string, unknown>
  qqtSignResult?: Record<string, unknown>
  xdrReceive?: Record<string, unknown>
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { ...init, headers: new Headers(init?.headers), credentials: 'same-origin' })
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

function formatBeijingDateTime(isoText?: string): string {
  if (!isoText) return '—'
  const date = new Date(isoText)
  if (Number.isNaN(date.getTime())) return isoText
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export default function PublicLinksAdmin({ embedded = false }: { embedded?: boolean }) {
  const [links, setLinks] = useState<PublicLinkSummary[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [accountsByLinkId, setAccountsByLinkId] = useState<Record<string, AccountSummary[]>>({})
  const [openLinkId, setOpenLinkId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [phoneTailQuery, setPhoneTailQuery] = useState('')
  const [linkFilter, setLinkFilter] = useState('')
  const [pushDraftById, setPushDraftById] = useState<Record<string, PushConfigDraft>>({})

  async function refreshLinks() {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/accounts/public/links', { method: 'GET' })
      const r = (await res.json()) as ApiResp<{
        links: {
          linkId: string
          createdAt: string
          updatedAt: string
          accountCount: number
          url?: string
          ipUrl?: string
          pushplusEnabled: boolean
          pushplusBound: boolean
          notifyLogin: boolean
          notifyCookieInvalid: boolean
          notifyRushResult: boolean
          pushplusSubscribeUrl?: string
          pushplusQrImageUrl?: string
          pushplusQrNote?: string
          redirectEnabled: boolean
          redirectUrl?: string
          redirectNote?: string
        }[]
      }>
      if (!r.ok) {
        setError(r.message || '加载邀请码失败')
        return
      }
      const nextLinks = r.data.links.map((item) => ({
        ...item,
        url: item.url || `${window.location.origin}/public?link=${item.linkId}`,
        ipUrl: item.ipUrl,
      }))
      setLinks(nextLinks)
      setPushDraftById((prev) => {
        const next = { ...prev }
        for (const item of nextLinks) {
          if (!next[item.linkId]) {
            next[item.linkId] = {
              pushplusToken: '',
              pushplusEnabled: item.pushplusEnabled,
              notifyLogin: item.notifyLogin,
              notifyCookieInvalid: item.notifyCookieInvalid,
              notifyRushResult: item.notifyRushResult,
              pushplusSubscribeUrl: item.pushplusSubscribeUrl || '',
              pushplusQrImageUrl: item.pushplusQrImageUrl || '',
              pushplusQrNote: item.pushplusQrNote || '',
              redirectEnabled: item.redirectEnabled,
              redirectUrl: item.redirectUrl || '',
              redirectNote: item.redirectNote || '',
            }
          } else {
            next[item.linkId] = {
              ...next[item.linkId],
              pushplusEnabled: item.pushplusEnabled,
              notifyLogin: item.notifyLogin,
              notifyCookieInvalid: item.notifyCookieInvalid,
              notifyRushResult: item.notifyRushResult,
              pushplusSubscribeUrl: item.pushplusSubscribeUrl || '',
              pushplusQrImageUrl: item.pushplusQrImageUrl || '',
              pushplusQrNote: item.pushplusQrNote || '',
              redirectEnabled: item.redirectEnabled,
              redirectUrl: item.redirectUrl || '',
              redirectNote: item.redirectNote || '',
            }
          }
        }
        return next
      })
      setSelectedIds((prev) =>
        prev.filter((id) => nextLinks.some((item) => item.linkId === id)),
      )
    } catch {
      setError('网络异常，请重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshLinks()
  }, [])

  useEffect(() => {
    const query = phoneTailQuery.trim()
    if (!query) return
    const pending = links
      .map((item) => item.linkId)
      .filter((linkId) => !accountsByLinkId[linkId])
    if (pending.length === 0) return
    void Promise.allSettled(pending.map((linkId) => fetchLinkAccounts(linkId)))
  }, [phoneTailQuery, links, accountsByLinkId])

  async function fetchLinkAccounts(linkId: string) {
    const res = await apiFetch(`/api/accounts/public/link/${linkId}/accounts`, {
      method: 'GET',
    })
    const r = (await res.json()) as ApiResp<{ accounts: AccountSummary[] }>
    if (!r.ok) throw new Error(r.message || '加载链接账号失败')
    setAccountsByLinkId((prev) => ({ ...prev, [linkId]: r.data.accounts }))
    return r.data.accounts
  }

  function toggleSelected(linkId: string) {
    setSelectedIds((prev) =>
      prev.includes(linkId)
        ? prev.filter((id) => id !== linkId)
        : [...prev, linkId],
    )
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      if (allSelected) {
        const filteredSet = new Set(filteredLinks.map((item) => item.linkId))
        return prev.filter((id) => !filteredSet.has(id))
      }
      const next = new Set(prev)
      for (const item of filteredLinks) next.add(item.linkId)
      return Array.from(next)
    })
  }

  const normalizedTail = useMemo(
    () => phoneTailQuery.replace(/\D+/g, ''),
    [phoneTailQuery],
  )

  const filteredLinks = useMemo(() => {
    let base = links
    if (linkFilter) {
      base = base.filter((link) => link.linkId === linkFilter)
    }
    const keyword = phoneTailQuery.trim().toLowerCase()
    if (!normalizedTail && !keyword) return base
    return base.filter((link) => {
      if (
        keyword &&
        (link.linkId.toLowerCase().includes(keyword) ||
          link.url.toLowerCase().includes(keyword) ||
          String(link.redirectUrl || '').toLowerCase().includes(keyword))
      ) {
        return true
      }
      const accounts = accountsByLinkId[link.linkId] ?? []
      if (accounts.length === 0) return false
      return accounts.some((account) => {
        const fullPhone = String(account.phone || '').trim()
        if (normalizedTail && /^1\d{10}$/.test(fullPhone) && fullPhone.endsWith(normalizedTail)) {
          return true
        }
        const masked = String(account.phoneMasked || '')
        const maskedTail = masked.replace(/\D+/g, '').slice(-4)
        const display = String(account.displayPhone || account.label || '').toLowerCase()
        return (
          (Boolean(maskedTail) && Boolean(normalizedTail) && maskedTail.endsWith(normalizedTail)) ||
          (Boolean(keyword) && display.includes(keyword))
        )
      })
    })
  }, [normalizedTail, phoneTailQuery, linkFilter, links, accountsByLinkId])

  const allSelected = useMemo(
    () =>
      filteredLinks.length > 0 &&
      filteredLinks.every((item) => selectedIds.includes(item.linkId)),
    [filteredLinks, selectedIds],
  )

  async function onCopySelectedUrls() {
    if (selectedIds.length === 0) {
      setError('请先选择邀请码')
      return
    }
    const text = links
      .filter((item) => selectedIds.includes(item.linkId))
      .map((item) => item.url)
      .join('\n')
    await copyText(text)
    setSuccess(`已复制 ${selectedIds.length} 条邀请码`)
  }

  async function onExportSelectedAccounts() {
    if (selectedIds.length === 0) {
      setError('请先选择邀请码')
      return
    }
    setBusyAction('export')
    setError(null)
    try {
      const res = await apiFetch('/api/accounts/public/links/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: selectedIds }),
      })
      const r = (await res.json()) as ApiResp<{
        text: string
        items: { linkId: string; accountCount: number }[]
      }>
      if (!r.ok) {
        setError(r.message || '导出失败')
        return
      }
      await copyText(r.data.text)
      const total = r.data.items.reduce((sum, item) => sum + item.accountCount, 0)
      setSuccess(`已复制 ${r.data.items.length} 个链接的 ${total} 条账号资料`)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setBusyAction(null)
    }
  }

  async function onDeleteSelected() {
    if (selectedIds.length === 0) {
      setError('请先选择邀请码')
      return
    }
    if (!window.confirm(`确认将选中的 ${selectedIds.length} 个邀请码设置为失效吗？关联账号也会同步失效。`)) {
      return
    }
    setBusyAction('delete')
    setError(null)
    try {
      const res = await apiFetch('/api/accounts/public/links/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: selectedIds }),
      })
      const r = (await res.json()) as ApiResp<{ deleted: string[] }>
      if (!r.ok) {
        setError(r.message || '失效处理失败')
        return
      }
      setLinks((prev) => prev.filter((item) => !r.data.deleted.includes(item.linkId)))
      setSelectedIds([])
      setSuccess(`已失效处理 ${r.data.deleted.length} 个邀请码`)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setBusyAction(null)
    }
  }

  async function onDisableOne(linkId: string) {
    if (!window.confirm(`确认将邀请码 ${linkId} 设置为失效吗？关联账号也会同步失效。`)) {
      return
    }
    setBusyAction(`delete:${linkId}`)
    setError(null)
    try {
      const res = await apiFetch('/api/accounts/public/links/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: [linkId] }),
      })
      const r = (await res.json()) as ApiResp<{ deleted: string[] }>
      if (!r.ok) {
        setError(r.message || '失效处理失败')
        return
      }
      setLinks((prev) => prev.filter((item) => !r.data.deleted.includes(item.linkId)))
      setSelectedIds((prev) => prev.filter((id) => !r.data.deleted.includes(id)))
      if (openLinkId === linkId) setOpenLinkId(null)
      setSuccess(`已失效处理 ${linkId}`)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setBusyAction(null)
    }
  }

  async function onSavePushConfig(linkId: string) {
    const draft = pushDraftById[linkId]
    if (!draft) return
    setBusyAction(`push:${linkId}`)
    setError(null)
    try {
      const res = await apiFetch(`/api/accounts/public/link/${linkId}/push-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const r = (await res.json()) as ApiResp<{
        linkId: string
        pushplusEnabled: boolean
        pushplusBound: boolean
        notifyLogin: boolean
        notifyCookieInvalid: boolean
        notifyRushResult: boolean
        pushplusSubscribeUrl?: string
        pushplusQrImageUrl?: string
        pushplusQrNote?: string
        redirectEnabled: boolean
        redirectUrl?: string
        redirectNote?: string
      }>
      if (!r.ok) {
        setError(r.message || '保存推送配置失败')
        return
      }
      setLinks((prev) =>
        prev.map((item) =>
          item.linkId === linkId
            ? {
                ...item,
                pushplusEnabled: r.data.pushplusEnabled,
                pushplusBound: r.data.pushplusBound,
                notifyLogin: r.data.notifyLogin,
                notifyCookieInvalid: r.data.notifyCookieInvalid,
                notifyRushResult: r.data.notifyRushResult,
                pushplusSubscribeUrl: r.data.pushplusSubscribeUrl,
                pushplusQrImageUrl: r.data.pushplusQrImageUrl,
                pushplusQrNote: r.data.pushplusQrNote,
                redirectEnabled: r.data.redirectEnabled,
                redirectUrl: r.data.redirectUrl,
                redirectNote: r.data.redirectNote,
              }
            : item,
        ),
      )
      setPushDraftById((prev) => ({
        ...prev,
        [linkId]: {
          ...draft,
          pushplusEnabled: r.data.pushplusEnabled,
          notifyLogin: r.data.notifyLogin,
          notifyCookieInvalid: r.data.notifyCookieInvalid,
          notifyRushResult: r.data.notifyRushResult,
          pushplusSubscribeUrl: r.data.pushplusSubscribeUrl || '',
          pushplusQrImageUrl: r.data.pushplusQrImageUrl || '',
          pushplusQrNote: r.data.pushplusQrNote || '',
          redirectEnabled: r.data.redirectEnabled,
          redirectUrl: r.data.redirectUrl || '',
          redirectNote: r.data.redirectNote || '',
        },
      }))
      setSuccess(`已保存 ${linkId} 的推送配置`)
    } catch {
      setError('网络异常，请重试')
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <div className={cn('text-zinc-900', embedded ? 'bg-transparent' : 'brand-page min-h-screen')}>
      <div className={cn('mx-auto', embedded ? 'max-w-[1500px]' : 'max-w-6xl px-4 py-8')}>
        <div className={cn('flex items-center justify-between gap-3', embedded ? 'mb-4' : 'mb-6')}>
          <div>
            {!embedded ? <div className="text-sm text-zinc-500">管理后台</div> : null}
            <h1 className={cn('brand-heading font-semibold', embedded ? 'text-xl' : 'text-2xl')}>
              {!embedded ? <BrandLogo /> : null}
              {embedded ? '专属链接' : '邀请码管理'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!embedded ? (
              <Link
                to="/"
                className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
                返回首页
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => void refreshLinks()}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800">
              刷新列表
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={linkFilter}
              onChange={(e) => setLinkFilter(e.target.value)}
              className="h-9 w-56 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <option value="">全部邀请码</option>
              {links.map((link) => (
                <option key={link.linkId} value={link.linkId}>
                  {link.linkId}（{link.accountCount} 个账号）
                </option>
              ))}
            </select>
            <input
              value={phoneTailQuery}
              onChange={(e) => setPhoneTailQuery(e.target.value)}
              placeholder="搜索邀请码、手机号尾号、备注或服务地址"
              className="h-9 w-72 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={toggleSelectAll}
              className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200">
              {allSelected ? '取消全选' : '全选'}
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0 || busyAction !== null}
              onClick={() => void onCopySelectedUrls()}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                selectedIds.length > 0 && busyAction === null
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
              )}>
              批量复制邀请码地址
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0 || busyAction !== null}
              onClick={() => void onExportSelectedAccounts()}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                selectedIds.length > 0 && busyAction === null
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
              )}>
              {busyAction === 'export' ? '导出中' : '批量复制关联账号资料'}
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0 || busyAction !== null}
              onClick={() => void onDeleteSelected()}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                selectedIds.length > 0 && busyAction === null
                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                  : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
              )}>
              {busyAction === 'delete' ? '处理中' : '批量失效处理'}
            </button>
            <div className="ml-auto text-sm text-zinc-500">
              已选择 {selectedIds.length} / {filteredLinks.length}
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            支持按邀请码、账号手机号尾号、备注或服务地址筛选。输入搜索词时会自动加载关联账号用于匹配。
          </div>
          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
          {success ? <div className="mt-3 text-sm text-emerald-700">{success}</div> : null}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 font-medium">选择</th>
                  <th className="px-4 py-3 font-medium">链接</th>
                  <th className="px-4 py-3 font-medium">账号数</th>
                  <th className="px-4 py-3 font-medium">创建时间</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredLinks.map((item) => {
                  const selected = selectedIds.includes(item.linkId)
                  const open = openLinkId === item.linkId
                  const accounts = accountsByLinkId[item.linkId] ?? []
                  const pushDraft = pushDraftById[item.linkId] ?? {
                    pushplusToken: '',
                    pushplusEnabled: item.pushplusEnabled,
                    notifyLogin: item.notifyLogin,
                    notifyCookieInvalid: item.notifyCookieInvalid,
                    notifyRushResult: item.notifyRushResult,
                    pushplusSubscribeUrl: item.pushplusSubscribeUrl || '',
                    pushplusQrImageUrl: item.pushplusQrImageUrl || '',
                    pushplusQrNote: item.pushplusQrNote || '',
                    redirectEnabled: item.redirectEnabled,
                    redirectUrl: item.redirectUrl || '',
                    redirectNote: item.redirectNote || '',
                  }
                  return (
                    <tr key={item.linkId} className="align-top">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelected(item.linkId)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.linkId}</div>
                        <div className="mt-1 break-all text-xs text-zinc-500">{item.url}</div>
                        <div className="mt-1 text-xs text-zinc-500">
                          推送: {item.pushplusBound ? (item.pushplusEnabled ? '已启用' : '已绑定未启用') : '未绑定'}
                        </div>
                        {item.pushplusSubscribeUrl || item.pushplusQrImageUrl ? (
                          <div className="mt-1 text-xs text-zinc-500">订阅二维码: 已配置</div>
                        ) : null}
                        {item.redirectEnabled && item.redirectUrl ? (
                          <div className="mt-1 break-all text-xs text-blue-700">
                            新服务地址：{item.redirectUrl}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{item.accountCount}</td>
                      <td className="px-4 py-3 text-zinc-600">
                        {formatBeijingDateTime(item.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {formatBeijingDateTime(item.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await copyText(item.url)
                              setSuccess(`已复制 ${item.linkId}`)
                            }}
                            className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200">
                            复制邀请码地址
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (open) {
                                setOpenLinkId(null)
                                return
                              }
                              setOpenLinkId(item.linkId)
                              await fetchLinkAccounts(item.linkId).catch((e: unknown) => {
                                const msg = e instanceof Error ? e.message : '加载账号失败'
                                setError(msg)
                              })
                            }}
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                            {open ? '收起账号' : '查看账号'}
                          </button>
                          <button
                            type="button"
                            disabled={busyAction !== null}
                            onClick={() => void onDisableOne(item.linkId)}
                            className={cn(
                              'rounded-md px-2 py-1 text-xs font-medium',
                              busyAction === null
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                            )}>
                            {busyAction === `delete:${item.linkId}` ? '处理中' : '失效处理'}
                          </button>
                        </div>
                        {open ? (
                          <div className="mt-3 space-y-2 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3">
                            <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-700">
                              <div className="mb-2 font-medium text-zinc-900">推送配置</div>
                              <textarea
                                value={pushDraft.pushplusToken}
                                onChange={(e) =>
                                  setPushDraftById((prev) => ({
                                    ...prev,
                                    [item.linkId]: { ...pushDraft, pushplusToken: e.target.value },
                                  }))
                                }
                                placeholder="填写该邀请码对应的 PushPlus token"
                                className="min-h-[72px] w-full rounded-md border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
                              />
                              <div className="mt-1 text-[11px] text-zinc-500">
                                已绑定 token 不会回显；留空保存表示保持原配置不变。
                              </div>
                              <input
                                value={pushDraft.pushplusSubscribeUrl}
                                onChange={(e) =>
                                  setPushDraftById((prev) => ({
                                    ...prev,
                                    [item.linkId]: {
                                      ...pushDraft,
                                      pushplusSubscribeUrl: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="填写 PushPlus 订阅链接，专属页将自动生成二维码"
                                className="mt-3 h-9 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none focus:border-blue-500"
                              />
                              <input
                                value={pushDraft.pushplusQrImageUrl}
                                onChange={(e) =>
                                  setPushDraftById((prev) => ({
                                    ...prev,
                                    [item.linkId]: {
                                      ...pushDraft,
                                      pushplusQrImageUrl: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="可选：自定义二维码图片地址"
                                className="mt-2 h-9 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none focus:border-blue-500"
                              />
                              <input
                                value={pushDraft.pushplusQrNote}
                                onChange={(e) =>
                                  setPushDraftById((prev) => ({
                                    ...prev,
                                    [item.linkId]: {
                                      ...pushDraft,
                                      pushplusQrNote: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="可选：订阅提示文案"
                                className="mt-2 h-9 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none focus:border-blue-500"
                              />
                              <div className="mt-1 text-[11px] text-zinc-500">
                                优先展示自定义二维码图片；未填写时会根据订阅链接自动生成二维码。
                              </div>
                              <div className="mt-3 rounded-md border border-blue-100 bg-blue-50/60 p-3">
                                <div className="mb-2 font-medium text-zinc-900">新服务地址提示</div>
                                <input
                                  value={pushDraft.redirectUrl}
                                  onChange={(e) =>
                                    setPushDraftById((prev) => ({
                                      ...prev,
                                      [item.linkId]: {
                                        ...pushDraft,
                                        redirectUrl: e.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="填写新服务完整地址，例如 https://new.example.com/public"
                                  className="h-9 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none focus:border-blue-500"
                                />
                                <input
                                  value={pushDraft.redirectNote}
                                  onChange={(e) =>
                                    setPushDraftById((prev) => ({
                                      ...prev,
                                      [item.linkId]: {
                                        ...pushDraft,
                                        redirectNote: e.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="可选：给用户看的变更提示文案"
                                  className="mt-2 h-9 w-full rounded-md border border-zinc-200 px-3 text-xs outline-none focus:border-blue-500"
                                />
                                <label className="mt-2 flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={pushDraft.redirectEnabled}
                                    onChange={(e) =>
                                      setPushDraftById((prev) => ({
                                        ...prev,
                                        [item.linkId]: {
                                          ...pushDraft,
                                          redirectEnabled: e.target.checked,
                                        },
                                      }))
                                    }
                                  />
                                  <span>在用户页面展示新服务地址提示</span>
                                </label>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-3">
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={pushDraft.pushplusEnabled}
                                    onChange={(e) =>
                                      setPushDraftById((prev) => ({
                                        ...prev,
                                        [item.linkId]: { ...pushDraft, pushplusEnabled: e.target.checked },
                                      }))
                                    }
                                  />
                                  <span>启用推送</span>
                                </label>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={pushDraft.notifyLogin}
                                    onChange={(e) =>
                                      setPushDraftById((prev) => ({
                                        ...prev,
                                        [item.linkId]: { ...pushDraft, notifyLogin: e.target.checked },
                                      }))
                                    }
                                  />
                                  <span>登录通知</span>
                                </label>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={pushDraft.notifyCookieInvalid}
                                    onChange={(e) =>
                                      setPushDraftById((prev) => ({
                                        ...prev,
                                        [item.linkId]: { ...pushDraft, notifyCookieInvalid: e.target.checked },
                                      }))
                                    }
                                  />
                                  <span>失效通知</span>
                                </label>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={pushDraft.notifyRushResult}
                                    onChange={(e) =>
                                      setPushDraftById((prev) => ({
                                        ...prev,
                                        [item.linkId]: { ...pushDraft, notifyRushResult: e.target.checked },
                                      }))
                                    }
                                  />
                                  <span>抢购结果通知</span>
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => void onSavePushConfig(item.linkId)}
                                className="mt-3 rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800">
                                {busyAction === `push:${item.linkId}` ? '保存中' : '保存推送配置'}
                              </button>
                            </div>
                            {accounts.length === 0 ? (
                              <div className="text-xs text-zinc-500">暂无关联账号</div>
                            ) : (
                              accounts.map((account) => (
                                <div
                                  key={account.id}
                                  className="rounded-md border border-zinc-200 bg-white p-2 text-xs text-zinc-700">
                                  <div>
                                    账号: {account.displayPhone || account.phoneMasked || '未获取'}
                                  </div>
                                  <div>标签: {account.label || '未设置'}</div>
                                  <div>Cookie: {account.hasCookie ? '有' : '无'}</div>
                                  <div>
                                    全球通信息:
                                    {' '}
                                    {account.qqtInfo ? '已缓存' : '无'}
                                    {' '}· 签到:
                                    {' '}
                                    {account.qqtSignInfo || account.qqtSignResult ? '已缓存' : '无'}
                                    {' '}· 星动日:
                                    {' '}
                                    {account.xdrReceive ? '已缓存' : '无'}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
                {filteredLinks.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                      {normalizedTail ? '未找到匹配该手机尾号的邀请码' : '暂无邀请码'}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
