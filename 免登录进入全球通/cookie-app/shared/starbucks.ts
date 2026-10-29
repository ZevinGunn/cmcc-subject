export type StarbucksCouponStatus = 'active' | 'used' | 'expired' | 'unknown'
export type StarbucksCoupon = {
  id: string
  title: string
  status: StarbucksCouponStatus
  expiresAt: number | null
  expiryText: string
  numberMasked: string
  codeAvailable: boolean
  discountDesc: string
}
export type StarbucksAccount = {
  id: string
  phoneMasked: string
  customerMasked: string
  updatedAt: string
  queriedAt?: string
  invalidAt?: string
  coupons: StarbucksCoupon[]
}
export type StarbucksCode = { id: string; title: string; phoneMasked: string; code: string; shortCode: string; expiryText: string }
export type StarbucksState = { accounts: StarbucksAccount[]; configured: boolean; identity: string }
export const starbucksStatusLabels: Record<StarbucksCouponStatus, string> = { active: '可用', used: '已使用', expired: '已过期', unknown: '状态未知' }
export type StarbucksCouponEntry = StarbucksCoupon & { key: string; accountId: string; phoneMasked: string; invalidAt?: string }
export type StarbucksExpiryFilter = 'all' | '7' | '30' | '90' | 'expired' | 'unknown'
export function collectStarbucksCoupons(accounts: StarbucksAccount[], accountId = 'all', now = Date.now()): StarbucksCouponEntry[] {
  return accounts.filter(a => accountId === 'all' || a.id === accountId).flatMap(a => a.coupons.map(c => ({
    ...c, key: `${a.id}:${c.id}`, accountId: a.id, phoneMasked: a.phoneMasked, invalidAt: a.invalidAt,
    status: effectiveCouponStatus(c, now),
  })))
}
export function matchesStarbucksExpiry(coupon: StarbucksCoupon, filter: StarbucksExpiryFilter, from = '', to = '', now = Date.now()): boolean {
  const expiry = coupon.expiresAt
  if (from || to) {
    if (expiry === null) return false
    if (from && expiry < Date.parse(`${from}T00:00:00+08:00`)) return false
    if (to && expiry >= Date.parse(`${to}T00:00:00+08:00`) + 86400000) return false
  }
  if (filter === 'unknown') return expiry === null
  if (filter === 'expired') return expiry !== null && expiry <= now
  if (filter !== 'all') return expiry !== null && expiry > now && expiry <= now + Number(filter) * 86400000
  return true
}
export function effectiveCouponStatus(coupon: StarbucksCoupon, now = Date.now()): StarbucksCouponStatus {
  return coupon.status === 'active' && coupon.expiresAt !== null && coupon.expiresAt <= now ? 'expired' : coupon.status
}
export type StarbucksCopyFields = { phone: boolean; code: boolean; expiry: boolean }
export const DEFAULT_STARBUCKS_COPY_FIELDS: StarbucksCopyFields = { phone: true, code: true, expiry: true }
export function formatStarbucksCodes(codes: StarbucksCode[], fields: StarbucksCopyFields = DEFAULT_STARBUCKS_COPY_FIELDS): string {
  if (!fields.phone && !fields.code && !fields.expiry) return ''
  const groups = new Map<string, StarbucksCode[]>()
  for (const coupon of codes) {
    const key = coupon.title
    const items = groups.get(key)
    if (items) items.push(coupon)
    else groups.set(key, [coupon])
  }
  const sorted = [...groups].sort(([a], [b]) => a.localeCompare(b, 'zh-CN', { numeric: true }))
  return sorted.map(([name, coupons]) => `${name} × ${coupons.length}\n${coupons.map(c => [
    fields.phone ? c.phoneMasked : '',
    fields.code ? c.code : '',
    fields.expiry ? (c.expiryText || '有效期未知') : '',
  ].filter(Boolean).join('｜')).join('\n')}`).join('\n\n')
}
