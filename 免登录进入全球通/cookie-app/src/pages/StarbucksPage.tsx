import BrandLogo from '@/components/BrandLogo'
import StarbucksCouponFilters, { DEFAULT_STARBUCKS_FILTERS, type StarbucksFilterValues } from '@/components/StarbucksCouponFilters'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import PhoneInput from '@/components/PhoneInput'
import {
  ArrowLeft,
  Copy,
  Eye,
  Loader2,
  LogIn,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Ticket,
  Trash2,
  X,
} from 'lucide-react'
import MessageDialog, {
  type MessageDialogState,
} from '@/components/MessageDialog'
import { ApiClientError, requestApiData } from '@/v2/lib/api'
import { cn } from '@/lib/utils'
import {
  collectStarbucksCoupons,
  matchesStarbucksExpiry,
  formatStarbucksCodes,
  DEFAULT_STARBUCKS_COPY_FIELDS,
  starbucksStatusLabels,
  type StarbucksAccount,
  type StarbucksCode,
  type StarbucksCouponStatus,
  type StarbucksState,
  type StarbucksExpiryFilter,
  type StarbucksCopyFields,
} from '../../shared/starbucks'

const control =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600'
const primary =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-medium text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
const input =
  'h-10 min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 disabled:opacity-50'
function time(value?: string | number) {
  return value
    ? new Date(value).toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour12: false,
      })
    : '尚未查询'
}

function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const ref = useRef<HTMLElement>(null),
    close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), textarea, select:not(:disabled), a[href]',
        ) || [],
      )
    ;(
      ref.current?.querySelector<HTMLElement>('[autofocus]') ||
      focusable()[0] ||
      ref.current
    )?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector('[role="alertdialog"]')) return
      if (event.key === 'Escape') {
        event.preventDefault()
        close.current()
        return
      }
      if (event.key === 'Tab') {
        const elements = focusable(),
          first = elements[0],
          last = elements[elements.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !ref.current?.contains(document.activeElement))
        ) {
          event.preventDefault()
          last?.focus()
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !ref.current?.contains(document.activeElement))
        ) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])
  return createPortal(
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <button
        aria-label={`关闭${title}遮罩`}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative flex max-h-[88dvh] w-full max-w-xl flex-col rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-xl outline-none"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
          <h2 className="font-semibold">{title}</h2>
          <button
            className="grid h-10 w-10 place-items-center rounded-md hover:bg-zinc-100"
            aria-label={`关闭${title}`}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="min-h-0 overflow-y-auto p-4">{children}</div>
        {footer ? <div className="flex shrink-0 items-center justify-end gap-2 border-t border-zinc-200 p-3">{footer}</div> : null}
      </section>
    </div>,
    document.body,
  )
}

