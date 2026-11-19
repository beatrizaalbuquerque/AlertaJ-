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
    <main className="min-w-0 space-y-7 p-4 sm:p-5 md:p-8">
      <Header />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Relatos registrados"
          value={reports.length}
          description="Ocorrências informadas por moradores"
          icon={MapPin}
          to="/relatos"
          tone="pink"
        />

        <StatCard
          title="Ocorrências confirmadas"
          value={reports.filter(
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

      <WeatherCard
        latitude={center?.[0] ?? null}
        longitude={center?.[1] ?? null}
        locationName={region ? `${region.name}, ${region.state}` : ''}
      />
      <p className="border-l-2 border-pink-400/40 pl-3 text-xs leading-5 text-gray-500">
        Modelo matemático do grupo: f(t) = -2t² + 12t + 5. Integral de 0 a 6 horas: 102 mm acumulados no modelo; este valor não é uma previsão meteorológica.
      </p>

      <section className="space-y-4">
        <div>
          <h2 id="dashboard-reports-heading" tabIndex={-1} className="text-xl font-semibold tracking-tight focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400">
          Mapa de monitoramento
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            Limite municipal oficial de {region?.name || 'Itaquaquecetuba'} — {region?.state || 'SP'}.
          </p>
        </div>

        <RiskMap
          center={center}
          boundary={region?.boundary}
          reports={reports}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Ocorrências recentes
        </h2>

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