import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReportForm from '../components/ReportForm'
import ReportsList from '../components/ReportsList'
import { useAuth } from '../hooks/useAuth'
import { useReports } from '../hooks/useReports'

const statuses = [
  { value: '', label: 'Todos os status' },
  { value: 'não confirmado', label: 'Não confirmados' },
  { value: 'confirmado', label: 'Confirmados' },
  { value: 'encerrado', label: 'Encerrados' }
]

export default function ReportsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(location.state?.editReport || null)
  const {
    reports, loading, error, saving, loadReports,
    createReport, updateReport, deleteReport, voteReport
  } = useReports(status)

  async function submitReport(input) {
    if (editing) {
      await updateReport(editing.id, input)
      setEditing(null)
      navigate('/relatos', { replace: true, state: null })
    } else {
      await createReport(input)
    }
  }

  async function removeReport(id) {
    if (!window.confirm('Tem certeza de que deseja excluir este relato?')) return
    try {
      await deleteReport(id)
      if (editing?.id === id) setEditing(null)
    } catch {
      // O erro fica disponível no estado do hook e é exibido na página.
    }
  }

  async function castVote(id, type) {
    try {
      await voteReport(id, type)
    } catch {
      // O erro fica disponível no estado do hook e é exibido na página.
    }
  }

  return (
    <main className="space-y-7 p-5 md:p-8">
      <header className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-bold">Relatos de alagamento</h1>
        <p className="mt-1 text-sm text-gray-400">
          Ocorrências comunitárias consultadas diretamente na API.
        </p>
      </header>

      {!authLoading && user ? (
        <ReportForm
          key={editing?.id || 'new-report'}
          onSubmit={submitReport}
          initialReport={editing}
          onCancel={() => {
            setEditing(null)
            navigate('/relatos', { replace: true, state: null })
          }}
          saving={saving}
        />
      ) : !authLoading ? (
        <aside className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 text-sm text-gray-300">
          Entre ou crie uma conta para registrar, votar, editar ou excluir relatos.
          <Link to="/login" className="ml-2 text-pink-400">Entrar</Link>
        </aside>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Ocorrências registradas</h2>
          <label className="text-sm text-gray-300">
            Filtrar
            <select
              value={status}
              onChange={event => setStatus(event.target.value)}
              className="ml-2 rounded-lg border border-white/10 bg-[#1b1b22] p-2"
            >
              {statuses.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 text-red-400">
            <p>{error}</p>
            <button type="button" onClick={async () => {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }} className="underline">
              Tentar novamente
            </button>
          </div>
        )}
        {loading ? (
          <p className="text-gray-400">Carregando relatos...</p>
        ) : !error ? (
          <ReportsList
            reports={reports}
            currentUser={user}
            onDelete={removeReport}
            onEdit={setEditing}
            onVote={castVote}
            saving={saving}
          />
        ) : null}
      </section>
    </main>
  )
}