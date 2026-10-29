import PhoneInput from '@/components/PhoneInput'
import MessageDialog from '@/components/MessageDialog'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  FileText,
  KeyRound,
  Loader2,
  LockKeyhole,
  PackageSearch,
  RotateCcw,
  Send,
  ShieldAlert,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { AGE_FEED_TIERS } from '../../../shared/ageFeed'
import { ApiClientError } from '../lib/api'
import V2SearchableAccountSelect from '../components/V2SearchableAccountSelect'
import V2OrderResponseDetails, { orderFailureResponse } from '../components/V2OrderResponseDetails'
import {
  createBusinessOrder,
  deleteBusinessOrder,
  loadBusinessOrderDefaults,
  loginBusinessOrder,
  prepareBusinessOrderProduct,
  sendBusinessOrderLoginSms,
  sendBusinessOrderSms,
  submitBusinessOrder,
  type BusinessOrderResult,
  type BusinessOrderAccount,
  type BusinessOrderSession,
} from '../lib/businessOrderApi'

const FALLBACK_DEFAULTS = {
  productCode: '1000000100290',
  pageId: '1889216886548430848',
  touchCode: 'P00000078835',
}

const STEPS = [
  '订购对象',
  '账号登录',
  '产品核验',
  '阅读协议',
  '订购验证',
  '确认结果',
] as const

function stageStep(session?: BusinessOrderSession): number {
  if (!session) return 0
  switch (session.stage) {
    case 'phone_verified':
    case 'login_sms_sent':
      return 1
    case 'logged_in':
      return 2
    case 'product_ready':
      return 3
    case 'order_sms_sent':
    case 'ordering':
      return 4
    case 'finished':
      return 5
  }
}

function errorText(error: unknown): string {
  if (error instanceof ApiClientError) {
    const code = error.errorCode ? ` [${error.errorCode}]` : ''
    const request = error.requestId ? `（请求 ${error.requestId}）` : ''
    return `${error.message}${code}${request}`
  }
  return error instanceof Error ? error.message : '请求失败'
}

