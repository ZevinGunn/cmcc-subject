import type { BmccActivityConfig } from './bmccActivityOrderApi'

export const BMCC_ACTIVITY_FIELDS: Array<{
  key: Exclude<keyof BmccActivityConfig, 'isQd2018'>
  label: string
  required?: boolean
  wide?: boolean
}> = [
  { key: 'activityName', label: '活动标识 activityName', required: true },
  { key: 'displayName', label: '配置显示名称', required: true },
  { key: 'proType', label: '初始化类型 proType（实时查询模式）' },
  { key: 'activityUrl', label: '北京移动活动地址', wide: true },
  { key: 'packageId', label: '活动策划 ID packageId', required: true },
  { key: 'packageCode', label: '活动编码 packageCode', required: true },
  { key: 'packageName', label: '活动名称 packageName' },
  { key: 'productShowCode', label: '资源编码 productShowCode（固定直订模式）' },
  { key: 'productShowName', label: '资源名称 productShowName' },
  { key: 'productSendUrl', label: '资源发送参数 productSendUrl' },
  { key: 'pitemShowCode', label: '资源动作 pitemShowCode', required: true },
  { key: 'pitemShowName', label: '资源动作名称 pitemShowName' },
  { key: 'pitemSendUrl', label: '动作发送参数 pitemSendUrl' },
  { key: 'mtOtherParams', label: '短信扩展参数 mtOtherParams' },
  { key: 'prodValue', label: '产品值 prodValue' },
]
