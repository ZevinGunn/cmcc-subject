import PhoneInput from './PhoneInput'
import YunpanSmsVerification from './YunpanSmsVerification'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, KeyRound, Loader2, Phone, QrCode, RefreshCcw, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQrLogin } from '@/hooks/useQrLogin'

export type LoginMethod = 'cmcc_sms' | 'cmcc_qr' | 'manual_cookie' | 'yunpan'

export type LoginAccountSummary = {
  id?: string
  phone?: string
  label?: string
  phoneMasked?: string
  lastLoginMethod?: LoginMethod | 'yunpan'
}

type ApiOk<T> = { ok: true; data: T; message?: string; requestId?: string }
type ApiErr = {
  ok: false
  message: string
  errorCode?: string
  requestId?: string
  phase?: string
  debug?: unknown
}
type ApiResp<T> = ApiOk<T> | ApiErr

type Props = {
  open: boolean
  title?: string
  account?: LoginAccountSummary
  publicLinkId?: string
  defaultMethod?: LoginMethod
  apiFetch?: typeof fetch
  onClose: () => void
  onSuccess: (args: {
    accountId: string
    account?: LoginAccountSummary
    cookie?: string
    method: LoginMethod
    warning?: string
  }) => void | Promise<void>
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function methodFromAccount(account?: LoginAccountSummary): LoginMethod {
  if (account?.lastLoginMethod === 'yunpan') return 'yunpan'
  if (account?.lastLoginMethod === 'cmcc_qr') return 'cmcc_qr'
  if (account?.lastLoginMethod === 'manual_cookie') return 'manual_cookie'
  return 'cmcc_sms'
}

async function readJsonResponse<T>(res: Response): Promise<ApiResp<T>> {
  const text = await res.text()
  if (!text.trim()) {
    return {
      ok: false,
      message: `接口返回为空（HTTP ${res.status}）`,
      errorCode: 'EMPTY_RESPONSE',
    }
  }
  try {
    const json = JSON.parse(text) as ApiResp<T>
    if (!json.ok) console.warn('[account-login-api]', json)
    return json
  } catch {
    const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 500)
    console.warn('[account-login-api-invalid-json]', {
      status: res.status,
      statusText: res.statusText,
      bodySnippet: snippet,
    })
    return {
      ok: false,
      message: `接口返回格式异常（HTTP ${res.status}）`,
      errorCode: 'INVALID_JSON',
    }
  }
}