function maskPhoneText(value: string): string {
  return String(value || '').replace(/1\d{10}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`)
}

function sanitizeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return ''
  const documentNode = new DOMParser().parseFromString(html, 'text/html')
  documentNode
    .querySelectorAll('script, style, iframe, object, embed, link, meta, form, input, button')
    .forEach((node) => node.remove())
  documentNode.body.querySelectorAll('*').forEach((node) => {
    for (const attribute of Array.from(node.attributes)) {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()
      if (name.startsWith('on') || name === 'style') node.removeAttribute(attribute.name)
      if ((name === 'href' || name === 'src') && /^(javascript:|data:|vbscript:)/.test(value)) {
        node.removeAttribute(attribute.name)
      }
    }
  })
  return documentNode.body.innerHTML
}

function SafeHtml({ html }: { html: string }) {
  const safe = useMemo(() => sanitizeHtml(html), [html])
  return (
    <div
      className="prose prose-sm max-w-none text-zinc-700 prose-headings:text-zinc-950 prose-strong:text-zinc-950 prose-a:text-emerald-700"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}

function StatusStepper({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-3 gap-x-2 gap-y-3 border-y border-zinc-200 bg-white px-3 py-4 sm:grid-cols-6 sm:px-4">
      {STEPS.map((label, index) => {
        const completed = index < current
        const active = index === current
        return (
          <li key={label} className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold',
                completed && 'border-emerald-700 bg-emerald-700 text-white',
                active && 'border-zinc-950 bg-zinc-950 text-white',
                !completed && !active && 'border-zinc-300 bg-white text-zinc-400',
              )}>
              {completed ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                'min-w-0 text-xs font-medium leading-4',
                active ? 'text-zinc-950' : completed ? 'text-emerald-800' : 'text-zinc-400',
              )}>
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  inputMode,
  phoneInput,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  inputMode?: 'text' | 'numeric'
  phoneInput?: boolean
}) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-xs font-medium text-zinc-700">{label}</span>
      {phoneInput ? <PhoneInput
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="h-10 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100 disabled:text-zinc-500"
      /> : <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        className="h-10 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100 disabled:text-zinc-500"
      />}
    </label>
  )
}

function PrimaryButton({
  children,
  icon: Icon,
  onClick,
  disabled,
  busy,
  danger,
}: {
  children: React.ReactNode
  icon: typeof Send
  onClick: () => void
  disabled?: boolean
  busy?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50',
        danger ? 'bg-red-700 hover:bg-red-800' : 'bg-zinc-950 hover:bg-zinc-800',
      )}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

function AgeFeedTierSelect({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled: boolean }) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-xs font-medium text-zinc-700">直升档位</span>
      <select aria-label="直升档位" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}
        className="h-10 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100 disabled:text-zinc-500">
        <option value="auto">按号码资格自动匹配</option>
        {AGE_FEED_TIERS.map((tier) => <option key={tier.productCode} value={tier.productCode}>{tier.name} · 尝试办理</option>)}
      </select>
    </label>
  )
}

export default function V2BusinessOrderPage({
  accounts = [],
  initialAccountId = '',
  allowManualPhone = true,
  backHref = '/v2/business',
  backLabel = '返回业务查询',
  showHeader = true,
  initialDefaults,
  officialSourceUrl,
  target = 'diamond_package',
}: {
  accounts?: BusinessOrderAccount[]
  initialAccountId?: string
  allowManualPhone?: boolean
  backHref?: string
  backLabel?: string
  showHeader?: boolean
  initialDefaults?: typeof FALLBACK_DEFAULTS
  officialSourceUrl?: string
  target?: 'diamond_package' | 'age_feed'
}) {
  const isAgeFeed = target === 'age_feed'
  const selectableAccounts = useMemo(
    () => accounts.filter((account) => Boolean(account.id)),
    [accounts],
  )
  const [accountId, setAccountId] = useState('')
  const [phone, setPhone] = useState('')
  const [productCode, setProductCode] = useState(initialDefaults?.productCode || FALLBACK_DEFAULTS.productCode)
  const [ageFeedTier, setAgeFeedTier] = useState('auto')
  const [pageId, setPageId] = useState(initialDefaults?.pageId || FALLBACK_DEFAULTS.pageId)
  const [touchCode, setTouchCode] = useState(initialDefaults?.touchCode || FALLBACK_DEFAULTS.touchCode)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [session, setSession] = useState<BusinessOrderSession>()
  const [loginCode, setLoginCode] = useState('')
  const [orderCode, setOrderCode] = useState('')
  const [acceptedProtocol, setAcceptedProtocol] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [result, setResult] = useState<BusinessOrderResult>()
  const [busyAction, setBusyAction] = useState<string>()
  const [error, setError] = useState<string>()
  const [clock, setClock] = useState(Date.now())
  const [loginSmsDeadline, setLoginSmsDeadline] = useState(0)
  const [orderSmsDeadline, setOrderSmsDeadline] = useState(0)

  useEffect(() => {
    if (initialDefaults) return
    void loadBusinessOrderDefaults()
      .then((defaults) => {
        if (session) return
        setProductCode(defaults.productCode)
        setPageId(defaults.pageId)
        setTouchCode(defaults.touchCode)
      })
      .catch(() => undefined)
  }, [initialDefaults, session])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!initialAccountId || accountId || session) return
    const account = selectableAccounts.find((item) => item.id === initialAccountId)
    if (!account) return
    setAccountId(account.id)
    setPhone(account.phone || '')
  }, [accountId, initialAccountId, selectableAccounts, session])

  const currentStep = stageStep(session)
  const paramsChanged = Boolean(
    session &&
      ((isAgeFeed ? (session.ageFeedTier || 'auto') !== ageFeedTier : session.productCode !== productCode) || session.pageId !== pageId || session.touchCode !== touchCode),
  )
  const loginCooldown = Math.max(0, Math.ceil((loginSmsDeadline - clock) / 1000))
  const orderCooldown = Math.max(0, Math.ceil((orderSmsDeadline - clock) / 1000))
  const hasValidationRisk = Boolean(
    session?.product &&
      (!session.product.configured ||
        !session.product.available ||
        session.product.eligible === false ||
        session.product.relationOrdered === true ||
        session.product.warnings.length > 0),
  )

  function clearError() {
    setError(undefined)
  }

  function updateParameter(setter: (value: string) => void, value: string) {
    setter(value.trim())
    setAcceptedProtocol(false)
    setOrderCode('')
    setResult(undefined)
    setLoginSmsDeadline(0)
    setOrderSmsDeadline(0)
  }

  async function run(action: string, task: () => Promise<void>) {
    setBusyAction(action)
    clearError()
    try {
      await task()
    } catch (requestError) {
      setError(errorText(requestError))
    } finally {
      setBusyAction(undefined)
    }
  }

  async function start() {
    await run('start', async () => {
      const next = await createBusinessOrder({
        target,
        accountId: accountId || undefined,
        phone: accountId ? undefined : phone,
        productCode: isAgeFeed ? ageFeedTier : productCode,
        pageId,
        touchCode,
      })
      setSession(next)
      setProductCode(next.productCode)
      setPhone('')
    })
  }

  async function reset() {
    const id = session?.id
    setSession(undefined)
    setAccountId('')
    setLoginCode('')
    setOrderCode('')
    setAcceptedProtocol(false)
    setConfirmationText('')
    setResult(undefined)
    setLoginSmsDeadline(0)
    setOrderSmsDeadline(0)
    clearError()
    if (id) await deleteBusinessOrder(id).catch(() => undefined)
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-5">
      {showHeader ? <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
          <h1 className="text-xl font-semibold text-zinc-950">业务订购</h1>
          <p className="mt-1 text-sm text-zinc-500">10086 CK 免验证码登录、产品核验与二次确认订购</p>
        </div>
        {session ? (
          <button
            type="button"
            onClick={() => void reset()}
            disabled={Boolean(busyAction)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
            <RotateCcw className="h-3.5 w-3.5" />
            重新开始
          </button>
        ) : null}
      </div> : null}

      {officialSourceUrl ? (
        <div className="flex flex-col gap-3 border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-amber-900">已有账号使用 10086 CK 置换 COC 订购凭证，仅手动输入手机号时使用验证码登录。</p>
          <a href={officialSourceUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-950 hover:bg-amber-100">
            <ExternalLink className="h-3.5 w-3.5" />打开官方页面
          </a>
        </div>
      ) : null}

      <StatusStepper current={currentStep} />

      {error ? <MessageDialog value={{ title: '操作未完成', message: error, type: 'error' }} onClose={clearError} /> : null}

      {!session ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50 text-emerald-700">
              <KeyRound className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">确认订购对象</h2>
              <p className="mt-0.5 text-xs text-zinc-500">手机号仅保存在本次短时会话中</p>
            </div>
          </div>
          {selectableAccounts.length > 0 ? (
            <div className="mb-4 max-w-xl">
              <V2SearchableAccountSelect
                accounts={selectableAccounts}
                value={accountId}
                label={allowManualPhone ? '已有账号（可选）' : '订购账号'}
                emptyLabel={allowManualPhone ? '搜索账号或手动输入手机号' : '搜索已关联账号'}
                allowEmpty={allowManualPhone}
                onChange={(id) => {
                  setAccountId(id)
                  const account = selectableAccounts.find((item) => item.id === id)
                  setPhone(account?.phone || '')
                }}
              />
            </div>
          ) : !allowManualPhone ? (
            <div className="mb-4 border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              当前用户没有可办理的关联账号，请联系管理员先绑定账号。
            </div>
          ) : null}
          <div className={cn('grid gap-4', allowManualPhone && 'sm:grid-cols-2')}>
            {allowManualPhone ? (
              <Field
                label="中国移动手机号"
                value={phone}
                onChange={setPhone}
                phoneInput
                placeholder={accountId ? selectableAccounts.find((item) => item.id === accountId)?.phoneMasked || '已选择账号' : '请输入 11 位手机号'}
                disabled={Boolean(accountId)}
              />
            ) : null}
            {isAgeFeed ? <AgeFeedTierSelect value={ageFeedTier} onChange={(value) => updateParameter(setAgeFeedTier, value)} disabled={Boolean(busyAction)} /> : <Field label="产品编码" value={productCode} onChange={(value) => updateParameter(setProductCode, value)} placeholder="productCode" />}
          </div>
          <button
            type="button"
            onClick={() => setAdvancedOpen((value) => !value)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950">
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', advancedOpen && 'rotate-180')} />
            活动参数
          </button>
          {advancedOpen ? (
            <div className="mt-3 grid gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-2">
              <Field label="页面 ID" value={pageId} onChange={(value) => updateParameter(setPageId, value)} disabled={isAgeFeed} />
              <Field label="渠道编码" value={touchCode} onChange={(value) => updateParameter(setTouchCode, value)} disabled={isAgeFeed} />
            </div>
          ) : null}
          <div className="mt-5 flex justify-end">
            <PrimaryButton
              icon={KeyRound}
              onClick={() => void start()}
              busy={busyAction === 'start'}
              disabled={
                (allowManualPhone ? !accountId && !/^1\d{10}$/.test(phone) : !accountId) ||
                !productCode ||
                !pageId ||
                !touchCode
              }>
              校验并开始
            </PrimaryButton>
          </div>
        </section>
      ) : null}

      {session && currentStep >= 1 ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">账号登录</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {session.maskedPhone} · {[session.cityName, session.areaName].filter(Boolean).join(' ') || '号码已校验'}
              </p>
            </div>
            {currentStep > 1 ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 已登录
                </span>
                {isAgeFeed ? <button type="button" onClick={() => void reset()} disabled={Boolean(busyAction)} className="h-9 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">切换账号</button> : null}
              </div>
            ) : null}
          </div>
          {currentStep === 1 ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <Field label="登录验证码" value={loginCode} onChange={(value) => setLoginCode(value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="6 位验证码" />
              </div>
              <button
                type="button"
                onClick={() => void run('login-sms', async () => {
                  const next = await sendBusinessOrderLoginSms(session.id)
                  setSession(next)
                  setLoginSmsDeadline(Date.now() + next.loginSmsCooldownSeconds * 1000)
                })}
                disabled={Boolean(busyAction) || loginCooldown > 0}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
                {busyAction === 'login-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loginCooldown > 0 ? `${loginCooldown}s 后重发` : '发送验证码'}
              </button>
              <PrimaryButton
                icon={LockKeyhole}
                onClick={() => void run('login', async () => setSession(await loginBusinessOrder(session.id, loginCode)))}
                busy={busyAction === 'login'}
                disabled={loginCode.length !== 6 || session.stage !== 'login_sms_sent'}>
                验证并登录
              </PrimaryButton>
            </div>
          ) : null}
        </section>
      ) : null}

      {session && currentStep >= 2 ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">产品核验</h2>
              <p className="mt-1 text-xs text-zinc-500">{isAgeFeed ? '实时查询网龄、全球通等级、直升资格与受理协议' : '实时查询页面配置、供应状态、资格与协议'}</p>
            </div>
            {session.product && !paramsChanged ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" /> 已获取
              </span>
            ) : null}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {isAgeFeed ? <AgeFeedTierSelect value={ageFeedTier} onChange={(value) => updateParameter(setAgeFeedTier, value)} disabled={Boolean(busyAction) || session.stage === 'ordering' || Boolean(session.lastResult?.uncertain)} /> : <Field label="产品编码" value={productCode} onChange={(value) => updateParameter(setProductCode, value)} disabled={session.stage === 'ordering'} />}
            <Field label="页面 ID" value={pageId} onChange={(value) => updateParameter(setPageId, value)} disabled={isAgeFeed || session.stage === 'ordering'} />
            <Field label="渠道编码" value={touchCode} onChange={(value) => updateParameter(setTouchCode, value)} disabled={isAgeFeed || session.stage === 'ordering'} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {paramsChanged ? <span className="text-xs font-medium text-amber-700">参数已变化，旧协议与订购验证码将失效</span> : <span />}
            <PrimaryButton
              icon={PackageSearch}
              onClick={() => void run('product', async () => {
                const next = await prepareBusinessOrderProduct(session.id, { productCode: isAgeFeed ? ageFeedTier : productCode, pageId, touchCode })
                setSession(next)
                setProductCode(next.productCode)
                setAcceptedProtocol(false)
                setOrderCode('')
                setResult(undefined)
                setOrderSmsDeadline(Date.now() + next.orderSmsCooldownSeconds * 1000)
              })}
              busy={busyAction === 'product'}
              disabled={Boolean(busyAction) || !productCode || !pageId || !touchCode || session.stage === 'ordering' || (isAgeFeed && Boolean(session.lastResult?.uncertain))}>
              {session.product ? '重新获取产品信息' : '获取产品信息'}
            </PrimaryButton>
          </div>

          {session.product && !paramsChanged ? (
            <div className="mt-5 border-t border-zinc-200 pt-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div><span className="text-xs text-zinc-500">产品名称</span><strong className="mt-1 block text-sm text-zinc-950">{session.product.productName}</strong>{isAgeFeed ? <span className="mt-1 block break-all text-xs text-zinc-500">{session.productCode}</span> : null}</div>
                <div><span className="text-xs text-zinc-500">页面配置</span><strong className={cn('mt-1 block text-sm', session.product.configured ? 'text-emerald-700' : 'text-red-700')}>{session.product.configured ? '已匹配' : '未匹配'}</strong></div>
                <div><span className="text-xs text-zinc-500">{isAgeFeed ? '办理状态' : '省份供应'}</span><strong className={cn('mt-1 block text-sm', session.product.available ? 'text-emerald-700' : 'text-red-700')}>{session.product.available ? isAgeFeed ? '可尝试办理' : '可办理' : '未通过'}</strong></div>
                <div><span className="text-xs text-zinc-500">活动资格</span><strong className={cn('mt-1 block text-sm', session.product.eligible === false || session.product.relationOrdered ? 'text-red-700' : 'text-zinc-950')}>{session.product.eligibilitySummary || (session.product.eligible === undefined ? '非卓越钻石专用检查' : session.product.eligible ? '通过' : '未通过')}</strong></div>
              </div>
              {session.product.eligibilityDetail ? <p className="mt-3 break-words text-sm leading-6 text-zinc-600">{session.product.eligibilityDetail}</p> : null}
              {session.product.warnings.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {session.product.warnings.map((warning) => (
                    <div key={warning} className="flex items-start gap-2 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {warning}
                    </div>
                  ))}
                </div>
              ) : null}
              {session.product.rulesHtml ? (
                <details className="mt-4 border-t border-zinc-100 pt-4">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-800">查看产品规则</summary>
                  <div className="mt-3 max-h-72 overflow-y-auto bg-zinc-50 p-4"><SafeHtml html={session.product.rulesHtml} /></div>
                </details>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {session?.product?.protocol.sequenceId && !paramsChanged ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-zinc-500" />
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">{session.product.protocol.name}</h2>
              <p className="mt-0.5 text-xs text-zinc-500">协议序列号由本次实时查询生成</p>
            </div>
          </div>
          <div className="mt-4 max-h-96 overflow-y-auto border border-zinc-200 bg-zinc-50 p-4">
            <SafeHtml html={session.product.protocol.content} />
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-zinc-800">
            <input
              type="checkbox"
              checked={acceptedProtocol}
              onChange={(event) => setAcceptedProtocol(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span>我已核对产品、资费和业务受理协议</span>
          </label>
        </section>
      ) : null}

      {session?.product && session.product.orderAllowed !== false && !paramsChanged && session.stage !== 'finished' ? (
        <section className="border-y border-red-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">订购二次确认</h2>
              <p className="mt-1 text-xs leading-5 text-zinc-600">
                将为 {session.maskedPhone} 订购 {session.product.productName}（{session.productCode}）
              </p>
            </div>
          </div>
          {hasValidationRisk ? (
            <div className="mt-4 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              部分产品校验未通过，上游仍可能拒绝受理。核对风险与协议后，可继续发送验证码并尝试订购。
            </div>
          ) : null}
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <Field label="订购验证码" value={orderCode} onChange={(value) => setOrderCode(value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="6 位验证码" disabled={session.stage !== 'order_sms_sent'} />
              <button
                type="button"
                onClick={() => void run('order-sms', async () => {
                  const next = await sendBusinessOrderSms(session.id, acceptedProtocol)
                  setSession(next)
                  setOrderSmsDeadline(Date.now() + next.orderSmsCooldownSeconds * 1000)
                })}
                disabled={Boolean(busyAction) || !acceptedProtocol || orderCooldown > 0}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
                {busyAction === 'order-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {orderCooldown > 0 ? `${orderCooldown}s 后重发` : '发送订购验证码'}
              </button>
          </div>
          {session.stage === 'order_sms_sent' ? (
            <div className="mt-4 border-t border-red-100 pt-4">
              <Field label="输入“确认订购”" value={confirmationText} onChange={setConfirmationText} placeholder="确认订购" />
              <div className="mt-4 flex justify-end">
                <PrimaryButton
                  icon={LockKeyhole}
                  danger
                  onClick={() => void run('confirm', async () => {
                    try {
                      const next = await submitBusinessOrder(session.id, { code: orderCode, acceptedProtocol, confirmationText })
                      setSession(next.session)
                      setResult(next.result)
                    } catch (reason) {
                      const failure = orderFailureResponse(reason)
                      setResult({ success: false, uncertain: false, code: failure.code, message: failure.message, completedAt: new Date().toISOString(), response: failure.response })
                      throw reason
                    }
                  })}
                  busy={busyAction === 'confirm'}
                  disabled={orderCode.length !== 6 || confirmationText !== '确认订购' || !acceptedProtocol}>
                  确认订购
                </PrimaryButton>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {(result || session?.lastResult) ? (() => {
        const finalResult = result || session?.lastResult
        if (!finalResult) return null
        return (
          <section className={cn('border-y bg-white px-4 py-6 sm:px-5', finalResult.success ? 'border-emerald-200' : finalResult.uncertain ? 'border-amber-300' : 'border-red-200')}>
            <div className="flex items-start gap-3">
              {finalResult.success ? <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" /> : finalResult.uncertain ? <AlertTriangle className="h-6 w-6 shrink-0 text-amber-700" /> : <Circle className="h-6 w-6 shrink-0 text-red-700" />}
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-zinc-950">{finalResult.success ? '订购成功' : finalResult.uncertain ? '结果未确认' : '订购未成功'}</h2>
                <p className="mt-1 break-words text-sm text-zinc-700">{finalResult.message}</p>
                <p className="mt-2 text-xs text-zinc-500">业务码 {finalResult.code || '-'} · {new Date(finalResult.completedAt).toLocaleString('zh-CN', { hour12: false })}</p>
                <V2OrderResponseDetails response={finalResult.response ?? finalResult.data ?? { code: finalResult.code, message: finalResult.message }} />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => void reset()} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                <RotateCcw className="h-3.5 w-3.5" /> 重新开始
              </button>
            </div>
          </section>
        )
      })() : null}
    </div>
  )
}
