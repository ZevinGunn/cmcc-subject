import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import GlobalDialogDrag from '@/components/GlobalDialogDrag'
import AccessPageTracker from '@/components/AccessPageTracker'
import BrandDocument from '@/components/BrandDocument'

const Home = lazy(() => import('@/pages/Home'))
const PublicLogin = lazy(() => import('@/pages/PublicLogin'))
const AdminLogin = lazy(() => import('@/pages/AdminLogin'))
const PublicLinksAdmin = lazy(() => import('@/pages/PublicLinksAdmin'))
const UsersAdmin = lazy(() => import('@/pages/UsersAdmin'))
const BusinessQueryAdmin = lazy(() => import('@/pages/BusinessQueryAdmin'))
const ShopQueryPage = lazy(() => import('@/pages/ShopQueryPage'))
const LegacyBusinessQueryPage = lazy(() => import('@/pages/LegacyBusinessQueryPage'))
const BusinessOrderPage = lazy(() => import('@/pages/BusinessOrderPage'))
const V2App = lazy(() => import('@/v2/V2App'))
const V2LuckyThreeDayPage = lazy(() => import('@/v2/pages/V2LuckyThreeDayPage'))
const V2GlobalTelecomPage = lazy(() => import('@/v2/pages/V2GlobalTelecomPage'))
const WedPuzzlePool = lazy(() => import('@/pages/WedPuzzlePool'))
const StarbucksPage = lazy(() => import('@/pages/StarbucksPage'))

type AdminMeResp =
  | { ok: true; data: { admin: { username: string } } }
  | { ok: false; message?: string }

function AdminRoute({ children, next = '/' }: { children: JSX.Element; next?: string }) {
  const [ready, setReady] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let alive = true
    void fetch('/api/admin/me', { credentials: 'same-origin' })
      .then(async (res) => ({ res, body: (await res.json()) as AdminMeResp }))
      .then(({ res, body }) => {
        if (!alive) return
        setAuthorized(Boolean(res.ok && body.ok))
      })
      .catch(() => {
        if (!alive) return
        setAuthorized(false)
      })
      .finally(() => {
        if (!alive) return
        setReady(true)
      })
    return () => {
      alive = false
    }
  }, [])

  if (!ready) return <AppFallback />
  if (!authorized) {
    return <Navigate to={`/admin-login?next=${encodeURIComponent(next)}`} replace />
  }
  return children
}

function AppFallback() {
  return (
    <div className="brand-page min-h-screen animate-pulse p-4 sm:p-6" aria-label="页面加载中">
      <div className="mx-auto max-w-[1440px] space-y-4">
        <div className="h-14 rounded-md border border-zinc-200 bg-white" />
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="hidden h-[520px] rounded-md border border-zinc-200 bg-white lg:block" />
          <div className="space-y-4"><div className="h-28 rounded-md border border-zinc-200 bg-white" /><div className="h-[380px] rounded-md border border-zinc-200 bg-white" /></div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const pathname = window.location.pathname
  const v2Enabled = String(import.meta.env.VITE_UI_V2_ENABLED ?? '1').toLowerCase() !== '0'
  if (pathname.startsWith('/app/cmcc-public')) {
    return (
      <>
        <GlobalDialogDrag />
        <Router basename="/app/cmcc-public">
          <BrandDocument />
          <AccessPageTracker />
          <Suspense fallback={<AppFallback />}>
          <Routes>
            <Route path="/" element={<PublicLogin />} />
            <Route path="/public" element={<PublicLogin />} />
            <Route path="/legacy-business-query" element={<LegacyBusinessQueryPage />} />
            <Route path="/benefits/wed-puzzle" element={<WedPuzzlePool />} />
            <Route path="/business-order" element={<BusinessOrderPage />} />
            <Route path="/business-order/ai-bean-contract" element={<BusinessOrderPage experience="ai_bean_contract" />} />
            <Route path="/business-order/fly-card-8" element={<BusinessOrderPage experience="fly_card_8" />} />
            <Route path="/benefits/global-telecom" element={<V2GlobalTelecomPage publicMode />} />
            <Route path="/benefits/lucky-three-day" element={<V2LuckyThreeDayPage publicMode />} />
            <Route path="/benefits/lucky-three-day/:batchId/:skuId" element={<V2LuckyThreeDayPage publicMode />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </Router>
      </>
    )
  }
  const basename = pathname.startsWith('/app/cmcc-user') ? '/app/cmcc-user' : undefined
  return (
    <>
      {!pathname.startsWith('/v2') && !pathname.startsWith('/app/cmcc-user/v2') ? (
        <GlobalDialogDrag />
      ) : null}
      <Router basename={basename}>
      <BrandDocument />
      <AccessPageTracker />
      <Suspense fallback={<AppFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            <AdminRoute>
              <Home />
            </AdminRoute>
          }
        />
        <Route
          path="/links"
          element={
            <AdminRoute>
              <PublicLinksAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UsersAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/v2/*"
          element={
            v2Enabled ? (
              <AdminRoute next="/v2">
                <V2App />
              </AdminRoute>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/business-query"
          element={<BusinessQueryAdmin />}
        />
        <Route path="/shop-query" element={<ShopQueryPage />} />
        <Route path="/legacy-business-query" element={<LegacyBusinessQueryPage />} />
        <Route path="/benefits/wed-puzzle" element={<WedPuzzlePool />} />
        <Route path="/starbucks" element={<StarbucksPage />} />
        <Route path="/business-order" element={<BusinessOrderPage backHref="/users" backLabel="返回用户管理" />} />
        <Route path="/business-order/ai-bean-contract" element={<BusinessOrderPage experience="ai_bean_contract" backHref="/users" backLabel="返回用户管理" />} />
        <Route path="/business-order/fly-card-8" element={<BusinessOrderPage experience="fly_card_8" backHref="/users" backLabel="返回用户管理" />} />
        <Route path="/benefits/global-telecom" element={<V2GlobalTelecomPage publicMode />} />
        <Route path="/benefits/lucky-three-day" element={<V2LuckyThreeDayPage publicMode />} />
        <Route path="/benefits/lucky-three-day/:batchId/:skuId" element={<V2LuckyThreeDayPage publicMode />} />
        <Route path="/public" element={<PublicLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      </Router>
    </>
  )
}
