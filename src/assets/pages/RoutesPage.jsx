import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Route, Waves } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

export default function RoutesPage() {
  const [showPoints, setShowPoints] = useState(false)
  const { reports, loading, error, loadReports } = useReports()
  const eligibleReports = reports.filter(report => report.status !== 'encerrado')

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:space-y-7 md:p-8">
      <header className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">Mobilidade segura</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Rotas alternativas</h1>
        <p className="mt-2 text-sm leading-6 text-gray-400">
          Consulte os relatos ativos que podem ajudar no planejamento do deslocamento.
        </p>
      </header>

      <section className="border-y border-white/[0.08] py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
              <Route size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-gray-100">Planejamento de rotas</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
                Ainda não há rede viária nem algoritmo de roteamento integrado. Por isso, o AlertaJá não calcula nem recomenda caminhos.
              </p>
            </div>
          </div>
          <Link
            to="/mapa"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-medium text-sky-200 transition hover:border-sky-300/30 hover:bg-sky-300/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            Ver mapa de relatos
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {error && (
          <FeedbackMessage variant="error" className="mt-4">
            <span>{error}</span>
            <button type="button" onClick={async () => {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
              Tentar novamente
            </button>
          </FeedbackMessage>
        )}
        {loading ? <LoadingState>Carregando dados...</LoadingState> : (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-300">
            <Waves size={16} className="text-sky-300" aria-hidden="true" />
            {eligibleReports.length} ocorrências não encerradas; encerradas não são consideradas.
          </p>
        )}
      </section>

      {!loading && !error && (
        <section>
          <button
            type="button"
            onClick={() => setShowPoints(open => !open)}
            aria-expanded={showPoints}
            className="flex min-h-11 w-full items-center justify-between gap-4 text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            <span>
              <span className="block font-medium text-gray-100">Pontos ativos registrados</span>
              <span className="mt-1 block text-xs text-gray-500">A lista apresenta relatos, não trajetos calculados.</span>
            </span>
            <span aria-hidden="true" className="text-lg text-sky-300">{showPoints ? '−' : '+'}</span>
          </button>
          {showPoints && (
            eligibleReports.length ? (
              <ul className="mt-3 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {eligibleReports.map(report => (
                  <li key={report.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-gray-200">{report.location}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Nível da água: {report.waterLevel} · {new Date(report.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{report.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 border-y border-white/[0.07] py-4 text-sm text-gray-500">
                Não há pontos ativos para exibir.
              </p>
            )
          )}
        </section>
      )}
    </main>
  )
}
