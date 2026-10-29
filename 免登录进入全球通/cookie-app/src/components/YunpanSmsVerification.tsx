import { useEffect, useId, useRef, useState } from 'react'

type CaptchaInstance = { refresh?: () => void; destroy?: () => void }
type CaptchaWindow = Window & {
  AliyunCaptchaConfig?: { region: string; prefix: string }
  initAliyunCaptcha?: (options: Record<string, unknown>) => void
}
let scriptReady: Promise<void> | undefined
function loadCaptcha() {
  if ((window as CaptchaWindow).initAliyunCaptcha) return Promise.resolve()
  if (!scriptReady) scriptReady = new Promise<void>((resolve, reject) => {
    const win = window as CaptchaWindow
    win.AliyunCaptchaConfig = { region: 'cn', prefix: '7elm7k' }
    const script = document.createElement('script')
    script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js'
    script.onload = () => resolve()
    script.onerror = () => { script.remove(); scriptReady = undefined; reject(new Error('官方滑块加载失败，请刷新后重试')) }
    document.head.appendChild(script)
  })
  return scriptReady
}

export default function YunpanSmsVerification({ phone, disabled, cooldown, onVerified }: {
  phone: string; disabled: boolean; cooldown: number; onVerified: (proof: string) => Promise<boolean>
}) {
  const id = 'yunpan-captcha-' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const callback = useRef(onVerified)
  const unavailable = useRef(disabled)
  const busy = useRef(false)
  const latestPhone = useRef(phone)
  const phoneAtOpen = useRef('')
  latestPhone.current = phone
  callback.current = onVerified
  unavailable.current = disabled
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => {
    let cancelled = false
    let instance: CaptchaInstance | undefined
    setReady(false)
    setMessage('')
    loadCaptcha().then(() => {
      if (cancelled) return
      const init = (window as CaptchaWindow).initAliyunCaptcha
      if (!init) throw new Error('官方滑块初始化失败')
      init({ SceneId: '1rmw421p', mode: 'popup', element: '#' + id, button: '#' + id + '-button',
        slideStyle: { width: 320, height: 40 }, language: 'cn',
        getInstance(value: CaptchaInstance) { instance = value; if (!cancelled) setReady(true) },
        async success(proof: unknown) {
          if (cancelled || unavailable.current || busy.current) return
          if (phoneAtOpen.current !== latestPhone.current) {
            setMessage('手机号已变更，请重新完成滑块')
            instance?.refresh?.()
            return
          }
          busy.current = true
          try {
            const ok = await callback.current(typeof proof === 'string' ? proof : JSON.stringify(proof))
            if (!cancelled) setMessage(ok ? '短信已发送' : '短信发送失败，请重新完成滑块')
          } catch { if (!cancelled) setMessage('短信发送失败，请重试') }
          finally { busy.current = false; instance?.refresh?.() }
        },
        error() { if (!cancelled) setMessage('滑块验证失败，请重试') },
      })
    }).catch((error) => { if (!cancelled) setMessage(error.message) })
    return () => { cancelled = true; instance?.destroy?.() }
  }, [id])
  return <div className="space-y-1">
    <div id={id} />
    <button id={id + '-button'} type="button" disabled={disabled || !ready}
      onClickCapture={() => { phoneAtOpen.current = latestPhone.current }}
      className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm font-medium text-blue-700 hover:bg-blue-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:text-zinc-400">
      {cooldown > 0 ? `重新获取(${cooldown}s)` : ready ? '滑块验证并发送云盘验证码' : '加载官方滑块…'}
    </button>
    {message ? <p role="status" className="text-xs text-zinc-600">{message}</p> : null}
  </div>
}
