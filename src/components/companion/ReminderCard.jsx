export default function ReminderCard({ onDrinkNow, onSnooze }) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={onDrinkNow}
        className="rounded-full bg-hydri-blue px-4 py-2 text-sm font-semibold text-white shadow-glass transition hover:bg-hydri-blue-dark active:scale-95"
      >
        💧 Drink Now
      </button>
      <button
        onClick={onSnooze}
        className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-hydri-ink shadow-glass transition hover:bg-white/90 active:scale-95"
      >
        ⏰ Remind Me in 5 Minutes
      </button>
    </div>
  )
}
