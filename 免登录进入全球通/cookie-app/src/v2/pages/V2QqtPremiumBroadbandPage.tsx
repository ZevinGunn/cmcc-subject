import PhoneInput from '@/components/PhoneInput'
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  KeyRound,
  Loader2,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Wifi,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import MessageDialog, { type MessageDialogState } from '@/components/MessageDialog'
import { cn } from '@/lib/utils'
import V2OrderResponseDetails, { orderFailureResponse } from '../components/V2OrderResponseDetails'
import V2SearchableAccountSelect from '../components/V2SearchableAccountSelect'
import { ApiClientError } from '../lib/api'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import {
  createBmccActivityOrder,
  deleteBmccActivityOrder,
  loginBmccActivityOrder,
  refreshBmccActivityCaptcha,
  sendBmccActivityLoginSms,
  type BmccActivityOrderSession,
} from '../lib/bmccActivityOrderApi'
import {
  checkQqtPremiumBroadband,
  createQqtPremiumBroadbandSession,
  deleteQqtPremiumBroadbandSession,
  submitQqtPremiumBroadband,
  type QqtPremiumBroadbandSession,
} from '../lib/qqtPremiumBroadbandOrderApi'

const DISTRICTS = [
  '东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区',
  '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区',
]

const TIME_SLOTS = [
  { value: '1', label: '上午 9:00-11:00' },
  { value: '2', label: '中午 11:00-13:00' },
  { value: '3', label: '下午 13:00-17:00' },
  { value: '4', label: '傍晚 17:00-20:00' },
]

type FormState = {
  ownerName: string
  identityNumber: string
  district: string
  address: string
  contactPhone: string
  installDate: string
  timeSlot: string
}

const EMPTY_FORM: FormState = {
  ownerName: '',
  identityNumber: '',
  district: '',
  address: '',
  contactPhone: '',
  installDate: '',
  timeSlot: '1',
}

function localDate(offsetDays = 0): string {
  const value = new Date()
  value.setDate(value.getDate() + offsetDays)
  const offset = value.getTimezoneOffset() * 60_000
  return new Date(value.getTime() - offset).toISOString().slice(0, 10)
}

