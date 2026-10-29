import crypto from 'node:crypto'
import { getPrisma } from './prisma.js'

export type BroadbandFlowType = 'install' | 'renewal'
export type BroadbandOperationMode = 'install' | 'renewal_aj' | 'renewal_single'
export type BroadbandJsonValue = string | number | boolean | null | BroadbandJsonValue[] | BroadbandJsonObject
export type BroadbandJsonObject = { [key: string]: BroadbandJsonValue }

export type BroadbandProductConfig = {
  id: string
  configKey: string
  flowType: BroadbandFlowType
  operationMode: BroadbandOperationMode
  displayName: string
  description: string
  category: string
  fields: BroadbandJsonObject
  source: 'builtin' | 'custom' | 'runtime'
  editable: boolean
  attemptedFromFlow?: BroadbandFlowType
  createdAt?: string
  updatedAt?: string
}

function object(value: BroadbandJsonValue | undefined): BroadbandJsonObject {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function valueText(value: BroadbandJsonValue | undefined): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : ''
}

export function projectBroadbandConfig(
  config: BroadbandProductConfig,
  targetFlow: BroadbandFlowType,
): BroadbandProductConfig {
  if (config.flowType === targetFlow) return config

  if (targetFlow === 'install') {
    const businessInfo = object(config.fields.businessInfo)
    const offerCode = valueText(businessInfo.offerId) || valueText(businessInfo.busiSelect)
    return {
      ...config,
      id: `projected:install:${config.id}`,
      configKey: `attempt-install-${config.configKey}`,
      flowType: 'install',
      operationMode: 'install',
      description: config.description || '由续约产品配置转换，可编辑字段后尝试新装',
      fields: {
        ...config.fields,
        query: { PACKAGECODE: config.category },
        selection: {
          OFFER_ID: offerCode,
          PITEMSHOWCODE: offerCode,
          PACKAGECODE: config.category,
          PRODUCTSHOWCODE: config.category,
          info: config.displayName,
          chooseName: config.description,
        },
        commit: object(config.fields.commit),
      },
      attemptedFromFlow: config.flowType,
    }
  }

  const selection = object(config.fields.selection)
  const offerCode = valueText(selection.OFFER_ID) || valueText(selection.PITEMSHOWCODE)
  return {
    ...config,
    id: `projected:renewal:${config.id}`,
    configKey: `attempt-renewal-${config.configKey}`,
    flowType: 'renewal',
    operationMode: 'renewal_aj',
    description: config.description || '由新装产品配置转换，可编辑字段后尝试续约',
    fields: {
      ...config.fields,
      bbBusiType: config.category,
      busiCode: '',
      businessInfo: {
        offerName: config.displayName,
        offerVasFee: '',
        hyq: '',
        paymentType: '1',
        opType: '1',
        busiSelect: offerCode,
        invoicetype: '',
      },
    },
    attemptedFromFlow: config.flowType,
  }
}

type ConfigInput = Omit<BroadbandProductConfig, 'id' | 'source' | 'editable' | 'createdAt' | 'updatedAt'>

function renewalAj(args: {
  key: string
  name: string
  category: string
  code: string
  fee: number
  months: number
  description: string
}): BroadbandProductConfig {
  return {
    id: `builtin:${args.key}`,
    configKey: args.key,
    flowType: 'renewal',
    operationMode: 'renewal_aj',
    displayName: args.name,
    description: args.description,
    category: args.category,
    fields: {
      bbBusiType: args.category,
      busiCode: '',
      businessInfo: {
        offerName: args.name,
        offerVasFee: String(args.fee * 100),
        hyq: String(args.months),
        paymentType: '1',
        opType: '1',
        busiSelect: args.code,
        invoicetype: '',
        sxykdUsersceneType: '',
        ykdUsersceneType: '',
        sltSpeedup: '',
        boxType: '',
      },
      sltSpeedup: '',
      newMainPhone: '',
      sxykdUsersceneType: '',
      ykdUsersceneType: '',
      boxType: '',
    },
    source: 'builtin',
    editable: false,
  }
}

