import BrandLogo from '@/components/BrandLogo'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  Gift,
  LayoutDashboard,
  Link2,
  Megaphone,
  PackageSearch,
  LogOut,
  Menu,
  SearchCheck,
  Settings,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type V2ShellProps = {
  children: ReactNode
  adminName?: string
  accountCount?: number
  attentionCount?: number
  onLogout?: () => void
}

type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  end?: boolean
  countKey?: 'accounts' | 'attention'
}

const NAVIGATION_GROUPS: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: '运营中心',
    items: [
      {
        label: '工作台',
        href: '/v2',
        icon: LayoutDashboard,
        end: true,
        countKey: 'attention',
      },
      { label: '账号中心', href: '/v2/accounts', icon: Smartphone, countKey: 'accounts' },
      { label: '任务中心', href: '/v2/tasks', icon: ClipboardList },
      { label: '自动化计划', href: '/v2/automations', icon: CalendarClock },
      { label: '权益活动', href: '/v2/benefits', icon: Gift, end: true },
      { label: '周三拼图互转', href: '/v2/benefits/wed-puzzle?from=v2', icon: Gift },
      { label: '全球通专区', href: '/v2/benefits/global-telecom', icon: BadgeCheck },
      { label: '业务查询', href: '/v2/business', icon: SearchCheck },
      { label: '产品查询', href: '/v2/product-query', icon: PackageSearch },
    ],
  },
  {
    label: '用户与访问',
    items: [
      { label: '专属链接', href: '/v2/links', icon: Link2 },
      { label: '用户与权限', href: '/v2/users', icon: UsersRound },
      { label: '公告管理', href: '/v2/announcements', icon: Megaphone },
    ],
  },
  {
    label: '系统',
    items: [
      { label: '日志与审计', href: '/v2/audit', icon: ShieldCheck },
      { label: '系统设置', href: '/v2/settings', icon: Settings },
    ],
  },
]

const NAVIGATION_ITEMS = NAVIGATION_GROUPS.flatMap((group) => group.items)

function formatCount(value?: number): string | undefined {
  if (value === undefined || value === null || !Number.isFinite(value)) return undefined
  if (value > 999) return '999+'
  return String(Math.max(0, Math.floor(value)))
}

function pathMatches(pathname: string, item: NavigationItem): boolean {
  if (item.end) return pathname === item.href || pathname === `${item.href}/`
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function SidebarContent({
  adminName,
  accountCount,
  attentionCount,
  onNavigate,
  onClose,
  onLogout,
}: {
  adminName: string
  accountCount?: number
  attentionCount?: number
  onNavigate?: () => void
  onClose?: () => void
  onLogout?: () => void
}) {
  const accountCountText = formatCount(accountCount)
  const attentionCountText = formatCount(attentionCount)
  const avatarText = adminName.trim().slice(0, 1).toUpperCase() || '管'

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 px-4">
        <BrandLogo />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-zinc-950">移动运营台</div>
          <div className="mt-0.5 text-[11px] font-medium text-zinc-500">CMCC CONTROL</div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭导航"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3" aria-label="V2 管理导航">
        <div className="space-y-4">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mb-1 px-2 text-[11px] font-medium text-zinc-400">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const count =
                    item.countKey === 'accounts'
                      ? accountCountText
                      : item.countKey === 'attention'
                        ? attentionCountText
                        : undefined

                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
                        )
                      }>
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={cn(
                              'h-[18px] w-[18px] shrink-0',
                              isActive
                                ? 'text-emerald-700'
                                : 'text-zinc-400 group-hover:text-zinc-700',
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {count !== undefined ? (
                            <span
                              className={cn(
                                'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
                                item.countKey === 'attention' && Number(attentionCount) > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : isActive
                                    ? 'bg-white text-emerald-800'
                                    : 'bg-zinc-100 text-zinc-500',
                              )}>
                              {count}
                            </span>
                          ) : isActive ? (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-zinc-200 p-3">
        {attentionCountText !== undefined && Number(attentionCount) > 0 ? (
          <NavLink
            to="/v2/accounts?status=attention"
            onClick={onNavigate}
            className="mb-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900 hover:bg-amber-100">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span className="min-w-0 flex-1">有 {attentionCountText} 个账号需要处理</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </NavLink>
        ) : null}
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {avatarText}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-zinc-900">{adminName}</div>
            <div className="mt-0.5 text-[11px] text-zinc-500">系统管理员</div>
          </div>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              aria-label="退出管理员登录"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800">
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <UserRound className="h-4 w-4 shrink-0 text-zinc-400" />
          )}
        </div>
      </div>
    </div>
  )
}

