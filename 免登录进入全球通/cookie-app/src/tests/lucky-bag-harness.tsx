import React from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import V2UnifiedBusinessOrderPage from '../v2/pages/V2UnifiedBusinessOrderPage'
import '../index.css'

// Browser fixture only: the browser runner intercepts every API request.
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><MemoryRouter initialEntries={['/public/business-order']}>
    <main className="p-4"><V2UnifiedBusinessOrderPage
      accounts={[{ id: 'mock-account', phoneMasked: '139****0000', label: '模拟账号', phone: '139****0000' }]}
      initialAccountId="mock-account" allowManualPhone={false} backHref="/public" backLabel="返回public"
    /></main>
  </MemoryRouter></React.StrictMode>,
)
