import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import CallbackAppointmentDialog from '../components/CallbackAppointmentDialog'
import '../index.css'

// Vite-only UI fixture: no live credentials, no real appointment requests.
let outcome = 'success', confirmations = 0
window.fetch = async (input) => {
  const path = String(input)
  if (!path.startsWith('/api/callback-appointments/')) throw new Error('Unexpected fixture request')
  await new Promise(resolve => setTimeout(resolve, 200))
  if (path.endsWith('/products')) return Response.json({ ok: true, data: { sessionId: 'fixture', maskedPhone: '138****0000', productName: '测试业务（模拟）', norms: [{ id: '7', name: '测试咨询档位', price: '800' }, { id: '8', name: '另一个档位', price: '2000' }] } })
  if (path.endsWith('/prepare')) return Response.json({ ok: true, data: { preparationId: 'preview', maskedPhone: '138****0000', productName: '测试业务（模拟）', normName: '测试咨询档位' } })
  confirmations++
  document.getElementById('confirmation-count')!.textContent = String(confirmations)
  return Response.json({ ok: true, data: { status: outcome, message: { success: '模拟预约成功，请等待回电。', duplicate: '已有预约，请勿重复提交。', failed: '模拟上游繁忙，请重试。', unknown: '模拟结果待确认，请勿重复提交。' }[outcome] } })
}
function Harness() {
  const [open, setOpen] = useState(false)
  return <div className="space-y-4 p-6"><h1>预约回访交互测试（模拟接口）</h1><select aria-label="测试响应" onChange={e => { outcome = e.target.value }}><option value="success">成功</option><option value="duplicate">重复预约</option><option value="failed">失败</option><option value="unknown">结果未知</option></select><button onClick={() => setOpen(true)}>打开预约</button><p>提交次数：<span id="confirmation-count">0</span></p><CallbackAppointmentDialog account={open ? { id: 'fixture', phoneMasked: '138****0000' } : null} onClose={() => setOpen(false)} /></div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Harness /></React.StrictMode>)
