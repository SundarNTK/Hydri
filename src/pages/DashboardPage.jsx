import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWaterStats } from '../hooks/useWaterStats.js'
import { useSettings } from '../hooks/useSettings.js'
import { api } from '../ipc/api.js'
import ThemeToggle from '../components/common/ThemeToggle.jsx'
import Logo from '../components/common/Logo.jsx'
import ProgressRing from '../components/dashboard/ProgressRing.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import StreakBadge from '../components/dashboard/StreakBadge.jsx'
import WeeklyChart from '../components/dashboard/WeeklyChart.jsx'
import AchievementGrid from '../components/dashboard/AchievementGrid.jsx'

export default function DashboardPage() {
  const { stats, refresh } = useWaterStats()
  const { settings } = useSettings()
  const [version, setVersion] = useState('')
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    api.app.getVersion().then(setVersion)
  }, [])

  useEffect(() => {
    return api.updater.onReadyToInstall(() => setUpdateReady(true))
  }, [])

  if (!stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-950">
        <p className="text-hydri-ink/60 dark:text-white/60">Loading your hydration stats…</p>
      </div>
    )
  }

  const successRatePct = Math.round((stats.reminderSuccessRate ?? 0) * 100)
  const unlockedCount = stats.achievements.filter((a) => a.unlocked).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-6 dark:from-slate-900 dark:to-slate-950">
      {updateReady && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-hydri-blue/30 bg-hydri-blue/10 px-4 py-3 text-sm">
          <span className="font-medium text-hydri-ink dark:text-white">
            🎉 A new version of Hydri has been downloaded and is ready to install.
          </span>
          <button
            onClick={() => api.updater.quitAndInstall()}
            className="rounded-full bg-hydri-blue px-3 py-1.5 text-sm font-semibold text-white shadow-glass transition hover:bg-hydri-blue-dark active:scale-95"
          >
            Restart & Update
          </button>
        </div>
      )}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div>
            <h1 className="text-2xl font-bold text-hydri-ink dark:text-white">
              {settings?.userName ? `Hi ${settings.userName} 👋` : 'Hydri Dashboard'}
            </h1>
            <p className="text-sm text-hydri-ink/60 dark:text-white/50">Your Caring Health Companion</p>
          </div>
          {version && (
            <span className="rounded-full border border-white/30 bg-white/50 px-2 py-0.5 text-xs font-medium text-hydri-ink/50 dark:border-white/10 dark:bg-slate-800/40 dark:text-white/40">
              v{version}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/character-lab"
            className="rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
          >
            🎭 Character
          </Link>
          <Link
            to="/settings"
            className="rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
          >
            ⚙️ Settings
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/60 p-6 shadow-glass backdrop-blur-glass dark:border-white/10 dark:bg-slate-800/50 lg:col-span-1">
          <ProgressRing
            value={stats.todayTotalMl}
            max={stats.dailyGoalMl}
            label={`${stats.todayTotalMl} ml`}
            sublabel={`of ${stats.dailyGoalMl} ml goal`}
          />
          <button
            onClick={async () => {
              await api.water.logGlass()
              refresh()
            }}
            className="rounded-full bg-hydri-blue px-4 py-2 text-sm font-semibold text-white shadow-glass transition hover:bg-hydri-blue-dark active:scale-95"
          >
            💧 Log a Glass
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatCard icon="🥤" title="Glasses Today" value={stats.todayGlassCount} />
          <StatCard icon="🎯" title="Reminder Success" value={`${successRatePct}%`} subtitle="today" />
          <StreakBadge current={stats.currentStreak} longest={stats.longestStreak} />
          <StatCard icon="🏆" title="Achievements" value={`${unlockedCount}/${stats.achievements.length}`} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeeklyChart weekly={stats.weekly} />
        <AchievementGrid achievements={stats.achievements} />
      </div>
    </div>
  )
}
