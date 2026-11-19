import express from 'express'
import session from 'express-session'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import process from 'node:process'
import { createAuthController } from './controllers/authController.js'
import { createReportController } from './controllers/reportController.js'
import { createDatabase } from './db/database.js'
import { SqliteSessionStore } from './db/SqliteSessionStore.js'
import { errorHandler } from './middlewares/errors.js'
import { createOriginGuard, isAllowedFrontendOrigin } from './middlewares/origin.js'
import { getPilotAreaCenter, validatePilotArea } from './services/geoService.js'
import { createAuthService } from './services/authService.js'
import { createReportService } from './services/reportService.js'
import { loadOfficialPilotArea } from './config.js'
import { createSupportLocationService } from './services/supportLocationService.js'
import { createAuthRoutes } from './routes/authRoutes.js'
import { createReportRoutes } from './routes/reportRoutes.js'

export function createApp({
  db = createDatabase(process.env.DATABASE_PATH || './server/data/alertaja.sqlite'),
  sessionSecret = process.env.SESSION_SECRET,
  frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173',
  pilotArea = loadOfficialPilotArea(),
  production = process.env.NODE_ENV === 'production'
} = {}) {
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error('Configure SESSION_SECRET com pelo menos 32 caracteres.')
  }
  validatePilotArea(pilotArea)

  const app = express()
  const originGuard = createOriginGuard(frontendUrl, !production)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: { code: 'AUTH_RATE_LIMIT', message: 'Muitas tentativas. Tente novamente mais tarde.' } }
  })
  const cookie = {
    httpOnly: true,
    secure: production,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }

  app.disable('x-powered-by')
  if (production) app.set('trust proxy', 1)
  app.use(helmet())
  app.use(cors({
    origin(origin, callback) {
      if (!origin || isAllowedFrontendOrigin(origin, frontendUrl, !production)) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  }))
  app.use(express.json({ limit: '20kb', strict: false }))
  app.use(session({
    name: 'alertaja.sid',
    secret: sessionSecret,
    store: new SqliteSessionStore(db),
    resave: false,
    saveUninitialized: false,
    cookie
  }))

  const authController = createAuthController(createAuthService(db))
  const reportService = createReportService(db, pilotArea)
  const supportLocationService = createSupportLocationService(db, pilotArea)
  const reportController = createReportController(reportService)
  const expirationTimer = setInterval(() => {
    try {
      reportService.expireReports()
      db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())
    } catch (error) {
      console.error('Falha ao encerrar relatos expirados:', error)
    }
  }, 60 * 1000)
  expirationTimer.unref()

  app.get('/api/health', (_request, response) => {
    response.json({
      status: 'ok',
      pilotAreaConfigured: Boolean(pilotArea),
      geographicValidation: pilotArea ? 'configured' : 'pending',
      pilotArea: 'Itaquaquecetuba-SP',
      ibgeCode: '3523107'
    })
  })
  app.get('/api/region', (_request, response) => {
    response.json({
      name: 'Itaquaquecetuba',
      state: 'SP',
      ibgeCode: '3523107',
      center: getPilotAreaCenter(pilotArea),
      boundary: pilotArea,
      boundarySource: 'IBGE Malha Municipal, API de Malhas, município 3523107, qualidade máxima'
    })
  })
  app.get('/api/support-locations', (request, response) => {
    response.json({
      locations: supportLocationService.list(request.query.type)
    })
  })
  app.use('/api/auth', createAuthRoutes(authController, authLimiter, originGuard))
  app.use('/api/reports', createReportRoutes(reportController, originGuard))
  app.use((request, _response, next) => {
    next(Object.assign(new Error(`Endpoint não encontrado: ${request.method} ${request.path}`), { status: 404 }))
  })
  app.use(errorHandler)

  app.locals.db = db
  app.locals.reportService = reportService
  app.locals.supportLocationService = supportLocationService
  app.locals.expirationTimer = expirationTimer
  return app
}
