import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './assets/components/Sidebar'
import Dashboard from './assets/pages/Dashboard'
import MapPage from './assets/pages/MapPage'
import AlertsPage from './assets/pages/AlertsPage'
import RoutesPage from './assets/pages/RoutesPage'
import SheltersPage from './assets/pages/SheltersPage'
import ReportsPage from './assets/pages/ReportsPage'
import GuidancePage from './assets/pages/GuidancePage'
import LoginPage from './assets/pages/LoginPage'
import RegisterPage from './assets/pages/RegisterPage'
import { AuthProvider } from './assets/hooks/AuthProvider'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#101014] text-white lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
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
        </div>
      </div>
    </AuthProvider>
  )
}