export default function V2Shell({
  children,
  adminName = '管理员',
  accountCount,
  attentionCount,
  onLogout,
}: V2ShellProps) {
  const location = useLocation()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  const currentItem = useMemo(
    () =>
      [...NAVIGATION_ITEMS]
        .sort((a, b) => b.href.length - a.href.length)
        .find((item) => pathMatches(location.pathname, item)),
    [location.pathname],
  )

  useEffect(() => {
    setMobileNavigationOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!mobileNavigationOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavigationOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileNavigationOpen])

  const accountCountText = formatCount(accountCount)
  const attentionCountText = formatCount(attentionCount)

  return (
    <div className="brand-page min-h-screen text-zinc-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-zinc-200 lg:block">
        <SidebarContent
          adminName={adminName}
          accountCount={accountCount}
          attentionCount={attentionCount}
          onLogout={onLogout}
        />
      </aside>

      {mobileNavigationOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="关闭导航"
            className="absolute inset-0 h-full w-full bg-black/40"
            onClick={() => setMobileNavigationOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="移动端管理导航"
            className="absolute inset-y-0 left-0 w-56 border-r border-zinc-200 shadow-2xl">
            <SidebarContent
              adminName={adminName}
              accountCount={accountCount}
              attentionCount={attentionCount}
              onNavigate={() => setMobileNavigationOpen(false)}
              onClose={() => setMobileNavigationOpen(false)}
              onLogout={onLogout}
            />
          </aside>
        </div>
      ) : null}

      <div className="min-h-screen lg:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/95 px-3 backdrop-blur sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => setMobileNavigationOpen(true)}
            aria-label="打开导航"
            aria-expanded={mobileNavigationOpen}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 lg:hidden">
            <Menu className="h-[18px] w-[18px]" />
          </button>

          <BrandLogo className="h-7 w-7 lg:hidden" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-zinc-950">
              {currentItem?.label || 'V2 管理台'}
            </div>
            <div className="mt-0.5 hidden text-[11px] text-zinc-500 sm:block">
              北京时间 · 实时运营数据
            </div>
          </div>

          <div className="hidden items-center gap-1.5 text-xs md:flex">
            {accountCountText !== undefined ? (
              <span className="rounded-md bg-zinc-100 px-2 py-1.5 text-zinc-600">
                账号 <strong className="ml-1 font-semibold text-zinc-900">{accountCountText}</strong>
              </span>
            ) : null}
            {attentionCountText !== undefined ? (
              <span
                className={cn(
                  'rounded-md px-2 py-1.5',
                  Number(attentionCount) > 0
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-emerald-50 text-emerald-700',
                )}>
                待处理{' '}
                <strong className="ml-1 font-semibold">{attentionCountText}</strong>
              </span>
            ) : null}
          </div>

          <div
            className="inline-flex h-9 shrink-0 items-center rounded-md border border-zinc-200 bg-zinc-100 p-0.5 text-xs font-semibold"
            aria-label="版本切换">
            <Link
              to="/"
              className="inline-flex h-7 items-center rounded px-2.5 text-zinc-500 hover:bg-white hover:text-zinc-900">
              V1
              <span className="ml-1 hidden font-normal sm:inline">经典版</span>
            </Link>
            <NavLink
              to="/v2"
              className="inline-flex h-7 items-center rounded bg-white px-2.5 text-emerald-800 shadow-sm">
              V2
              <span className="ml-1 hidden font-normal sm:inline">新版</span>
            </NavLink>
          </div>
        </header>

        <main className="min-w-0 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">{children}</main>
      </div>
    </div>
  )
}
