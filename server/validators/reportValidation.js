import { ApiError } from '../middlewares/errors.js'

const waterLevels = new Set(['baixo', 'medio', 'alto'])

export function validateReportInput(body = {}, partial = false) {
  const report = {}
  const allowedFields = new Set([
    'location', 'latitude', 'longitude', 'waterLevel'
  ])
  for (const field of Object.keys(body)) {
    if (!allowedFields.has(field)) {
      throw new ApiError(400, 'INVALID_FIELD', `Campo não permitido: ${field}.`)
    }
  }

  if (!partial || Object.hasOwn(body, 'location')) {
    report.location = typeof body.location === 'string' ? body.location.trim() : ''
    if (!report.location || report.location.length > 200) {
      throw new ApiError(400, 'INVALID_LOCATION', 'Informe uma localização de até 200 caracteres.')
    }
  }

  if (!partial || Object.hasOwn(body, 'latitude')) {
    report.latitude = body.latitude
    if (typeof report.latitude !== 'number' || !Number.isFinite(report.latitude) ||
        report.latitude < -90 || report.latitude > 90) {
      throw new ApiError(400, 'INVALID_LATITUDE', 'Informe uma latitude válida.')
    }
  }

  if (!partial || Object.hasOwn(body, 'longitude')) {
    report.longitude = body.longitude
    if (typeof report.longitude !== 'number' || !Number.isFinite(report.longitude) ||
        report.longitude < -180 || report.longitude > 180) {
      throw new ApiError(400, 'INVALID_LONGITUDE', 'Informe uma longitude válida.')
    }
  }

  if (!partial || Object.hasOwn(body, 'waterLevel')) {
    report.waterLevel = body.waterLevel
    if (!waterLevels.has(report.waterLevel)) {
      throw new ApiError(400, 'INVALID_WATER_LEVEL', 'Nível da água inválido.')
    }
  }

  if (Object.hasOwn(body, 'status') || Object.hasOwn(body, 'authorId') ||
      Object.hasOwn(body, 'createdAt') || Object.hasOwn(body, 'userId')) {
    throw new ApiError(400, 'IMMUTABLE_FIELD', 'Autor, horário e status não podem ser informados.')
  }

  return report
}

export function validateVote(body = {}) {
  if (!['confirm', 'contest'].includes(body.type)) {
    throw new ApiError(400, 'INVALID_VOTE', 'O voto deve ser confirmação ou contestação.')
  }
  return body.type
}
