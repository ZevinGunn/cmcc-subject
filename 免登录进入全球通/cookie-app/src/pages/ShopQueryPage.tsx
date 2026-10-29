import BrandLogo from '@/components/BrandLogo'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Inbox,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import BusinessSearchDialog, { HighlightText, type BusinessSearchItem } from '@/components/BusinessSearchDialog'

type ApiResp<T> =
  | { ok: true; data: T; message?: string; requestId?: string }
  | { ok: false; message: string; errorCode?: string; requestId?: string }

type ShopSession = {
  id: string
  accountId: string
  phone: string
  label?: string
  createdAt: number
  updatedAt: number
}

type AccountSummary = {
  id: string
  label?: string
  phone?: string
  phoneMasked?: string
  displayPhone?: string
}

type ShopBusiness = {
  id: string
  prodType: string
  categoryLabel: string
  busiName: string
  busiCode: string
  busiType: string
  bizCode: string | null
  spid: string | null
  busiFee: string
  orderedTime: string
  effectTime: string
  extinctTime: string
  unsubscribeTime: string
  isOrdered: string
  isUnOrder: string
  canUnsubscribe: true
}

type ShopGroup = {
  prodType: string
  label: string
  items: ShopBusiness[]
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResp<T>> {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await response.text()
  try {
    return JSON.parse(text) as ApiResp<T>
  } catch {
    return {
      ok: false,
      message: `接口返回格式异常（HTTP ${response.status}）`,
      errorCode: 'INVALID_JSON',
    }
  }
}

function maskPhone(value?: string): string {
  const phone = String(value || '')
  return /^1\d{10}$/.test(phone) ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : phone || '未获取'
}

function formatDate(value?: string): string {
  const text = String(value || '')
  if (!text) return '--'
  if (/^\d{8}$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`
  return text
}

function formatQueryTime(value?: string): string {
  const text = String(value || '')
  if (/^\d{14}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)} ${text.slice(8, 10)}:${text.slice(10, 12)}`
  }
  return text || '--'
}

function originalStatus(item: ShopBusiness): string {
  if (item.isOrdered === '01') return '移动侧标记已退订'
  if (item.isUnOrder === '01') return '移动侧标记可退订'
  return '可提交尝试'
}

export default function ShopQueryPage() {
  const [searchParams] = useSearchParams()
  const accountId = searchParams.get('accountId')?.trim() || ''
  const [session, setSession] = useState<ShopSession | null>(null)
  const [account, setAccount] = useState<AccountSummary | null>(null)
  const [groups, setGroups] = useState<ShopGroup[]>([])
  const [canUnsubscribe, setCanUnsubscribe] = useState(false)
  const [queriedAt, setQueriedAt] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [pendingTargetId, setPendingTargetId] = useState('')
  const [preparing, setPreparing] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [messageDialog, setMessageDialog] = useState<MessageDialogState | null>(null)
  const [pending, setPending] = useState<ShopBusiness | null>(null)
  const [smsCode, setSmsCode] = useState('')
  const [sendingSms, setSendingSms] = useState(false)
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<number | null>(null)
  const preparedAccountRef = useRef<string | null>(null)

  const allItems = useMemo(() => groups.flatMap((group) => group.items), [groups])
  const filteredItems = useMemo(() =>
      activeType === 'all'
        ? allItems
        : groups.find((group) => group.prodType === activeType)?.items || [],
    [activeType, allItems, groups],
  )
  const searchItems = useMemo<BusinessSearchItem[]>(() => groups.flatMap((group) =>
    group.items.map((item) => ({
      id: `shop:${group.prodType}:${item.id}`,
      title: item.busiName || '未命名业务',
      subtitle: `${group.label} · ${item.busiCode || '无业务编码'}`,
      searchText: `${item.categoryLabel} ${item.bizCode || ''}`,
    }))), [groups])

  useEffect(() => {
    if (!pendingTargetId) return
    const timer = window.setTimeout(() => {
      const target = document.getElementById(pendingTargetId)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
      setPendingTargetId('')
    }, 80)
    return () => window.clearTimeout(timer)
  }, [activeType, pendingTargetId])

  function stopTimer() {
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  function startCountdown(seconds: number) {
    stopTimer()
    setCountdown(seconds)
    timerRef.current = window.setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          stopTimer()
          return 0
        }
        return value - 1
      })
    }, 1000)
  }

  const queryBusiness = useCallback(async (activeSession: ShopSession, activeAccountId: string, notify = false) => {
    setQuerying(true)
    try {
      const result = await postJson<{ groups: ShopGroup[]; queriedAt: string }>(
        '/api/shop-query/query',
        { sessionId: activeSession.id, accountId: activeAccountId },
      )
      if (!result.ok) {
        setMessageDialog({
          type: 'error',
          title: '查询失败',
          message: result.message || '业务查询失败',
          errorCode: 'errorCode' in result ? result.errorCode : undefined,
        })
        return
      }
      setGroups(result.data.groups || [])
      setQueriedAt(result.data.queriedAt || '')
      if (notify) {
        setMessageDialog({
          type: 'success',
          title: '查询完成',
          message: `已刷新 ${result.data.groups.flatMap((group) => group.items).length} 项业务。`,
        })
      }
    } catch (reason) {
      setMessageDialog({
        type: 'error',
        title: '查询失败',
        message: reason instanceof Error ? reason.message : '业务查询失败',
      })
    } finally {
      setQuerying(false)
    }
  }, [])

  const prepare = useCallback(async () => {
    if (!accountId) {
      setMessageDialog({ type: 'error', title: '无法直接访问', message: '缺少账号参数，请从账号功能入口进入。' })
      return
    }
    setCanUnsubscribe(false)
    setPreparing(true)
    try {
      const result = await postJson<{
        session: ShopSession
        account: AccountSummary
        capabilities: { canUnsubscribe: boolean }
      }>(
        `/api/shop-query/accounts/${encodeURIComponent(accountId)}/prepare`,
        {},
      )
      if (!result.ok) {
        setMessageDialog({
          type: 'error',
          title: '登录态准备失败',
          message: result.message || '商城登录态准备失败',
          errorCode: 'errorCode' in result ? result.errorCode : undefined,
        })
        return
      }
      setSession(result.data.session)
      setAccount(result.data.account)
      setCanUnsubscribe(Boolean(result.data.capabilities?.canUnsubscribe))
      await queryBusiness(result.data.session, accountId)
    } catch (reason) {
      setMessageDialog({
        type: 'error',
        title: '登录态准备失败',
        message: reason instanceof Error ? reason.message : '商城登录态准备失败',
      })
    } finally {
      setPreparing(false)
    }
  }, [accountId, queryBusiness])

  useEffect(() => {
    if (preparedAccountRef.current === accountId) return
    preparedAccountRef.current = accountId
    void prepare()
    return () => stopTimer()
  }, [accountId, prepare])

  function openUnsubscribe(item: ShopBusiness) {
    setPending(item)
    setSmsCode('')
    setCountdown(0)
    stopTimer()
  }

  function closeDialog() {
    if (unsubscribing) return
    setPending(null)
    stopTimer()
  }

  async function sendSms() {
    if (!session || !pending) return
    setSendingSms(true)
    try {
      const result = await postJson<{ sent: true; cooldownSeconds: number }>(
        '/api/shop-query/unsubscribe/sms',
        { accountId, sessionId: session.id, businessId: pending.id },
      )
      if (!result.ok) {
        setMessageDialog({
          type: 'error',
          title: '发送失败',
          message: result.message || '验证码发送失败',
          errorCode: 'errorCode' in result ? result.errorCode : undefined,
        })
        return
      }
      startCountdown(result.data.cooldownSeconds || 60)
      setMessageDialog({ type: 'success', title: '发送成功', message: result.message || '退订验证码已发送。' })
    } catch (reason) {
      setMessageDialog({
        type: 'error',
        title: '发送失败',
        message: reason instanceof Error ? reason.message : '验证码发送失败',
      })
    } finally {
      setSendingSms(false)
    }
  }

  async function confirmUnsubscribe() {
    if (!session || !pending) return
    setUnsubscribing(true)
    try {
      const result = await postJson<{ success: true; message: string }>(
        '/api/shop-query/unsubscribe',
        { accountId, sessionId: session.id, businessId: pending.id, smsCode },
      )
      if (!result.ok) {
        setMessageDialog({
          type: 'error',
          title: '退订失败',
          message: result.message || '退订失败',
          errorCode: 'errorCode' in result ? result.errorCode : undefined,
        })
        return
      }
      const businessName = pending.busiName || '当前业务'
      setPending(null)
      stopTimer()
      setMessageDialog({
        type: 'success',
        title: '退订成功',
        message: result.message || result.data.message || `${businessName}退订请求已受理。`,
      })
      await queryBusiness(session, accountId)
    } catch (reason) {
      setMessageDialog({
        type: 'error',
        title: '退订失败',
        message: reason instanceof Error ? reason.message : '退订失败',
      })
    } finally {
      setUnsubscribing(false)
    }
  }

  const displayPhone = account?.displayPhone || account?.phoneMasked || maskPhone(session?.phone)
  const accountLabel = account?.label || session?.label || '中国移动账号'

  return (
    <div className="brand-page min-h-screen overflow-x-hidden text-zinc-900">
      <div className="mx-auto min-h-screen w-full min-w-[320px] max-w-[680px] bg-white/70">
      <header className="brand-page relative px-3 pb-6 pt-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            title="返回"
            onClick={() => window.history.back()}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/80 text-zinc-600 shadow-sm hover:bg-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="brand-heading text-base font-semibold sm:text-lg"><BrandLogo className="h-6 w-6" />查询和退订</h1>
            <p className="truncate text-xs text-zinc-500">{accountLabel} · {displayPhone}</p>
          </div>
          <button
            type="button"
            title="搜索业务"
            aria-label="搜索业务"
            onClick={() => setSearchOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/80 text-zinc-600 shadow-sm hover:bg-white">
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="刷新查询"
            disabled={!session || querying || preparing}
            onClick={() => session && void queryBusiness(session, accountId, true)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold',
              session && !querying && !preparing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-blue-200 text-white',
            )}>
            <RefreshCw className={cn('h-4 w-4', querying && 'animate-spin')} />
            <span className="hidden sm:inline">刷新</span>
          </button>
        </div>
      </header>

      <main className="-mt-3 min-h-[calc(100vh-64px)] rounded-t-[20px] bg-white px-3 py-3">
        <section className="mb-3 rounded-2xl bg-white px-3 py-3 shadow-[0_8px_22px_rgba(30,50,80,0.06)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs text-zinc-500">账号</div>
              <div className="mt-1 text-sm font-semibold">{displayPhone}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">查询结果</div>
              <div className="mt-1 text-sm font-semibold">{allItems.length} 项业务</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">更新时间</div>
              <div className="mt-1 text-sm font-semibold">{formatQueryTime(queriedAt)}</div>
            </div>
          </div>
          {canUnsubscribe ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>所有查询结果均可提交退订尝试，最终是否受理由中国移动接口按产品、合约和账户状态判定。</span>
            </div>
          ) : null}
        </section>

        <section>
          <div className="sticky top-0 z-30 -mx-3 mb-3 bg-white/95 px-3 pb-3 pt-1 backdrop-blur">
            <div className="flex max-w-full gap-1 overflow-x-auto border-b border-zinc-100 pb-0.5">
              <button
                type="button"
                onClick={() => setActiveType('all')}
                className={cn(
                  'relative h-10 shrink-0 px-3 text-sm font-bold',
                  activeType === 'all' ? 'text-zinc-950' : 'text-zinc-500',
                )}>
                全部 {allItems.length}
                {activeType === 'all' ? <span className="absolute bottom-0 left-1/2 h-0.5 w-9 -translate-x-1/2 rounded-full bg-blue-500" /> : null}
              </button>
              {groups.map((group) => (
                <button
                  key={group.prodType}
                  type="button"
                  onClick={() => setActiveType(group.prodType)}
                  className={cn(
                    'relative h-10 shrink-0 px-3 text-sm font-bold',
                    activeType === group.prodType
                      ? 'text-zinc-950'
                      : 'text-zinc-500',
                  )}>
                  {group.label} {group.items.length}
                  {activeType === group.prodType ? <span className="absolute bottom-0 left-1/2 h-0.5 w-9 -translate-x-1/2 rounded-full bg-blue-500" /> : null}
                </button>
              ))}
            </div>
          </div>

          {preparing || querying ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              {preparing ? '正在置换商城登录态' : '正在查询业务'}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 text-sm text-zinc-400">
              <Inbox className="h-8 w-8" />
              <span>{groups.length ? '当前筛选无结果' : '暂无查询结果'}</span>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <article id={`shop-business-${item.id}`} tabIndex={-1} key={item.id} className="rounded-2xl bg-white px-3.5 py-3 shadow-[0_8px_22px_rgba(30,50,80,0.07)] outline-none focus:ring-2 focus:ring-yellow-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-sm font-semibold leading-6"><HighlightText text={item.busiName || '未命名业务'} keyword={keyword} /></h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span><HighlightText text={item.categoryLabel} keyword={keyword} /></span>
                        <span className="font-mono"><HighlightText text={item.busiCode || '--'} keyword={keyword} /></span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] text-blue-600">
                      {originalStatus(item)}
                    </span>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    <div><dt className="text-zinc-400">资费</dt><dd className="mt-1 font-medium text-zinc-700">{item.busiFee || '--'}</dd></div>
                    <div><dt className="text-zinc-400">订购时间</dt><dd className="mt-1 font-medium text-zinc-700">{formatDate(item.orderedTime)}</dd></div>
                    <div><dt className="text-zinc-400">生效时间</dt><dd className="mt-1 font-medium text-zinc-700">{formatDate(item.effectTime)}</dd></div>
                    <div><dt className="text-zinc-400">失效时间</dt><dd className="mt-1 break-words font-medium text-zinc-700">{formatDate(item.extinctTime)}</dd></div>
                  </dl>
                  {canUnsubscribe ? (
                    <div className="mt-4 flex justify-end border-t border-zinc-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openUnsubscribe(item)}
                        className="inline-flex h-8 min-w-[96px] items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 hover:border-blue-200 hover:text-blue-600">
                        <Trash2 className="h-3.5 w-3.5" />
                        尝试退订
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      </div>

      <BusinessSearchDialog
        open={searchOpen}
        items={searchItems}
        onClose={() => setSearchOpen(false)}
        onSelect={(item, nextKeyword) => {
          const [, prodType, id] = item.id.split(':')
          setKeyword(nextKeyword)
          setActiveType(prodType || 'all')
          setPendingTargetId(`shop-business-${id}`)
        }}
      />

      {pending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4" onClick={closeDialog}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsubscribe-title"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[480px] rounded-[24px] bg-white px-5 pb-5 pt-5 shadow-2xl">
            <div className="mb-4 text-center text-[24px] font-bold">退订确认</div>
            <button type="button" title="关闭" onClick={closeDialog} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200">
                <X className="h-5 w-5" />
              </button>
            <div className="mb-4 border-t border-zinc-100" />
            <div className="mb-5 text-[16px] leading-7 text-zinc-700">
              您好！您的 {displayPhone} 手机号码即将尝试退订
              <span className="text-blue-600">“{pending.busiName || '未命名业务'}”</span>
              业务。如需办理，请获取并输入短信验证码。
            </div>
            <dl className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 p-3 text-xs">
              <div><dt className="text-zinc-400">业务编码</dt><dd className="mt-1 break-all font-mono text-zinc-700">{pending.busiCode}</dd></div>
              <div><dt className="text-zinc-400">业务分类</dt><dd className="mt-1 text-zinc-700">{pending.categoryLabel}</dd></div>
            </dl>
            <label className="block">
              <span className="sr-only">短信验证码</span>
              <div className="flex h-12 items-center rounded-xl border border-zinc-200 px-4">
                <input
                  value={smsCode}
                  onChange={(event) => setSmsCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6 位验证码"
                  className="min-w-0 flex-1 text-base outline-none placeholder:text-zinc-300"
                />
                <button
                  type="button"
                  disabled={sendingSms || countdown > 0}
                  onClick={() => void sendSms()}
                  className={cn(
                    'ml-3 inline-flex shrink-0 items-center justify-center gap-1.5 text-base font-bold',
                    !sendingSms && countdown === 0
                      ? 'text-blue-500'
                      : 'cursor-not-allowed text-blue-300',
                  )}>
                  {sendingSms ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquareText className="h-3.5 w-3.5" />}
                  {countdown > 0 ? `${countdown}s` : sendingSms ? '发送中' : '发送验证码'}
                </button>
              </div>
            </label>
            <div className="mb-5 mt-3 text-center text-sm text-zinc-400">验证码有效期5分钟，重新获取间隔1分钟</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={closeDialog} className="h-12 rounded-full bg-zinc-100 text-lg font-bold text-zinc-600">取消</button>
              <button
                type="button"
                disabled={unsubscribing || !/^\d{6}$/.test(smsCode)}
                onClick={() => void confirmUnsubscribe()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-500 text-lg font-bold text-white disabled:bg-blue-200">
                {unsubscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {unsubscribing ? '提交中' : '确认'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {messageDialog ? <MessageDialog value={messageDialog} onClose={() => setMessageDialog(null)} /> : null}
    </div>
  )
}
