import session from 'express-session'

export class SqliteSessionStore extends session.Store {
  constructor(db) {
    super()
    this.db = db
    this.getStatement = db.prepare(
      'SELECT data, expires_at FROM sessions WHERE sid = ?'
    )
    this.setStatement = db.prepare(`
      INSERT INTO sessions (sid, expires_at, data)
      VALUES (?, ?, ?)
      ON CONFLICT(sid) DO UPDATE SET
        expires_at = excluded.expires_at,
        data = excluded.data
    `)
  }

  get(sid, callback) {
    try {
      const row = this.getStatement.get(sid)
      if (!row) return callback(null, null)
      if (row.expires_at <= Date.now()) {
        this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid)
        return callback(null, null)
      }
      callback(null, JSON.parse(row.data))
    } catch (error) {
      callback(error)
    }
  }

  set(sid, sessionData, callback = () => {}) {
    try {
      const expiresAt = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() + 24 * 60 * 60 * 1000
      this.setStatement.run(sid, expiresAt, JSON.stringify(sessionData))
      callback(null)
    } catch (error) {
      callback(error)
    }
  }

  destroy(sid, callback = () => {}) {
    try {
      this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid)
      callback(null)
    } catch (error) {
      callback(error)
    }
  }

  touch(sid, sessionData, callback = () => {}) {
    try {
      const expiresAt = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() + 24 * 60 * 60 * 1000
      this.db.prepare(
        'UPDATE sessions SET expires_at = ? WHERE sid = ?'
      ).run(expiresAt, sid)
      callback(null)
    } catch (error) {
      callback(error)
    }
  }
}
