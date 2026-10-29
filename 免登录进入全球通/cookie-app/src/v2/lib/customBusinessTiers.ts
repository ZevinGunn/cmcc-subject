import type { CocAppBusinessId, PremiumNorm } from './benefitOrderApi'

export type CustomBusinessTier = {
  id: string
  name: string
  price: number
}

const STORAGE_PREFIX = 'cmcc_coc_custom_business_tiers_v1'
const PRODUCT_CODE_PATTERN = /^\d{1,20}$/

function normalizeTier(value: unknown): CustomBusinessTier | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  const id = String(input.id || '').trim()
  const name = String(input.name || '').trim()
  const price = Number(input.price)
  if (!PRODUCT_CODE_PATTERN.test(id) || !name || name.length > 80) return null
  if (!Number.isFinite(price) || price < 0 || price > 100000) return null
  return { id, name, price }
}

function storageKey(businessId: CocAppBusinessId): string {
  return `${STORAGE_PREFIX}:${businessId}`
}

export function loadCustomBusinessTiers(businessId: CocAppBusinessId): CustomBusinessTier[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(businessId)) || '[]')
    if (!Array.isArray(parsed)) return []
    const unique = new Map<string, CustomBusinessTier>()
    parsed.forEach((item) => {
      const tier = normalizeTier(item)
      if (tier) unique.set(tier.id, tier)
    })
    return Array.from(unique.values())
  } catch {
    return []
  }
}

export function saveCustomBusinessTiers(businessId: CocAppBusinessId, tiers: CustomBusinessTier[]): void {
  if (typeof window === 'undefined') return
  const normalized = tiers.map(normalizeTier).filter((item): item is CustomBusinessTier => Boolean(item))
  window.localStorage.setItem(storageKey(businessId), JSON.stringify(normalized))
}

export function upsertCustomBusinessTier(
  tiers: CustomBusinessTier[],
  tier: CustomBusinessTier,
  previousId?: string,
): CustomBusinessTier[] {
  const normalized = normalizeTier(tier)
  if (!normalized) throw new Error('自定义业务档位参数不完整')
  return [...tiers.filter((item) => item.id !== normalized.id && item.id !== previousId), normalized]
}

export function mergeBusinessTiers(defaults: PremiumNorm[], customTiers: CustomBusinessTier[]): PremiumNorm[] {
  const merged = new Map(defaults.map((tier) => [tier.id, tier]))
  customTiers.forEach((tier) => {
    const current = merged.get(tier.id)
    merged.set(tier.id, {
      id: tier.id,
      packageId: tier.id,
      name: tier.name,
      price: tier.price,
      bizIntfCode: current?.bizIntfCode || '',
      productTags: current?.productTags || '',
      candidateIds: [tier.id],
      variantCount: 1,
    })
  })
  return Array.from(merged.values())
}

export const customBusinessTierTest = {
  normalizeTier,
}
