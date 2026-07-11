import { createWaterIntakeRepository } from '../db/repositories/waterIntakeRepository.js'
import { createReminderHistoryRepository } from '../db/repositories/reminderHistoryRepository.js'
import { createStreakRepository } from '../db/repositories/streakRepository.js'
import { createAchievementRepository } from '../db/repositories/achievementRepository.js'

const ACHIEVEMENTS = [
  {
    key: 'first_sip',
    label: 'First Sip',
    description: 'Logged your first glass of water',
    check: (ctx) => ctx.lifetimeCount >= 1
  },
  {
    key: 'week_streak',
    label: '7-Day Streak',
    description: 'Hit your daily goal 7 days in a row',
    check: (ctx) => ctx.currentStreak >= 7
  },
  {
    key: 'century_club',
    label: 'Century Club',
    description: 'Logged 100 glasses of water',
    check: (ctx) => ctx.lifetimeCount >= 100
  }
]

export function createWaterService(db, settingsStore) {
  const waterIntake = createWaterIntakeRepository(db)
  const reminderHistory = createReminderHistoryRepository(db)
  const streaks = createStreakRepository(db)
  const achievementRepo = createAchievementRepository(db)

  function evaluateAchievements(ctx) {
    const unlocked = achievementRepo.getUnlockedKeys()
    const newlyUnlocked = []
    for (const achievement of ACHIEVEMENTS) {
      if (unlocked.has(achievement.key)) continue
      if (achievement.check(ctx)) {
        achievementRepo.unlock(achievement.key)
        // Only push serializable fields — `achievement.check` is a function and
        // can't cross the IPC structured-clone boundary to the renderer.
        newlyUnlocked.push({ key: achievement.key, label: achievement.label, description: achievement.description })
      }
    }
    return newlyUnlocked
  }

  function refreshStreak() {
    const dailyGoalMl = settingsStore.get('dailyGoalMl')
    const today = waterIntake.getTodayTotal()
    streaks.setTodayMetGoal(today.total >= dailyGoalMl)
    return streaks.getCurrentAndLongest()
  }

  function getStats() {
    const dailyGoalMl = settingsStore.get('dailyGoalMl')
    const today = waterIntake.getTodayTotal()
    const weekly = waterIntake.getWeeklyTotals()
    const streak = streaks.getCurrentAndLongest()
    const successRate = reminderHistory.getTodaySuccessRate()
    const unlockedKeys = achievementRepo.getUnlockedKeys()

    return {
      dailyGoalMl,
      todayTotalMl: today.total,
      todayGlassCount: today.count,
      weekly,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      reminderSuccessRate: successRate.rate,
      achievements: ACHIEVEMENTS.map((achievement) => ({
        key: achievement.key,
        label: achievement.label,
        description: achievement.description,
        unlocked: unlockedKeys.has(achievement.key)
      }))
    }
  }

  function drinkNow(reminderId) {
    waterIntake.logIntake()
    if (reminderId != null) reminderHistory.respond(reminderId, 'drank')

    const streak = refreshStreak()
    const lifetimeCount = waterIntake.getLifetimeCount()
    const newlyUnlocked = evaluateAchievements({ lifetimeCount, currentStreak: streak.current })

    return { stats: getStats(), newlyUnlocked }
  }

  function snooze(reminderId) {
    if (reminderId != null) reminderHistory.respond(reminderId, 'snoozed')
  }

  function createPendingReminder(reminderType = 'water') {
    return reminderHistory.createPending(reminderType)
  }

  return { drinkNow, snooze, createPendingReminder, getStats }
}
