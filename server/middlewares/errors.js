export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function errorHandler(error, _request, response, _next) {
  void _next
  if (error instanceof ApiError) {
    return response.status(error.status).json({
      error: { code: error.code, message: error.message }
    })
  }

  if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return response.status(409).json({
      error: { code: 'CONFLICT', message: 'Este e-mail já está cadastrado.' }
    })
  }

  console.error(error)
  if (Number.isInteger(error?.status) && error.status >= 400 && error.status < 500) {
    return response.status(error.status).json({
      error: {
        code: error.status === 404 ? 'NOT_FOUND' : 'BAD_REQUEST',
        message: error.message
      }
    })
  }

  return response.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Ocorreu um erro interno.' }
  })
}
