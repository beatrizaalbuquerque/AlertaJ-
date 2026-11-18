import { Trash2 } from 'lucide-react'
import RiskBadge from './RiskBadge'
import EmptyState from './EmptyState'

export default function ReportsList({
  reports,
  onDelete,
  onEdit,
  onVote,
  currentUser,
  saving = false
}) {
  if (!reports.length) {
    return (
      <EmptyState>Nenhum relato disponível.</EmptyState>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map(report => (
        <article
          key={report.id}
          className="group flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-[#1b1b22] to-[#19191f] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-pink-400/30 hover:shadow-lg hover:shadow-black/10 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <div className="min-w-0 break-words">
            <h3 className="font-semibold">
              {report.location}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Nível da água: {report.waterLevel}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Registrado em: {new Date(report.createdAt).toLocaleString('pt-BR')}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RiskBadge level={report.status} />
              <span className="text-xs leading-5 text-gray-400">
                {report.confirmations} confirmações · {report.contests} contestações
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {currentUser?.id === report.authorId ? (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(report)}
                  disabled={saving}
                  className="min-h-11 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={event => onDelete?.(report.id, event.currentTarget)}
                  disabled={saving || !onDelete}
                  aria-label="Excluir relato"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : currentUser && report.status !== 'encerrado' ? (
              <>
                <button
                  type="button"
                  onClick={() => onVote(report.id, 'confirm')}
                  disabled={saving}
                  className="min-h-11 rounded-lg bg-green-700/40 px-4 py-2 text-sm text-green-200 transition hover:bg-green-700/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => onVote(report.id, 'contest')}
                  disabled={saving}
                  className="min-h-11 rounded-lg bg-yellow-700/30 px-4 py-2 text-sm text-yellow-200 transition hover:bg-yellow-700/50 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Contestar
                </button>
              </>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}