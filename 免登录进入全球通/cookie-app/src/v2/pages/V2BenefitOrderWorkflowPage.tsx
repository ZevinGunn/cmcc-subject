import PhoneInput from '@/components/PhoneInput'
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  FileText,
  KeyRound,
  Loader2,
  LockKeyhole,
  PackageSearch,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  ShieldAlert,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import SsoNavigationDialog from '@/components/SsoNavigationDialog'
import V2BusinessTierDialog from '../components/V2BusinessTierDialog'
import V2ConfirmDialog from '../components/V2ConfirmDialog'
import V2SearchableAccountSelect from '../components/V2SearchableAccountSelect'
import V2OrderResponseDetails, { orderFailureResponse } from '../components/V2OrderResponseDetails'
import { ApiClientError } from '../lib/api'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import {
  loadCustomBusinessTiers,
  mergeBusinessTiers,
  saveCustomBusinessTiers,
  upsertCustomBusinessTier,
  type CustomBusinessTier,
} from '../lib/customBusinessTiers'
import {
  confirmBenefitOrder,
  createCocAppSsoLink,
  createBenefitSession,
  deleteBenefitSession,
  loginBenefitSession,
  prepareBenefitProduct,
  rewindBenefitSession,
  selectBenefitProduct,
  sendBenefitLoginSms,
  sendBenefitOrderSms,
  COC_APP_BUSINESS_PRESETS,
  RETAIL_BUSINESS_PRESETS,
  type BenefitOrderResult,
  type BenefitOrderSession,
  type BenefitWorkflow,
  type CocAppBusinessId,
  type CustomPremiumNormInput,
  type RetailBusinessId,
  type LuckyBagVariant,
} from '../lib/benefitOrderApi'

const DEFAULTS = {
  building_bricks: {
    pageId: '1610185761689767936',
    touchCode: 'P00000001555',
    mainProductCode: '500000050353',
    orderProductCode: '789000000750',
  },
} as const

function errorText(error: unknown): string {
  if (error instanceof ApiClientError) {
    return `${error.message}${error.errorCode ? ` [${error.errorCode}]` : ''}${error.requestId ? `（请求 ${error.requestId}）` : ''}`
  }
  return error instanceof Error ? error.message : '请求失败'
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('COPY_FAILED')
}

function decodeRichText(html: string): string {
  if (typeof DOMParser === 'undefined') return ''
  let value = String(html || '').trim()
  for (let index = 0; index < 4 && value; index += 1) {
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        const parsed = JSON.parse(value)
        if (typeof parsed === 'string') value = parsed.trim()
      } catch {
        // Continue with entity decoding when the upstream value is not valid JSON.
      }
    }
    value = value
      .replace(/\\u003c/gi, '<')
      .replace(/\\u003e/gi, '>')
      .replace(/\\u0026/gi, '&')
      .replace(/\\n/g, '\n')
    if (/<\/?[a-z][^>]*>/i.test(value)) break
    const decoded = new DOMParser().parseFromString(value, 'text/html').documentElement.textContent?.trim() || ''
    if (!decoded || decoded === value) break
    value = decoded
  }
  return value
}

function sanitizeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return ''
  const doc = new DOMParser().parseFromString(decodeRichText(html), 'text/html')
  doc.querySelectorAll('script,style,iframe,object,embed,link,meta,form,input,button').forEach((node) => node.remove())
  doc.body.querySelectorAll('*').forEach((node) => {
    for (const attribute of Array.from(node.attributes)) {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()
      if (name.startsWith('on') || name === 'style') node.removeAttribute(attribute.name)
      if ((name === 'href' || name === 'src') && /^(javascript:|data:|vbscript:)/.test(value)) node.removeAttribute(attribute.name)
    }
  })
  return doc.body.innerHTML
}

function SafeHtml({ html }: { html: string }) {
  const safe = useMemo(() => sanitizeHtml(html), [html])
  return <div className="break-words text-sm leading-7 text-zinc-700 [&_a]:text-emerald-700 [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-200 [&_td]:p-2 [&_th]:border [&_th]:border-zinc-200 [&_th]:p-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: safe }} />
}

