import PhoneInput from '@/components/PhoneInput'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileJson,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  Wifi,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import { cn } from '@/lib/utils'
import V2SearchableAccountSelect from '../components/V2SearchableAccountSelect'
import V2OrderResponseDetails, { orderFailureResponse } from '../components/V2OrderResponseDetails'
import { ApiClientError } from '../lib/api'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import {
  commitBroadbandOrder,
  createBroadbandSession,
  deleteBroadbandSession,
  loadBroadbandConfigs,
  loadInstallCatalog,
  prepareBroadbandOrder,
  queryRenewalAccounts,
  refreshBroadbandCaptcha,
  saveBroadbandConfig,
  selectBroadbandProduct,
  selectRenewalAccount,
  sendBroadbandRenewalSms,
  verifyBroadbandRenewalSms,
  type BroadbandFlowType,
  type BroadbandJsonObject,
  type BroadbandOperationMode,
  type BroadbandOrderSession,
  type BroadbandProductConfig,
} from '../lib/broadbandOrderApi'

const EMPTY_FIELDS = '{}'

type ConfigDraft = {
  configKey: string
  flowType: BroadbandFlowType
  operationMode: BroadbandOperationMode
  displayName: string
  description: string
  category: string
  fieldsText: string
}

type InstallForm = {
  userName: string
  phoneNumber: string
  communityName: string
  address: string
  installDate: string
  installPeriod: string
  certNo: string
}

const EMPTY_DRAFT: ConfigDraft = {
  configKey: '',
  flowType: 'install',
  operationMode: 'install',
  displayName: '',
  description: '',
  category: '',
  fieldsText: '{\n  "query": {\n    "PACKAGECODE": "AJ"\n  },\n  "selection": {},\n  "commit": {}\n}',
}

const EMPTY_INSTALL_FORM: InstallForm = {
  userName: '',
  phoneNumber: '',
  communityName: '',
  address: '',
  installDate: '',
  installPeriod: '1',
  certNo: '',
}

function installOverrides(form: InstallForm): BroadbandJsonObject {
  const name = form.userName.trim()
  const phone = form.phoneNumber.trim()
  return {
    commit: {
      userName: name,
      USER_NAME: name,
      Person: name,
      contactPerson: name,
      phoneNumber: phone,
      CONTACT_PHONE: phone,
      Number: phone,
      contactNumber: phone,
      phoneNum: phone,
      COMMUNITY_NAME: form.communityName.trim(),
      CUST_ADDRESS: form.address.trim(),
      PRE_DATE: form.installDate,
      PRE_DATE_QUANTUM: form.installPeriod,
      ...(form.certNo.trim() ? { CERT_NO: form.certNo.trim() } : {}),
    },
  }
}

function validateInstallForm(form: InstallForm): string {
  if (!form.userName.trim()) return '请填写办理人姓名'
  if (!/^1\d{10}$/.test(form.phoneNumber.trim())) return '请填写11位联系电话'
  if (!form.communityName.trim()) return '请填写城区或小区'
  if (!form.address.trim()) return '请填写完整安装地址'
  if (!form.installDate) return '请选择预约安装日期'
  if (!['1', '2', '3', '4'].includes(form.installPeriod)) return '请选择预约安装时段'
  return ''
}

function mergeInstallOverrides(fields: BroadbandJsonObject, form: InstallForm): BroadbandJsonObject {
  const currentCommit = fields.commit && typeof fields.commit === 'object' && !Array.isArray(fields.commit)
    ? fields.commit as BroadbandJsonObject
    : {}
  const overrides = installOverrides(form).commit as BroadbandJsonObject
  return { ...fields, commit: { ...currentCommit, ...overrides } }
}

function localDateMinimum(): string {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60_000
  return new Date(today.getTime() - offset).toISOString().slice(0, 10)
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
  return { type: 'error', title: '操作失败', message: error instanceof Error ? error.message : '请求失败' }
}

function parseFields(value: string): BroadbandJsonObject {
  const parsed = JSON.parse(value || EMPTY_FIELDS) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('业务字段必须是 JSON 对象')
  return parsed as BroadbandJsonObject
}

function configDraft(config: BroadbandProductConfig): ConfigDraft {
  return {
    configKey: config.configKey,
    flowType: config.flowType,
    operationMode: config.operationMode,
    displayName: config.displayName,
    description: config.description,
    category: config.category,
    fieldsText: JSON.stringify(config.fields, null, 2),
  }
}

