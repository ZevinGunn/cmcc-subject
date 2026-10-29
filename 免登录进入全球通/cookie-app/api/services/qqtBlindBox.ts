// Verified against 星动日.zip / components/lottery/index.js (September/October 2026).
// Keep the campaign window explicit: task numbers are not stable across campaigns.
export type BlindBoxTask = {
  number: number
  completed: boolean
  name?: string
  available?: boolean
  unavailableReason?: string
  opensAt?: string
  url?: string
  completedAt?: number
}

export function blindBoxCampaign(now = new Date()) {
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(now)
  const month = date.slice(0, 7)
  const known = month === '2026-09' || month === '2026-10'
  const october = month === '2026-10'
  const day = Number(date.slice(8, 10))
  const catalog = [
    { number: october ? 1 : 3, name: '浏览全球通商旅礼遇页面', opensAt: october ? '2026-10-01' : '2026-09-26', url: 'https://qqt.cmicrwx.cn/2016tyjf/qqtxly/new/ssoTokenLogin.action?backUrl=https%3A//qqt.cmicrwx.cn/2016tyjf/qqtxly/res/wap/index.html%3FsspId%3D74193' },
    { number: october ? 2 : 1, name: '浏览逐马计划页面', opensAt: `${month}-01`, url: 'https://sports.migudm.cn/zmjh/pages/index/index?sc=ZPVKRW-DQ300021&sourceid=012012' },
    { number: october ? 3 : 2, name: '浏览尊享云页面', opensAt: october ? '2026-10-26' : '2026-09-01', url: 'https://mrp.mcloud.139.com/portal/cloudCircle/index.html?path=caiyunviporder&sourceid=1009&enableShare=1' },
  ]
  return { month, known, drawLimit: day < 26 ? 2 : 3, tasks: known ? catalog.sort((a, b) => a.number - b.number).map((task) => ({
    ...task, available: date >= task.opensAt,
    unavailableReason: date < task.opensAt ? `${task.opensAt.slice(5).replace('-', '月')}日开放` : undefined,
  })) : [] }
}

export function mergeBlindBoxTasks(rawTasks: unknown[], now = new Date()): BlindBoxTask[] {
  const states = new Map<number, { completed: boolean; completedAt?: number }>()
  for (const raw of rawTasks) {
    const task = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
    const number = Number(task.number)
    if (!Number.isInteger(number) || number <= 0 || states.has(number) ||
      ![true, false, 1, 0, '1', '0', 'true', 'false'].includes(task.flag as never)) {
      throw new Error('盲盒任务状态异常，无法判断是否完成')
    }
    states.set(number, { completed: task.flag === true || task.flag === 1 || task.flag === '1' || task.flag === 'true',
      completedAt: task.time != null && Number.isFinite(Number(task.time)) ? Number(task.time) : undefined })
  }
  const campaign = blindBoxCampaign(now)
  const tasks: BlindBoxTask[] = campaign.tasks.map((task) => ({ ...task, completed: false, ...states.get(task.number) }))
  for (const [number, state] of states) {
    if (!tasks.some((task) => task.number === number)) tasks.push({ number, ...state, name: `活动任务 ${number}`,
      available: false, unavailableReason: '任务清单需更新' })
  }
  return tasks
}

// The receive API takes only prizeCode + channelCode, including physical prizes.
// Physical prizes require a second step on the official questionnaire after receive succeeds.
const fulfillmentLinks: Record<string, string> = {
  '3992': 'https://wj.qq.com/s2/27829352/lbcb/',
  '4024': 'https://wj.qq.com/s2/27829883/yqty/',
  '3994': 'https://www.wjx.top/vm/QzzW800.aspx#',
  '4027': 'https://wj.qq.com/s2/27842268/wuov/',
  '3947': 'https://www.wjx.top/vm/r0nQiYz.aspx#',
  '3826': 'https://www.wjx.top/vm/PpGPGzO.aspx#',
  '3862': 'https://v.wjx.cn/vm/hmfeuzV.aspx#',
  '4102': 'https://www.wjx.top/vm/Pd2Ef9J.aspx#',
  '3551': 'https://www.wjx.top/vm/QJnfaCo.aspx#',
}

export function blindBoxFulfillmentUrl(prizeCode: string): string | undefined {
  return fulfillmentLinks[prizeCode]
}

export function readBlindBoxDraw(payload: unknown): { prizeCode: string; prizeName?: string } {
  const root = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
  const data = root.data && typeof root.data === 'object' ? root.data as Record<string, unknown> : {}
  const prizeCode = String(data.prizeCode ?? '')
  if (!/^\d{1,10}$/.test(prizeCode) || Number(prizeCode) <= 0) throw new Error('抽奖结果缺少奖品编号，结果尚未确认，请刷新查看官方记录，勿重复抽奖')
  return { prizeCode: String(Number(prizeCode)), prizeName: typeof data.prizeName === 'string' ? data.prizeName : undefined }
}
