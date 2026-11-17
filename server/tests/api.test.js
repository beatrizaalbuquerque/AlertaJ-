import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createApp } from '../app.js'
import { createDatabase } from '../db/database.js'
import { loadOfficialPilotArea } from '../config.js'
import { getPilotAreaCenter } from '../services/geoService.js'
import { loadConfig } from '../config.js'

const polygon = {
  type: 'Polygon',
  coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]]]
}
const origin = 'http://localhost:5173'
const reportInput = {
  location: 'Rua de teste',
  latitude: 1,
  longitude: 1,
  waterLevel: 'medio'
}

async function startApi(pilotArea = polygon) {
  const db = createDatabase(':memory:')
  const app = createApp({
    db,
    sessionSecret: 'test-session-secret-with-more-than-32-characters',
    frontendUrl: origin,
    pilotArea,
    production: false
  })
  const server = createServer(app)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  return {
    db,
    baseUrl: `http://127.0.0.1:${address.port}/api`,
    async close() {
      clearInterval(app.locals.expirationTimer)
      await new Promise((resolve, reject) =>
        server.close(error => error ? reject(error) : resolve())
      )
      db.close()
    }
  }
}

function request(api, endpoint, { method = 'GET', body, cookie } = {}) {
  return fetch(`${api.baseUrl}${endpoint}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(method !== 'GET' ? { Origin: origin } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  })
}

async function register(api, email) {
  const response = await request(api, '/auth/register', {
    method: 'POST',
    body: { name: email.split('@')[0], email, password: 'secure-password-123' }
  })
  assert.equal(response.status, 201)
  const data = await response.json()
  return {
    user: data.user,
    cookie: response.headers.get('set-cookie').split(';')[0]
  }
}

test('requires authentication and reports the missing pilot region without accepting a point', async t => {
  const api = await startApi(null)
  t.after(() => api.close())

  const health = await request(api, '/health')
  assert.deepEqual(await health.json(), {
    status: 'ok',
    pilotAreaConfigured: false,
    geographicValidation: 'pending',
    pilotArea: 'Itaquaquecetuba-SP',
    ibgeCode: '3523107'
  })

  const unauthorized = await request(api, '/reports', {
    method: 'POST',
    body: reportInput
  })
  assert.equal(unauthorized.status, 401)

  const resident = await register(api, 'resident@example.com')
  const session = await request(api, '/auth/me', { cookie: resident.cookie })
  const sessionData = await session.json()
  assert.equal(sessionData.user.email, 'resident@example.com')
  const login = await request(api, '/auth/login', {
    method: 'POST',
    body: { email: 'resident@example.com', password: 'secure-password-123' }
  })
  assert.equal(login.status, 200)
  assert.equal((await login.json()).user.id, sessionData.user.id)
  const invalidLogin = await request(api, '/auth/login', {
    method: 'POST',
    body: { email: 'resident@example.com', password: 'incorrect-password' }
  })
  assert.equal(invalidLogin.status, 401)
  const blocked = await request(api, '/reports', {
    method: 'POST',
    cookie: resident.cookie,
    body: reportInput
  })
  assert.equal(blocked.status, 503)
  assert.equal((await blocked.json()).error.code, 'PILOT_AREA_NOT_CONFIGURED')
})

test('creates, filters, edits, votes, closes and deletes reports with permissions enforced', async t => {
  const api = await startApi()
  t.after(() => api.close())

  const author = await register(api, 'author@example.com')
  const voterA = await register(api, 'voter-a@example.com')
  const voterB = await register(api, 'voter-b@example.com')
  const voterC = await register(api, 'voter-c@example.com')

  const createdResponse = await request(api, '/reports', {
    method: 'POST',
    cookie: author.cookie,
    body: reportInput
  })
  assert.equal(createdResponse.status, 201)
  const created = (await createdResponse.json()).report
  assert.equal(created.status, 'não confirmado')
  assert.equal(created.authorId, author.user.id)

  const selfVote = await request(api, `/reports/${created.id}/votes`, {
    method: 'POST',
    cookie: author.cookie,
    body: { type: 'confirm' }
  })
  assert.equal(selfVote.status, 403)

  const forbiddenUpdate = await request(api, `/reports/${created.id}`, {
    method: 'PUT',
    cookie: voterA.cookie,
    body: { location: 'Tentativa indevida' }
  })
  assert.equal(forbiddenUpdate.status, 403)

  const firstVote = await request(api, `/reports/${created.id}/votes`, {
    method: 'POST',
    cookie: voterA.cookie,
    body: { type: 'confirm' }
  })
  assert.equal((await firstVote.json()).report.confirmations, 1)

  const duplicateVote = await request(api, `/reports/${created.id}/votes`, {
    method: 'POST',
    cookie: voterA.cookie,
    body: { type: 'contest' }
  })
  assert.equal(duplicateVote.status, 409)

  const secondVote = await request(api, `/reports/${created.id}/votes`, {
    method: 'POST',
    cookie: voterB.cookie,
    body: { type: 'confirm' }
  })
  assert.equal((await secondVote.json()).report.status, 'confirmado')

  const contest = await request(api, `/reports/${created.id}/votes`, {
    method: 'POST',
    cookie: voterC.cookie,
    body: { type: 'contest' }
  })
  const contestedReport = (await contest.json()).report
  assert.equal(contestedReport.status, 'confirmado')
  assert.equal(contestedReport.contests, 1)

  const update = await request(api, `/reports/${created.id}`, {
    method: 'PUT',
    cookie: author.cookie,
    body: { location: 'Rua atualizada', waterLevel: 'alto' }
  })
  assert.equal((await update.json()).report.location, 'Rua atualizada')
  const moveOutside = await request(api, `/reports/${created.id}`, {
    method: 'PUT',
    cookie: author.cookie,
    body: { latitude: 8, longitude: 8 }
  })
  assert.equal(moveOutside.status, 403)

  api.db.prepare('UPDATE reports SET last_confirmed_at = ? WHERE id = ?')
    .run(Date.now() - 3 * 60 * 60 * 1000 - 1, created.id)
  const closedFilter = await request(api, '/reports?status=encerrado')
  const closed = (await closedFilter.json()).reports
  assert.equal(closed.length, 1)
  assert.equal(closed[0].id, created.id)
  assert.equal(closed[0].status, 'encerrado')

  const closedVote = await request(api, `/reports/${created.id}/votes`, {
    method: 'POST',
    cookie: voterC.cookie,
    body: { type: 'confirm' }
  })
  assert.equal(closedVote.status, 409)

  const forbiddenDelete = await request(api, `/reports/${created.id}`, {
    method: 'DELETE',
    cookie: voterA.cookie
  })
  assert.equal(forbiddenDelete.status, 403)

  const deleted = await request(api, `/reports/${created.id}`, {
    method: 'DELETE',
    cookie: author.cookie
  })
  assert.equal(deleted.status, 204)
  assert.equal((await request(api, `/reports/${created.id}`)).status, 404)
})

test('enforces the official-area boundary and five-report hourly limit', async t => {
  const api = await startApi()
  t.after(() => api.close())
  const resident = await register(api, 'limit@example.com')

  const outside = await request(api, '/reports', {
    method: 'POST',
    cookie: resident.cookie,
    body: { ...reportInput, latitude: 8, longitude: 8 }
  })
  assert.equal(outside.status, 403)
  const invalidFilter = await request(api, '/reports?status=unknown')
  assert.equal(invalidFilter.status, 400)

  for (let index = 0; index < 5; index += 1) {
    const response = await request(api, '/reports', {
      method: 'POST',
      cookie: resident.cookie,
      body: { ...reportInput, location: `Rua ${index}` }
    })
    assert.equal(response.status, 201)
  }
  const firstReportId = (await (await request(api, '/reports')).json()).reports[0].id
  const deleted = await request(api, `/reports/${firstReportId}`, {
    method: 'DELETE',
    cookie: resident.cookie
  })
  assert.equal(deleted.status, 204)
  const sixth = await request(api, '/reports', {
    method: 'POST',
    cookie: resident.cookie,
    body: reportInput
  })
  assert.equal(sixth.status, 429)
  assert.equal((await sixth.json()).error.code, 'HOURLY_REPORT_LIMIT')
})

test('persists data and session records when the database is reopened', async () => {
  const { mkdtempSync, rmSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const folder = mkdtempSync(join(tmpdir(), 'alertaja-api-'))
  const databasePath = join(folder, 'data.sqlite')
  const db = createDatabase(databasePath)
  const app = createApp({
    db,
    sessionSecret: 'test-session-secret-with-more-than-32-characters',
    frontendUrl: origin,
    pilotArea: polygon,
    production: false
  })

  const server = createServer(app)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const api = { baseUrl: `http://127.0.0.1:${address.port}/api` }
  const resident = await register(api, 'persist@example.com')
  const created = await request(api, '/reports', {
    method: 'POST',
    cookie: resident.cookie,
    body: reportInput
  })
  assert.equal(created.status, 201)

  clearInterval(app.locals.expirationTimer)
  await new Promise(resolve => server.close(resolve))
  db.close()

  const reopened = createDatabase(databasePath)
  try {
    assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM users').get().count, 1)
    assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM reports').get().count, 1)
    assert.notEqual(
      reopened.prepare('SELECT password_hash FROM users').get().password_hash,
      'secure-password-123'
    )
    assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM sessions').get().count, 1)
  } finally {
    reopened.close()
    rmSync(folder, { recursive: true, force: true })
  }
})

