import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Minus,
  PackagePlus,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShoppingCart,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import {
  addAigouCartItem,
  addAllAigouCartItems,
  calculateAigouCart,
  editAigouCartItem,
  loadAigouCart,
  loadAigouCartCatalog,
  sendAigouCartSms,
  submitAigouCartOrder,
  type AigouCartBatchResult,
  type AigouCartCalculateResult,
  type AigouCartCallback,
  type AigouCartCatalogItem,
  type AigouCartItem,
  type AigouCartOrderResult,
  type AigouCartSmsResult,
  type AigouRiskContext,
} from '../lib/aigouOrderApi'
import V2OrderResponseDetails, { orderFailureResponse } from './V2OrderResponseDetails'
import V2SearchableAccountSelect from './V2SearchableAccountSelect'

function money(value?: number): string {
  return value === undefined ? '--' : `¥${(value / 100).toFixed(2)}`
}

function callbackFailure(error: unknown): AigouCartCallback {
  const failure = orderFailureResponse(error)
  return { success: false, resultCode: failure.code, message: failure.message, response: failure.response }
}

function CallbackPanel({ result, title }: { result: AigouCartCallback; title: string }) {
  return (
    <div className={cn('border-t px-4 py-3', result.success ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40')}>
      <div className="flex items-start gap-2">
        {result.success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />}
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-950">{result.message}</p>
          <p className="mt-1 font-mono text-xs text-zinc-500">业务码 {result.resultCode || '--'}</p>
        </div>
      </div>
      <V2OrderResponseDetails response={result.response} title={title} />
    </div>
  )
}

function keyOf(item: AigouCartItem): string {
  return item.preSubmitInstId
}

function RiskFields({ value, onChange }: { value: AigouRiskContext; onChange: (value: AigouRiskContext) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(['grRiskP1', 'grRiskP2', 'grRiskP3', 'wasmParams', 'operDfp'] as const).map((key) => (
        <label key={key} className="block space-y-1.5">
          <span className="text-xs font-medium text-zinc-700">{key}</span>
          <input
            value={value[key] || ''}
            onChange={(event) => onChange({ ...value, [key]: event.target.value })}
            className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      ))}
    </div>
  )
}

export default function V2AigouShoppingCart({ accounts, initialAccountId = '' }: { accounts: BusinessOrderAccount[]; initialAccountId?: string }) {
  const [accountId, setAccountId] = useState(initialAccountId)
  const [catalog, setCatalog] = useState<AigouCartCatalogItem[]>([])
  const [catalogMeta, setCatalogMeta] = useState({ cartableCount: 0, pendingMappingCount: 0 })
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<AigouCartItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState('')
  const [listResult, setListResult] = useState<AigouCartCallback>()
  const [actionResult, setActionResult] = useState<AigouCartCallback>()
  const [batchResult, setBatchResult] = useState<AigouCartBatchResult>()
  const [calculation, setCalculation] = useState<AigouCartCalculateResult>()
  const [smsResult, setSmsResult] = useState<AigouCartSmsResult>()
  const [orderResult, setOrderResult] = useState<AigouCartOrderResult | AigouCartCallback>()
  const [cooldown, setCooldown] = useState(0)
  const [smsCode, setSmsCode] = useState('')
  const [busiOpId, setBusiOpId] = useState('')
  const [payType, setPayType] = useState(1)
  const [confirmation, setConfirmation] = useState('')
  const [riskOpen, setRiskOpen] = useState(false)
  const [risk, setRisk] = useState<AigouRiskContext>({})
  const [customOpen, setCustomOpen] = useState(false)
  const [custom, setCustom] = useState({ specId: '', name: '', selfChannelCode: 'P00000011939', referer: 'detailA' })

  useEffect(() => {
    void loadAigouCartCatalog().then((data) => {
      setCatalog(data.items)
      setCatalogMeta({ cartableCount: data.cartableCount, pendingMappingCount: data.pendingMappingCount })
    }).catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!cooldown) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const cartableCatalog = useMemo(() => catalog.filter((item) => item.cartable && item.name.toLowerCase().includes(query.trim().toLowerCase())), [catalog, query])
  const pendingCatalog = useMemo(() => catalog.filter((item) => !item.cartable), [catalog])
  const selectedItems = useMemo(() => cart.filter((item) => selected.has(keyOf(item))), [cart, selected])
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.number, 0)
  const canSubmit = Boolean(selectedItems.length && /^(?:\d{4}|\d{6})$/.test(smsCode) && busiOpId && confirmation === '确认订购' && !busy)

  function resetOrderState() {
    setCalculation(undefined)
    setSmsResult(undefined)
    setOrderResult(undefined)
    setSmsCode('')
    setBusiOpId('')
    setConfirmation('')
    setCooldown(0)
  }

  function changeAccount(value: string) {
    setAccountId(value)
    setCart([])
    setSelected(new Set())
    setListResult(undefined)
    setActionResult(undefined)
    setBatchResult(undefined)
    resetOrderState()
  }

  async function queryCart(preserveSelection = false) {
    if (!accountId) return
    const previous = preserveSelection ? new Set(selected) : new Set<string>()
    setBusy('list')
    try {
      const result = await loadAigouCart(accountId)
      setListResult(result)
      if (result.success) {
        const items = result.data?.items || []
        setCart(items)
        setSelected(new Set(items.filter((item) => previous.has(keyOf(item))).map(keyOf)))
      }
    } catch (error) {
      setListResult(callbackFailure(error))
    } finally {
      setBusy('')
    }
  }

  async function addItem(itemId: string) {
    setBusy(`add:${itemId}`)
    setActionResult(undefined)
    try {
      const result = await addAigouCartItem(accountId, { itemId })
      setActionResult(result)
      if (result.success) await queryCart(true)
    } catch (error) {
      setActionResult(callbackFailure(error))
    } finally {
      setBusy('')
    }
  }

  async function addCustom() {
    setBusy('add:custom')
    setActionResult(undefined)
    try {
      const result = await addAigouCartItem(accountId, { ...custom, number: 1, busiType: 'C3' })
      setActionResult(result)
      if (result.success) await queryCart(true)
    } catch (error) {
      setActionResult(callbackFailure(error))
    } finally {
      setBusy('')
    }
  }

  async function addAll() {
    if (!window.confirm(`确认依次提交 ${catalogMeta.cartableCount} 项权益的加车请求？`)) return
    setBusy('add-all')
    setBatchResult(undefined)
    setActionResult(undefined)
    try {
      const result = await addAllAigouCartItems(accountId)
      setBatchResult(result)
      await queryCart(true)
    } catch (error) {
      setActionResult(callbackFailure(error))
    } finally {
      setBusy('')
    }
  }

  async function editQuantity(item: AigouCartItem, next: number) {
    if (next < 1 || next > 10) return
    setBusy(`edit:${keyOf(item)}`)
    setActionResult(undefined)
    resetOrderState()
    try {
      const result = await editAigouCartItem(accountId, item, next)
      setActionResult(result)
      if (result.success) await queryCart(true)
    } catch (error) {
      setActionResult(callbackFailure(error))
    } finally {
      setBusy('')
    }
  }

  function toggleItem(item: AigouCartItem) {
    setSelected((current) => {
      const next = new Set(current)
      const key = keyOf(item)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    resetOrderState()
  }

  async function calculate() {
    setBusy('calculate')
    try {
      const result = await calculateAigouCart(accountId, selectedItems)
      setCalculation(result)
    } catch (error) {
      setCalculation(callbackFailure(error) as AigouCartCalculateResult)
    } finally {
      setBusy('')
    }
  }

  async function sendSms() {
    setBusy('sms')
    try {
      const result = await sendAigouCartSms(accountId, selectedItems)
      setSmsResult(result)
      setCalculation(result.data?.calculation)
      if (result.success && result.data?.busiOpId) {
        setBusiOpId(result.data.busiOpId)
        setCooldown(result.data.cooldownSeconds || 60)
      }
    } catch (error) {
      setSmsResult(callbackFailure(error) as AigouCartSmsResult)
    } finally {
      setBusy('')
    }
  }

  async function submit() {
    setBusy('submit')
    try {
      setOrderResult(await submitAigouCartOrder({ accountId, items: selectedItems, payType, smsCode, busiOpId, riskContext: risk }))
    } catch (error) {
      setOrderResult(callbackFailure(error))
    } finally {
      setSmsCode('')
      setConfirmation('')
      setBusy('')
    }
  }

  async function restart() {
    setSelected(new Set())
    setActionResult(undefined)
    setBatchResult(undefined)
    resetOrderState()
    await queryCart()
  }

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-200 bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">账号购物车</h2>
            <p className="mt-0.5 text-xs text-zinc-500">读取当前账号的爱购商城购物车</p>
          </div>
          <button type="button" onClick={() => void queryCart()} disabled={!accountId || Boolean(busy)} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-xs font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50">
            {busy === 'list' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}查询购物车
          </button>
        </header>
        <div className="p-4"><V2SearchableAccountSelect accounts={accounts} value={accountId} onChange={changeAccount} allowEmpty={false} /></div>
        {listResult && !listResult.success ? <CallbackPanel result={listResult} title="购物车查询接口具体响应" /> : null}
      </section>

      <section className="rounded-md border border-zinc-200 bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">可加车权益</h2>
            <p className="mt-0.5 text-xs text-zinc-500">已验证参数 {catalogMeta.cartableCount} 项 · 待映射 {catalogMeta.pendingMappingCount} 项</p>
          </div>
          <button type="button" onClick={() => void addAll()} disabled={!accountId || Boolean(busy) || !catalogMeta.cartableCount} className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-700 px-3 text-xs font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50">
            {busy === 'add-all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackagePlus className="h-4 w-4" />}全部加入购物车
          </button>
        </header>
        <div className="border-b border-zinc-100 p-4">
          <label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索权益" className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
        </div>
        <div className="divide-y divide-zinc-100">
          {cartableCatalog.map((item) => (
            <div key={item.id} className="flex min-h-14 items-center gap-3 px-4 py-2.5">
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-zinc-900" title={item.name}>{item.name}</p><p className="mt-0.5 font-mono text-[11px] text-zinc-500">{item.specId} · {money(item.price)}</p></div>
              <button type="button" title="加入购物车" aria-label={`将${item.name}加入购物车`} onClick={() => void addItem(item.id)} disabled={!accountId || Boolean(busy)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-zinc-300 text-zinc-700 transition-transform duration-150 hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50">
                {busy === `add:${item.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
          ))}
          {!cartableCatalog.length ? <div className="px-4 py-8 text-center text-sm text-zinc-500">没有匹配的可加车权益</div> : null}
        </div>
        <div className="border-t border-zinc-200 px-4 py-3">
          <button type="button" onClick={() => setCustomOpen((value) => !value)} aria-expanded={customOpen} className="inline-flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950">{customOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}自定义加车参数</button>
          {customOpen ? <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              ['specId', '商品 specId'], ['name', '商品名称'], ['selfChannelCode', '自渠道码'], ['referer', '页面来源'],
            ] as const).map(([key, label]) => <label key={key} className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">{label}</span><input value={custom[key]} onChange={(event) => setCustom({ ...custom, [key]: event.target.value })} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>)}
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end"><button type="button" onClick={() => void addCustom()} disabled={!accountId || !custom.specId || Boolean(busy)} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-800 transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"><PackagePlus className="h-4 w-4" />加入购物车</button></div>
          </div> : null}
        </div>
        {pendingCatalog.length ? <details className="border-t border-zinc-200 px-4 py-3"><summary className="cursor-pointer text-xs font-medium text-zinc-700">待映射权益（{pendingCatalog.length}）</summary><div className="mt-3 divide-y divide-zinc-100 border-y border-zinc-100">{pendingCatalog.map((item) => <div key={item.id} className="py-2.5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm text-zinc-800">{item.name}</span><span className="font-mono text-xs text-zinc-500">skuid {item.directSkuId}</span></div><p className="mt-1 text-xs text-amber-700">{item.unavailableReason}</p></div>)}</div></details> : null}
        {actionResult ? <CallbackPanel result={actionResult} title="加车或编辑接口具体响应" /> : null}
        {batchResult ? <div className={cn('border-t px-4 py-3', batchResult.success ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40')}><div className="flex items-start gap-2">{batchResult.success ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" /> : <AlertCircle className="mt-0.5 h-4 w-4 text-amber-700" />}<div><p className="text-sm font-medium text-zinc-950">{batchResult.message}</p><p className="mt-1 text-xs text-zinc-500">共 {batchResult.total} 项 · 成功 {batchResult.succeeded} · 失败 {batchResult.failed}</p></div></div><details className="mt-3"><summary className="cursor-pointer text-xs font-medium text-zinc-700">逐项接口响应</summary><div className="mt-2 divide-y divide-zinc-200">{batchResult.results.map((result) => <div key={result.item.id} className="py-2"><p className="text-xs font-medium text-zinc-800">{result.item.name} · {result.resultCode || '--'} · {result.message}</p><V2OrderResponseDetails response={result.response} title="具体响应" /></div>)}</div></details></div> : null}
      </section>

      <section className="rounded-md border border-zinc-200 bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3"><div><h2 className="text-sm font-semibold text-zinc-950">购物车商品</h2><p className="mt-0.5 text-xs text-zinc-500">已选 {selectedItems.length} 项 / {selectedCount} 件</p></div><ShoppingCart className="h-4 w-4 text-zinc-500" /></header>
        {!listResult ? <div className="px-4 py-10 text-center text-sm text-zinc-500">尚未查询购物车</div> : cart.length ? <div className="divide-y divide-zinc-100">{cart.map((item) => {
          const itemBusy = busy === `edit:${keyOf(item)}`
          const unavailable = item.checkResult !== '0'
          return <div key={keyOf(item)} className="grid gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
            <input type="checkbox" checked={selected.has(keyOf(item))} disabled={unavailable || Boolean(busy)} onChange={() => toggleItem(item)} aria-label={`选择${item.offerName}`} className="h-4 w-4 accent-emerald-700" />
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-medium text-zinc-900" title={item.offerName}>{item.offerName}</p>{unavailable ? <span className="text-xs font-medium text-amber-700">不可结算</span> : null}</div><p className="mt-1 font-mono text-[11px] text-zinc-500">{item.specId} · {money(item.discountPrice)}{item.checkResultDesc ? ` · ${item.checkResultDesc}` : ''}</p></div>
            <div className="flex h-9 w-[116px] items-center justify-between rounded-md border border-zinc-300"><button type="button" title="减少数量" aria-label={`减少${item.offerName}数量`} onClick={() => void editQuantity(item, item.number - 1)} disabled={item.number <= 1 || Boolean(busy)} className="grid h-full w-9 place-items-center text-zinc-600 active:scale-[0.97] disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button><span className="w-8 text-center text-sm font-medium">{itemBusy ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" /> : item.number}</span><button type="button" title="增加数量" aria-label={`增加${item.offerName}数量`} onClick={() => void editQuantity(item, item.number + 1)} disabled={item.number >= Math.min(10, item.addedCount || 10) || Boolean(busy)} className="grid h-full w-9 place-items-center text-zinc-600 active:scale-[0.97] disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button></div>
          </div>
        })}</div> : <div className="px-4 py-10 text-center text-sm text-zinc-500">购物车暂无商品</div>}
      </section>

      {selectedItems.length ? <section className="rounded-md border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-4 py-3"><h2 className="text-sm font-semibold text-zinc-950">实时试算与短信确认</h2></header>
        <div className="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end">
          <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">支付方式</span><select value={payType} onChange={(event) => setPayType(Number(event.target.value))} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm"><option value={1}>话费支付</option><option value={2}>微信支付</option><option value={3}>支付宝</option></select></label>
          <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">短信验证码</span><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={smsCode} onChange={(event) => setSmsCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
          <div className="flex gap-2"><button type="button" onClick={() => void calculate()} disabled={selectedCount > 10 || Boolean(busy)} className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-800 transition-transform duration-150 active:scale-[0.97] disabled:opacity-50">{busy === 'calculate' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}试算</button><button type="button" onClick={() => void sendSms()} disabled={selectedCount > 10 || Boolean(cooldown) || Boolean(busy)} className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-xs font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50">{busy === 'sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{cooldown ? `${cooldown}s` : '发送验证码'}</button></div>
        </div>
        {selectedCount > 10 ? <div className="border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">结算商品总件数不能超过 10 件</div> : null}
        {calculation ? <div className="border-t border-zinc-200 px-4 py-3"><dl className="grid gap-3 sm:grid-cols-3"><div><dt className="text-xs text-zinc-500">原价</dt><dd className="mt-1 text-sm font-medium">{money(calculation.data?.totalPrice)}</dd></div><div><dt className="text-xs text-zinc-500">实付</dt><dd className="mt-1 text-sm font-semibold text-zinc-950">{money(calculation.data?.discountsPrice)}</dd></div><div><dt className="text-xs text-zinc-500">优惠</dt><dd className="mt-1 text-sm font-medium text-emerald-700">{money(calculation.data?.discountsHow)}</dd></div></dl><V2OrderResponseDetails response={calculation.response} title="试算接口具体响应" /></div> : null}
        {smsResult ? <CallbackPanel result={smsResult} title="验证码接口具体响应" /> : null}
        <div className="border-t border-zinc-200 px-4 py-3"><button type="button" onClick={() => setRiskOpen((value) => !value)} aria-expanded={riskOpen} className="inline-flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950">{riskOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}动态风控参数</button>{riskOpen ? <div className="mt-3"><RiskFields value={risk} onChange={setRisk} /></div> : null}</div>
      </section> : null}

      {selectedItems.length ? <section className="rounded-md border border-amber-300 bg-white">
        <header className="flex gap-3 border-b border-amber-200 px-4 py-3"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><h2 className="text-sm font-semibold text-zinc-950">提交购物车订单</h2><p className="mt-1 text-xs text-zinc-600">提交前会重新实时试算，最终结果以上游订单接口返回为准。</p></div></header>
        <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">输入“确认订购”</span><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100" /></label><button type="button" onClick={() => void submit()} disabled={!canSubmit} className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-md bg-amber-700 px-4 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50">{busy === 'submit' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}提交订购</button></div>
      </section> : null}

      {orderResult ? <section className={cn('rounded-md border bg-white', orderResult.success ? 'border-emerald-300' : 'border-amber-300')}><header className="flex items-start gap-3 border-b border-zinc-200 px-4 py-3">{orderResult.success ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" /> : <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700" />}<div><h2 className="text-sm font-semibold text-zinc-950">{orderResult.success ? '购物车订单请求已受理' : '购物车订单请求未受理'}</h2><p className="mt-1 text-sm text-zinc-700">{orderResult.message}</p></div></header><div className="p-4"><p className="font-mono text-xs text-zinc-500">业务码 {orderResult.resultCode || '--'}{'attempted' in orderResult ? ` · 已到达订购接口：${orderResult.attempted ? '是' : '否'}` : ''}</p><V2OrderResponseDetails response={orderResult.response} title="订购接口具体响应" /><div className="mt-4 flex justify-end"><button type="button" onClick={() => void restart()} disabled={Boolean(busy)} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-700 transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"><RotateCcw className="h-4 w-4" />重新开始</button></div></div></section> : null}
    </div>
  )
}
