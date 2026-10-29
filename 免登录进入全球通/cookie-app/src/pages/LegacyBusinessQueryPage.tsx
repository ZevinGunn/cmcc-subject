import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Inbox, Loader2, RefreshCw, Search, X } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import { ApiClientError, requestApiData } from '@/v2/lib/api'
import { cn } from '@/lib/utils'
import { normalizeLegacyCookieInput } from '../../shared/legacyBusinessCredentials'

type Business = {
  id: string; queryType: string; name: string; productCode: string; fee: string
  detail: string; orderedAt: string; startsAt: string; expiresAt: string
  canUnsubscribe: boolean; status: string; hasContract: boolean; isMain: boolean
}
type Group = { type: string; label: string; items: Business[]; queriedAt: string; error?: string }
type Session = { id: string; accountId: string; phoneMasked: string }
type Prepared = { session: Session; label: string; canUnsubscribe: boolean }
type Query = { groups: Group[]; errors: string[]; canUnsubscribe: boolean }
const control = 'min-h-10 rounded-md border border-zinc-300 px-3 text-sm font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[.98]'
const primary = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[.98]'
const date = (s: string) => !s ? '—' : /^2099/.test(s) ? '长期有效' : /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : s
async function post<T>(path: string, body: unknown): Promise<T> {
  return requestApiData<T>('/api/legacy-business-query/' + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  })
}

