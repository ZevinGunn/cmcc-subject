import BrandLogo from '@/components/BrandLogo'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PhoneInput from '@/components/PhoneInput'
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  CalendarDays,
  CircleHelp,
  Loader2,
  LogIn,
  MessageSquareText,
  Wifi,
  Search,
  Smartphone,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BusinessSearchDialog, { HighlightText, type BusinessSearchItem } from '@/components/BusinessSearchDialog'
import { extractUpstreamHtmlError, formatUpstreamErrorMessage } from '../../shared/upstreamErrorMessage'
import { businessUnsubscribeTimeLabel, businessUnsubscribeTimeOptions, resolveBusinessUnsubscribeTime } from '../../shared/businessUnsubscribeTime'

type ApiOk<T> = { ok: true; data: T; message?: string; requestId?: string }
type ApiErr = { ok: false; message: string; errorCode?: string; requestId?: string }
type ApiResp<T> = ApiOk<T> | ApiErr

type BusinessSession = {
  id: string
  source: 'account' | 'manual'
  accountId?: string
  phone?: string
  cookie?: string
  createdAt?: number
  updatedAt?: number
}

type BusinessItem = Record<string, unknown> & {
  businessName?: string
  productName?: string
  productCode?: string
  planId?: string
  offerId?: string
  bizCode?: string
  codeType?: string
  sPCode?: string
  busiReturnEffTime?: string | number
  effectiveTimeType?: string | number
  productType?: string
}

type ViewMode = 'mobile' | 'broadband'

type BroadbandAccount = Record<string, unknown> & {
  id: string
  broadbandNo: string
  address?: string
  addressMasked?: string
  displayName?: string
}

type CachedState = {
  session?: BusinessSession | null
  accounts?: SavedBusinessAccount[]
  phone?: string
  sx?: string
  planType?: string
  busiType?: string
  viewMode?: ViewMode
  selectedMonth?: string
  userInfo?: unknown
  businessResult?: unknown
  broadbandPlans?: BroadbandAccount[]
  selectedBroadbandId?: string
  broadbandBusinessResult?: unknown
  businessCache?: Record<string, unknown>
  broadbandPlansCache?: Record<string, BroadbandAccount[]>
  broadbandBusinessCache?: Record<string, unknown>
}

type UnsubscribeResult = {
  ok: boolean
  message: string
  errorCode?: string
  businessName?: string
  effectiveTimeType?: string
}

type UnsubscribeFeedbackState = {
  selectedReasons: string[]
  otherReason: string
}

type CurrentUser = {
  id: string
  username: string
  permissions?: {
    businessQuery?: boolean
    businessIdOverride?: boolean
  }
}

type AuthAccountSummary = {
  id: string
  phone?: string
  phoneMasked?: string
  displayPhone?: string
}

type BusinessIdOverrideDraft = {
  planId: string
  productCode: string
  offerId: string
}

type SavedBusinessAccount = {
  session: BusinessSession
  phone: string
  label: string
  levelName?: string
  expiresAt: number
  selectedMonth?: string
  busiType?: string
  viewMode?: ViewMode
  userInfo?: unknown
  businessResult?: unknown
  broadbandPlans?: BroadbandAccount[]
  selectedBroadbandId?: string
  broadbandBusinessResult?: unknown
}

type UnsubscribeDraft = {
  smsSent: boolean
  cooldownUntil: number
  code: string
  withdrawFlowKey?: string
  effectiveTimeType?: string
}

type MyPackageData = {
  plan?: unknown
  contract?: unknown
  contractError?: {
    message?: string
    errorCode?: string
  }
  raw?: unknown
}

type PackageContractItem = BusinessItem & {
  __packageContract?: boolean
}

type AccountOverviewData = {
  userInfo?: unknown
  balance?: unknown
  userError?: { message?: string; errorCode?: string }
  balanceError?: { message?: string; errorCode?: string }
  raw?: unknown
}

const CACHE_KEY = 'cookie-app:business-query:v2'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const DEFAULT_BUSI_TYPE = '01'
const DEFAULT_VIEW_MODE: ViewMode = 'mobile'

const CATEGORY_TABS = [
  { label: '我的套餐', value: '01' },
  { label: '增值业务', value: '02' },
  { label: '基础功能', value: '03' },
  { label: '活动', value: '04' },
]

const UNSUBSCRIBE_REASONS = [
  '不需要这个业务了',
  '到期不续订了',
  '不知道这是什么业务',
  '不记得订过这个业务',
  '感觉不太好用',
]

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { ...init, credentials: 'same-origin' })
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResp<T>> {
  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  try {
    return JSON.parse(text) as ApiResp<T>
  } catch {
    const htmlError = extractUpstreamHtmlError(text, res.status)
    return {
      ok: false,
      message: htmlError || `接口返回格式异常（HTTP ${res.status}）`,
      errorCode: htmlError ? String(res.status) : 'INVALID_JSON',
    }
  }
}

function text(value: unknown, fallback = ''): string {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

function money(value: unknown): string {
  const raw = text(value)
  if (!raw) return '--'
  return /^-?\d+(\.\d+)?$/.test(raw) ? `${raw}元` : raw
}

function maskPhone(phone?: string): string {
  const raw = text(phone)
  if (/^\d{11}$/.test(raw)) return raw.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  return raw || '未登录'
}

function readPath(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = text(obj[key])
    if (value) return value
  }
  return ''
}

function readDeepString(value: unknown, keys: string[]): string {
  const seen = new Set<unknown>()
  const walk = (node: unknown): string => {
    if (!node || seen.has(node) || typeof node !== 'object') return ''
    seen.add(node)
    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item)
        if (found) return found
      }
      return ''
    }
    const obj = node as Record<string, unknown>
    for (const key of keys) {
      const value = text(obj[key])
      if (value) return value
    }
    for (const child of Object.values(obj)) {
      const found = walk(child)
      if (found) return found
    }
    return ''
  }
  return walk(value)
}

function businessName(item: BusinessItem): string {
  return readPath(item, ['businessName', 'productName', 'busiName', 'productTitle', 'offerName']) || '未命名业务'
}

function defaultBusinessIdOverride(item: BusinessItem | null): BusinessIdOverrideDraft {
  if (!item) return { planId: '', productCode: '', offerId: '' }
  return {
    planId: readPath(item, ['planId', 'planCode', 'mainPlanId', 'mainPlanCode', 'packagePlanId', 'packagePlanCode', 'contId']),
    productCode: readPath(item, ['productCode', 'productcode', 'product_code', 'productId', 'productID', 'prodCode', 'prodId']),
    offerId: readPath(item, ['offerId', 'offerCode', 'bizCode', 'busiCode', 'businessCode', 'ywCode']),
  }
}

function compactBusinessIdOverride(draft: BusinessIdOverrideDraft): Partial<BusinessIdOverrideDraft> | undefined {
  const next = {
    planId: draft.planId.trim(),
    productCode: draft.productCode.trim(),
    offerId: draft.offerId.trim(),
  }
  return next.planId || next.productCode || next.offerId ? next : undefined
}

function packagePlanName(data: MyPackageData | null): string {
  const fromPlan = readDeepString(data?.plan, [
    'packageName',
    'planName',
    'curPlanName',
    'mainPlanName',
    'mainPackageName',
    'prodName',
    'productName',
    'offerName',
    'name',
    'title',
  ])
  return fromPlan || '我的套餐'
}

function packagePlanDescriptions(data: MyPackageData | null): string[] {
  const direct = readDeepString(data?.plan, [
    'packageDesc',
    'planDesc',
    'busiInfomsg',
    'titleValue',
    'mainPlanDesc',
    'prodDesc',
    'productDesc',
    'description',
    'desc',
    'remark',
    'memo',
  ])
  const name = packagePlanName(data)
  return Array.from(new Set([direct, name].filter(Boolean)))
}

function productPlanningId(item: BusinessItem): string {
  return readPath(item, ['productCode', 'productcode', 'product_code', 'productId', 'productID'])
}

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn('h-4 rounded-full bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 animate-pulse', className)} />
}

function BusinessQuerySkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1].map((item) => (
        <article key={item} className="rounded-3xl bg-white px-5 py-6 shadow-[0_8px_28px_rgba(30,50,80,0.06)]">
          <div className="space-y-5">
            <SkeletonBar className="h-8 w-[66%] max-w-[400px]" />
            <SkeletonBar className="h-5 w-[54%] max-w-[320px]" />
            <SkeletonBar className="h-5 w-full" />
            <SkeletonBar className="h-5 w-[67%] max-w-[400px]" />
          </div>
          <div className="mt-9 flex justify-end gap-4">
            <SkeletonBar className="h-9 w-[22%] min-w-[88px]" />
            <SkeletonBar className="h-9 w-[22%] min-w-[88px]" />
          </div>
        </article>
      ))}
    </div>
  )
}

function findFirstString(value: unknown, keys: string[]): string {
  const seen = new Set<unknown>()
  const walk = (node: unknown): string => {
    if (!node || seen.has(node) || typeof node !== 'object') return ''
    seen.add(node)
    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item)
        if (found) return found
      }
      return ''
    }
    const obj = node as Record<string, unknown>
    for (const key of keys) {
      const value = text(obj[key])
      if (value) return value
    }
    for (const child of Object.values(obj)) {
      const found = walk(child)
      if (found) return found
    }
    return ''
  }
  return walk(value)
}

function userLevelName(userInfo: unknown): string {
  return (
    findFirstString(userInfo, [
      'brandLevelName',
      'levelName',
      'custLevelName',
      'userLevelName',
      'globalLevelName',
      'memberLevelName',
      'vipLevelName',
      'brandName',
    ]) || '全球通信息'
  )
}

function userInfoObject(value: unknown): Record<string, unknown> {
  const direct = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  if (direct.userInfo && typeof direct.userInfo === 'object') return direct.userInfo as Record<string, unknown>
  const nested = direct.rspBody
  if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).userInfo) {
    return (nested as Record<string, unknown>).userInfo as Record<string, unknown>
  }
  return direct
}

function balanceInfo(value: unknown): Record<string, unknown> {
  const root = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const histories =
    (Array.isArray(root.accoutQryInfoHis) && root.accoutQryInfoHis) ||
    (root.rspBody &&
    typeof root.rspBody === 'object' &&
    Array.isArray((root.rspBody as Record<string, unknown>).accoutQryInfoHis)
      ? ((root.rspBody as Record<string, unknown>).accoutQryInfoHis as unknown[])
      : [])
  return histories[0] && typeof histories[0] === 'object' ? (histories[0] as Record<string, unknown>) : root
}

function balanceAccounts(value: unknown): Record<string, unknown>[] {
  const info = balanceInfo(value)
  return Array.isArray(info.accoutQryInfo)
    ? info.accoutQryInfo.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    : []
}

function keyValueRows(rows: Array<[string, unknown]>): Array<[string, string]> {
  return rows
    .map(([label, value]): [string, string] => [label, text(value)])
    .filter(([, value]) => Boolean(value))
}

function explicitLevelName(value: unknown): string {
  const found = userLevelName(value)
  return found === '全球通信息' ? '' : found
}

function firstDeepText(value: unknown, keys: string[]): string {
  const seen = new Set<unknown>()
  const walk = (node: unknown): string => {
    if (!node || seen.has(node) || typeof node !== 'object') return ''
    seen.add(node)
    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item)
        if (found) return found
      }
      return ''
    }
    const obj = node as Record<string, unknown>
    for (const key of keys) {
      const value = text(obj[key])
      if (value) return value
    }
    for (const child of Object.values(obj)) {
      const found = walk(child)
      if (found) return found
    }
    return ''
  }
  return walk(value)
}

function broadbandNo(item?: BroadbandAccount | null): string {
  if (!item) return ''
  return (
    item.broadbandNo ||
    firstDeepText(item, ['busiID', 'broadbandNo', 'broadbandNum', 'broadBandNum', 'bandNum', 'kdNum', 'account', 'acctNo', 'userNo']) ||
    ''
  )
}

function broadbandAddress(item?: BroadbandAccount | null): string {
  if (!item) return ''
  return item.address || firstDeepText(item, ['busiValue', 'address', 'installAddr', 'installAddress', 'addr', 'userAddr']) || ''
}

function broadbandMaskedAddress(item?: BroadbandAccount | null): string {
  if (!item) return ''
  if (item.addressMasked) return item.addressMasked
  const raw = broadbandAddress(item)
  if (!raw) return '********************'
  const suffix = raw.match(/(\d+\s*号?)$/)?.[1]?.replace(/\s+/g, '') || raw.slice(-1)
  return `${'*'.repeat(Math.max(18, Math.min(38, raw.length)))}${suffix}`
}

