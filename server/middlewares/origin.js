import { ApiError } from './errors.js'

export function isAllowedFrontendOrigin(origin, frontendUrl, allowLocalhost = false) {
  const allowedOrigin = new URL(frontendUrl).origin
  if (origin === allowedOrigin) return true
  if (!allowLocalhost) return false

  try {
    const parsedOrigin = new URL(origin)
    return parsedOrigin.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(parsedOrigin.hostname)
  } catch {
    return false
  }
}

export function createOriginGuard(frontendUrl, allowLocalhost = false) {
  return function originGuard(request, _response, next) {
    const origin = request.get('origin')
    if (origin && !isAllowedFrontendOrigin(origin, frontendUrl, allowLocalhost)) {
      return next(new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'Origem da requisição não permitida.'))
    }
    next()
  }
}
