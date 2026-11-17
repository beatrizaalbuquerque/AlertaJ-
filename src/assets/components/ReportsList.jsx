import { Trash2 } from 'lucide-react'
import RiskBadge from './RiskBadge'

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
      <p className="text-gray-400">
        Nenhum relato disponível.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map(report => (
        <article
          key={report.id}
          className="bg-[#1b1b22] border border-white/10 rounded-xl p-4 flex flex-wrap justify-between gap-3"
        >
          <div>
            <h3 className="font-semibold">
              {report.location}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Nível da água: {report.waterLevel}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Registrado em: {new Date(report.createdAt).toLocaleString('pt-BR')}
            </p>

            <div className="flex gap-2 mt-3">
              <RiskBadge level={report.status} />
              <span className="text-xs text-gray-400 self-center">
                {report.confirmations} confirmações · {report.contests} contestações
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentUser?.id === report.authorId ? (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(report)}
                  disabled={saving}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(report.id)}
                  disabled={saving}
                  aria-label="Excluir relato"
                  className="text-red-400 hover:text-red-300 p-2"
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
                  className="rounded-lg bg-green-700/40 px-3 py-2 text-sm text-green-200 hover:bg-green-700/60"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => onVote(report.id, 'contest')}
                  disabled={saving}
                  className="rounded-lg bg-yellow-700/30 px-3 py-2 text-sm text-yellow-200 hover:bg-yellow-700/50"
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