function normalizeBroadbandPlan(item: Record<string, unknown>, index = 0): BroadbandAccount {
  const no =
    readPath(item, ['busiID', 'broadbandNo', 'broadbandNum', 'broadBandNum', 'bandNum', 'kdNum', 'account', 'acctNo', 'userNo']) ||
    firstDeepText(item, ['busiID', 'broadbandNo', 'broadbandNum', 'broadBandNum', 'bandNum', 'kdNum']) ||
    `宽带${index + 1}`
  const address = readPath(item, ['busiValue', 'address', 'installAddr', 'installAddress', 'addr', 'userAddr']) || firstDeepText(item, ['busiValue'])
  const id = readPath(item, ['id', 'broadbandId', 'userId', 'instanceId']) || no
  return {
    ...item,
    id,
    broadbandNo: no,
    address,
    addressMasked: address || '',
    displayName: no,
  }
}

function businessDescription(item: BusinessItem): string {
  const direct = readPath(item, [
    'businessDesc',
    'businessDescription',
    'busiInfomsg',
    'busiInfoMsg',
    'busiInfo',
    'busiDesc',
    'productDesc',
    'prodDesc',
    'description',
    'desc',
    'detail',
    'detailDesc',
    'introduce',
    'intro',
    'memo',
    'remark',
    'remarks',
  ])
  if (direct) return direct
  const bindList = item.bindList
  if (Array.isArray(bindList)) {
    const names = bindList
      .map((child) => (child && typeof child === 'object' ? businessName(child as BusinessItem) : ''))
      .filter(Boolean)
    if (names.length > 0) return `包含 ${names.join('、')} 等关联权益或子业务。`
  }
  return '暂无更详细的业务介绍，具体资费、权益及退订规则以移动侧返回信息为准。'
}

function orderTime(item: BusinessItem): string {
  return readPath(item, ['orderTime', 'ordTime', 'createTime', 'openTime', 'orderDate', 'createDate'])
}

function validStartTime(item: BusinessItem): string {
  return readPath(item, [
    'validDate',
    'validStartTime',
    'effectiveTime',
    'effectTime',
    'startTime',
    'beginTime',
    'effDate',
    'effTime',
    'validBeginTime',
    'startDate',
  ])
}

function validEndTime(item: BusinessItem): string {
  return readPath(item, [
    'expireDate',
    'validEndTime',
    'expireTime',
    'endTime',
    'invalidTime',
    'failureTime',
    'failureDate',
    'expDate',
    'invalidDate',
  ])
}

function validPeriod(item: BusinessItem): string {
  const direct = readPath(item, ['validPeriod', 'effectiveDate', 'period', 'validTime'])
  if (direct) return direct
  const start = validStartTime(item)
  const end = validEndTime(item)
  if (start && end) {
    if (/生效|长期|永久|无固定期限/.test(end)) return `${start} 起 ${end}`
    return `${start} 至 ${end}`
  }
  if (start) return `${start} 起 生效`
  if (end) return `截至 ${end}`
  return ''
}

function unsubscribeTime(item: BusinessItem): string {
  return readPath(item, ['unsubscribeTime', 'cancelTime', 'quitTime'])
}

function businessStatus(item: BusinessItem): string {
  const named = readPath(item, ['statusName', 'status', 'stateName', 'busiStatus'])
  if (named) return named
  const state = readPath(item, ['busiState', 'state'])
  if (state === '3') return '已失效'
  if (state === '4') return '生效中'
  return state
}

function contractName(item: BusinessItem): string {
  return (
    readPath(item, [
      'contractName',
      'contName',
      'offerName',
      'businessName',
      'productName',
      'busiName',
      'packageName',
      'name',
      'title',
    ]) || businessName(item)
  )
}

function contractOrderTime(item: BusinessItem): string {
  return readPath(item, ['orderTime', 'orderDate', 'createTime', 'createDate', 'subscribeTime', 'subTime', 'openTime'])
}

function contractValidStart(item: BusinessItem): string {
  return readPath(item, ['validStartTime', 'effectiveTime', 'effTime', 'startTime', 'beginTime', 'startDate', 'effDate'])
}

function contractValidEnd(item: BusinessItem): string {
  return readPath(item, ['validEndTime', 'endDate', 'expireTime', 'endTime', 'expireDate', 'invalidTime', 'invalidDate', 'failureTime'])
}

function contractValidPeriod(item: BusinessItem): string {
  const direct = readPath(item, ['validPeriod', 'effectiveDate', 'period', 'validTime'])
  if (direct) return direct
  const start = contractValidStart(item)
  const end = contractValidEnd(item)
  if (start && end) return `${start} 至 ${end}`
  if (start) return `${start} 起 生效`
  if (end) return `截至 ${end}`
  return ''
}

function contractStatus(item: BusinessItem): string {
  return readPath(item, ['statusName', 'statusDesc', 'statusText', 'stateName', 'busiStatus', 'status'])
}

function isContractUnsubscribed(item: BusinessItem): boolean {
  const status = contractStatus(item)
  const flags = readPath(item, ['cancelFlag', 'unsubscribeFlag', 'unsubFlag', 'returnFlag', 'isCancel'])
  return /已退订|待生效|已取消|失效|终止/.test(status) || ['1', 'true', 'Y', 'y'].includes(flags)
}

function normalizeContractForUnsubscribe(item: BusinessItem, phone?: string): PackageContractItem {
  const productCode = readPath(item, ['productCode', 'contractId', 'productId', 'prodId', 'offerId', 'ywCode', 'code'])
  const planId = readPath(item, ['planId', 'planCode', 'contId'])
  const bizCode = readPath(item, ['bizCode', 'busiCode', 'businessCode', 'ywCode'])
  const codeType = readPath(item, ['codeType', 'productType', 'prodType'])
  const spCode = readPath(item, ['sPCode', 'spCode', 'spid'])
  const instanceId = readPath(item, ['instanceId', 'contractInstanceId', 'instId', 'relationId', 'contractInstId'])
  return {
    ...item,
    __packageContract: true,
    businessName: contractName(item),
    productName: contractName(item),
    productCode: productCode || item.productCode,
    planId: planId || item.planId,
    bizCode: bizCode || item.bizCode,
    codeType: codeType || item.codeType,
    sPCode: spCode || item.sPCode,
    instanceId: instanceId || item.instanceId,
    busiReturnEffTime: item.busiReturnEffTime || item.effectiveTimeType || '0',
    cellNum: readPath(item, ['cellNum', 'phone', 'tel', 'telNum']) || phone,
    city: readPath(item, ['city', 'cityCode']) || '010',
  }
}

function contractCanUnsubscribe(item: BusinessItem): boolean {
  if (isContractUnsubscribed(item)) return false
  const normalized = normalizeContractForUnsubscribe(item)
  return Boolean(normalized.productCode || normalized.bizCode || normalized.instanceId)
}

function extractPackageContracts(value: unknown, phone?: string): PackageContractItem[] {
  const found: PackageContractItem[] = []
  const seen = new Set<unknown>()
  const walk = (node: unknown) => {
    if (!node || seen.has(node) || typeof node !== 'object') return
    seen.add(node)
    if (Array.isArray(node)) {
      node.forEach((item) => {
        if (!item || typeof item !== 'object') return
        const obj = item as BusinessItem
        const looksLikeContract = Boolean(
          contractName(obj) !== '未命名业务' &&
            (contractValidPeriod(obj) ||
              contractOrderTime(obj) ||
              contractStatus(obj) ||
              obj.productCode ||
              obj.contractId ||
              obj.bizCode ||
              obj.instanceId ||
              obj.contractInstanceId),
        )
        if (looksLikeContract) found.push(normalizeContractForUnsubscribe(obj, phone))
      })
      node.forEach(walk)
      return
    }
    Object.values(node).forEach(walk)
  }
  walk(value)
  const unique = new Map<string, PackageContractItem>()
  found.forEach((item, index) => {
    const key = [
      item.instanceId,
      item.productCode,
      item.planId,
      item.bizCode,
      contractName(item),
      contractOrderTime(item),
      index,
    ]
      .map((x) => text(x))
      .join('|')
    unique.set(key, item)
  })
  return Array.from(unique.values())
}

function normalizeDateText(value: string): string {
  return value
    .replace(/[年月]/g, '-')
    .replace(/日/g, ' ')
    .replace(/\./g, '-')
    .replace(/\//g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseBusinessDate(value: string): Date | null {
  const raw = normalizeDateText(value)
  const match = raw.match(/(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/)
  if (!match) return null
  const [, y, m, d, hh = '23', mm = '59', ss = '59'] = match
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss))
  return Number.isNaN(date.getTime()) ? null : date
}

function isExpiredBusiness(item: BusinessItem): boolean {
  const status = businessStatus(item)
  if (/失效|已退订|已取消|终止/.test(status)) return true
  if (unsubscribeTime(item)) return true
  const direct = readPath(item, ['isExpire', 'isExpired', 'expiredFlag', 'invalidFlag', 'isInvalid'])
  if (['1', 'true', 'Y', 'y', 'yes'].includes(direct)) return true
  const end = parseBusinessDate(validEndTime(item))
  return Boolean(end && end.getTime() < Date.now())
}

function canUnsubscribe(item: BusinessItem): boolean {
  return !isMainPlanBusiness(item) && !isExpiredBusiness(item)
}

function isMainPlanBusiness(item: BusinessItem): boolean {
  return readPath(item, ['busiState', 'state']) === '0'
}

function canWithdrawMainPlan(item: BusinessItem): boolean {
  return isMainPlanBusiness(item) && !isExpiredBusiness(item)
}

function businessUnsupportedReason(item: BusinessItem): string {
  if (isExpiredBusiness(item)) return '当前业务已失效，无需退订。'
  if (isMainPlanBusiness(item)) return '主套餐业务不支持退订，请使用撤销功能。'
  return readPath(item, ['unsubscribeReason', 'cancelReason', 'noCancelReason', 'unsubReason']) || '如需退订，详情可咨询10086或营业厅'
}

function invalidDateText(item: BusinessItem): string {
  const end = validEndTime(item)
  if (end) return normalizeDateText(end).slice(0, 10)
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function monthEndText(month = monthOptions(1)[0]): string {
  const [yearText, monthText] = month.split('-')
  const year = Number(yearText)
  const monthIndex = Number(monthText) - 1
  const end = new Date(year, monthIndex + 1, 0)
  return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
}

function CryingMascot({ variant = 'sad' }: { variant?: 'sad' | 'tearful' }) {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe88b] shadow-sm">
      <span className="absolute left-4 top-5 h-2 w-2 rounded-full bg-zinc-900" />
      <span className="absolute right-4 top-5 h-2 w-2 rounded-full bg-zinc-900" />
      <span
        className={cn(
          'absolute left-1/2 h-4 w-7 -translate-x-1/2 rounded-t-full border-x-2 border-t-2 border-zinc-900',
          variant === 'sad' ? 'bottom-4 rotate-180' : 'bottom-3',
        )}
      />
      <span className="absolute left-2 top-7 h-5 w-3 rounded-full bg-sky-400" />
      {variant === 'sad' ? <span className="absolute right-2 top-7 h-5 w-3 rounded-full bg-sky-400" /> : null}
    </div>
  )
}

function businessKey(item: BusinessItem, index: number): string {
  return [item.productCode, item.planId, item.bizCode, businessName(item), index].map((x) => text(x)).join('|')
}

function businessDraftKey(session: BusinessSession | null, item: BusinessItem | null): string {
  if (!session || !item) return ''
  return [session.id, item.instanceId, item.productCode, item.planId, item.bizCode, businessName(item)].map((x) => text(x)).join('|')
}

function accountKey(account: SavedBusinessAccount): string {
  return account.session.id || account.phone
}

function normalizeSavedAccounts(accounts?: SavedBusinessAccount[]): SavedBusinessAccount[] {
  const now = Date.now()
  const unique = new Map<string, SavedBusinessAccount>()
  ;(accounts || []).forEach((account) => {
    if (!account?.session?.id || !account.phone || account.expiresAt <= now) return
    unique.set(accountKey(account), account)
  })
  return Array.from(unique.values()).sort((a, b) => b.expiresAt - a.expiresAt)
}

function makeSavedAccount(args: {
  session: BusinessSession
  phone: string
  levelName?: string
  selectedMonth?: string
  busiType?: string
  viewMode?: ViewMode
  userInfo?: unknown
  businessResult?: unknown
  broadbandPlans?: BroadbandAccount[]
  selectedBroadbandId?: string
  broadbandBusinessResult?: unknown
}): SavedBusinessAccount {
  const phone = args.session.phone || args.phone
  return {
    session: args.session,
    phone,
    label: maskPhone(phone),
    levelName: args.levelName || explicitLevelName(args.userInfo),
    expiresAt: Date.now() + SESSION_TTL_MS,
    selectedMonth: args.selectedMonth,
    busiType: args.busiType,
    viewMode: args.viewMode,
    userInfo: args.userInfo,
    businessResult: args.businessResult,
    broadbandPlans: args.broadbandPlans,
    selectedBroadbandId: args.selectedBroadbandId,
    broadbandBusinessResult: args.broadbandBusinessResult,
  }
}

