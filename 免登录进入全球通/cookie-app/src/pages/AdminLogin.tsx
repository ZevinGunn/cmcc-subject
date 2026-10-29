import BrandLogo from '@/components/BrandLogo'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, KeyRound, Lock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_SESSION_STORAGE = 'cmcc_admin_session_hint'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const requestedNext = new URLSearchParams(window.location.search).get('next') || '/'
  const nextPath = requestedNext.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/'

  useEffect(() => {
    document.title = '管理员登录'
  }, [])

  useEffect(() => {
    const hint = window.localStorage.getItem(ADMIN_SESSION_STORAGE)
    if (hint) setUsername(hint)
  }, [])

  async function onLogin() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string }
      if (!res.ok || !data.ok) throw new Error(data.message || '登录失败')
      window.localStorage.setItem(ADMIN_SESSION_STORAGE, username.trim())
      navigate(nextPath, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="brand-page min-h-screen text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center px-3 py-10">
        <div className="space-y-4">
          <div>
            <h1 className="brand-heading text-2xl font-semibold tracking-tight"><BrandLogo />管理员登录</h1>
            <p className="mt-1 text-sm text-zinc-600">使用管理员用户名和密码进入系统。</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-700">管理员用户名</span>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                  <KeyRound className="h-4 w-4 text-zinc-500" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="admin"
                  />
                </div>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-700">密码</span>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                  <Lock className="h-4 w-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="请输入密码"
                  />
                </div>
              </label>
              <button
                type="button"
                onClick={() => void onLogin()}
                disabled={loading}
                className={cn(
                  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
                  loading
                    ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800',
                )}>
                {loading ? '登录中' : '登录'}
              </button>
              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 text-blue-600" />
              <p>请使用已配置的管理员账号登录，初始密码请联系系统维护人员获取。</p>
            </div>
            <div className="mt-3 flex items-start gap-2 text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              <p>登录后可进入邀请码管理、用户管理和批量账号操作页面。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
