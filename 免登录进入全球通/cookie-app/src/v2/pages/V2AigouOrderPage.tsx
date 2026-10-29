import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Loader2, RefreshCw, RotateCcw, Send, ShieldAlert, ShoppingBag, ShoppingCart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import { cn } from '@/lib/utils'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import V2SearchableAccountSelect from '../components/V2SearchableAccountSelect'
import V2OrderResponseDetails, { orderFailureResponse } from '../components/V2OrderResponseDetails'
import V2AigouShoppingCart from '../components/V2AigouShoppingCart'
import {
  loadAigouCatalog,
  resolveAigouProduct,
  sendAigouOrderSms,
  submitAigouOrder,
  type AigouOrderResult,
  type AigouProduct,
  type AigouProductInput,
  type AigouRiskContext,
  type AigouSmsResult,
} from '../lib/aigouOrderApi'

const FALLBACK: AigouProductInput = {
  code: 'mzonebojindg', skuId: '26804', channelCode: 'P00000151769',
  selfChannelCode: 'P00000151769', referer: 'mzonebojindg', activityId: '17466', orderMode: 'rights', name: '铂金会员校园版',
}

const CUSTOM_PRESET = '__custom__'
const CUSTOM_INPUT: AigouProductInput = {
  code: '', skuId: '', name: '自定义 SKU', orderMode: 'rights', channelCode: '', selfChannelCode: '', referer: '',
}

function money(value?: number): string {
  return value === undefined ? '--' : `¥${(value / 100).toFixed(2)}`
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : '请求失败'
}

function riskState(value: string | undefined): string {
  if (value === 'generated') return '已实时获取'
  if (value === 'provided') return '已提供'
  if (value === 'session-cookie') return '来自当前会话'
  return '未获取'
}

function ProductField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block space-y-1.5"><span className="text-xs font-medium text-zinc-700">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
}

