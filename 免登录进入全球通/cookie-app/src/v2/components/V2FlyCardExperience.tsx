import { AlertTriangle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import type { BmccActivityOrderSession, BmccJsonValue } from '../lib/bmccActivityOrderApi'
import V2OriginalOrderConfirmation from './V2OriginalOrderConfirmation'
import V2OrderResponseDetails from './V2OrderResponseDetails'

type Props = {
  session: BmccActivityOrderSession
  activityLoadFailed: boolean
  orderCode: string
  orderCooldown: number
  busy: string
  onReloadActivity: () => void
  onSubmit: () => void
  onOrderCodeChange: (value: string) => void
  onSendOrderSms: () => void
  onConfirmOrder: () => void
  onOpenParams: () => void
  onReset: () => void
  standalone?: boolean
}

const RULES = [
  '资费标准：月费8元，包含10MB国内流量、30分钟国内通话、10GB咪咕定向流量；套外国内通话0.25元/分钟。套外流量30元/GB（0.29元/MB，累计10元可免费使用至100MB，以此类推至30元，累计30元可免费使用至1GB）；国内点对点短信0.1元/条；国内不含港澳台。',
  '流量规则：套餐内国内流量可分享、可结转、不可转赠；咪咕定向流量可分享、不可结转、不可转赠；套餐变更后，原套餐剩余流量不结转；流量使用优先级为：定向流量高于通用流量，叠加包流量高于主套餐流量；执行套外流量费600元封顶。',
  '互斥规则：与WAP不限量业务互斥。',
  '生效规则：新入网或未开通主套餐的客户办理立即生效，当月月费及流量资源按天折算；变更套餐下月生效。',
  '有效期限：产品自生效当月起有效期36个月，如双方在有效期届满前无异议，有效期自动续展，每次续展36个月。',
  '退订方式：可通过中国移动APP、营业厅、10086等渠道变更为其他在售套餐；若当前套餐已下线，变更套餐后将无法转回原套餐。',
  '未尽事宜详询10086。',
]

const ORDER_DESCRIPTION = [
  '资费标准：8元/月。',
  '方案编号：24BJ201078。',
  '资费类型：套餐。',
  '有效期限：自生效当月起有效期36个月，如双方在有效期届满前无异议，有效期自动续展，每次续展36个月。',
  '在网要求：无在网要求。',
  '违约责任：变更/退订/销户/携转无需承担违约责任。',
  '退订方式：可通过中国移动APP、营业厅、10086等变更为其他在售套餐；不能变更为已下线套餐。',
  '国内通话：30分钟。',
  '国内通用流量：10MB。',
  '超出资费说明：国内通话0.25元/分钟，国内流量30元/GB，国内点对点短信0.1元/条。',
  '其他服务内容：套餐内国内流量可分享、可结转、不可转赠；套餐变更后原套餐剩余流量不结转；与WAP不限量业务互斥；新入网或未开通主套餐客户办理立即生效，变更套餐下月生效。',
].map((item) => `· ${item}`).join('\n')

function numberDetail(value: BmccJsonValue | undefined): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return undefined
}

