export default function GlassCard({ className = '', children }) {
  return (
    <div
      className={`rounded-2xl border border-white/30 bg-white/60 p-5 shadow-glass backdrop-blur-glass dark:border-white/10 dark:bg-slate-800/50 ${className}`}
    >
      {children}
    </div>
  )
}
