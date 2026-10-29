import BrandLogo from '@/components/BrandLogo'
import PhoneInput from '@/components/PhoneInput'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileJson,
  KeyRound,
  Loader2,
  LockKeyhole,
  PackageSearch,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Settings2,
  ShieldAlert,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import { cn } from '@/lib/utils'
import V2SearchableAccountSelect from '../components/V2SearchableAccountSelect'
import V2BmccOrderParamsDialog from '../components/V2BmccOrderParamsDialog'
import V2OrderResponseDetails, { orderFailureResponse } from '../components/V2OrderResponseDetails'
import V2AiBeanContractExperience from '../components/V2AiBeanContractExperience'
import V2FlyCardExperience from '../components/V2FlyCardExperience'
import { ApiClientError } from '../lib/api'
import { BMCC_ACTIVITY_FIELDS } from '../lib/bmccActivityOrderFields'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import {
  confirmBmccActivityOrder,
  createBmccActivityConfig,
  createBmccActivityOrder,
  deleteBmccActivityOrder,
  isBmccOrderCodeReady,
  loadBmccActivityInfo,
  loadBmccActivityPresets,
  loginBmccActivityOrder,
  refreshBmccActivityCaptcha,
  restoreBmccActivityOrder,
  sanitizeBmccOrderCodeInput,
  sendBmccActivityLoginSms,
  sendBmccActivityOrderSms,
  submitBmccActivityOrder,
  updateBmccActivityConfig,
  updateBmccActivityOrderRequest,
  type BmccActivityConfig,
  type BmccActivityConfigRecord,
  type BmccActivityOrderResult,
  type BmccActivityOrderSession,
  type BmccJsonValue,
} from '../lib/bmccActivityOrderApi'

const DEFAULT_ACTIVITY: BmccActivityConfigRecord = {
  id: 'builtin:VPzD4o4vvy',
  source: 'builtin',
  editable: false,
  activityName: 'VPzD4o4vvy',
  displayName: '5GA 加速服务',
  proType: 'QQTJSFF',
  packageId: '55412',
  packageCode: 'QQTJSFF',
  productShowCode: 'G_QQTJSFF_0_0',
  pitemShowCode: 'KT',
}

const AI_BEAN_CANCEL_ACTIVITY: BmccActivityConfigRecord = {
  id: 'builtin:bounsPoints_BXY',
  source: 'builtin',
  editable: false,
  activityName: 'bounsPoints_BXY',
  displayName: 'AI豆倍享合约（到期自动取消）',
  packageName: 'AI豆倍享合约',
  packageId: '2840305334',
  packageCode: 'JFBXHY',
  productShowCode: 'G_JFBXHY',
  productShowName: '积分倍享合约',
  productSendUrl: '',
  pitemShowCode: 'BXY',
  pitemShowName: '合约',
  pitemSendUrl: '',
  activityUrl: 'https://service.bj.10086.cn/nwt/portal/bounsPoints',
}

const AI_BEAN_RENEW_ACTIVITY_ID = 'builtin:bounsPoints_XY'
const AI_BEAN_CANCEL_ACTIVITY_ID = AI_BEAN_CANCEL_ACTIVITY.id

const FLY_CARD_ACTIVITY: BmccActivityConfigRecord = {
  id: 'builtin:flyCard8_8TC',
  source: 'builtin',
  editable: false,
  activityName: 'flyCard8_8TC',
  displayName: '8元4G飞享卡',
  packageName: '8元4G飞享卡',
  packageId: '529',
  packageCode: '4GFXTC',
  productShowCode: 'fxtcsb',
  productShowName: '4G飞享套餐升级版',
  pitemShowCode: '8TC',
  pitemShowName: '套餐',
  activityUrl: 'https://service.bj.10086.cn/m/jsp/2025Mobile/8y4g/index.jsp',
}

const FLY_CARD_ACTIVITY_ID = FLY_CARD_ACTIVITY.id

const EMPTY_ACTIVITY: BmccActivityConfig = {
  activityName: '',
  displayName: '',
  proType: '',
  packageId: '',
  packageCode: '',
  productShowCode: '',
  pitemShowCode: 'KT',
}