const installPresets: BroadbandProductConfig[] = [
  ['AJ', '爱家宽带', '爱家宽带产品实时查询', 'ajkd'],
  ['LK', '单宽带', '单宽带新装产品实时查询', 'lkkd'],
  ['SCKD', '相关宽带', '相关宽带产品实时查询', 'sckd'],
  ['SXY', '随心用宽带', '随心用宽带产品实时查询', 'sxykd'],
].map(([packageCode, displayName, description, productShowCode]) => ({
  id: `builtin:install-${packageCode.toLowerCase()}`,
  configKey: `install-${packageCode.toLowerCase()}`,
  flowType: 'install' as const,
  operationMode: 'install' as const,
  displayName,
  description,
  category: packageCode,
  fields: {
    query: { PACKAGECODE: packageCode },
    selection: {
      PACKAGECODE: packageCode === 'AJ' ? 'YDKD500M' : packageCode,
      PRODUCTSHOWCODE: productShowCode,
      pageCode: '',
      ADDRESSINFO: '',
      time: '',
      kaiguan: true,
      BAR_COM: '',
      community_id: '',
      selectZNZWItem: '',
    },
    commit: {},
  },
  source: 'builtin' as const,
  editable: false,
}))

const ajPresets = [
  ['aj-200m', '爱家融合版 200M', 'AJKD', '11900', 78, 24, '承诺手机实付通信费 78 元/月'],
  ['aj-300m', '爱家融合版 300M', 'AJKD', '1192', 98, 24, '承诺手机实付通信费 98 元/月'],
  ['aj-500m', '爱家融合版 500M', 'AJKD', '1193', 128, 24, '承诺手机实付通信费 128 元/月'],
  ['aj-1000m', '爱家融合版 1000M', 'AJKD', '1194', 198, 24, '承诺手机实付通信费 198 元/月'],
  ['rh-300m', '融合宽带套餐版 300M', 'RHKD', 'rhkd001', 79, 24, '主套餐 78 元及以上'],
  ['rh-500m', '融合宽带套餐版 500M', 'RHKD', 'rhkd002', 99, 24, '主套餐 98 元及以上'],
  ['rh-1000m', '融合宽带套餐版 1000M', 'RHKD', 'rhkd003', 139, 24, '主套餐 139 元及以上'],
  ['rjk-500m', '荣军卡专享 500M', 'RJKZX', 'rjkkd001', 59, 24, '主套餐 59 元及以上'],
  ['rjk-1000m', '荣军卡专享 1000M', 'RJKZX', 'rjkkd002', 79, 24, '主套餐 79 元及以上'],
] as const

const cloudFees = [89, 99, 109, 119, 129, 139, 149, 159, 169, 179, 189, 199, 209, 219, 229, 249, 279, 309, 339, 379, 409, 479, 519, 609]
const cloudPresets = cloudFees.map((fee, index) => renewalAj({
  key: `cloud-${fee}`,
  name: `云宽带 ${fee} 元档`,
  category: 'YUNKD',
  code: `ykd${String(76 + index).padStart(3, '0')}`,
  fee,
  months: 36,
  description: '36 个月合约方案，最终带宽和资格以上游返回为准',
}))

export const BROADBAND_PRODUCT_PRESETS: ReadonlyArray<BroadbandProductConfig> = [
  ...installPresets,
  ...ajPresets.map(([key, name, category, code, fee, months, description]) => renewalAj({
    key, name, category, code, fee, months, description,
  })),
  ...cloudPresets,
]

type ConfigRow = {
  id: string
  configKey: string
  flowType: BroadbandFlowType
  operationMode: BroadbandOperationMode
  displayName: string
  description: string
  category: string
  fieldsJson: string
  createdAt: Date
  updatedAt: Date
}

let storageReady: Promise<void> | null = null

async function ensureStorage(): Promise<void> {
  if (!storageReady) {
    storageReady = getPrisma().$executeRawUnsafe(`
      create table if not exists "BroadbandOrderConfig" (
        "id" text primary key,
        "configKey" text not null unique,
        "flowType" text not null,
        "operationMode" text not null,
        "displayName" text not null,
        "description" text not null default '',
        "category" text not null default '',
        "fieldsJson" text not null,
        "createdAt" timestamp(3) not null default current_timestamp,
        "updatedAt" timestamp(3) not null default current_timestamp
      )
    `).then(() => undefined).catch((error) => {
      storageReady = null
      throw error
    })
  }
  await storageReady
}

