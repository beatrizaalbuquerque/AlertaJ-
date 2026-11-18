import { useReports } from '../hooks/useReports'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

export default function RoutesPage() {
  const { reports, loading, error, loadReports } = useReports()
  const eligibleReports = reports.filter(report => report.status !== 'encerrado')

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Rotas alternativas</h1>
        <p className="mt-1 text-sm text-gray-400">
          Relatos encerrados são excluídos dos pontos elegíveis para rotas.
        </p>
      </header>
      <section className="min-w-0 rounded-2xl border border-white/10 bg-[#1b1b22] p-4 sm:p-5">
        <h2 className="font-semibold">Cálculo de rotas</h2>
        <p className="mt-2 text-sm text-gray-400">
          O projeto ainda não possui uma rede viária nem algoritmo de roteamento configurados. Os relatos ativos abaixo são apenas dados elegíveis; nenhuma rota está sendo calculada.
        </p>
        {error && (
          <FeedbackMessage variant="error" className="mt-3">
            <span>{error}</span>
            <button type="button" onClick={async () => {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">Tentar novamente</button>
          </FeedbackMessage>
        )}
        {loading ? <LoadingState>Carregando dados...</LoadingState> : (
          <p className="mt-4 text-sm text-gray-300">
            {eligibleReports.length} ocorrência(s) não encerrada(s); encerradas excluídas.
          </p>
        )}
      </section>
    </main>
  )
}
