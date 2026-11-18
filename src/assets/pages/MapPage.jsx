import { useReports } from '../hooks/useReports'
import ReportsList from '../components/ReportsList'
import RiskMap from '../components/RiskMap'
import { useRegion } from '../hooks/useRegion'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

export default function MapPage() {
  const { reports, loading, error, loadReports } = useReports()
  const {
    region, loading: regionLoading, error: regionError, loadRegion
  } = useRegion()

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Mapa de ocorrências</h1>
        <p className="mt-1 text-sm text-gray-400">
          {region
            ? `Limite municipal oficial de ${region.name} — ${region.state}; marcadores são filtrados pela API.`
            : 'Carregando os limites oficiais do município.'}
        </p>
      </header>
      {(error || regionError) && (
        <FeedbackMessage variant="error">
          <span>{error || regionError}</span>
          <button type="button" onClick={async () => {
            if (error) {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }
            if (regionError) await loadRegion()
          }} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">Tentar novamente</button>
        </FeedbackMessage>
      )}
      {loading || regionLoading ? <LoadingState>Carregando ocorrências e limites oficiais...</LoadingState> : (
        <>
          {region && (
            <RiskMap
              center={region.center}
              boundary={region.boundary}
              reports={reports}
            />
          )}
          <ReportsList reports={reports} />
        </>
      )}
    </main>
  )
}