function toConfig(row: ConfigRow): BroadbandProductConfig {
  return {
    id: row.id,
    configKey: row.configKey,
    flowType: row.flowType,
    operationMode: row.operationMode,
    displayName: row.displayName,
    description: row.description,
    category: row.category,
    fields: JSON.parse(row.fieldsJson) as BroadbandJsonObject,
    source: 'custom',
    editable: true,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

const selectFields = '"id", "configKey", "flowType", "operationMode", "displayName", "description", "category", "fieldsJson", "createdAt", "updatedAt"'

export async function listBroadbandProductConfigs(): Promise<BroadbandProductConfig[]> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<ConfigRow[]>(
    `select ${selectFields} from "BroadbandOrderConfig" order by "flowType", "category", "displayName"`,
  )
  return [...BROADBAND_PRODUCT_PRESETS, ...rows.map(toConfig)]
}

export async function getBroadbandProductConfig(id: string): Promise<BroadbandProductConfig | undefined> {
  const builtin = BROADBAND_PRODUCT_PRESETS.find((item) => item.id === id || item.configKey === id)
  if (builtin) return builtin
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<ConfigRow[]>(
    `select ${selectFields} from "BroadbandOrderConfig" where "id" = $1 or "configKey" = $1 limit 1`,
    id,
  )
  return rows[0] ? toConfig(rows[0]) : undefined
}

export async function createBroadbandProductConfig(input: ConfigInput): Promise<BroadbandProductConfig> {
  await ensureStorage()
  const id = crypto.randomUUID()
  const rows = await getPrisma().$queryRawUnsafe<ConfigRow[]>(
    `insert into "BroadbandOrderConfig" ("id", "configKey", "flowType", "operationMode", "displayName", "description", "category", "fieldsJson", "createdAt", "updatedAt")
     values ($1, $2, $3, $4, $5, $6, $7, $8, now(), now()) returning ${selectFields}`,
    id, input.configKey, input.flowType, input.operationMode, input.displayName, input.description, input.category, JSON.stringify(input.fields),
  )
  if (!rows[0]) throw new Error('CREATE_BROADBAND_CONFIG_FAILED')
  return toConfig(rows[0])
}

export async function updateBroadbandProductConfig(id: string, input: ConfigInput): Promise<BroadbandProductConfig | undefined> {
  await ensureStorage()
  const rows = await getPrisma().$queryRawUnsafe<ConfigRow[]>(
    `update "BroadbandOrderConfig" set "configKey" = $2, "flowType" = $3, "operationMode" = $4,
       "displayName" = $5, "description" = $6, "category" = $7, "fieldsJson" = $8, "updatedAt" = now()
     where "id" = $1 returning ${selectFields}`,
    id, input.configKey, input.flowType, input.operationMode, input.displayName, input.description, input.category, JSON.stringify(input.fields),
  )
  return rows[0] ? toConfig(rows[0]) : undefined
}

export function validateBroadbandConfig(value: unknown): ConfigInput {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const flowType = String(source.flowType || '') as BroadbandFlowType
  const operationMode = String(source.operationMode || '') as BroadbandOperationMode
  const configKey = String(source.configKey || '').trim()
  const displayName = String(source.displayName || '').trim()
  const description = String(source.description || '').trim().slice(0, 300)
  const category = String(source.category || '').trim().slice(0, 40)
  if (!/^[A-Za-z0-9_-]{2,80}$/.test(configKey)) throw new Error('配置标识仅支持字母、数字、下划线和短横线')
  if (!displayName || displayName.length > 100) throw new Error('业务名称不能为空且不能超过100字')
  if (!['install', 'renewal'].includes(flowType)) throw new Error('业务类型不正确')
  if (!['install', 'renewal_aj', 'renewal_single'].includes(operationMode)) throw new Error('提交模式不正确')
  if ((flowType === 'install') !== (operationMode === 'install')) throw new Error('业务类型与提交模式不匹配')
  const fields = source.fields && typeof source.fields === 'object' && !Array.isArray(source.fields)
    ? source.fields as BroadbandJsonObject
    : undefined
  if (!fields) throw new Error('业务字段必须是 JSON 对象')
  const serialized = JSON.stringify(fields)
  if (serialized.length > 50_000) throw new Error('业务字段不能超过50KB')
  if (/"(?:__proto__|prototype|constructor)"\s*:/.test(serialized)) throw new Error('业务字段包含不允许的键')
  return { configKey, flowType, operationMode, displayName, description, category, fields }
}

export const __test__ = { projectBroadbandConfig, validateBroadbandConfig }