function FlyCardProduct({ session, busy, onSubmit }: Pick<Props, 'session' | 'busy' | 'onSubmit'>) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const voice = numberDetail(session.activity?.details.previousMonthVoiceMinutes)
  const flow = numberDetail(session.activity?.details.previousMonthDataMb)
  const usageAvailable = voice !== undefined && flow !== undefined

  return (
    <section className="min-h-screen bg-[#218cff] font-['Microsoft_YaHei',sans-serif] text-[#222]">
      <div
        className="mx-auto min-h-screen w-full max-w-[750px] bg-[#218cff] bg-[length:100%_auto] bg-top bg-no-repeat px-[4%] pb-10 pt-[132px] sm:pt-[150px]"
        style={{ backgroundImage: "url('/fly-card-8/background.png')" }}>
        <header className="text-center">
          <h1 className="text-[34px] font-extrabold text-white sm:text-[46px]">8元4G飞享卡</h1>
          <div className="relative mx-auto mt-4 aspect-[654/369] w-full max-w-[654px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/fly-card-8/card.png')" }}>
            <p className="absolute right-[9%] top-[5%] text-[14px] font-semibold text-white sm:text-[20px]">月费 <strong className="text-[24px] text-[#fff66a] sm:text-[34px]">8元</strong></p>
            <div className="absolute inset-x-[18%] top-[25%] flex items-center justify-center gap-[3%]">
              <img src="/fly-card-8/telephone.png" alt="国内通话" className="w-[30%]" />
              <img src="/fly-card-8/plus.png" alt="加" className="mt-[4%] w-[6%]" />
              <img src="/fly-card-8/exchange.png" alt="国内流量" className="w-[30%]" />
            </div>
            <div className="absolute inset-x-[16%] bottom-[8%] grid grid-cols-2 gap-[12%] text-center text-[17px] font-semibold sm:text-[24px]">
              <div><strong className="block">30分钟/月</strong><span className="text-[12px] font-normal sm:text-[17px]">国内通话</span></div>
              <div><strong className="block">10MB/月</strong><span className="text-[12px] font-normal sm:text-[17px]">国内流量</span></div>
            </div>
          </div>
        </header>

        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => setConfirmOpen(true)}
          className="mx-auto mt-4 block w-[89%] max-w-[583px] disabled:cursor-not-allowed disabled:opacity-60">
          <img src="/fly-card-8/confirm.png" alt="立即办理" className="h-auto w-full" />
        </button>

        <section className="mt-5 rounded-md bg-white px-5 py-6 text-justify text-[14px] leading-7 sm:px-7 sm:text-[17px] sm:leading-8">
          <h2 className="mb-3 flex items-center text-[18px] font-bold sm:text-[22px]"><img src="/fly-card-8/dot.png" alt="" className="mr-2 h-5 w-5" />业务规则</h2>
          <ol className="space-y-1.5 font-semibold underline underline-offset-2">
            {RULES.map((rule, index) => <li key={rule}>{index + 1}、{rule}</li>)}
          </ol>
        </section>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-white/95 px-4 py-3 text-xs text-zinc-600">
          <span>办理号码</span>
          <strong className="font-semibold text-zinc-900">{session.maskedPhone}</strong>
        </div>
      </div>

      {confirmOpen ? (
        <div className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-black/55 px-3 py-6" role="dialog" aria-modal="true" aria-labelledby="fly-card-confirm-title">
          <div className="relative w-full max-w-[653px] bg-contain bg-top bg-no-repeat px-[9%] pb-[7%] pt-[12%] text-center" style={{ backgroundImage: "url('/fly-card-8/tcbj.png')", aspectRatio: '653 / 733' }}>
            <button type="button" title="关闭" aria-label="关闭" onClick={() => setConfirmOpen(false)} className="absolute right-[8%] top-[8%] grid h-9 w-9 place-items-center rounded-md hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff754c]"><img src="/fly-card-8/guanbixiao.png" alt="" className="h-[18px] w-[18px] sm:h-6 sm:w-6" /></button>
            <h2
              id="fly-card-confirm-title"
              data-dialog-drag-handle
              className="cursor-move select-none text-[20px] font-bold sm:text-[28px]">
              提示
            </h2>
            <div className="mt-[5%] text-[14px] leading-6 sm:text-[19px] sm:leading-8">
              <strong className="block">您正在办理8元4G飞享卡业务</strong>
              <p className="mt-2 text-justify">该业务含10MB流量+30分钟通话，{usageAvailable ? <>您上个月使用<strong className="text-[#155eef]">{flow}</strong>MB流量+<strong className="text-[#155eef]">{voice}</strong>分钟通话，</> : <>上月用量暂未读取，</>}变更后可能会产生超额套外费用。变更套餐后当前套餐如有剩余流量则本月底到期清零不可结转，同时可能影响全球通星级评定及相关权益。</p>
            </div>
            <div className="absolute inset-x-[9%] bottom-[7%] flex items-center justify-center gap-3">
              <button type="button" disabled={Boolean(busy)} onClick={() => setConfirmOpen(false)} className="w-[43%] disabled:opacity-50"><img src="/fly-card-8/fanhui.png" alt="返回" className="w-full" /></button>
              <button type="button" disabled={Boolean(busy)} onClick={onSubmit} className="w-[49%] disabled:opacity-50"><img src="/fly-card-8/confirm2.png" alt="确认办理" className="w-full" />{busy === 'submit' ? <Loader2 className="absolute right-[27%] top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-white" /> : null}</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default function V2FlyCardExperience({
  session,
  activityLoadFailed,
  orderCode,
  orderCooldown,
  busy,
  onReloadActivity,
  onSubmit,
  onOrderCodeChange,
  onSendOrderSms,
  onConfirmOrder,
  onOpenParams,
  onReset,
}: Props) {
  if (session.stage === 'logged_in') {
    return (
      <section className="grid min-h-screen place-items-center bg-[#218cff] px-6 text-center text-white">
        <div>
          {activityLoadFailed ? <AlertTriangle className="mx-auto h-9 w-9" /> : <Loader2 className="mx-auto h-9 w-9 animate-spin" />}
          <h2 className="mt-4 text-base font-semibold">{activityLoadFailed ? '套餐信息加载失败' : '正在进入8元4G飞享卡'}</h2>
          <p className="mt-2 text-sm text-blue-100">{session.maskedPhone}</p>
          {activityLoadFailed ? <button type="button" disabled={Boolean(busy)} onClick={onReloadActivity} className="mt-5 h-10 rounded-md border border-white px-5 text-sm font-semibold disabled:opacity-50">重新加载</button> : null}
        </div>
      </section>
    )
  }

  if (session.stage === 'activity_ready') {
    return <FlyCardProduct session={session} busy={busy} onSubmit={onSubmit} />
  }

  if (session.stage === 'order_sms_required') {
    return (
      <V2OriginalOrderConfirmation
        maskedPhone={session.maskedPhone}
        productName={session.orderSms?.productItemName || '8元4G飞享卡'}
        description={session.orderSms?.productItemDesc?.trim() || ORDER_DESCRIPTION}
        orderCode={orderCode}
        orderCooldown={orderCooldown}
        busy={busy}
        headerImage="/fly-card-8/pophd.png"
        confirmImage="/fly-card-8/popqr.png"
        onOrderCodeChange={onOrderCodeChange}
        onSendOrderSms={onSendOrderSms}
        onConfirmOrder={onConfirmOrder}
        onOpenParams={onOpenParams}
      />
    )
  }

  const result = session.lastResult
  return (
    <section className="grid min-h-screen place-items-center bg-[#218cff] px-5 text-center text-white">
      <div className="w-full max-w-lg rounded-md bg-white px-6 py-10 text-[#1f2a44]">
        {result?.success ? <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /> : <AlertTriangle className="mx-auto h-12 w-12 text-amber-600" />}
        <h2 className="mt-5 text-xl font-semibold">{result?.success ? '订购申请已受理' : result?.uncertain ? '订购结果待确认' : '订购未成功'}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{result?.message || '北京移动未返回明确订购结果'}</p>
        <p className="mt-2 text-xs text-zinc-400">{session.maskedPhone}{result?.code ? ` · 业务码 ${result.code}` : ''}</p>
        <V2OrderResponseDetails response={result?.details ?? { code: result?.code, message: result?.message }} />
        <button type="button" onClick={onReset} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#1769ff] px-5 text-sm font-semibold text-white"><RotateCcw className="h-4 w-4" />重新开始</button>
      </div>
    </section>
  )
}
