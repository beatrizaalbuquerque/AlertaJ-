import { useState } from 'react'
import { AlertTriangle, Check, CircleHelp } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import ReportsList from '../components/ReportsList'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'não confirmado', label: 'Aguardando confirmação' },
  { value: 'confirmado', label: 'Confirmadas' }
]

export default function AlertsPage() {
  const [filter, setFilter] = useState('all')
  const { reports, loading, error, loadReports } = useReports()
  const activeReports = reports.filter(report => report.status !== 'encerrado')
  const visibleReports = activeReports.filter(report =>
    filter === 'all' || report.status === filter
  )
  const unconfirmedCount = activeReports.filter(report => report.status === 'não confirmado').length
  const confirmedCount = activeReports.filter(report => report.status === 'confirmado').length

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:space-y-7 md:p-8">
      <header className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
          Monitoramento comunitário
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Ocorrências ativas</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Relatos ainda não encerrados na região piloto. Os dados são informados por moradores e não substituem comunicados oficiais.
        </p>
      </header>

      <section aria-label="Resumo das ocorrências" className="grid grid-cols-2 border-y border-white/[0.08] sm:grid-cols-3">
        <div className="border-r border-white/[0.08] py-4 pr-3 sm:pr-5">
          <p className="text-2xl font-semibold tabular-nums text-white">{activeReports.length}</p>
          <p className="mt-1 text-xs text-gray-500">Ativas</p>
        </div>
        <div className="border-r border-white/[0.08] py-4 pl-3 sm:px-5">
          <p className="inline-flex items-center gap-2 text-2xl font-semibold tabular-nums text-amber-200">
            <CircleHelp size={18} aria-hidden="true" />
            {unconfirmedCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Aguardando confirmação</p>
        </div>
        <div className="col-span-2 py-4 pl-3 sm:col-span-1 sm:pl-5">
          <p className="inline-flex items-center gap-2 text-2xl font-semibold tabular-nums text-emerald-200">
            <Check size={18} aria-hidden="true" />
            {confirmedCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Confirmadas</p>
        </div>
      </section>

      <section aria-label="Filtrar ocorrências" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-medium text-gray-300">Relatos ativos</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
          {filters.map(option => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`min-h-10 rounded-md border px-3 text-xs font-medium transition focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                filter === option.value
                  ? 'border-amber-300/40 bg-amber-300/10 text-amber-100'
                  : 'border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
      {error && (
        <FeedbackMessage variant="error">
          <span>{error}</span>
          <button type="button" onClick={async () => {
            try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
          }} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">Tentar novamente</button>
        </FeedbackMessage>
      )}
      {loading ? <LoadingState>Carregando ocorrências...</LoadingState> : (
        <ReportsList
          reports={visibleReports}
          emptyMessage={
            filter === 'all'
              ? 'Não há ocorrências ativas cadastradas no momento.'
              : `Nenhuma ocorrência ativa ${filter === 'confirmado' ? 'confirmada' : 'aguardando confirmação'}.`
          }
        />
      )}
      <p className="flex items-start gap-2 border-l-2 border-amber-300/40 pl-3 text-xs leading-5 text-gray-500">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
        Em situações de risco imediato, procure os canais oficiais de emergência.
      </p>
    </main>
  )
}