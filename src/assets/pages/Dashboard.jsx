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

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { region } = useRegion()
  const {
    reports,
    loading,
    error,
    loadReports,
    deleteReport,
    voteReport,
    saving
  } = useReports()

  const center = region?.center || null

  async function removeReport(id) {
    if (!window.confirm('Tem certeza de que deseja excluir este relato?')) return
    try {
      await deleteReport(id)
    } catch {
      // O erro fica disponível no estado do hook e é exibido nesta página.
    }
  }

  async function castVote(id, type) {
    try {
      await voteReport(id, type)
    } catch {
      // O erro fica disponível no estado do hook e é exibido nesta página.
    }
  }

  return (
    <main className="p-5 md:p-8 space-y-7">
      <Header />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Relatos registrados"
          value={reports.length}
          description="Registros retornados pela API"
          icon={MapPin}
        />

        <StatCard
          title="Ocorrências confirmadas"
          value={reports.filter(
            item => item.status === 'confirmado'
          ).length}
          description="Conforme status recebido da API"
          icon={AlertTriangle}
        />

        <StatCard
          title="Condições do tempo"
          value="Open-Meteo"
          description="Condições meteorológicas"
          icon={CloudRain}
        />

        <StatCard
          title="Abrigos"
          value="Consultar"
          description="Locais cadastrados na base"
          icon={House}
        />
      </section>

      <WeatherCard
        latitude={center?.[0] ?? null}
        longitude={center?.[1] ?? null}
        locationName={region ? `${region.name}, ${region.state}` : ''}
      />
      <p className="text-xs text-gray-400">
        Modelo matemático do grupo: f(t) = -2t² + 12t + 5. Integral de 0 a 6 horas: 102 mm acumulados no modelo; este valor não é uma previsão meteorológica.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Mapa de monitoramento
        </h2>
        <p className="text-sm text-gray-400">
          Limite municipal oficial de {region?.name || 'Itaquaquecetuba'} — {region?.state || 'SP'}.
        </p>

        <RiskMap
          center={center}
          boundary={region?.boundary}
          reports={reports}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Ocorrências recentes
        </h2>

        {loading && (
          <p>Carregando registros...</p>
        )}

        {error && (
          <div className="flex items-center justify-between gap-3 text-red-400">
            <p>{error}</p>
            <button type="button" onClick={async () => {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }} className="underline">
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <ReportsList
            reports={reports}
            currentUser={user}
            onDelete={removeReport}
            onVote={castVote}
            onEdit={report => navigate('/relatos', { state: { editReport: report } })}
            saving={saving}
          />
        )}
      </section>
    </main>
  )
}