function productSourceLabel(product: BroadbandProductConfig): string {
  if (product.attemptedFromFlow) return '跨流程尝试'
  if (product.source === 'runtime') return '实时'
  if (product.source === 'custom') return '自定义'
  return '内置'
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
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-[transform,background-color,border-color] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        secondary
          ? 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
          : danger ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-zinc-950 text-white hover:bg-zinc-800',
      )}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

function CaptchaField({
  image,
  value,
  onChange,
  onRefresh,
  busy,
  label = '图形验证码',
}: {
  image?: string
  value: string
  onChange: (value: string) => void
  onRefresh: () => void
  busy?: boolean
  label?: string
}) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-xs font-medium text-zinc-700">{label}</span>
      <span className="grid min-h-11 grid-cols-[minmax(96px,1fr)_112px_40px] items-stretch gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 4))}
          inputMode="text"
          autoComplete="off"
          placeholder="4 位验证码"
          className="h-11 min-w-0 rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
        <span className="grid h-11 w-28 place-items-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
          {image ? <img src={image} alt="图形验证码" className="block h-full w-full object-contain" /> : <span className="text-xs text-zinc-400">未加载</span>}
        </span>
        <button type="button" title="刷新图形验证码" aria-label="刷新图形验证码" disabled={busy} onClick={onRefresh} className="grid h-11 w-10 place-items-center rounded-md border border-zinc-300 text-zinc-600 transition-transform duration-150 active:scale-[0.96] disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </button>
      </span>
    </label>
  )
}

function BroadbandProductConfigDialog({
  product,
  value,
  busy,
  onChange,
  onReset,
  onClose,
  onApply,
}: {
  product?: BroadbandProductConfig
  value: string
  busy?: boolean
  onChange: (value: string) => void
  onReset: () => void
  onClose: () => void
  onApply: () => void
}) {
  useEffect(() => {
    if (!product) return
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [busy, onClose, product])

  if (!product || typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed inset-0 z-[145] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="关闭宽带产品配置遮罩" disabled={busy} onClick={onClose} className="absolute inset-0 bg-black/45 disabled:cursor-wait" />
      <section role="dialog" aria-modal="true" aria-labelledby="broadband-product-config-title" className="relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-md border border-zinc-200 bg-white shadow-2xl sm:max-w-3xl sm:rounded-md">
        <header data-dialog-drag-handle className="flex shrink-0 items-start gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-700"><Settings2 className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="broadband-product-config-title" className="break-words text-base font-semibold text-zinc-950">{product.displayName}</h2>
            <p className="mt-1 break-all font-mono text-xs text-zinc-500">{product.configKey}</p>
          </div>
          <button type="button" disabled={busy} onClick={onClose} aria-label="关闭宽带产品配置" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-50"><X className="h-4 w-4" /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <dl className="grid gap-x-5 gap-y-3 border-b border-zinc-200 pb-4 text-xs sm:grid-cols-3">
            <div><dt className="text-zinc-500">产品来源</dt><dd className="mt-1 font-medium text-zinc-900">{productSourceLabel(product)}</dd></div>
            <div><dt className="text-zinc-500">产品分类</dt><dd className="mt-1 font-medium text-zinc-900">{product.category || '其他'}</dd></div>
            <div><dt className="text-zinc-500">提交模式</dt><dd className="mt-1 font-mono text-zinc-900">{product.operationMode}</dd></div>
          </dl>
          <label className="mt-4 block space-y-1.5">
            <span className="text-xs font-medium text-zinc-700">宽带参数与业务配置</span>
            <textarea autoFocus value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} className="min-h-[360px] w-full resize-y rounded-md border border-zinc-300 p-3 font-mono text-xs leading-5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
          </label>
        </div>
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-200 px-4 py-3 sm:px-5">
          <button type="button" disabled={busy} onClick={onReset} className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"><RotateCcw className="h-4 w-4" />恢复原始参数</button>
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={onClose} className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">取消</button>
            <button type="button" disabled={busy} onClick={onApply} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{busy ? '应用中' : '应用到本次办理'}</button>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  )
}

