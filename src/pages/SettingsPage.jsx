import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings.js'
import SettingsForm from '../components/settings/SettingsForm.jsx'
import ThemeToggle from '../components/common/ThemeToggle.jsx'
import GlassCard from '../components/common/GlassCard.jsx'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-6 dark:from-slate-900 dark:to-slate-950">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hydri-ink dark:text-white">Settings</h1>
          <p className="text-sm text-hydri-ink/60 dark:text-white/50">Tune Hydri to fit your day</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/character-lab"
            className="rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
          >
            🎭 Character
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
          >
            ← Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <GlassCard className="max-w-2xl">
        {settings ? (
          <SettingsForm settings={settings} onUpdate={updateSettings} />
        ) : (
          <p className="text-hydri-ink/60 dark:text-white/60">Loading settings…</p>
        )}
      </GlassCard>
    </div>
  )
}
