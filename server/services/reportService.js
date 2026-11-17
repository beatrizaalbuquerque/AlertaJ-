import { ApiError } from '../middlewares/errors.js'
import { assertInsidePilotArea, isInsidePilotArea } from './geoService.js'

const HOUR_MS = 60 * 60 * 1000
const THREE_HOURS_MS = 3 * HOUR_MS

function reportFromRow(db, row) {
  const counts = db.prepare(`
    SELECT
      SUM(CASE WHEN type = 'confirm' THEN 1 ELSE 0 END) AS confirmations,
      SUM(CASE WHEN type = 'contest' THEN 1 ELSE 0 END) AS contests
    FROM votes WHERE report_id = ?
  `).get(row.id)

  return {
    id: row.id,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    waterLevel: row.water_level,
    status: row.status,
    authorId: row.author_id,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    lastConfirmedAt: new Date(row.last_confirmed_at).toISOString(),
    confirmations: counts.confirmations || 0,
    contests: counts.contests || 0
  }
}

export function createReportService(db, pilotArea) {
  const closeStaleReports = db.prepare(`
    UPDATE reports
    SET status = 'encerrado', updated_at = ?
    WHERE status != 'encerrado' AND last_confirmed_at <= ?
  `)
  const getReport = db.prepare('SELECT * FROM reports WHERE id = ?')

  function expireReports(now = Date.now()) {
    closeStaleReports.run(now, now - THREE_HOURS_MS)
  }

  function getById(id) {
    const row = getReport.get(id)
    if (!row || !isInsidePilotArea(pilotArea, row.latitude, row.longitude)) {
      throw new ApiError(404, 'REPORT_NOT_FOUND', 'Relato não encontrado.')
    }
    return reportFromRow(db, row)
  }

  return {
    expireReports,

    list(status) {
      expireReports()
      const rows = status
        ? db.prepare('SELECT * FROM reports WHERE status = ? ORDER BY created_at DESC').all(status)
        : db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all()
      return rows
        .filter(row => isInsidePilotArea(pilotArea, row.latitude, row.longitude))
        .map(row => reportFromRow(db, row))
    },

    get(id) {
      expireReports()
      return getById(id)
    },

    create(userId, input) {
      assertInsidePilotArea(pilotArea, input.latitude, input.longitude)
      const now = Date.now()
      const createTransaction = db.transaction(() => {
        const recentCount = db.prepare(`
          SELECT COUNT(*) AS count FROM report_creation_log
          WHERE user_id = ? AND created_at > ?
        `).get(userId, now - HOUR_MS).count

        if (recentCount >= 5) {
          throw new ApiError(429, 'HOURLY_REPORT_LIMIT', 'Você já registrou 5 ocorrências na última hora.')
        }

        const result = db.prepare(`
          INSERT INTO reports (
            location, latitude, longitude, water_level, status,
            author_id, created_at, last_confirmed_at, updated_at
          ) VALUES (?, ?, ?, ?, 'não confirmado', ?, ?, ?, ?)
        `).run(
          input.location, input.latitude, input.longitude, input.waterLevel,
          userId, now, now, now
        )
        db.prepare(`
          INSERT INTO report_creation_log (user_id, created_at) VALUES (?, ?)
        `).run(userId, now)
        return Number(result.lastInsertRowid)
      })
      return getById(createTransaction())
    },

    update(id, userId, input) {
      const report = getById(id)
      if (report.authorId !== userId) {
        throw new ApiError(403, 'REPORT_FORBIDDEN', 'Somente o autor pode editar este relato.')
      }
      assertInsidePilotArea(
        pilotArea,
        input.latitude ?? report.latitude,
        input.longitude ?? report.longitude
      )
      const columns = {
        location: 'location',
        latitude: 'latitude',
        longitude: 'longitude',
        waterLevel: 'water_level'
      }
      const entries = Object.entries(input)
      if (!entries.length) {
        throw new ApiError(400, 'EMPTY_UPDATE', 'Informe ao menos um campo para atualizar.')
      }
      const assignments = entries.map(([key]) => `${columns[key]} = ?`).join(', ')
      const values = entries.map(([, value]) => value)
      db.prepare(`UPDATE reports SET ${assignments}, updated_at = ? WHERE id = ?`)
        .run(...values, Date.now(), id)
      return getById(id)
    },

    remove(id, userId) {
      const report = getById(id)
      if (report.authorId !== userId) {
        throw new ApiError(403, 'REPORT_FORBIDDEN', 'Somente o autor pode excluir este relato.')
      }
      db.prepare('DELETE FROM reports WHERE id = ?').run(id)
    },

    vote(id, userId, type) {
      expireReports()
      const report = getById(id)
      if (report.authorId === userId) {
        throw new ApiError(403, 'SELF_VOTE', 'Você não pode votar no próprio relato.')
      }
      if (report.status === 'encerrado') {
        throw new ApiError(409, 'REPORT_CLOSED', 'Não é possível votar em um relato encerrado.')
      }
      const now = Date.now()
      const voteTransaction = db.transaction(() => {
        db.prepare(`
          INSERT INTO votes (report_id, user_id, type, created_at)
          VALUES (?, ?, ?, ?)
        `).run(id, userId, type, now)

        if (type === 'confirm') {
          db.prepare(`
            UPDATE reports
            SET last_confirmed_at = ?, updated_at = ?
            WHERE id = ?
          `).run(now, now, id)
          const confirmations = db.prepare(`
            SELECT COUNT(*) AS count FROM votes
            WHERE report_id = ? AND type = 'confirm' AND user_id != ?
          `).get(id, report.authorId).count
          if (confirmations >= 2) {
            db.prepare(`
              UPDATE reports SET status = 'confirmado', updated_at = ? WHERE id = ?
            `).run(now, id)
          }
        }
      })

      try {
        voteTransaction()
      } catch (error) {
        if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          throw new ApiError(409, 'ALREADY_VOTED', 'Você já votou nesta ocorrência.')
        }
        throw error
      }
      return getById(id)
    }
  }
}