const DETAIL_LABELS: Record<string, string> = {
  resultCode: '活动结果码',
  feeRange: '资费范围',
  planFee: '套餐费用',
  LL: '流量信息',
  voice: '语音信息',
  WY: '权益信息',
  productName: '业务名称',
  productCode: '业务编码',
  productDesc: '业务说明',
  productCrtDate: '创建时间',
  packageName: '活动名称',
  packageCode: '活动编码',
  packageId: '活动策划 ID',
  sourceMode: '信息来源',
  pitemShowName: '资源动作名称',
  pitemShowCode: '资源动作编码',
  activityUrl: '官方活动地址',
  sourceStatus: '页面来源状态',
  contractPeriod: '合约期',
  effectiveTime: '生效时间',
  aiBeanValidity: 'AI豆有效期',
  networkCommitment: '在网承诺',
  terminationRule: '提前解约规则',
  breachPenalty: '违约金规则',
  renewalPolicy: '到期规则',
  globalTelecomRate: '全球通回馈系数',
  otherCustomerRate: '其他客户回馈系数',
  planCode: '方案编号',
  monthlyFee: '月费',
  voiceAllowance: '语音资源',
  dataAllowance: '流量资源',
  outOfBundle: '套外资费',
  validity: '有效期限',
  incompatibility: '互斥规则',
  usageAvailable: '上月用量状态',
  usageMessage: '上月用量说明',
  previousMonthVoiceMinutes: '上月通话（分钟）',
  previousMonthDataMb: '上月流量（MB）',
  previousMonthDataDisplay: '上月流量显示值',
}

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

function resultDialog(result: BmccActivityOrderResult): MessageDialogState {
  return {
    type: result.success ? 'success' : result.uncertain ? 'info' : 'error',
    title: result.success ? '订购申请已受理' : result.uncertain ? '订购结果待确认' : '订购未成功',
    message: result.message,
    errorCode: result.success ? undefined : result.code || undefined,
  }
}

export function captchaSource(value?: string): string {
  const source = String(value || '').trim()
  const dataUrl = source.match(/^data:(image\/(?:png|jpe?g|gif|webp|bmp|avif))(?:;[^,]*)?;base64,([\s\S]+)$/i)
  if (dataUrl) {
    const mimeType = dataUrl[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : dataUrl[1].toLowerCase()
    const base64 = dataUrl[2].replace(/\s/g, '')
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) return `data:${mimeType};base64,${base64}`
    return ''
  }
  const base64 = source.replace(/\s/g, '')
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(base64) && base64.length > 100) {
    return `data:image/png;base64,${base64}`
  }
  return ''
}

function detailValue(value: BmccJsonValue): string {
  if (value === null) return '空'
  if (typeof value === 'boolean') return value ? '是' : '否'
  return String(value)
}

function ActionButton({
  children,
  icon: Icon,
  onClick,
  busy,
  disabled,
  danger,
  secondary,
}: {
  children: React.ReactNode
  icon: typeof Send
  onClick: () => void
  busy?: boolean
  disabled?: boolean
  danger?: boolean
  secondary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50',
        secondary
          ? 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
          : danger ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-zinc-950 text-white hover:bg-zinc-800',
      )}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