function extractProductGroups(value: unknown): Record<string, BusinessItem[]> {
  const groups: Record<string, BusinessItem[]> = { '01': [], '02': [], '03': [], '04': [] }
  const seen = new Set<unknown>()
  const walk = (node: unknown) => {
    if (!node || seen.has(node) || typeof node !== 'object') return
    seen.add(node)
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    const obj = node as Record<string, unknown>
    const productType = text(obj.productType)
    const list = obj.productInfoList
    if (productType && Array.isArray(list)) {
      const bucket = groups[productType] || (groups[productType] = [])
      list.forEach((item) => {
        if (item && typeof item === 'object') bucket.push({ ...(item as BusinessItem), productType })
      })
      return
    }
    Object.values(obj).forEach(walk)
  }
  walk(value)
  return groups
}

function extractBusinessItems(value: unknown): BusinessItem[] {
  const found: BusinessItem[] = []
  const seen = new Set<unknown>()
  const walk = (node: unknown) => {
    if (!node || seen.has(node) || typeof node !== 'object') return
    seen.add(node)
    if (Array.isArray(node)) {
      const businessLike = node.filter(
        (item): item is BusinessItem =>
          Boolean(item) &&
          typeof item === 'object' &&
          ('businessName' in item || 'productName' in item || 'productCode' in item || 'bizCode' in item),
      )
      if (businessLike.length > 0) found.push(...businessLike)
      node.forEach(walk)
      return
    }
    Object.values(node).forEach(walk)
  }
  walk(value)
  const unique = new Map<string, BusinessItem>()
  found.forEach((item, index) => unique.set(businessKey(item, index), item))
  return Array.from(unique.values())
}

function businessGroups(value: unknown): Record<string, BusinessItem[]> {
  const grouped = extractProductGroups(value)
  const groupedCount = Object.values(grouped).reduce((sum, list) => sum + list.length, 0)
  if (groupedCount > 0) return grouped
  const fallback = extractBusinessItems(value)
  const seen = new Set<string>()
  fallback.forEach((item, index) => {
    const type = text(item.productType, '01')
    const bucket = grouped[type] || grouped['01']
    const key = businessKey(item, index)
    if (!seen.has(key)) {
      seen.add(key)
      bucket.push(item)
    }
  })
  return grouped
}

function extractBroadbandBlocks(value: unknown): BroadbandAccount[] {
  const found: Record<string, unknown>[] = []
  const seen = new Set<unknown>()
  const walk = (node: unknown) => {
    if (!node || seen.has(node) || typeof node !== 'object') return
    seen.add(node)
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    const obj = node as Record<string, unknown>
    if (text(obj.busiID) && Array.isArray(obj.busiInfoList)) {
      found.push(obj)
      return
    }
    Object.values(obj).forEach(walk)
  }
  walk(value)
  const unique = new Map<string, BroadbandAccount>()
  found.forEach((item, index) => {
    const plan = normalizeBroadbandPlan(item, index)
    unique.set(plan.id, plan)
  })
  return Array.from(unique.values())
}

function broadbandBusinessGroups(value: unknown, broadband?: BroadbandAccount | null): Record<string, BusinessItem[]> {
  const groups: Record<string, BusinessItem[]> = { '01': [], '02': [], '03': [], '04': [] }
  const blocks = extractBroadbandBlocks(value)
  const targetNo = broadbandNo(broadband)
  const block =
    blocks.find((item) => item.id === broadband?.id) ||
    blocks.find((item) => broadbandNo(item) === targetNo) ||
    blocks[0]
  const busiInfoList = block && Array.isArray(block.busiInfoList) ? block.busiInfoList : []
  busiInfoList.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return
    const obj = entry as Record<string, unknown>
    const productType = text(obj.productType, '01')
    const list = Array.isArray(obj.productInfoList) ? obj.productInfoList : []
    const bucket = groups[productType] || (groups[productType] = [])
    list.forEach((item) => {
      if (item && typeof item === 'object') {
        bucket.push({
          ...(item as BusinessItem),
          productType,
          broadbandNo: broadbandNo(block),
          broadbandAddress: broadbandAddress(block),
        })
      }
    })
  })
  return groups
}

