import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import FeedbackMessage from './FeedbackMessage'
import {
  LayoutDashboard,
  Map,
  CloudRain,
  Route,
  House,
  AlertTriangle,
  BookOpen,
  UserRound,
  LogOut,
  Menu,
  X
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setLogoutError('')
    try {
      await logout()
    } catch (error) {
      setLogoutError(error.message || 'Não foi possível encerrar a sessão.')
    }
  }

  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-[#17171d] p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
      <div className="flex items-center justify-between gap-3 lg:mb-10">
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-bold focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-400"
          aria-label="AlertaJá, página inicial"
        >
          <span aria-hidden="true" className="text-pink-500">●</span> AlertaJá
        </NavLink>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-gray-200 transition hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="primary-navigation"
        aria-label="Navegação principal"
        className={`${menuOpen ? 'block' : 'hidden'} mt-4 space-y-2 lg:mt-0 lg:block`}
      >
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-xl p-3 transition focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 ${
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

      <div className={`${menuOpen ? 'block' : 'hidden'} mt-5 border-t border-white/10 pt-4 lg:mt-10 lg:block lg:pt-5`}>
        {loading ? (
          <p className="p-3 text-sm text-gray-400">Verificando sessão...</p>
        ) : user ? (
          <div className="space-y-2">
            <p className="px-3 text-sm text-gray-400">{user.name}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-11 w-full items-center gap-3 rounded-lg p-3 text-gray-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            >
              <LogOut size={19} />
              Sair
            </button>
          </div>
        ) : (
          <>
            {sessionError && (
              <p role="alert" className="px-3 pb-2 text-xs text-red-400">
                API indisponível: {sessionError}
              </p>
            )}
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg p-3 text-gray-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
              <UserRound size={19} />
              Entrar
            </NavLink>
            <NavLink to="/cadastro" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-lg p-3 text-sm text-pink-400 transition hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
              Criar conta
            </NavLink>
          </>
        )}
        {logoutError && (
          <FeedbackMessage variant="error" className="mt-2">
            {logoutError}
          </FeedbackMessage>
        )}
      </div>
    </aside>
  )
}