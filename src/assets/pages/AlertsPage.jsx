import { useReports } from '../hooks/useReports'
import ReportsList from '../components/ReportsList'

export default function AlertsPage() {
  const { reports, loading, error, loadReports } = useReports()
  const activeReports = reports.filter(report => report.status !== 'encerrado')

  return (
    <main className="space-y-6 p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Ocorrências ativas</h1>
        <p className="mt-1 text-sm text-gray-400">
          Exibição de relatos da API. Dados meteorológicos não representam alertas oficiais da Defesa Civil.
        </p>
      </header>
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 text-red-400">
          {error}
          <button type="button" onClick={async () => {
            try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
          }} className="underline">Tentar novamente</button>
        </div>
      )}
      {loading ? <p className="text-gray-400">Carregando ocorrências...</p> : (
        <ReportsList reports={activeReports} />
      )}
    </main>
  )
}