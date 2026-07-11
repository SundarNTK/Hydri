function toLocalDateStr(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Parsing 'YYYY-MM-DD' with `new Date(str)` treats it as UTC midnight, which can
// shift to the wrong local day in negative UTC-offset timezones. Parse components
// manually so the result is always local midnight.
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function createStreakRepository(db) {
  const upsertStmt = db.prepare(`
    INSERT INTO streaks (date, met_goal) VALUES (date('now', 'localtime'), ?)
    ON CONFLICT(date) DO UPDATE SET met_goal = excluded.met_goal
  `)

  const allStmt = db.prepare('SELECT date, met_goal FROM streaks ORDER BY date ASC')

  return {
    setTodayMetGoal(metGoal) {
      upsertStmt.run(metGoal ? 1 : 0)
    },
    getCurrentAndLongest() {
      const rows = allStmt.all()
      const metByDate = new Map(rows.map((row) => [row.date, !!row.met_goal]))

      let current = 0
      const cursor = new Date()
      while (metByDate.get(toLocalDateStr(cursor))) {
        current += 1
        cursor.setDate(cursor.getDate() - 1)
      }

      let longest = 0
      let running = 0
      let prevDate = null
      for (const row of rows) {
        if (!row.met_goal) {
          running = 0
          prevDate = row.date
          continue
        }
        if (prevDate) {
          const expected = parseLocalDate(prevDate)
          expected.setDate(expected.getDate() + 1)
          running = toLocalDateStr(expected) === row.date ? running + 1 : 1
        } else {
          running = 1
        }
        longest = Math.max(longest, running)
        prevDate = row.date
      }

      return { current, longest }
    }
  }
}
