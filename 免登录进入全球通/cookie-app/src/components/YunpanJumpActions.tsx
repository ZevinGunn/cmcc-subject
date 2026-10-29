import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Cloud, ExternalLink, Loader2, RefreshCcw } from 'lucide-react'
import SsoNavigationDialog from './SsoNavigationDialog'

export default function YunpanJumpActions({ accountId, publicLinkId, apiFetch = fetch, disabled = false,
  includeGlobal = false, canRefreshGlobal = true, onUpdated }: {
  accountId: string; publicLinkId?: string; apiFetch?: typeof fetch; disabled?: boolean;
  includeGlobal?: boolean; canRefreshGlobal?: boolean; onUpdated?: () => unknown | Promise<unknown>
}) {
  const [busy, setBusy] = useState('')
  const busyRef = useRef(false)
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState<{ url: string; destination: string; at: number } | null>(null)
  useEffect(() => { setPending(null); setMessage('') }, [accountId])
  useEffect(() => {
    if (!pending) return
    const timer = window.setTimeout(() => { setPending(null); setMessage('链接已放置较久，请重新生成') }, 120000)
    return () => window.clearTimeout(timer)
  }, [pending])
  async function generate(target: 'global' | 'cloudphone' | 'capp' | 'refresh' | 'cmcc' | 'cmcc-link') {
    if (disabled || busyRef.current) return
    busyRef.current = true
    setBusy(target); setMessage(''); setPending(null)
    try {
      const suffix = target === 'global' ? 'qqt/sso-link' : target === 'refresh' ? 'qqt/token'
        : target === 'cmcc' ? 'qqt/10086' : target === 'cmcc-link' ? 'qqt/10086-link' : 'yunpan/business-link'
      const query = publicLinkId ? '?publicLinkId=' + encodeURIComponent(publicLinkId) : ''
      const response = await apiFetch(`/api/accounts/${encodeURIComponent(accountId)}/${suffix}${query}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target, force: target === 'refresh' }) })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || '操作失败，请稍后重试')
      if (target === 'refresh' || target === 'cmcc') { setMessage(target === 'cmcc' ? '10086 CK 已置换，身份及查询验证通过' : '全球通 Token 已更新'); await onUpdated?.(); return }
      const url = new URL(data.data?.ssoUrl)
      const host = { global: 'qqt.cmicrwx.cn', cloudphone: 'cloud.139.com', capp: 'capp.139.com', 'cmcc-link': 'wx.10086.cn' }[target]
      if (url.protocol !== 'https:' || url.hostname !== host || url.port || url.username || url.password) throw new Error('跳转地址无效')
      setPending({ url: url.toString(), destination: { global: '全球通专区', cloudphone: '云手机', capp: '云应用', 'cmcc-link': '10086' }[target], at: Date.now() })
    } catch (error) { setMessage(error instanceof Error ? error.message : '操作失败，请稍后重试') }
    finally { setBusy(''); busyRef.current = false }
  }
  async function copy() {
    if (!pending) return
    try { await navigator.clipboard.writeText(pending.url); setPending(null); setMessage('链接已复制，请尽快使用') }
    catch { setMessage('复制失败，请检查剪贴板权限') }
  }
  return <div className="min-w-0 space-y-1 text-xs">
    <div className="flex flex-wrap gap-1.5">
      {([
        ...(includeGlobal ? [{ target: 'global' as const, label: '全球通专区' }] : []),
        ...(canRefreshGlobal ? [{ target: 'refresh' as const, label: '置换全球通 Token' }] : []),
        { target: 'cmcc' as const, label: '置换 10086 CK' },
        { target: 'cmcc-link' as const, label: '跳转 10086' },
        { target: 'cloudphone' as const, label: '跳转云手机' },
        { target: 'capp' as const, label: '跳转云应用' },
      ]).map(({ target, label }) => <button key={target} type="button" disabled={disabled || !!busy}
        onClick={() => void generate(target)}
        className="inline-flex min-h-8 items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 text-zinc-700 hover:bg-zinc-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:text-zinc-400">
        {busy === target ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : target === 'refresh' ? <RefreshCcw className="h-3.5 w-3.5" /> : target === 'global' ? <ExternalLink className="h-3.5 w-3.5" /> : <Cloud className="h-3.5 w-3.5" />}
        {busy === target ? '处理中…' : label}
      </button>)}
    </div>
    {message ? <p role="status" className="break-words text-zinc-600">{message}</p> : null}
    {pending ? createPortal(<SsoNavigationDialog url={pending.url} destination={pending.destination}
      onCopy={() => void copy()} onOpen={() => { window.open(pending.url, '_blank', 'noopener,noreferrer'); setPending(null) }} />, document.body) : null}
  </div>
}
