import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

export function createDatabase(databasePath) {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true })
  }

  const db = new Database(databasePath)
  db.pragma('foreign_keys = ON')
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      water_level TEXT NOT NULL CHECK (water_level IN ('baixo', 'medio', 'alto')),
      status TEXT NOT NULL DEFAULT 'não confirmado'
        CHECK (status IN ('não confirmado', 'confirmado', 'encerrado')),
      author_id INTEGER NOT NULL REFERENCES users(id),
      created_at INTEGER NOT NULL,
      last_confirmed_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('confirm', 'contest')),
      created_at INTEGER NOT NULL,
      UNIQUE (report_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS report_creation_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS support_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK (type IN ('shelter', 'support_point')),
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      description TEXT,
      latitude REAL NOT NULL CHECK (latitude BETWEEN -90 AND 90),
      longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
      source TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);
    CREATE INDEX IF NOT EXISTS reports_author_created_idx ON reports(author_id, created_at);
    CREATE INDEX IF NOT EXISTS votes_report_type_idx ON votes(report_id, type);
    CREATE INDEX IF NOT EXISTS report_creation_log_user_time_idx
      ON report_creation_log(user_id, created_at);

    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
  `)

  return db
}
