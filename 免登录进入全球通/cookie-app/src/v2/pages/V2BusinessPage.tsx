import { ArrowRight, PackagePlus, PackageSearch, SearchCheck, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { V2Account } from '../lib/types'

export default function V2BusinessPage({ accounts }: { accounts: V2Account[] }) {
  const usableAccounts = useMemo(
    () => accounts.filter((account) => account.health.status !== 'disabled'),
    [accounts],
  )
  const [accountId, setAccountId] = useState(usableAccounts[0]?.id || '')
  const selected =
    usableAccounts.find((account) => account.id === accountId) || usableAccounts[0]
  const query = selected ? `?accountId=${encodeURIComponent(selected.id)}` : ''

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">业务查询</h1>
        <p className="mt-1 text-sm text-zinc-500">套餐、合约、宽带与商城订购</p>
      </div>
      <section className="border-y border-zinc-200 bg-white p-4">
        <label className="block max-w-xl space-y-1.5">
          <span className="text-sm font-medium text-zinc-800">当前账号</span>
          <select
            value={selected?.id || ''}
            onChange={(event) => setAccountId(event.target.value)}
            disabled={usableAccounts.length === 0}
            className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-100 disabled:text-zinc-400">
            {usableAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.displayPhone || account.phoneMasked} · {account.label}
              </option>
            ))}
          </select>
        </label>
        {selected ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <span className="text-xs text-zinc-500">健康状态</span>
              <strong className="mt-1 block text-sm text-zinc-900">
                {selected.health.label}
              </strong>
            </div>
            <div>
              <span className="text-xs text-zinc-500">专属链接</span>
              <strong className="mt-1 block text-sm text-zinc-900">
                {selected.publicLinkIds[0] || '未分配'}
              </strong>
            </div>
            <div>
              <span className="text-xs text-zinc-500">登录凭据</span>
              <strong className="mt-1 block text-sm text-zinc-900">
                {selected.hasCookie ? '可用' : '需重新登录'}
              </strong>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">没有可查询的账号</p>
        )}
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to={`/legacy-business-query${query}${query ? '&' : '?'}returnTo=${encodeURIComponent('/v2/business')}`}
          aria-disabled={!selected} onClick={event => { if (!selected) event.preventDefault() }}
          className="group flex min-h-36 items-center gap-4 rounded-md border border-zinc-200 bg-white p-5 hover:border-blue-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
          <SearchCheck className="h-5 w-5 shrink-0 text-blue-600" />
          <div className="min-w-0 flex-1"><h2 className="text-base font-semibold text-zinc-950">旧版已订业务</h2><p className="mt-1 text-sm text-zinc-500">查询套餐、增值业务及基础服务，短信验证退订</p></div>
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" />
        </Link>
        <Link
          to={`/business-query${query}`}
          aria-disabled={!selected}
          onClick={(event) => {
            if (!selected) event.preventDefault()
          }}
          className="group flex min-h-36 items-center gap-4 rounded-md border border-zinc-200 bg-white p-5 shadow-sm hover:border-emerald-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <SearchCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-950">套餐、合约与宽带</h2>
            <p className="mt-1 text-sm text-zinc-500">
              查看主套餐、增值业务、合约限制和宽带号码
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-700" />
        </Link>
        <Link
          to={`/shop-query${query}`}
          aria-disabled={!selected}
          onClick={(event) => {
            if (!selected) event.preventDefault()
          }}
          className="group flex min-h-36 items-center gap-4 rounded-md border border-zinc-200 bg-white p-5 shadow-sm hover:border-sky-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-sky-50 text-sky-700">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-950">商城业务</h2>
            <p className="mt-1 text-sm text-zinc-500">查询商城订购并进入短信退订流程</p>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-sky-700" />
        </Link>
        <Link
          to="/v2/business/order"
          className="group flex min-h-36 items-center gap-4 rounded-md border border-zinc-200 bg-white p-5 shadow-sm hover:border-red-300">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-red-50 text-red-700">
            <PackagePlus className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-950">业务订购</h2>
            <p className="mt-1 text-sm text-zinc-500">验证码登录、产品协议核验与确认订购</p>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-red-700" />
        </Link>
        <Link
          to="/v2/product-query"
          className="group flex min-h-36 items-center gap-4 rounded-md border border-zinc-200 bg-white p-5 shadow-sm hover:border-violet-300">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-violet-50 text-violet-700">
            <PackageSearch className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-950">产品查询</h2>
            <p className="mt-1 text-sm text-zinc-500">批量扫描 productCode 并维护商品库</p>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-violet-700" />
        </Link>
      </div>
    </div>
  )
}
