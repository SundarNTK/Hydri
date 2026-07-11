export function createReminderHistoryRepository(db) {
  const insertStmt = db.prepare(`
    INSERT INTO reminder_history (reminder_type, scheduled_at) VALUES (?, datetime('now'))
  `)

  const respondStmt = db.prepare(`
    UPDATE reminder_history SET responded_at = datetime('now'), action = ? WHERE id = ?
  `)

  const todaySuccessStmt = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN action = 'drank' THEN 1 ELSE 0 END) AS drank
    FROM reminder_history
    WHERE date(scheduled_at, 'localtime') = date('now', 'localtime')
      AND responded_at IS NOT NULL
  `)

  return {
    createPending(reminderType = 'water') {
      const info = insertStmt.run(reminderType)
      return info.lastInsertRowid
    },
    respond(id, action) {
      respondStmt.run(action, id)
    },
    getTodaySuccessRate() {
      const row = todaySuccessStmt.get()
      if (!row.total) return { total: 0, drank: 0, rate: 0 }
      return { total: row.total, drank: row.drank, rate: row.drank / row.total }
    }
  }
}
