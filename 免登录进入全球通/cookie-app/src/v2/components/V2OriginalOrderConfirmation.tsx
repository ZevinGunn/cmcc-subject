import { Loader2, Settings2 } from 'lucide-react'
import { useMemo } from 'react'

export function sanitizeOrderDescriptionHtml(description: string): string {
  const source = String(description || '')
  if (typeof DOMParser === 'undefined') {
    return source.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character] || character)
  }

  let decoded = source
    .replace(/\\u003c/gi, '<')
    .replace(/\\u003e/gi, '>')
    .replace(/\\u0026/gi, '&')
    .replace(/\\n/g, '\n')
  for (let pass = 0; pass < 2 && !/<\/?[a-z][^>]*>/i.test(decoded); pass += 1) {
    const next = new DOMParser().parseFromString(decoded, 'text/html').documentElement.textContent || ''
    if (!next || next === decoded) break
    decoded = next
  }

  const documentNode = new DOMParser().parseFromString(decoded, 'text/html')
  const allowedTags = new Set(['DIV', 'P', 'SPAN', 'STRONG', 'B', 'BR', 'UL', 'OL', 'LI', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'])
  const blockedTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'FORM', 'INPUT', 'BUTTON'])
  for (const element of Array.from(documentNode.body.querySelectorAll('*')).reverse()) {
    if (blockedTags.has(element.tagName)) {
      element.remove()
      continue
    }
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      continue
    }
    for (const attribute of Array.from(element.attributes)) element.removeAttribute(attribute.name)
  }
  return documentNode.body.innerHTML
}

export default function V2OriginalOrderConfirmation({
  maskedPhone,
  productName,
  description,
  orderCode,
  orderCooldown,
  busy,
  allowEightDigits = false,
  headerImage,
  confirmImage,
  onOrderCodeChange,
  onSendOrderSms,
  onConfirmOrder,
  onOpenParams,
}: {
  maskedPhone: string
  productName: string
  description: string
  orderCode: string
  orderCooldown: number
  busy: string
  allowEightDigits?: boolean
  headerImage: string
  confirmImage: string
  onOrderCodeChange: (value: string) => void
  onSendOrderSms: () => void
  onConfirmOrder: () => void
  onOpenParams: () => void
}) {
  const codeReady = /^\d{6}$/.test(orderCode) || (allowEightDigits && /^\d{8}$/.test(orderCode))
  const safeDescription = useMemo(() => sanitizeOrderDescriptionHtml(description), [description])

  return (
    <section className="min-h-screen w-full bg-[#edf4ff] font-['Microsoft_YaHei',sans-serif] text-[#2d3973]">
      <div className="relative mx-auto min-h-screen w-full max-w-[750px] bg-[#edf4ff] text-center">
        <img src={headerImage} alt="" className="mx-auto block h-auto w-full" />
        <div className="relative px-12 py-[15px] text-[25px] font-bold leading-8 text-[#0662fb]">
          订购业务确认
          <button
            type="button"
            title="查看验证码与订购参数"
            aria-label="查看验证码与订购参数"
            onClick={onOpenParams}
            disabled={Boolean(busy)}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#3353e1] hover:bg-white/60 disabled:opacity-50">
            <Settings2 className="h-5 w-5" />
          </button>
        </div>

        <p className="mx-auto w-[93.333%] px-[15px] pb-[10px] text-left text-[16px] font-bold leading-[1.65]">
          您正在为<span className="text-[#0050f5]">{maskedPhone}</span>办理<span className="text-[#0050f5]">{productName}</span>
        </p>

        <div className="flex justify-center">
          <div
            className="h-[min(500px,66.666vw)] min-h-[260px] w-[93.333%] overflow-y-auto whitespace-pre-wrap bg-[#d8e7ff] px-[20px] py-[14px] text-justify text-[16px] font-bold leading-[1.65] text-[#2d3973] [overflow-wrap:anywhere] [&_div]:mb-2 [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#91afe8] [&_td]:p-2 [&_th]:border [&_th]:border-[#91afe8] [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: safeDescription }}
          />
        </div>

        <div className="bg-[#edf4ff] px-5 py-[10px]">
          <div className="mx-auto w-[80%] border-t border-dashed border-[#6f8df8]" />
        </div>

        <div className="flex justify-center bg-[#edf4ff] pt-[5px]">
          <div className="flex h-[54px] w-[77.333%] min-w-[280px] max-w-[580px] items-center justify-between rounded-[5px] bg-white px-[5px] text-[16px]">
            <div className="flex h-[34px] min-w-0 flex-1 items-center border-r border-[#cdcdcd]">
              <input
                value={orderCode}
                onChange={(event) => onOrderCodeChange(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={allowEightDigits ? 8 : 6}
                aria-label="订购验证码"
                placeholder="请输入验证码"
                className="h-full w-full border-0 bg-transparent px-[10px] text-[16px] text-[#333] outline-none placeholder:text-[#888]"
              />
            </div>
            <button
              type="button"
              disabled={Boolean(busy) || orderCooldown > 0}
              onClick={onSendOrderSms}
              className="h-[34px] w-[38%] shrink-0 whitespace-nowrap text-center text-[15px] text-[#3353e1] disabled:opacity-50">
              {busy === 'order-sms' ? '发送中' : orderCooldown ? `${orderCooldown}s` : '获取验证码'}
            </button>
          </div>
        </div>

        <div className="bg-[#edf4ff] pb-[15px] pt-[15px]">
          <button
            type="button"
            onClick={onConfirmOrder}
            disabled={Boolean(busy) || !codeReady}
            aria-label="确认订购"
            className="relative mx-auto block w-[84.267%] max-w-[632px] disabled:cursor-not-allowed disabled:opacity-60">
            <img src={confirmImage} alt="确认订购" className="h-auto w-full" />
            {busy === 'confirm' ? <Loader2 className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" /> : null}
          </button>
        </div>
      </div>
    </section>
  )
}
