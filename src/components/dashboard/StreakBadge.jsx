import GlassCard from '../common/GlassCard.jsx'

export default function StreakBadge({ current, longest }) {
  return (
    <GlassCard className="flex items-center justify-between">
      <div>
        <div className="text-sm text-hydri-ink/70 dark:text-white/60">Current Streak</div>
        <div className="text-2xl font-bold text-hydri-ink dark:text-white">
          🔥 {current} {current === 1 ? 'day' : 'days'}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-hydri-ink/70 dark:text-white/60">Longest Streak</div>
        <div className="text-lg font-semibold text-hydri-ink dark:text-white">
          {longest} {longest === 1 ? 'day' : 'days'}
        </div>
      </div>
    </GlassCard>
  )
}
