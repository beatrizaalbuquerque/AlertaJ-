import { ApiError } from './errors.js'

export function requireAuth(request, _response, next) {
  if (!request.session.user) {
    return next(new ApiError(401, 'AUTH_REQUIRED', 'Entre para realizar esta ação.'))
  }
  next()
}
