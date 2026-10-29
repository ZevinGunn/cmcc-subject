import V2BmccActivityOrderPage from './V2BmccActivityOrderPage'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'

export default function V2FlyCardOrderPage({
  accounts = [],
  initialAccountId = '',
  allowManualPhone = true,
  backHref = '/business-order',
  backLabel = '返回业务订购',
}: {
  accounts?: BusinessOrderAccount[]
  initialAccountId?: string
  allowManualPhone?: boolean
  backHref?: string
  backLabel?: string
}) {
  return (
    <V2BmccActivityOrderPage
      accounts={accounts}
      initialAccountId={initialAccountId}
      allowManualPhone={allowManualPhone}
      experience="fly_card_8"
      standalone
      backHref={backHref}
      backLabel={backLabel}
    />
  )
}
