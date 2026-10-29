import { AlertTriangle, Check, CheckCircle2, Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { BmccActivityOrderSession } from '../lib/bmccActivityOrderApi'
import V2OriginalOrderConfirmation from './V2OriginalOrderConfirmation'
import V2OrderResponseDetails from './V2OrderResponseDetails'

type Props = {
  session: BmccActivityOrderSession
  activityLoadFailed: boolean
  renewal: boolean
  acceptedProtocol: boolean
  orderCode: string
  orderCooldown: number
  busy: string
  onReloadActivity: () => void
  onRenewalChange: (checked: boolean) => void
  onAcceptedProtocolChange: (checked: boolean) => void
  onSubmit: () => void
  onOrderCodeChange: (value: string) => void
  onSendOrderSms: () => void
  onConfirmOrder: () => void
  onOpenParams: () => void
  onReset: () => void
  standalone?: boolean
}

function GoldCheckbox({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={cn(
      'flex min-h-9 cursor-pointer select-none items-start gap-2 py-1 text-[14px] leading-[1.5] text-[#fbdeb4] sm:min-h-11 sm:text-[20px] min-[800px]:text-[25px]',
      disabled && 'cursor-not-allowed opacity-60',
    )}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'mt-[0.12em] grid h-[1.15em] w-[1.15em] shrink-0 place-items-center rounded-[3px] border-2 border-[#d8c3a7] bg-white text-white transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6ea8ff] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#1f1f1f]',
          checked && 'border-[#1769e0] bg-[#1769e0]',
        )}>
        <Check className={cn('h-[0.9em] w-[0.9em] stroke-[3]', checked ? 'opacity-100' : 'opacity-0')} />
      </span>
      <span>{label}</span>
    </label>
  )
}