function initialParams(workflow: BenefitWorkflow, retailBusinessId: RetailBusinessId, cocAppBusinessId: CocAppBusinessId): Record<string, string> {
  if (workflow === 'lucky_bag') return {}
  if (workflow === 'building_bricks') return { ...DEFAULTS.building_bricks }
  if (workflow === 'coc_app') return {
    pageId: COC_APP_BUSINESS_PRESETS[cocAppBusinessId].pageId,
    touchCode: COC_APP_BUSINESS_PRESETS[cocAppBusinessId].touchCode,
    productCode: COC_APP_BUSINESS_PRESETS[cocAppBusinessId].productCode,
  }
  return { ...RETAIL_BUSINESS_PRESETS[retailBusinessId] }
}

const CUSTOM_PRODUCT_LABELS: Record<string, string> = {
  productCode: '产品编码 productCode', productId: '产品 ID productId', touchCode: '渠道码 touchCode',
  marketingCode: '营销活动码 marketingCode', secondChannel: '二级渠道 secondChannel', effectType: '生效方式 effectType',
  fromRecommend: '推荐来源 fromRecommend', redCode: '红包码 redCode', rcm_src: '推荐场景 rcm_src',
  traceId: '链路 ID traceId', agentid: '代理 ID agentid', pageSource: '页面来源 pageSource', pageid: '页面 ID pageid',
}

function ActionButton({
  children,
  onClick,
  icon: Icon,
  busy,
  disabled,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  icon: typeof Send
  busy?: boolean
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50',
        danger ? 'bg-red-700 hover:bg-red-800' : 'bg-zinc-950 hover:bg-zinc-800',
      )}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

