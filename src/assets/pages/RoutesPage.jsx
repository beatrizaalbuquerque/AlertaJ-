import { useState } from 'react'
import { AlertTriangle, MapPin, RotateCcw, Route } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import { useRegion } from '../hooks/useRegion'
import { useRoutePlanner } from '../hooks/useRoutePlanner'
import { isPointInsideBoundary } from '../utils/geo'
import RoutePlannerMap from '../components/RoutePlannerMap'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

function formatDistance(meters) {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`
}

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return 'menos de 1 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`
}

function formatPoint(point) {
  return point ? `${point[0].toFixed(5)}, ${point[1].toFixed(5)}` : 'Não selecionado'
}

export default function RoutesPage() {
  const { reports, loading: reportsLoading, error: reportsError, loadReports } = useReports()
  const { region, loading: regionLoading, error: regionError, loadRegion } = useRegion()
  const {
    origin,
    destination,
    routes,
    loading: routeLoading,
    error: routeError,
    chooseOrigin,
    chooseDestination,
    calculate,
    clear,
    setError
  } = useRoutePlanner()
  const [activePoint, setActivePoint] = useState('origin')
  const [selectedRoute, setSelectedRoute] = useState(0)

  const confirmedReports = reports.filter(report => report.status === 'confirmado')
  const isLoading = reportsLoading || regionLoading

  function selectMapPoint(point) {
    if (region?.boundary && !isPointInsideBoundary(point[0], point[1], region.boundary)) {
      setError('Selecione origem e destino dentro do limite da região piloto.')
      return
    }

    if (activePoint === 'origin') {
      chooseOrigin(point)
      setActivePoint('destination')
    } else {
      chooseDestination(point)
    }
    setSelectedRoute(0)
  }

  async function retryLoading() {
    if (reportsError) {
      try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
    }
    if (regionError) await loadRegion()
  }

  function resetPlanner() {
    clear()
    setSelectedRoute(0)
    setActivePoint('origin')
  }

  const selectedRouteData = routes[selectedRoute]

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:space-y-7 md:p-8">
      <header className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
          Itaquaquecetuba · SP
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Rotas alternativas</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Selecione dois pontos no mapa para consultar trajetos viários do serviço de roteamento.
        </p>
      </header>

      {reportsError || regionError ? (
        <FeedbackMessage variant="error">
          <span>{reportsError || regionError}</span>
          <button
            type="button"
            onClick={retryLoading}
            className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          >
            Tentar novamente
          </button>
        </FeedbackMessage>
      ) : null}

      {isLoading ? (
        <LoadingState>Carregando relatos e limite municipal...</LoadingState>
      ) : region ? (
        <>
          <section aria-label="Pontos do trajeto" className="grid gap-3 border-y border-white/[0.08] py-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setActivePoint('origin')}
              aria-pressed={activePoint === 'origin'}
              className={`flex min-h-14 items-center gap-3 rounded-lg border px-3 text-left transition focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                activePoint === 'origin'
                  ? 'border-sky-300/40 bg-sky-300/[0.06]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400/10 text-xs font-semibold text-sky-200">A</span>
              <span className="min-w-0">
                <span className="block text-xs text-gray-500">Origem</span>
                <span className="block truncate text-sm text-gray-100">{formatPoint(origin)}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActivePoint('destination')}
              aria-pressed={activePoint === 'destination'}
              className={`flex min-h-14 items-center gap-3 rounded-lg border px-3 text-left transition focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                activePoint === 'destination'
                  ? 'border-sky-300/40 bg-sky-300/[0.06]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-xs font-semibold text-violet-200">B</span>
              <span className="min-w-0">
                <span className="block text-xs text-gray-500">Destino</span>
                <span className="block truncate text-sm text-gray-100">{formatPoint(destination)}</span>
              </span>
            </button>
          </section>

          <p className="flex items-center gap-2 text-sm text-gray-400" aria-live="polite">
            <MapPin size={16} className="text-sky-300" aria-hidden="true" />
            Clique no mapa para definir {activePoint === 'origin' ? 'a origem' : 'o destino'}.
          </p>
          <p className="text-xs leading-5 text-gray-500">
            Com o mapa focado, use as setas para deslocar a área visível e pressione Enter para selecionar o centro.
          </p>

          <RoutePlannerMap
            center={region.center}
            boundary={region.boundary}
            origin={origin}
            destination={destination}
            confirmedReports={confirmedReports}
            activePoint={activePoint}
            onSelect={selectMapPoint}
            routes={confirmedReports.length ? [] : routes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
          />

          {confirmedReports.length > 0 && (
            <FeedbackMessage variant="info" className="border-amber-400/20 bg-amber-400/[0.04] text-amber-100">
              <span className="flex items-start gap-2">
                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                Há {confirmedReports.length} ocorrência(s) confirmada(s) na região. O serviço de roteamento não consegue evitar esses pontos. O cálculo está bloqueado e nenhum trajeto será indicado.
              </span>
            </FeedbackMessage>
          )}

          {routeError && (
            <FeedbackMessage variant="error">{routeError}</FeedbackMessage>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setSelectedRoute(0)
                calculate(confirmedReports.length > 0)
              }}
              disabled={routeLoading || isLoading || reportsError || confirmedReports.length > 0}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Route size={17} aria-hidden="true" />
              {routeLoading ? 'Consultando serviço de rotas...' : 'Consultar trajeto'}
            </button>
            <button
              type="button"
              onClick={resetPlanner}
              disabled={routeLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.04] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:opacity-50"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Limpar pontos
            </button>
          </div>

          {routes.length > 0 && (
            <section className="border-y border-white/[0.08] py-4" aria-label="Trajetos calculados">
              <p className="mb-3 text-xs leading-5 text-amber-200/80">
                Trajetos calculados pelo roteador — não verificados quanto a alagamentos, bloqueios ou condições atuais das vias.
              </p>
              <ul className="divide-y divide-white/[0.07]">
                {routes.map((route, index) => (
                  <li key={route.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedRoute(index)}
                      aria-pressed={selectedRoute === index}
                      className={`flex min-h-14 w-full items-center justify-between gap-4 py-2 text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                        selectedRoute === index ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium">Trajeto {index + 1}</span>
                        <span className="mt-1 block text-xs text-gray-500">
                          {formatDistance(route.distance)} · {formatDuration(route.duration)}
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-sky-300">{selectedRoute === index ? '●' : '○'}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {selectedRouteData && (
                <p className="mt-3 text-xs text-gray-500">
                  O trajeto selecionado tem {formatDistance(selectedRouteData.distance)} e duração estimada de {formatDuration(selectedRouteData.duration)} pelo roteador.
                </p>
              )}
            </section>
          )}

          <p className="text-xs leading-5 text-gray-500">
            Os pontos escolhidos são enviados ao serviço público <a href="https://project-osrm.org/" target="_blank" rel="noreferrer" className="text-sky-300 underline underline-offset-2 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">OSRM/OpenStreetMap</a> para consultar o trajeto. A disponibilidade depende do serviço externo.
          </p>
        </>
      ) : null}
    </main>
  )
}
