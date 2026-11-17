import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'

export function createReportRoutes(controller, originGuard) {
  const router = Router()
  router.get('/', controller.list)
  router.get('/:id', controller.get)
  router.post('/', originGuard, requireAuth, controller.create)
  router.put('/:id', originGuard, requireAuth, controller.update)
  router.delete('/:id', originGuard, requireAuth, controller.remove)
  router.post('/:id/votes', originGuard, requireAuth, controller.vote)
  return router
}
