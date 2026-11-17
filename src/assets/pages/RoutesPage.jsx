import { useReports } from '../hooks/useReports'

export default function RoutesPage() {
  const { reports, loading, error, loadReports } = useReports()
  const eligibleReports = reports.filter(report => report.status !== 'encerrado')

  return (
    <main className="space-y-6 p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Rotas alternativas</h1>
        <p className="mt-1 text-sm text-gray-400">
          Relatos encerrados são excluídos dos pontos elegíveis para rotas.
        </p>
      </header>
      <section className="rounded-2xl border border-white/10 bg-[#1b1b22] p-5">
        <h2 className="font-semibold">Cálculo de rotas</h2>
        <p className="mt-2 text-sm text-gray-400">
          O projeto ainda não possui uma rede viária nem algoritmo de roteamento configurados. Os relatos ativos abaixo são apenas dados elegíveis; nenhuma rota está sendo calculada.
        </p>
        {error && (
          <div role="alert" className="mt-3 flex items-center justify-between gap-3 text-red-400">
            {error}
            <button type="button" onClick={async () => {
              try { await loadReports() } catch { /* erro já está exposto pelo hook */ }
            }} className="underline">Tentar novamente</button>
          </div>
        )}
        {loading ? <p className="mt-4 text-gray-400">Carregando dados...</p> : (
          <p className="mt-4 text-sm text-gray-300">
            {eligibleReports.length} ocorrência(s) não encerrada(s); encerradas excluídas.
          </p>
        )}
      </section>
    </main>
  )
}