export default function LegacyBusinessQueryPage() {
  const [params] = useSearchParams()
  const accountId = params.get('accountId') || ''
  const returnTo = params.get('returnTo') || '/public'
  const backHref = /^\/(?:app\/cmcc-(?:public|user)(?:\/|\?|$)|public(?:\?|$)|users(?:\?|$)|v2(?:\/|$)|$)/.test(returnTo) ? returnTo : '/public'
  const [prepared, setPrepared] = useState<Prepared | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [active, setActive] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [expired, setExpired] = useState(false)
  const [message, setMessage] = useState<MessageDialogState | null>(null)
  const [pending, setPending] = useState<Business | null>(null)
  const [smsCode, setSmsCode] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [mutating, setMutating] = useState<'sms' | 'unsubscribe' | null>(null)
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const [now, setNow] = useState(Date.now())
  const [legacyCookie, setLegacyCookie] = useState('')
  const [appToken, setAppToken] = useState('')
  const [importOpen, setImportOpen] = useState(false)
  const [loginSource, setLoginSource] = useState<'account' | 'import'>('account')
  const cookieInput = useRef<HTMLInputElement>(null)
  const sequence = useRef(0)
  const mutationLock = useRef(false)
  const dialog = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLElement | null>(null)

  function showError(error: unknown, title: string) {
    if (error instanceof ApiClientError && (error.status === 410 || error.errorCode === 'SESSION_EXPIRED')) {
      setExpired(true); setImportOpen(true)
    }
    if (error instanceof ApiClientError && ['LEGACY_APP_LOGIN_REQUIRED', 'INVALID_LEGACY_CONFIG'].includes(error.errorCode || '')) {
      setImportOpen(true); setLoginSource('import')
    }
    if (error instanceof ApiClientError && error.errorCode === 'BUSINESS_UNSUBSCRIBE_FORBIDDEN') {
      setPrepared(p => p ? { ...p, canUnsubscribe: false } : p)
      setPending(null)
    }
    setMessage({ type: 'error', title, message: error instanceof Error ? error.message : '请求失败，请重试',
      errorCode: error instanceof ApiClientError ? error.errorCode : undefined })
  }
  const refresh = useCallback(async (session?: Session, credentials?: { legacyCookie: string; appToken: string }) => {
    const seq = ++sequence.current
    setBusy(true)
    try {
      if (!accountId) throw new Error('缺少账号参数，请从账号菜单进入。')
      let ready = session
      if (!ready) {
        setPrepared(null); setPending(null); setExpired(true)
        const result = await post<Prepared>(`accounts/${encodeURIComponent(accountId)}/prepare`, credentials || {})
        if (sequence.current !== seq) return
        setPrepared(result)
        ready = result.session
        setExpired(false)
      }
      const result = await post<Query>('query', { sessionId: ready.id, accountId })
      if (sequence.current !== seq) return
      setGroups(result.groups)
      setPrepared(p => p ? { ...p, canUnsubscribe: result.canUnsubscribe } : p)
      setExpired(false)
      if (result.errors.length) setMessage({ type: 'error', title: '部分分类查询失败', message: result.errors.join('\n') })
    } catch (error) {
      if (sequence.current === seq) {
        showError(error, '旧版业务查询失败')
      }
    } finally {
      if (sequence.current === seq) { setBusy(false); setAttempted(true) }
    }
  }, [accountId])

  useEffect(() => {
    setPrepared(null); setGroups([]); setPending(null); setActive('all'); setKeyword(''); setAttempted(false); setLegacyCookie(''); setAppToken('')
    setLoginSource('account'); setImportOpen(false); setMessage(null); setExpired(false)
    void refresh()
    // This ref is a request-generation counter, not a DOM node; invalidate the latest request on cleanup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { sequence.current++ }
  }, [refresh])
  useEffect(() => {
    if (!pending) return
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [pending])
  useEffect(() => {
    if (!pending) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (message) return
      if (event.key === 'Escape') setPending(null)
      if (event.key === 'Tab') {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)')
        if (!nodes?.length) return
        const first = nodes[0], last = nodes[nodes.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); trigger.current?.focus() }
  }, [pending, message])

  const items = useMemo(() => groups.filter(g => active === 'all' || g.type === active).flatMap(g => g.items)
    .filter(item => `${item.name} ${item.productCode} ${item.detail}`.toLowerCase().includes(keyword.trim().toLowerCase())), [groups, active, keyword])
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const remaining = pending ? Math.max(0, Math.ceil(((cooldowns[pending.id] || 0) - now) / 1000)) : 0

  async function mutate(kind: 'sms' | 'unsubscribe') {
    if (!prepared || !pending || mutationLock.current) return
    mutationLock.current = true
    setMutating(kind)
    const seq = sequence.current, target = pending
    try {
      const result = await post<{ message: string; cooldownSeconds?: number; cancelledAt?: string }>(
        kind === 'sms' ? 'unsubscribe/sms' : 'unsubscribe',
        { accountId, sessionId: prepared.session.id, businessId: target.id,
          ...(kind === 'unsubscribe' ? { smsCode, confirmed } : {}) },
      )
      if (seq !== sequence.current) return
      if (kind === 'sms') {
        setNow(Date.now())
        setCooldowns(values => ({ ...values, [target.id]: Date.now() + (result.cooldownSeconds || 60) * 1000 }))
      } else {
        setGroups(values => values.map(g => ({ ...g, items: g.items.map(item => item.id === target.id ? { ...item, canUnsubscribe: false, status: 'jt0' } : item) })))
        setPending(null)
      }
      setMessage({ type: 'success', title: kind === 'sms' ? '验证码已发送' : '退订成功', message: result.message + (result.cancelledAt ? `（${result.cancelledAt}）` : '') })
    } catch (error) { if (seq === sequence.current) showError(error, kind === 'sms' ? '验证码发送失败' : '退订失败') }
    finally { mutationLock.current = false; setMutating(null) }
  }

  return <div className="min-h-screen bg-zinc-50 text-zinc-900">
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 sm:px-5">
        <a href={backHref} aria-label="返回账号列表" className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-zinc-100"><ArrowLeft className="h-5 w-5" /></a>
        <BrandLogo className="hidden h-7 w-7 shrink-0 sm:block" />
        <div className="min-w-0 flex-1"><h1 className="text-base font-semibold">旧版已订业务</h1><p className="truncate text-xs text-zinc-500">{prepared ? `${prepared.label || '中国移动账号'} · ${prepared.session.phoneMasked}${loginSource === 'import' ? ' · 导入 CK' : ''}` : busy ? '正在读取所选账号' : '未取得登录态'}</p></div>
        <button className={control} disabled={busy || Boolean(mutating)} onClick={() => {
          if ((expired || !prepared) && loginSource === 'import') {
            setImportOpen(true)
            requestAnimationFrame(() => {
              cookieInput.current?.focus()
              cookieInput.current?.scrollIntoView({ block: 'nearest' })
            })
          } else void refresh(expired ? undefined : prepared?.session)
        }} aria-label={expired || !prepared ? loginSource === 'import' ? '重新导入 CK' : '重新准备登录态' : '刷新业务'}>
          <span className="flex items-center gap-2"><RefreshCw className={cn('h-4 w-4', busy && 'animate-spin motion-reduce:animate-none')} /><span className="hidden sm:inline">{expired || !prepared ? loginSource === 'import' ? '重新导入 CK' : '重新准备登录态' : '刷新'}</span></span>
        </button>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-3 py-4 sm:px-5">
      <details open={importOpen} onToggle={event => setImportOpen(event.currentTarget.open)} className="mb-4 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
        <summary className="cursor-pointer py-1 font-medium">导入 CK 查询</summary>
        <form className="mt-3 grid gap-3" onSubmit={event => {
          event.preventDefault()
          if (busy || mutating || (!legacyCookie.trim() && !appToken.trim())) return
          let cookie: string
          try { cookie = normalizeLegacyCookieInput(legacyCookie) }
          catch (error) { showError(error, 'CK 格式不正确'); return }
          setLoginSource('import')
          void refresh(undefined, { legacyCookie: cookie, appToken: appToken.trim() })
          setLegacyCookie(''); setAppToken('')
        }}>
          <label className="grid gap-1 text-xs text-zinc-600">旧版 CK 或原生 App CK<input ref={cookieInput} type="password" autoComplete="off" spellCheck={false} aria-label="旧版或原生 App CK" placeholder="粘贴 CK 或 Cookie: 请求头" value={legacyCookie} maxLength={16384} onChange={e => setLegacyCookie(e.target.value)} onPaste={event => {
            event.preventDefault()
            try { setLegacyCookie(normalizeLegacyCookieInput(event.clipboardData.getData('text'))) }
            catch (error) { showError(error, 'CK 格式不正确') }
          }} className="h-10 min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-blue-500" /></label>
          <label className="grid gap-1 text-xs text-zinc-600">App 单点 Token（可选）<input type="password" autoComplete="off" spellCheck={false} aria-label="App 单点 Token" value={appToken} maxLength={8192} onChange={e => setAppToken(e.target.value)} className="h-10 min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-blue-500" /></label>
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-zinc-500">仅用于所选号码，不覆盖账号 CK</span><button type="submit" className={primary} disabled={busy || Boolean(mutating) || (!legacyCookie.trim() && !appToken.trim())}>导入 CK 并查询</button></div>
          <div><button type="button" className="min-h-10 text-xs font-medium text-blue-600 disabled:opacity-50" disabled={busy || Boolean(mutating)} onClick={() => {
            setLoginSource('account'); setLegacyCookie(''); setAppToken('')
            void refresh()
          }}>使用账号登录态查询</button></div>
        </form>
      </details>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500"><span>已查询 {total} 项业务</span><span>{groups.map(g => g.queriedAt).filter(Boolean).sort().at(-1) || '尚未查询'}</span></div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-wrap gap-1" role="group" aria-label="业务分类">
          {[{ type: 'all', label: '全部', count: total }, ...groups.map(g => ({ ...g, count: g.items.length }))].map(g =>
            <button key={g.type} aria-pressed={active === g.type} onClick={() => setActive(g.type)} className={cn('min-h-10 rounded-md px-3 text-sm', active === g.type ? 'bg-blue-600 font-medium text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100')}>
              {g.label}<span className="ml-1 text-xs opacity-70">{g.count}</span>
            </button>)}
        </div>
        <label className="flex min-w-0 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 sm:ml-auto sm:max-w-64"><Search className="h-4 w-4 shrink-0 text-zinc-400" /><input value={keyword} onChange={e => setKeyword(e.target.value)} aria-label="搜索业务" placeholder="业务名称或编码" className="h-10 min-w-0 w-full bg-transparent text-sm outline-none" /></label>
      </div>
      {busy ? <div role="status" className="mb-3 flex items-center gap-2 py-3 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />{prepared ? '正在查询业务…' : '正在准备旧版登录态…'}</div> : null}
      <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white" aria-busy={busy}>
        {items.map(item => <article key={item.id} className="px-3 py-4 sm:px-4">
          <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><h2 className="break-words text-sm font-semibold">{item.name}</h2><p className="mt-1 break-all text-xs text-zinc-500">{groups.find(g => g.type === item.queryType)?.label} · {item.productCode || '无业务编码'}{item.isMain ? ' · 主套餐' : ''}{item.hasContract ? ' · 含合约' : ''}</p></div>
            <div className="shrink-0 text-right"><div className="text-sm font-medium">{item.fee || '—'}</div>
              {item.status === 'jt0' ? <span className="mt-2 block text-xs text-zinc-500">已退订</span> : prepared?.canUnsubscribe && item.canUnsubscribe ? <button className="mt-2 min-h-10 rounded-md border border-rose-200 px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50 active:scale-[.98]" disabled={busy || expired || Boolean(mutating)} onClick={e => { trigger.current = e.currentTarget; setPending(item); setSmsCode(''); setConfirmed(false); setNow(Date.now()) }}>退订</button> : null}
            </div>
          </div>
          <dl className="mt-3 grid gap-x-4 gap-y-1 text-xs text-zinc-600 sm:grid-cols-3"><div>订购：{date(item.orderedAt)}</div><div>生效：{date(item.startsAt)}</div><div>到期：{date(item.expiresAt)}</div></dl>
          {item.detail ? <details className="mt-2 text-xs leading-6 text-zinc-500"><summary className="cursor-pointer select-none">业务详情</summary><p className="mt-1 whitespace-pre-wrap break-words">{item.detail}</p></details> : null}
        </article>)}
        {!items.length && !busy && attempted ? <div className="flex flex-col items-center gap-2 px-4 py-14 text-sm text-zinc-500"><Inbox className="h-7 w-7 text-zinc-300" />{groups.some(g => g.error) ? '部分业务尚未查询成功，请刷新重试' : groups.length ? '没有匹配的业务' : '尚未取得业务，请重新准备登录态'}</div> : null}
      </div>
    </main>
    {pending ? createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
      <button aria-label="关闭退订遮罩" className="absolute inset-0 bg-black/45" onClick={() => setPending(null)} />
      <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="legacy-unsubscribe-title" className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-md flex-col rounded-lg bg-white outline-none">
        <header className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3"><h2 id="legacy-unsubscribe-title" className="flex-1 font-semibold">确认退订业务</h2><button className="grid h-10 w-10 place-items-center rounded-md hover:bg-zinc-100" aria-label="关闭退订弹窗" onClick={() => setPending(null)}><X className="h-5 w-5" /></button></header>
        <div className="space-y-4 overflow-y-auto p-4 text-sm">
          <dl className="space-y-2"><div className="flex justify-between gap-3"><dt className="shrink-0 text-zinc-500">手机号</dt><dd>{prepared?.session.phoneMasked}</dd></div><div className="flex justify-between gap-3"><dt className="shrink-0 text-zinc-500">业务名称</dt><dd className="break-words text-right font-medium">{pending.name}</dd></div><div className="flex justify-between gap-3"><dt className="text-zinc-500">资费</dt><dd>{pending.fee || '—'}</dd></div></dl>
          <label className="flex items-start gap-2 text-sm leading-6"><input type="checkbox" className="mt-1 h-4 w-4 shrink-0" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /><span>确认退订此业务，退订后不再享用该服务，生效时间以移动短信通知为准。</span></label>
          <label className="block space-y-2"><span className="text-xs text-zinc-500">退订短信验证码</span><span className="flex gap-2"><input autoComplete="one-time-code" inputMode="numeric" maxLength={6} value={smsCode} onChange={e => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))} aria-label="退订短信验证码" className="h-11 min-w-0 flex-1 rounded-md border border-zinc-300 px-3 outline-none focus:border-blue-500" /><button className={control + ' shrink-0'} disabled={Boolean(mutating) || remaining > 0 || !confirmed || expired} onClick={() => void mutate('sms')}>{mutating === 'sms' ? '发送中…' : remaining > 0 ? `${remaining}s 后重发` : '发送验证码'}</button></span></label>
        </div>
        <footer className="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3"><button className={control} onClick={() => setPending(null)}>取消</button><button className={primary + ' bg-rose-600 hover:bg-rose-700'} disabled={!confirmed || !/^\d{6}$/.test(smsCode) || Boolean(mutating) || expired} onClick={() => void mutate('unsubscribe')}>{mutating === 'unsubscribe' ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : null}{mutating === 'unsubscribe' ? '提交中…' : '确认退订'}</button></footer>
      </section>
    </div>, document.body) : null}
    {message ? <MessageDialog value={message} onClose={() => { setMessage(null); dialog.current?.focus() }} /> : null}
  </div>
}
