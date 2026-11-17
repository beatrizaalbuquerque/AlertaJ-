import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
    <main className="p-5 md:p-8">
      <section className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-[#1b1b22] p-6">
        <h1 className="text-2xl font-bold">Cadastro de morador</h1>
        <p className="mt-2 text-sm text-gray-400">
          Crie sua conta para contribuir com os relatos comunitários.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-gray-300">
            Nome
            <input
              type="text"
              autoComplete="name"
              minLength="2"
              maxLength="80"
              required
              value={name}
              onChange={event => setName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500"
            />
          </label>
          <label className="block text-sm text-gray-300">
            E-mail
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500"
            />
          </label>
          <label className="block text-sm text-gray-300">
            Senha
            <input
              type="password"
              autoComplete="new-password"
              minLength="8"
              maxLength="128"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500"
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-600 p-3 font-semibold hover:bg-pink-500 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-5 text-sm text-gray-400">
          Já tem conta? <Link className="text-pink-400" to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  )
}