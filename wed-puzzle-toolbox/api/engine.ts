import crypto from 'node:crypto'
import { canDraw, ordinaryReady, missingIndex, missingPieces, unlocked, count, config, complete, stageComplete, planTransfers, ROUNDS, type Info, type Transfer } from '../shared/puzzle.js'
import type { Store, Job, Checkpoint } from './store.js'
import type { Client } from './client.js'
import { resolveWedRechargeTaskStrategy, WedBusinessError } from './protocol/wedRecharge.js'

export type JobInput = { kind: Job['kind']; donors: string[]; to: string; round: number; mode: Job['mode']; autoDraw: boolean; autoAdvance?: boolean; fastTasks?: boolean; taskFilter?: string[]; tokens?: string[]; requestId: string; expectedTransfers?: Transfer[] }
export type Transport = Pick<Client, 'query' | 'trade' | 'gift' | 'receive' | 'draw' | 'redeem' | 'tasks' | 'finish' | 'jt' | 'open' | 'openFinish'>
export class Engine {
  get busy() { return this.gate.busy }
  constructor(readonly store: Store, readonly io: Transport, private gate = { busy: false }) {}
  async exclusive<T>(fn: () => Promise<T>) {
    if (this.busy) throw new Error('串行队列正在执行，请等待当前操作完成')
    this.gate.busy = true
    try { return await fn() } finally { this.gate.busy = false }
  }
  private log(j: Job, message: string) { j.logs.push({ at: new Date().toISOString(), message }); if (j.logs.length > 1000) j.logs.splice(0, j.logs.length - 1000); this.store.save() }
  private label(id: string) { const a = this.store.account(id); return a.phone.slice(0, 3) + '****' + a.phone.slice(-4) }
  async create(input: JobInput) {
    const previous = this.store.state.jobs.find(j => j.requestId === input.requestId)
    if (previous) return previous
    return this.exclusive(async () => {
      if (this.store.state.jobs.some(j => ['running', 'paused'].includes(j.status))) throw new Error('请先继续或结束已有任务')
      const ids = [...new Set([...input.donors, ...(input.to ? [input.to] : [])])]
      if (!ids.length || ids.length > 100) throw new Error('请选择 1–100 个号码')
      for (const id of ids) { this.store.account(id); if (input.kind !== 'daily') await this.io.query(id) }
      if (input.kind === 'transfer') {
        if (input.donors.includes(input.to)) throw new Error('赠送号码不能包含接收号码')
        const plan = planTransfers(this.store.view().accounts, input.donors, input.to, input.round, input.mode, input.autoAdvance)
        if (plan.reason) throw new Error(plan.reason)
        if (input.expectedTransfers && JSON.stringify(input.expectedTransfers) !== JSON.stringify(plan.transfers)) throw new Error('库存已变化，请重新核对库存与转赠预览')
      }
      if (input.kind === 'redeem') { const info = this.store.account(input.to).info!; if (!complete(info, input.round) || info[config(input.round).status] !== 2) throw new Error('该档拼图尚未集齐或官方未开放领券') }
      if (input.kind === 'draw') { const info = this.store.account(input.to).info!; if (!ordinaryReady(info, input.round) || !canDraw(info, input.round)) throw new Error('须只缺一张拼图、其他每种大于 10，且官方开放抽图、次数充足') }
      if (input.taskFilter?.length && input.kind !== 'daily') throw new Error('单项任务选择仅适用于每日任务')
      const j: Job = { ...input, fastTasks: input.fastTasks ?? true, id: crypto.randomUUID(), status: 'paused', logs: [], createdAt: new Date().toISOString(), transfersDone: 0, drawDone: false, drawnRounds: [], completedRounds: [], cursor: 0, taskIndex: 0, tasksDone: [] }
      if (j.kind === 'transfer') j.remaining = planTransfers(this.store.view().accounts, j.donors, j.to, j.round, j.mode, j.autoAdvance).transfers
      this.store.state.jobs.push(j)
      // Retain unfinished jobs; old finished journal entries are bounded.
      if (this.store.state.jobs.length > 100) this.store.state.jobs.splice(0, this.store.state.jobs.length - 100)
      this.log(j, '任务已进入串行队列')
      return j
    })
  }
  start(j: Job) {
    if (this.busy || j.status !== 'paused') throw new Error('当前任务不能继续')
    j.status = 'running'; j.cancel = false; this.store.save()
    // exclusive marks the queue busy synchronously, before the route returns.
    void this.exclusive(() => this.execute(j)).catch(() => { j.status = 'paused'; this.store.save() })
  }
  stop(j: Job) { if (j.status === 'running') { j.cancel = true; this.store.save() } }
  abandon(j: Job) { if (j.status !== 'paused' || this.busy) throw new Error('请先暂停任务'); j.status = 'stopped'; this.log(j, '任务已结束；已完成操作不撤销，未确认操作不会自动重试。') }
  private stopped(j: Job) {
    if (!j.cancel) return false
    j.status = 'paused'; this.log(j, '已暂停，当前请求已结束；继续时先核对未确认操作。'); return true
  }
  private async query(id: string) { return this.io.query(id) }
  private async reconcile(j: Job) {
    const p = j.checkpoint
    if (!p) return
    const after = await this.query(p.to), c = config(p.round)
    if (p.kind === 'gift') {
      const index = Number(p.piece!.split('_')[1])
      let sender = await this.query(p.from!), receiver = after
      const received = () => count(receiver, p.round, index) === count(p.before, p.round, index) + 1 && count(sender, p.round, index) === p.fromBefore! - 1
      if (!received()) {
        if (!p.token) throw new Error('生成转赠链接的结果不明，禁止重新生成。请核对官方记录后结束任务。')
        if (count(receiver, p.round, index) !== count(p.before, p.round, index) || ![p.fromBefore!, p.fromBefore! - 1].includes(count(sender, p.round, index))) throw new Error('库存发生额外变化，需核对转赠记录')
        try { const piece = await this.io.receive(p.to, p.token); if (piece !== p.piece) throw new Error('接收编号与赠送编号不符') } catch (error) { sender = await this.query(p.from!); receiver = await this.query(p.to); if (!received()) throw error }
        sender = await this.query(p.from!); receiver = await this.query(p.to)
        if (!received()) throw new Error('未确认赠送方 -1、接收方 +1，已暂停核对')
      }
      j.transfersDone++
      if (j.remaining?.[0]) { j.remaining[0].count--; if (!j.remaining[0].count) j.remaining.shift() }
      j.checkpoint = undefined
      this.log(j, `${this.label(p.from!)} → ${this.label(p.to)}：${c.label} ${index + 1} 号 ×1，双方库存已核验`)
    } else if (p.kind === 'draw') {
      const deltas = Array.from({ length: c.size }, (_, i) => count(after, p.round, i) - count(p.before, p.round, i))
      if (Number(after.drawTimes) !== Number(p.before.drawTimes) - 1 || deltas.filter(n => n !== 0).length !== 1 || !deltas.includes(1)) throw new Error('抽图结果尚未确认，禁止重复抽取。请刷新核对后继续。')
      const expected = missingIndex(p.before, p.round)
      j.drawDone = true; j.drawnRounds = [...new Set([...(j.drawnRounds || []), p.round])]; j.checkpoint = undefined
      const index = deltas.indexOf(1)
      this.log(j, `一次抽图已核验：${c.label} ${index + 1} 号${index === expected ? '缺失拼图' : '其他拼图'}，剩余 ${after.drawTimes} 次`)
      if (index !== expected) throw new Error('本次未抽到缺失拼图，已暂停，不会自动再抽一次')
    } else if (p.kind === 'receive') {
      const changes = (info: Info) => ROUNDS.flatMap(c => Array.from({ length: c.size }, (_, i) => ({ piece: `dp${c.round}_${i}`, delta: count(info, c.round, i) - count(p.before, c.round, i) }))).filter(x => x.delta !== 0)
      let delta = changes(after)
      if (!delta.length) { try { p.piece = await this.io.receive(p.to, p.token!); this.store.save() } catch (error) { delta = changes(await this.query(p.to)); if (delta.length !== 1 || delta[0].delta !== 1) throw error } delta = changes(await this.query(p.to)) }
      if (delta.length !== 1 || delta[0].delta !== 1 || p.piece && p.piece !== delta[0].piece) throw new Error('外部转赠领取结果未确认，已暂停')
      j.cursor++; j.transfersDone++; j.checkpoint = undefined; this.log(j, `${this.label(p.to)}：转赠链接 ${j.cursor} 已领取，库存已核验`)
    } else if (p.kind === 'redeem') {
      if (![3, 6, 7, 9].includes(after[c.status] ?? -1)) throw new Error('领券结果未确认，禁止再次提交，请核对官方奖品记录')
      j.checkpoint = undefined; if (p.phase !== 'advance') j.cursor = 1
      this.log(j, `${c.label} 领券状态已核验${p.phase === 'advance' ? '，继续检查下一档资格' : ''}`)
    } else {
      const rows = await this.io.tasks(p.to), latest = rows.find(t => t.taskId === p.task!.taskId)
      // A nonzero status can also mean unavailable. Only explicit completion/progress or added draws confirms success.
      const verified = !!latest && ((Number.isFinite(latest.completedTimes) && Number(latest.completedTimes) > Number(p.task!.completedTimes ?? 0)) || (Number(latest.requireTimes) > 0 && Number(latest.completedTimes) >= Number(latest.requireTimes)) || /已完成/.test(latest.buttonText || '')) || Number(after.drawTimes) > Number(p.before.drawTimes)
      if (!verified) {
        if (p.phase !== 'accepted') throw new Error('任务已提交但未确认完成，已暂停。继续只复查结果，不重复上报。')
        j.tasksUnconfirmed = [...(j.tasksUnconfirmed || []), `${p.to}:${p.task!.taskId}`]
        j.taskIndex++; j.checkpoint = undefined
        this.log(j, `${this.label(p.to)}：任务 ${p.task!.taskId} 接口接受上报，但进度未确认；不计为完成，不重复上报，继续其他任务`)
        return
      }
      const key = `${p.to}:${p.task!.taskId}`
      j.taskRuns ||= {}; j.taskRuns[key] = (j.taskRuns[key] || 0) + 1
      j.tasksDone.push(key)
      // A fresh runnable status and explicit progress allow another daily quota, not blind repeats.
      if (!(latest?.status === 0 && Number(latest.completedTimes) > Number(p.task!.completedTimes ?? 0) && Number(latest.requireTimes) > Number(latest.completedTimes) && j.taskRuns[key] < 100)) j.taskIndex++
      j.checkpoint = undefined
      this.log(j, `${this.label(p.to)}：任务 ${p.task!.taskId} 完成并已复核，抽图次数 ${after.drawTimes}`)
    }
  }
  private async gift(j: Job, from: string, piece: string) {
    const round = Number(piece[2]), index = Number(piece.split('_')[1]), sender = await this.query(from), before = await this.query(j.to)
    const n = count(sender, round, index), trade = (await this.io.trade(from)).find(p => p.prize === piece)
    if (n <= 1 || !trade || trade.num !== n || trade.btnStatus !== 2) throw new Error('赠送号码库存不足或官方禁止转赠，已暂停')
    j.checkpoint = { kind: 'gift', to: j.to, from, piece, round, before, fromBefore: n }; this.store.save()
    j.checkpoint.token = await this.io.gift(from, piece); this.store.save()
    // Complete receipt of this token even when pause is requested, so a gift is not orphaned.
    await this.reconcile(j)
  }
  private async draw(j: Job, before: Info) {
    if (!ordinaryReady(before, j.round) || !canDraw(before, j.round) || j.drawDone || j.drawnRounds?.includes(j.round)) throw new Error('抽图前复查未通过：须只缺一张、其他每种大于 10、档位开放、次数充足且该档未抽过')
    j.checkpoint = { kind: 'draw', to: j.to, round: j.round, before }; this.store.save()
    await this.io.draw(j.to, j.round)
    await this.reconcile(j)
  }
  private async transfers(j: Job) {
    for (;;) {
      if (this.stopped(j)) return
      const target = await this.query(j.to)
      if ((complete(target, j.round) && j.mode === 'fill') || (j.autoAdvance && (stageComplete(target, j.round) || j.completedRounds?.includes(j.round)) && !j.remaining?.length)) {
        j.remaining = []
        if (j.autoAdvance && await this.advance(j, target)) continue
        this.log(j, `${config(j.round).label}拼图已集齐`); break
      }
      if (!unlocked(target, j.round)) {
        if (!j.autoAdvance || j.round <= 1) throw new Error('该档尚未解锁，请先完成前一档')
        await this.unlock(j, j.round - 1, target)
      }
      if (!j.remaining) {
        for (const id of j.donors) await this.query(id)
        const plan = planTransfers(this.store.view().accounts, j.donors, j.to, j.round, j.mode, j.autoAdvance)
        if (plan.reason) throw new Error(plan.reason)
        j.remaining = plan.transfers; this.store.save()
      }
      const next = j.remaining[0]
      if (next) { await this.gift(j, next.from, next.piece); continue }
      const after = await this.query(j.to)
      if (j.autoDraw && !j.drawDone && ordinaryReady(after, j.round)) {
        if (!canDraw(after, j.round)) throw new Error('只缺一张且其余每种已达 11，但官方未开放该档抽图或次数不足；已暂停')
        await this.draw(j, after)
        if (j.autoAdvance) continue
      }
      const latest = await this.query(j.to)
      if (!complete(latest, j.round)) {
        const missing = missingPieces(latest, j.round).map(i => i + 1).join('、')
        const message = `${config(j.round).label}可转余图已处理完，缺 ${missing} 号；未满足只缺一张且其他每种至少 11 张的抽图条件`
        if (j.autoAdvance) throw new Error(message)
        this.log(j, message)
      }
      break
    }
  }
  private async unlock(j: Job, previous: number, info: Info) {
    if (!complete(info, previous) || info[config(previous).status] !== 2) throw new Error('下一档尚未解锁，前一档不满足官方领券条件；已暂停')
    j.checkpoint = { kind: 'redeem', to: j.to, round: previous, before: info, phase: 'advance' }; this.store.save()
    await this.io.redeem(j.to, previous); await this.reconcile(j)
    if (!unlocked(await this.query(j.to), previous + 1)) throw new Error('领券已确认，但官方尚未解锁下一档；请刷新核对后继续')
  }
  private async advance(j: Job, info: Info): Promise<boolean> {
    j.completedRounds = [...new Set([...(j.completedRounds || []), j.round])]; this.store.save()
    if (j.round === 3) return false
    if (!unlocked(info, j.round + 1)) await this.unlock(j, j.round, info)
    if (this.stopped(j)) return false
    j.round++; j.drawDone = false; j.remaining = undefined
    this.log(j, `已进入${config(j.round).label}，重新核对该档余图并继续串行互赠`)
    return true
  }
  private async wait(j: Job, ms: number) {
    const end = Date.now() + ms
    while (Date.now() < end) { if (this.stopped(j)) return false; await new Promise(resolve => setTimeout(resolve, Math.min(500, end - Date.now()))) }
    return !this.stopped(j)
  }
  private async daily(j: Job) {
    while (j.cursor < j.donors.length) {
      const id = j.donors[j.cursor]
      if (this.stopped(j)) return
      let before: Info, tasks: Awaited<ReturnType<Transport['tasks']>>
      try { before = await this.query(id); tasks = await this.io.tasks(id) } catch (error) {
        if (!(error instanceof WedBusinessError && error.code === 'GOTO_LOGIN') && !(error instanceof Error && error.message.startsWith('登录凭证已失效'))) throw error
        this.log(j, `${this.label(id)}：活动凭证失效，跳过此号码，继续下一个`)
        j.cursor++; j.taskIds = undefined; j.taskIndex = 0; this.store.save(); continue
      }
      if (!j.taskIds) { j.taskIds = tasks.filter(t => t.status === 0 && (!j.taskFilter?.length || j.taskFilter.includes(t.taskId))).sort((a, b) => a.order - b.order).map(t => t.taskId); j.taskIndex = 0; this.store.save() }
      while (j.taskIndex < j.taskIds.length) {
        if (this.stopped(j)) return
        const task = (await this.io.tasks(id)).find(t => t.taskId === j.taskIds![j.taskIndex])
        if (!task || task.status !== 0) { j.taskIndex++; this.log(j, `${this.label(id)}：任务 ${task?.title || j.taskIds[j.taskIndex - 1]} 当前不可执行，跳过`); continue }
        const strategy = resolveWedRechargeTaskStrategy(task)
        if (strategy === 'unsupported') { j.taskIndex++; this.log(j, `${task.title}：未知任务类型 ${task.taskType}，跳过`); continue }
        this.log(j, `${this.label(id)}：正在执行 ${task.title}`)
        const p: Checkpoint = { kind: 'task', to: id, round: 1, before: await this.query(id), task: { taskId: task.taskId, status: task.status, completedTimes: task.completedTimes } }
        try {
          if (strategy === 'openPlugin') {
            const jt = await this.io.jt(id, task.taskId)
            const referer = new URL(task.jumpUrl || 'https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716'); referer.searchParams.set('jtToken', jt)
            const open = await this.io.open(id, jt, referer.toString())
            if (!j.fastTasks) {
              this.log(j, `${task.title}：等待 ${open.scanTimeSeconds} 秒`)
              if (!await this.wait(j, open.scanTimeSeconds * 1000)) return
            } else this.log(j, `${task.title}：已取得任务参数，快速上报，不增加本地倒计时`)
            j.checkpoint = p; this.store.save()
            await this.io.openFinish(id, jt, open.cToken, referer.toString())
          } else {
            j.checkpoint = p; this.store.save()
            await this.io.finish(id, task.taskId)
          }
          p.phase = 'accepted'; this.store.save()
        } catch (error) {
          if (!(error instanceof WedBusinessError) || error.code === 'GOTO_LOGIN') throw error
          // A definite upstream rejection is not an unknown submission; record the failure and try the next task.
          j.checkpoint = undefined; j.taskIndex++
          j.tasksFailed = [...(j.tasksFailed || []), `${id}:${task.taskId}`]
          const reason = error.message.replace(/https?:\/\/\S+/g, '[接口地址]').replace(/(?:Cookie|token|sid|password)\s*[=:]\s*[^\s,;]+/gi, '[凭证已隐藏]').slice(0, 150)
          this.log(j, `${this.label(id)}：${task.title} 提交失败（${error.code}：${reason}），继续下一任务`)
          continue
        }
        await this.reconcile(j)
      }
      const after = await this.query(id)
      this.log(j, `${this.label(id)}：每日任务处理结束，抽图次数 ${before.drawTimes} → ${after.drawTimes}`)
      j.cursor++; j.taskIds = undefined; j.taskIndex = 0; this.store.save()
    }
  }
  private async execute(j: Job) {
    try {
      await this.reconcile(j)
      if (this.stopped(j)) return
      if (j.kind === 'transfer') await this.transfers(j)
      else if (j.kind === 'draw') { if (!j.drawDone) await this.draw(j, await this.query(j.to)) }
      else if (j.kind === 'daily') await this.daily(j)
      else if (j.kind === 'receive') {
        while (j.cursor < (j.tokens?.length || 0)) {
          if (this.stopped(j)) return
          j.checkpoint = { kind: 'receive', to: j.to, round: 1, before: await this.query(j.to), token: j.tokens![j.cursor] }; this.store.save(); await this.reconcile(j)
        }
      } else if (!j.cursor) {
        j.checkpoint = { kind: 'redeem', to: j.to, round: j.round, before: await this.query(j.to) }; this.store.save()
        await this.io.redeem(j.to, j.round); await this.reconcile(j)
      }
      if (j.status === 'running') { j.status = 'completed'; this.log(j, j.kind === 'daily' ? `队列处理结束，已核验完成 ${j.tasksDone.length} 次任务${j.tasksUnconfirmed?.length ? `，${j.tasksUnconfirmed.length} 项上报未确认` : ''}${j.tasksFailed?.length ? `，${j.tasksFailed.length} 项未通过` : ''}` : `队列完成，已核验转赠/接收 ${j.transfersDone} 张，抽图 ${j.drawnRounds?.length ?? (j.drawDone ? 1 : 0)} 次`) }
    } catch (error) { j.status = 'paused'; this.log(j, error instanceof Error ? error.message : '任务异常，已暂停') }
  }
}