export default function StarbucksPage() {
  const [state, setState] = useState<StarbucksState | null>(null)
  const [ready, setReady] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('all')
  const [busy, setBusy] = useState(false)
  const lock = useRef(false),
    mounted = useRef(true)
  const [message, setMessage] = useState<MessageDialogState | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [phone, setPhone] = useState(''),
    [pin, setPin] = useState('')
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const [now, setNow] = useState(Date.now())
  const [status, setStatus] = useState<StarbucksCouponStatus | 'all'>('active')
  const [category, setCategory] = useState(''),
    [search, setSearch] = useState('')
  const [selection, setSelection] = useState<string[]>([])
  const [expiryFilter, setExpiryFilter] = useState<StarbucksExpiryFilter>('all')
  const [expiryFrom, setExpiryFrom] = useState('')
  const [expiryTo, setExpiryTo] = useState('')
  const [draftFilters, setDraftFilters] = useState<StarbucksFilterValues | null>(null)
  const filters: StarbucksFilterValues = { accountId: selectedAccountId, status, category, search, expiryFilter, expiryFrom, expiryTo }
  const activeFilterCount = Number(selectedAccountId !== 'all') + Number(status !== 'active') + Number(Boolean(category)) + Number(Boolean(search.trim())) + Number(expiryFilter !== 'all') + Number(Boolean(expiryFrom || expiryTo))
  function applyFilters(next: StarbucksFilterValues) {
    setSelectedAccountId(next.accountId === 'all' || state?.accounts.some(account => account.id === next.accountId) ? next.accountId : 'all')
    setStatus(next.status)
    setCategory(next.category)
    setSearch(next.search)
    setExpiryFilter(next.expiryFilter)
    setExpiryFrom(next.expiryFrom)
    setExpiryTo(next.expiryTo)
  }
  const [codes, setCodes] = useState<StarbucksCode[] | null>(null)
  const [copyFields, setCopyFields] = useState<StarbucksCopyFields>({ ...DEFAULT_STARBUCKS_COPY_FIELDS })
  const copyText = codes ? formatStarbucksCodes(codes, copyFields) : ''
  const [removeAccount, setRemoveAccount] = useState<StarbucksAccount | null>(
    null,
  )
  const [loadFailed, setLoadFailed] = useState(false)
  const account = state?.accounts.find((a) => a.id === selectedAccountId)
  const cooldown = Math.max(
    0,
    Math.ceil(((cooldowns[phone] || 0) - now) / 1000),
  )
  const phoneValid = /^1\d{10}$/.test(phone)
  const backHref =
    new URLSearchParams(location.search).get('from') === 'users'
      ? '/users'
      : '/public'

  function apply(next: StarbucksState) {
    setState(next)
    setSelectedAccountId((current) =>
      current === 'all' || next.accounts.some((a) => a.id === current)
        ? current
        : 'all',
    )
    setUnauthorized(false)
  }
  async function request<T>(
    endpoint: string,
    body?: object,
    method = 'POST',
  ): Promise<T> {
    try {
      return await requestApiData<T>(`/api/starbucks${endpoint}`, {
        method,
        headers: {
          'x-starbucks-client': '1',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
    } catch (error) {
      if (
        error instanceof ApiClientError &&
        error.errorCode === 'SITE_LOGIN_REQUIRED'
      ) {
        setUnauthorized(true)
        setState(null)
        setCodes(null)
        setSelection([])
        setLoginOpen(false)
        setDraftFilters(null)
      }
      throw error
    }
  }
  async function run(task: () => Promise<void>) {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    try {
      await task()
    } catch (error) {
      if (mounted.current) {
        setMessage({
          type: 'error',
          title: '星巴克卡券',
          message:
            error instanceof Error ? error.message : '请求未成功，请重试',
        })
        if (
          error instanceof ApiClientError &&
          error.errorCode === 'SESSION_EXPIRED'
        ) {
          try {
            apply(await request<StarbucksState>('/state', undefined, 'GET'))
          } catch {
            /* Preserve the original error. */
          }
        }
      }
    } finally {
      lock.current = false
      if (mounted.current) setBusy(false)
    }
  }
  async function load() {
    setLoadFailed(false)
    try {
      const next = await request<StarbucksState>('/state', undefined, 'GET')
      if (mounted.current) apply(next)
    } catch (error) {
      if (mounted.current) {
        setLoadFailed(true)
        if (
          !(
            error instanceof ApiClientError &&
            error.errorCode === 'SITE_LOGIN_REQUIRED'
          )
        )
          setMessage({
            type: 'error',
            title: '加载失败',
            message: error instanceof Error ? error.message : '请重试',
          })
      }
    } finally {
      if (mounted.current) setReady(true)
    }
  }
  useEffect(() => {
    mounted.current = true
    document.title = '星巴克卡券'
    void load()
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => {
      mounted.current = false
      window.clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    setSelection([])
    setCodes(null)
  }, [selectedAccountId])
  useEffect(() => {
    setSelection([])
  }, [category, search, status, expiryFilter, expiryFrom, expiryTo])

  const coupons = useMemo(
    () =>
      collectStarbucksCoupons(state?.accounts || [], selectedAccountId, now),
    [state, selectedAccountId, Math.floor(now / 1000)],
  )
  const categories = [
    ...new Set(
      state?.accounts.flatMap((a) => a.coupons.map((c) => c.title)) || [],
    ),
  ].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  const filtered = coupons
    .filter(
      (c) =>
        (status === 'all' || c.status === status) &&
        (!category || c.title === category) &&
        matchesStarbucksExpiry(c, expiryFilter, expiryFrom, expiryTo, now) &&
        (!search.trim() ||
          `${c.title} ${c.discountDesc}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())),
    )
    .sort((a, b) => (a.expiresAt ?? Infinity) - (b.expiresAt ?? Infinity))
  const groups = new Map<string, typeof coupons>()
  for (const coupon of filtered) {
    const items = groups.get(coupon.title)
    if (items) items.push(coupon)
    else groups.set(coupon.title, [coupon])
  }
  const eligible = filtered
    .filter((c) => c.codeAvailable && !c.invalidAt)
    .map((c) => c.key)
  const eligibleSet = new Set(eligible)
  const selected = selection.filter((id) => eligibleSet.has(id))
  const selectedSet = new Set(selected)
  function toggle(ids: string[]) {
    setSelection((current) => {
      const previous = new Set(current),
        incoming = new Set(ids)
      return ids.every((id) => previous.has(id))
        ? current.filter((id) => !incoming.has(id))
        : [...new Set([...current, ...ids])]
    })
  }
  async function reveal(keys: string[], activeOnly = status === 'active') {
    const byAccount = new Map<string, string[]>()
    const byKey = new Map(coupons.map((c) => [c.key, c]))
    for (const key of keys) {
      const coupon = byKey.get(key)
      if (!coupon || coupon.invalidAt || !coupon.codeAvailable) continue
      const ids = byAccount.get(coupon.accountId)
      if (ids) ids.push(coupon.id)
      else byAccount.set(coupon.accountId, [coupon.id])
    }
    const collected: StarbucksCode[] = [],
      failures: string[] = []
    for (const [accountId, ids] of byAccount) {
      for (let index = 0; index < ids.length; index += 1000) {
        try {
          const result = await request<{ codes: StarbucksCode[] }>(
            `/accounts/${accountId}/codes`,
            { ids: ids.slice(index, index + 1000), activeOnly },
          )
          collected.push(...result.codes)
        } catch (error) {
          if (
            error instanceof ApiClientError &&
            error.errorCode === 'SITE_LOGIN_REQUIRED'
          )
            throw error
          failures.push(
            `${state?.accounts.find((a) => a.id === accountId)?.phoneMasked || '账号'}：${error instanceof Error ? error.message : '读取失败'}`,
          )
          break
        }
      }
    }
    if (!collected.length)
      throw new Error(failures.join('\n') || '没有可复制的卡券，请刷新后重试')
    if (mounted.current) {
      setCodes(collected)
      if (failures.length)
        setMessage({
          type: 'info',
          title: '部分卡券读取失败',
          message: `成功读取 ${collected.length} 张卡券，可继续复制成功结果。\n${failures.join('\n')}`,
        })
    }
  }
  async function refreshScope() {
    const targets =
      state?.accounts.filter(
        (a) => selectedAccountId === 'all' || a.id === selectedAccountId,
      ) || []
    const failures: string[] = []
    for (const target of targets) {
      try {
        apply(
          await request<StarbucksState>(`/accounts/${target.id}/refresh`, {}),
        )
      } catch (error) {
        if (
          error instanceof ApiClientError &&
          error.errorCode === 'SITE_LOGIN_REQUIRED'
        )
          throw error
        failures.push(
          `${target.phoneMasked}：${error instanceof Error ? error.message : '刷新失败'}`,
        )
      }
    }
    apply(await request<StarbucksState>('/state', undefined, 'GET'))
    setSelection([])
    if (failures.length)
      setMessage({
        type: 'info',
        title: '部分账号刷新失败',
        message: failures.join('\n'),
      })
  }
  async function copy() {
    if (!codes || !copyText) return
    const text = copyText
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(text)
      else {
        const area = document.createElement('textarea')
        area.value = text
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.append(area)
        area.select()
        try {
          if (!document.execCommand('copy')) throw new Error()
        } finally {
          area.remove()
        }
      }
      setCodes(null)
      setMessage({
        type: 'success',
        title: '复制成功',
        message: `已按卡券类型分类复制 ${codes.length} 张卡券。`,
      })
    } catch {
      setMessage({
        type: 'error',
        title: '未能自动复制',
        message:
          '浏览器未允许剪贴板访问，请在券码文本框中长按或全选后手动复制。',
      })
    }
  }

  return (
    <div className="brand-page min-h-screen text-zinc-900">
      <div className="mx-auto max-w-[1360px] p-3 sm:p-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <BrandLogo brand="starbucks" className="h-11 w-11" />
            <div>
              <h1 className="text-xl font-semibold">星巴克卡券</h1>
              <p className="mt-0.5 text-xs text-zinc-500">好礼券 · 账号管理</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {state?.identity ? <span>{state.identity}</span> : null}
            <a href={backHref} className={control}>
              <ArrowLeft className="h-4 w-4" />
              返回{backHref === '/users' ? '用户管理' : '账号中心'}
            </a>
          </div>
        </header>
        {!ready ? (
          <div
            role="status"
            className="flex items-center gap-2 py-16 text-sm text-zinc-500"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            加载星巴克账号…
          </div>
        ) : unauthorized ? (
          <section className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold">登录后管理星巴克卡券</h2>
            <p className="mt-2 text-sm text-zinc-500">
              使用站点账号登录，星巴克账号与卡券仅对当前用户可见。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a className={primary} href="/public">
                <LogIn className="h-4 w-4" />
                登录账号中心
              </a>
              <a className={control} href="/admin-login?next=%2Fstarbucks">
                管理员登录
              </a>
            </div>
          </section>
        ) : !state ? (
          <button
            className={control}
            disabled={busy}
            onClick={() => void run(load)}
          >
            {loadFailed ? '重新加载' : '加载账号'}
          </button>
        ) : (
          <div className="min-w-0">
            <main className="min-w-0 rounded-lg border border-zinc-200 bg-white">
              {!state.accounts.length ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
                  <Ticket className="h-8 w-8 text-zinc-300" />
                  <h2 className="font-medium">登录星巴克，查询好礼券</h2>
                  <p className="text-sm text-zinc-500">
                    支持多个账号，按券名分组查看和批量复制。
                  </p>
                  <button
                    className={primary}
                    disabled={!state.configured}
                    onClick={() => setLoginOpen(true)}
                  >
                    <LogIn className="h-4 w-4" />
                    登录星巴克
                  </button>
                  {!state.configured ? <p className="text-xs text-amber-700">登录服务尚未配置</p> : null}
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 p-4">
                    <div>
                      <h2 className="font-semibold tabular-nums">
                        {account?.phoneMasked || '全部号码的卡券'}
                      </h2>
                      <div className="mt-1 space-y-1 text-xs text-zinc-500">
                        {account ? (
                          <>
                            <p>会员号 {account.customerMasked}</p>
                            <p>查询时间 {time(account.queriedAt)}</p>
                          </>
                        ) : (
                          <p>
                            {state.accounts.length} 个账号 · {coupons.length}{' '}
                            张卡券 ·{' '}
                            {state.accounts.filter((a) => a.invalidAt).length}{' '}
                            个账号需重新登录
                          </p>
                        )}
                        {account?.invalidAt ? (
                          <p className="text-red-600">登录已失效，请重新登录</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={control}
                        disabled={busy || !state.configured}
                        aria-label="添加星巴克账号"
                        title="添加账号"
                        onClick={() => { setPhone(''); setPin(''); setLoginOpen(true) }}>
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">添加账号</span>
                      </button>
                      <button
                        className={control}
                        disabled={busy}
                        aria-label="刷新卡券"
                        title="刷新卡券"
                        onClick={() => void run(refreshScope)}
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">刷新卡券</span>
                      </button>
                      {account ? (
                        <>
                          <button
                            className={control}
                            disabled={busy}
                            onClick={() => {
                              setPhone('')
                              setPin('')
                              setLoginOpen(true)
                            }}
                          >
                            重新登录
                          </button>
                          <button
                            className={control}
                            disabled={busy}
                            aria-label="移除星巴克账号"
                            onClick={() => setRemoveAccount(account)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="hidden border-b border-zinc-200 p-4 lg:block" data-starbucks-filters="desktop" role="search" aria-label="卡券筛选">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium">筛选条件</h3>
                      <button className="min-h-8 text-xs text-emerald-800 hover:underline" disabled={busy} onClick={() => applyFilters(DEFAULT_STARBUCKS_FILTERS)}>清除筛选</button>
                    </div>
                    <StarbucksCouponFilters value={filters} onChange={applyFilters} accounts={state.accounts} categories={categories} disabled={busy} now={now} />
                  </div>
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 lg:hidden">
                    <span className="min-w-0 text-xs text-zinc-500">{status === 'all' ? '全部' : starbucksStatusLabels[status]} · {filtered.length} 张卡券{activeFilterCount ? ' · 已筛选' : ''}</span>
                    <button className={control} aria-label="高级查询" disabled={busy} onClick={() => setDraftFilters({ ...filters })}>
                      <SlidersHorizontal className="h-4 w-4" />高级查询
                      {activeFilterCount ? <span className="text-xs tabular-nums">{activeFilterCount}</span> : null}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-y border-zinc-100 bg-zinc-50/70 px-4 py-2">
                    <label className="flex min-h-10 items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-emerald-800"
                        aria-label="全选当前筛选卡券"
                        disabled={busy || !eligible.length}
                        checked={
                          !!eligible.length &&
                          eligible.every((id) => selectedSet.has(id))
                        }
                        onChange={() => toggle(eligible)}
                      />
                      全选当前{' '}
                      <span className="text-xs text-zinc-500">
                        已选 {selected.length} 张
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={control}
                        disabled={busy || !eligible.length}
                        onClick={() => void run(() => reveal(eligible))}
                      >
                        <Copy className="h-4 w-4" />
                        复制当前筛选（{eligible.length}）
                      </button>
                      <button
                        className={primary}
                        disabled={busy || !selected.length}
                        onClick={() => void run(() => reveal(selected))}
                      >
                        <Copy className="h-4 w-4" />
                        批量复制
                        {selected.length ? `（${selected.length}）` : ''}
                      </button>
                    </div>
                  </div>
                  {filtered.length ? (
                    <div>
                      {[...groups].map(([title, items]) => {
                        const groupEligible = items
                          .filter((c) => eligibleSet.has(c.key))
                          .map((c) => c.key)
                        return (
                          <section
                            key={title}
                            aria-label={`${title}分类`}
                            className="border-b border-zinc-200 last:border-0"
                          >
                            <div className="flex flex-wrap items-center gap-2 bg-zinc-50/50 px-4 py-2.5">
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-emerald-800"
                                aria-label={`选择全部${title}`}
                                disabled={busy || !groupEligible.length}
                                checked={
                                  !!groupEligible.length &&
                                  groupEligible.every((id) =>
                                    selectedSet.has(id),
                                  )
                                }
                                onChange={() => toggle(groupEligible)}
                              />
                              <h3 className="min-w-0 flex-1 break-words text-sm font-semibold">
                                {title}
                              </h3>
                              <span className="text-xs text-zinc-500">
                                {items.length} 张
                              </span>
                              <button
                                className="ml-auto min-h-9 px-2 text-xs font-medium text-emerald-800 hover:underline disabled:opacity-40"
                                disabled={busy || !groupEligible.length}
                                onClick={() =>
                                  void run(() => reveal(groupEligible))
                                }
                                aria-label={`复制全部${title}`}
                              >
                                复制本类
                              </button>
                            </div>
                            {items.map((c) => (
                              <div
                                key={c.key}
                                className="flex items-center gap-3 border-t border-zinc-100 px-4 py-3"
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 shrink-0 accent-emerald-800"
                                  aria-label={`选择卡券 ${c.phoneMasked} ${c.numberMasked}`}
                                  disabled={busy || !eligibleSet.has(c.key)}
                                  checked={selectedSet.has(c.key)}
                                  onChange={() => toggle([c.key])}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                    <span className="font-medium tabular-nums text-zinc-800">
                                      {c.phoneMasked}
                                    </span>
                                    {c.invalidAt ? (
                                      <span className="text-red-600">
                                        需重新登录
                                      </span>
                                    ) : null}
                                    <span
                                      className={cn(
                                        'font-medium',
                                        c.status === 'active'
                                          ? 'text-emerald-700'
                                          : c.status === 'expired'
                                            ? 'text-zinc-400'
                                            : 'text-zinc-600',
                                      )}
                                    >
                                      {starbucksStatusLabels[c.status]}
                                    </span>
                                    <span className="font-mono text-zinc-500">
                                      {c.numberMasked}
                                    </span>
                                  </div>
                                  <p className="mt-1 break-words text-xs text-zinc-500">
                                    {c.expiryText ||
                                      (c.expiresAt
                                        ? `有效期至 ${time(c.expiresAt)}`
                                        : '有效期未返回')}
                                  </p>
                                  {c.discountDesc ? (
                                    <p className="mt-1 break-words text-xs text-zinc-500">
                                      {c.discountDesc}
                                    </p>
                                  ) : null}
                                </div>
                                <button
                                  className={`${control} shrink-0 px-2.5 text-xs`}
                                  disabled={
                                    busy || !c.codeAvailable || !!c.invalidAt
                                  }
                                  aria-label={`查看券码 ${c.numberMasked}`}
                                  onClick={() =>
                                    void run(() => reveal([c.key], false))
                                  }
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">查看</span>
                                  券码
                                </button>
                              </div>
                            ))}
                          </section>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center text-sm text-zinc-500">
                      <Ticket className="h-6 w-6 text-zinc-300" />
                      <p>
                        {account && !account.queriedAt
                          ? '点击刷新卡券，获取当前账号的好礼券'
                          : coupons.length
                            ? '当前条件下没有卡券'
                            : selectedAccountId === 'all'
                              ? '所有账号暂无好礼券'
                              : '当前账号暂无好礼券'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </div>
      {draftFilters && state ? (
        <Modal title="高级查询" onClose={() => setDraftFilters(null)} footer={<>
          <button type="button" className={control + ' mr-auto'} disabled={busy} onClick={() => setDraftFilters({ ...DEFAULT_STARBUCKS_FILTERS })}>重置</button>
          <button type="button" className={control} onClick={() => setDraftFilters(null)}>取消</button>
          <button type="submit" form="starbucks-filter-form" className={primary} disabled={busy}>确认筛选</button>
        </>}>
          <form id="starbucks-filter-form" onSubmit={event => { event.preventDefault(); applyFilters(draftFilters); setDraftFilters(null) }}>
            <StarbucksCouponFilters value={draftFilters} onChange={setDraftFilters} accounts={state.accounts} categories={categories} disabled={busy} now={now} />
          </form>
        </Modal>
      ) : null}
      {loginOpen ? (
        <Modal
          title="登录星巴克"
          onClose={() => {
            setLoginOpen(false)
            setPin('')
          }}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              void run(async () => {
                const next = await request<
                  StarbucksState & { accountId: string; warning?: string }
                >('/auth/login', { phone, pin })
                if (!mounted.current) return
                apply(next)
                setSelectedAccountId('all')
                setLoginOpen(false)
                setPin('')
                if (next.warning)
                  setMessage({
                    type: 'info',
                    title: '登录结果',
                    message: next.warning,
                  })
              })
            }}
          >
            <label className="block text-sm font-medium">
              手机号
              <PhoneInput
                autoFocus
                value={phone}
                onValueChange={(value) => {
                  setPhone(value)
                  setPin('')
                }}
                placeholder="请输入星巴克账号手机号"
                className={`${input} mt-2 w-full`}
                disabled={busy}
              />
            </label>
            <label className="block text-sm font-medium">
              短信验证码
              <div className="mt-2 flex gap-2">
                <input
                  aria-label="短信验证码"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={pin}
                  maxLength={4}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="4 位验证码"
                  className={`${input} w-full flex-1`}
                  disabled={busy}
                />
                <button
                  type="button"
                  className={`${control} min-w-[112px] shrink-0`}
                  disabled={busy || !phoneValid || cooldown > 0}
                  onClick={() =>
                    void run(async () => {
                      const result = await request<{ cooldownSeconds: number }>(
                        '/auth/sms',
                        { phone },
                      )
                      const until = Date.now() + result.cooldownSeconds * 1000
                      setCooldowns((current) => ({
                        ...current,
                        [phone]: until,
                      }))
                      setNow(Date.now())
                      setMessage({
                        type: 'success',
                        title: '验证码已发送',
                        message: '请填写短信中的 4 位验证码。',
                      })
                    })
                  }
                >
                  {cooldown > 0 ? `${cooldown}s 后重发` : '发送验证码'}
                </button>
              </div>
            </label>
            <button
              type="submit"
              className={`${primary} w-full`}
              disabled={busy || !phoneValid || !/^\d{4}$/.test(pin)}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              登录并查询卡券
            </button>
          </form>
        </Modal>
      ) : null}
      {codes ? (
        <Modal
          title={
            codes.length === 1
              ? '卡券券码'
              : `批量复制 · ${codes.length} 张卡券`
          }
          onClose={() => setCodes(null)}
        >
          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm font-medium">复制内容</legend>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {([
                  ['phone', '号码'],
                  ['code', '卡券券码'],
                  ['expiry', '有效期'],
                ] as const).map(([field, label]) => (
                  <label key={field} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={copyFields[field]}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked
                        setCopyFields((current) => ({ ...current, [field]: checked }))
                      }}
                      className="h-4 w-4 accent-emerald-800"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-xs text-zinc-500">
              复制预览
              <textarea
                aria-label="复制预览"
                readOnly
                value={copyText}
                placeholder="请至少选择一项复制内容"
                className="mt-2 min-h-[170px] w-full resize-y rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </label>
            <button className={`${primary} w-full`} disabled={!copyText} onClick={() => void copy()}>
              <Copy className="h-4 w-4" />
              复制 {codes.length} 张卡券
            </button>
          </div>
        </Modal>
      ) : null}
      {removeAccount ? (
        <Modal title="移除星巴克账号" onClose={() => setRemoveAccount(null)}>
          <p className="text-sm leading-6">
            移除 {removeAccount.phoneMasked}{' '}
            在此工具中保存的登录和卡券数据？星巴克官方账号与卡券不受影响。
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button className={control} onClick={() => setRemoveAccount(null)}>
              取消
            </button>
            <button
              className="min-h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white disabled:opacity-40"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  apply(
                    await request<StarbucksState>(
                      `/accounts/${removeAccount.id}/remove`,
                      undefined,
                      'DELETE',
                    ),
                  )
                  setRemoveAccount(null)
                })
              }
            >
              确认移除
            </button>
          </div>
        </Modal>
      ) : null}
      {message ? (
        <MessageDialog value={message} onClose={() => setMessage(null)} />
      ) : null}
    </div>
  )
}
