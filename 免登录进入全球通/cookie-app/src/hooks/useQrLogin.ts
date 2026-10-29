import { useCallback, useEffect, useRef, useState } from 'react'

export type QrLoginFlowState = {
  flowId: string
  status: 'pending' | 'success' | 'expired'
  message?: string
  qrImage?: string
  cookieNames: string[]
  cookieLength?: number
  expiresInSeconds?: number
}

type Options<T> = {
  active: boolean
  contextKey: string
  phone: string
  label?: string
  publicLinkId?: string
  apiFetch?: typeof fetch
  onSaved: (data: T) => void | Promise<void>
  onError: (message: string) => void
}

export function useQrLogin<T>(options: Options<T>) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const [flow, setFlow] = useState<QrLoginFlowState | null>(null)
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const flowRef = useRef<QrLoginFlowState | null>(null)
  const generation = useRef(0)
  const controller = useRef<AbortController | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const savingFlow = useRef<string | null>(null)
  const savedFlow = useRef<string | null>(null)
  const pollRef = useRef<() => Promise<void>>(async () => undefined)
  const deadline = useRef(0)

  const cancel = useCallback(() => {
    generation.current += 1
    controller.current?.abort()
    clearTimeout(timer.current)
    flowRef.current = null
    savingFlow.current = null
    savedFlow.current = null
  }, [])

  const post = useCallback(async <R,>(path: string, body: object, signal: AbortSignal): Promise<R> => {
    const current = optionsRef.current
    const request = new AbortController()
    const abort = () => request.abort()
    signal.addEventListener('abort', abort, { once: true })
    if (signal.aborted) request.abort()
    const timeout = setTimeout(abort, 20000)
    try {
      const response = await (current.apiFetch || fetch)(`/api/accounts/qr-login/${path}`, {
        method: 'POST', signal: request.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, publicLinkId: current.publicLinkId || undefined }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok || !result.data) throw new Error(result.message || `扫码登录请求失败（HTTP ${response.status}）`)
      return result.data as R
    } finally {
      clearTimeout(timeout)
      signal.removeEventListener('abort', abort)
    }
  }, [])

  const save = useCallback(async () => {
    const current = flowRef.current
    const config = optionsRef.current
    if (!config.active || current?.status !== 'success' || !/^1\d{10}$/.test(config.phone) ||
      savingFlow.current || savedFlow.current === current.flowId || !controller.current) return
    const version = generation.current
    savingFlow.current = current.flowId
    setSaving(true)
    try {
      const data = await post<T>('save', { flowId: current.flowId, phone: config.phone, label: config.label }, controller.current.signal)
      if (version !== generation.current) return
      savedFlow.current = current.flowId
      clearTimeout(timer.current)
      await config.onSaved(data)
    } catch (error) {
      if (version === generation.current) config.onError(error instanceof Error ? error.message : '保存扫码登录失败')
    } finally {
      if (version === generation.current) {
        savingFlow.current = null
        setSaving(false)
      }
    }
  }, [post])

  const start = useCallback(async () => {
    if (!optionsRef.current.active || savingFlow.current) return
    cancel()
    const version = generation.current
    const abort = new AbortController()
    controller.current = abort
    setFlow(null)
    setBusy(true)
    setSaving(false)
    try {
      const data = await post<QrLoginFlowState>('start', {}, abort.signal)
      if (version !== generation.current) return
      if (!data.flowId || !data.qrImage) throw new Error('二维码数据缺失，请重试')
      const pending: QrLoginFlowState = { ...data, status: 'pending', message: '等待扫码确认' }
      flowRef.current = pending
      setFlow(pending)
      deadline.current = Date.now() + Math.max(1, data.expiresInSeconds || 180) * 1000
      let failures = 0
      let polling = false
      const poll = async () => {
        if (polling || version !== generation.current || flowRef.current?.status !== 'pending') return
        clearTimeout(timer.current)
        if (Date.now() >= deadline.current) {
          const expired: QrLoginFlowState = { ...pending, status: 'expired', message: '二维码已过期', expiresInSeconds: 0 }
          flowRef.current = expired
          setFlow(expired)
          return
        }
        polling = true
        try {
          const update = await post<QrLoginFlowState>('poll', { flowId: data.flowId }, abort.signal)
          if (version !== generation.current) return
          if (update.flowId !== data.flowId || !['pending', 'success', 'expired'].includes(update.status)) {
            throw new Error('扫码状态响应异常')
          }
          failures = 0
          const next = { ...pending, ...update, qrImage: pending.qrImage }
          flowRef.current = next
          setFlow(next)
          if (next.status === 'success') await save()
        } catch (error) {
          if (version !== generation.current) return
          failures += 1
          if (failures === 1) optionsRef.current.onError(error instanceof Error ? error.message : '扫码状态检查失败，正在重试')
        } finally {
          polling = false
          if (version === generation.current && flowRef.current?.status === 'pending') {
            timer.current = setTimeout(() => { void poll() }, Math.min(10000, 2000 * Math.max(1, failures)))
          }
        }
      }
      pollRef.current = poll
      timer.current = setTimeout(() => { void poll() }, 2000)
    } catch (error) {
      if (version === generation.current) optionsRef.current.onError(error instanceof Error ? error.message : '生成二维码失败')
    } finally {
      if (version === generation.current) setBusy(false)
    }
  }, [cancel, post, save])

  useEffect(() => {
    setFlow(null)
    setBusy(false)
    setSaving(false)
    // Deferring one tick avoids duplicate QR sessions during StrictMode's effect replay.
    const initial = options.active ? setTimeout(() => { void start() }, 0) : undefined
    return () => { clearTimeout(initial); cancel() }
  }, [options.active, options.contextKey, start, cancel])

  useEffect(() => {
    if (flow?.status === 'success' && /^1\d{10}$/.test(options.phone)) void save()
  }, [flow?.status, options.phone, save])

  return { flow, busy, saving, start, save, poll: () => pollRef.current() }
}
