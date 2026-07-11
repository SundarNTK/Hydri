import GlassCard from '../common/GlassCard.jsx'

export default function AchievementGrid({ achievements }) {
  return (
    <GlassCard>
      <div className="mb-3 text-sm font-semibold text-hydri-ink/80 dark:text-white/70">Achievements</div>
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.key}
            title={achievement.description}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition ${
              achievement.unlocked
                ? 'border-hydri-leaf/40 bg-hydri-leaf/10 text-hydri-ink dark:text-white'
                : 'border-black/5 bg-black/5 text-hydri-ink/30 dark:border-white/5 dark:bg-white/5 dark:text-white/30'
            }`}
          >
            <span className="text-2xl">{achievement.unlocked ? '🏅' : '🔒'}</span>
            <span className="text-xs font-medium">{achievement.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
