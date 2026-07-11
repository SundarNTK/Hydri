const GLASS_ML = 250

export function createWaterIntakeRepository(db) {
  const insertStmt = db.prepare('INSERT INTO water_intake (amount_ml) VALUES (?)')

  const todayStmt = db.prepare(`
    SELECT COALESCE(SUM(amount_ml), 0) AS total, COUNT(*) AS count
    FROM water_intake
    WHERE date(logged_at, 'localtime') = date('now', 'localtime')
  `)

  const weeklyStmt = db.prepare(`
    SELECT date(logged_at, 'localtime') AS day, SUM(amount_ml) AS total
    FROM water_intake
    WHERE date(logged_at, 'localtime') >= date('now', 'localtime', '-6 days')
    GROUP BY day
    ORDER BY day ASC
  `)

  const lifetimeCountStmt = db.prepare('SELECT COUNT(*) AS count FROM water_intake')

  return {
    glassMl: GLASS_ML,
    logIntake(amountMl = GLASS_ML) {
      return insertStmt.run(amountMl)
    },
    getTodayTotal() {
      return todayStmt.get()
    },
    getWeeklyTotals() {
      return weeklyStmt.all()
    },
    getLifetimeCount() {
      return lifetimeCountStmt.get().count
    }
  }
}
