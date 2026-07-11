export function createAchievementRepository(db) {
  const insertStmt = db.prepare('INSERT OR IGNORE INTO achievements (key) VALUES (?)')
  const allStmt = db.prepare('SELECT key, unlocked_at FROM achievements')

  return {
    unlock(key) {
      insertStmt.run(key)
    },
    getUnlockedKeys() {
      return new Set(allStmt.all().map((row) => row.key))
    }
  }
}
