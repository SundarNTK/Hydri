import GlassCard from '../common/GlassCard.jsx'

export default function StatCard({ icon, title, value, subtitle }) {
  return (
    <GlassCard className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm text-hydri-ink/70 dark:text-white/60">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold text-hydri-ink dark:text-white">{value}</div>
      {subtitle && <div className="text-xs text-hydri-ink/50 dark:text-white/40">{subtitle}</div>}
    </GlassCard>
  )
}
