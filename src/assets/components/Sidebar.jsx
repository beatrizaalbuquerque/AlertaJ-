import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  LayoutDashboard,
  Map,
  CloudRain,
  Route,
  House,
  AlertTriangle,
  BookOpen,
  UserRound,
  LogOut
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/mapa', label: 'Mapa de riscos', icon: Map },
  { to: '/alertas', label: 'Alertas', icon: CloudRain },
  { to: '/rotas', label: 'Rotas alternativas', icon: Route },
  { to: '/abrigos', label: 'Abrigos', icon: House },
  { to: '/relatos', label: 'Alagamentos', icon: AlertTriangle },
  { to: '/orientacoes', label: 'Prevenção', icon: BookOpen }
]

export default function Sidebar() {
  const { user, logout, loading, sessionError } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      window.alert(error.message)
    }
  }

  return (
    <aside className="w-full shrink-0 bg-[#17171d] border-b border-white/10 p-5 md:w-64 md:min-h-screen md:border-b-0 md:border-r">
      <div className="text-2xl font-bold mb-10">
        <span className="text-pink-500">●</span> AlertaJá
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 border-t border-white/10 pt-5">
        {loading ? (
          <p className="p-3 text-sm text-gray-500">Verificando sessão...</p>
        ) : user ? (
          <div className="space-y-2">
            <p className="px-3 text-sm text-gray-400">{user.name}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-3 text-gray-400 hover:text-white"
            >
              <LogOut size={19} />
              Sair
            </button>
          </div>
        ) : (
          <>
            {sessionError && (
              <p role="alert" className="px-3 text-xs text-red-400">
                API indisponível: {sessionError}
              </p>
            )}
            <NavLink to="/login" className="flex items-center gap-3 p-3 text-gray-400">
              <UserRound size={19} />
              Entrar
            </NavLink>
            <NavLink to="/cadastro" className="block p-3 text-sm text-pink-400">
              Criar conta
            </NavLink>
          </>
        )}
      </div>
    </aside>
  )
}