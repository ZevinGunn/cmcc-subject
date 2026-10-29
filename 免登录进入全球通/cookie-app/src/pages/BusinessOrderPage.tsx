import { AlertTriangle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import V2UnifiedBusinessOrderPage from '@/v2/pages/V2UnifiedBusinessOrderPage'
import V2AiBeanContractOrderPage from '@/v2/pages/V2AiBeanContractOrderPage'
import V2FlyCardOrderPage from '@/v2/pages/V2FlyCardOrderPage'
import {
  loadBusinessOrderAccounts,
  scopeBusinessOrderAccounts,
  type BusinessOrderAccount,
} from '@/v2/lib/businessOrderApi'
import { ApiClientError } from '@/v2/lib/api'

function errorText(error: unknown): string {
  if (error instanceof ApiClientError) return error.message
  return error instanceof Error ? error.message : '加载订购账号失败'
}

export default function BusinessOrderPage({
  experience = 'unified',
  backHref = '/public',
  backLabel = '返回账号中心',
}: {
  experience?: 'unified' | 'ai_bean_contract' | 'fly_card_8'
  backHref?: string
  backLabel?: string
}) {
  const [searchParams] = useSearchParams()
  const initialAccountId = searchParams.get('accountId') || ''
  const [accounts, setAccounts] = useState<BusinessOrderAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (experience === 'unified') return
    const previousTitle = document.title
    document.title = experience === 'ai_bean_contract' ? 'AI豆倍享合约' : '8元4G飞享卡'
    return () => {
      document.title = previousTitle
    }
  }, [experience])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(undefined)
    setAccounts([])
    void loadBusinessOrderAccounts()
      .then((next) => {
        if (alive) setAccounts(scopeBusinessOrderAccounts(next, initialAccountId))
      })
      .catch((requestError) => {
        if (alive) setError(errorText(requestError))
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [initialAccountId])

  if (loading) {
    return (
      <div className="grid brand-page min-h-screen place-items-center text-sm text-zinc-600">
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          正在加载订购账号
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <main className="mx-auto brand-page min-h-screen max-w-3xl px-4 py-10">
        <div className="border border-red-200 bg-white p-5 text-sm text-red-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Link to={backHref} className="mt-4 inline-flex text-xs font-medium text-zinc-700 hover:text-zinc-950">
            {backLabel}
          </Link>
        </div>
      </main>
    )
  }

  if (initialAccountId && accounts.length === 0) {
    return (
      <main className="mx-auto brand-page min-h-screen max-w-3xl px-4 py-10">
        <div className="border border-amber-200 bg-white p-5 text-sm text-amber-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>跳转账号不存在或无权访问，无法进入该号码的业务订购。</span>
          </div>
          <Link to={backHref} className="mt-4 inline-flex text-xs font-medium text-zinc-700 hover:text-zinc-950">
            {backLabel}
          </Link>
        </div>
      </main>
    )
  }

  return (
    experience === 'ai_bean_contract' ? (
      <V2AiBeanContractOrderPage
        accounts={accounts}
        initialAccountId={initialAccountId}
        allowManualPhone={false}
        backHref={`/business-order?accountId=${encodeURIComponent(initialAccountId)}`}
        backLabel="返回业务订购"
        standalone
      />
    ) : experience === 'fly_card_8' ? (
      <V2FlyCardOrderPage
        accounts={accounts}
        initialAccountId={initialAccountId}
        allowManualPhone={false}
        backHref={`/business-order?accountId=${encodeURIComponent(initialAccountId)}`}
        backLabel="返回业务订购"
      />
    ) : (
      <main className="brand-page min-h-screen px-3 py-5 sm:px-5">
        <V2UnifiedBusinessOrderPage
          accounts={accounts}
          initialAccountId={initialAccountId}
          allowManualPhone={false}
          backHref={backHref}
          backLabel={backLabel}
          aiBeanContractHref={`/business-order/ai-bean-contract?accountId=${encodeURIComponent(initialAccountId)}`}
          flyCardHref={`/business-order/fly-card-8?accountId=${encodeURIComponent(initialAccountId)}`}
        />
      </main>
    )
  )
}
