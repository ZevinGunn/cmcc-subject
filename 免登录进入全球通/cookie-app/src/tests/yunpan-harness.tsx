import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import AccountLoginDialog from '../components/AccountLoginDialog'
import YunpanJumpActions from '../components/YunpanJumpActions'
import '../index.css'
import V2AccountDrawer from '../v2/components/V2AccountDrawer'
import { toV2Account } from '../v2/lib/accountHealth'

// Browser fixture: the runner intercepts every API and captcha request.
function Harness() {
  const [open, setOpen] = useState(true)
  const [result, setResult] = useState('')
  const credentials = new URLSearchParams(window.location.search).get('credentials')
  if (credentials) {
    const account = toV2Account({ id: 'mock-account', phoneMasked: '138****0000', label: '模拟账号',
      hasCookie: true, cookieInvalidAt: new Date().toISOString(), hasYunpanSession: true,
      yunpanSessionCheckedAt: credentials === 'unchecked' ? undefined : new Date().toISOString(),
      yunpanSessionInvalidAt: credentials === 'invalid' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(), hasCmccAppCookie: true, hasWedRechargeCookie: true })
    return <main><p role="status">{result}</p><V2AccountDrawer account={open ? account : null} tasks={[]}
      onClose={() => setOpen(false)} onLogin={() => undefined} onOpenBusiness={() => undefined}
      onStartTask={(type, ids) => setResult(`${type}:${ids.join(',')}`)} /></main>
  }
  return <main className="p-4">
    <p role="status">{result}</p>
    <AccountLoginDialog open={open} defaultMethod="yunpan" publicLinkId="mock-link"
      onClose={() => setOpen(false)} onSuccess={({ method, cookie }) => setResult(`${method}:${cookie ? 'ck' : 'no-ck'}`)} />
    <YunpanJumpActions accountId="mock-account" publicLinkId="mock-link" includeGlobal />
  </main>
}
createRoot(document.getElementById('root')!).render(<Harness />)
