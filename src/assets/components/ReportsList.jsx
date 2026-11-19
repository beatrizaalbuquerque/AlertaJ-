import { CalendarDays, MapPin, Trash2, Waves } from 'lucide-react'
import RiskBadge from './RiskBadge'
import EmptyState from './EmptyState'

export default function ReportsList({
  reports,
  onDelete,
  onEdit,
  onVote,
  currentUser,
  saving = false,
  emptyMessage = 'Nenhum relato disponível.'
}) {
  if (!reports.length) {
    return (
      <EmptyState>{emptyMessage}</EmptyState>
    )
  }

  return (
    <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {reports.map(report => (
        <li key={report.id} className="list-none">
          <article className="group flex min-w-0 flex-col justify-between gap-4 py-4 transition-colors hover:bg-white/[0.015] sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:px-3">
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span aria-hidden="true" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
              <MapPin size={17} />
            </span>
            <div className="min-w-0 flex-1 break-words">
              <h3 className="font-medium text-gray-100">{report.location}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Waves size={14} aria-hidden="true" />
                  Nível da água: {report.waterLevel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} aria-hidden="true" />
                  {new Date(report.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RiskBadge level={report.status} />
                <span className="text-xs leading-5 text-gray-500">
                  {report.confirmations} confirmações · {report.contests} contestações
                </span>
              </div>
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
        </li>
      ))}
    </ul>
  )
}