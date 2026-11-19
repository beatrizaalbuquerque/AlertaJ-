import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Waves } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import ReportsList from '../components/ReportsList'
import RiskMap from '../components/RiskMap'
import { useRegion } from '../hooks/useRegion'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

const statusOptions = [
  { value: 'all', label: 'Todas as ocorrências' },
  { value: 'não confirmado', label: 'Não confirmadas' },
  { value: 'confirmado', label: 'Confirmadas' },
  { value: 'encerrado', label: 'Encerradas' }
]

export default function MapPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [reportsOpen, setReportsOpen] = useState(false)
  const { reports, loading, error, loadReports } = useReports()
  const {
    region, loading: regionLoading, error: regionError, loadRegion
  } = useRegion()

  const visibleReports = reports.filter(report =>
    statusFilter === 'all' || report.status === statusFilter
  )
  const mappedReports = visibleReports.filter(report =>
    typeof report.latitude === 'number' && typeof report.longitude === 'number'
  )
  const openCount = reports.filter(report => report.status !== 'encerrado').length

  async function retryLoading() {
    if (error) {
      try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
    }
    if (regionError) await loadRegion()
  }

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:space-y-7 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
            Itaquaquecetuba · SP
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Mapa de ocorrências
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            {region
              ? `Limite municipal oficial de ${region.name} — ${region.state}. Selecione um marcador para consultar o relato.`
              : 'Carregando os limites oficiais do município.'}
          </p>
        </div>
        <label className="flex w-full flex-col gap-2 text-xs font-medium text-gray-400 sm:w-auto">
          Exibir no mapa
          <select
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-white/10 bg-[#17171d] px-3 text-sm text-gray-100 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </header>

      {!loading && !error && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/[0.07] pb-4 text-sm">
          <span className="inline-flex items-center gap-2 text-gray-300">
            <MapPin size={16} className="text-sky-300" aria-hidden="true" />
            {mappedReports.length} {mappedReports.length === 1 ? 'marcador' : 'marcadores'} no mapa
          </span>
          <span className="inline-flex items-center gap-2 text-gray-500">
            <Waves size={16} aria-hidden="true" />
            {openCount} ocorrências não encerradas
          </span>
        </div>
      )}

      {(error || regionError) && (
        <FeedbackMessage variant="error">
          <span>{error || regionError}</span>
          <button
            type="button"
            onClick={retryLoading}
            className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          >
            Tentar novamente
          </button>
        </FeedbackMessage>
      )}

      {loading || regionLoading ? (
        <LoadingState>Carregando ocorrências e limites oficiais...</LoadingState>
      ) : (
        <>
          {region && (
            <RiskMap
              center={region.center}
              boundary={region.boundary}
              reports={visibleReports}
            />
          )}
          <section className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setReportsOpen(open => !open)}
              aria-expanded={reportsOpen}
              className="flex min-h-11 w-full items-center justify-between gap-3 text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            >
              <span>
                <span className="block font-medium text-gray-100">Relatos desta seleção</span>
                <span className="mt-1 block text-xs text-gray-500">
                  {visibleReports.length} {visibleReports.length === 1 ? 'relato' : 'relatos'}
                </span>
              </span>
              <span aria-hidden="true" className="text-lg text-sky-300">
                {reportsOpen ? '−' : '+'}
              </span>
            </button>
            {reportsOpen && (
              <div className="mt-4">
                <ReportsList reports={visibleReports} />
              </div>
            )}
          </section>
        </>
      )}
      <p className="text-xs leading-5 text-gray-500">
        Os marcadores representam relatos enviados por moradores; não substituem alertas oficiais.
        {' '}<Link to="/alertas" className="text-sky-300 underline underline-offset-2 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-sky-300">Ver ocorrências ativas</Link>
      </p>
    </main>
  )
}
