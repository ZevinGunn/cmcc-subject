import type { GlobalTelecomActionResult, GlobalTelecomOverview } from './globalTelecom.js'
import { verifyQqtActivityState } from './qqtActivityState.js'

type Sign = GlobalTelecomOverview['sign']
type BlindBox = GlobalTelecomOverview['blindBox']
export type GlobalDailyOperations = {
  querySign: () => Promise<Sign>
  sign: () => Promise<unknown>
  resign: (dayNum: number, taskIds: number[]) => Promise<unknown>
  queryBlindBox: () => Promise<BlindBox>
  completeTask: (number: number) => Promise<unknown>
  draw: () => Promise<GlobalTelecomActionResult>
  progress: (message: string) => Promise<void>
  // Only explicit authentication rejection is recoverable. Never retry transport failures.
  isAuthError: (error: unknown) => boolean
  renew: () => Promise<void>
}

/** Every mutation is followed by an authoritative read. Ambiguous draws stop the loop. */
export async function runGlobalTelecomDaily(ops: GlobalDailyOperations) {
  const messages: string[] = []
  const failures: string[] = []
  const errorText = (error: unknown) => error instanceof Error ? error.message : '上游请求失败'
  const read = async <T>(fn: () => Promise<T>): Promise<T> => {
    try { return await fn() } catch (error) {
      if (!ops.isAuthError(error)) throw error
      await ops.renew()
      return fn()
    }
  }
  const signState = () => read(ops.querySign)
  const blindState = () => read(ops.queryBlindBox)
  // An explicit rejected mutation can be retried once, after renewing AND checking
  // whether it already took effect. This is never used for random draws.
  const mutate = async <T>(fn: () => Promise<unknown>, query: () => Promise<T>, done: (state: T) => boolean) => {
    try { await fn() } catch (error) {
      if (ops.isAuthError(error)) {
        await ops.renew()
        if (!done(await query())) await fn()
      } else {
        // Even a lost response may have completed a deterministic task.
        const state = await query()
        if (!done(state)) throw error
      }
    }
    return verifyQqtActivityState({ query, completed: done, message: '提交后未查询到完成状态' })
  }
  try {
    await ops.progress('正在查询并完成今日签到')
    let state = await signState()
    const today = state.days.find(day => day.signStatus === 0)
    if (today) {
      state = await mutate(ops.sign, signState,
        current => current.days.find(day => day.dayNum === today.dayNum)?.signStatus === 1)
      messages.push('今日签到已确认完成')
    } else if (state.days.some(day => day.signStatus === 1)) {
      messages.push('今日已签到（已回查）')
    } else throw new Error('未获取到今日可签到或已签到状态')
  } catch (error) { failures.push(`签到：${errorText(error)}`) }

  try {
    let state = await signState()
    let completed = 0
    const attempted = new Set<number>()
    while (state.reSignRemaining > 0) {
      const day = state.days.filter(day => day.signStatus !== 1 && (day.signStatus === 2 || day.reSign))
        .sort((a, b) => a.dayNum - b.dayNum).find(day => !attempted.has(day.dayNum))
      if (!day) break
      attempted.add(day.dayNum)
      await ops.progress(`正在补签第 ${day.dayNum} 天`)
      const taskIds = [...new Set(day.tasks.filter(task => task.taskStatus === 0).map(task => task.taskId))]
      if (!taskIds.length) {
        failures.push(`第 ${day.dayNum} 天仍待补签，但未返回可完成任务`)
        continue
      }
      try {
        // Submit one task at a time, so authentication recovery never replays
        // previously completed tasks from the same day.
        for (const taskId of taskIds) {
          if (state.reSignRemaining <= 0 || state.days.find(d => d.dayNum === day.dayNum)?.signStatus === 1) break
          state = await mutate(() => ops.resign(day.dayNum, [taskId]), signState, current => {
            const updated = current.days.find(d => d.dayNum === day.dayNum)
            return updated?.signStatus === 1 || updated?.tasks.some(t => t.taskId === taskId && t.taskStatus !== 0) === true
          })
        }
        if (state.days.find(d => d.dayNum === day.dayNum)?.signStatus !== 1) throw new Error('日期仍未补签完成')
        completed += 1
      } catch (error) {
        failures.push(`第 ${day.dayNum} 天补签：${errorText(error)}`)
        state = await signState() // Never continue with stale quota after failure.
      }
    }
    messages.push(`补签完成 ${completed} 天${state.reSignRemaining <= 0 ? '，剩余补签次数为 0' : ''}`)
  } catch (error) { failures.push(`补签：${errorText(error)}`) }

  try {
    await ops.progress('正在查询并完成可用盲盒任务')
    let state = await blindState()
    if (!state.tasks.length || /任务清单需更新/.test(state.unavailableReason || '')) {
      throw new Error(state.unavailableReason || '本期盲盒任务清单需更新')
    }
    let completed = 0
    for (const task of state.tasks.filter(task => !task.completed && task.available === true).sort((a, b) => a.number - b.number)) {
      await ops.progress(`正在完成盲盒任务 ${task.number}`)
      try {
        state = await mutate(() => ops.completeTask(task.number), blindState,
          current => current.tasks.some(t => t.number === task.number && t.completed))
        completed += 1
      } catch (error) { failures.push(`盲盒任务 ${task.number}：${errorText(error)}`) }
    }
    messages.push(`盲盒任务完成 ${completed} 项`)
    state = await blindState()
    let draws = 0
    // Quota must decrease after every confirmed draw. The initial official
    // allowance also bounds the loop in case an upstream response is inconsistent.
    const budget = Math.max(0, Math.min(state.drawRemaining, (state.drawLimit ?? 0) - state.drawUsed))
    while (state.drawAllowed && draws < budget) {
      await ops.progress(`正在抽取盲盒 ${draws + 1}/${budget}`)
      const before = state
      let result: GlobalTelecomActionResult
      try { result = await ops.draw() } catch (error) {
        if (ops.isAuthError(error)) await ops.renew()
        // Read back after any failure; do not resubmit a potentially consumed draw.
        state = await blindState()
        throw new Error(`抽奖结果未确认（已使用 ${state.drawUsed} 次，剩余 ${state.drawRemaining} 次）：${errorText(error)}；本轮停止抽奖，勿重复提交`)
      }
      draws += 1
      messages.push(result.message)
      state = await verifyQqtActivityState({ query: blindState,
        completed: current => current.drawUsed > before.drawUsed && current.drawRemaining < before.drawRemaining,
        message: '抽奖后次数未确认变化，本轮停止抽奖，勿重复提交' })
    }
    messages.push(`盲盒抽奖 ${draws} 次${!state.drawAllowed ? `，${state.unavailableReason || '暂无可用机会'}` : ''}`)
  } catch (error) { failures.push(`盲盒：${errorText(error)}`) }
  return { status: failures.length ? 'failed' as const : 'success' as const,
    message: [...messages, ...failures].join('；') }
}

export function isGlobalDailyAuthError(error: unknown): boolean {
  // A 403/risk rejection is not proof of credential expiry.
  const message = error instanceof Error ? error.message : String(error)
  return /未登录|请先登录|登录(?:已)?失效|重新登录|认证(?:失效|过期)|(?:会话|token).*(?:失效|过期|无效)|HTTP 401/i.test(message)
}

export function isGlobalDailyScheduleDue(nowMinute: number, targetMinute: number): boolean {
  return targetMinute >= 0 && nowMinute >= targetMinute
}
