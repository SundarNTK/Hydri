import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings.js'
import SettingsForm from '../components/settings/SettingsForm.jsx'
import ThemeToggle from '../components/common/ThemeToggle.jsx'
import GlassCard from '../components/common/GlassCard.jsx'

const navLinkClass =
  'rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 to-emerald-50 p-6 dark:from-slate-900 dark:to-slate-950">
      {/* ambient decorative blobs -- purely cosmetic, sit behind everything */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-hydri-blue/10 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-hydri-leaf/10 blur-3xl"
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.header
        className="relative mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-hydri-ink dark:text-white">Settings</h1>
          <p className="text-sm text-hydri-ink/60 dark:text-white/50">Tune Hydri to fit your day</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/character-lab" className={navLinkClass}>
            🎭 Character
          </Link>
          <Link to="/dashboard" className={navLinkClass}>
            ← Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </motion.header>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard className="max-w-2xl">
          {settings ? (
            <SettingsForm settings={settings} onUpdate={updateSettings} />
          ) : (
            <p className="text-hydri-ink/60 dark:text-white/60">Loading settings…</p>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}
