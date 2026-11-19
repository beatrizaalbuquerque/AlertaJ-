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

  if (error?.type === 'entity.parse.failed') {
    return response.status(400).json({
      error: { code: 'INVALID_JSON', message: 'O corpo da requisição contém JSON inválido.' }
    })
  }

  if (error?.type === 'entity.too.large') {
    return response.status(413).json({
      error: { code: 'REQUEST_TOO_LARGE', message: 'O corpo da requisição excede o limite permitido.' }
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
