import BrandLogo from '@/components/BrandLogo'
import { AppWindow, ArrowLeft, BadgeDollarSign, BadgePercent, Blocks, ChevronDown, ChevronUp, Gauge, Gem, Gift, PackagePlus, Settings2, ShoppingBag, Smartphone, Store, TicketCheck, Wifi } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { BusinessOrderAccount } from '../lib/businessOrderApi'
import V2BenefitOrderWorkflowPage from './V2BenefitOrderWorkflowPage'
import V2BusinessOrderPage from './V2BusinessOrderPage'
import V2BmccActivityOrderPage from './V2BmccActivityOrderPage'
import V2BroadbandOrderPage from './V2BroadbandOrderPage'
import V2QqtPremiumBroadbandPage from './V2QqtPremiumBroadbandPage'
import V2AigouOrderPage from './V2AigouOrderPage'
import type { CocAppBusinessId, RetailBusinessId } from '../lib/benefitOrderApi'
import { AGE_FEED_DEFAULTS, AGE_FEED_SOURCE_URL } from '../../../shared/ageFeed'

type OrderMode = 'global_diamond' | 'global_diamond_app' | 'age_feed' | 'building_bricks' | 'broadband' | 'qqt_premium_broadband' | 'premium_membership' | 'coc_app' | 'mobile_retail' | 'aigou' | 'bmcc_activity' | 'standard_bag' | 'deluxe_bag'

const MODES = [
  { id: 'global_diamond' as const, label: '卓越钻石卡', description: '全球通合约订购', icon: Gem },
  { id: 'global_diamond_app' as const, label: '钻石卡 App版', description: 'App 专属渠道页', icon: AppWindow },
  { id: 'age_feed' as const, label: '全球通网龄直升', description: '自动匹配或选择银卡、金卡、白金卡尝试办理', icon: Gem },
  { id: 'building_bricks' as const, label: '积木套餐', description: '独立登录并选择模组', icon: Blocks },
  { id: 'broadband' as const, label: '宽带办理', description: '新装与续约产品', icon: Wifi },
  { id: 'qqt_premium_broadband' as const, label: '尊享宽带', description: '全球通等级千兆宽带', icon: Wifi },
  { id: 'premium_membership' as const, label: '智臻会员', description: '选择会员权益档位', icon: PackagePlus },
  { id: 'standard_bag' as const, label: '标准福袋', description: '9.9 元主资费 · 权益选换', icon: Gift },
  { id: 'deluxe_bag' as const, label: '豪华福袋', description: '19.9 元主资费 · 权益选换', icon: Gift },
  { id: 'coc_app' as const, label: 'App 专属套餐', description: '智臻 COC 与 5GA', icon: Smartphone },
  { id: 'mobile_retail' as const, label: '移动商城', description: '套餐与融合权益', icon: Store },
  { id: 'aigou' as const, label: '爱购商城', description: '权益直订与购物车', icon: ShoppingBag },
  { id: 'bmcc_activity' as const, label: '5GA 加速', description: '北京移动活动订购', icon: Gauge },
  { id: 'ai_bean_contract' as const, label: 'AI豆倍享合约', description: '独立原版订购页面', icon: BadgePercent },
  { id: 'fly_card_8' as const, label: '8元4G飞享卡', description: '北京移动原版套餐页', icon: BadgeDollarSign },
]

const COC_APP_PRODUCTS: Array<{ id: CocAppBusinessId; label: string; description: string; icon: typeof Wifi }> = [
  { id: 'smart_life', label: '智臻会员 COC版', description: '199-999 元多版本档位', icon: PackagePlus },
  { id: 'five_ga', label: '全球通 5GA', description: '199-999 元全球通套餐', icon: Wifi },
]

const RETAIL_PRODUCTS: Array<{ id: RetailBusinessId; label: string; description: string; icon: typeof Wifi }> = [
  { id: 'good_gifts_membership', label: '好礼多多会员版', description: '20GB 流量 + PLUS 会员', icon: Gift },
  { id: 'good_gifts_data', label: '好礼多多流量版', description: '实时查询流量活动档位', icon: Gauge },
  { id: 'five_g_enjoy', label: '5G畅享套餐', description: '78-598 元多档', icon: Wifi },
  { id: 'fly_card_8', label: '8元4G飞享卡', description: '基础主套餐', icon: BadgeDollarSign },
  { id: 'excellent_device_offer', label: '卓越会员购机优惠', description: '0 元购机权益', icon: Smartphone },
  { id: 'traffic_member_20', label: '10GB流量+热门会员', description: '20 元融合包', icon: TicketCheck },
  { id: 'custom', label: '自定义业务', description: '按产品编码与档位办理', icon: Settings2 },
]

