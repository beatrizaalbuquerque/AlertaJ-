import { useReports } from '../hooks/useReports'
import ReportsList from '../components/ReportsList'
import RiskMap from '../components/RiskMap'
import { useRegion } from '../hooks/useRegion'

export default function MapPage() {
  const { reports, loading, error, loadReports } = useReports()
  const {
    region, loading: regionLoading, error: regionError, loadRegion
  } = useRegion()

  return (
    <main className="space-y-6 p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Mapa de ocorrências</h1>
        <p className="mt-1 text-sm text-gray-400">
          {region
            ? `Limite municipal oficial de ${region.name} — ${region.state}; marcadores são filtrados pela API.`
            : 'Carregando os limites oficiais do município.'}
        </p>
      </header>
      {(error || regionError) && (
        <div role="alert" className="flex items-center justify-between gap-3 text-red-400">
          {error || regionError}
          <button type="button" onClick={async () => {
            if (error) {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }
            if (regionError) await loadRegion()
          }} className="underline">Tentar novamente</button>
        </div>
      )}
      {loading || regionLoading ? <p className="text-gray-400">Carregando ocorrências...</p> : (
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