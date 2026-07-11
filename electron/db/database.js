import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'node:path'

const migrations = [
  {
    id: '001_init',
    sql: `
      CREATE TABLE IF NOT EXISTS water_intake (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount_ml INTEGER NOT NULL,
        logged_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS reminder_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reminder_type TEXT NOT NULL DEFAULT 'water',
        scheduled_at TEXT NOT NULL,
        responded_at TEXT,
        action TEXT CHECK(action IN ('drank','snoozed','missed'))
      );

      CREATE TABLE IF NOT EXISTS streaks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        met_goal INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        unlocked_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_water_intake_logged_at ON water_intake(logged_at);
      CREATE INDEX IF NOT EXISTS idx_reminder_history_scheduled_at ON reminder_history(scheduled_at);
    `
  }
]

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  const applied = new Set(db.prepare('SELECT id FROM schema_migrations').all().map((row) => row.id))
  const markApplied = db.prepare('INSERT INTO schema_migrations (id) VALUES (?)')

  const applyPending = db.transaction(() => {
    for (const migration of migrations) {
      if (applied.has(migration.id)) continue
      db.exec(migration.sql)
      markApplied.run(migration.id)
    }
  })

  applyPending()
}

let dbInstance = null

export function getDatabase() {
  if (dbInstance) return dbInstance

  const dbPath = join(app.getPath('userData'), 'hydri.db')
  dbInstance = new Database(dbPath)
  dbInstance.pragma('journal_mode = WAL')
  dbInstance.pragma('foreign_keys = ON')
  runMigrations(dbInstance)

  return dbInstance
}