test('uses the official Itaquaquecetuba boundary to center, validate, and filter reports', async t => {
  const area = loadOfficialPilotArea()
  const center = getPilotAreaCenter(area)
  const api = await startApi(area)
  t.after(() => api.close())

  const regionResponse = await request(api, '/region')
  const region = await regionResponse.json()
  assert.equal(region.ibgeCode, '3523107')
  assert.equal(region.name, 'Itaquaquecetuba')
  assert.deepEqual(region.center, center)
  assert.equal(region.boundary.properties.codarea, '3523107')
  assert.equal(region.boundarySource.includes('qualidade máxima'), true)
  assert.equal(area.geometry.coordinates[0].length, 181)

  const resident = await register(api, 'itaqua-resident@example.com')
  const inside = await request(api, '/reports', {
    method: 'POST',
    cookie: resident.cookie,
    body: {
      location: 'Local dentro do centroide oficial',
      latitude: center[0],
      longitude: center[1],
      waterLevel: 'baixo'
    }
  })
  assert.equal(inside.status, 201)
  const insideReport = (await inside.json()).report

  const outside = await request(api, '/reports', {
    method: 'POST',
    cookie: resident.cookie,
    body: {
      location: 'Ponto fora do município',
      latitude: 0,
      longitude: 0,
      waterLevel: 'baixo'
    }
  })
  assert.equal(outside.status, 403)

  const externalId = api.db.prepare(`
    INSERT INTO reports (
      location, latitude, longitude, water_level, status,
      author_id, created_at, last_confirmed_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Relato histórico fora da região',
    0,
    0,
    'baixo',
    'não confirmado',
    resident.user.id,
    Date.now(),
    Date.now(),
    Date.now()
  ).lastInsertRowid

  const list = await request(api, '/reports')
  const reports = (await list.json()).reports
  assert.deepEqual(reports.map(report => report.id), [insideReport.id])
  assert.equal((await request(api, `/reports/${externalId}`)).status, 404)

  const locations = await request(api, '/support-locations')
  assert.deepEqual((await locations.json()).locations, [])
})

test('supports automatic frontend ports in development and requires an explicit production session secret', async () => {
  const { mkdtempSync, rmSync, readFileSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const folder = mkdtempSync(join(tmpdir(), 'alertaja-config-'))
  const databasePath = join(folder, 'data.sqlite')
  try {
    const config = loadConfig({
      DATABASE_PATH: databasePath,
      NODE_ENV: 'development'
    })
    assert.equal(config.port, 3000)
    assert.equal(config.sessionSecret.length, 96)
    assert.equal(loadConfig({
      DATABASE_PATH: databasePath,
      NODE_ENV: 'development'
    }).sessionSecret, config.sessionSecret)
    assert.equal(readFileSync(join(folder, 'session-secret'), 'utf8'), config.sessionSecret)
    assert.throws(() => loadConfig({
      DATABASE_PATH: databasePath,
      NODE_ENV: 'production'
    }), /SESSION_SECRET/)
  } finally {
    rmSync(folder, { recursive: true, force: true })
  }
})
