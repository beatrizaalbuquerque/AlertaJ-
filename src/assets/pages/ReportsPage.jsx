import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReportForm from '../components/ReportForm'
import ReportsList from '../components/ReportsList'
import { useAuth } from '../hooks/useAuth'
import { useReports } from '../hooks/useReports'
import ConfirmDialog from '../components/ConfirmDialog'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'
import { MapPin } from 'lucide-react'

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
  const [pendingDelete, setPendingDelete] = useState(null)
  const {
    reports, loading, error, success, saving, loadReports,
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

  async function confirmDelete() {
    try {
      await deleteReport(pendingDelete.id)
      if (editing?.id === pendingDelete.id) setEditing(null)
    } catch {
      // O erro fica disponível no estado do hook e é exibido na página.
    } finally {
      setPendingDelete(null)
      requestAnimationFrame(() => {
        document.getElementById('reports-list-heading')?.focus()
      })
    }
  }

  function cancelDelete() {
    const trigger = pendingDelete?.trigger
    setPendingDelete(null)
    requestAnimationFrame(() => trigger?.focus())
  }

  async function castVote(id, type) {
    try {
      await voteReport(id, type)
    } catch {
      // O erro fica disponível no estado do hook e é exibido na página.
    }
  }

  return (
    <main className="min-w-0 space-y-8 p-4 sm:p-5 md:space-y-9 md:p-8">
      <header className="flex items-start gap-5 border-b border-white/10 pb-6">
        <span aria-hidden="true" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-pink-300">
          <MapPin size={22} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-300">Itaquaquecetuba · SP</p>
          <h1 className="mt-1 text-2xl font-bold">Relatos de alagamento</h1>
          <p className="mt-1 text-sm leading-6 text-gray-400">
          Ocorrências comunitárias consultadas diretamente na API.
          </p>
        </div>
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
      ) : authLoading ? (
        <LoadingState>Verificando sessão...</LoadingState>
      ) : (
        <aside className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5 text-sm leading-6 text-gray-300">
          Entre ou crie uma conta para registrar, votar, editar ou excluir relatos.
          <Link to="/login" className="ml-2 inline-flex min-h-11 items-center text-pink-400 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">Entrar</Link>
        </aside>
      )}

      {success && <FeedbackMessage variant="success">{success}</FeedbackMessage>}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="reports-list-heading" tabIndex={-1} className="text-xl font-bold focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400">Ocorrências registradas</h2>
          <label htmlFor="reports-status-filter" className="flex w-full flex-col gap-2 text-sm text-gray-300 sm:w-auto sm:flex-row sm:items-center">
            Filtrar
            <select
              id="reports-status-filter"
              value={status}
              onChange={event => setStatus(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-white/10 bg-[#1b1b22] px-3 py-2 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400 sm:w-auto"
            >
              {statuses.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
        {error && (
          <FeedbackMessage variant="error">
            <span>{error}</span>
            <button type="button" onClick={async () => {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
              Tentar novamente
            </button>
          </FeedbackMessage>
        )}
        {loading ? (
          <LoadingState>Carregando relatos...</LoadingState>
        ) : !error ? (
          <ReportsList
            reports={reports}
            currentUser={user}
            onDelete={(id, trigger) => setPendingDelete({
              ...reports.find(report => report.id === id),
              trigger
            })}
            onEdit={setEditing}
            onVote={castVote}
            saving={saving}
          />
        ) : null}
      </section>
      {pendingDelete && (
        <ConfirmDialog
          title="Excluir relato?"
          message={`O relato de ${pendingDelete.location} será removido. Esta ação não pode ser desfeita.`}
          busy={saving}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  )
}