import { cn } from '@/lib/utils'
import {
  collectStarbucksCoupons,
  starbucksStatusLabels,
  type StarbucksAccount,
  type StarbucksCouponStatus,
  type StarbucksExpiryFilter,
} from '../../shared/starbucks'

export type StarbucksFilterValues = {
  accountId: string
  status: StarbucksCouponStatus | 'all'
  category: string
  search: string
  expiryFilter: StarbucksExpiryFilter
  expiryFrom: string
  expiryTo: string
}

export const DEFAULT_STARBUCKS_FILTERS: StarbucksFilterValues = {
  accountId: 'all', status: 'active', category: '', search: '',
  expiryFilter: 'all', expiryFrom: '', expiryTo: '',
}

const input = 'h-10 w-full min-w-0 max-w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 disabled:opacity-50'
const label = 'min-w-0 space-y-1 text-xs text-zinc-500'

export default function StarbucksCouponFilters({ value, onChange, accounts, categories, disabled, now }: {
  value: StarbucksFilterValues
  onChange: (next: StarbucksFilterValues) => void
  accounts: StarbucksAccount[]
  categories: string[]
  disabled?: boolean
  now: number
}) {
  const coupons = collectStarbucksCoupons(accounts, value.accountId, now)
  function change<Key extends keyof StarbucksFilterValues>(key: Key, next: StarbucksFilterValues[Key]) {
    onChange({ ...value, [key]: next })
  }
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
      <label className={label + ' col-span-2 xl:col-span-1'}>
        <span>号码</span>
        <select aria-label="选择星巴克账号" className={input} value={value.accountId} disabled={disabled} onChange={event => change('accountId', event.target.value)}>
          <option value="all">全部号码（{accounts.length}）</option>
          {accounts.map(account => <option key={account.id} value={account.id}>{account.phoneMasked}{account.invalidAt ? ' · 需重新登录' : ''}</option>)}
        </select>
      </label>
      <label className={label}>
        <span>卡券分类</span>
        <select aria-label="卡券分类" className={input} value={value.category} disabled={disabled} onChange={event => change('category', event.target.value)}>
          <option value="">全部券种（{categories.length}）</option>
          {categories.map(title => <option key={title} value={title}>{title}</option>)}
        </select>
      </label>
      <label className={label}>
        <span>卡券状态</span>
        <select aria-label="卡券状态" className={input} value={value.status} disabled={disabled} onChange={event => change('status', event.target.value as StarbucksFilterValues['status'])}>
          {(['active', 'used', 'expired', 'unknown', 'all'] as const).map(status => <option key={status} value={status}>{status === 'all' ? '全部' : starbucksStatusLabels[status]}（{status === 'all' ? coupons.length : coupons.filter(coupon => coupon.status === status).length}）</option>)}
        </select>
      </label>
      <label className={label}>
        <span>有效期</span>
        <select aria-label="有效期筛选" className={input} value={value.expiryFilter} disabled={disabled} onChange={event => change('expiryFilter', event.target.value as StarbucksExpiryFilter)}>
          <option value="all">全部有效期</option>
          <option value="7">7 天内到期</option>
          <option value="30">30 天内到期</option>
          <option value="90">90 天内到期</option>
          <option value="expired">已到期</option>
          <option value="unknown">有效期未知</option>
        </select>
      </label>
      <label className={label + ' xl:col-span-2'}>
        <span>关键词</span>
        <input aria-label="搜索卡券" className={input} value={value.search} disabled={disabled} placeholder="券名或说明" onChange={event => change('search', event.target.value)} />
      </label>
      <label className={label}>
        <span>到期日期从</span>
        <input type="date" aria-label="到期日期起始" className={cn(input, 'px-2 text-xs sm:px-3 sm:text-sm')} value={value.expiryFrom} max={value.expiryTo || undefined} disabled={disabled} onChange={event => change('expiryFrom', event.target.value)} />
      </label>
      <label className={label}>
        <span>到期日期至</span>
        <input type="date" aria-label="到期日期结束" className={cn(input, 'px-2 text-xs sm:px-3 sm:text-sm')} value={value.expiryTo} min={value.expiryFrom || undefined} disabled={disabled} onChange={event => change('expiryTo', event.target.value)} />
      </label>
    </div>
  )
}