function ContractContent() {
  return (
    <section className="mx-[19px] rounded-[9px] bg-[#3e3a38] pb-6 pt-9 text-[#fbdeb4] sm:mx-[30px] sm:rounded-[14px] sm:pb-10 sm:pt-12 min-[800px]:mx-[46px] min-[800px]:rounded-[22px] min-[800px]:pb-[50px] min-[800px]:pt-[75px]">
      <div className="mb-4 flex justify-center sm:mb-7">
        <img src="/ai-bean-contract/title.png" alt="协议内容" className="h-auto w-[163px] max-w-full sm:w-[272px] min-[800px]:w-[340px]" />
      </div>
      <div className="space-y-2 px-[19px] text-[14px] leading-[1.5] sm:px-[28px] sm:text-[20px] min-[800px]:px-[40px] min-[800px]:text-[30px]">
        <p className="indent-8">尊敬的客户您好，开通“AI豆倍享合约”服务，仅需承诺持续36个月使用移动网络，自申请次月起，您即可享受如下权益：</p>
        <ol className="space-y-1">
          <li>1. 合约期内，根据您每月消费产生的AI豆，可获得AI豆倍享回报。</li>
          <li>
            <p>2. 倍享回馈系数如下：</p>
            <p className="pl-2">（1）全球通普卡及以上客户</p>
            <div className="my-[13px] sm:my-[22px] min-[800px]:my-[28px]">
              <table className="mx-[6px] w-[95%] table-fixed border-collapse text-center leading-[1.5]">
                <tbody>
                  <tr>{['等级', '普卡、银卡', '金卡', '白金卡', '钻石卡'].map((value, index) => <td key={`${index}:${value}`} className="break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">{value}</td>)}</tr>
                  <tr>{['回馈系数', '×3', '×4', '×6', '×6'].map((value, index) => <td key={`${index}:${value}`} className="break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">{value}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <p className="pl-2">（2）非全球通普卡及以上客户</p>
            <div className="my-[13px] sm:my-[22px] min-[800px]:my-[28px]">
              <table className="mx-[6px] w-[95%] table-fixed border-collapse text-center leading-[1.5]">
                <tbody>
                  <tr>
                    <td className="w-1/5 break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">网龄</td>
                    <td className="w-1/5 break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">1-3个月</td>
                    <td rowSpan={2} className="w-2/5 break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">网龄每增长3个月<br />系数增长0.1倍</td>
                    <td className="w-1/5 break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">60个月以上</td>
                  </tr>
                  <tr>
                    <td className="break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">回馈系数</td>
                    <td className="break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">×1</td>
                    <td className="break-words border border-[#ffdaa6] px-1 py-3 sm:py-5 min-[800px]:py-[25px]">×3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
          <li>3. AI豆自下发之月起36个月内有效，过期自动失效。</li>
          <li><strong className="underline">4. 合约期内需持续使用中国移动网络。</strong></li>
          <li><strong className="underline">5. 合约期内如您办理转户、提前解约、离网（含携号转网）业务，需前往营业厅办理“提前取消合约”服务，同时需支付提前解约违约金，违约金为合约期内AI豆倍享增发部分的AI豆价值。</strong></li>
          <li>6. 本合约当月办理成功，次月生效。</li>
          <li>7. 本次开通的AI豆倍享合约到期后,可按上述规则自动续约一次。</li>
        </ol>
      </div>
    </section>
  )
}

export function aiBeanConfirmationTerms(renewal: boolean): string[] {
  return [
    renewal
      ? '1.承诺持续使用中国移动网络36个月，将根据您的全球通身份或网龄获得最高6倍AI豆回报。'
      : '1.承诺持续使用中国移动网络36个月，将根据您的全球通身份或网龄获得最高6倍AI豆回报，合约到期后自动失效。',
    '2.AI豆自下发之月起36个月内有效,过期自动失效。',
    '3.如解约需前往营业厅办理，同时缴纳违约金，违约金为合约期内AI豆倍享增发部分的AI豆价值。',
    ...(renewal ? ['4.本次开通的AI豆倍享合约到期后,可按上述规则自动续约一次。'] : []),
  ]
}

function ProtocolReminderDialog({
  countdown,
  onClose,
}: {
  countdown: number
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="ai-protocol-reminder-title">
      <div
        className="relative flex min-h-[230px] w-[90%] max-w-[920px] flex-col justify-center overflow-hidden bg-[url('/ai-bean-contract/tip-bg1.png')] bg-[length:100%_100%] px-[9%] py-8 text-center text-[#663403] sm:min-h-[320px] sm:py-12 min-[800px]:min-h-[500px]">
        <h2 id="ai-protocol-reminder-title" data-dialog-drag-handle className="cursor-move select-none text-[22px] leading-[1.45] sm:text-[34px] min-[800px]:text-[50px]">
          请您阅读并同意<br />
          《积分倍享合约服务协议》<br />
          内容
        </h2>
        <div className="mt-7 flex items-center justify-center gap-[7%] sm:mt-10 min-[800px]:mt-14">
          <button type="button" onClick={onClose} className="h-10 w-[44%] rounded-full border-2 border-[#6b6b6b] bg-[#f6cda6] text-[18px] sm:h-14 sm:text-[28px] min-[800px]:h-[66px] min-[800px]:text-[38px]">
            确定{countdown > 0 ? `(${countdown})` : ''}
          </button>
          <button type="button" onClick={onClose} className="h-10 w-[36%] rounded-full border-2 border-[#6b6b6b] bg-[#f4f4f4] text-[18px] sm:h-14 sm:text-[28px] min-[800px]:h-[66px] min-[800px]:text-[38px]">取消</button>
        </div>
      </div>
    </div>
  )
}

function OrderTermsDialog({
  renewal,
  accepted,
  attention,
  busy,
  onAcceptedChange,
  onConfirm,
  onClose,
}: {
  renewal: boolean
  accepted: boolean
  attention: boolean
  busy: boolean
  onAcceptedChange: (checked: boolean) => void
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 px-0 py-5" role="dialog" aria-modal="true" aria-labelledby="ai-order-terms-title">
      <div className="relative flex max-h-[90vh] min-h-[440px] w-[90%] max-w-[920px] flex-col overflow-y-auto bg-[url('/ai-bean-contract/tip-bg2.png')] bg-[length:100%_100%] px-[9%] py-[7%] text-[#663403] sm:min-h-[620px] min-[800px]:min-h-[748px]">
        <h2 id="ai-order-terms-title" data-dialog-drag-handle className="cursor-move select-none text-center text-[20px] font-bold sm:text-[30px] min-[800px]:text-[42px]">请您仔细阅读</h2>
        <div className="mt-3 text-[14px] leading-[1.5] sm:text-[21px] min-[800px]:text-[30px]">
          <p>您正在办理：</p>
          <p>AI豆倍享合约</p>
          {aiBeanConfirmationTerms(renewal).map((term) => <p key={term}>{term}</p>)}
        </div>
        <label className={cn(
          'mx-auto mt-4 flex cursor-pointer items-center justify-center gap-1.5 text-[14px] leading-[1.5] sm:text-[20px] min-[800px]:text-[28px]',
          attention && 'animate-pulse font-semibold',
        )}>
          <input
            type="checkbox"
            checked={accepted}
            disabled={busy}
            onChange={(event) => onAcceptedChange(event.target.checked)}
            className="h-[1em] w-[1em] shrink-0 accent-[#1769e0] disabled:opacity-50"
          />
          <span>我已阅读并同意以上条款</span>
        </label>
        <div className="mt-5 flex items-center justify-center gap-[8%]">
          <button type="button" disabled={busy} onClick={onConfirm} className="h-10 w-[42%] rounded-full border-2 border-[#6b6b6b] bg-[#f6cda6] text-[18px] disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-[28px] min-[800px]:h-[66px] min-[800px]:text-[38px]">
            {busy ? '正在提交' : '确定'}
          </button>
          <button type="button" disabled={busy} onClick={onClose} className="h-10 w-[36%] rounded-full border-2 border-[#6b6b6b] bg-[#f4f4f4] text-[18px] disabled:opacity-60 sm:h-14 sm:text-[28px] min-[800px]:h-[66px] min-[800px]:text-[38px]">取消</button>
        </div>
      </div>
    </div>
  )
}

function fallbackOrderDescription(renewal: boolean): string {
  return [
    '1、积分倍享合约当月申请，次月生效。',
    '2、承诺持续使用中国移动网络36个月，将根据您的全球通身份或网龄获得最高6倍积分回报，合约到期后自动失效。',
    '3、积分自下发之月起36个月内有效，过期自动失效。',
    '4、如解约需前往营业厅办理，同时缴纳违约金，违约金为合约期内积分倍享增发部分的积分价值。',
    renewal ? '5、如您已选择合约自动续订一次，将在合约到期当月通过中国移动互联网为您订购新的积分倍享合约。' : '',
  ].filter(Boolean).join('')
}

function OrderConfirmation({
  session,
  renewal,
  orderCode,
  orderCooldown,
  busy,
  onOrderCodeChange,
  onSendOrderSms,
  onConfirmOrder,
  onOpenParams,
}: Pick<Props,
  | 'session'
  | 'renewal'
  | 'orderCode'
  | 'orderCooldown'
  | 'busy'
  | 'onOrderCodeChange'
  | 'onSendOrderSms'
  | 'onConfirmOrder'
  | 'onOpenParams'
>) {
  const productName = session.orderSms?.productItemName || session.config?.productShowName || '积分倍享合约'
  const description = session.orderSms?.productItemDesc?.trim() || fallbackOrderDescription(renewal)
  return (
    <V2OriginalOrderConfirmation
      maskedPhone={session.maskedPhone}
      productName={productName}
      description={description}
      orderCode={orderCode}
      orderCooldown={orderCooldown}
      busy={busy}
      allowEightDigits
      headerImage="/ai-bean-contract/order-header.png"
      confirmImage="/ai-bean-contract/order-confirm-button.png"
      onOrderCodeChange={onOrderCodeChange}
      onSendOrderSms={onSendOrderSms}
      onConfirmOrder={onConfirmOrder}
      onOpenParams={onOpenParams}
    />
  )
}

function ContractShell({ children, standalone = false }: { children: React.ReactNode; standalone?: boolean }) {
  return (
    <section className={cn('overflow-hidden bg-[#1f1f1f] text-[#fbdeb4]', standalone ? 'min-h-screen w-full' : 'rounded-md shadow-sm')}>
      {children}
    </section>
  )
}

export default function V2AiBeanContractExperience({
  session,
  activityLoadFailed,
  renewal,
  acceptedProtocol,
  orderCode,
  orderCooldown,
  busy,
  onReloadActivity,
  onRenewalChange,
  onAcceptedProtocolChange,
  onSubmit,
  onOrderCodeChange,
  onSendOrderSms,
  onConfirmOrder,
  onOpenParams,
  onReset,
  standalone = false,
}: Props) {
  const [dialog, setDialog] = useState<'protocol' | 'terms' | null>(null)
  const [countdown, setCountdown] = useState(10)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [termsAttention, setTermsAttention] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState(acceptedProtocol)
  const [selectedRenewal, setSelectedRenewal] = useState(renewal)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const protocolPropRef = useRef(acceptedProtocol)
  const renewalPropRef = useRef(renewal)

  useEffect(() => {
    if (protocolPropRef.current === acceptedProtocol) return
    protocolPropRef.current = acceptedProtocol
    setSelectedProtocol(acceptedProtocol)
  }, [acceptedProtocol])

  useEffect(() => {
    if (renewalPropRef.current === renewal) return
    renewalPropRef.current = renewal
    setSelectedRenewal(renewal)
  }, [renewal])

  useEffect(() => {
    if (activityLoadFailed) setSelectedRenewal(renewal)
  }, [activityLoadFailed, renewal])

  useEffect(() => {
    if (dialog !== 'protocol') return undefined
    setCountdown(10)
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          setDialog(null)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [dialog])

  useEffect(() => {
    if (!termsAttention) return undefined
    const timer = window.setTimeout(() => setTermsAttention(false), 650)
    return () => window.clearTimeout(timer)
  }, [termsAttention])

  useEffect(() => {
    if (!dialog) return undefined
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) setDialog(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [busy, dialog])

  const closeDialog = () => {
    setDialog(null)
    window.requestAnimationFrame(() => submitButtonRef.current?.focus())
  }

  const beginConfirmation = () => {
    if (!selectedProtocol) {
      setDialog('protocol')
      return
    }
    setAcceptedTerms(false)
    setTermsAttention(false)
    setDialog('terms')
  }

  const confirmOrder = () => {
    if (!acceptedTerms) {
      setTermsAttention(true)
      return
    }
    setDialog(null)
    onSubmit()
  }

  if (session.stage === 'logged_in') {
    return (
      <ContractShell standalone={standalone}>
        <div className={cn('grid place-items-center px-6 py-12 text-center', standalone ? 'min-h-screen' : 'min-h-[360px]')}>
          <div>
            {activityLoadFailed ? <AlertTriangle className="mx-auto h-8 w-8 text-[#e6ad61]" /> : <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#e6ad61]" />}
            <h2 className="mt-4 text-base font-semibold">{activityLoadFailed ? '业务信息加载失败' : '正在进入AI豆倍享合约'}</h2>
            <p className="mt-2 text-sm text-[#c8aa83]">当前号码：{session.maskedPhone}</p>
            {activityLoadFailed ? (
              <button type="button" disabled={Boolean(busy)} onClick={onReloadActivity} className="mt-5 h-10 rounded-full border border-[#f6cda6] px-6 text-sm font-semibold text-[#fbdeb4] hover:bg-white/5 disabled:opacity-50">重新加载</button>
            ) : null}
          </div>
        </div>
      </ContractShell>
    )
  }

  if (session.stage === 'activity_ready') {
    return (
      <ContractShell standalone={standalone}>
        <div className="border-b border-white/10 px-4 py-3 text-xs sm:px-6">
          <strong className="font-semibold text-[#fbdeb4]">{session.maskedPhone}</strong>
        </div>
        <div className="flex h-[138px] items-start justify-center overflow-visible sm:h-[230px] min-[800px]:h-[288px]">
          <img src="/ai-bean-contract/logo.png" alt="AI豆倍享合约" className="h-[276px] max-w-full object-contain sm:h-[460px] min-[800px]:h-[575px]" />
        </div>
        <ContractContent />
        <div className="mx-auto w-[80%] py-3 sm:py-5 min-[800px]:py-[25px]">
          <div className="space-y-0.5">
            <GoldCheckbox
              checked={selectedProtocol}
              disabled={Boolean(busy)}
              label="我已阅读并同意《AI豆倍享合约服务协议》内容"
              onChange={(checked) => {
                setSelectedProtocol(checked)
                onAcceptedProtocolChange(checked)
              }}
            />
            <GoldCheckbox
              checked={selectedRenewal}
              disabled={Boolean(busy)}
              label="合约到期后自动续约"
              onChange={(checked) => {
                setSelectedRenewal(checked)
                onRenewalChange(checked)
              }}
            />
          </div>
          <div className="my-2 text-center sm:my-3 min-[800px]:my-[13px]">
            <button
              ref={submitButtonRef}
              type="button"
              disabled={Boolean(busy)}
              onClick={beginConfirmation}
              className="inline-flex h-[49px] w-[80%] items-center justify-center rounded-full border-2 border-[#6b6b6b] bg-[#f6cda6] px-5 text-[21px] text-[#663403] hover:bg-[#f9d9b9] disabled:cursor-not-allowed disabled:bg-[#bda184] sm:h-[70px] sm:text-[30px] min-[800px]:h-[88px] min-[800px]:text-[38px]">
              {busy === 'submit' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {busy === 'submit' ? '正在提交' : '同意开通合约'}
            </button>
          </div>
          <p className="text-[14px] leading-[1.5] text-[#d6b78e] sm:text-[20px] min-[800px]:text-[25px]">温馨提示：如您主动勾选合约到期自动续约选项，本次开通的AI豆倍享合约到期后将按上述规则自动续约一次，到期自动取消。</p>
        </div>
        {dialog === 'protocol' ? <ProtocolReminderDialog countdown={countdown} onClose={closeDialog} /> : null}
        {dialog === 'terms' ? (
          <OrderTermsDialog
            renewal={selectedRenewal}
            accepted={acceptedTerms}
            attention={termsAttention}
            busy={Boolean(busy)}
            onAcceptedChange={(checked) => {
              setAcceptedTerms(checked)
              if (checked) setTermsAttention(false)
            }}
            onConfirm={confirmOrder}
            onClose={closeDialog}
          />
        ) : null}
      </ContractShell>
    )
  }

  if (session.stage === 'order_sms_required') {
    return (
      <OrderConfirmation
        session={session}
        renewal={renewal}
        orderCode={orderCode}
        orderCooldown={orderCooldown}
        busy={busy}
        onOrderCodeChange={onOrderCodeChange}
        onSendOrderSms={onSendOrderSms}
        onConfirmOrder={onConfirmOrder}
        onOpenParams={onOpenParams}
      />
    )
  }

  const result = session.lastResult
  return (
    <ContractShell standalone={standalone}>
      <div className={cn('grid place-items-center px-5 py-10 text-center', standalone ? 'min-h-screen' : 'min-h-[420px]')}>
        <div className="max-w-xl">
          {result?.success ? <CheckCircle2 className="mx-auto h-12 w-12 text-[#e6ad61]" /> : <AlertTriangle className="mx-auto h-12 w-12 text-[#e6ad61]" />}
          <h2 className="mt-5 text-xl font-semibold">{result?.success ? '订购申请已受理' : result?.uncertain ? '订购结果待确认' : '订购未成功'}</h2>
          <p className="mt-3 text-sm leading-7 text-[#d6b78e]">{result?.message || '北京移动未返回明确订购结果'}</p>
          <p className="mt-2 text-xs text-[#9e8a70]">{session.maskedPhone}{result?.code ? ` · 业务码 ${result.code}` : ''}</p>
          <div className="mt-4 rounded-md bg-white p-4 text-zinc-900"><V2OrderResponseDetails response={result?.details ?? { code: result?.code, message: result?.message }} /></div>
          <button type="button" onClick={onReset} className={cn('mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-[#f6cda6] px-6 text-sm font-semibold hover:bg-white/5')}><RotateCcw className="h-4 w-4" />重新开始</button>
        </div>
      </div>
    </ContractShell>
  )
}
