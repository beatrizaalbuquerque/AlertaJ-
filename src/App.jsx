import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './assets/components/Sidebar'
import { AuthProvider } from './assets/hooks/AuthProvider'

const Dashboard = lazy(() => import('./assets/pages/Dashboard'))
const MapPage = lazy(() => import('./assets/pages/MapPage'))
const AlertsPage = lazy(() => import('./assets/pages/AlertsPage'))
const RoutesPage = lazy(() => import('./assets/pages/RoutesPage'))
const SheltersPage = lazy(() => import('./assets/pages/SheltersPage'))
const ReportsPage = lazy(() => import('./assets/pages/ReportsPage'))
const GuidancePage = lazy(() => import('./assets/pages/GuidancePage'))
const LoginPage = lazy(() => import('./assets/pages/LoginPage'))
const RegisterPage = lazy(() => import('./assets/pages/RegisterPage'))

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#101014] text-white lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Suspense fallback={
            <main className="grid min-h-48 place-items-center p-6">
              <p role="status" aria-live="polite" className="text-sm text-gray-400">
                Carregando página...
              </p>
            </main>
          }>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mapa" element={<MapPage />} />
              <Route path="/alertas" element={<AlertsPage />} />
              <Route path="/rotas" element={<RoutesPage />} />
              <Route path="/abrigos" element={<SheltersPage />} />
              <Route path="/relatos" element={<ReportsPage />} />
              <Route path="/orientacoes" element={<GuidancePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </AuthProvider>
  )
}