import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const officialBoundaryPath = fileURLToPath(
  new URL('./geo/itaquaquecetuba-ibge.geojson', import.meta.url)
)

export function loadOfficialPilotArea() {
  const collection = JSON.parse(fs.readFileSync(officialBoundaryPath, 'utf8'))
  const area = collection.features?.find(
    feature => feature.properties?.codarea === '3523107'
  )

  if (!area || !['Polygon', 'MultiPolygon'].includes(area.geometry?.type)) {
    throw new Error('A malha oficial IBGE de Itaquaquecetuba está inválida.')
  }
  return area
}

export function loadConfig(env = process.env) {
  const databasePath = env.DATABASE_PATH || './server/data/alertaja.sqlite'
  const absoluteDatabasePath = path.isAbsolute(databasePath)
    ? databasePath
    : path.resolve(process.cwd(), databasePath)
  let sessionSecret = env.SESSION_SECRET

  if (!sessionSecret && env.NODE_ENV === 'production') {
    throw new Error('Configure SESSION_SECRET antes de iniciar em produção.')
  }

  if (!sessionSecret) {
    const dataDirectory = path.dirname(absoluteDatabasePath)
    const secretPath = path.join(dataDirectory, 'session-secret')
    fs.mkdirSync(dataDirectory, { recursive: true })

    try {
      sessionSecret = fs.readFileSync(secretPath, 'utf8').trim()
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      const generatedSecret = randomBytes(48).toString('hex')
      try {
        fs.writeFileSync(secretPath, generatedSecret, { encoding: 'utf8', flag: 'wx', mode: 0o600 })
        sessionSecret = generatedSecret
      } catch (writeError) {
        if (writeError.code !== 'EEXIST') throw writeError
        sessionSecret = fs.readFileSync(secretPath, 'utf8').trim()
      }
    }

    if (sessionSecret.length < 32) {
      throw new Error('O segredo de sessão local precisa ter pelo menos 32 caracteres.')
    }
  }

  return {
    port: Number(env.PORT || 3000),
    frontendUrl: env.FRONTEND_URL || 'http://localhost:5173',
    sessionSecret,
    databasePath: absoluteDatabasePath,
    pilotArea: loadOfficialPilotArea()
  }
}
