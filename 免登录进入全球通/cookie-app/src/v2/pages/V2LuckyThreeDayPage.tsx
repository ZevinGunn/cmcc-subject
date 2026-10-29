import BrandLogo from '@/components/BrandLogo'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Gift,
  Loader2,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import { cn } from '@/lib/utils'
import { ApiClientError } from '../lib/api'
import {
  checkLuckyQualification,
  confirmLuckyOrder,
  loadLuckyThreeDayAccounts,
  loadLuckyThreeDayStatus,
  saveLuckyBenefitOverride,
  sendLuckyOrderSms,
  signLuckyThreeDay,
  type LuckyBatch,
  type LuckyDashboard,
  type LuckyProduct,
  type LuckyProductState,
  type LuckyThreeDayAccount,
} from '../lib/luckyThreeDayApi'

type Props = { publicMode?: boolean }

function errorDialog(error: unknown): MessageDialogState {
  if (error instanceof ApiClientError) {
    return {
      type: 'error',
      title: '操作失败',
      message: error.requestId ? `${error.message}（请求 ${error.requestId}）` : error.message,
      errorCode: error.errorCode,
    }
  }
  return {
    type: 'error',
    title: '操作失败',
    message: error instanceof Error ? error.message : '请求失败，请稍后重试',
  }
}

