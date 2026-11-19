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
  MapPin,
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
    <aside className="relative z-20 w-full shrink-0 border-b border-white/10 bg-[#15151b] p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
      <div className="flex items-center justify-between gap-3 lg:mb-10">
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-xl focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-400"
          aria-label="AlertaJá, página inicial"
        >
          <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-300 ring-1 ring-inset ring-pink-400/15">
            <MapPin size={21} />
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight text-white">AlertaJá</span>
            <span className="mt-0.5 block text-xs text-gray-500">Itaquaquecetuba · SP</span>
          </span>
        </NavLink>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition hover:border-white/20 hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 lg:hidden"
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
        className={`${menuOpen ? 'block' : 'hidden'} mt-5 space-y-1.5 lg:mt-0 lg:block lg:flex-1`}
      >
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `group flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 ${
                isActive
                  ? 'border-l-2 border-l-pink-400 border-white/[0.07] bg-white/[0.055] text-white'
                  : 'text-gray-400 hover:border-white/[0.05] hover:bg-white/[0.035] hover:text-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  aria-hidden="true"
                  className={isActive ? 'text-pink-300' : 'text-gray-500 transition group-hover:text-gray-300'}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`${menuOpen ? 'block' : 'hidden'} mt-5 border-t border-white/10 pt-4 lg:mt-6 lg:block lg:pt-5`}>
        {loading ? (
          <p className="p-3 text-sm text-gray-400">Verificando sessão...</p>
        ) : user ? (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-sm font-semibold text-pink-200">
                {user.name?.trim()?.charAt(0)?.toUpperCase() || <UserRound size={17} />}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Conta conectada</p>
                <p className="truncate text-sm font-medium text-gray-200">{user.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex min-h-10 w-full items-center gap-3 rounded-lg px-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            >
              <LogOut size={17} aria-hidden="true" />
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
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
              <UserRound size={19} />
              Entrar
            </NavLink>
            <NavLink to="/cadastro" onClick={() => setMenuOpen(false)} className="mt-1 flex min-h-11 items-center justify-center rounded-lg border border-pink-400/20 bg-pink-500/10 px-3 text-sm font-medium text-pink-200 transition hover:border-pink-400/35 hover:bg-pink-500/15 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
              Criar uma conta
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