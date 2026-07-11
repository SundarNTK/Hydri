import { useTheme } from '../../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
    >
      {isDark ? '🌙' : '☀️'} {isDark ? 'Dark' : 'Light'}
    </button>
  )
}
