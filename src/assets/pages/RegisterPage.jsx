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
    <main className="grid min-h-[calc(100vh-5rem)] min-w-0 place-items-center p-4 sm:p-6 md:p-8">
      <section className="mx-auto grid w-full max-w-4xl overflow-hidden border border-white/10 bg-[#17181e] md:grid-cols-[0.85fr_1.15fr]">
        <aside className="flex flex-col justify-between border-b border-pink-400/30 bg-[#1c1c23] p-6 sm:p-8 md:border-b-0 md:border-r md:border-r-white/10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-pink-300">AlertaJá / Itaquaquecetuba</p>
            <h2 className="mt-8 max-w-xs text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              Uma rede local começa com informação confiável.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Cadastre-se para relatar pontos de alagamento e ajudar a acompanhar informações compartilhadas por moradores.
            </p>
          </div>
          <p className="mt-8 hidden border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500 md:block">
            Relatos · Alertas · Prevenção
          </p>
        </aside>
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-pink-400/20 bg-pink-500/10 text-pink-300">
              <UserRoundPlus size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pink-300">Comunidade AlertaJá</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Cadastro de morador</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Preencha seus dados para criar uma conta.
          </p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-[#101014] px-3 py-2 outline-none transition-colors hover:border-white/20 focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
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
                className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-[#101014] px-3 py-2 outline-none transition-colors hover:border-white/20 focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
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
                className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-[#101014] px-3 py-2 outline-none transition-colors hover:border-white/20 focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
              />
              <span id="register-password-help" className="mt-1 block text-xs text-gray-400">
                Use pelo menos 8 caracteres.
              </span>
            </label>
            {error && <FeedbackMessage variant="error">{error}</FeedbackMessage>}
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-md bg-pink-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
          <p className="mt-6 border-t border-white/10 pt-4 text-sm text-gray-400">
            Já tem conta? <Link className="inline-flex min-h-11 items-center font-semibold text-pink-300 underline decoration-pink-400/50 underline-offset-4 hover:text-pink-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400" to="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  )
}