export default function V2BenefitOrderWorkflowPage({
  workflow,
  accounts,
  initialAccountId,
  allowManualPhone,
  retailBusinessId = 'premium_membership',
  retailProductName = '智臻会员',
  cocAppBusinessId = 'smart_life',
  bagVariant = 'standard',
}: {
  workflow: BenefitWorkflow
  accounts: BusinessOrderAccount[]
  initialAccountId?: string
  allowManualPhone: boolean
  retailBusinessId?: RetailBusinessId
  retailProductName?: string
  cocAppBusinessId?: CocAppBusinessId
  bagVariant?: LuckyBagVariant
}) {
  const [accountId, setAccountId] = useState(initialAccountId || '')
  const [phone, setPhone] = useState('')
  const [session, setSession] = useState<BenefitOrderSession>()
  const [loginCode, setLoginCode] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [acceptedProtocol, setAcceptedProtocol] = useState(false)
  const [forceAttempt, setForceAttempt] = useState(false)
  const [orderCode, setOrderCode] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [result, setResult] = useState<BenefitOrderResult>()
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [clock, setClock] = useState(Date.now())
  const [loginDeadline, setLoginDeadline] = useState(0)
  const [orderDeadline, setOrderDeadline] = useState(0)
  const [advanced, setAdvanced] = useState(false)
  const [pendingSso, setPendingSso] = useState<{ url: string; destination: string } | null>(null)
  const [params, setParams] = useState<Record<string, string>>(() => initialParams(workflow, retailBusinessId, cocAppBusinessId))
  const [useCustomNorm, setUseCustomNorm] = useState(false)
  const [customNorm, setCustomNorm] = useState<Record<keyof CustomPremiumNormInput, string>>({
    id: '', packageId: '', name: '', price: '', bizIntfCode: '001_JIYUN',
  })
  const [customCocTiers, setCustomCocTiers] = useState<CustomBusinessTier[]>(() => loadCustomBusinessTiers(cocAppBusinessId))
  const [tierEditor, setTierEditor] = useState<{ tier?: CustomBusinessTier; custom: boolean; originalId?: string } | null>(null)
  const [confirmTierDelete, setConfirmTierDelete] = useState(false)
  const sessionIdRef = useRef('')

  useEffect(() => {
    sessionIdRef.current = session?.id || ''
  }, [session?.id])

  useEffect(() => () => {
    if (sessionIdRef.current) void deleteBenefitSession(sessionIdRef.current).catch(() => undefined)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!session?.product || selectedIds.length > 0) return
    if (workflow === 'building_bricks') {
      const flow = session.product.modules?.find((item) => item.category === 'flow')
      const voice = session.product.modules?.find((item) => item.category === 'voice')
      if (flow && voice) setSelectedIds([flow.id, voice.id])
    } else {
      const norm = session.product.norms?.[0]
      if (norm) setSelectedIds([norm.id])
    }
  }, [selectedIds.length, session?.product, workflow])

  const loginCooldown = Math.max(0, Math.ceil((loginDeadline - clock) / 1000))
  const orderCooldown = Math.max(0, Math.ceil((orderDeadline - clock) / 1000))
  const selectedModules = (session?.product?.modules || []).filter((item) => selectedIds.includes(item.id))
  const displayedNorms = useMemo(
    () => workflow === 'coc_app' ? mergeBusinessTiers(session?.product?.norms || [], customCocTiers) : session?.product?.norms || [],
    [customCocTiers, session?.product?.norms, workflow],
  )
  const customCocTierIds = useMemo(() => new Set(customCocTiers.map((item) => item.id)), [customCocTiers])
  const selectedNorm = displayedNorms.find((item) => selectedIds.includes(item.id))
  const protocolAccepted = !session?.product?.protocolRequired || acceptedProtocol
  const lockedPersonalPage = workflow === 'lucky_bag' || retailBusinessId === 'good_gifts_membership' || retailBusinessId === 'good_gifts_data'
  const manualPhoneAvailable = allowManualPhone && (workflow === 'building_bricks' || workflow === 'lucky_bag')
  const bagName = bagVariant === 'deluxe' ? '豪华福袋' : '标准福袋'

  async function run(action: string, task: () => Promise<void>) {
    setBusy(action)
    setError('')
    try {
      await task()
    } catch (reason) {
      setError(errorText(reason))
    } finally {
      setBusy('')
    }
  }

  function clearProgress() {
    setLoginCode('')
    setSelectedIds([])
    setAcceptedProtocol(false)
    setForceAttempt(false)
    setOrderCode('')
    setConfirmationText('')
    setResult(undefined)
    setLoginDeadline(0)
    setOrderDeadline(0)
    setUseCustomNorm(false)
    setCustomNorm({ id: '', packageId: '', name: '', price: '', bizIntfCode: '001_JIYUN' })
  }

  async function reset() {
    const id = session?.id
    setSession(undefined)
    setAccountId(initialAccountId || '')
    setPhone('')
    setParams(initialParams(workflow, retailBusinessId, cocAppBusinessId))
    setAdvanced(retailBusinessId === 'custom')
    clearProgress()
    setError('')
    if (id) await deleteBenefitSession(id).catch(() => undefined)
  }

  async function back() {
    if (!session) return
    if (session.stage === 'selection_ready' || session.stage === 'order_sms_sent') {
      const next = await rewindBenefitSession(session.id)
      setSession(next)
      setAcceptedProtocol(false)
      setForceAttempt(false)
      setOrderCode('')
      setConfirmationText('')
      setOrderDeadline(0)
      return
    }
    const id = session.id
    setSession(undefined)
    clearProgress()
    await deleteBenefitSession(id).catch(() => undefined)
  }

  function updateModule(id: string, category: 'flow' | 'voice') {
    const modules = session?.product?.modules || []
    setSelectedIds((current) => [
      ...current.filter((selectedId) => modules.find((item) => item.id === selectedId)?.category !== category),
      id,
    ])
    setAcceptedProtocol(false)
    setOrderCode('')
  }

  function saveCocTier(tier: CustomBusinessTier) {
    const next = upsertCustomBusinessTier(customCocTiers, tier, tierEditor?.originalId)
    saveCustomBusinessTiers(cocAppBusinessId, next)
    setCustomCocTiers(next)
    setSelectedIds([tier.id])
    setUseCustomNorm(false)
    setAcceptedProtocol(false)
    setConfirmTierDelete(false)
    setTierEditor(null)
  }

  function deleteCocTier() {
    const id = tierEditor?.originalId || tierEditor?.tier?.id
    if (!id) return
    const next = customCocTiers.filter((item) => item.id !== id)
    saveCustomBusinessTiers(cocAppBusinessId, next)
    setCustomCocTiers(next)
    if (selectedIds.includes(id) && !(session?.product?.norms || []).some((item) => item.id === id)) {
      const fallback = mergeBusinessTiers(session?.product?.norms || [], next)[0]
      setSelectedIds(fallback ? [fallback.id] : [])
    }
    setAcceptedProtocol(false)
    setTierEditor(null)
  }

  return (
    <div className="space-y-4">
      <V2BusinessTierDialog
        open={Boolean(tierEditor) && !confirmTierDelete}
        tier={tierEditor?.tier}
        custom={tierEditor?.custom || false}
        onClose={() => { setConfirmTierDelete(false); setTierEditor(null) }}
        onSave={saveCocTier}
        onDelete={tierEditor?.custom ? () => setConfirmTierDelete(true) : undefined}
      />
      <V2ConfirmDialog
        open={confirmTierDelete}
        title={(session?.product?.norms || []).some((item) => item.id === tierEditor?.originalId) ? '恢复实时档位' : '删除自定义档位'}
        description={(session?.product?.norms || []).some((item) => item.id === tierEditor?.originalId) ? '将删除当前浏览器中的自定义覆盖，恢复上游实时返回的档位信息。' : '该档位将从当前浏览器的自定义档位中删除。'}
        confirmLabel={(session?.product?.norms || []).some((item) => item.id === tierEditor?.originalId) ? '恢复默认' : '删除档位'}
        destructive
        onClose={() => setConfirmTierDelete(false)}
        onConfirm={deleteCocTier}
      />
      <SsoNavigationDialog
        url={pendingSso?.url ?? null}
        destination={pendingSso?.destination}
        onOpen={() => {
          if (!pendingSso) return
          window.open(pendingSso.url, '_blank', 'noopener,noreferrer')
          setPendingSso(null)
        }}
        onCopy={() => {
          if (!pendingSso) return
          void copyText(pendingSso.url).then(
            () => setPendingSso(null),
            () => setError('复制链接失败，请允许浏览器访问剪贴板'),
          )
        }}
      />
      {error ? (
        <div role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      ) : null}

      {session && (workflow === 'premium_membership' || workflow === 'lucky_bag') ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-y border-zinc-200 bg-zinc-50 px-4 py-2.5 sm:px-5">
          <span className="text-xs text-zinc-500">当前步骤：{session.stage === 'authenticated' ? '产品参数' : session.stage === 'product_ready' ? '业务档位' : session.stage === 'selection_ready' || session.stage === 'order_sms_sent' ? '协议与订购确认' : '办理结果'}</span>
          <div className="flex items-center gap-2">
            {!['finished', 'ordering', 'initialized', 'login_sms_sent'].includes(session.stage) ? (
              <button type="button" disabled={Boolean(busy)} onClick={() => void run('back', back)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"><ArrowLeft className="h-3.5 w-3.5" />返回上一步</button>
            ) : null}
            <button type="button" disabled={Boolean(busy)} onClick={() => void run('reset', reset)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" />重新开始</button>
          </div>
        </div>
      ) : null}

      {workflow === 'coc_app' ? (
        <div className="flex flex-col gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="block text-xs">官方 App 页面</strong>
            <span className="mt-0.5 block text-xs text-amber-800">选择账号后使用 10086 CK 自动生成该资费页的短期登录票据。</span>
          </div>
          <button
            type="button"
            disabled={!accountId || Boolean(busy)}
            onClick={() => void run('sso-link', async () => {
              const url = await createCocAppSsoLink(accountId, cocAppBusinessId)
              setPendingSso({
                url,
                destination: cocAppBusinessId === 'smart_life' ? '智臻会员 COC版' : '全球通 5GA',
              })
            })}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50">
            {busy === 'sso-link' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
            生成并打开资费页
          </button>
        </div>
      ) : null}

      {!session ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-zinc-950">选择办理账号</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {workflow === 'lucky_bag' ? `${bagName}使用独立短信登录，主资费包含一项可选权益` : workflow === 'building_bricks'
                ? '已有账号使用 10086 CK 自动置换积木套餐订购凭证，手动手机号使用短信登录'
                : workflow === 'coc_app'
                  ? '使用所选账号的 10086 CK 自动置换 COC 订购凭证'
                  : `${retailProductName}使用所选账号的 10086 SSO 登录态`}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <V2SearchableAccountSelect
              accounts={accounts}
              value={accountId}
              onChange={setAccountId}
              allowEmpty={manualPhoneAvailable}
              emptyLabel={manualPhoneAvailable ? '搜索账号或手动输入手机号' : '搜索已有账号'}
            />
            {manualPhoneAvailable && !accountId ? (
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-zinc-700">中国移动手机号</span>
                <PhoneInput
                  value={phone}
                  onValueChange={setPhone}
                  placeholder="请输入 11 位手机号"
                  className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600"
                />
              </label>
            ) : null}
          </div>
          {retailBusinessId === 'custom' && workflow === 'premium_membership' ? (
            <div className="mt-5 border-t border-zinc-100 pt-4">
              <h3 className="text-sm font-semibold text-zinc-900">自定义业务参数</h3>
              <p className="mt-1 text-xs text-zinc-500">productCode 必填，其他字段按移动商城链接或接口参数填写。</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(params).map(([key, value]) => (
                  <label key={key} className="space-y-1">
                    <span className="text-xs text-zinc-600">{CUSTOM_PRODUCT_LABELS[key] || key}{key === 'productCode' ? ' *' : ''}</span>
                    <input value={value} onChange={(event) => setParams((current) => ({ ...current, [key]: event.target.value.trim() }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" />
                  </label>
                ))}
              </div>
            </div>
          ) : !lockedPersonalPage ? (
            <button type="button" onClick={() => setAdvanced((value) => !value)} className="mt-4 text-xs font-medium text-zinc-600 hover:text-zinc-950">
              {advanced ? '收起活动参数' : '活动参数'}
            </button>
          ) : null}
          {advanced && !lockedPersonalPage && !(retailBusinessId === 'custom' && workflow === 'premium_membership') ? (
            <div className="mt-3 grid gap-3 border-t border-zinc-100 pt-3 sm:grid-cols-2">
              {Object.entries(params).map(([key, value]) => (
                <label key={key} className="space-y-1">
                  <span className="text-xs text-zinc-500">{key}</span>
                  <input value={value} onChange={(event) => setParams((current) => ({ ...current, [key]: event.target.value.trim() }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                </label>
              ))}
            </div>
          ) : null}
          <div className="mt-5 flex justify-end">
            <ActionButton
              icon={KeyRound}
              busy={busy === 'start'}
              disabled={(!accountId && !(manualPhoneAvailable && /^1\d{10}$/.test(phone))) || (workflow === 'premium_membership' && retailBusinessId === 'custom' && !params.productCode)}
              onClick={() => void run('start', async () => {
                const next = await createBenefitSession({ workflow, bagVariant, businessId: retailBusinessId, appBusinessId: cocAppBusinessId, accountId: accountId || undefined, phone: phone || undefined, ...params })
                setSession(next)
                setPhone('')
              })}>
              {workflow === 'premium_membership' ? `建立${retailProductName}登录态` : '校验并开始'}
            </ActionButton>
          </div>
        </section>
      ) : null}

      {session && workflow !== 'premium_membership' && ['initialized', 'login_sms_sent'].includes(session.stage) ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold">{workflow === 'lucky_bag' ? `${bagName}独立登录` : workflow === 'building_bricks' ? '积木套餐独立登录' : 'COC 订购会话登录'}</h2><p className="mt-1 text-xs text-zinc-500">{session.maskedPhone}</p></div>
            <button type="button" title="重新开始" onClick={() => void reset()} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 space-y-1.5"><span className="text-xs font-medium text-zinc-700">登录验证码</span><input value={loginCode} onChange={(event) => setLoginCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" /></label>
            <button type="button" disabled={Boolean(busy) || loginCooldown > 0} onClick={() => void run('login-sms', async () => { const next = await sendBenefitLoginSms(session.id); setSession(next); setLoginDeadline(Date.now() + next.loginSmsCooldownSeconds * 1000) })} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm disabled:opacity-50">
              {busy === 'login-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{loginCooldown ? `${loginCooldown}s` : '发送验证码'}
            </button>
            <ActionButton icon={LockKeyhole} busy={busy === 'login'} disabled={session.stage !== 'login_sms_sent' || loginCode.length !== 6} onClick={() => void run('login', async () => setSession(await loginBenefitSession(session.id, loginCode)))}>验证并登录</ActionButton>
          </div>
        </section>
      ) : null}

      {session && ['authenticated', 'product_ready', 'selection_ready', 'order_sms_sent'].includes(session.stage) ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold">{workflow === 'lucky_bag' ? '福袋主资费与权益' : '实时产品与资格'}</h2><p className="mt-1 text-xs text-zinc-500">{session.maskedPhone} · 归属 {session.provinceCode || '-'} / {session.cityCode || '-'}</p></div>
            {!session.product ? (
              <ActionButton icon={PackageSearch} busy={busy === 'product'} onClick={() => void run('product', async () => setSession(await prepareBenefitProduct(session.id)))}>获取产品信息</ActionButton>
            ) : <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />产品已加载</span>}
          </div>

          {session.product?.bagStatus ? (
            <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3 text-sm" aria-label="福袋订购状态">
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                <div className="flex gap-3"><dt className="shrink-0 text-zinc-500">主资费</dt><dd>{session.product.name} · {session.product.bagStatus.mainMonthlyFee} 元/月 · {session.product.bagStatus.mainOrdered ? '已订购' : '未订购'}</dd></div>
                <div className="flex gap-3"><dt className="shrink-0 text-zinc-500">本次操作</dt><dd>{session.product.bagStatus.action === 'main_order' ? '首订主资费及一项权益' : session.product.bagStatus.action === 'benefit_order' ? '选择套餐内权益' : '更换套餐内权益'}</dd></div>
                {session.product.details?.map((item) => <div key={item.label} className="flex gap-3"><dt className="shrink-0 text-zinc-500">{item.label}</dt><dd className="break-words">{item.value}</dd></div>)}
              </dl>
              {session.product.warnings.map((warning) => <p key={warning} className="text-xs leading-5 text-amber-800">{warning}</p>)}
              {session.stage === 'product_ready' || session.stage === 'selection_ready' ? <button type="button" disabled={Boolean(busy)} onClick={() => void run('product', async () => { const next = await prepareBenefitProduct(session.id); clearProgress(); setSession(next); setOrderDeadline(Date.now() + next.orderSmsCooldownSeconds * 1000) })} className="inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-emerald-700 disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" />刷新订购关系</button> : null}
            </div>
          ) : null}

          {session.product && session.stage === 'product_ready' ? (
            <div className="mt-5 border-t border-zinc-100 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">{workflow === 'building_bricks' ? '选择必选模组' : workflow === 'lucky_bag' ? '选择一项权益' : '选择业务档位'}</h3>
                {workflow === 'coc_app' ? (
                  <button type="button" onClick={() => setTierEditor({ custom: false })} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 transition-[background-color,transform] duration-150 hover:bg-zinc-50 active:scale-[0.97]">
                    <Plus className="h-3.5 w-3.5" />新增档位
                  </button>
                ) : null}
              </div>
              {workflow === 'building_bricks' ? (
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {(['flow', 'voice'] as const).map((category) => (
                    <fieldset key={category} className="min-w-0">
                      <legend className="mb-2 text-xs font-medium text-zinc-600">{category === 'flow' ? '流量模组' : '语音模组'}</legend>
                      <div className="grid gap-2">
                        {(session.product?.modules || []).filter((item) => item.category === category).map((item) => (
                          <label key={item.id} className={cn('flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm', selectedIds.includes(item.id) ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-200')}>
                            <input type="radio" name={category} checked={selectedIds.includes(item.id)} onChange={() => updateModule(item.id, category)} />
                            <span className="min-w-0 flex-1 font-medium">{item.name}</span><span className="shrink-0 text-zinc-600">{item.fee} 元/月</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {displayedNorms.length ? (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedNorms.map((norm) => {
                        const customTier = workflow === 'coc_app' && customCocTierIds.has(norm.id)
                        const disabled = workflow === 'premium_membership' && useCustomNorm
                        return (
                          <div key={norm.id} className={cn('flex min-w-0 items-center rounded-md border', disabled ? 'border-zinc-200 bg-zinc-50 opacity-55' : selectedIds.includes(norm.id) ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-200 bg-white')}>
                            <label className={cn('flex min-w-0 flex-1 items-center gap-3 px-3 py-3', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
                              <input type="radio" name="premium-norm" disabled={disabled} checked={!disabled && selectedIds.includes(norm.id)} onChange={() => { setSelectedIds([norm.id]); setUseCustomNorm(false); setAcceptedProtocol(false) }} />
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-1.5"><strong className="break-words text-sm">{norm.name}</strong>{customTier ? <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">自定义</span> : null}</span>
                                <span className="break-all text-xs text-zinc-500">权益码 {workflow === 'lucky_bag' ? norm.id : norm.packageId || '-'}{norm.variantCount > 1 ? ` · ${norm.variantCount} 个适配版本` : ''}</span>
                              </span>
                              <span className="shrink-0 text-sm font-semibold">{workflow === 'lucky_bag' && session.product?.bagStatus?.mainOrdered ? '套餐内' : `${workflow === 'lucky_bag' ? norm.price : norm.price.toFixed(0)} 元/月`}</span>
                            </label>
                            {workflow === 'coc_app' ? (
                              <button type="button" title={`编辑 ${norm.name}`} aria-label={`编辑 ${norm.name}`} onClick={() => setTierEditor({ tier: { id: norm.id, name: norm.name, price: norm.price }, custom: customTier, originalId: norm.id })} className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 transition-[background-color,transform] duration-150 hover:bg-white hover:text-zinc-900 active:scale-[0.97]">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : <p className="bg-amber-50 px-3 py-2 text-xs text-amber-900">{workflow === 'lucky_bag' ? '当前没有可更换权益，请刷新订购关系。' : '未查询到可选档位，可使用下方自定义档位继续实时校验。'}</p>}
                  {workflow === 'premium_membership' ? <>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-800">
                      <input type="checkbox" checked={useCustomNorm} onChange={(event) => { setUseCustomNorm(event.target.checked); setAcceptedProtocol(false) }} />使用自定义业务档位
                    </label>
                    {useCustomNorm ? (
                      <div className="grid gap-3 border-t border-zinc-100 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                        {([
                          ['id', 'normId *', 'numeric'], ['packageId', '权益码 / packageId', 'text'], ['name', '档位名称', 'text'],
                          ['price', '资费（元/月）', 'decimal'], ['bizIntfCode', '业务接口码 bizIntfCode', 'text'],
                        ] as const).map(([key, label, inputMode]) => (
                          <label key={key} className="space-y-1"><span className="text-xs text-zinc-600">{label}</span><input value={customNorm[key]} inputMode={inputMode} onChange={(event) => setCustomNorm((current) => ({ ...current, [key]: event.target.value.trim() }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                        ))}
                      </div>
                    ) : null}
                  </> : null}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-zinc-800">
                  {workflow === 'building_bricks' ? `合计 ${selectedModules.reduce((sum, item) => sum + item.fee, 0)} 元/月` : useCustomNorm ? (customNorm.name || (customNorm.id ? `自定义档位 ${customNorm.id}` : '请填写 normId')) : selectedNorm?.name || '请选择档位'}
                </span>
                <ActionButton icon={PackageSearch} busy={busy === 'selection'} disabled={workflow === 'building_bricks' ? selectedModules.length !== 2 : useCustomNorm ? !/^\d{1,20}$/.test(customNorm.id) : !selectedNorm} onClick={() => void run('selection', async () => {
                  const selectedCustomCocTier = workflow === 'coc_app' ? customCocTiers.find((item) => item.id === selectedNorm?.id) : undefined
                  const customInput = selectedCustomCocTier ? {
                    id: selectedCustomCocTier.id,
                    packageId: selectedCustomCocTier.id,
                    name: selectedCustomCocTier.name,
                    price: selectedCustomCocTier.price,
                  } : useCustomNorm ? {
                      id: customNorm.id,
                      packageId: customNorm.packageId || undefined,
                      name: customNorm.name || undefined,
                      price: customNorm.price === '' ? undefined : Number(customNorm.price),
                      bizIntfCode: customNorm.bizIntfCode || undefined,
                    } : undefined
                  setSession(await selectBenefitProduct(session.id, selectedIds, customInput))
                  setAcceptedProtocol(false)
                })}>校验选择并获取协议</ActionButton>
              </div>
              {session.product.rulesHtml ? (
                <details className="mt-4 border-t border-zinc-100 pt-4">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-800">查看产品说明与规则</summary>
                  <div className="mt-3 max-h-72 overflow-y-auto bg-zinc-50 p-4"><SafeHtml html={session.product.rulesHtml} /></div>
                </details>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {session?.product && ['selection_ready', 'order_sms_sent'].includes(session.stage) ? (
        <>
          <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
            {session.product.protocol ? (
              <>
                <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-zinc-500" /><h2 className="text-sm font-semibold">{session.product.protocol.name}</h2></div>
                <div className="mt-4 max-h-80 overflow-y-auto border border-zinc-200 bg-zinc-50 p-4"><SafeHtml html={session.product.protocol.content} /></div>
              </>
            ) : (
              <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" /><div><h2 className="text-sm font-semibold">实时校验完成</h2><p className="mt-1 text-xs text-zinc-500">该业务当前未返回需要签署的实时协议</p></div></div>
            )}
            {workflow !== 'lucky_bag' && session.product.details?.length ? <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">{session.product.details.map((item) => <div key={`${item.label}-${item.value}`} className="flex gap-2"><dt className="text-zinc-500">{item.label}</dt><dd className="font-medium text-zinc-800">{item.value}</dd></div>)}</dl> : null}
            {workflow !== 'lucky_bag' ? session.product.warnings.map((warning) => <div key={warning} className="mt-3 flex items-start gap-2 bg-amber-50 px-3 py-2 text-xs text-amber-900"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{warning}</div>) : null}
            {session.product.protocolRequired ? <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm"><input type="checkbox" checked={acceptedProtocol} onChange={(event) => setAcceptedProtocol(event.target.checked)} className="mt-0.5" /><span>{workflow === 'lucky_bag' && session.product.bagStatus?.mainOrdered ? '我已阅读协议并确认选择或替换套餐权益，费用与生效时间以协议为准' : '我已核对档位、资费、生效方式和业务受理协议'}</span></label> : null}
            {session.product.eligible === false ? <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-amber-900"><input type="checkbox" checked={forceAttempt} onChange={(event) => setForceAttempt(event.target.checked)} className="mt-0.5" /><span>资格预校验未通过，我已了解风险并仍要尝试提交</span></label> : null}
          </section>
          <section className="border-y border-red-200 bg-white px-4 py-5 sm:px-5">
            <div className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-5 w-5 text-red-700" /><div><h2 className="text-sm font-semibold">订购二次确认</h2><p className="mt-1 text-xs text-zinc-600">{session.maskedPhone} · {session.product.selectedName}</p></div></div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1 space-y-1.5"><span className="text-xs font-medium">订购验证码</span><input value={orderCode} disabled={session.stage !== 'order_sms_sent'} onChange={(event) => setOrderCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="h-10 w-full rounded-md border border-zinc-300 px-3 disabled:bg-zinc-100" /></label>
              <button type="button" disabled={Boolean(busy) || !protocolAccepted || (session.product.eligible === false && !forceAttempt) || orderCooldown > 0} onClick={() => void run('order-sms', async () => { const next = await sendBenefitOrderSms(session.id, { acceptedProtocol: protocolAccepted, forceAttempt }); setSession(next); setOrderDeadline(Date.now() + next.orderSmsCooldownSeconds * 1000) })} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm disabled:opacity-50">{busy === 'order-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{orderCooldown ? `${orderCooldown}s` : '发送订购验证码'}</button>
            </div>
            {session.stage === 'order_sms_sent' ? <div className="mt-4 flex flex-col gap-3 border-t border-red-100 pt-4 sm:flex-row sm:items-end"><label className="min-w-0 flex-1 space-y-1.5"><span className="text-xs font-medium">输入“确认订购”</span><input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 px-3" /></label><ActionButton danger icon={LockKeyhole} busy={busy === 'confirm'} disabled={orderCode.length !== 6 || confirmationText !== '确认订购'} onClick={() => void run('confirm', async () => { try { const next = await confirmBenefitOrder(session.id, { code: orderCode, acceptedProtocol: protocolAccepted, confirmationText, forceAttempt }); setSession(next.session); setResult(next.result) } catch (reason) { const failure = orderFailureResponse(reason); setResult({ success: false, accepted: false, uncertain: false, code: failure.code, message: failure.message, completedAt: new Date().toISOString(), response: failure.response }); throw reason } })}>确认订购</ActionButton></div> : null}
          </section>
        </>
      ) : null}

      {(result || session?.lastResult) ? (() => {
        const final = result || session?.lastResult
        if (!final) return null
        return <section className={cn('border-y bg-white px-4 py-6 sm:px-5', final.success ? 'border-emerald-200' : final.uncertain ? 'border-amber-300' : 'border-red-200')}>
          <div className="flex items-start gap-3">{final.success ? <CheckCircle2 className="h-6 w-6 text-emerald-700" /> : <AlertTriangle className="h-6 w-6 text-amber-700" />}<div><h2 className="font-semibold">{final.success ? '办理申请已提交' : final.uncertain ? '结果未确认' : '订购未成功'}</h2><p className="mt-1 text-sm text-zinc-700">{final.message}</p><p className="mt-2 text-xs text-zinc-500">业务码 {final.code} · {final.orderStatus || '-'}{final.orderId ? ` · 订单 ${final.orderId}` : ''}</p></div></div>
          <V2OrderResponseDetails response={final.response ?? { code: final.code, message: final.message, orderId: final.orderId, orderStatus: final.orderStatus }} />
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {workflow === 'lucky_bag' && session?.stage === 'finished' ? <ActionButton icon={PackageSearch} busy={busy === 'product'} disabled={Boolean(busy)} onClick={() => void run('product', async () => { const next = await prepareBenefitProduct(session.id); clearProgress(); setSession(next); setOrderDeadline(Date.now() + next.orderSmsCooldownSeconds * 1000) })}>刷新订购关系</ActionButton> : null}
            <ActionButton icon={RotateCcw} disabled={Boolean(busy)} onClick={() => void reset()}>重新开始</ActionButton>
          </div>
        </section>
      })() : null}
    </div>
  )
}
