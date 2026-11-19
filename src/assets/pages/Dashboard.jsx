import { useState } from 'react'
import {
  AlertTriangle,
  MapPin,
  CloudRain,
  House
} from 'lucide-react'

import Header from '../components/Header'
import StatCard from '../components/StatCard'
import WeatherCard from '../components/WeatherCard'
import RiskMap from '../components/RiskMap'
import ReportsList from '../components/ReportsList'
import { useReports } from '../hooks/useReports'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../hooks/useRegion'
import ConfirmDialog from '../components/ConfirmDialog'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

export default function Dashboard() {
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState(null)
  const { user } = useAuth()
  const { region } = useRegion()
  const {
    reports,
    loading,
    error,
    success,
    loadReports,
    deleteReport,
    voteReport,
    saving
  } = useReports()

  const center = region?.center || null

  async function confirmDelete() {
    try {
      await deleteReport(pendingDelete.id)
    } catch {
      // O erro fica disponível no estado do hook e é exibido nesta página.
    } finally {
      setPendingDelete(null)
      requestAnimationFrame(() => {
        document.getElementById('dashboard-reports-heading')?.focus()
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
      // O erro fica disponível no estado do hook e é exibido nesta página.
    }
  }

  return (
    <main className="min-w-0 space-y-7 p-4 sm:p-6 md:space-y-8 md:p-9">
      <Header />

      <section
        aria-label="Resumo do monitoramento"
        className="grid grid-cols-1 divide-y divide-white/[0.08] border-y border-white/[0.08] sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4"
      >
        <StatCard
          title="Relatos registrados"
          value={loading || error ? '—' : reports.length}
          description="Ocorrências informadas por moradores"
          icon={MapPin}
          to="/relatos"
          tone="pink"
        />

        <StatCard
          title="Ocorrências confirmadas"
          value={loading || error ? '—' : reports.filter(
            item => item.status === 'confirmado'
          ).length}
          description="Confirmadas pela comunidade"
          icon={AlertTriangle}
          tone="orange"
        />

        <StatCard
          title="Condições do tempo"
          value="Agora"
          description="Dados meteorológicos locais"
          icon={CloudRain}
          tone="blue"
        />

        <StatCard
          title="Abrigos"
          value="Ver locais"
          description="Pontos cadastrados na base"
          icon={House}
          to="/abrigos"
          tone="teal"
        />
      </section>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] lg:items-stretch">
        <WeatherCard
          latitude={center?.[0] ?? null}
          longitude={center?.[1] ?? null}
          locationName={region ? `${region.name}, ${region.state}` : ''}
        />
        <details className="group flex flex-col justify-center border-y border-white/[0.08] px-4 py-4 sm:px-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-gray-300 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 [&::-webkit-details-marker]:hidden">
            Modelo matemático do grupo
            <span aria-hidden="true" className="font-mono text-pink-300 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-prose pb-2 pt-2 text-xs leading-5 text-gray-500">
            f(t) = -2t² + 12t + 5. A integral de 0 a 6 horas resulta em 102 mm acumulados no modelo; este valor não é uma previsão meteorológica.
          </p>
        </details>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-sky-300">Visão territorial</p>
            <h2 id="dashboard-reports-heading" tabIndex={-1} className="mt-1 text-xl font-semibold tracking-tight focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400">
              Mapa de monitoramento
          </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Limite municipal oficial de {region?.name || 'Itaquaquecetuba'} — {region?.state || 'SP'}.
            </p>
          </div>
        </div>

        <RiskMap
          center={center}
          boundary={region?.boundary}
          reports={reports}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-white/[0.08] pb-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-pink-300">Atividade comunitária</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Ocorrências recentes</h2>
          </div>
        </div>

        {loading && (
          <LoadingState>Carregando registros...</LoadingState>
        )}

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

        {success && <FeedbackMessage variant="success">{success}</FeedbackMessage>}

        {!loading && !error && (
          <ReportsList
            reports={reports}
            currentUser={user}
            onDelete={(id, trigger) => setPendingDelete({
              ...reports.find(report => report.id === id),
              trigger
            })}
            onVote={castVote}
            onEdit={report => navigate('/relatos', { state: { editReport: report } })}
            saving={saving}
          />
        )}
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