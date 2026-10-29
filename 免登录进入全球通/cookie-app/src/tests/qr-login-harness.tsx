import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import AccountLoginDialog from '../components/AccountLoginDialog'
import '../index.css'

function Harness() {
  const [open, setOpen] = useState(true)
  const [account, setAccount] = useState({ id: 'mock-one', phone: '13800000000' })
  const [saved, setSaved] = useState(0)
  return <>
    <button onClick={() => setOpen(true)}>Open</button>
    <button onClick={() => setAccount({ id: 'mock-two', phone: '13900000000' })}>Switch Account</button>
    <output data-testid="saved">{saved}</output>
    <AccountLoginDialog open={open} account={account} onClose={() => setOpen(false)}
      onSuccess={() => setSaved((count) => count + 1)} />
  </>
}

createRoot(document.getElementById('root')!).render(<StrictMode><Harness /></StrictMode>)
