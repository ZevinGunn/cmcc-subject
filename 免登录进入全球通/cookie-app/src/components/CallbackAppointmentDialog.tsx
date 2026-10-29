import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, PhoneCall, X } from 'lucide-react'
import MessageDialog, { type MessageDialogState } from './MessageDialog'
import { requestApiJson } from '@/v2/lib/api'

export type CallbackAccount = { id: string; phone?: string; phoneMasked?: string; displayPhone?: string; label?: string }
type Product = { sessionId: string; maskedPhone: string; productName: string; norms: { id: string; name: string; price: string }[] }
type Preview = { preparationId: string; maskedPhone: string; productName: string; normName: string }
type Result = { status: 'success' | 'duplicate' | 'failed' | 'unknown'; message: string; bizOrderId?: string }
const mask = (value: string) => value.replace(/(1\d{2})\d{4}(\d{4})/g, '$1****$2')

export default function CallbackAppointmentDialog(props: { account: CallbackAccount | null; publicLinkId?: string; onClose: () => void }) {
  return props.account ? <AppointmentForm key={props.account.id} {...props} account={props.account} /> : null
}

function AppointmentForm({ account, publicLinkId, onClose }: { account: CallbackAccount; publicLinkId?: string; onClose: () => void }) {
  const [code, setCode] = useState('11531947')
  const [product, setProduct] = useState<Product | null>(null)
  const [normId, setNormId] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [finished, setFinished] = useState(false)
  const [message, setMessage] = useState<MessageDialogState | null>(null)
  const lock = useRef(false)
  const section = useRef<HTMLElement>(null)
  const mounted = useRef(true)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    mounted.current = true
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    section.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      const messagePanel = document.querySelector<HTMLElement>('[aria-labelledby="message-dialog-title"]')
      if (messagePanel && e.key === 'Escape') { e.stopImmediatePropagation(); setMessage(null); section.current?.focus(); return }
      if (e.key === 'Escape') { e.stopImmediatePropagation(); closeRef.current() }
      if (e.key === 'Tab') {
        const panel = messagePanel || section.current
        const items = panel?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled)')
        if (!items?.length) return
        const first = items[0], last = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement) || document.activeElement === panel)) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && (document.activeElement === last || !panel?.contains(document.activeElement))) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => { mounted.current = false; document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey, true); previous?.focus() }
  }, [])
  useEffect(() => {
    if (message) document.querySelector<HTMLButtonElement>('[aria-labelledby="message-dialog-title"] button')?.focus()
  }, [message])
  async function run(task: () => Promise<void>) {
    if (lock.current) return
    lock.current = true; setBusy(true)
    try { await task() }
    catch (e) { if (mounted.current) setMessage({ type: 'error', title: '预约回访', message: e instanceof Error ? e.message : '请求失败，请重试' }) }
    finally { lock.current = false; if (mounted.current) setBusy(false) }
  }
  const request = <T,>(action: string, body: object) => requestApiJson<T>(`/api/callback-appointments/${encodeURIComponent(account.id)}/${action}`, 'POST', { ...body, publicLinkId })
  const control = 'h-10 min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
  return createPortal(<>
    <div className="fixed inset-0 z-[140] flex items-end justify-center p-2 sm:items-center sm:p-4">
      <button className="absolute inset-0 bg-black/40" aria-label="关闭预约回访遮罩" onClick={onClose} />
      <section ref={section} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="callback-title" className="relative flex max-h-[90dvh] w-full max-w-lg flex-col rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-xl outline-none">
        <header className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <PhoneCall className="h-4 w-4 text-blue-600" /><h2 id="callback-title" className="flex-1 text-base font-semibold">10086 预约回访</h2>
          <button className="grid h-10 w-10 place-items-center rounded-md hover:bg-zinc-100" aria-label="关闭预约回访" onClick={onClose}><X className="h-4 w-4" /></button>
        </header>
        <div className="space-y-4 overflow-y-auto p-4 text-sm">
          <div className="flex justify-between gap-3"><span className="text-zinc-500">回访号码</span><strong>{product?.maskedPhone || mask(account.displayPhone || account.phoneMasked || account.phone || account.label || '所选账号')}</strong></div>
          <div><label htmlFor="callback-product" className="mb-1.5 block font-medium">商城商品编码</label><div className="flex gap-2">
            <input id="callback-product" inputMode="numeric" value={code} disabled={busy || finished} onChange={e => { setCode(e.target.value); setProduct(null); setPreview(null); setNormId('') }} className={`${control} w-full flex-1`} />
            <button disabled={busy || finished || !/^\d{1,20}$/.test(code.trim())} className={`${control} shrink-0 hover:bg-zinc-50`} onClick={() => void run(async () => {
              setPreview(null); setProduct(null)
              const data = await request<Product>('products', { productCode: code.trim() })
              if (mounted.current) { setProduct(data); setNormId(data.norms[0]?.id || '') }
            })}>查询业务</button>
          </div></div>
          {product ? <div className="space-y-2"><p className="break-words font-medium">{product.productName}</p><label htmlFor="callback-norm" className="block text-zinc-500">咨询档位</label><select id="callback-norm" className={`${control} w-full`} disabled={busy || finished} value={normId} onChange={e => { setNormId(e.target.value); setPreview(null) }}>{product.norms.map(norm => <option key={norm.id} value={norm.id}>{norm.name}{norm.price !== '' && Number.isFinite(Number(norm.price)) ? ` · ${Number(norm.price) / 100}元` : ''}</option>)}</select></div> : null}
          {preview ? <dl className="space-y-2 border-t border-zinc-200 pt-3"><dt className="text-zinc-500">预约咨询业务</dt><dd className="break-words font-medium">{preview.productName} / {preview.normName}</dd></dl> : null}
          <p className="text-xs leading-5 text-zinc-500">提交后由客服回电沟通所选业务，不直接办理或扣费。</p>
        </div>
        <footer className="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3">
          <button onClick={onClose} className={`${control} hover:bg-zinc-50`}>关闭</button>
          <button disabled={busy || finished || !product || !normId} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50" onClick={() => void run(async () => {
            if (!product) return
            if (!preview) {
              const data = await request<Preview>('prepare', { sessionId: product.sessionId, normId })
              if (mounted.current) setPreview(data)
              return
            }
            const result = await request<Result>('confirm', { sessionId: product.sessionId, preparationId: preview.preparationId })
            if (!mounted.current) return
            setFinished(result.status !== 'failed')
            setMessage({ type: result.status === 'success' ? 'success' : result.status === 'failed' ? 'error' : 'info', title: { success: '预约成功', duplicate: '已有预约', failed: '预约失败', unknown: '结果待确认' }[result.status], message: result.message + (result.bizOrderId ? ` 工单号：${result.bizOrderId}` : '') })
          })}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{busy ? '处理中' : finished ? '已提交' : preview ? '确认预约回电' : '查询回访资格'}</button>
        </footer>
      </section>
    </div>
    {message ? <MessageDialog value={message} onClose={() => { setMessage(null); section.current?.focus() }} /> : null}
  </>, document.body)
}
