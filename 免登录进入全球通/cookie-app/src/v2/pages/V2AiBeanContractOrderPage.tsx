import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import V2BmccActivityOrderPage from './V2BmccActivityOrderPage'

export default function V2AiBeanContractOrderPage({
  accounts = [],
  initialAccountId = '',
  allowManualPhone = true,
  backHref = '/v2/business/order',
  backLabel = '返回业务订购',
  standalone = false,
}: {
  accounts?: BusinessOrderAccount[]
  initialAccountId?: string
  allowManualPhone?: boolean
  backHref?: string
  backLabel?: string
  standalone?: boolean
}) {
  if (standalone) {
    return (
      <V2BmccActivityOrderPage
        accounts={accounts}
        initialAccountId={initialAccountId}
        allowManualPhone={allowManualPhone}
        experience="ai_bean_contract"
        standalone
        backHref={backHref}
        backLabel={backLabel}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-5">
      <header>
        <Link to={backHref} className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-3.5 w-3.5" />{backLabel}
        </Link>
        <h1 className="text-xl font-semibold text-zinc-950">AI豆倍享合约订购</h1>
        <p className="mt-1 text-sm text-zinc-500">北京移动登录成功后进入原版合约页面，订购号码以登录会话为准</p>
      </header>

      <V2BmccActivityOrderPage
        accounts={accounts}
        initialAccountId={initialAccountId}
        allowManualPhone={allowManualPhone}
        experience="ai_bean_contract"
        backHref={backHref}
        backLabel={backLabel}
      />
    </div>
  )
}
