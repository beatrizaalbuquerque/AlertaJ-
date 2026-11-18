import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import FeedbackMessage from '../components/FeedbackMessage'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/relatos')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-w-0 p-4 sm:p-5 md:p-8">
      <section className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b22] p-5 sm:mt-10 sm:p-6">
        <h1 className="text-2xl font-bold">Entrar no AlertaJá</h1>
        <p className="mt-2 text-sm text-gray-400">
          Entre para registrar e acompanhar ocorrências da comunidade.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="login-email" className="block text-sm text-gray-300">
            E-mail
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
            />
          </label>
          <label htmlFor="login-password" className="block text-sm text-gray-300">
            Senha
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
            />
          </label>
          {error && <FeedbackMessage variant="error">{error}</FeedbackMessage>}
          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-pink-600 p-3 font-semibold transition hover:bg-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-5 text-sm text-gray-400">
          Ainda não tem conta? <Link className="inline-flex min-h-11 items-center text-pink-400 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400" to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
  )
}