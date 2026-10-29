import { createSchedule, listSchedules, updateSchedule } from '../services/batchTasks.js'
import { getPrisma } from '../services/prisma.js'

async function main() {
  const time = process.argv.find(arg => arg.startsWith('--time='))?.slice(7) || '08:00'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('时间格式应为 HH:mm')
  let schedules = (await listSchedules()).filter(s => s.action === 'global_telecom_daily' && s.scopeType === 'admin_all')
  if (process.argv.includes('--enable')) {
    if (schedules.length > 1) throw new Error('已有多个全球通每日计划，请在管理页确认后保留一个，避免重复执行')
    const input = { name: '全球通每日签到+补签+盲盒抽奖', enabled: true, times: [time], timezone: 'Asia/Shanghai', sspid: '75442' }
    const schedule = schedules[0]
      ? await updateSchedule({ ...input, id: schedules[0].id })
      : await createSchedule({ ...input, action: 'global_telecom_daily' })
    schedules = [schedule]
  }
  console.log(JSON.stringify(schedules.map(s => ({ id: s.id, name: s.name, enabled: s.enabled,
    times: s.times, timezone: s.timezone, scope: '全部未禁用且具有登录凭据的账号', lastTriggeredAt: s.lastTriggeredAt })), null, 2))
}

main().then(() => { process.exitCode = 0 }, error => {
  console.error(error instanceof Error ? error.message : '计划配置失败')
  process.exitCode = 1
}).finally(async () => { await getPrisma().$disconnect(); process.exit(process.exitCode || 0) })