function messageFor(error: unknown): MessageDialogState {
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

function inputClass(): string {
  return 'h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100 disabled:text-zinc-500'
}

function captchaSource(value?: string): string {
  const source = String(value || '').trim()
  const dataUrl = source.match(/^data:(image\/(?:png|jpe?g|gif|webp|bmp|avif))(?:;[^,]*)?;base64,([\s\S]+)$/i)
  if (dataUrl) {
    const mimeType = dataUrl[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : dataUrl[1].toLowerCase()
    const base64 = dataUrl[2].replace(/\s/g, '')
    return /^[A-Za-z0-9+/]+={0,2}$/.test(base64) ? `data:${mimeType};base64,${base64}` : ''
  }
  const base64 = source.replace(/\s/g, '')
  return /^[A-Za-z0-9+/]+={0,2}$/.test(base64) && base64.length > 100
    ? `data:image/png;base64,${base64}`
    : ''
}

export default function V2QqtPremiumBroadbandPage({
  accounts = [],
  initialAccountId = '',
}: {
  accounts?: BusinessOrderAccount[]
  initialAccountId?: string
}) {
  const usableAccounts = useMemo(() => accounts.filter((item) => Boolean(item.id)), [accounts])
  const [accountId, setAccountId] = useState(initialAccountId)
  const [loginSession, setLoginSession] = useState<BmccActivityOrderSession>()
  const [session, setSession] = useState<QqtPremiumBroadbandSession>()
  const [captcha, setCaptcha] = useState('')
  const [loginCode, setLoginCode] = useState('')
  const [loginDeadline, setLoginDeadline] = useState(0)
  const [clock, setClock] = useState(Date.now())
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [acceptedProtocol, setAcceptedProtocol] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState<MessageDialogState>()

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const loginCooldown = Math.max(0, Math.ceil((loginDeadline - clock) / 1000))
  const loginCaptcha = captchaSource(loginSession?.captchaImage)

  async function initializeBroadband(login: BmccActivityOrderSession) {
    const next = await createQqtPremiumBroadbandSession(accountId, login.id)
    setSession(next)
    setForm(EMPTY_FORM)
    setAcceptedProtocol(false)
    setConfirmationText('')
  }

  async function start() {
    if (!accountId || busy) return
    setBusy('start')
    try {
      const next = await createBmccActivityOrder({ accountId })
      setLoginSession(next)
      if (next.stage === 'logged_in') await initializeBroadband(next)
    } catch (error) {
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  async function refreshCaptcha() {
    if (!loginSession || busy) return
    setBusy('captcha')
    try {
      setLoginSession(await refreshBmccActivityCaptcha(loginSession.id))
      setCaptcha('')
    } catch (error) {
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  async function sendLoginSms() {
    if (!loginSession || !captcha || busy || loginCooldown > 0) return
    setBusy('login-sms')
    try {
      const next = await sendBmccActivityLoginSms(loginSession.id, captcha)
      setLoginSession(next)
      const current = Date.now()
      setClock(current)
      setLoginDeadline(current + next.loginSmsCooldownSeconds * 1000)
      setMessage({ type: 'success', title: '登录验证码已发送', message: `验证码已发送至 ${next.maskedPhone}` })
    } catch (error) {
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  async function finishLogin() {
    if (!loginSession || loginCode.length !== 6 || busy) return
    setBusy('login')
    try {
      const next = await loginBmccActivityOrder(loginSession.id, loginCode)
      setLoginSession(next)
      setLoginCode('')
      await initializeBroadband(next)
    } catch (error) {
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  async function retryInitialization() {
    if (!loginSession || loginSession.stage !== 'logged_in' || busy) return
    setBusy('initialize')
    try {
      await initializeBroadband(loginSession)
    } catch (error) {
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  async function runCheck() {
    if (!session || busy) return
    setBusy('check')
    try {
      setSession(await checkQqtPremiumBroadband(session.id))
    } catch (error) {
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  async function restart() {
    await Promise.all([
      session ? deleteQqtPremiumBroadbandSession(session.id).catch(() => undefined) : Promise.resolve(),
      loginSession ? deleteBmccActivityOrder(loginSession.id).catch(() => undefined) : Promise.resolve(),
    ])
    setLoginSession(undefined)
    setSession(undefined)
    setCaptcha('')
    setLoginCode('')
    setLoginDeadline(0)
    setForm(EMPTY_FORM)
    setAcceptedProtocol(false)
    setConfirmationText('')
    setMessage(undefined)
  }

  function validationMessage(): string {
    if (!session?.maskedOwnerName && !form.ownerName.trim()) return '请填写机主姓名'
    if (!form.district) return '请选择城区'
    if (form.address.trim().length < 3) return '请填写详细安装地址'
    if (!/^1\d{10}$/.test(form.contactPhone)) return '请填写11位安装联系电话'
    if (!form.installDate) return '请选择期望安装日期'
    if (!acceptedProtocol) return '请阅读并同意家庭宽带业务服务协议'
    if (confirmationText !== '确认订购') return '请输入“确认订购”'
    return ''
  }

  async function submit() {
    if (!session || busy) return
    const invalid = validationMessage()
    if (invalid) {
      setMessage({ type: 'error', title: '信息未完成', message: invalid })
      return
    }
    setBusy('submit')
    try {
      const next = await submitQqtPremiumBroadband(session.id, {
        ...form,
        acceptedProtocol,
        confirmationText,
      })
      setSession(next)
      const result = next.lastResult
      if (result) {
        setMessage({
          type: result.success ? 'success' : result.uncertain ? 'info' : 'error',
          title: result.success ? '提交接口返回成功' : result.uncertain ? '提交结果待确认' : '提交接口返回失败',
          message: result.message,
          errorCode: result.success ? undefined : result.code,
        })
      }
    } catch (error) {
      const failure = orderFailureResponse(error)
      setSession((current) => current ? {
        ...current,
        stage: 'finished',
        lastResult: {
          attempted: false,
          success: false,
          uncertain: false,
          code: failure.code,
          message: failure.message,
          completedAt: new Date().toISOString(),
          response: failure.response,
        },
      } : current)
      setMessage(messageFor(error))
    } finally {
      setBusy('')
    }
  }

  const result = session?.lastResult

  return (
    <div className="space-y-4">
      {message ? (
        <MessageDialog
          value={message}
          onClose={() => setMessage(undefined)}
          secondaryAction={result ? { label: '重新开始', onClick: () => void restart() } : undefined}
        />
      ) : null}

      <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-emerald-700 text-white"><Wifi className="h-5 w-5" /></span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-zinc-950">全球通尊享宽带</h2>
              <p className="mt-1 text-xs leading-5 text-zinc-500">两年合约 · 全球通等级期内千兆宽带 · 上门支付</p>
            </div>
          </div>
          {loginSession || session ? (
            <button type="button" title="重新开始" aria-label="重新开始" disabled={Boolean(busy)} onClick={() => void restart()} className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 text-zinc-600 transition-transform active:scale-[0.96] disabled:opacity-50"><RotateCcw className="h-4 w-4" /></button>
          ) : null}
        </div>

        {!loginSession && !session ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <V2SearchableAccountSelect accounts={usableAccounts} value={accountId} onChange={setAccountId} allowEmpty={false} />
            <button type="button" disabled={!accountId || Boolean(busy)} onClick={() => void start()} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-50">{busy === 'start' ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}登录北京移动</button>
          </div>
        ) : session ? (
          <dl className="mt-5 grid gap-x-5 gap-y-3 border-t border-zinc-200 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs text-zinc-500">办理号码</dt><dd className="mt-1 font-mono text-sm text-zinc-900">{session.maskedPhone}</dd></div>
            <div><dt className="text-xs text-zinc-500">机主姓名</dt><dd className="mt-1 text-sm text-zinc-900">{session.maskedOwnerName || '待上游核验'}</dd></div>
            <div><dt className="text-xs text-zinc-500">产品档位</dt><dd className="mt-1 text-sm text-zinc-900">{session.productName}</dd></div>
            <div><dt className="text-xs text-zinc-500">合约期</dt><dd className="mt-1 text-sm text-zinc-900">{session.contractMonths} 个月</dd></div>
          </dl>
        ) : null}
      </section>

      <div className="grid grid-cols-4 border-y border-zinc-200 bg-white text-center text-[11px] text-zinc-500">
        {['选择账号', '北京移动登录', '填写装机信息', '提交结果'].map((label, index) => {
          const activeIndex = session?.stage === 'finished' ? 3 : session ? 2 : loginSession ? 1 : 0
          return <div key={label} className={cn('border-r border-zinc-100 px-1 py-2.5 last:border-r-0', activeIndex > index ? 'font-semibold text-emerald-700' : activeIndex === index ? 'font-semibold text-zinc-950' : '')}>{label}</div>
        })}
      </div>

      {loginSession && ['captcha_ready', 'login_sms_sent'].includes(loginSession.stage) ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div><h3 className="text-sm font-semibold text-zinc-950">北京移动验证码登录</h3><p className="mt-1 text-xs text-zinc-500">{loginSession.maskedPhone}</p></div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <span className="block text-xs font-medium text-zinc-700">图形验证码</span>
              <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2 sm:grid-cols-[180px_44px]">
                <div className="grid h-14 min-w-0 place-items-center overflow-hidden border border-zinc-300 bg-zinc-50">
                  {loginCaptcha ? <img key={loginCaptcha} src={loginCaptcha} alt="北京移动图形验证码" className="h-full w-full object-contain" /> : <span className="px-3 text-xs text-zinc-400">验证码不可用</span>}
                </div>
                <button type="button" title="刷新图形验证码" aria-label="刷新图形验证码" disabled={Boolean(busy)} onClick={() => void refreshCaptcha()} className="grid h-11 w-11 place-items-center rounded-md border border-zinc-300 text-zinc-600 transition-transform active:scale-[0.96] disabled:opacity-50">
                  {busy === 'captcha' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input aria-label="图形验证码" value={captcha} onChange={(event) => setCaptcha(event.target.value.trim().slice(0, 20))} placeholder="输入图形验证码" className="h-11 w-full min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" />
                <button type="button" disabled={Boolean(busy) || !captcha || loginCooldown > 0} onClick={() => void sendLoginSms()} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium transition-transform active:scale-[0.97] disabled:opacity-50">
                  {busy === 'login-sms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{loginCooldown ? `${loginCooldown}s` : '发送登录验证码'}
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="min-w-0 space-y-1.5"><span className="text-xs font-medium text-zinc-700">登录短信验证码</span><input value={loginCode} onChange={(event) => setLoginCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="请输入 6 位验证码" className="h-11 w-full min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-600" /></label>
              <button type="button" disabled={Boolean(busy) || loginSession.stage !== 'login_sms_sent' || loginCode.length !== 6} onClick={() => void finishLogin()} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-50">
                {busy === 'login' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}{busy === 'login' ? '正在登录' : '验证并进入办理'}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {loginSession?.stage === 'logged_in' && !session ? (
        <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h3 className="text-sm font-semibold text-zinc-950">北京移动登录状态有效</h3><p className="mt-1 text-xs text-zinc-500">{loginSession.maskedPhone} · {loginSession.loginCacheStatus === 'reused' ? '缓存登录已验证' : '本次登录已缓存'}</p></div>
            <button type="button" disabled={Boolean(busy)} onClick={() => void retryInitialization()} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-50">{busy === 'initialize' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}加载宽带产品</button>
          </div>
        </section>
      ) : null}

      {session && session.stage !== 'finished' ? (
        <>
          <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="text-sm font-semibold text-zinc-950">产品与资格</h3><p className="mt-1 text-xs text-zinc-500">资格核验与订购使用内置业务编码</p></div>
              <button type="button" disabled={Boolean(busy)} onClick={() => void runCheck()} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 disabled:opacity-50">{busy === 'check' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}核验资格</button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div><span className="text-xs font-medium text-zinc-700">内置 itemCode</span><p className="mt-1.5 h-10 rounded-md bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-700">{session.itemCode}</p></div>
            </div>
            {session.initializationMessage ? <p className="mt-3 flex items-start gap-2 text-xs text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{session.initializationMessage}</p> : null}
            {session.precheck ? (
              <div className={cn('mt-4 flex items-start gap-2 border-t pt-4 text-sm', session.precheck.eligible ? 'border-emerald-100 text-emerald-800' : 'border-amber-100 text-amber-800')}>
                {session.precheck.eligible ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>{session.precheck.message}（{session.precheck.code}）</span>
              </div>
            ) : null}
          </section>

          <section className="border-y border-zinc-200 bg-white px-4 py-5 sm:px-5">
            <h3 className="text-sm font-semibold text-zinc-950">装机信息</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">机主姓名{session.maskedOwnerName ? '（实名核验时填写）' : ' *'}</span><input value={form.ownerName} onChange={(event) => setForm((current) => ({ ...current, ownerName: event.target.value.slice(0, 50) }))} autoComplete="name" placeholder={session.maskedOwnerName || '请输入机主姓名'} className={inputClass()} /></label>
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">证件号码（上游要求实名时填写）</span><input value={form.identityNumber} onChange={(event) => setForm((current) => ({ ...current, identityNumber: event.target.value.replace(/[^0-9Xx]/g, '').slice(0, 18) }))} autoComplete="off" className={inputClass()} /></label>
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">城区 *</span><select value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} className={inputClass()}><option value="">请选择</option>{DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}</select></label>
              <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-medium text-zinc-700">详细地址 *</span><input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value.slice(0, 300) }))} autoComplete="street-address" className={inputClass()} /></label>
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">安装联系电话 *</span><PhoneInput value={form.contactPhone} onValueChange={(contactPhone) => setForm((current) => ({ ...current, contactPhone }))} className={inputClass()} /></label>
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">期望安装日期 *</span><input type="date" min={localDate()} max={localDate(30)} value={form.installDate} onChange={(event) => setForm((current) => ({ ...current, installDate: event.target.value }))} className={inputClass()} /></label>
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">安装时段 *</span><select value={form.timeSlot} onChange={(event) => setForm((current) => ({ ...current, timeSlot: event.target.value }))} className={inputClass()}>{TIME_SLOTS.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}</select></label>
              <div><span className="text-xs font-medium text-zinc-700">支付方式</span><p className="mt-1.5 h-10 rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">上门支付</p></div>
            </div>
          </section>

          <section className="border-y border-red-100 bg-white px-4 py-5 sm:px-5">
            <div className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700" /><div><h3 className="text-sm font-semibold text-zinc-950">最终提交确认</h3><p className="mt-1 text-xs text-zinc-500">提交时会再次执行上游资格核验，并按运营商规则受理或拒绝</p></div></div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-end">
              <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-700">输入“确认订购”</span><input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} className={inputClass()} /></label>
              <button type="button" disabled={Boolean(busy) || confirmationText !== '确认订购' || !acceptedProtocol} onClick={() => void submit()} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-700 px-4 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:opacity-50">{busy === 'submit' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{busy === 'submit' ? '正在提交' : '提交订购'}</button>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-zinc-800"><input type="checkbox" checked={acceptedProtocol} onChange={(event) => setAcceptedProtocol(event.target.checked)} className="mt-0.5 h-4 w-4" /><span>我已阅读并同意《家庭宽带业务服务协议》，并确认产品、合约、装机和支付信息</span></label>
            <details className="mt-3 border-t border-zinc-100 pt-3 text-xs leading-6 text-zinc-600"><summary className="flex min-h-8 cursor-pointer list-none items-center gap-2 font-medium text-zinc-800"><FileCheck2 className="h-4 w-4" />业务规则摘要</summary><p className="mt-2">合约期 24 个月；维持全球通等级期间享受千兆宽带。若不再承诺全球通等级，次月起宽带月使用费按 40 元收取，带宽恢复至 300M。最终资格、资费、生效和装机规则以上游实时响应及正式协议为准。</p></details>
          </section>
        </>
      ) : null}

      {result ? (
        <section className={cn('border-y bg-white px-4 py-5 sm:px-5', result.success ? 'border-emerald-200' : result.uncertain ? 'border-amber-300' : 'border-red-200')}>
          <div className="flex items-start gap-3">
            {result.success ? <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700" /> : <AlertTriangle className="h-6 w-6 shrink-0 text-amber-700" />}
            <div className="min-w-0"><h3 className="text-sm font-semibold text-zinc-950">{result.success ? '提交接口返回成功' : result.uncertain ? '提交结果待确认' : '提交接口返回失败'}</h3><p className="mt-1 text-xs text-zinc-500">业务码 {result.code} · 已到达提交接口：{result.attempted ? '是' : '否'} · {new Date(result.completedAt).toLocaleString('zh-CN')}</p><p className="mt-2 break-words text-sm text-zinc-700">{result.message}</p></div>
          </div>
          <V2OrderResponseDetails response={result.response} title="订购接口具体响应" />
          <div className="mt-4 flex justify-end"><button type="button" onClick={() => void restart()} className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition-transform active:scale-[0.97]"><RotateCcw className="h-4 w-4" />重新开始</button></div>
        </section>
      ) : null}

      {session?.initializationResponse && !result ? (
        <details className="border-y border-zinc-200 bg-white px-4 py-3 sm:px-5"><summary className="flex min-h-8 cursor-pointer list-none items-center gap-2 text-xs font-medium text-zinc-600"><RefreshCw className="h-3.5 w-3.5" />上游初始化响应</summary><V2OrderResponseDetails response={session.initializationResponse} title="初始化接口具体响应" /></details>
      ) : null}
    </div>
  )
}