export default function AccountLoginDialog({
  open,
  title,
  account,
  publicLinkId,
  defaultMethod,
  apiFetch = fetch,
  onClose,
  onSuccess,
}: Props) {
  const [method, setMethod] = useState<LoginMethod>(defaultMethod || methodFromAccount(account))
  const [phone, setPhone] = useState(account?.phone || '')
  const [label, setLabel] = useState(account?.label || '')
  const [code, setCode] = useState('')
  const [cookie, setCookie] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setMethod(defaultMethod || methodFromAccount({ lastLoginMethod: account?.lastLoginMethod }))
    setPhone(account?.phone || '')
    setLabel(account?.label || '')
    setCode('')
    setCookie('')
    setCooldown(0)
    setMessage(null)
    setError(null)
  }, [open, account?.id, account?.phone, account?.label, account?.lastLoginMethod, defaultMethod])

  useEffect(() => {
    if (!open || cooldown <= 0) return undefined
    const timer = window.setInterval(() => {
      setCooldown((v) => Math.max(0, v - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [open, cooldown])

  const normalizedPhone = useMemo(() => onlyDigits(phone), [phone])
  const normalizedCode = useMemo(() => onlyDigits(code).slice(0, 6), [code])
  const phoneValid = /^1\d{10}$/.test(normalizedPhone)
  const { flow: qrFlow, busy: qrBusy, saving: qrSaving, start: startQrLogin, save: saveQrLogin, poll: pollQrLogin } = useQrLogin<{
    account: LoginAccountSummary & { id: string }; cookie: string
  }>({
    active: open && method === 'cmcc_qr',
    contextKey: `${account?.id || ''}:${publicLinkId || ''}`,
    phone: normalizedPhone,
    label: label.trim() || undefined,
    publicLinkId,
    apiFetch,
    onError: setError,
    onSaved: async (data) => {
      await onSuccess({ accountId: data.account.id, account: data.account, cookie: data.cookie, method: 'cmcc_qr' })
      onClose()
    },
  })
  const codeNeeded = method === 'cmcc_sms' || method === 'yunpan'
  const canSend = phoneValid && codeNeeded && cooldown === 0 && !sending && !loggingIn
  const canLogin = phoneValid && normalizedCode.length === 6 && !loggingIn && codeNeeded
  const canStartQr = method === 'cmcc_qr' && !qrBusy && !qrSaving
  const canSaveQr = phoneValid && method === 'cmcc_qr' && qrFlow?.status === 'success' && !qrSaving
  const canImportCookie =
    method === 'manual_cookie' &&
    Boolean(account?.id || phoneValid) &&
    Boolean(cookie.trim()) &&
    !loggingIn

  async function postJson<T>(url: string, body: unknown): Promise<ApiResp<T>> {
    const res = await apiFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return readJsonResponse<T>(res)
  }

  async function ensureAccountId(): Promise<string> {
    if (account?.id) return account.id
    const r = await postJson<{ account: { id: string } }>('/api/accounts', {
      phone: normalizedPhone,
      label: label.trim() || undefined,
      publicLinkId: publicLinkId || undefined,
    })
    if (!r.ok) throw new Error(r.message || '创建账号失败')
    return r.data.account.id
  }

  async function sendSms(proof?: string): Promise<boolean> {
    setError(null)
    setMessage(null)
    setSending(true)
    try {
      const r = await postJson<{ cooldownSeconds: number }>(
        method === 'yunpan' ? '/api/accounts/yunpan/sms/send' : `/api/accounts/${await ensureAccountId()}/sms/send`,
        {
          phone: normalizedPhone,
          ...(method === 'yunpan' ? { puzzleVerifyCode: proof } : {}),
          publicLinkId: publicLinkId || undefined,
        },
      )
      if (!r.ok) {
        setError(r.message || '发送验证码失败')
        return false
      }
      setMessage('验证码已发送')
      setCooldown(Math.max(1, Math.min(120, r.data.cooldownSeconds || 60)))
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : '发送验证码失败')
      return false
    } finally {
      setSending(false)
    }
  }

  async function loginByCode() {
    setError(null)
    setMessage(null)
    setLoggingIn(true)
    try {
      const id = method === 'yunpan' ? account?.id : await ensureAccountId()
      const r = await postJson<{ cookie?: string; account?: LoginAccountSummary; warning?: string }>(
        method === 'yunpan' ? '/api/accounts/yunpan/login' : `/api/accounts/${id}/login`, {
        code: normalizedCode,
        phone: normalizedPhone,
        label: label.trim() || undefined,
        publicLinkId: publicLinkId || undefined,
      })
      if (!r.ok) {
        setError(r.message || '登录失败')
        return
      }
      await onSuccess({ accountId: r.data.account?.id || id!, account: r.data.account, cookie: r.data.cookie, method, warning: r.data.warning })
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoggingIn(false)
    }
  }

  async function importCookie() {
    setError(null)
    setMessage(null)
    setLoggingIn(true)
    try {
      const id = await ensureAccountId()
      const r = await postJson<{ cookie: string }>(`/api/accounts/${id}/cookie`, {
        cookie: cookie.trim(),
        publicLinkId: publicLinkId || undefined,
      })
      if (!r.ok) {
        setError(r.message || '导入 CK 失败')
        return
      }
      await onSuccess({ accountId: id, cookie: r.data.cookie, method: 'manual_cookie' })
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '导入 CK 失败')
    } finally {
      setLoggingIn(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4" onClick={onClose}>
      <div
        className="max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">{title || (method === 'yunpan' ? '云盘登录' : '登录获取 10086 CK')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
            关闭
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-zinc-100 p-1 text-xs font-medium">
            {[
              { key: 'cmcc_sms' as const, label: '验证码登录' },
              { key: 'cmcc_qr' as const, label: 'App扫码登录' },
              { key: 'yunpan' as const, label: '云盘登录' },
              { key: 'manual_cookie' as const, label: '导入 CK' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                disabled={sending || loggingIn}
                onClick={() => { setMethod(item.key); setCode(''); setError(null); setMessage(null) }}
                className={cn(
                  'flex-1 whitespace-nowrap rounded-md px-2 py-2 transition active:scale-[0.97]',
                  method === item.key ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500',
                )}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-xs leading-5 text-zinc-500">同一号码可以同时保存云盘会话和 10086 CK。云盘置换失败时，切换到“验证码登录”即可单独补登 10086。</p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">手机号</label>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <Phone className="h-4 w-4 text-zinc-500" />
              <PhoneInput
                value={phone}
                disabled={qrSaving || sending || loggingIn}
                onValueChange={setPhone}
                placeholder="请输入 11 位手机号"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <p className={cn('text-xs', phone.length === 0 || phoneValid ? 'text-zinc-500' : 'text-red-600')}>
              新增账号需填写手机号，成功后会绑定到账号。
            </p>
          </div>

          {!account?.id ? (
            <input
              value={label}
              disabled={qrSaving}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="备注(可选)"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          ) : null}

          {method === 'cmcc_qr' ? (
            <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-zinc-900">中国移动 App 扫码登录</div>
                <button
                  type="button"
                  onClick={startQrLogin}
                  disabled={!canStartQr}
                  className={cn(
                    'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition',
                    canStartQr ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                  )}>
                  {qrBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                  {qrBusy ? '正在生成' : '刷新二维码'}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[176px_1fr]">
                <div className="flex aspect-square h-44 w-44 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2">
                  {qrFlow?.qrImage ? (
                    <img src={qrFlow.qrImage} alt="中国移动 App 扫码登录二维码" className="h-full w-full object-contain" />
                  ) : (
                    <QrCode className="h-16 w-16 text-zinc-300" />
                  )}
                </div>
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="rounded-lg bg-white p-3">
                    <div role="status" className="font-medium text-zinc-900">{qrSaving ? '正在完成登录' : qrFlow?.status === 'success' && !phoneValid ? '扫码成功，请填写手机号' : qrFlow?.message || '正在生成二维码'}</div>
                    {qrFlow?.expiresInSeconds !== undefined ? <div className="mt-1">剩余约 {qrFlow.expiresInSeconds}s</div> : null}
                    {qrFlow?.cookieLength ? <div className="mt-1">Cookie 长度 {qrFlow.cookieLength}</div> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={pollQrLogin}
                      disabled={qrFlow?.status !== 'pending' || qrBusy || qrSaving}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      检查状态
                    </button>
                    <button
                      type="button"
                      onClick={saveQrLogin}
                      disabled={!canSaveQr}
                      className={cn(
                        'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition',
                        canSaveQr ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                      )}>
                      {qrSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      保存 CK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : method === 'manual_cookie' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-700">Cookie / CK</label>
                <textarea
                  value={cookie}
                  onChange={(event) => setCookie(event.target.value)}
                  rows={5}
                  spellCheck={false}
                  placeholder="粘贴完整 CK"
                  className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <button
                type="button"
                onClick={importCookie}
                disabled={!canImportCookie}
                className={cn(
                  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition active:scale-[0.97]',
                  canImportCookie
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                导入并保存 CK
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-700">
                  {method === 'yunpan' ? '移动云盘短信验证码' : '中国移动短信验证码'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                    <KeyRound className="h-4 w-4 text-zinc-500" />
                    <input
                      value={code}
                      onChange={(e) => setCode(onlyDigits(e.target.value).slice(0, 6))}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="请输入 6 位验证码"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  {method !== 'yunpan' ? (
                  <button
                    type="button"
                    onClick={() => void sendSms()}
                    disabled={!canSend}
                    className={cn(
                      'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition',
                      canSend ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                    )}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {cooldown > 0 ? `重新获取(${cooldown}s)` : '获取验证码'}
                  </button>
                  ) : null}
                </div>
              </div>

              {method === 'yunpan' ? <YunpanSmsVerification phone={normalizedPhone} disabled={!canSend}
                cooldown={cooldown} onVerified={(proof) => sendSms(proof)} /> : null}
              <button
                type="button"
                onClick={loginByCode}
                disabled={!canLogin}
                className={cn(
                  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                  canLogin ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'cursor-not-allowed bg-zinc-100 text-zinc-400',
                )}>
                {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {method === 'yunpan' ? '登录云盘并置换全球通 Token' : '确认登录 / 获取 CK'}
              </button>
            </>
          )}

          {message ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">{message}</div> : null}
          {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</div> : null}
        </div>
      </div>
    </div>
  )
}
