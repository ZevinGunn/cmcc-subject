import React from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes, Link } from 'react-router-dom'
import WedPuzzlePool from '../pages/WedPuzzlePool'
import { PUZZLE_ROUNDS } from '../../shared/wedPuzzlePlanner'
import '../index.css'

// Every request is intercepted; this fixture cannot reach real CMCC APIs.
const accounts = [{ id: 'donor', label: '138****0001', hasCookie: true }, { id: 'target', label: '138****0002', hasCookie: true }, { id: 'third', label: '138****0003', hasCookie: true }]
const rows = accounts.map((account, n) => ({ ...account, updatedAt: new Date().toISOString(), info: { activeIndex: 1, drawTimes: '5', r6DrawStatus: 1, r5DrawStatus: 3, r4DrawStatus: 3,
  pictureList: Object.fromEntries(PUZZLE_ROUNDS.map(c => [String(c.round), Object.fromEntries(Array.from({ length: c.size }, (_, i) => [`dp${c.round}_${i}`, String(c.round === 1 ? i === c.rare ? 0 : n === 0 ? 10 : 3 : 0)]))])) } }))
let job: Record<string, unknown> | null = null, polls = 0
window.fetch = async (input, init) => {
  const path = String(input), body = JSON.parse(String(init?.body || '{}'))
  if (!path.startsWith('/api/wed-puzzle')) throw new Error('模拟页面禁止访问其他接口')
  await new Promise(resolve => setTimeout(resolve, 150))
  if (path.endsWith('/inventory')) return Response.json({ ok: true, data: { rows: rows.filter(r => r.id === body.accountId) } })
  if (path.endsWith('/jobs') && init?.method === 'POST') { job = { id: 'fixture', input: body, pool: rows, status: 'queued', completedTargets: [], createdAt: new Date().toISOString(), logs: [] }; polls = 0 }
  else if (path.endsWith('/jobs') && job) {
    polls++
    job.status = polls > 1 ? 'paused' : 'running'
    job.logs = [{ at: new Date().toISOString(), message: polls > 1 ? '已暂停：模拟接收超时，保留原 Token 等待核对' : '138****0001 → 138****0002：95 折 1 号 ×1，库存已核实' }]
    if (polls > 1) job.pendingOperation = 'gift'
  } else if (path.endsWith('/resume') && job) { job.status = 'completed'; job.pendingOperation = undefined; job.completedTargets = ['target']; job.logs = [{ at: new Date().toISOString(), message: '模拟恢复：使用原 Token 接收成功，库存已核实' }] }
  else if ((path.endsWith('/close') || path.endsWith('/stop')) && job) job.status = 'stopped'
  return Response.json({ ok: true, data: { accounts, job } })
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><MemoryRouter initialEntries={['/benefits/wed-puzzle?from=public']}><Routes><Route path="/benefits/wed-puzzle" element={<WedPuzzlePool />} /><Route path="/public" element={<div className="p-6">模拟 Public 账号列表 <Link to="/benefits/wed-puzzle?from=public">重新进入拼图号码池</Link></div>} /></Routes></MemoryRouter></React.StrictMode>)