function formatTime(value?: string, includeDate = false): string {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    ...(includeDate ? { month: '2-digit', day: '2-digit' } : {}),
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function batchLabel(batch: LuckyBatch): string {
  const date = batch.showStartTime ? new Date(batch.showStartTime) : null
  const day = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit' }).format(date)
    : `批次 ${batch.id}`
  return `${day} ${formatTime(batch.startTime)}`
}

const STATE_TEXT: Record<LuckyProductState, string> = {
  available: '上游显示可领取',
  claimed: '上游显示已领取',
  sold_out: '上游显示已抢完',
  not_started: '上游显示未开始',
  no_chance: '上游显示暂无资格',
  ended: '上游显示已结束',
  unavailable: '上游显示暂不可领',
}

const STATE_STYLE: Record<LuckyProductState, string> = {
  available: 'bg-emerald-50 text-emerald-700',
  claimed: 'bg-sky-50 text-sky-700',
  sold_out: 'bg-zinc-100 text-zinc-600',
  not_started: 'bg-amber-50 text-amber-700',
  no_chance: 'bg-zinc-100 text-zinc-600',
  ended: 'bg-zinc-100 text-zinc-600',
  unavailable: 'bg-zinc-100 text-zinc-600',
}

function countdownText(target: number, now: number): string {
  const seconds = Math.max(0, Math.ceil((target - now) / 1000))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = seconds % 60
  const clock = [hours, minutes, rest].map((part) => String(part).padStart(2, '0')).join(' : ')
  return days > 0 ? `${days} 天 ${clock}` : clock
}

function saleClock(batch: LuckyBatch, now: number): { label: string; value: string } {
  const start = Date.parse(batch.startTime || '')
  const end = Date.parse(batch.endTime || '')
  if (Number.isFinite(start) && now < start) return { label: '距离开始', value: countdownText(start, now) }
  if (Number.isFinite(end) && now < end) return { label: '距离结束', value: countdownText(end, now) }
  return { label: '本场状态', value: '已结束' }
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-md bg-white shadow-2xl sm:max-w-md sm:rounded-md">
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-zinc-200 bg-white px-4">
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-zinc-950">{title}</h2>
          <button type="button" onClick={onClose} aria-label="关闭" className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

function ProductRow({ product, onOpen }: { product: LuckyProduct; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="grid w-full grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:grid-cols-[72px_minmax(0,1fr)_150px_auto] sm:p-4">
      <span className="grid aspect-square place-items-center overflow-hidden rounded-md bg-rose-50">
        {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-contain p-1.5" /> : <Gift className="h-7 w-7 text-rose-600" />}
      </span>
      <span className="min-w-0">
        <strong className="block break-words text-sm text-zinc-950 sm:text-base">{product.name}</strong>
        <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span>库存 {product.available}</span>
          <span>限领 {product.maxLimit}</span>
          {product.inventoryOverride !== undefined ? <span className="font-medium text-blue-700">自定义库存</span> : null}
        </span>
      </span>
      <span className={cn('hidden justify-self-end rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex', STATE_STYLE[product.state])}>{STATE_TEXT[product.state]}</span>
      <span className="flex items-center gap-1 text-xs font-semibold text-zinc-700">
        {product.attemptable ? '查看详情' : '已暂停'}<ChevronRight className="h-4 w-4" />
      </span>
    </button>
  )
}

function OverrideRow({ product, saving, onSave }: {
  product: LuckyProduct
  saving: boolean
  onSave: (input: { attemptable: boolean; inventory?: number }) => void
}) {
  const [attemptable, setAttemptable] = useState(product.attemptable)
  const [inventory, setInventory] = useState(product.inventoryOverride === undefined ? '' : String(product.inventoryOverride))

  useEffect(() => {
    setAttemptable(product.attemptable)
    setInventory(product.inventoryOverride === undefined ? '' : String(product.inventoryOverride))
  }, [product.attemptable, product.inventoryOverride])

  return (
    <div className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(180px,1fr)_170px_170px_90px] md:items-center">
      <div className="min-w-0"><strong className="block truncate text-sm text-zinc-900">{product.name}</strong><span className="text-xs text-zinc-500">上游库存 {product.upstreamAvailable}</span></div>
      <label className="flex items-center justify-between gap-3 text-xs text-zinc-600"><span>允许尝试领取</span><input type="checkbox" checked={attemptable} onChange={(event) => setAttemptable(event.target.checked)} className="h-5 w-5 rounded border-zinc-300 text-emerald-600" /></label>
      <label className="flex items-center gap-2 text-xs text-zinc-600"><span className="shrink-0">自定义库存</span><input value={inventory} onChange={(event) => setInventory(event.target.value.replace(/\D/g, '').slice(0, 9))} inputMode="numeric" placeholder="跟随上游" className="h-9 min-w-0 w-full rounded-md border border-zinc-300 px-2 text-sm outline-none focus:border-emerald-600" /></label>
      <button type="button" disabled={saving} onClick={() => onSave({ attemptable, inventory: inventory === '' ? undefined : Number(inventory) })} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-zinc-900 px-3 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50">{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}保存</button>
    </div>
  )
}

export default function V2LuckyThreeDayPage({ publicMode = false }: Props) {
  const navigate = useNavigate()
  const params = useParams<{ batchId?: string; skuId?: string }>()
  const [searchParams] = useSearchParams()
  const requestedAccountId = searchParams.get('accountId') || ''
  const [accounts, setAccounts] = useState<LuckyThreeDayAccount[]>([])
  const [accountId, setAccountId] = useState('')
  const [dashboard, setDashboard] = useState<LuckyDashboard>()
  const [batchId, setBatchId] = useState(Number(params.batchId) || 0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState<MessageDialogState | null>(null)
  const [signConfirm, setSignConfirm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<LuckyProduct>()
  const [smsCode, setSmsCode] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [smsDeadline, setSmsDeadline] = useState(0)
  const [clock, setClock] = useState(Date.now())
  const [attemptId, setAttemptId] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    void loadLuckyThreeDayAccounts()
      .then((items) => {
        if (!alive) return
        setAccounts(items)
        const requested = items.find((item) => item.id === requestedAccountId)
        setAccountId(requested?.id || items[0]?.id || '')
      })
      .catch((reason) => alive && setMessage(errorDialog(reason)))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [requestedAccountId])

  useEffect(() => {
    if (!accountId) {
      setDashboard(undefined)
      return
    }
    let alive = true
    setBusy('status')
    setDashboard(undefined)
    void loadLuckyThreeDayStatus(accountId)
      .then((value) => {
        if (!alive) return
        setDashboard(value)
        const routeBatch = value.activity.batches.find((item) => item.id === Number(params.batchId))
        const active = routeBatch || value.activity.batches.find((item) => item.activityStatus === 1) || value.activity.batches.find((item) => item.activityStatus === 0) || value.activity.batches[0]
        setBatchId(active?.id || 0)
      })
      .catch((reason) => alive && setMessage(errorDialog(reason)))
      .finally(() => alive && setBusy(''))
    return () => { alive = false }
  }, [accountId, params.batchId])

  const activeBatch = useMemo(() => dashboard?.activity.batches.find((item) => item.id === batchId) || dashboard?.activity.batches[0], [batchId, dashboard])
  const detailBatch = useMemo(() => dashboard?.activity.batches.find((item) => item.id === Number(params.batchId)), [dashboard, params.batchId])
  const detailProduct = useMemo(() => detailBatch?.products.find((item) => item.skuId === Number(params.skuId)), [detailBatch, params.skuId])
  const detailMode = Boolean(params.batchId && params.skuId)
  const smsCooldown = Math.max(0, Math.ceil((smsDeadline - clock) / 1000))
  const currentReward = dashboard?.sign.rewards[dashboard.sign.accumulateCount]
  const canSign = Boolean(dashboard && !dashboard.sign.signToday && !dashboard.sign.limitCount && (!currentReward || currentReward.hasRemainCount))

  const listPath = publicMode ? '/benefits/lucky-three-day' : '/v2/benefits/lucky-three-day'
  const benefitsPath = publicMode ? '/' : '/v2/benefits'

  async function refresh(successMessage?: string) {
    if (!accountId) return
    setBusy('status')
    try {
      const value = await loadLuckyThreeDayStatus(accountId)
      setDashboard(value)
      if (!value.activity.batches.some((item) => item.id === batchId)) setBatchId(value.activity.batches[0]?.id || 0)
      if (successMessage) setMessage({ type: 'success', title: '操作成功', message: successMessage })
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  async function signToday() {
    if (!accountId) return
    setBusy('sign')
    try {
      const value = await signLuckyThreeDay(accountId)
      setDashboard((current) => current ? { ...current, sign: value.sign } : current)
      setSignConfirm(false)
      setMessage({ type: 'success', title: '签到成功', message: value.result.message || '今日签到成功' })
    } catch (reason) {
      setSignConfirm(false)
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  function openProduct(product: LuckyProduct) {
    navigate(`${listPath}/${product.batchId}/${product.skuId}?accountId=${encodeURIComponent(accountId)}`)
  }

  async function beginClaim(product: LuckyProduct) {
    if (product.state === 'claimed' && (product.jumpUrl || product.useUrl)) {
      window.open(product.jumpUrl || product.useUrl, '_blank', 'noopener,noreferrer')
      return
    }
    if (!product.attemptable || !accountId) return
    setBusy(`qualify:${product.skuId}`)
    try {
      const value = await checkLuckyQualification(accountId, product)
      if (!value.qualification.eligible) throw new Error(value.qualification.message)
      setSelectedProduct(value.product)
      setSmsCode('')
      setConfirmationText('')
      setSmsDeadline(0)
      setAttemptId(crypto.randomUUID())
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  async function sendSms() {
    if (!accountId || !selectedProduct || smsCooldown > 0) return
    setBusy('sms')
    try {
      const value = await sendLuckyOrderSms(accountId, selectedProduct)
      setSelectedProduct(value.product)
      setSmsDeadline(Date.now() + 60_000)
      setMessage({ type: 'success', title: '验证码已发送', message: value.sms.message || '请留意当前号码收到的短信' })
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  async function confirmOrder() {
    if (!accountId || !selectedProduct || !attemptId) return
    setBusy('confirm')
    try {
      const value = await confirmLuckyOrder(accountId, selectedProduct, { smsCode, confirmationText, attemptId })
      setSelectedProduct(undefined)
      await refresh(`${value.result.message}${value.replayed ? '（已复用原请求结果）' : ''}`)
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  async function saveOverride(product: LuckyProduct, input: { attemptable: boolean; inventory?: number }) {
    setBusy(`override:${product.skuId}`)
    try {
      await saveLuckyBenefitOverride({ batchId: product.batchId, skuId: product.skuId, ...input })
      await refresh('权益配置已保存')
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  const page = (
    <div className={cn('mx-auto w-full max-w-[1180px] space-y-5', publicMode && 'px-3 py-4 sm:px-6 sm:py-6')}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to={detailMode ? `${listPath}?accountId=${encodeURIComponent(accountId)}` : benefitsPath} className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"><ArrowLeft className="h-3.5 w-3.5" />{detailMode ? '返回权益列表' : publicMode ? '返回账号中心' : '返回权益活动'}</Link>
          <h1 className="brand-heading text-xl font-semibold text-zinc-950">{publicMode ? <BrandLogo className="h-7 w-7" /> : null}{detailProduct?.name || '幸运三日签'}</h1>
          <p className="mt-1 text-sm text-zinc-500">{detailMode ? '权益详情与领取' : '每日累签奖励与限量话费券领取'}</p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={!accountId || Boolean(busy)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{busy === 'status' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}刷新状态</button>
      </div>

      <section className="border-y border-zinc-200 bg-white px-4 py-4">
        <label className="block max-w-xl"><span className="mb-1.5 block text-xs font-medium text-zinc-600">活动账号</span><select value={accountId} onChange={(event) => setAccountId(event.target.value)} disabled={loading || Boolean(busy)} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100">{accounts.length === 0 ? <option value="">暂无可用账号</option> : null}{accounts.map((account) => <option key={account.id} value={account.id}>{account.label} {account.displayPhone}</option>)}</select></label>
      </section>

      {!dashboard && busy === 'status' ? <div className="grid min-h-64 place-items-center border-y border-zinc-200 bg-white text-sm text-zinc-500"><div className="text-center"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-emerald-700" />正在准备爱购凭证并查询活动</div></div> : null}

      {dashboard && !detailMode ? (
        <>
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-base font-semibold text-zinc-950">每日累签</h2><p className="mt-1 text-xs text-zinc-500">已完成 {dashboard.sign.accumulateCount} 次</p></div><button type="button" onClick={() => setSignConfirm(true)} disabled={!canSign || Boolean(busy)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-45"><CalendarDays className="h-4 w-4" />{dashboard.sign.signToday ? '今日已签到' : '今日签到'}</button></div>
            <div className="grid gap-3 sm:grid-cols-3">{dashboard.sign.rewards.map((reward, index) => { const complete = index < dashboard.sign.accumulateCount; const current = index === dashboard.sign.accumulateCount && !dashboard.sign.signToday; return <article key={reward.skuId} className={cn('grid min-w-0 grid-cols-[60px_minmax(0,1fr)] gap-3 rounded-md border p-3', complete ? 'border-emerald-200 bg-emerald-50' : current ? 'border-zinc-400 bg-white' : 'border-zinc-200 bg-zinc-50')}><div className="grid aspect-square place-items-center overflow-hidden rounded-md bg-white">{reward.awardPicUrl ? <img src={reward.awardPicUrl} alt="" className="h-full w-full object-contain" /> : <Gift className="h-6 w-6 text-rose-600" />}</div><div className="min-w-0"><div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">{complete ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : null}第 {reward.signDays} 次</div><strong className="mt-1 block break-words text-sm text-zinc-950">{reward.awardName}</strong><span className={cn('mt-1 block text-xs', reward.hasRemainCount ? 'text-zinc-500' : 'text-red-700')}>{reward.hasRemainCount ? (complete ? '已完成' : '待签到') : '奖励已领完'}</span></div></article> })}</div>
          </section>

          <section className="space-y-3">
            <div><h2 className="text-base font-semibold text-zinc-950">话费券秒杀</h2><p className="mt-1 text-xs text-zinc-500">点击权益进入详情页，可提前等待并尝试领取</p></div>
            <div className="flex gap-2 overflow-x-auto pb-1">{dashboard.activity.batches.map((batch) => <button key={batch.id} type="button" onClick={() => setBatchId(batch.id)} className={cn('h-9 shrink-0 rounded-md px-3 text-xs font-medium ring-1 ring-inset', batch.id === activeBatch?.id ? 'bg-zinc-950 text-white ring-zinc-950' : 'bg-white text-zinc-600 ring-zinc-200 hover:bg-zinc-50')}>{batchLabel(batch)}</button>)}</div>
            {activeBatch ? <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600"><span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{formatTime(activeBatch.startTime, true)} - {formatTime(activeBatch.endTime, true)}</span><span>{activeBatch.activityStatus === 0 ? '即将开始' : activeBatch.activityStatus === 1 ? '抢购中' : '已结束'}</span></div> : null}
            <div className="space-y-2">{(activeBatch?.products || []).map((product) => <ProductRow key={`${product.batchId}:${product.skuId}`} product={product} onOpen={() => openProduct(product)} />)}</div>
          </section>

          {!publicMode && activeBatch ? <section className="overflow-hidden border-y border-zinc-200 bg-white"><div className="border-b border-zinc-200 px-4 py-3"><h2 className="text-sm font-semibold text-zinc-950">权益领取配置</h2><p className="mt-1 text-xs text-zinc-500">不填写库存时跟随上游展示；允许尝试默认开启，并且不做本地时间或库存拦截。</p></div><div className="divide-y divide-zinc-100">{activeBatch.products.map((product) => <OverrideRow key={product.skuId} product={product} saving={busy === `override:${product.skuId}`} onSave={(input) => void saveOverride(product, input)} />)}</div></section> : null}
        </>
      ) : null}

      {dashboard && detailMode && detailBatch && detailProduct ? (
        <div className="pb-24">
          <section className="overflow-hidden border-y border-zinc-200 bg-white">
            <div className="flex items-center justify-between gap-4 bg-rose-50 px-4 py-3 text-rose-900"><span className="text-sm font-medium">{saleClock(detailBatch, clock).label}</span><strong className="font-mono text-lg tracking-normal sm:text-2xl">{saleClock(detailBatch, clock).value}</strong></div>
            <div className="flex items-center gap-4 px-4 py-5"><div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md bg-rose-50">{detailProduct.imageUrl ? <img src={detailProduct.imageUrl} alt="" className="h-full w-full object-contain p-2" /> : <Gift className="h-8 w-8 text-rose-600" />}</div><div className="min-w-0"><h2 className="break-words text-lg font-semibold text-zinc-950">{detailProduct.name}</h2><p className="mt-2 text-sm text-zinc-500">领取价 <strong className="text-xl text-rose-600">¥{detailProduct.price}</strong></p><span className={cn('mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium', STATE_STYLE[detailProduct.state])}>{STATE_TEXT[detailProduct.state]}</span></div></div>
          </section>
          <section className="mt-4 space-y-5 border-y border-zinc-200 bg-white px-4 py-5 text-sm leading-7 text-zinc-600"><div><h3 className="font-semibold text-zinc-950">权益名称</h3><p className="mt-1">{detailProduct.name}</p></div><div><h3 className="font-semibold text-zinc-950">产品权益内容</h3><p className="mt-1">领取成功后，话费券将发放至当前活动手机号，具体到账与使用范围以运营商结果为准。</p></div><div><h3 className="font-semibold text-zinc-950">领取与使用规则</h3><p className="mt-1">同一用户的领取次数、资格、实际库存、活动时间及风控结果均由运营商接口最终判定。自定义库存只影响本站展示；允许尝试只取消本站的前置拦截。</p></div><div><h3 className="font-semibold text-zinc-950">当前数据</h3><p className="mt-1">展示库存 {detailProduct.available}，上游库存 {detailProduct.upstreamAvailable}，每人限领 {detailProduct.maxLimit} 次。</p></div></section>
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur sm:static sm:mt-4 sm:border-y sm:px-4"><div className="mx-auto flex max-w-[1180px] items-center gap-3"><div className="hidden min-w-0 flex-1 sm:block"><strong className="block truncate text-sm text-zinc-950">{detailProduct.name}</strong><span className="text-xs text-zinc-500">运营商接口仍会执行实时资格校验</span></div><button type="button" disabled={!detailProduct.attemptable || busy === `qualify:${detailProduct.skuId}`} onClick={() => void beginClaim(detailProduct)} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-64">{busy === `qualify:${detailProduct.skuId}` ? <Loader2 className="h-4 w-4 animate-spin" /> : detailProduct.state === 'claimed' && (detailProduct.jumpUrl || detailProduct.useUrl) ? <ExternalLink className="h-4 w-4" /> : <Gift className="h-4 w-4" />}{detailProduct.attemptable ? (detailProduct.state === 'claimed' && (detailProduct.jumpUrl || detailProduct.useUrl) ? '去使用' : '尝试领取') : '领取已暂停'}</button></div></div>
        </div>
      ) : null}

      {dashboard && detailMode && (!detailBatch || !detailProduct) ? <div className="border-y border-zinc-200 bg-white px-4 py-16 text-center text-sm text-zinc-500">当前活动中未找到该权益</div> : null}

      {signConfirm ? <Modal title="确认今日签到" onClose={() => setSignConfirm(false)}><div className="space-y-4"><div className="flex items-start gap-3 rounded-md bg-zinc-50 p-3"><Gift className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /><div><strong className="text-sm text-zinc-950">{currentReward?.awardName || '今日签到奖励'}</strong><p className="mt-1 text-xs leading-5 text-zinc-500">签到会立即改变该账号的活动状态。</p></div></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setSignConfirm(false)} className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700">取消</button><button type="button" onClick={() => void signToday()} disabled={busy === 'sign'} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-50">{busy === 'sign' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}确认签到</button></div></div></Modal> : null}

      {selectedProduct ? <Modal title="领取限量话费券" onClose={() => busy ? undefined : setSelectedProduct(undefined)}><div className="space-y-4"><div className="flex items-center gap-3 border-b border-zinc-100 pb-4"><div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-md bg-rose-50">{selectedProduct.imageUrl ? <img src={selectedProduct.imageUrl} alt="" className="h-full w-full object-contain p-1" /> : <Gift className="h-6 w-6 text-rose-600" />}</div><div className="min-w-0"><strong className="block break-words text-sm text-zinc-950">{selectedProduct.name}</strong><span className="mt-1 block text-xs text-zinc-500">展示库存 {selectedProduct.available} · 上游库存 {selectedProduct.upstreamAvailable}</span></div></div><label className="block"><span className="mb-1.5 block text-xs font-medium text-zinc-700">短信验证码</span><div className="flex gap-2"><input value={smsCode} onChange={(event) => setSmsCode(event.target.value.replace(/\D/g, '').slice(0, 8))} inputMode="numeric" autoComplete="one-time-code" placeholder="输入验证码" className="h-10 min-w-0 flex-1 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><button type="button" onClick={() => void sendSms()} disabled={busy === 'sms' || smsCooldown > 0} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{busy === 'sms' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}{smsCooldown > 0 ? `${smsCooldown}s 后重发` : '获取验证码'}</button></div></label><label className="block"><span className="mb-1.5 block text-xs font-medium text-zinc-700">二次确认</span><input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} placeholder="输入：确认领取" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label><div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><span>失败或火爆时按钮会恢复，可以再次发送验证码或提交领取。</span></div><button type="button" onClick={() => void confirmOrder()} disabled={busy === 'confirm' || !/^\d{4,8}$/.test(smsCode) || confirmationText !== '确认领取'} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45">{busy === 'confirm' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}确认领取</button></div></Modal> : null}
      {message ? <MessageDialog value={message} onClose={() => setMessage(null)} /> : null}
    </div>
  )

  return publicMode ? <main className="brand-page min-h-screen">{page}</main> : page
}