export default function V2BmccActivityOrderPage({
  accounts,
  initialAccountId = '',
  allowManualPhone,
  experience = 'activity',
  standalone = false,
  backHref = '/business-order',
  backLabel = '返回业务订购',
}: {
  accounts: BusinessOrderAccount[]
  initialAccountId?: string
  allowManualPhone: boolean
  experience?: 'activity' | 'ai_bean_contract' | 'fly_card_8'
  standalone?: boolean
  backHref?: string
  backLabel?: string
}) {
  const aiBeanExperience = experience === 'ai_bean_contract'
  const flyCardExperience = experience === 'fly_card_8'
  const fixedProductExperience = aiBeanExperience || flyCardExperience
  const initialConfig = aiBeanExperience ? AI_BEAN_CANCEL_ACTIVITY : flyCardExperience ? FLY_CARD_ACTIVITY : DEFAULT_ACTIVITY
  const [accountId, setAccountId] = useState(initialAccountId)
  const [phone, setPhone] = useState('')
  const [presets, setPresets] = useState<BmccActivityConfigRecord[]>([initialConfig])
  const [selectedConfigId, setSelectedConfigId] = useState(initialConfig.id)
  const [queriedConfigId, setQueriedConfigId] = useState('')
  const [requestConfigOverride, setRequestConfigOverride] = useState<BmccActivityConfig>()
  const [canManage, setCanManage] = useState(false)
  const [editorMode, setEditorMode] = useState<'new' | 'edit' | ''>('')
  const [draft, setDraft] = useState<BmccActivityConfig>(EMPTY_ACTIVITY)
  const [session, setSession] = useState<BmccActivityOrderSession>()
  const [captcha, setCaptcha] = useState('')
  const [loginCode, setLoginCode] = useState('')
  const [orderCode, setOrderCode] = useState('')
  const [acceptedProtocol, setAcceptedProtocol] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState<MessageDialogState | null>(null)
  const [paramsOpen, setParamsOpen] = useState(false)
  const [clock, setClock] = useState(Date.now())
  const [loginDeadline, setLoginDeadline] = useState(0)
  const [orderDeadline, setOrderDeadline] = useState(0)
  const [aiActivityLoadFailed, setAiActivityLoadFailed] = useState(false)
  const restoreAccountRef = useRef('')

  const selectedConfig = presets.find((item) => item.id === selectedConfigId) || presets[0]
  const effectiveConfig = requestConfigOverride || selectedConfig
  const primitiveDetails = useMemo(
    () => Object.entries(session?.activity?.details || {}).filter(([, value]) => value === null || ['string', 'number', 'boolean'].includes(typeof value)),
    [session?.activity?.details],
  )

  async function refreshPresets(preferredId?: string) {
    const data = await loadBmccActivityPresets()
    setPresets(data.presets.length ? data.presets : [initialConfig])
    setCanManage(data.canManage)
    const nextId = preferredId || selectedConfigId
    if (data.presets.some((item) => item.id === nextId)) setSelectedConfigId(nextId)
    else if (data.presets[0]) setSelectedConfigId(data.presets[0].id)
  }

  useEffect(() => {
    let alive = true
    void loadBmccActivityPresets()
      .then((data) => {
        if (!alive) return
        setPresets(data.presets.length ? data.presets : [initialConfig])
        setCanManage(data.canManage)
        if (!data.presets.some((item) => item.id === selectedConfigId) && data.presets[0]) {
          setSelectedConfigId(data.presets[0].id)
        }
      })
      .catch((reason) => {
        if (alive) setMessage(errorDialog(reason))
      })
    return () => {
      alive = false
    }
    // Initial server config loading is intentionally performed once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setAccountId(initialAccountId)
    if (!initialAccountId || restoreAccountRef.current === initialAccountId) return
    restoreAccountRef.current = initialAccountId
    let alive = true
    setBusy('restore')
    void restoreBmccActivityOrder(initialAccountId)
      .then((restored) => {
        if (!alive) return
        if (restored.session) setSession(restored.session)
        if (restored.status === 'expired') {
          setMessage({
            type: 'info',
            title: '登录缓存已过期',
            message: '北京移动登录缓存已过期，请重新登录。',
          })
        }
      })
      .catch((reason) => {
        if (alive) setMessage(errorDialog(reason))
      })
      .finally(() => {
        if (alive) setBusy('')
      })
    return () => {
      alive = false
    }
  }, [initialAccountId])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!fixedProductExperience || session?.stage !== 'logged_in') return
    let alive = true
    setAiActivityLoadFailed(false)
    setBusy('activity')
    void loadBmccActivityInfo(session.id, selectedConfigId)
      .then((next) => {
        if (!alive) return
        setSession(next)
        setQueriedConfigId(selectedConfigId)
        setAcceptedProtocol(false)
        setConfirmationText('')
      })
      .catch((reason) => {
        if (!alive) return
        setAiActivityLoadFailed(true)
        setMessage(errorDialog(reason))
      })
      .finally(() => {
        if (alive) setBusy('')
      })
    return () => {
      alive = false
    }
  }, [fixedProductExperience, selectedConfigId, session?.id, session?.stage])

  const loginCooldown = Math.max(0, Math.ceil((loginDeadline - clock) / 1000))
  const orderCooldown = Math.max(0, Math.ceil((orderDeadline - clock) / 1000))
  const supportsEightDigitOrderCode = session?.config?.packageCode === 'JFBXHY'
  const imageSource = captchaSource(session?.captchaImage)
  const draftReady = Boolean(
    draft.activityName && draft.displayName && (draft.proType || draft.productShowCode)
      && draft.packageId && draft.packageCode && draft.pitemShowCode,
  )
  const queriedCurrentConfig = Boolean(session?.activity && queriedConfigId === selectedConfigId)

  async function run(
    action: string,
    task: () => Promise<BmccActivityOrderSession>,
    onSuccess?: (next: BmccActivityOrderSession) => void,
    onFailure?: (reason: unknown) => void,
  ) {
    setBusy(action)
    try {
      const next = await task()
      setSession(next)
      onSuccess?.(next)
    } catch (reason) {
      onFailure?.(reason)
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  async function saveConfig() {
    if (!draftReady) return
    setBusy('config-save')
    try {
      const saved = editorMode === 'edit' && selectedConfig?.editable
        ? await updateBmccActivityConfig(selectedConfig.id, draft)
        : await createBmccActivityConfig(draft)
      await refreshPresets(saved.id)
      setEditorMode('')
      setQueriedConfigId('')
      setMessage({ type: 'success', title: '活动配置已保存', message: `${saved.displayName} 已保存到服务端，可直接选择并查询。` })
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  function openEditor(mode: 'new' | 'edit') {
    setEditorMode(mode)
    setDraft(mode === 'edit' && selectedConfig ? { ...selectedConfig } : { ...EMPTY_ACTIVITY })
  }

  async function reset() {
    const id = session?.id
    setSession(undefined)
    setCaptcha('')
    setLoginCode('')
    setOrderCode('')
    setAcceptedProtocol(false)
    setConfirmationText('')
    setQueriedConfigId('')
    setRequestConfigOverride(undefined)
    setEditorMode('')
    setParamsOpen(false)
    setLoginDeadline(0)
    setOrderDeadline(0)
    setAiActivityLoadFailed(false)
    if (id) await deleteBmccActivityOrder(id).catch(() => undefined)
  }

  async function loadFixedProduct(configId: string, preserveAcceptedProtocol = false) {
    if (!session || !['logged_in', 'activity_ready'].includes(session.stage)) return
    setBusy('activity')
    setAiActivityLoadFailed(false)
    try {
      const next = await loadBmccActivityInfo(session.id, configId)
      setSession(next)
      setSelectedConfigId(configId)
      setQueriedConfigId(configId)
      if (!preserveAcceptedProtocol) setAcceptedProtocol(false)
      setConfirmationText('')
    } catch (reason) {
      setAiActivityLoadFailed(true)
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  async function saveOrderParams(nextConfig: BmccActivityConfig, nextCode: string) {
    if (!session?.config) return
    setOrderCode(nextCode)
    if (JSON.stringify(nextConfig) === JSON.stringify(session.config)) {
      setParamsOpen(false)
      setMessage({ type: 'success', title: '验证码已更新', message: '订购验证码输入已更新，请核对后继续操作。' })
      return
    }
    setBusy('params-save')
    try {
      const next = await updateBmccActivityOrderRequest(session.id, nextConfig)
      setSession(next)
      setRequestConfigOverride(next.config)
      setOrderCode('')
      setAcceptedProtocol(false)
      setConfirmationText('')
      if (!next.activity) setQueriedConfigId('')
      setParamsOpen(false)
      setMessage({
        type: 'info',
        title: '订购参数已更新',
        message: '参数已更新，旧验证码上下文已失效，请重新核对并提交订购。',
      })
    } catch (reason) {
      setMessage(errorDialog(reason))
    } finally {
      setBusy('')
    }
  }

  function showOrderResult(next: BmccActivityOrderSession) {
    if (next.lastResult) {
      setMessage(resultDialog(next.lastResult))
      return
    }
    if (next.stage === 'order_sms_required') {
      setMessage({
        type: 'info',
        title: '需要短信确认',
        message: '活动订购参数已校验，请发送订购验证码并完成最终确认。',
      })
    }
  }

  function showOrderFailure(reason: unknown) {
    const failure = orderFailureResponse(reason)
    setSession((current) => current ? {
      ...current,
      stage: 'finished',
      lastResult: { success: false, uncertain: false, code: failure.code, message: failure.message, completedAt: new Date().toISOString(), details: failure.response && typeof failure.response === 'object' && !Array.isArray(failure.response) ? failure.response as BmccActivityOrderResult['details'] : { response: String(failure.response) } },
    } : current)
  }

  const stageIndex = !session
    ? 0
    : ['captcha_ready', 'login_sms_sent'].includes(session.stage)
      ? 1
      : ['logged_in', 'activity_ready'].includes(session.stage)
        ? 2
        : 3
  const loginFlow = !session || ['captcha_ready', 'login_sms_sent'].includes(session.stage)

  return (
    <div className={cn(
      standalone
        ? loginFlow
          ? 'brand-page min-h-screen space-y-4 px-3 py-6 sm:px-5 sm:py-10'
          : flyCardExperience ? 'min-h-screen bg-[#218cff]' : 'min-h-screen bg-[#1f1f1f]'
        : 'space-y-4',
    )}>
      {standalone ? <header className="flex items-center gap-2 border-b border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900"><BrandLogo className="h-7 w-7" />中国移动业务办理</header> : null}
      {message ? <MessageDialog value={message} onClose={() => setMessage(null)} secondaryAction={fixedProductExperience && session?.lastResult ? { label: '返回业务订购', onClick: () => { window.location.assign(backHref) } } : undefined} /> : null}
      {session?.config ? (
        <V2BmccOrderParamsDialog
          open={paramsOpen}
          config={session.config}
          code={orderCode}
          saving={busy === 'params-save'}
          onClose={() => setParamsOpen(false)}
          onSave={(nextConfig, nextCode) => void saveOrderParams(nextConfig, nextCode)}
        />
      ) : null}

      {standalone && loginFlow ? (
        <div className="mx-auto w-full max-w-[760px]">
          <Link to={backHref} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950">
            <ArrowLeft className="h-3.5 w-3.5" />{backLabel}
          </Link>
        </div>
      ) : null}

      {!standalone ? <div className="grid grid-cols-4 border-y border-zinc-200 bg-white text-center text-[11px] text-zinc-500">
        {(fixedProductExperience
          ? ['选择账号', '图形验证码登录', aiBeanExperience ? '阅读合约内容' : '阅读套餐规则', '短信确认订购']
          : ['选择账号', '图形验证码登录', '配置与查询活动', '确认订购']
        ).map((label, index) => (
          <div key={label} className={cn('border-r border-zinc-100 px-1 py-2.5 last:border-r-0', stageIndex > index ? 'font-semibold text-emerald-700' : stageIndex === index ? 'font-semibold text-zinc-950' : '')}>
            {label}
          </div>
        ))}
      </div> : null}

      {!session ? (
        <section className={cn(
          'bg-white px-4 py-5 sm:px-5',
          standalone ? 'mx-auto w-full max-w-[760px] rounded-md border border-zinc-200 shadow-sm sm:py-6' : 'border-y border-zinc-200',
        )}>
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">先登录北京移动账号</h2>
            <p className="mt-1 text-xs text-zinc-500">{aiBeanExperience ? '登录成功后将进入AI豆倍享合约原版订购页面' : flyCardExperience ? '登录成功后将进入8元4G飞享卡原版订购页面' : '登录成功后再选择活动配置、读取完整活动内容并提交订购'}</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <V2SearchableAccountSelect
              accounts={accounts}
              value={accountId}
              onChange={setAccountId}
              allowEmpty={allowManualPhone}
              emptyLabel={allowManualPhone ? '搜索账号或手动输入手机号' : '搜索已有账号'}
            />
            {allowManualPhone && !accountId ? (
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-zinc-700">中国移动手机号</span>
                <PhoneInput
                  value={phone}
                  onValueChange={setPhone}
                  placeholder="请输入 11 位手机号"
                  className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600"
                />
              </label>
            ) : null}
          </div>
          <div className="mt-5 flex justify-end">
            <ActionButton
              icon={KeyRound}
              busy={busy === 'start' || busy === 'restore'}
              disabled={Boolean(busy) || (!accountId && !(allowManualPhone && /^1\d{10}$/.test(phone)))}
              onClick={() => void run('start', () => createBmccActivityOrder({
                accountId: accountId || undefined,
                phone: phone || undefined,
              }), (next) => {
                if (next.loginCacheStatus === 'reused') {
                  setMessage({ type: 'success', title: '已复用登录缓存', message: `${next.maskedPhone} 的北京移动登录状态已在线验证。` })
                } else if (next.loginCacheStatus === 'expired') {
                  setMessage({ type: 'info', title: '登录缓存已过期', message: '请完成图形验证码和短信验证码登录。' })
                }
              })}>
              建立北京移动登录会话
            </ActionButton>
          </div>
        </section>
      ) : null}

      {session && ['captcha_ready', 'login_sms_sent'].includes(session.stage) ? (
        <section className={cn(
          'bg-white px-4 py-5 sm:px-5',
          standalone ? 'mx-auto w-full max-w-[760px] rounded-md border border-zinc-200 shadow-sm sm:py-6' : 'border-y border-zinc-200',
        )}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-zinc-950">北京移动验证码登录</h2><p className="mt-1 text-xs text-zinc-500">{session.maskedPhone}</p></div>
            <button type="button" title="重新开始" aria-label="重新开始" disabled={Boolean(busy)} onClick={() => void reset()} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <span className="block text-xs font-medium text-zinc-700">图形验证码</span>
              <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2 sm:grid-cols-[180px_44px]">
                <div className="grid h-14 min-w-0 place-items-center overflow-hidden border border-zinc-300 bg-zinc-50">
                  {imageSource ? <img key={imageSource} src={imageSource} alt="北京移动图形验证码" className="h-full w-full object-contain" /> : <span className="px-3 text-xs text-zinc-400">验证码不可用</span>}
                </div>
                <button type="button" title="刷新图形验证码" aria-label="刷新图形验证码" disabled={Boolean(busy)} onClick={() => void run('captcha', () => refreshBmccActivityCaptcha(session.id))} className="grid h-11 w-11 place-items-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50">
                  {busy === 'captcha' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input value={captcha} onChange={(event) => setCaptcha(event.target.value.trim().slice(0, 20))} placeholder="输入图形验证码" className="h-11 w-full min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" />
                <button type="button" disabled={Boolean(busy) || !captcha || loginCooldown > 0} onClick={() => void run('login-sms', () => sendBmccActivityLoginSms(session.id, captcha), (next) => {
                  const now = Date.now()
                  setClock(now)
                  setLoginDeadline(now + next.loginSmsCooldownSeconds * 1000)
                  setMessage({ type: 'success', title: '登录验证码已发送', message: `验证码已发送至 ${next.maskedPhone}` })
                })} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium disabled:opacity-50 sm:w-auto">
                  {busy === 'login-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{loginCooldown ? `${loginCooldown}s` : '发送登录验证码'}
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="min-w-0 space-y-1.5"><span className="text-xs font-medium text-zinc-700">登录短信验证码</span><input value={loginCode} onChange={(event) => setLoginCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="请输入 6 位验证码" className="h-11 w-full min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
              <ActionButton icon={LockKeyhole} busy={busy === 'login'} disabled={session.stage !== 'login_sms_sent' || loginCode.length !== 6} onClick={() => void run('login', () => loginBmccActivityOrder(session.id, loginCode), (next) => setMessage({ type: 'success', title: '登录成功并已缓存', message: `${next.maskedPhone} 已登录，后续将优先复用有效缓存。` }))}>验证并登录</ActionButton>
            </div>
          </div>
        </section>
      ) : null}

      {aiBeanExperience && session && ['logged_in', 'activity_ready', 'order_sms_required', 'finished'].includes(session.stage) ? (
        <V2AiBeanContractExperience
          session={session}
          activityLoadFailed={aiActivityLoadFailed}
          renewal={session.config?.pitemShowCode === 'XY'}
          acceptedProtocol={acceptedProtocol}
          orderCode={orderCode}
          orderCooldown={orderCooldown}
          busy={busy}
          onReloadActivity={() => void loadFixedProduct(selectedConfigId)}
          onRenewalChange={(checked) => void loadFixedProduct(checked ? AI_BEAN_RENEW_ACTIVITY_ID : AI_BEAN_CANCEL_ACTIVITY_ID, true)}
          onAcceptedProtocolChange={setAcceptedProtocol}
          onSubmit={() => void run('submit', () => submitBmccActivityOrder(session.id, {
            acceptedProtocol,
            confirmationText: '确认订购',
          }), showOrderResult, showOrderFailure)}
          onOrderCodeChange={(value) => setOrderCode(sanitizeBmccOrderCodeInput(value, true))}
          onSendOrderSms={() => void run('order-sms', () => sendBmccActivityOrderSms(session.id), (next) => {
            const now = Date.now()
            setClock(now)
            setOrderDeadline(now + next.orderSmsCooldownSeconds * 1000)
            setMessage({ type: 'success', title: '订购验证码已发送', message: `验证码已发送至 ${next.maskedPhone}` })
          })}
          onConfirmOrder={() => void run('confirm', () => confirmBmccActivityOrder(session.id, orderCode), showOrderResult, showOrderFailure)}
          onOpenParams={() => setParamsOpen(true)}
          onReset={() => void reset()}
          standalone={standalone}
        />
      ) : null}

      {flyCardExperience && session && ['logged_in', 'activity_ready', 'order_sms_required', 'finished'].includes(session.stage) ? (
        <V2FlyCardExperience
          session={session}
          activityLoadFailed={aiActivityLoadFailed}
          orderCode={orderCode}
          orderCooldown={orderCooldown}
          busy={busy}
          onReloadActivity={() => void loadFixedProduct(FLY_CARD_ACTIVITY_ID)}
          onSubmit={() => void run('submit', () => submitBmccActivityOrder(session.id, {
            acceptedProtocol: true,
            confirmationText: '确认订购',
          }), showOrderResult, showOrderFailure)}
          onOrderCodeChange={(value) => setOrderCode(sanitizeBmccOrderCodeInput(value, false))}
          onSendOrderSms={() => void run('order-sms', () => sendBmccActivityOrderSms(session.id), (next) => {
            const now = Date.now()
            setClock(now)
            setOrderDeadline(now + next.orderSmsCooldownSeconds * 1000)
            setMessage({ type: 'success', title: '订购验证码已发送', message: `验证码已发送至 ${next.maskedPhone}` })
          })}
          onConfirmOrder={() => void run('confirm', () => confirmBmccActivityOrder(session.id, orderCode), showOrderResult, showOrderFailure)}
          onOpenParams={() => setParamsOpen(true)}
          onReset={() => void reset()}
          standalone={standalone}
        />
      ) : null}

      {!fixedProductExperience && session && ['logged_in', 'activity_ready'].includes(session.stage) ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-zinc-950">配置并查询活动</h2><p className="mt-1 text-xs text-zinc-500">{session.maskedPhone} · {session.loginCacheStatus === 'reused' ? '缓存登录已验证' : '登录状态有效'}</p></div>
            <button type="button" title="重新开始" aria-label="重新开始" disabled={Boolean(busy)} onClick={() => void reset()} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"><RotateCcw className="h-4 w-4" /></button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-700">活动配置</span>
              <select
                value={selectedConfigId}
                onChange={(event) => {
                  setSelectedConfigId(event.target.value)
                  setQueriedConfigId('')
                  setRequestConfigOverride(undefined)
                  setAcceptedProtocol(false)
                  setConfirmationText('')
                  setEditorMode('')
                }}
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600">
                {presets.map((item) => <option key={item.id} value={item.id}>{item.displayName} · {item.activityName}</option>)}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {canManage ? <ActionButton secondary icon={Plus} onClick={() => openEditor('new')}>新增配置</ActionButton> : null}
              {canManage && selectedConfig?.editable ? <ActionButton secondary icon={Pencil} onClick={() => openEditor('edit')}>编辑配置</ActionButton> : null}
              <ActionButton
                icon={PackageSearch}
                busy={busy === 'activity'}
                disabled={!selectedConfigId || Boolean(editorMode)}
                onClick={() => void run('activity', () => loadBmccActivityInfo(session.id, selectedConfigId, requestConfigOverride), (next) => {
                  setQueriedConfigId(selectedConfigId)
                  setAcceptedProtocol(false)
                  setConfirmationText('')
                  setMessage({ type: 'info', title: '活动信息已加载', message: next.activity?.message || '已获取北京移动实时活动信息' })
                })}>
                {queriedCurrentConfig ? '重新查询活动' : '查询活动'}
              </ActionButton>
            </div>
          </div>

          {effectiveConfig ? (
            <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-zinc-100 pt-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-zinc-500">订购模式</dt><dd className="mt-1 break-all font-mono text-zinc-900">{effectiveConfig.proType || '固定参数直订'}</dd></div>
              <div><dt className="text-zinc-500">活动策划 ID</dt><dd className="mt-1 break-all font-mono text-zinc-900">{effectiveConfig.packageId}</dd></div>
              <div><dt className="text-zinc-500">活动编码</dt><dd className="mt-1 break-all font-mono text-zinc-900">{effectiveConfig.packageCode}</dd></div>
              <div><dt className="text-zinc-500">资源 / 动作编码</dt><dd className="mt-1 break-all font-mono text-zinc-900">{effectiveConfig.productShowCode || '查询后自动获取'} / {effectiveConfig.pitemShowCode}</dd></div>
            </dl>
          ) : null}

          {editorMode ? (
            <div className="mt-5 border-t border-zinc-200 pt-5">
              <div className="flex items-center justify-between gap-3">
                <div><h3 className="text-sm font-semibold text-zinc-950">{editorMode === 'edit' ? '编辑活动配置' : '新增活动配置'}</h3><p className="mt-1 text-xs text-zinc-500">配置保存到服务端后，对拥有业务订购权限的用户可见</p></div>
                <button type="button" title="关闭配置编辑" aria-label="关闭配置编辑" onClick={() => setEditorMode('')} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-50"><X className="h-4 w-4" /></button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BMCC_ACTIVITY_FIELDS.map((field) => (
                  <label key={field.key} className={cn('space-y-1', field.wide && 'sm:col-span-2')}>
                    <span className="text-xs text-zinc-600">{field.label}{field.required ? ' *' : ''}</span>
                    <input
                      value={String(draft[field.key] || '')}
                      onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                      className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600"
                    />
                  </label>
                ))}
                <label className="flex min-h-9 items-center gap-2 self-end text-sm text-zinc-800"><input type="checkbox" checked={draft.isQd2018 === true} onChange={(event) => setDraft((current) => ({ ...current, isQd2018: event.target.checked }))} /><span>启用 isQd2018</span></label>
              </div>
              <div className="mt-4 flex justify-end"><ActionButton icon={Save} busy={busy === 'config-save'} disabled={!draftReady} onClick={() => void saveConfig()}>保存到服务端</ActionButton></div>
            </div>
          ) : null}

          {queriedCurrentConfig && session.activity ? (
            <div className="mt-5 border-t border-zinc-200 pt-5">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{session.activity.resultCode === 'SOURCE_OFFLINE' || session.activity.resultCode === 'FIXED_CONFIG' ? '固定业务信息已加载' : '实时活动内容已返回'}</span>
                <span className="text-zinc-600">资格：{session.activity.eligible === undefined ? '以上游提交结果为准' : session.activity.eligible ? '预校验通过' : '预校验未通过'}</span>
                <span className="text-zinc-600">已订购：{session.activity.alreadyOrdered === undefined ? '未知' : session.activity.alreadyOrdered ? '是' : '否'}</span>
              </div>
              {primitiveDetails.length ? (
                <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-zinc-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {primitiveDetails.map(([key, value]) => (
                    <div key={key} className="min-w-0"><dt className="text-xs text-zinc-500">{DETAIL_LABELS[key] || key}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-zinc-900">{detailValue(value)}</dd></div>
                  ))}
                </dl>
              ) : null}
              <details className="mt-4 border-t border-zinc-100 pt-4">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-zinc-800"><FileJson className="h-4 w-4" />查看完整脱敏响应</summary>
                <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap break-all rounded-md bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">{JSON.stringify(session.activity.details, null, 2)}</pre>
              </details>
              {session.activity.eligible === false || session.activity.alreadyOrdered ? (
                <div className="mt-4 flex items-start gap-2 border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>实时预校验存在风险；提交按钮仍开放，最终是否受理由北京移动订购接口决定。</span></div>
              ) : null}
              <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-zinc-800"><input type="checkbox" checked={acceptedProtocol} onChange={(event) => setAcceptedProtocol(event.target.checked)} className="mt-0.5" /><span>我已核对完整活动内容、资费与生效信息，并确认提交真实订购</span></label>
              <div className="mt-4 flex flex-col gap-3 border-t border-red-100 pt-4 sm:flex-row sm:items-end">
                <label className="min-w-0 flex-1 space-y-1.5"><span className="text-xs font-medium text-zinc-700">输入“确认订购”</span><input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-red-600" /></label>
                <ActionButton danger icon={ShieldAlert} busy={busy === 'submit'} disabled={!acceptedProtocol || confirmationText !== '确认订购'} onClick={() => void run('submit', () => submitBmccActivityOrder(session.id, { acceptedProtocol, confirmationText }), showOrderResult, showOrderFailure)}>提交订购</ActionButton>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {!fixedProductExperience && session?.stage === 'order_sms_required' ? (
        <section className="border-y border-red-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-5 w-5 text-red-700" /><div><h2 className="text-sm font-semibold text-zinc-950">订购短信确认</h2><p className="mt-1 text-xs text-zinc-500">{session.maskedPhone} · {session.orderSms?.productItemName || session.config?.displayName || '活动订购'}</p></div></div>
            <ActionButton secondary icon={Settings2} disabled={Boolean(busy)} onClick={() => setParamsOpen(true)}>查看验证码与参数</ActionButton>
          </div>
          {session.orderSms?.productItemDesc || session.orderSms?.busiTime ? (
            <dl className="mt-4 grid gap-3 border-y border-zinc-100 py-3 text-xs sm:grid-cols-2">
              {session.orderSms.productItemDesc ? <div><dt className="text-zinc-500">业务说明</dt><dd className="mt-1 whitespace-pre-wrap text-zinc-800">{session.orderSms.productItemDesc}</dd></div> : null}
              {session.orderSms.busiTime ? <div><dt className="text-zinc-500">生效信息</dt><dd className="mt-1 whitespace-pre-wrap text-zinc-800">{session.orderSms.busiTime}</dd></div> : null}
            </dl>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 space-y-1.5"><span className="text-xs font-medium text-zinc-700">{supportsEightDigitOrderCode ? '订购验证密码（6 或 8 位）' : '订购验证码（6 位）'}</span><input value={orderCode} onChange={(event) => setOrderCode(sanitizeBmccOrderCodeInput(event.target.value, supportsEightDigitOrderCode))} inputMode="numeric" autoComplete="one-time-code" placeholder={supportsEightDigitOrderCode ? '8 位原码或 6 位截取码' : '请输入 6 位验证码'} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-red-600" />{supportsEightDigitOrderCode ? <span className="block text-xs text-zinc-500">8 位原码将自动取前 5 位和最后 1 位提交</span> : null}</label>
            <button type="button" disabled={Boolean(busy) || orderCooldown > 0} onClick={() => void run('order-sms', () => sendBmccActivityOrderSms(session.id), (next) => {
              const now = Date.now()
              setClock(now)
              setOrderDeadline(now + next.orderSmsCooldownSeconds * 1000)
              setMessage({ type: 'success', title: '订购验证码已发送', message: `验证码已发送至 ${next.maskedPhone}` })
            })} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium disabled:opacity-50">
              {busy === 'order-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{orderCooldown ? `${orderCooldown}s` : '发送订购验证码'}
            </button>
            <ActionButton danger icon={LockKeyhole} busy={busy === 'confirm'} disabled={!isBmccOrderCodeReady(orderCode, supportsEightDigitOrderCode)} onClick={() => void run('confirm', () => confirmBmccActivityOrder(session.id, orderCode), showOrderResult, showOrderFailure)}>确认订购</ActionButton>
          </div>
        </section>
      ) : null}

      {!fixedProductExperience && session?.stage === 'finished' && session.lastResult ? (
        <section className={cn('border-y bg-white px-4 py-5 sm:px-5', session.lastResult.success ? 'border-emerald-200' : session.lastResult.uncertain ? 'border-amber-300' : 'border-red-200')}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {session.lastResult.success ? <CheckCircle2 className="h-6 w-6 text-emerald-700" /> : <AlertTriangle className="h-6 w-6 text-amber-700" />}
              <div><h2 className="text-sm font-semibold text-zinc-950">{session.lastResult.success ? '订购申请已受理' : session.lastResult.uncertain ? '订购结果待确认' : '订购未成功'}</h2><p className="mt-1 text-sm text-zinc-700">{session.lastResult.message}</p><p className="mt-1 text-xs text-zinc-500">{session.maskedPhone} · 业务码 {session.lastResult.code} · {new Date(session.lastResult.completedAt).toLocaleString('zh-CN')}</p></div>
            </div>
            <ActionButton icon={RotateCcw} onClick={() => void reset()}>重新开始</ActionButton>
          </div>
          <V2OrderResponseDetails response={session.lastResult.details ?? { code: session.lastResult.code, message: session.lastResult.message }} />
        </section>
      ) : null}
    </div>
  )
}
