import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserRoundPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import FeedbackMessage from '../components/FeedbackMessage'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password })
      navigate('/relatos')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-w-0 p-4 sm:p-5 md:p-8">
      <section className="relative mx-auto mt-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1b22] via-[#1b1b22] to-[#241923] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)] sm:mt-10 sm:p-7">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-pink-400 to-transparent" />
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-pink-300">
            <UserRoundPlus size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-300">Comunidade AlertaJá</p>
            <h1 className="mt-1 text-2xl font-bold">Cadastro de morador</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-300">
          Crie sua conta para contribuir com os relatos comunitários.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="register-name" className="block text-sm text-gray-300">
            Nome
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              minLength="2"
              maxLength="80"
              required
              value={name}
              onChange={event => setName(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
            />
          </label>
          <label htmlFor="register-email" className="block text-sm text-gray-300">
            E-mail
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
            />
          </label>
          <label htmlFor="register-password" className="block text-sm text-gray-300">
            Senha
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength="8"
              maxLength="128"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              aria-describedby="register-password-help"
              className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
            />
            <span id="register-password-help" className="mt-1 block text-xs text-gray-400">
              Use pelo menos 8 caracteres.
            </span>
          </label>
          {error && <FeedbackMessage variant="error">{error}</FeedbackMessage>}
          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-pink-600 p-3 font-semibold shadow-lg shadow-pink-950/20 transition hover:-translate-y-0.5 hover:bg-pink-500 hover:shadow-pink-950/40 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-5 border-t border-white/10 pt-4 text-sm text-gray-400">
          Já tem conta? <Link className="inline-flex min-h-11 items-center font-semibold text-pink-300 underline decoration-pink-400/50 underline-offset-4 hover:text-pink-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400" to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  )
}