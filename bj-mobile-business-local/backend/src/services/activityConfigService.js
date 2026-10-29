import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const activityDir = resolve(__dirname, '../../activities')
const allowedStepNames = new Set(['eligibility', 'existingBroadband', 'precheck', 'realName', 'commit'])
const activities = new Map()

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function validateTemplateValue(value, label) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)) {
      assert(/^(activity\.product|input|session\.userInfo)\.[A-Za-z0-9_.]+$/.test(match[1]), `${label} 包含非法模板变量 ${match[1]}`)
    }
    return
  }
  if (Array.isArray(value)) return value.forEach((item, index) => validateTemplateValue(item, `${label}[${index}]`))
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) validateTemplateValue(item, `${label}.${key}`)
  }
}

function validateActivity(activity, filename) {
  assert(activity && typeof activity === 'object', `${filename} 必须是 JSON 对象`)
  assert(/^[a-z0-9][a-z0-9-]{2,63}$/.test(activity.id || ''), `${filename} 的 id 非法`)
  assert(typeof activity.name === 'string' && activity.name.trim(), `${activity.id} 缺少 name`)
  assert(activity.transport === 'bmcc-portal-v1', `${activity.id} 使用了不支持的 transport`)
  assert(activity.product && typeof activity.product.itemCode === 'string', `${activity.id} 缺少 product.itemCode`)
  assert(Array.isArray(activity.form), `${activity.id} 的 form 必须是数组`)
  assert(activity.steps && typeof activity.steps === 'object', `${activity.id} 缺少 steps`)
  for (const required of ['eligibility', 'precheck', 'realName', 'commit']) {
    assert(activity.steps[required], `${activity.id} 缺少 ${required} 步骤`)
  }
  for (const [name, step] of Object.entries(activity.steps)) {
    assert(allowedStepNames.has(name), `${activity.id} 包含未知步骤 ${name}`)
    assert(step.method === 'POST', `${activity.id}.${name} 仅允许 POST`)
    assert(/^\/portal-bff\/api\/[A-Za-z0-9._/-]+$/.test(step.path || ''), `${activity.id}.${name} 路径非法`)
    validateTemplateValue(step.query || {}, `${activity.id}.${name}.query`)
    validateTemplateValue(step.body || {}, `${activity.id}.${name}.body`)
  }
  return Object.freeze(activity)
}

function loadActivities() {
  const files = readdirSync(activityDir).filter((name) => name.endsWith('.json')).sort()
  for (const filename of files) {
    const activity = validateActivity(JSON.parse(readFileSync(resolve(activityDir, filename), 'utf8')), filename)
    assert(!activities.has(activity.id), `活动 id 重复: ${activity.id}`)
    activities.set(activity.id, activity)
  }
}

export function listActivities() {
  return [...activities.values()].filter((item) => item.enabled !== false)
}

export function getActivity(id) {
  const activity = activities.get(String(id || ''))
  return activity?.enabled === false ? null : activity || null
}

export function publicActivity(activity) {
  return {
    id: activity.id,
    name: activity.name,
    shortName: activity.shortName || activity.name,
    description: activity.description || '',
    transport: activity.transport,
    product: activity.product,
    notices: activity.notices || [],
    form: activity.form,
  }
}

loadActivities()