export default function V2BroadbandOrderPage({
  accounts = [],
  initialAccountId = '',
}: {
  accounts?: BusinessOrderAccount[]
  initialAccountId?: string
}) {
  const usableAccounts = useMemo(() => accounts.filter((item) => Boolean(item.id)), [accounts])
  const [flowType, setFlowType] = useState<BroadbandFlowType>('install')
  const [accountId, setAccountId] = useState(initialAccountId)
  const [configs, setConfigs] = useState<BroadbandProductConfig[]>([])
  const [canManage, setCanManage] = useState(false)
  const [session, setSession] = useState<BroadbandOrderSession>()
  const [entryConfigId, setEntryConfigId] = useState('builtin:install-aj')
  const [billId, setBillId] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [productsExpanded, setProductsExpanded] = useState(true)
  const [fieldsText, setFieldsText] = useState(EMPTY_FIELDS)
  const [productFieldOverrides, setProductFieldOverrides] = useState<Record<string, BroadbandJsonObject>>({})
  const [configuringProduct, setConfiguringProduct] = useState<BroadbandProductConfig>()
  const [configuringFieldsText, setConfiguringFieldsText] = useState(EMPTY_FIELDS)
  const [installForm, setInstallForm] = useState<InstallForm>(EMPTY_INSTALL_FORM)
  const [accepted, setAccepted] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState<MessageDialogState>()
  const [editorMode, setEditorMode] = useState<'' | 'new' | 'edit'>('')
  const [editingId, setEditingId] = useState('')
  const [draft, setDraft] = useState<ConfigDraft>(EMPTY_DRAFT)

  const installConfigs = useMemo(() => configs.filter((item) => item.flowType === 'install'), [configs])
  const categories = useMemo(() => ['ALL', ...Array.from(new Set((session?.products || []).map((item) => item.category || '其他')))], [session?.products])
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (session?.products || []).filter((item) => {
      if (category !== 'ALL' && item.category !== category) return false
      return !query || [item.displayName, item.description, item.configKey, item.category].some((value) => value.toLowerCase().includes(query))
    })
  }, [category, search, session?.products])

  useEffect(() => {
    void loadBroadbandConfigs().then((data) => {
      setConfigs(data.configs)
      setCanManage(data.canManage)
    }).catch((error) => setMessage(errorDialog(error)))
  }, [])

  useEffect(() => {
    if (!initialAccountId || accountId) return
    if (usableAccounts.some((item) => item.id === initialAccountId)) setAccountId(initialAccountId)
  }, [accountId, initialAccountId, usableAccounts])

  async function run(name: string, task: () => Promise<BroadbandOrderSession>, success?: (next: BroadbandOrderSession) => void, failure?: (error: unknown) => void) {
    if (busy) return
    setBusy(name)
    try {
      const next = await task()
      setSession(next)
      success?.(next)
    } catch (error) {
      failure?.(error)
      setMessage(errorDialog(error))
    } finally {
      setBusy('')
    }
  }

  async function start() {
    if (!accountId) return
    setBusy('start')
    try {
      let next = await createBroadbandSession(accountId, flowType)
      if (flowType === 'install') {
        next = await loadInstallCatalog(next.id, entryConfigId)
      } else {
        next = await refreshBroadbandCaptcha(next.id, 'lookup')
      }
      setSession(next)
      setCaptcha('')
      setFieldsText(EMPTY_FIELDS)
    } catch (error) {
      setMessage(errorDialog(error))
    } finally {
      setBusy('')
    }
  }

  async function reset() {
    if (session) await deleteBroadbandSession(session.id).catch(() => undefined)
    setSession(undefined)
    setBillId('')
    setCaptcha('')
    setSmsCode('')
    setPhoneNo('')
    setSearch('')
    setCategory('ALL')
    setFieldsText(EMPTY_FIELDS)
    setProductFieldOverrides({})
    setConfiguringProduct(undefined)
    setConfiguringFieldsText(EMPTY_FIELDS)
    setInstallForm(EMPTY_INSTALL_FORM)
    setAccepted(false)
    setConfirmationText('')
  }

  async function chooseProduct(product: BroadbandProductConfig) {
    if (!session) return
    const configuredFields = productFieldOverrides[product.id]
    await run('product', () => selectBroadbandProduct(session.id, product.id, configuredFields, Boolean(configuredFields)), (next) => {
      setFieldsText(JSON.stringify(next.selectedProduct?.fields || product.fields, null, 2))
      setAccepted(false)
      setConfirmationText('')
    })
  }

  function openProductConfig(product: BroadbandProductConfig) {
    setConfiguringProduct(product)
    setConfiguringFieldsText(JSON.stringify(productFieldOverrides[product.id] || product.fields, null, 2))
  }

  async function applyProductConfig() {
    if (!session || !configuringProduct) return
    let fields: BroadbandJsonObject
    try {
      fields = parseFields(configuringFieldsText)
    } catch (error) {
      setMessage(errorDialog(error))
      return
    }
    const product = configuringProduct
    await run('product-config', () => selectBroadbandProduct(session.id, product.id, fields, true), (next) => {
      setProductFieldOverrides((current) => ({ ...current, [product.id]: fields }))
      setFieldsText(JSON.stringify(next.selectedProduct?.fields || fields, null, 2))
      setConfiguringProduct(undefined)
      setConfiguringFieldsText(EMPTY_FIELDS)
      setAccepted(false)
      setConfirmationText('')
    })
  }

  async function refreshCaptcha(purpose: 'lookup' | 'sms' | 'commit') {
    if (!session) return
    await run(`captcha-${purpose}`, () => refreshBroadbandCaptcha(session.id, purpose), () => setCaptcha(''))
  }

  async function saveConfig() {
    setBusy('config-save')
    try {
      const fields = parseFields(draft.fieldsText)
      const config = await saveBroadbandConfig({
        configKey: draft.configKey,
        flowType: draft.flowType,
        operationMode: draft.operationMode,
        displayName: draft.displayName,
        description: draft.description,
        category: draft.category,
        fields,
      }, editorMode === 'edit' ? editingId : undefined)
      const loaded = await loadBroadbandConfigs()
      setConfigs(loaded.configs)
      setEditorMode('')
      setMessage({ type: 'success', title: '配置已保存', message: `${config.displayName} 已加入宽带产品配置` })
    } catch (error) {
      setMessage(errorDialog(error))
    } finally {
      setBusy('')
    }
  }

  const selected = session?.selectedProduct
  const needsRenewalVerification = flowType === 'renewal' && session?.stage !== 'verified' && session?.stage !== 'prepared' && session?.stage !== 'finished'
  const canPrepare = Boolean(selected) && (flowType === 'install' || session?.stage === 'verified' || session?.stage === 'prepared')

  return (
    <div className="space-y-4">
      {message ? <MessageDialog value={message} onClose={() => setMessage(undefined)} /> : null}
      <BroadbandProductConfigDialog
        product={configuringProduct}
        value={configuringFieldsText}
        busy={busy === 'product-config'}
        onChange={setConfiguringFieldsText}
        onReset={() => configuringProduct && setConfiguringFieldsText(JSON.stringify(configuringProduct.fields, null, 2))}
        onClose={() => {
          if (busy === 'product-config') return
          setConfiguringProduct(undefined)
          setConfiguringFieldsText(EMPTY_FIELDS)
        }}
        onApply={() => void applyProductConfig()}
      />

      <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">宽带业务</h2>
            <p className="mt-1 text-xs text-zinc-500">实时产品查询 · 可编辑业务字段 · 真实提交确认</p>
          </div>
          {session ? <button type="button" title="重新开始" aria-label="重新开始" disabled={Boolean(busy)} onClick={() => void reset()} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 text-zinc-600 transition-transform duration-150 active:scale-[0.96] disabled:opacity-50"><RotateCcw className="h-4 w-4" /></button> : null}
        </div>

        <div role="tablist" aria-label="宽带业务类型" className="mt-4 grid grid-cols-2 rounded-md bg-zinc-100 p-1">
          {([['install', '宽带新装'], ['renewal', '宽带续约']] as const).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={flowType === id} disabled={Boolean(session)} onClick={() => {
              setFlowType(id)
              setEditorMode('')
            }} className={cn('h-9 rounded-[4px] text-sm font-medium transition-[transform,background-color,color] duration-150 active:scale-[0.98] disabled:cursor-not-allowed', flowType === id ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
              {label}
            </button>
          ))}
        </div>

        {!session ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.6fr)_auto] lg:items-end">
            <V2SearchableAccountSelect accounts={usableAccounts} value={accountId} onChange={setAccountId} label={flowType === 'renewal' ? '已登录手机号' : '办理账号'} allowEmpty={false} />
            {flowType === 'install' ? (
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">新装入口</span><select value={entryConfigId} onChange={(event) => setEntryConfigId(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600">{installConfigs.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select></label>
            ) : <div className="hidden lg:block" />}
            <ActionButton icon={Wifi} busy={busy === 'start'} disabled={!accountId || (flowType === 'install' && !entryConfigId)} onClick={() => void start()}>{flowType === 'install' ? '查询全部宽带产品' : '进入宽带续约查询'}</ActionButton>
          </div>
        ) : (
          <dl className="mt-4 grid gap-x-5 gap-y-2 border-t border-zinc-100 pt-4 text-xs sm:grid-cols-3">
            <div><dt className="text-zinc-500">{flowType === 'renewal' ? '已登录手机号' : '办理号码'}</dt><dd className="mt-1 font-medium text-zinc-900">{session.maskedPhone}</dd></div>
            <div><dt className="text-zinc-500">业务类型</dt><dd className="mt-1 font-medium text-zinc-900">{flowType === 'install' ? '宽带新装' : '宽带续约'}</dd></div>
            <div><dt className="text-zinc-500">流程状态</dt><dd className="mt-1 font-mono text-zinc-900">{session.stage}</dd></div>
          </dl>
        )}

        {!session && canManage ? (
          <div className="mt-4 border-t border-zinc-100 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-600">自定义产品配置</span>
              <ActionButton secondary icon={Plus} onClick={() => {
                setDraft({ ...EMPTY_DRAFT, flowType, operationMode: flowType === 'install' ? 'install' : 'renewal_aj' })
                setEditingId('')
                setEditorMode('new')
              }}>新增产品配置</ActionButton>
            </div>
            {configs.some((item) => item.flowType === flowType && item.source === 'custom') ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {configs.filter((item) => item.flowType === flowType && item.source === 'custom').map((item) => (
                  <button key={item.id} type="button" onClick={() => {
                    setEditingId(item.id)
                    setDraft(configDraft(item))
                    setEditorMode('edit')
                  }} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-left text-xs text-zinc-700 hover:border-zinc-400">
                    <Pencil className="h-3.5 w-3.5 shrink-0" />
                    <span className="min-w-0 break-words">{item.displayName}</span>
                  </button>
                ))}
              </div>
            ) : <p className="mt-3 text-xs text-zinc-400">当前类型暂无自定义配置</p>}
          </div>
        ) : null}

        {editorMode ? (
          <div className="mt-5 border-t border-zinc-200 pt-5">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-zinc-950">{editorMode === 'edit' ? '编辑产品配置' : '新增产品配置'}</h3><button type="button" title="关闭配置编辑" aria-label="关闭配置编辑" onClick={() => setEditorMode('')} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 text-zinc-600"><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1"><span className="text-xs text-zinc-600">配置标识 *</span><input value={draft.configKey} onChange={(event) => setDraft((value) => ({ ...value, configKey: event.target.value }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
              <label className="space-y-1"><span className="text-xs text-zinc-600">业务名称 *</span><input value={draft.displayName} onChange={(event) => setDraft((value) => ({ ...value, displayName: event.target.value }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
              <label className="space-y-1"><span className="text-xs text-zinc-600">产品分类</span><input value={draft.category} onChange={(event) => setDraft((value) => ({ ...value, category: event.target.value }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
              <label className="space-y-1"><span className="text-xs text-zinc-600">业务类型</span><select value={draft.flowType} onChange={(event) => {
                const next = event.target.value as BroadbandFlowType
                setDraft((value) => ({ ...value, flowType: next, operationMode: next === 'install' ? 'install' : 'renewal_aj' }))
              }} className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"><option value="install">宽带新装</option><option value="renewal">宽带续约</option></select></label>
              <label className="space-y-1"><span className="text-xs text-zinc-600">提交模式</span><select value={draft.operationMode} disabled={draft.flowType === 'install'} onChange={(event) => setDraft((value) => ({ ...value, operationMode: event.target.value as BroadbandOperationMode }))} className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm disabled:bg-zinc-100"><option value="install">新装</option><option value="renewal_aj">融合类续约</option><option value="renewal_single">单宽带续约</option></select></label>
              <label className="space-y-1"><span className="text-xs text-zinc-600">业务说明</span><input value={draft.description} onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))} className="h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
              <label className="space-y-1 sm:col-span-2 lg:col-span-3"><span className="text-xs text-zinc-600">业务字段 JSON *</span><textarea value={draft.fieldsText} onChange={(event) => setDraft((value) => ({ ...value, fieldsText: event.target.value }))} spellCheck={false} className="min-h-56 w-full resize-y rounded-md border border-zinc-300 p-3 font-mono text-xs leading-5 outline-none focus:border-emerald-600" /></label>
            </div>
            <div className="mt-4 flex justify-end"><ActionButton icon={Save} busy={busy === 'config-save'} disabled={!draft.configKey || !draft.displayName} onClick={() => void saveConfig()}>保存配置</ActionButton></div>
          </div>
        ) : null}
      </section>

      {session && flowType === 'renewal' && ['created', 'captcha_ready'].includes(session.stage) ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <h2 className="text-sm font-semibold text-zinc-950">输入宽带账号查询可续约产品</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)_auto] sm:items-end">
            <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">宽带账号</span><input value={billId} onChange={(event) => setBillId(event.target.value.trim())} className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
            <CaptchaField image={session.captchaImage} value={captcha} onChange={setCaptcha} busy={busy === 'captcha-lookup'} onRefresh={() => void refreshCaptcha('lookup')} />
            <ActionButton icon={Search} busy={busy === 'accounts'} disabled={!billId || captcha.length !== 4} onClick={() => void run('accounts', () => queryRenewalAccounts(session.id, billId, captcha), () => setCaptcha(''))}>查询可续约产品</ActionButton>
          </div>
        </section>
      ) : null}

      {session && flowType === 'renewal' && session.accounts.length > 0 && !session.selectedBroadband ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <h2 className="text-sm font-semibold text-zinc-950">选择续约宽带</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {session.accounts.map((item) => <button key={item.id} type="button" disabled={Boolean(busy)} onClick={() => void run('renewal-account', () => selectRenewalAccount(session.id, item.id))} className="min-h-[76px] rounded-md border border-zinc-200 px-3 py-2 text-left transition-[transform,border-color,background-color] duration-150 hover:border-emerald-600 hover:bg-emerald-50 active:scale-[0.98] disabled:opacity-50"><strong className="block text-sm text-zinc-900">{item.itemName}</strong><span className="mt-1 block font-mono text-xs text-zinc-600">{item.maskedNumber}</span><span className="mt-1 block text-xs text-zinc-500">{item.endTime || '到期时间以上游为准'}</span></button>)}
          </div>
        </section>
      ) : null}

      {session && session.products.length > 0 ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-zinc-950">选择宽带产品</h2><p className="mt-1 text-xs text-zinc-500">共 {session.products.length} 项 · {visibleProducts.length} 项匹配</p></div>
            <button type="button" aria-expanded={productsExpanded} onClick={() => setProductsExpanded((value) => !value)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-700">{productsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}{productsExpanded ? '收起产品' : '展开产品'}</button>
          </div>
          {productsExpanded ? (
            <>
              <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px]">
                <label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索名称、编码或分类" className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-emerald-600" /></label>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600">{categories.map((item) => <option key={item} value={item}>{item === 'ALL' ? '全部分类' : item}</option>)}</select>
              </div>
              <div className="mt-3 grid max-h-[460px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => {
                  const active = selected?.id === product.id
                  const configured = Boolean(productFieldOverrides[product.id])
                  return (
                    <div key={product.id} className={cn('relative min-h-[108px] rounded-md border bg-white transition-[border-color,background-color] duration-150', active ? 'border-emerald-700 bg-emerald-50' : 'border-zinc-200 hover:border-zinc-400')}>
                      <button type="button" aria-pressed={active} disabled={Boolean(busy)} onClick={() => void chooseProduct(product)} className="block min-h-[106px] w-full rounded-md px-3 pb-11 pt-2.5 text-left transition-transform duration-150 active:scale-[0.99] disabled:opacity-50">
                        <span className="flex items-start justify-between gap-2"><strong className="min-w-0 break-words text-sm text-zinc-950">{product.displayName}</strong><span className={cn('shrink-0 text-[10px] font-medium', product.attemptedFromFlow ? 'text-amber-700' : 'text-zinc-500')}>{productSourceLabel(product)}</span></span>
                        <span className="mt-1 block break-words text-xs leading-5 text-zinc-500">{product.description || product.configKey}</span>
                      </button>
                      <button type="button" disabled={Boolean(busy)} onClick={() => openProductConfig(product)} aria-label={`配置 ${product.displayName}`} className="absolute bottom-2 right-2 inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium text-zinc-700 shadow-sm hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"><Settings2 className="h-3.5 w-3.5" />{configured ? '已配置' : '配置'}</button>
                    </div>
                  )
                })}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {session && selected ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-zinc-950">{selected.displayName}</h2><p className="mt-1 text-xs text-zinc-500">{selected.category} · {selected.operationMode} · {selected.configKey}</p></div>
            {canManage && selected.editable && !selected.attemptedFromFlow ? <ActionButton secondary icon={Pencil} onClick={() => {
              setEditingId(selected.id)
              setDraft(configDraft(selected))
              setEditorMode('edit')
            }}>编辑持久配置</ActionButton> : null}
          </div>
          <details className="mt-4 border-t border-zinc-100 pt-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-zinc-800"><FileJson className="h-4 w-4" />业务字段配置</summary>
            <textarea value={fieldsText} onChange={(event) => setFieldsText(event.target.value)} spellCheck={false} className="mt-3 min-h-64 w-full resize-y rounded-md border border-zinc-300 p-3 font-mono text-xs leading-5 outline-none focus:border-emerald-600" />
          </details>

          {flowType === 'install' ? (
            <div className="mt-5 border-t border-zinc-200 pt-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">装机信息</h3>
                <p className="mt-1 text-xs text-zinc-500">姓名、联系电话和安装地址仅用于本次向上游提交</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">办理人姓名 *</span><input value={installForm.userName} onChange={(event) => setInstallForm((value) => ({ ...value, userName: event.target.value }))} autoComplete="name" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">联系电话 *</span><PhoneInput value={installForm.phoneNumber} onValueChange={(phoneNumber) => setInstallForm((value) => ({ ...value, phoneNumber }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">城区或小区 *</span><input value={installForm.communityName} onChange={(event) => setInstallForm((value) => ({ ...value, communityName: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-medium text-zinc-700">完整安装地址 *</span><input value={installForm.address} onChange={(event) => setInstallForm((value) => ({ ...value, address: event.target.value }))} autoComplete="street-address" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">证件号码（按产品要求）</span><input value={installForm.certNo} onChange={(event) => setInstallForm((value) => ({ ...value, certNo: event.target.value.trim().slice(0, 30) }))} autoComplete="off" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">预约安装日期 *</span><input type="date" value={installForm.installDate} min={localDateMinimum()} onChange={(event) => setInstallForm((value) => ({ ...value, installDate: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">预约时段 *</span><select value={installForm.installPeriod} onChange={(event) => setInstallForm((value) => ({ ...value, installPeriod: event.target.value }))} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600"><option value="1">上午</option><option value="2">中午</option><option value="3">下午</option><option value="4">晚间</option></select></label>
              </div>
            </div>
          ) : null}

          {needsRenewalVerification ? (
            <div className="mt-5 border-t border-zinc-200 pt-5">
              <div className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" /><div><h3 className="text-sm font-semibold text-zinc-950">当前主号码验证</h3><p className="mt-1 text-xs text-zinc-500">发送短信前需完成图形验证码</p></div></div>
              {session.stage !== 'sms_sent' ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)_auto] sm:items-end">
                  <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">主号码（自动获取失败时填写）</span><PhoneInput value={phoneNo} onValueChange={setPhoneNo} placeholder="可选" className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
                  <CaptchaField image={session.captchaPurpose === 'sms' ? session.captchaImage : undefined} value={captcha} onChange={setCaptcha} busy={busy === 'captcha-sms'} onRefresh={() => void refreshCaptcha('sms')} />
                  <ActionButton icon={Send} busy={busy === 'sms-send'} disabled={captcha.length !== 4 || session.smsCooldownSeconds > 0} onClick={() => void run('sms-send', () => sendBroadbandRenewalSms(session.id, captcha, phoneNo), () => { setCaptcha(''); setSmsCode('') })}>{session.smsCooldownSeconds ? `${session.smsCooldownSeconds}s` : '发送短信'}</ActionButton>
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">短信验证码</span><input value={smsCode} onChange={(event) => setSmsCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="h-11 w-full rounded-md border border-zinc-300 px-3 text-base outline-none focus:border-emerald-600" /></label><ActionButton icon={CheckCircle2} busy={busy === 'sms-verify'} disabled={smsCode.length !== 6} onClick={() => void run('sms-verify', () => verifyBroadbandRenewalSms(session.id, smsCode, phoneNo))}>验证号码</ActionButton></div>
              )}
            </div>
          ) : null}

          {canPrepare && session.stage !== 'finished' ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-5">
              {session.balanceWarning ? <div className="flex min-w-0 items-start gap-2 text-xs text-amber-800"><AlertTriangle className="h-4 w-4 shrink-0" /><span className="break-words">上游要求确认余额扣费：{session.balanceWarning}</span></div> : <span className="text-xs text-zinc-500">准备步骤会执行实时资格校验并建立上游订单上下文</span>}
              <ActionButton icon={Settings2} busy={busy === 'prepare'} onClick={() => {
                let fields: BroadbandJsonObject
                try { fields = parseFields(fieldsText) } catch (error) { setMessage(errorDialog(error)); return }
                if (flowType === 'install') {
                  const validation = validateInstallForm(installForm)
                  if (validation) { setMessage({ type: 'error', title: '装机信息不完整', message: validation }); return }
                  fields = mergeInstallOverrides(fields, installForm)
                }
                void run('prepare', () => prepareBroadbandOrder(session.id, fields, Boolean(session.balanceWarning)), (next) => {
                  if (next.balanceWarning) return
                  void refreshCaptcha('commit')
                })
              }}>{session.balanceWarning ? '确认余额并继续' : session.stage === 'prepared' ? '重新准备' : '校验并准备提交'}</ActionButton>
            </div>
          ) : null}

          {session.stage === 'prepared' ? (
            <div className="mt-5 border-t border-red-100 pt-5">
              <div className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-5 w-5 text-red-700" /><div><h3 className="text-sm font-semibold text-zinc-950">最终提交确认</h3><p className="mt-1 text-xs text-zinc-500">此操作会向北京移动发起真实{flowType === 'install' ? '新装' : '续约'}请求</p></div></div>
              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(280px,0.8fr)_minmax(240px,0.7fr)_auto] lg:items-end">
                <CaptchaField image={session.captchaPurpose === 'commit' ? session.captchaImage : undefined} value={captcha} onChange={setCaptcha} busy={busy === 'captcha-commit'} onRefresh={() => void refreshCaptcha('commit')} label="最终图形验证码" />
                <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">输入“{flowType === 'install' ? '确认订购' : '确认续约'}”</span><input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100" /></label>
                <ActionButton danger icon={ShieldAlert} busy={busy === 'commit'} disabled={!accepted || captcha.length !== 4 || confirmationText !== (flowType === 'install' ? '确认订购' : '确认续约')} onClick={() => {
                  let fields: BroadbandJsonObject
                  try { fields = parseFields(fieldsText) } catch (error) { setMessage(errorDialog(error)); return }
                  if (flowType === 'install') {
                    const validation = validateInstallForm(installForm)
                    if (validation) { setMessage({ type: 'error', title: '装机信息不完整', message: validation }); return }
                    fields = mergeInstallOverrides(fields, installForm)
                  }
                  void run('commit', () => commitBroadbandOrder(session.id, { captcha, fields, acceptedProtocol: accepted, confirmationText }), (next) => {
                    const result = next.lastResult
                    if (!result) return
                    setMessage({ type: result.success ? 'success' : result.uncertain ? 'info' : 'error', title: result.success ? '申请已受理' : result.uncertain ? '结果待确认' : '提交未成功', message: result.message, errorCode: result.success ? undefined : result.code })
                  }, (error) => {
                    const failure = orderFailureResponse(error)
                    setSession((current) => current ? { ...current, stage: 'finished', lastResult: { success: false, uncertain: false, paymentRequired: false, code: failure.code, message: failure.message, completedAt: new Date().toISOString(), details: failure.response && typeof failure.response === 'object' && !Array.isArray(failure.response) ? failure.response as BroadbandJsonObject : { response: String(failure.response) } } } : current)
                  })
                }}>提交{flowType === 'install' ? '新装' : '续约'}</ActionButton>
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-zinc-800"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5" /><span>我已核对产品、资费、生效规则和全部业务字段，并确认发起真实提交</span></label>
            </div>
          ) : null}
        </section>
      ) : null}

      {session?.stage === 'finished' && session.lastResult ? (
        <section className={cn('border-y bg-white px-4 py-5 sm:px-5', session.lastResult.success ? 'border-emerald-200' : session.lastResult.uncertain ? 'border-amber-300' : 'border-red-200')}>
          <div className="flex items-start gap-3">{session.lastResult.success ? <CheckCircle2 className="h-6 w-6 text-emerald-700" /> : <AlertTriangle className="h-6 w-6 text-amber-700" />}<div><h2 className="text-sm font-semibold text-zinc-950">{session.lastResult.success ? '申请已受理' : session.lastResult.uncertain ? '结果待确认' : '提交未成功'}</h2><p className="mt-1 text-xs text-zinc-500">结果码 {session.lastResult.code} · {new Date(session.lastResult.completedAt).toLocaleString('zh-CN')}</p><p className="mt-2 text-sm text-zinc-700">{session.lastResult.message}</p>{session.lastResult.paymentUrl ? <a href={session.lastResult.paymentUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-9 items-center rounded-md bg-zinc-950 px-3 text-xs font-semibold text-white">继续支付</a> : null}</div></div><V2OrderResponseDetails response={session.lastResult.details ?? { code: session.lastResult.code, message: session.lastResult.message }} /><div className="mt-4 flex justify-end"><ActionButton icon={RotateCcw} onClick={() => void reset()}>重新开始</ActionButton></div>
        </section>
      ) : null}
    </div>
  )
}
