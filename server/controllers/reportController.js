import { ApiError } from '../middlewares/errors.js'
import { validateReportInput, validateVote } from '../validators/reportValidation.js'

function parseId(value) {
  const id = Number(value)
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ApiError(400, 'INVALID_ID', 'Identificador inválido.')
  }
  return id
}

export function createReportController(reportService) {
  return {
    list: (request, response) => {
      const status = request.query.status
      if (status && !['não confirmado', 'confirmado', 'encerrado'].includes(status)) {
        throw new ApiError(400, 'INVALID_STATUS', 'Filtro de status inválido.')
      }
      response.json({ reports: reportService.list(status) })
    },

    get: (request, response) => {
      response.json({ report: reportService.get(parseId(request.params.id)) })
    },

    create: (request, response) => {
      const report = reportService.create(
        request.session.user.id,
        validateReportInput(request.body)
      )
      response.status(201).json({ report })
    },

    update: (request, response) => {
      const report = reportService.update(
        parseId(request.params.id),
        request.session.user.id,
        validateReportInput(request.body, true)
      )
      response.json({ report })
    },

    remove: (request, response) => {
      reportService.remove(parseId(request.params.id), request.session.user.id)
      response.status(204).end()
    },

    vote: (request, response) => {
      const report = reportService.vote(
        parseId(request.params.id),
        request.session.user.id,
        validateVote(request.body)
      )
      response.json({ report })
    }
  }
}