function monthOptions(count = 13): string[] {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const d = new Date(now.getFullYear(), now.getMonth() - index, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
}

function monthLabel(month: string): { month: string; year: string } {
  const [year, mm] = month.split('-')
  return { month: `${Number(mm || '0')}月`, year }
}

function mobileCacheKey(session: BusinessSession, month: string): string {
  return [session.id, session.phone || '', month].join('|')
}

function broadbandCacheId(item?: BroadbandAccount | null): string {
  return item ? item.id || broadbandNo(item) || 'unknown' : 'unknown'
}

function broadbandCacheKey(session: BusinessSession, item: BroadbandAccount, month: string): string {
  return [session.id, broadbandCacheId(item), broadbandNo(item), month].join('|')
}

function getCachedState(): CachedState {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CachedState) : {}
  } catch {
    return {}
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function publicEntryPath(): string {
  const returnTo = new URLSearchParams(window.location.search).get('returnTo') || ''
  if (/^\/(?:app\/cmcc-(?:public|user)(?:\/|\?|$)|public(?:\?|$)|users(?:\?|$)|v2(?:\/|$)|$)/.test(returnTo)) return returnTo
  return window.location.pathname.startsWith('/app/cmcc-user') ? '/app/cmcc-user/public' : '/public'
}

export default function BusinessQueryAdmin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cached = useMemo(() => getCachedState(), [])
  const months = useMemo(() => monthOptions(), [])
  const entryAccountId = searchParams.get('accountId') || ''
  const hasAccountEntry = Boolean(entryAccountId)
  const consumedAccountIdRef = useRef<string>('')
  const loginPhoneEditedRef = useRef(false)

  const [savedAccounts, setSavedAccounts] = useState<SavedBusinessAccount[]>([])
  const [session, setSession] = useState<BusinessSession | null>(null)
  const [phone, setPhone] = useState(cached.phone || '')
  const [loginPhone, setLoginPhone] = useState(cached.phone || '')
  const [loginCode, setLoginCode] = useState('')
  const [sx, setSx] = useState(cached.sx || '')
  const [planType] = useState(cached.planType || '0')
  const [busiType, setBusiType] = useState(DEFAULT_BUSI_TYPE)
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE)
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [userInfo, setUserInfo] = useState<unknown>(cached.userInfo || null)
  const [businessResult, setBusinessResult] = useState<unknown>(null)
  const [broadbandPlans, setBroadbandPlans] = useState<BroadbandAccount[]>([])
  const [selectedBroadbandId, setSelectedBroadbandId] = useState('')
  const [broadbandBusinessResult, setBroadbandBusinessResult] = useState<unknown>(null)
  const [businessCache, setBusinessCache] = useState<Record<string, unknown>>(cached.businessCache || {})
  const [broadbandPlansCache, setBroadbandPlansCache] = useState<Record<string, BroadbandAccount[]>>(cached.broadbandPlansCache || {})
  const [broadbandBusinessCache, setBroadbandBusinessCache] = useState<Record<string, unknown>>(cached.broadbandBusinessCache || {})
  const [broadbandSwitcherOpen, setBroadbandSwitcherOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [pendingSearchTarget, setPendingSearchTarget] = useState('')
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [canManageBusiness, setCanManageBusiness] = useState(false)
  const [activeBusiness, setActiveBusiness] = useState<BusinessItem | null>(null)
  const [detailBusiness, setDetailBusiness] = useState<BusinessItem | null>(null)
  const [businessIdOverrideDraft, setBusinessIdOverrideDraft] = useState<BusinessIdOverrideDraft>(() => defaultBusinessIdOverride(null))
  const [unsubscribeCode, setUnsubscribeCode] = useState('')
  const [unsubscribeResult, setUnsubscribeResult] = useState<UnsubscribeResult | null>(null)
  const [feedback, setFeedback] = useState<UnsubscribeFeedbackState>({ selectedReasons: [], otherReason: '' })
  const [smsCooldown, setSmsCooldown] = useState(0)
  const [loginSmsCooldown, setLoginSmsCooldown] = useState(0)
  const [unsubscribeSmsSent, setUnsubscribeSmsSent] = useState(false)
  const [unsubscribeDrafts, setUnsubscribeDrafts] = useState<Record<string, UnsubscribeDraft>>({})
  const [effectiveTimeChoice, setEffectiveTimeChoice] = useState('')
  const effectiveTimeType = activeBusiness ? resolveBusinessUnsubscribeTime(activeBusiness, effectiveTimeChoice) : ''
  const effectiveTimeOptions = activeBusiness ? businessUnsubscribeTimeOptions(activeBusiness) : []
  const [loginOpen, setLoginOpen] = useState(true)
  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const [packageDialogOpen, setPackageDialogOpen] = useState(false)
  const [packageActiveTab, setPackageActiveTab] = useState<'detail' | 'contract'>('detail')
  const [myPackageData, setMyPackageData] = useState<MyPackageData | null>(null)
  const [packageError, setPackageError] = useState<string | null>(null)
  const [accountOverview, setAccountOverview] = useState<AccountOverviewData | null>(null)
  const [userInfoDialogOpen, setUserInfoDialogOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const selectedBroadband = broadbandPlans.find((item) => item.id === selectedBroadbandId) || broadbandPlans[0] || null
  const activeBusinessResult = viewMode === 'broadband' ? broadbandBusinessResult : businessResult
  const mobileGroupedItems = useMemo(() => businessGroups(businessResult), [businessResult])
  const broadbandGroupedItems = useMemo(
    () => broadbandBusinessGroups(broadbandBusinessResult, selectedBroadband),
    [broadbandBusinessResult, selectedBroadband],
  )
  const groupedItems = viewMode === 'broadband' ? broadbandGroupedItems : mobileGroupedItems
  const businessItems = groupedItems[busiType] || []
  const currentPhone = session?.phone || phone
  const currentSavedAccount = savedAccounts.find((account) => account.session.id === session?.id)
  const currentLevelName = currentSavedAccount?.levelName || userLevelName(userInfo)
  const overviewUserInfo = accountOverview?.userInfo || userInfo
  const overviewUser = userInfoObject(overviewUserInfo)
  const overviewBalance = balanceInfo(accountOverview?.balance)
  const overviewAccounts = balanceAccounts(accountOverview?.balance)
  const normalBalanceAccount = overviewAccounts.find((item) => text(item.accoutTypeName).includes('通用')) || overviewAccounts[0]
  const packageTitle = packagePlanName(myPackageData)
  const packageDescriptions = packagePlanDescriptions(myPackageData)
  const packageContracts = useMemo(() => extractPackageContracts(myPackageData?.contract, currentPhone), [myPackageData, currentPhone])
  const businessSearchItems = useMemo<BusinessSearchItem[]>(() => {
    const result: BusinessSearchItem[] = []
    const appendGroups = (mode: ViewMode, groups: Record<string, BusinessItem[]>) => {
      for (const tab of CATEGORY_TABS) {
        ;(groups[tab.value] || []).forEach((item, index) => {
          const ids = defaultBusinessIdOverride(item)
          result.push({
            id: `business:${mode}:${tab.value}:${index}`,
            title: businessName(item),
            subtitle: `${mode === 'broadband' ? '宽带' : '手机'} · ${tab.label}`,
            searchText: `${ids.planId} ${ids.productCode} ${ids.offerId}`,
          })
        })
      }
    }
    appendGroups('mobile', mobileGroupedItems)
    appendGroups('broadband', broadbandGroupedItems)
    if (myPackageData) {
      result.push({ id: 'package:detail', title: packageTitle, subtitle: '主套餐 · 套餐详情' })
    }
    packageContracts.forEach((item, index) => {
      const ids = defaultBusinessIdOverride(item)
      result.push({
        id: `package:contract:${index}`,
        title: contractName(item),
        subtitle: '主套餐 · 套餐合约',
        searchText: `${ids.planId} ${ids.productCode} ${ids.offerId}`,
      })
    })
    return result
  }, [broadbandGroupedItems, mobileGroupedItems, myPackageData, packageContracts, packageTitle])
  const busy = Boolean(loading)
  const toastMessage = error || success
  const toastType = error ? 'error' : 'success'

  useEffect(() => {
    if (!pendingSearchTarget) return
    const timer = window.setTimeout(() => {
      const target = document.getElementById(pendingSearchTarget)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
      setPendingSearchTarget('')
    }, 80)
    return () => window.clearTimeout(timer)
  }, [busiType, pendingSearchTarget, viewMode])

  useEffect(() => {
    if (!hasAccountEntry) return
    const next: CachedState = {
      session,
      accounts: savedAccounts,
	      phone,
	      sx,
	      planType,
	      userInfo,
	      businessCache,
	      broadbandPlansCache,
	      broadbandBusinessCache,
	    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(next))
  }, [
    hasAccountEntry,
    session,
    savedAccounts,
    phone,
	    sx,
	    planType,
	    userInfo,
	    businessCache,
	    broadbandPlansCache,
	    broadbandBusinessCache,
	  ])

  useEffect(() => {
    let cancelled = false
    apiFetch('/api/auth/session')
      .then((res) => res.json() as Promise<ApiResp<{ authenticated: boolean; user?: CurrentUser }>>)
      .then((json) => {
        if (!cancelled && json.ok && json.data.authenticated) setCurrentUser(json.data.user || null)
      })
      .catch(() => {
        if (!cancelled) setCurrentUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!entryAccountId) return
    loginPhoneEditedRef.current = false
    let cancelled = false
    apiFetch('/api/auth/accounts')
      .then((res) => res.json() as Promise<ApiResp<{ accounts: AuthAccountSummary[] }>>)
      .then((json) => {
        if (cancelled || !json.ok) return
        const account = json.data.accounts.find((item) => item.id === entryAccountId)
        if (account?.phone && /^1\d{10}$/.test(account.phone)) {
          setPhone(account.phone)
          if (!loginPhoneEditedRef.current) setLoginPhone(account.phone)
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [entryAccountId])

  useEffect(() => {
    if (!hasAccountEntry) {
      setSession(null)
      setBusinessResult(null)
      setUserInfo(null)
      setAccountOverview(null)
      setLoginOpen(false)
      return
    }
    const now = Date.now()
    setSavedAccounts((accounts) => normalizeSavedAccounts(accounts))
    if (session && !normalizeSavedAccounts(savedAccounts).some((account) => account.session.id === session.id)) {
      setSession(null)
      setBusinessResult(null)
      setUserInfo(null)
      setLoginOpen(true)
    }
  }, [hasAccountEntry])

  useEffect(() => {
    if (!session) return
    void queryAccountOverview(session)
  }, [session?.id])

  useEffect(() => {
    if (!activeBusiness || !session) return
    const key = businessDraftKey(session, activeBusiness)
    const draft = unsubscribeDrafts[key]
    const cooldown = draft ? Math.max(0, Math.ceil((draft.cooldownUntil - Date.now()) / 1000)) : 0
    setUnsubscribeCode(draft?.code || '')
    setUnsubscribeSmsSent(Boolean(draft?.smsSent))
    setSmsCooldown(cooldown)
    setEffectiveTimeChoice(draft?.effectiveTimeType || '')
  }, [activeBusiness, session])

  useEffect(() => {
    setBusinessIdOverrideDraft(defaultBusinessIdOverride(activeBusiness))
  }, [activeBusiness])

  useEffect(() => {
    if (!activeBusiness || !session) return
    const key = businessDraftKey(session, activeBusiness)
    if (!key) return
    setUnsubscribeDrafts((drafts) => {
      const current = drafts[key]
      if (!current) return drafts
      return { ...drafts, [key]: { ...current, code: unsubscribeCode } }
    })
  }, [unsubscribeCode, activeBusiness, session])

  useEffect(() => {
    if (!activeBusiness || !session || smsCooldown <= 0) return
    const timer = window.setInterval(() => {
      const key = businessDraftKey(session, activeBusiness)
      const draft = unsubscribeDrafts[key]
      setSmsCooldown(draft ? Math.max(0, Math.ceil((draft.cooldownUntil - Date.now()) / 1000)) : 0)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [smsCooldown, activeBusiness, session, unsubscribeDrafts])

  useEffect(() => {
    if (loginSmsCooldown <= 0) return
    const timer = window.setInterval(() => {
      setLoginSmsCooldown((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [loginSmsCooldown])

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

	  useEffect(() => {
	    const accountId = searchParams.get('accountId') || ''
	    if (!accountId) return
	    if (consumedAccountIdRef.current === accountId) return
	    setSession(null)
	    setCanManageBusiness(false)
	    setBusinessResult(null)
	    setBroadbandBusinessResult(null)
	    setBroadbandPlans([])
	    setSelectedBroadbandId('')
	    setUserInfo(null)
	    setAccountOverview(null)
	    setBusiType(DEFAULT_BUSI_TYPE)
	    setViewMode(DEFAULT_VIEW_MODE)
	    setSelectedMonth(months[0])
	    setActiveBusiness(null)
	    setDetailBusiness(null)
	    setBroadbandSwitcherOpen(false)
	    setMonthPickerOpen(false)
	    setPackageDialogOpen(false)
	    setUserInfoDialogOpen(false)
	    setLoginOpen(true)
	    consumedAccountIdRef.current = accountId
	    void prepareAccount(accountId)
	  }, [searchParams, months])
  function rememberAccount(account: SavedBusinessAccount) {
    setSavedAccounts((accounts) =>
      normalizeSavedAccounts([account, ...accounts.filter((item) => accountKey(item) !== accountKey(account) && item.phone !== account.phone)]),
    )
  }

	  async function activateSession(args: {
	    session: BusinessSession
	    phone?: string
	    accountInfo?: unknown
	    userInfo?: unknown
	    message?: string
	  }) {
	    const nextPhone = args.session.phone || args.phone || phone
	    const levelName = explicitLevelName(args.accountInfo) || explicitLevelName(args.userInfo)
	    const entryMonth = months[0]
	    setSession(args.session)
	    setPhone(nextPhone)
	    setUserInfo(args.userInfo || args.accountInfo || null)
	    setSelectedMonth(entryMonth)
	    setBusiType(DEFAULT_BUSI_TYPE)
	    setViewMode(DEFAULT_VIEW_MODE)
	    setBusinessResult(null)
	    setBroadbandPlans([])
	    setSelectedBroadbandId('')
	    setBroadbandBusinessResult(null)
	    setActiveBusiness(null)
	    setDetailBusiness(null)
	    setBroadbandSwitcherOpen(false)
	    setMonthPickerOpen(false)
	    setPackageDialogOpen(false)
	    setUserInfoDialogOpen(false)
	    setLoginOpen(false)
	    setLoginCode('')
	    setSx('')
	    setError(null)
	    setSuccess(args.message || '加载中，请稍等')
	    rememberAccount(
	      makeSavedAccount({
	        session: args.session,
	        phone: nextPhone,
	        levelName,
	        selectedMonth: entryMonth,
	        busiType: DEFAULT_BUSI_TYPE,
	        viewMode: DEFAULT_VIEW_MODE,
	        userInfo: args.userInfo || args.accountInfo,
	        broadbandPlans: [],
	        selectedBroadbandId: '',
	        broadbandBusinessResult: null,
	      }),
	    )
	    await queryBusiness(entryMonth, args.session, DEFAULT_BUSI_TYPE, { silentUserInfo: Boolean(levelName || args.userInfo || args.accountInfo) })
	  }

  async function prepareAccount(accountId: string) {
	    setLoading('prepareAccount')
	    setError(null)
	    setSuccess('加载中，请稍等')
	    try {
      let json = await postJson<{
        session: BusinessSession
        account: unknown
        capabilities: { canUnsubscribe: boolean }
      }>('/api/business-query/accounts/' + encodeURIComponent(accountId) + '/prepare', {})
	      if (json.ok === false && json.errorCode === 'CMCC_SESSION_NOT_READY') {
	        await sleep(800)
        json = await postJson<{
          session: BusinessSession
          account: unknown
          capabilities: { canUnsubscribe: boolean }
        }>('/api/business-query/accounts/' + encodeURIComponent(accountId) + '/prepare', {})
	      }
      if (!json.ok) throw new Error(json.message || '准备账号失败')
      setCanManageBusiness(Boolean(json.data.capabilities?.canUnsubscribe))
	      await activateSession({
	        session: json.data.session,
	        phone: json.data.session.phone,
	        accountInfo: json.data.account,
	        message: '加载中，请稍等',
	      })
    } catch (e) {
      setLoginOpen(true)
      setError(e instanceof Error ? e.message : '准备账号失败')
    } finally {
      setLoading(null)
    }
  }

  async function recoverAccountSession(accountId = entryAccountId): Promise<BusinessSession | null> {
    if (!accountId) return null
    try {
      const json = await postJson<{
        session: BusinessSession
        account: unknown
        capabilities: { canUnsubscribe: boolean }
      }>('/api/business-query/accounts/' + encodeURIComponent(accountId) + '/prepare', {})
      if (!json.ok) return null
      setCanManageBusiness(Boolean(json.data.capabilities?.canUnsubscribe))
      const nextSession = json.data.session
      const nextPhone = nextSession.phone || phone
      setSession(nextSession)
      setPhone(nextPhone)
      setUserInfo(json.data.account || null)
      setLoginOpen(false)
      rememberAccount(
        makeSavedAccount({
          session: nextSession,
          phone: nextPhone,
          levelName: explicitLevelName(json.data.account),
          selectedMonth: months[0],
          busiType: DEFAULT_BUSI_TYPE,
          viewMode: DEFAULT_VIEW_MODE,
          userInfo: json.data.account,
        }),
      )
      return nextSession
    } catch {
      return null
    }
  }

  function returnToPublic() {
    window.location.replace(publicEntryPath())
  }

  async function sendLoginSms() {
    const normalizedPhone = loginPhone.replace(/\D/g, '')
    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setError('请输入正确的 11 位手机号')
      return
    }
    setLoading('sendLoginSms')
    setError(null)
    setSuccess(null)
    try {
      const json = await postJson<{ cooldownSeconds: number }>('/api/business-query/sms/send', {
        phone: normalizedPhone,
      })
      if (!json.ok) throw new Error(json.message || '发送登录验证码失败')
      setLoginSmsCooldown(Math.max(1, Math.min(120, json.data.cooldownSeconds || 60)))
      setSuccess('登录验证码已发送')
    } catch (e) {
      setError(e instanceof Error ? e.message : '发送登录验证码失败')
    } finally {
      setLoading(null)
    }
  }

  async function login() {
    const normalizedPhone = loginPhone.replace(/\D/g, '')
    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setError('请输入正确的 11 位手机号')
      return
    }
    setLoading('login')
    setError(null)
    setSuccess(null)
    try {
      const json = await postJson<{ session: BusinessSession; account: unknown }>(
        '/api/business-query/login',
        {
          phone: normalizedPhone,
          code: loginCode,
        },
      )
      if (!json.ok) throw new Error(json.message || '登录失败')
      const nextAccountId = json.data.session.accountId
      if (!nextAccountId) throw new Error('登录成功，但未生成可查询的账号')
      consumedAccountIdRef.current = nextAccountId
      const nextSearchParams = new URLSearchParams(searchParams)
      nextSearchParams.set('accountId', nextAccountId)
      setSearchParams(nextSearchParams, { replace: true })
      await activateSession({
        session: json.data.session,
        phone: normalizedPhone,
        accountInfo: json.data.account,
        message: '登录成功，正在查询已订业务',
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoading(null)
    }
  }

  async function fetchUserInfo(targetSession = session): Promise<unknown> {
    if (!targetSession) return undefined
    try {
      const json = await postJson<{ result: unknown; userInfo: unknown }>('/api/business-query/user-info', {
        sessionId: targetSession.id,
        accountId: targetSession.accountId,
      })
      if (!json.ok) throw new Error(json.message || '查询用户信息失败')
      setUserInfo(json.data.userInfo)
      return json.data.userInfo
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询用户信息失败')
      return undefined
    }
  }

  async function queryUserInfo(targetSession = session): Promise<unknown> {
    setLoading('userInfo')
    setError(null)
    try {
      return await fetchUserInfo(targetSession)
    } finally {
      setLoading(null)
    }
  }

	  async function queryBusiness(
	    nextMonth = selectedMonth,
	    targetSession = session,
	    nextBusiType = busiType,
	    options?: { silentUserInfo?: boolean; recovered?: boolean; force?: boolean },
	  ): Promise<unknown | undefined> {
    if (!targetSession) {
      setLoginOpen(true)
      setError('请先选择账号或手机号登录')
      return undefined
    }
    const cacheKey = mobileCacheKey(targetSession, nextMonth)
    if (!options?.force && Object.prototype.hasOwnProperty.call(businessCache, cacheKey)) {
      const cachedResult = businessCache[cacheKey]
      setBusinessResult(cachedResult)
      setSuccess(null)
      return cachedResult
    }
    setLoading('business')
    setError(null)
    try {
      const existingAccount = savedAccounts.find((account) => account.session.id === targetSession.id)
      const shouldFetchUserInfo = !options?.silentUserInfo && !existingAccount?.levelName && !explicitLevelName(userInfo)
      const latestUserInfo = shouldFetchUserInfo ? await fetchUserInfo(targetSession) : userInfo
      const json = await postJson<{ result: unknown; business: unknown }>('/api/business-query/query', {
        sessionId: targetSession.id,
        accountId: targetSession.accountId,
        planType,
        busiType: nextBusiType,
        bgnMonth: nextMonth,
        endMonth: nextMonth,
      })
	      if (!json.ok) {
	        const err = json as ApiErr
	        if (
	          ['SESSION_NOT_FOUND', 'COOKIE_NOT_FOUND', 'COOKIE_INVALID_CLEARED', 'CMCC_SESSION_NOT_READY', '223104'].includes(String(err.errorCode || '')) &&
	          !options?.recovered &&
	          entryAccountId
	        ) {
	          const recoveredSession = await recoverAccountSession(entryAccountId)
	          if (recoveredSession) {
	            return await queryBusiness(nextMonth, recoveredSession, nextBusiType, {
	              silentUserInfo: true,
	              recovered: true,
	            })
	          }
	          returnToPublic()
	          return undefined
	        }
	        if (err.errorCode === 'SESSION_NOT_FOUND') {
	          setSavedAccounts((accounts) => accounts.filter((account) => account.session.id !== targetSession.id))
	          if (session?.id === targetSession.id) {
	            setSession(null)
	            setBusinessResult(null)
	            setUserInfo(null)
	            setLoginOpen(true)
	          }
	        }
	        if (options?.recovered && ['SESSION_NOT_FOUND', 'COOKIE_NOT_FOUND', 'COOKIE_INVALID_CLEARED', 'CMCC_SESSION_NOT_READY', '223104'].includes(String(err.errorCode || ''))) {
	          returnToPublic()
	          return undefined
	        }
	        throw new Error(err.message || '查询已订业务失败')
	      }
      setBusinessResult(json.data.business)
      setBusinessCache((cache) => ({ ...cache, [cacheKey]: json.data.business }))
      const latestLevelName = existingAccount?.levelName || explicitLevelName(latestUserInfo)
      setSavedAccounts((accounts) =>
        normalizeSavedAccounts(
          accounts
            .map((account) =>
              account.session.id === targetSession.id
                ? {
                    ...account,
                    levelName: account.levelName || latestLevelName,
                    expiresAt: Date.now() + SESSION_TTL_MS,
                    selectedMonth: nextMonth,
                    busiType: nextBusiType,
                    viewMode,
                    businessResult: json.data.business,
                    broadbandPlans,
                    selectedBroadbandId,
                    broadbandBusinessResult,
                    userInfo: latestUserInfo || userInfo,
                  }
                : account,
            )
            .concat(
              accounts.some((account) => account.session.id === targetSession.id)
                ? []
                : [
                    makeSavedAccount({
                      session: targetSession,
                      phone: targetSession.phone || phone,
                      levelName: latestLevelName,
                      selectedMonth: nextMonth,
                      busiType: nextBusiType,
                      viewMode,
                      userInfo: latestUserInfo || userInfo,
                      businessResult: json.data.business,
                      broadbandPlans,
                      selectedBroadbandId,
                      broadbandBusinessResult,
                    }),
                  ],
            ),
        ),
      )
      setSuccess('已订业务查询完成')
      return json.data.business
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询已订业务失败')
      return undefined
    } finally {
      setLoading(null)
    }
  }

  async function queryBroadbandPlans(targetSession = session, month = selectedMonth): Promise<BroadbandAccount[]> {
    if (!targetSession) {
      setLoginOpen(true)
      setError('请先选择账号或手机号登录')
      return []
    }
    if (Object.prototype.hasOwnProperty.call(broadbandPlansCache, targetSession.id)) {
      const cachedPlans = broadbandPlansCache[targetSession.id] || []
      setBroadbandPlans(cachedPlans)
      if (cachedPlans.length > 0 && !cachedPlans.some((item) => item.id === selectedBroadbandId)) {
        setSelectedBroadbandId(cachedPlans[0].id)
      }
      return cachedPlans
    }
    setLoading('broadbandPlans')
    setError(null)
    try {
      const json = await postJson<{ broadband: { plans: BroadbandAccount[]; raw: unknown } }>('/api/business-query/broadband/plans', {
        sessionId: targetSession.id,
        accountId: targetSession.accountId,
        bgnMonth: month,
        endMonth: month,
      })
      if (!json.ok) throw new Error(json.message || '查询宽带号码失败')
      const plans = json.data.broadband?.plans || []
      setBroadbandPlans(plans)
      setBroadbandPlansCache((cache) => ({ ...cache, [targetSession.id]: plans }))
      if (plans.length > 0 && !plans.some((item) => item.id === selectedBroadbandId)) {
        setSelectedBroadbandId(plans[0].id)
      }
      return plans
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询宽带号码失败')
      return []
    } finally {
      setLoading(null)
    }
  }

	  async function queryBroadbandBusiness(
	    nextMonth = selectedMonth,
	    targetSession = session,
	    nextBusiType = busiType,
	    broadband = selectedBroadband,
	    options?: { recovered?: boolean },
	  ): Promise<unknown | undefined> {
    if (!targetSession) {
      setLoginOpen(true)
      setError('请先选择账号或手机号登录')
      return undefined
    }
    let targetBroadband = broadband
    if (!targetBroadband) {
      const plans = await queryBroadbandPlans(targetSession, nextMonth)
      targetBroadband = plans[0] || null
    }
    const cacheKey = targetBroadband ? broadbandCacheKey(targetSession, targetBroadband, nextMonth) : [targetSession.id, 'all-broadband', nextMonth].join('|')
    if (Object.prototype.hasOwnProperty.call(broadbandBusinessCache, cacheKey)) {
      const cachedResult = broadbandBusinessCache[cacheKey]
      const cachedPlans = extractBroadbandBlocks(cachedResult)
      setBroadbandBusinessResult(cachedResult)
      if (cachedPlans.length > 0) {
        setBroadbandPlans(cachedPlans)
        if (!targetBroadband || !cachedPlans.some((item) => item.id === targetBroadband?.id)) {
          setSelectedBroadbandId(cachedPlans[0].id)
        } else {
          setSelectedBroadbandId(targetBroadband.id)
        }
      } else if (targetBroadband) {
        setSelectedBroadbandId(targetBroadband.id)
      }
      setSuccess(null)
      return cachedResult
    }
    setLoading('business')
    setError(null)
    try {
      const json = await postJson<{ result: unknown; business: unknown }>('/api/business-query/query', {
        sessionId: targetSession.id,
        accountId: targetSession.accountId,
        planType: '2',
        busiType: nextBusiType,
        bgnMonth: nextMonth,
        endMonth: nextMonth,
        ...(targetBroadband ? { broadband: targetBroadband } : {}),
      })
	      if (!json.ok) {
	        const err = json as ApiErr
	        if (
	          ['SESSION_NOT_FOUND', 'COOKIE_NOT_FOUND', 'COOKIE_INVALID_CLEARED', 'CMCC_SESSION_NOT_READY', '223104'].includes(String(err.errorCode || '')) &&
	          !options?.recovered &&
	          entryAccountId
	        ) {
	          const recoveredSession = await recoverAccountSession(entryAccountId)
	          if (recoveredSession) {
	            return await queryBroadbandBusiness(nextMonth, recoveredSession, nextBusiType, broadband, { recovered: true })
	          }
	          returnToPublic()
	          return undefined
	        }
	        if (options?.recovered && ['SESSION_NOT_FOUND', 'COOKIE_NOT_FOUND', 'COOKIE_INVALID_CLEARED', 'CMCC_SESSION_NOT_READY', '223104'].includes(String(err.errorCode || ''))) {
	          returnToPublic()
	          return undefined
	        }
	        throw new Error(err.message || '查询宽带业务失败')
	      }
      const resultPlans = extractBroadbandBlocks(json.data.business)
      const nextPlans = resultPlans.length > 0 ? resultPlans : broadbandPlans
      const nextSelected = targetBroadband && nextPlans.some((item) => item.id === targetBroadband?.id) ? targetBroadband.id : nextPlans[0]?.id || ''
      setBroadbandBusinessResult(json.data.business)
      if (nextPlans.length > 0) setBroadbandPlans(nextPlans)
      setSelectedBroadbandId(nextSelected)
      setBroadbandBusinessCache((cache) => ({ ...cache, [cacheKey]: json.data.business }))
      setSavedAccounts((accounts) =>
        normalizeSavedAccounts(
          accounts.map((account) =>
            account.session.id === targetSession.id
              ? {
                  ...account,
                  expiresAt: Date.now() + SESSION_TTL_MS,
                  selectedMonth: nextMonth,
                  busiType: nextBusiType,
                  viewMode: 'broadband',
                  broadbandPlans: nextPlans,
                  selectedBroadbandId: nextSelected,
                  broadbandBusinessResult: json.data.business,
                }
              : account,
          ),
        ),
      )
      setSuccess('宽带业务查询完成')
      return json.data.business
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询宽带业务失败')
      return undefined
    } finally {
      setLoading(null)
    }
  }

	  async function queryAccountOverview(targetSession = session) {
	    if (!targetSession) return
	    try {
	      const json = await postJson<AccountOverviewData>('/api/business-query/account-overview', {
	        sessionId: targetSession.id,
        accountId: targetSession.accountId,
      })
      if (!json.ok) throw new Error(json.message || '查询用户余额和信息失败')
      setAccountOverview(json.data)
      if (json.data.userInfo) setUserInfo(json.data.userInfo)
    } catch (e) {
	      setAccountOverview((current) => ({
	        ...(current || {}),
	        userError: { message: e instanceof Error ? e.message : '查询用户余额和信息失败' },
	      }))
	    }
	  }

  async function queryMyPackage(options?: { open?: boolean; keepTab?: boolean }) {
    if (!session) {
      setLoginOpen(true)
      setError('请先选择账号或手机号登录')
      return
    }
    const shouldOpen = options?.open !== false
    if (shouldOpen) setPackageDialogOpen(true)
    if (!options?.keepTab) setPackageActiveTab('detail')
    setPackageError(null)
    setLoading('myPackage')
    try {
      const json = await postJson<MyPackageData>('/api/business-query/my-package', {
        sessionId: session.id,
        accountId: session.accountId,
        planType,
      })
      if (!json.ok) throw new Error(json.message || '查询套餐和合约失败')
      setMyPackageData(json.data)
    } catch (e) {
      setPackageError(e instanceof Error ? e.message : '查询套餐和合约失败')
      setMyPackageData(null)
    } finally {
      setLoading(null)
    }
  }

  function openContractUnsubscribe(item: PackageContractItem) {
    const normalized = normalizeContractForUnsubscribe(item, currentPhone)
    if (!contractCanUnsubscribe(normalized)) {
      setError('当前合约缺少退订必要字段，请先查看已订业务列表或联系10086处理')
      return
    }
    setPackageDialogOpen(false)
    setActiveBusiness(normalized)
    setUnsubscribeResult(null)
    setFeedback({ selectedReasons: [], otherReason: '' })
    const key = businessDraftKey(session, normalized)
    const draft = unsubscribeDrafts[key]
    setUnsubscribeCode(draft?.code || '')
    setUnsubscribeSmsSent(Boolean(draft?.smsSent))
    setSmsCooldown(draft ? Math.max(0, Math.ceil((draft.cooldownUntil - Date.now()) / 1000)) : 0)
  }

  async function sendUnsubscribeSms() {
    if (!session || !activeBusiness) return
    if (smsCooldown > 0) return
    const withdrawMainPlan = canWithdrawMainPlan(activeBusiness)
    setLoading('unsubscribeSms')
    setError(null)
    setSuccess(null)
    try {
      if (!withdrawMainPlan) {
        const statusJson = await postJson<{ result: unknown; status: unknown }>('/api/business-query/unsubscribe/status', {
          sessionId: session.id,
          accountId: session.accountId,
          business: activeBusiness,
        })
        if (!statusJson.ok) setError(statusJson.message || '业务状态查询异常，已继续尝试发送验证码')
      }
      const json = await postJson<{ result: unknown; cooldownSeconds: number; flowKey?: string }>(
        withdrawMainPlan ? '/api/business-query/main-plan/withdraw/sms/send' : '/api/business-query/unsubscribe/sms/send',
        {
        sessionId: session.id,
        accountId: session.accountId,
        business: activeBusiness,
        effectiveTimeType,
        businessIdOverride: canCustomizeBusinessIds ? compactBusinessIdOverride(businessIdOverrideDraft) : undefined,
        },
      )
      if (!json.ok) throw new Error(json.message || (withdrawMainPlan ? '发送撤销验证码失败' : '发送退订验证码失败'))
      const cooldownSeconds = Number(json.data.cooldownSeconds || 60)
      const cooldownUntil = Date.now() + cooldownSeconds * 1000
      const key = businessDraftKey(session, activeBusiness)
      setUnsubscribeDrafts((drafts) => ({
        ...drafts,
        [key]: {
          smsSent: true,
          cooldownUntil,
          code: unsubscribeCode,
          withdrawFlowKey: json.data.flowKey,
          effectiveTimeType,
        },
      }))
      setSmsCooldown(cooldownSeconds)
      setUnsubscribeSmsSent(true)
      setError(null)
      setSuccess(withdrawMainPlan ? '撤销验证码已发送' : '退订验证码已发送')
    } catch (e) {
      setError(e instanceof Error ? e.message : withdrawMainPlan ? '发送撤销验证码失败' : '发送退订验证码失败')
    } finally {
      setLoading(null)
    }
  }

  async function unsubscribe() {
    if (!session || !activeBusiness) return
    const withdrawMainPlan = canWithdrawMainPlan(activeBusiness)
    setLoading('unsubscribe')
    setError(null)
    setSuccess(null)
    setUnsubscribeResult(null)
    try {
      const json = await postJson<{ result: unknown }>(withdrawMainPlan ? '/api/business-query/main-plan/withdraw' : '/api/business-query/unsubscribe', {
        sessionId: session.id,
        accountId: session.accountId,
        business: activeBusiness,
        smsCode: unsubscribeCode,
        effectiveTimeType,
        planType,
        flowKey: unsubscribeDrafts[businessDraftKey(session, activeBusiness)]?.withdrawFlowKey,
        businessIdOverride: canCustomizeBusinessIds ? compactBusinessIdOverride(businessIdOverrideDraft) : undefined,
      })
      if (json.ok) {
        await queryBusiness(selectedMonth, session, busiType, { silentUserInfo: true, force: true })
        if (withdrawMainPlan) {
          void queryMyPackage({ open: false, keepTab: true })
        }
        if ((activeBusiness as PackageContractItem | null)?.__packageContract) {
          void queryMyPackage({ open: false, keepTab: true })
        }
        setUnsubscribeResult({
          ok: true,
          message: json.message || (withdrawMainPlan ? '撤销成功' : '退订成功'),
          businessName: businessName(activeBusiness),
          effectiveTimeType,
        })
        setFeedback({ selectedReasons: [], otherReason: '' })
      } else {
        setUnsubscribeResult({
          ok: false,
          message: json.message || (withdrawMainPlan ? '撤销失败' : '退订失败'),
          errorCode: 'errorCode' in json ? json.errorCode : undefined,
        })
      }
      if (json.ok) {
        const key = businessDraftKey(session, activeBusiness)
        setUnsubscribeDrafts((drafts) => {
          const next = { ...drafts }
          delete next[key]
          return next
        })
        setUnsubscribeCode('')
      }
    } catch (e) {
      setUnsubscribeResult({
        ok: false,
        message: e instanceof Error ? e.message : withdrawMainPlan ? '撤销失败' : '退订失败',
      })
    } finally {
      setLoading(null)
    }
  }

  function closeUnsubscribeDialog() {
    setActiveBusiness(null)
    setBusinessIdOverrideDraft(defaultBusinessIdOverride(null))
    setUnsubscribeResult(null)
    setFeedback({ selectedReasons: [], otherReason: '' })
  }

  function clearCache() {
    localStorage.removeItem(CACHE_KEY)
    setSavedAccounts([])
    setSession(null)
    setBusinessResult(null)
    setBroadbandPlans([])
    setSelectedBroadbandId('')
    setBroadbandBusinessResult(null)
    setBusinessCache({})
    setBroadbandPlansCache({})
    setBroadbandBusinessCache({})
    setBroadbandSwitcherOpen(false)
    setViewMode('mobile')
    setUserInfo(null)
    setAccountOverview(null)
    setActiveBusiness(null)
    setDetailBusiness(null)
    setLoginCode('')
    setSx('')
    setLoginOpen(true)
    setSuccess('页面缓存已清空')
  }

	  function switchAccount() {
	    const base = window.location.pathname.startsWith('/app/cmcc-user') ? '/app/cmcc-user/public' : '/public'
	    window.location.assign(base)
	  }
  function runCurrentQuery(month = selectedMonth, type = busiType) {
    if (viewMode === 'broadband') {
      void queryBroadbandBusiness(month, session, type, selectedBroadband)
      return
    }
    void queryBusiness(month, session, type)
  }

  function switchViewMode(mode: ViewMode) {
    setViewMode(mode)
    setActiveBusiness(null)
    setDetailBusiness(null)
    setError(null)
    setSuccess(null)
    if (mode === 'broadband') {
      if (broadbandPlans.length === 0) {
        void queryBroadbandPlans(session).then((plans) => {
          if (plans[0]) void queryBroadbandBusiness(selectedMonth, session, busiType, plans[0])
        })
      } else {
        void queryBroadbandBusiness(selectedMonth, session, busiType, selectedBroadband)
      }
    }
  }

  function selectBroadband(plan: BroadbandAccount) {
    setSelectedBroadbandId(plan.id)
    setBroadbandSwitcherOpen(false)
    if (!broadbandBusinessResult) {
      void queryBroadbandBusiness(selectedMonth, session, busiType, plan)
    }
  }

  function toggleFeedbackReason(reason: string) {
    setFeedback((current) => {
      const exists = current.selectedReasons.includes(reason)
      return {
        ...current,
        selectedReasons: exists
          ? current.selectedReasons.filter((item) => item !== reason)
          : [...current.selectedReasons, reason],
      }
    })
  }

  const canConfirmUnsubscribe = unsubscribeSmsSent && /^\d{6}$/.test(unsubscribeCode) && !busy
  const canSubmitFeedback = feedback.selectedReasons.length > 0 || feedback.otherReason.trim().length > 0
  const activeIsMainPlanWithdraw = activeBusiness ? canWithdrawMainPlan(activeBusiness) : false
  const canCustomizeBusinessIds = Boolean(currentUser?.permissions?.businessIdOverride)

  if (!hasAccountEntry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef7ff] px-5 text-[#222]">
        <section className="w-full max-w-[420px] rounded-3xl bg-white px-6 py-8 text-center shadow-[0_12px_36px_rgba(30,50,80,0.12)]">
          <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-4 text-xl font-bold text-zinc-900">无法直接访问</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            已订业务页面仅支持从专属 public 页面中对应账号入口进入，请返回账号列表后点击该账号的已订业务入口。
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="brand-page min-h-screen overflow-x-hidden text-[#222]">
      {toastMessage ? (
        <div className="fixed left-1/2 top-4 z-[80] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2">
          <div
            className={cn(
              'flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_12px_32px_rgba(0,0,0,0.18)]',
              toastType === 'error' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-white',
            )}>
            {toastType === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            <span className="min-w-0 flex-1">{toastMessage}</span>
            <button
              type="button"
              onClick={() => {
                setError(null)
                setSuccess(null)
              }}
              className="rounded-full p-0.5 text-white/80 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
      <div className="mx-auto min-h-screen w-full min-w-[320px] max-w-[680px] bg-white/70">
        <header className="brand-page relative px-3 pb-5 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="brand-heading text-base font-bold text-zinc-800"><BrandLogo className="h-7 w-7" />已订业务</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="搜索业务"
                aria-label="搜索业务"
                onClick={() => setSearchOpen(true)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/80 text-zinc-600 hover:bg-white">
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  loginPhoneEditedRef.current = false
                  setLoginPhone(/^1\d{10}$/.test(currentPhone) ? currentPhone : '')
                  setLoginCode('')
                  setError(null)
                  setSuccess(null)
                  setLoginOpen(true)
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-blue-600">
                <LogIn className="h-3.5 w-3.5" />
                登录
              </button>
              <button
                type="button"
                onClick={switchAccount}
                className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-zinc-700">
                切换账号
              </button>
	            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold leading-none tracking-normal text-zinc-950">
                <button
                  type="button"
                  onClick={() => setUserInfoDialogOpen(true)}
                  className="rounded-md text-left underline-offset-2 active:text-blue-600">
                  {maskPhone(currentPhone)}
                </button>
                <button
                  type="button"
                  onClick={() => void queryMyPackage()}
                  disabled={!session || loading === 'myPackage'}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-blue-500 shadow-sm disabled:text-zinc-300"
                  aria-label="查询用户套餐和合约信息">
                  {loading === 'myPackage' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CircleHelp className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                {currentLevelName}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-xl bg-white/80 px-2 py-1.5">
                  <div className="text-[10px] font-medium text-zinc-400">本月账单</div>
                  <div className="mt-0.5 text-[12px] font-bold text-zinc-800">{money(overviewBalance.allThisMonthBill)}</div>
                </div>
                <div className="rounded-xl bg-white/80 px-2 py-1.5">
                  <div className="text-[10px] font-medium text-zinc-400">实时话费</div>
                  <div className="mt-0.5 text-[12px] font-bold text-zinc-800">{money(overviewBalance.allThisMonthOutBill)}</div>
                </div>
                <div className="rounded-xl bg-white/80 px-2 py-1.5">
                  <div className="text-[10px] font-medium text-zinc-400">信控额度</div>
                  <div className="mt-0.5 text-[12px] font-bold text-zinc-800">
                    {money(readDeepString(accountOverview?.balance, ['values', 'specialTTZ']))}
                  </div>
                </div>
              </div>
            </div>
              <button
                type="button"
                onClick={() => {
                runCurrentQuery()
              }}
              disabled={!session || busy}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-blue-600 px-3 text-sm font-semibold text-white disabled:bg-blue-300">
              {loading === 'business' || loading === 'userInfo' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              查询
            </button>
          </div>
          <div className="absolute right-3 top-[54px] grid grid-cols-2 rounded-full bg-white/65 p-0.5 text-[13px] font-extrabold text-zinc-500 shadow-sm">
            <button
              type="button"
              onClick={() => switchViewMode('mobile')}
              className={cn(
                'inline-flex h-8 min-w-[58px] items-center justify-center gap-1 rounded-full px-2.5',
                viewMode === 'mobile' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500',
              )}>
              <Smartphone className="h-3.5 w-3.5" />
              手机
            </button>
            <button
              type="button"
              onClick={() => switchViewMode('broadband')}
              className={cn(
                'inline-flex h-8 min-w-[58px] items-center justify-center gap-1 rounded-full px-2.5',
                viewMode === 'broadband' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500',
              )}>
              <Wifi className="h-3.5 w-3.5" />
              宽带
            </button>
          </div>
        </header>

        <main className="-mt-3 rounded-t-[20px] bg-white px-3 py-3">
          {loginOpen ? (
            <section className="mb-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <div className="text-base font-bold">CMCC 验证码登录</div>
                  <div className="mt-0.5 text-xs text-zinc-400">可登录当前账号或其他中国移动手机号</div>
                </div>
                {session ? (
                  <button type="button" onClick={() => setLoginOpen(false)} className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100">
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <PhoneInput
                value={loginPhone}
                onValueChange={(value) => {
                  loginPhoneEditedRef.current = true
                  setLoginPhone(value)
                  setLoginCode('')
                  setLoginSmsCooldown(0)
                }}
                className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500"
                placeholder="请输入 11 位手机号"
              />
              <div className="flex gap-2">
                <input
                  value={loginCode}
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-2 h-9 min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500"
                  placeholder="10086 短信验证码"
                />
                <button
                  type="button"
                  onClick={() => void sendLoginSms()}
                  disabled={busy || loginSmsCooldown > 0 || !/^1\d{10}$/.test(loginPhone)}
                  className="mt-2 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-zinc-900 px-3 text-sm font-semibold text-white disabled:bg-zinc-300">
                  {loading === 'sendLoginSms' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}
                  {loginSmsCooldown > 0 ? `${loginSmsCooldown}s` : '发送'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => void login()}
                disabled={busy || !/^1\d{10}$/.test(loginPhone) || !/^\d{6}$/.test(loginCode)}
                className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:bg-blue-200">
                {loading === 'login' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                登录并查询
              </button>
            </section>
          ) : null}

          <div className="sticky top-0 z-30 -mx-3 mb-3 bg-white/95 px-3 pb-2 pt-1 backdrop-blur">
            <div className="relative">
              <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_44px] gap-1 sm:grid-cols-[repeat(6,minmax(0,1fr))_48px] sm:gap-2">
                {months.slice(0, 5).map((month) => {
                  const label = monthLabel(month)
                  return (
                    <button
                      type="button"
                      key={month}
                      onClick={() => {
                        setSelectedMonth(month)
                        runCurrentQuery(month, busiType)
                      }}
                      className={cn(
                        'h-[50px] min-w-0 rounded-xl border bg-white text-center',
                        selectedMonth === month ? 'border-blue-500 text-blue-600' : 'border-transparent text-zinc-900',
                      )}>
                      <div className="text-[19px] font-bold leading-6">{label.month}</div>
                      <div className="text-[12px] text-zinc-500">{label.year}</div>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setMonthPickerOpen((x) => !x)}
                  className="flex h-[50px] min-w-0 items-center justify-center rounded-xl bg-white text-zinc-700">
                  <CalendarDays className="h-6 w-6" />
                </button>
              </div>
              {monthPickerOpen ? (
                <div className="absolute right-0 top-[58px] z-20 w-[min(100%,520px)] rounded-2xl bg-white p-3 shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
                  <div className="absolute -top-3 right-5 h-6 w-6 rotate-45 bg-white" />
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {months.map((month) => {
                      const label = monthLabel(month)
                      return (
                        <button
                          type="button"
                          key={month}
                          onClick={() => {
                            setSelectedMonth(month)
                            setMonthPickerOpen(false)
                            runCurrentQuery(month, busiType)
                          }}
                          className={cn(
                            'h-16 rounded-lg bg-zinc-50 text-center',
                            selectedMonth === month ? 'border-2 border-blue-500 bg-blue-50 text-blue-500' : 'border border-transparent text-zinc-700',
                          )}>
                          <div className="text-xl font-semibold">{label.month}</div>
                          <div className="mt-0.5 text-sm text-zinc-400">{label.year}年</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {viewMode === 'broadband' ? (
            <>
              <section className="mb-3 rounded-[14px] bg-gradient-to-br from-[#238df4] to-[#45b9f5] px-5 py-5 text-white shadow-[0_10px_22px_rgba(40,150,245,0.2)]">
                <div className="grid grid-cols-[78px_1fr_38px] items-center gap-x-3 gap-y-3">
                  <span className="rounded-md bg-white/18 px-1.5 py-0.5 text-[13px] font-extrabold">宽带号码</span>
                  <strong className="min-w-0 truncate text-[19px] font-extrabold tracking-normal">{broadbandNo(selectedBroadband) || '暂无宽带'}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      if (broadbandPlans.length === 0) void queryBroadbandPlans(session)
                      setBroadbandSwitcherOpen(true)
                    }}
                    className="inline-flex h-8 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10"
                    aria-label="切换宽带号码">
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                  <span className="rounded-md bg-white/18 px-1.5 py-0.5 text-[13px] font-extrabold">安装地址</span>
                  <div className="col-span-2 min-w-0 text-[15px] font-bold leading-6">
                    <div>{firstDeepText(selectedBroadband, ['regionName', 'areaName', 'cityName']) || '吕梁'}</div>
                    <div className="break-all">{broadbandMaskedAddress(selectedBroadband)}</div>
                  </div>
                </div>
              </section>
            </>
          ) : null}

          <div className="mb-3 grid grid-cols-4 gap-1 border-b border-transparent">
            {CATEGORY_TABS.map((tab) => (
              <button
                type="button"
                key={tab.value}
                onClick={() => {
                  setBusiType(tab.value)
                }}
                className="relative min-w-0 pb-2 text-center text-[14px] font-bold">
                <span className={busiType === tab.value ? 'text-zinc-950' : 'text-zinc-500'}>{tab.label}</span>
                {busiType === tab.value ? <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-blue-500" /> : null}
              </button>
            ))}
          </div>

          {loading === 'business' ? (
            <BusinessQuerySkeleton />
          ) : businessItems.length > 0 ? (
            <div className="space-y-2">
              {businessItems.map((item, index) => {
                const status = businessStatus(item)
                const quitTime = unsubscribeTime(item)
                const expired = isExpiredBusiness(item)
                const unsubscribable = canUnsubscribe(item)
                const withdrawable = canWithdrawMainPlan(item)
                return (
                  <article
                    id={`business-${viewMode}-${busiType}-${index}`}
                    tabIndex={-1}
                    key={businessKey(item, index)}
                    className={cn(
                      'rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_8px_22px_rgba(30,50,80,0.06)] outline-none focus:ring-2 focus:ring-yellow-300',
                      expired && 'bg-zinc-50 text-zinc-400 opacity-70',
                    )}>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <h2 className={cn('min-w-0 text-[15px] font-bold leading-5 text-zinc-800', expired && 'text-zinc-400')}>
                            <HighlightText text={businessName(item)} keyword={searchKeyword} />
                          </h2>
                          <button
                            type="button"
                            onClick={() => setDetailBusiness(item)}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-zinc-400"
                            aria-label={`${businessName(item)}业务详情`}>
                            <CircleHelp className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {expired ? (
	                        <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400">已失效</span>
	                      ) : status ? (
	                        <span className="shrink-0 rounded-md border border-blue-200 px-2 py-0.5 text-xs text-blue-500">{status}</span>
	                      ) : null}
                    </div>
	                    <div className="space-y-0.5 text-[13px] leading-5 text-zinc-500">
                      {orderTime(item) ? <div>订购时间： {orderTime(item)}</div> : null}
                      <div>有效期限： {validPeriod(item) || '暂无'}</div>
                      {quitTime ? <div>退订时间： {quitTime}</div> : null}
                    </div>
                    {canManageBusiness && (unsubscribable || withdrawable) ? (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveBusiness(item)
                            setUnsubscribeResult(null)
                            setFeedback({ selectedReasons: [], otherReason: '' })
                            const key = businessDraftKey(session, item)
                            const draft = unsubscribeDrafts[key]
                            setUnsubscribeCode(draft?.code || '')
                            setUnsubscribeSmsSent(Boolean(draft?.smsSent))
                            setSmsCooldown(draft ? Math.max(0, Math.ceil((draft.cooldownUntil - Date.now()) / 1000)) : 0)
                          }}
                          className="h-8 min-w-[82px] rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700">
                          {withdrawable ? '撤销' : '退订'}
                        </button>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          ) : (
	            <div className="rounded-2xl bg-white px-5 py-12 text-center text-[14px] text-zinc-500 shadow-[0_8px_24px_rgba(30,50,80,0.07)]">
              {session ? '暂无业务数据，请点击查询' : '请先登录或切换账号'}
            </div>
          )}
        </main>
      </div>

      <BusinessSearchDialog
        open={searchOpen}
        items={businessSearchItems}
        onClose={() => setSearchOpen(false)}
        onSelect={(item, keyword) => {
          setSearchKeyword(keyword)
          const parts = item.id.split(':')
          if (parts[0] === 'package') {
            setPackageActiveTab(parts[1] === 'contract' ? 'contract' : 'detail')
            setPackageDialogOpen(true)
            if (parts[1] === 'contract' && parts[2]) {
              setPendingSearchTarget(`package-contract-${parts[2]}`)
            }
            return
          }
          const mode = parts[1] === 'broadband' ? 'broadband' : 'mobile'
          const type = parts[2] || DEFAULT_BUSI_TYPE
          const index = parts[3] || '0'
          setViewMode(mode)
          setBusiType(type)
          setPendingSearchTarget(`business-${mode}-${type}-${index}`)
        }}
      />

      {broadbandSwitcherOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/55">
          <button
            type="button"
            aria-label="关闭宽带号码切换"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setBroadbandSwitcherOpen(false)}
          />
          <section className="relative mx-auto w-full max-w-[680px] rounded-t-[28px] bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl">
            <div className="relative mb-5 flex items-center justify-center">
              <h3 className="text-center text-[24px] font-extrabold leading-8 text-zinc-950">宽带号码切换</h3>
              <button
                type="button"
                onClick={() => setBroadbandSwitcherOpen(false)}
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            {loading === 'broadbandPlans' ? (
              <div className="space-y-3">
                <SkeletonBar className="h-20 w-full rounded-xl" />
                <SkeletonBar className="h-20 w-full rounded-xl" />
              </div>
            ) : broadbandPlans.length > 0 ? (
              <div className="space-y-3">
                {broadbandPlans.map((plan) => {
                  const active = plan.id === selectedBroadband?.id
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => selectBroadband(plan)}
                      className={cn(
                        'relative w-full rounded-xl border px-6 py-4 text-left',
                        active ? 'border-blue-400 bg-white' : 'border-transparent bg-zinc-50',
                      )}>
                      {active ? (
                        <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-xl bg-blue-500 px-3 py-1 text-[15px] font-extrabold text-white">
                          当前
                        </span>
                      ) : null}
                      <div className="text-[22px] font-extrabold leading-7 text-zinc-800">{broadbandNo(plan)}</div>
                      <div className="mt-1 text-[16px] font-semibold leading-6 text-zinc-500">
                        {firstDeepText(plan, ['regionName', 'areaName', 'cityName']) || '吕梁'}
                      </div>
                      <div className="mt-1 break-all text-[15px] font-semibold leading-6 text-zinc-500">{broadbandMaskedAddress(plan)}</div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-50 px-6 py-10 text-center text-zinc-500">暂无可切换宽带号码</div>
            )}
          </section>
        </div>
      ) : null}

      {detailBusiness ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/55">
          <button
            type="button"
            aria-label="关闭业务详情"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setDetailBusiness(null)}
          />
          <div className="relative max-h-[82vh] w-full overflow-y-auto rounded-t-[24px] bg-white px-4 pb-6 pt-4 shadow-2xl sm:mx-auto sm:max-w-[560px]">
            <div className="mb-3 flex items-center justify-center">
              <h3 className="max-w-[calc(100%-52px)] truncate text-center text-[22px] font-bold leading-8 text-zinc-950">
                {businessName(detailBusiness)}
              </h3>
              <button
                type="button"
                onClick={() => setDetailBusiness(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 border-t border-zinc-100" />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl bg-sky-50 px-4 py-4 text-zinc-700">
              <span className="text-[18px] font-bold">业务详情</span>
              {productPlanningId(detailBusiness) ? (
                <span className="break-all text-[14px] font-semibold leading-6 text-zinc-500">
                  产品策划 ID：{productPlanningId(detailBusiness)}
                </span>
              ) : null}
            </div>
            <p className="mt-4 whitespace-pre-wrap text-[16px] leading-7 text-zinc-500">{businessDescription(detailBusiness)}</p>
            {!canUnsubscribe(detailBusiness) ? (
              <div className="mt-5 rounded-xl bg-zinc-50 px-4 py-4">
                <div className="flex items-center gap-2 text-[16px] font-bold text-zinc-700">
                  <AlertCircle className="h-5 w-5" />
                  当前业务暂不支持退订，原因如下：
                </div>
                <div className="mt-3 text-[15px] leading-7 text-zinc-500">{businessUnsupportedReason(detailBusiness)}</div>
                <div className="mt-3 text-[14px] leading-6 text-zinc-400">
                  *更多信息可联系在线客服或拨打10086为您解答，感谢您的理解与支持~
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setDetailBusiness(null)}
              className="mt-6 h-12 w-full rounded-full bg-blue-500 text-[18px] font-bold text-white">
              我知道了
            </button>
          </div>
        </div>
      ) : null}

      {userInfoDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/55">
          <button
            type="button"
            aria-label="关闭用户信息"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setUserInfoDialogOpen(false)}
          />
          <section className="relative mx-auto max-h-[82vh] w-full max-w-[560px] overflow-y-auto rounded-t-[24px] bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl scrollbar-none">
            <div className="relative mb-4 flex items-center justify-center">
              <h3 className="max-w-[calc(100%-56px)] text-center text-[24px] font-bold leading-9 text-zinc-950">用户信息</h3>
              <button
                type="button"
                onClick={() => setUserInfoDialogOpen(false)}
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="rounded-2xl bg-sky-50 px-4 py-4">
              <div className="text-[18px] font-bold text-zinc-900">{maskPhone(currentPhone)}</div>
              <div className="mt-1 text-[14px] leading-6 text-zinc-500">
                {text(overviewUser.userName, '未知用户')} · {currentLevelName}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ['本月账单', money(overviewBalance.allThisMonthBill)],
                ['实时话费', money(overviewBalance.allThisMonthOutBill)],
                ['本月充值', money(overviewBalance.allThisMonthEntryBill)],
                ['上月账单', money(overviewBalance.allLastMonthBill)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-zinc-50 px-3 py-3">
                  <div className="text-[12px] font-medium text-zinc-400">{label}</div>
                  <div className="mt-1 text-[18px] font-bold text-zinc-900">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-zinc-100">
              {keyValueRows([
                ['姓名', overviewUser.userName],
                ['手机号码', overviewUser.userNum || currentPhone],
                ['用户状态', overviewUser.userStatus],
                ['星级', overviewUser.starLevel ? `${overviewUser.starLevel}星` : ''],
                ['星级到期', overviewUser.starTime],
                ['入网时间', overviewUser.userBegin],
                ['在网时长', overviewUser.userAge],
                ['实名状态', overviewUser.realNameInfo],
                ['生日', overviewUser.birthday],
                ['联系地址', overviewUser.userAdd],
                ['账期日', overviewUser.accountDay ? `${overviewUser.accountDay}日` : ''],
                ['办理渠道', overviewUser.userChannel],
              ]).map(([label, value]) => (
                <div key={label} className="flex gap-3 border-b border-zinc-100 px-4 py-3 last:border-b-0">
                  <div className="w-20 shrink-0 text-[14px] font-medium text-zinc-400">{label}</div>
                  <div className="min-w-0 flex-1 break-words text-[15px] font-semibold text-zinc-700">{value}</div>
                </div>
              ))}
            </div>
            {overviewAccounts.length > 0 ? (
              <div className="mt-4">
                <div className="mb-2 text-[16px] font-bold text-zinc-900">账本信息</div>
                <div className="space-y-2">
                  {overviewAccounts.map((item, index) => (
                    <div key={`${text(item.accoutTypeName)}-${index}`} className="rounded-xl bg-zinc-50 px-4 py-3">
                      <div className="text-[15px] font-bold text-zinc-800">{text(item.accoutTypeName, '话费账本')}</div>
                      <div className="mt-2 grid grid-cols-2 gap-y-1 text-[13px] leading-6 text-zinc-500">
                        <span>本月账单：{money(item.thisMonthBill)}</span>
                        <span>实时话费：{money(item.thisMonthOutBill)}</span>
                        <span>本月充值：{money(item.thisMonthEntryBill)}</span>
                        <span>上月账单：{money(item.lastMonthBill)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {accountOverview?.userError?.message || accountOverview?.balanceError?.message ? (
              <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[13px] leading-6 text-amber-700">
                {accountOverview.userError?.message || accountOverview.balanceError?.message}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setUserInfoDialogOpen(false)}
              className="mt-5 h-12 w-full rounded-full bg-blue-500 text-[18px] font-bold text-white">
              我知道了
            </button>
          </section>
        </div>
      ) : null}

      {packageDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60">
          <button
            type="button"
            aria-label="关闭套餐详情"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setPackageDialogOpen(false)}
          />
          <section className="relative mx-auto flex max-h-[90vh] min-h-[72vh] w-full max-w-[560px] flex-col rounded-t-[24px] bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl">
            <div className="relative mb-4 flex items-center justify-center">
              <h3 className="max-w-[calc(100%-56px)] truncate text-center text-[25px] font-bold leading-9 text-zinc-950">
                <HighlightText text={packageTitle} keyword={searchKeyword} />
              </h3>
              <button
                type="button"
                onClick={() => setPackageDialogOpen(false)}
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="border-t border-zinc-200" />
            <div className="flex items-center gap-5 py-4 text-[19px] font-bold text-zinc-950">
              <button
                type="button"
                onClick={() => setPackageActiveTab('detail')}
                className="relative h-9">
                套餐详情
                {packageActiveTab === 'detail' ? (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-blue-500" />
                ) : null}
              </button>
              <span className="h-5 w-px bg-zinc-300" />
              <button
                type="button"
                onClick={() => setPackageActiveTab('contract')}
                className="relative h-9">
                套餐合约
                {packageActiveTab === 'contract' ? (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-blue-500" />
                ) : null}
              </button>
            </div>
            <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto pb-4">
              {loading === 'myPackage' && !myPackageData ? (
                <div className="space-y-4 pt-4">
                  <SkeletonBar className="h-16 w-full rounded-xl" />
                  <SkeletonBar className="h-7 w-[70%]" />
                  <SkeletonBar className="h-7 w-[52%]" />
                </div>
              ) : packageError && !myPackageData ? (
                <div className="rounded-2xl bg-rose-50 px-4 py-5 text-[16px] leading-7 text-rose-600">{packageError}</div>
              ) : packageActiveTab === 'detail' ? (
                <div className="pt-3">
                  <div className="rounded-xl bg-sky-50 px-5 py-5 text-[20px] font-bold text-zinc-700">套餐说明</div>
                  <div className="mt-5 space-y-4">
                    {packageDescriptions.length > 0 ? (
                      packageDescriptions.map((item) => (
                        <div key={item} className="flex items-start gap-4 text-[20px] leading-8 text-zinc-500">
                          <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-[16px] text-zinc-400">暂无套餐说明</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  {myPackageData?.contractError?.message ? (
                    <div className="mb-3 rounded-xl bg-zinc-50 px-4 py-3 text-[14px] leading-6 text-zinc-500">
                      合约信息暂不可用：{myPackageData.contractError.message}
                    </div>
                  ) : null}
                  {packageContracts.length > 0 ? (
                    packageContracts.map((item, index) => {
                      const status = contractStatus(item)
                      const canCancel = contractCanUnsubscribe(item)
                      return (
                        <article id={`package-contract-${index}`} tabIndex={-1} key={businessKey(item, index)} className="border-b border-zinc-200 py-5 outline-none focus:ring-2 focus:ring-yellow-300">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <h4 className="text-[20px] font-bold leading-7 text-zinc-800"><HighlightText text={contractName(item)} keyword={searchKeyword} /></h4>
                                {status ? (
                                  <span className="rounded-md border border-blue-300 px-2 py-0.5 text-[15px] font-semibold leading-5 text-blue-500">
                                    {status}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {canManageBusiness && canCancel ? (
                              <button
                                type="button"
                                onClick={() => openContractUnsubscribe(item)}
                                className="mt-0.5 h-8 shrink-0 rounded-full border border-blue-400 px-4 text-[15px] font-bold leading-none text-blue-500">
                                退订
                              </button>
                            ) : null}
                          </div>
                          <div className="space-y-1.5 text-[17px] leading-7 text-zinc-500">
                            {contractOrderTime(item) ? <div>订购时间： {contractOrderTime(item)}</div> : null}
                            <div>有效期限： {contractValidPeriod(item) || '暂无'}</div>
                          </div>
                        </article>
                      )
                    })
                  ) : (
                    <div className="py-16 text-center text-[16px] text-zinc-400">暂无套餐合约</div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPackageDialogOpen(false)}
              className="mt-2 h-14 w-full shrink-0 rounded-full bg-blue-500 text-[22px] font-bold text-white shadow-[0_8px_20px_rgba(37,127,255,0.28)]">
              我知道了
            </button>
          </section>
        </div>
      ) : null}

      {activeBusiness ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 px-4 py-24">
          <div className="relative my-auto w-full max-w-[480px] shrink-0">
            {unsubscribeResult ? (
              <div className="relative pt-16">
                <div className="pointer-events-none absolute left-3 top-0 z-10 flex items-end">
                  <CryingMascot variant={unsubscribeResult.ok ? 'tearful' : 'sad'} />
                  <div className="relative mb-8 -ml-1 rounded-md bg-sky-500 px-3 py-2 text-[15px] font-bold text-white shadow-sm">
                    {unsubscribeResult.ok
                      ? activeIsMainPlanWithdraw
                        ? '主套餐撤销已提交~'
                        : '告诉我退订原因吧，我一定会改进~'
                      : '办理遇到问题了，请稍后再试~'}
                    <span className="absolute -bottom-1 left-4 h-3 w-3 rotate-45 bg-sky-500" />
                  </div>
                </div>
                <div className="relative max-h-[calc(86vh-64px)] overflow-y-auto rounded-[24px] bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl">
                  <button
                    type="button"
                    onClick={closeUnsubscribeDialog}
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                    <X className="h-6 w-6" />
                  </button>
                  <div className="mb-4 flex items-center justify-center gap-2 text-center text-[24px] font-bold">
                    {unsubscribeResult.ok ? (
                      <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-7 w-7 text-rose-500" />
                    )}
                    <span>
                      {unsubscribeResult.ok
                        ? activeIsMainPlanWithdraw
                          ? '撤销成功'
                          : '退订成功'
                        : activeIsMainPlanWithdraw
                          ? '撤销失败'
                          : '退订失败'}
                    </span>
                  </div>
                  <div className="mb-5 border-t border-zinc-100" />
                  <div className="text-[16px] leading-7 text-zinc-700">
                    {unsubscribeResult.ok ? (
                      activeIsMainPlanWithdraw ? (
                        <>
                          您好！您已成功撤销主套餐
                          <span className="text-blue-600">“{unsubscribeResult.businessName || businessName(activeBusiness)}”</span>
                          。
                        </>
                      ) : (
                        <>
                          您好！您已成功退订
                          <span className="text-blue-600">“{unsubscribeResult.businessName || businessName(activeBusiness)}”</span>
                          ，{businessUnsubscribeTimeLabel(unsubscribeResult.effectiveTimeType || '')}。
                        </>
                      )
                    ) : (
                      <>
                        {formatUpstreamErrorMessage(unsubscribeResult.message, unsubscribeResult.errorCode)}
                        {unsubscribeResult.errorCode ? <span className="ml-1 text-sm text-zinc-400">错误码：{unsubscribeResult.errorCode}</span> : null}
                      </>
                    )}
                  </div>
                  {unsubscribeResult.ok && !activeIsMainPlanWithdraw ? (
                    <>
                      <div className="my-5 rounded-md bg-zinc-50 py-3 text-center text-[18px] font-bold text-zinc-900">
                        您退订这个业务的原因
                      </div>
                      <div className="space-y-4">
                        {UNSUBSCRIBE_REASONS.map((reason) => (
                          <label key={reason} className="flex cursor-pointer items-center gap-3 text-[16px] text-zinc-900">
                            <input
                              type="checkbox"
                              checked={feedback.selectedReasons.includes(reason)}
                              onChange={() => toggleFeedbackReason(reason)}
                              className="h-5 w-5 rounded border-zinc-300 text-blue-500"
                            />
                            <span>{reason}</span>
                          </label>
                        ))}
                        <label className="flex cursor-pointer items-center gap-3 text-[16px] text-zinc-900">
                          <span className="flex h-5 w-5 items-center justify-center rounded border border-zinc-300" />
                          <span>其他：</span>
                        </label>
                        <div className="relative">
                          <textarea
                            value={feedback.otherReason}
                            onChange={(e) => setFeedback((current) => ({ ...current, otherReason: e.target.value.slice(0, 50) }))}
                            className="h-28 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-base outline-none focus:border-blue-400"
                            placeholder="请输入文字内容，仅支持中文、英文、数字及常用标点..."
                          />
                          <div className="absolute bottom-3 right-4 text-sm text-zinc-300">{feedback.otherReason.length}/50</div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={closeUnsubscribeDialog}
                      className="h-12 rounded-full bg-zinc-100 text-lg font-bold text-zinc-600">
                      关闭
                    </button>
                    <button
                      type="button"
                      disabled={!unsubscribeResult.ok || (!activeIsMainPlanWithdraw && !canSubmitFeedback)}
                      onClick={closeUnsubscribeDialog}
                      className="h-12 rounded-full bg-blue-500 text-lg font-bold text-white disabled:bg-blue-200">
                      {activeIsMainPlanWithdraw ? '完成' : '确认'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-[24px] bg-white px-5 pb-5 pt-5 shadow-2xl">
                <div className="absolute -top-20 left-2 flex items-end">
                  <div className="scale-125">
                    <CryingMascot />
                  </div>
                  <div className="mb-11 -ml-2 rounded-md bg-sky-500 px-3 py-2 text-[15px] font-bold text-white">
                    {activeIsMainPlanWithdraw ? '确认撤销这个主套餐吗~' : '真的不要我了吗，再考虑一下吧~'}
                  </div>
                </div>
                <div className="mb-4 text-center text-[24px] font-bold">
                  {activeIsMainPlanWithdraw ? '撤销确认' : '退订确认'}
                </div>
                <div className="mb-4 border-t border-zinc-100" />
                <div className="mb-5 text-[16px] leading-7 text-zinc-700">
                  {activeIsMainPlanWithdraw ? (
                    <>
                      您好！您的 {maskPhone(currentPhone)} 手机号码即将撤销主套餐
                      <span className="text-blue-600">“{businessName(activeBusiness)}”</span>
                      ，如需办理请输入短信验证码并点击“确认”。
                    </>
                  ) : (
                    <>
                      您好！您的 {maskPhone(currentPhone)} 手机号码即将退订
                      <span className="text-blue-600">“{businessName(activeBusiness)}”</span>
                      业务，{businessUnsubscribeTimeLabel(effectiveTimeType)}。如需办理请输入短信验证码并点击“确认”。
                    </>
                  )}
                </div>
                {!activeIsMainPlanWithdraw && effectiveTimeOptions.length > 1 ? (
                  <label className="mb-4 flex items-center justify-between gap-3 text-sm text-zinc-700">
                    <span className="shrink-0">失效方式</span>
                    <select
                      aria-label="退订失效方式"
                      value={effectiveTimeType}
                      disabled={busy || unsubscribeSmsSent}
                      onChange={(event) => setEffectiveTimeChoice(event.target.value)}
                      className="h-11 min-w-0 rounded-md border border-zinc-200 bg-white px-3 text-base outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-zinc-50"
                    >
                      {effectiveTimeOptions.map((value) => <option key={value} value={value}>{businessUnsubscribeTimeLabel(value)}</option>)}
                    </select>
                  </label>
                ) : null}
                {canCustomizeBusinessIds ? (
                  <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
                    <div className="mb-2 text-sm font-bold text-blue-700">自定义业务ID</div>
                    <div className="grid gap-2">
                      {(['planId', 'productCode', 'offerId'] as const).map((field) => (
                        <label key={field} className="grid gap-1 text-xs font-semibold text-zinc-500">
                          <span>{field}</span>
                          <input
                            value={businessIdOverrideDraft[field]}
                            onChange={(e) =>
                              setBusinessIdOverrideDraft((current) => ({
                                ...current,
                                [field]: e.target.value.trim().slice(0, 80),
                              }))
                            }
                            className="h-10 rounded-xl border border-blue-100 bg-white px-3 text-sm font-medium text-zinc-800 outline-none focus:border-blue-400"
                            placeholder={`请输入 ${field}`}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mb-3 flex h-12 items-center rounded-xl border border-zinc-200 px-4">
                  <input
                    value={unsubscribeCode}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) => setUnsubscribeCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="min-w-0 flex-1 text-base outline-none placeholder:text-zinc-300"
                    placeholder="请输入短信验证码"
                  />
                  <button
                    type="button"
                    onClick={() => void sendUnsubscribeSms()}
                    disabled={busy || smsCooldown > 0}
                    className="ml-3 shrink-0 text-base font-bold text-blue-500 disabled:text-blue-300">
                    {loading === 'unsubscribeSms' ? '发送中' : smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码'}
                  </button>
                </div>
                <div className="mb-5 text-center text-sm text-zinc-400">验证码有效期5分钟，重新获取间隔1分钟</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={closeUnsubscribeDialog}
                    className="h-12 rounded-2xl bg-zinc-100 text-lg font-bold text-zinc-600">
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => void unsubscribe()}
                    disabled={!canConfirmUnsubscribe}
                    className="h-12 rounded-2xl bg-blue-500 text-lg font-bold text-white disabled:bg-blue-200">
                    {loading === 'unsubscribe' ? '提交中' : activeIsMainPlanWithdraw ? '确认撤销' : '确认'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
