import { Router } from 'express'

export function createAuthRoutes(controller, authLimiter, originGuard) {
  const router = Router()
  router.post('/register', originGuard, authLimiter, controller.register)
  router.post('/login', originGuard, authLimiter, controller.login)
  router.get('/me', controller.me)
  router.post('/logout', originGuard, controller.logout)
  return router
}
