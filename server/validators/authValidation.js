import { ApiError } from '../middlewares/errors.js'

function validateObjectBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(400, 'INVALID_BODY', 'O corpo da requisição deve ser um objeto JSON.')
  }
  return body
}

export function validateRegistration(body = {}) {
  body = validateObjectBody(body)
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (name.length < 2 || name.length > 80) {
    throw new ApiError(400, 'INVALID_NAME', 'Informe um nome entre 2 e 80 caracteres.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new ApiError(400, 'INVALID_EMAIL', 'Informe um e-mail válido.')
  }
  if (password.length < 8 || password.length > 128) {
    throw new ApiError(400, 'INVALID_PASSWORD', 'A senha deve ter entre 8 e 128 caracteres.')
  }

  return { name, email, password }
}

export function validateLogin(body = {}) {
  body = validateObjectBody(body)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    throw new ApiError(400, 'INVALID_CREDENTIALS', 'E-mail e senha são obrigatórios.')
  }
  return { email, password }
}
