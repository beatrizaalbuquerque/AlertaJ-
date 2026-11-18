import { useReports } from '../hooks/useReports'
import ReportsList from '../components/ReportsList'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

export default function AlertsPage() {
  const { reports, loading, error, loadReports } = useReports()
  const activeReports = reports.filter(report => report.status !== 'encerrado')

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Ocorrências ativas</h1>
        <p className="mt-1 text-sm text-gray-400">
          Exibição de relatos da API. Dados meteorológicos não representam alertas oficiais da Defesa Civil.
        </p>
      </header>
      {error && (
        <FeedbackMessage variant="error">
          <span>{error}</span>
          <button type="button" onClick={async () => {
            try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
          }} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">Tentar novamente</button>
        </FeedbackMessage>
      )}
      {loading ? <LoadingState>Carregando ocorrências...</LoadingState> : (
        <ReportsList reports={activeReports} />
      )}
    </main>
  )
}