export default function V2UnifiedBusinessOrderPage({
  accounts = [],
  initialAccountId = '',
  allowManualPhone = true,
  backHref = '/v2/business',
  backLabel = '返回业务查询',
  aiBeanContractHref = '/business-order/ai-bean-contract',
  flyCardHref = '/business-order/fly-card-8',
}: {
  accounts?: BusinessOrderAccount[]
  initialAccountId?: string
  allowManualPhone?: boolean
  backHref?: string
  backLabel?: string
  aiBeanContractHref?: string
  flyCardHref?: string
}) {
  const [mode, setMode] = useState<OrderMode>('global_diamond')
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  const [retailBusinessId, setRetailBusinessId] = useState<RetailBusinessId>('five_g_enjoy')
  const [cocAppBusinessId, setCocAppBusinessId] = useState<CocAppBusinessId>('smart_life')
  const retailProduct = RETAIL_PRODUCTS.find((item) => item.id === retailBusinessId) || RETAIL_PRODUCTS[0]

  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-5">
      <header>
        <Link to={backHref} className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-3.5 w-3.5" />{backLabel}
        </Link>
        <h1 className="brand-heading text-xl font-semibold text-zinc-950"><BrandLogo className="h-7 w-7" />业务订购</h1>
        <p className="mt-1 text-sm text-zinc-500">选择业务后完成登录、实时资格与协议核验、短信确认和订购</p>
      </header>

      <div role="tablist" aria-label="订购业务" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MODES.map((item, index) => {
          const Icon = item.icon
          const hidden = !selectorExpanded && index >= 4 && item.id !== mode
          if (item.id === 'ai_bean_contract' || item.id === 'fly_card_8') {
            const href = item.id === 'ai_bean_contract' ? aiBeanContractHref : flyCardHref
            return (
              <Link
                key={item.id}
                to={href}
                reloadDocument
                hidden={hidden}
                className={cn('min-h-[64px] items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-zinc-700 transition-colors', hidden ? 'hidden' : 'flex', item.id === 'ai_bean_contract' ? 'hover:border-[#b8894f] hover:bg-[#fff8ed] hover:text-[#663403]' : 'hover:border-blue-500 hover:bg-blue-50 hover:text-blue-900')}>
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-md', item.id === 'ai_bean_contract' ? 'bg-[#f6cda6] text-[#663403]' : 'bg-blue-600 text-white')}><Icon className="h-4.5 w-4.5" /></span>
                <span className="min-w-0"><strong className="block text-sm">{item.label}</strong><span className="mt-0.5 block text-xs opacity-70">{item.description}</span></span>
              </Link>
            )
          }
          const active = mode === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              hidden={hidden}
              onClick={() => setMode(item.id)}
              className={cn(
                'min-h-[64px] items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                hidden ? 'hidden' : 'flex',
                active ? 'border-emerald-700 bg-emerald-50 text-emerald-950' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300',
              )}>
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-md', active ? 'bg-emerald-700 text-white' : 'bg-zinc-100 text-zinc-600')}><Icon className="h-4.5 w-4.5" /></span>
              <span className="min-w-0"><strong className="block text-sm">{item.label}</strong><span className="mt-0.5 block text-xs opacity-70">{item.description}</span></span>
            </button>
          )
        })}
      </div>
      <div className="flex justify-center border-t border-zinc-200 pt-3">
        <button
          type="button"
          aria-expanded={selectorExpanded}
          onClick={() => setSelectorExpanded((expanded) => !expanded)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
        >
          {selectorExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {selectorExpanded ? '收起业务选择' : `展开全部（${MODES.length - 4}）`}
        </button>
      </div>

      {mode === 'global_diamond' || mode === 'global_diamond_app' || mode === 'age_feed' ? (
        <V2BusinessOrderPage
          key={mode}
          target={mode === 'age_feed' ? 'age_feed' : 'diamond_package'}
          accounts={accounts}
          initialAccountId={initialAccountId}
          allowManualPhone={allowManualPhone}
          backHref={backHref}
          backLabel={backLabel}
          showHeader={false}
          initialDefaults={mode === 'age_feed' ? AGE_FEED_DEFAULTS : mode === 'global_diamond_app' ? {
            productCode: '1000000100290',
            pageId: '1889216886548430848',
            touchCode: 'P00000122018',
          } : undefined}
          officialSourceUrl={mode === 'age_feed' ? AGE_FEED_SOURCE_URL : mode === 'global_diamond_app'
            ? 'https://dev.coc.10086.cn/coc/web6/diamondPackage/?pageId=1889216886548430848&channelId=P00000122018'
            : undefined}
        />
      ) : mode === 'standard_bag' || mode === 'deluxe_bag' ? (
        <V2BenefitOrderWorkflowPage
          key={mode}
          workflow="lucky_bag"
          bagVariant={mode === 'standard_bag' ? 'standard' : 'deluxe'}
          accounts={accounts}
          initialAccountId={initialAccountId}
          allowManualPhone={allowManualPhone}
        />
      ) : mode === 'bmcc_activity' ? (
        <V2BmccActivityOrderPage
          accounts={accounts}
          initialAccountId={initialAccountId}
          allowManualPhone={allowManualPhone}
        />
      ) : mode === 'broadband' ? (
        <V2BroadbandOrderPage
          accounts={accounts}
          initialAccountId={initialAccountId}
        />
      ) : mode === 'qqt_premium_broadband' ? (
        <V2QqtPremiumBroadbandPage
          accounts={accounts}
          initialAccountId={initialAccountId}
        />
      ) : mode === 'coc_app' ? (
        <div className="space-y-4">
          <div role="tablist" aria-label="App 专属套餐" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {COC_APP_PRODUCTS.map((item) => {
              const Icon = item.icon
              const active = cocAppBusinessId === item.id
              return (
                <button key={item.id} type="button" role="tab" aria-selected={active} onClick={() => setCocAppBusinessId(item.id)} className={cn(
                  'flex min-h-[56px] items-center gap-2.5 rounded-md border px-3 py-2 text-left',
                  active ? 'border-emerald-700 bg-emerald-50 text-emerald-950' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300',
                )}>
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-emerald-700' : 'text-zinc-500')} />
                  <span className="min-w-0"><strong className="block text-xs">{item.label}</strong><span className="mt-0.5 block text-[11px] text-zinc-500">{item.description}</span></span>
                </button>
              )
            })}
          </div>
          <V2BenefitOrderWorkflowPage
            key={cocAppBusinessId}
            workflow="coc_app"
            cocAppBusinessId={cocAppBusinessId}
            retailProductName={COC_APP_PRODUCTS.find((item) => item.id === cocAppBusinessId)?.label}
            accounts={accounts}
            initialAccountId={initialAccountId}
            allowManualPhone={allowManualPhone}
          />
        </div>
      ) : mode === 'mobile_retail' ? (
        <div className="space-y-4">
          <div role="tablist" aria-label="移动商城业务" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {RETAIL_PRODUCTS.map((item) => {
              const Icon = item.icon
              const active = retailBusinessId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRetailBusinessId(item.id)}
                  className={cn(
                    'flex min-h-[56px] items-center gap-2.5 rounded-md border px-3 py-2 text-left',
                    active ? 'border-emerald-700 bg-emerald-50 text-emerald-950' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300',
                  )}>
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-emerald-700' : 'text-zinc-500')} />
                  <span className="min-w-0"><strong className="block text-xs">{item.label}</strong><span className="mt-0.5 block text-[11px] text-zinc-500">{item.description}</span></span>
                </button>
              )
            })}
          </div>
          <V2BenefitOrderWorkflowPage
            key={retailBusinessId}
            workflow="premium_membership"
            retailBusinessId={retailBusinessId}
            retailProductName={retailProduct.label}
            accounts={accounts}
            initialAccountId={initialAccountId}
            allowManualPhone={allowManualPhone}
          />
        </div>
      ) : mode === 'aigou' ? (
        <V2AigouOrderPage accounts={accounts} initialAccountId={initialAccountId} />
      ) : (
        <V2BenefitOrderWorkflowPage
          key={mode}
          workflow={mode}
          accounts={accounts}
          initialAccountId={initialAccountId}
          allowManualPhone={allowManualPhone}
        />
      )}
    </div>
  )
}
