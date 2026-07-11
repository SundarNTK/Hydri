const LABELS = {
  water: { primary: '💧 Drink Now', secondary: '⏰ Remind Me in 5 Minutes' },
  battery: { primary: '🔌 Got It!', secondary: '⏰ Remind Me in 10 Minutes' }
}

export default function ReminderCard({ kind = 'water', onPrimary, onSecondary }) {
  const labels = LABELS[kind] ?? LABELS.water

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={onPrimary}
        className="rounded-full bg-hydri-blue px-4 py-2 text-sm font-semibold text-white shadow-glass transition hover:bg-hydri-blue-dark active:scale-95"
      >
        {labels.primary}
      </button>
      <button
        onClick={onSecondary}
        className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-hydri-ink shadow-glass transition hover:bg-white/90 active:scale-95"
      >
        {labels.secondary}
      </button>
    </div>
  )
}