export default function V2AigouOrderPage({ accounts, initialAccountId = '' }: { accounts: BusinessOrderAccount[]; initialAccountId?: string }) {
  const [workspace, setWorkspace] = useState<'direct' | 'cart'>('direct')
  const [accountId, setAccountId] = useState(initialAccountId)
  const [presets, setPresets] = useState<AigouProductInput[]>([FALLBACK])
  const [presetCode, setPresetCode] = useState(FALLBACK.code)
  const [input, setInput] = useState<AigouProductInput>(FALLBACK)
  const [product, setProduct] = useState<AigouProduct>()
  const [smsCode, setSmsCode] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [smsResult, setSmsResult] = useState<AigouSmsResult>()
  const [result, setResult] = useState<AigouOrderResult>()
  const [advanced, setAdvanced] = useState(false)
  const [riskAdvanced, setRiskAdvanced] = useState(false)
  const [risk, setRisk] = useState<AigouRiskContext>({})

  useEffect(() => { void loadAigouCatalog().then((items) => items.length && setPresets(items)).catch(() => undefined) }, [])
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const selectedAccount = useMemo(() => accounts.find((item) => item.id === accountId), [accountId, accounts])
  const canSubmit = Boolean(product && /^\d{4,8}$/.test(smsCode) && confirmation === '确认订购' && !busy)

  function update<K extends keyof AigouProductInput>(key: K, value: AigouProductInput[K]) {
    setInput((current) => ({ ...current, [key]: value }))
    setProduct(undefined)
    setSmsResult(undefined)
    setResult(undefined)
  }

  function choosePreset(code: string) {
    setPresetCode(code)
    const next = code === CUSTOM_PRESET ? CUSTOM_INPUT : presets.find((item) => item.code === code) || FALLBACK
    setInput(next)
    setProduct(undefined)
    setSmsResult(undefined)
    setResult(undefined)
  }

  function updateSku(value: string) {
    setPresetCode(CUSTOM_PRESET)
    setInput({ ...CUSTOM_INPUT, skuId: value })
    setProduct(undefined)
    setSmsResult(undefined)
    setResult(undefined)
  }

  async function run(action: string, task: () => Promise<void>) {
    setBusy(action); setError('')
    try { await task() } catch (reason) { setError(errorText(reason)) } finally { setBusy('') }
  }

  async function inspectProduct() {
    await run('product', async () => {
      const data = await resolveAigouProduct(accountId, input)
      setProduct(data.product)
      setInput(data.product)
      setSmsCode('')
      setConfirmation('')
      setSmsResult(undefined)
    })
  }

  async function sendSms() {
    if (!product) return
    await run('sms', async () => {
      try {
        const data = await sendAigouOrderSms(accountId, product)
        setSmsResult(data)
        if (data.success) setCooldown(data.cooldownSeconds || 60)
      } catch (reason) {
        const failure = orderFailureResponse(reason)
        setSmsResult({ success: false, resultCode: failure.code, message: failure.message, response: failure.response, cooldownSeconds: 0 })
      }
    })
  }

  async function submit() {
    if (!product) return
    await run('submit', async () => {
      try {
        const data = await submitAigouOrder({ accountId, product, smsCode, riskContext: risk })
        setResult(data)
      } catch (reason) {
        const failure = orderFailureResponse(reason)
        setResult({ success: false, resultCode: failure.code, message: failure.message, response: failure.response, precheck: { success: false, resultCode: '', message: '提交接口返回错误' }, attempted: false })
      } finally {
        setSmsCode('')
        setConfirmation('')
      }
    })
  }

  function reset() {
    setAccountId(initialAccountId)
    setPresetCode(FALLBACK.code)
    setInput(FALLBACK)
    setProduct(undefined)
    setSmsCode('')
    setConfirmation('')
    setCooldown(0)
    setBusy('')
    setError('')
    setSmsResult(undefined)
    setResult(undefined)
    setAdvanced(false)
    setRiskAdvanced(false)
    setRisk({})
  }

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="爱购商城办理方式" className="grid grid-cols-2 rounded-md border border-zinc-200 bg-zinc-100 p-1">
        <button type="button" role="tab" aria-selected={workspace === 'direct'} onClick={() => setWorkspace('direct')} className={cn('inline-flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors', workspace === 'direct' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950')}><ShoppingBag className="h-4 w-4" />权益直订</button>
        <button type="button" role="tab" aria-selected={workspace === 'cart'} onClick={() => setWorkspace('cart')} className={cn('inline-flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors', workspace === 'cart' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950')}><ShoppingCart className="h-4 w-4" />购物车订购</button>
      </div>

      {workspace === 'cart' ? <V2AigouShoppingCart accounts={accounts} initialAccountId={initialAccountId} /> : <>
      <section className="rounded-md border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-4 py-3"><h2 className="text-sm font-semibold text-zinc-950">1. 选择账号与业务</h2></header>
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <V2SearchableAccountSelect accounts={accounts} value={accountId} onChange={(value) => { setAccountId(value); setProduct(undefined); setSmsResult(undefined); setResult(undefined) }} allowEmpty={false} />
          <label className="block space-y-1.5"><span className="text-xs font-medium text-zinc-700">默认可订购业务</span><select value={presetCode} onChange={(event) => choosePreset(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">{presets.map((item) => <option key={item.code} value={item.code}>{item.name || item.code}{item.orderMode === 'package' ? '（COC 套餐）' : item.skuId ? '' : '（实时解析）'}</option>)}<option value={CUSTOM_PRESET}>自定义 SKU</option></select></label>
          <ProductField label="SKU ID" value={input.skuId} onChange={updateSku} placeholder="输入 SKU 即可尝试核对" />
        </div>
        <div className="border-t border-zinc-100 px-4 py-3"><button type="button" onClick={() => setAdvanced((value) => !value)} aria-expanded={advanced} className="inline-flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950">{advanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}高级业务参数</button>{advanced ? <div className="mt-3 grid gap-3 sm:grid-cols-2"><ProductField label="页面 code" value={input.code} onChange={(value) => update('code', value)} placeholder="可选" /><ProductField label="渠道码 channelCode" value={input.channelCode} onChange={(value) => update('channelCode', value)} placeholder="未填时使用通用值" /><ProductField label="自渠道码 selfChannelCode" value={input.selfChannelCode} onChange={(value) => update('selfChannelCode', value)} placeholder="默认与渠道码一致" /><ProductField label="页面来源 referer" value={input.referer} onChange={(value) => update('referer', value)} placeholder="未填时使用通用值" /></div> : null}</div>
        <footer className="flex justify-end border-t border-zinc-200 px-4 py-3"><button type="button" onClick={() => void inspectProduct()} disabled={!accountId || (!input.code && !input.skuId) || busy === 'product'} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50">{busy === 'product' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}核对实时商品</button></footer>
      </section>

      {product ? <section className="rounded-md border border-zinc-200 bg-white">
        <header className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50 text-emerald-700"><ShoppingBag className="h-4 w-4" /></span><div><h2 className="text-sm font-semibold text-zinc-950">2. 核对商品</h2><p className="text-xs text-zinc-500">实时返回 · {selectedAccount?.displayPhone || selectedAccount?.phoneMasked}</p></div></header>
        <dl className="grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-xs text-zinc-500">商品名称</dt><dd className="mt-1 text-sm font-medium text-zinc-950">{product.name}</dd></div><div><dt className="text-xs text-zinc-500">SKU</dt><dd className="mt-1 font-mono text-sm text-zinc-900">{product.skuId}</dd></div><div><dt className="text-xs text-zinc-500">价格</dt><dd className="mt-1 text-sm font-semibold text-zinc-950">{money(product.price)}</dd></div><div><dt className="text-xs text-zinc-500">订购协议</dt><dd className="mt-1 text-sm text-zinc-900">{product.orderMode === 'package' ? 'COC 套餐 bookProduct' : '爱购权益 directOrder'}</dd></div></dl>
        {product.genericContext ? <div className="border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">该 SKU 未命中已知业务，已使用通用权益渠道上下文尝试；上游仍可能因渠道、资格或风控拒绝。</div> : null}
        {product.agreementContent ? <details className="border-t border-zinc-200 px-4 py-3"><summary className="cursor-pointer text-xs font-medium text-zinc-700">{product.agreementName || '业务协议'}</summary><div className="mt-3 max-h-56 overflow-y-auto text-sm leading-6 text-zinc-600" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.agreementContent) }} /></details> : null}
      </section> : null}

      {product ? <section className="rounded-md border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-4 py-3"><h2 className="text-sm font-semibold text-zinc-950">3. 短信确认</h2></header>
        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"><label className="block space-y-1.5"><span className="text-xs font-medium text-zinc-700">短信验证码</span><input inputMode="numeric" autoComplete="one-time-code" value={smsCode} maxLength={8} onChange={(event) => setSmsCode(event.target.value.replace(/\D/g, '').slice(0, 8))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label><button type="button" onClick={() => void sendSms()} disabled={Boolean(cooldown) || busy === 'sms'} className="mt-auto inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-800 transition-transform duration-150 hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50">{busy === 'sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{cooldown ? `${cooldown}s` : '发送验证码'}</button></div>
        {smsResult ? <div className={cn('border-t px-4 py-3', smsResult.success ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40')}><div className="flex items-start gap-2">{smsResult.success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />}<div><p className="text-sm font-medium text-zinc-950">{smsResult.message}</p><p className="mt-1 text-xs text-zinc-500">业务码 {smsResult.resultCode || '--'}</p></div></div><V2OrderResponseDetails response={smsResult.response} title="验证码接口具体响应" /></div> : null}
        {product.orderMode === 'rights' ? <div className="border-t border-zinc-200 px-4 py-3"><button type="button" onClick={() => setRiskAdvanced((value) => !value)} aria-expanded={riskAdvanced} className="inline-flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950">{riskAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}动态风控参数</button>{riskAdvanced ? <div className="mt-3 grid gap-3 sm:grid-cols-2">{(['grRiskP1','grRiskP2','grRiskP3','wasmParams','operDfp'] as const).map((key) => <ProductField key={key} label={key} value={risk[key] || ''} onChange={(value) => setRisk((current) => ({ ...current, [key]: value }))} placeholder="由当前爱购页面风控上下文提供" />)}</div> : null}</div> : null}
      </section> : null}

      {product ? <section className="rounded-md border border-amber-300 bg-white">
        <header className="flex gap-3 border-b border-amber-200 px-4 py-3"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><h2 className="text-sm font-semibold text-zinc-950">4. 提交订购</h2><p className="mt-1 text-xs text-zinc-600">客户端不拦截资格或库存状态，将按 {product.orderMode === 'package' ? 'COC 套餐' : '爱购权益'} 协议尝试提交；最终结果以上游返回为准。</p></div></header>
        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"><label className="block space-y-1.5"><span className="text-xs font-medium text-zinc-700">输入“确认订购”</span><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100" /></label><button type="button" onClick={() => void submit()} disabled={!canSubmit} className="mt-auto inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-md bg-amber-700 px-4 text-sm font-semibold text-white transition-transform duration-150 hover:bg-amber-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50">{busy === 'submit' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}提交订购</button></div>
      </section> : null}

      {error ? <div role="alert" className="flex gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div> : null}
      {result ? <section className={cn('rounded-md border bg-white', result.success ? 'border-emerald-300' : 'border-amber-300')}><header className="flex items-start gap-3 border-b border-zinc-200 px-4 py-3">{result.success ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" /> : <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700" />}<div><h2 className="text-sm font-semibold text-zinc-950">{result.success ? '订购请求已受理' : result.attempted ? '订购请求已提交但未受理' : '订购前置验证未通过'}</h2><p className="mt-1 text-sm text-zinc-700">{result.message}</p></div></header><div className="p-4"><dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div><dt className="text-xs text-zinc-500">业务码</dt><dd className="mt-1 font-mono text-sm">{result.resultCode || '--'}</dd></div><div><dt className="text-xs text-zinc-500">前置阶段</dt><dd className="mt-1 text-sm">{result.precheck.message}</dd></div><div><dt className="text-xs text-zinc-500">已到达订购接口</dt><dd className="mt-1 text-sm font-medium">{result.attempted ? '是' : '否'}</dd></div>{result.riskPreparation ? <><div><dt className="text-xs text-zinc-500">设备风险令牌</dt><dd className="mt-1 text-sm">{riskState(result.riskPreparation.deviceToken)}{result.riskPreparation.tokenResultCode ? ` · ${result.riskPreparation.tokenResultCode}` : ''}</dd></div><div><dt className="text-xs text-zinc-500">WASM 参数</dt><dd className="mt-1 text-sm">{riskState(result.riskPreparation.wasmParams)}</dd></div><div><dt className="text-xs text-zinc-500">设备指纹</dt><dd className="mt-1 text-sm">{riskState(result.riskPreparation.operDfp)}</dd></div></> : null}</dl>{result.riskPreparation?.tokenMessage ? <p className="mt-3 text-xs text-zinc-500">{result.riskPreparation.tokenMessage}</p> : null}<V2OrderResponseDetails response={result.response} /><div className="mt-4 flex justify-end"><button type="button" onClick={reset} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 transition-transform duration-150 hover:bg-zinc-50 active:scale-[0.97]"><RotateCcw className="h-3.5 w-3.5" />重新开始</button></div></div></section> : null}
      </>}
    </div>
  )
}
