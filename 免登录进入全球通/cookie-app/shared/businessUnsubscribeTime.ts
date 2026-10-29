export const BUSINESS_UNSUBSCRIBE_TIME_LABELS: Record<string, string> = {
  '0': '下月失效',
  '1': '立即失效',
  '3': '次日失效',
}

export function businessUnsubscribeTimeOptions(business: Record<string, unknown>): string[] {
  if (String(business.busiReturnEffTime ?? '') !== '2') return []
  const options = [...new Set(String(business.effTimeType || '').split('|').filter((value) => BUSINESS_UNSUBSCRIBE_TIME_LABELS[value]))]
  // The NY/BK view uses immediate/next-month choices without effTimeType.
  return options.length ? options : ['1', '0']
}

export function resolveBusinessUnsubscribeTime(business: Record<string, unknown>, selected?: string): string {
  const raw = String(business.busiReturnEffTime ?? '')
  if (raw !== '2') return raw
  const options = businessUnsubscribeTimeOptions(business)
  return selected && options.includes(selected) ? selected : options[0]
}

export function businessUnsubscribeTimeLabel(value: string): string {
  return BUSINESS_UNSUBSCRIBE_TIME_LABELS[value] || '具体失效时间以短信通知为准'
}
