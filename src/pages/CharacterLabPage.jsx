import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/companion/Mascot.jsx'
import { CHARACTERS } from '../components/companion/characters/index.js'
import { useSettings } from '../hooks/useSettings.js'
import { api } from '../ipc/api.js'
import ThemeToggle from '../components/common/ThemeToggle.jsx'
import GlassCard from '../components/common/GlassCard.jsx'

const POSES = [
  { id: 'idle', label: 'Idle' },
  { id: 'walking', label: 'Walking' },
  { id: 'happy', label: 'Happy (Drink Now)' },
  { id: 'annoyed', label: 'Annoyed (Snooze)' },
  { id: 'wave', label: 'Wave' },
  { id: 'thinking', label: 'Thinking' }
]

export default function CharacterLabPage() {
  const { settings, updateSettings } = useSettings()
  const [previewPose, setPreviewPose] = useState('idle')
  const [triggering, setTriggering] = useState(false)

  const characterId = settings?.characterId ?? 'girl'

  const handleTriggerReal = async () => {
    setTriggering(true)
    try {
      await api.reminders.triggerNow()
    } finally {
      setTimeout(() => setTriggering(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-6 dark:from-slate-900 dark:to-slate-950">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hydri-ink dark:text-white">Character Lab</h1>
          <p className="text-sm text-hydri-ink/60 dark:text-white/50">Preview animations and choose your companion</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass transition hover:bg-white/80 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
          >
            ← Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <GlassCard className="mb-4">
        <div className="mb-3 text-sm font-semibold text-hydri-ink/80 dark:text-white/70">Live Preview</div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex h-56 w-full items-end justify-center rounded-xl border border-black/5 bg-white/40 dark:border-white/5 dark:bg-black/10 sm:w-1/2">
            <Mascot characterId={characterId} pose={previewPose} size="large" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {POSES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreviewPose(p.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold shadow-glass transition active:scale-95 ${
                    previewPose === p.id
                      ? 'bg-hydri-blue text-white'
                      : 'border border-white/50 bg-white/70 text-hydri-ink dark:bg-slate-700/60 dark:text-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleTriggerReal}
              disabled={triggering}
              className="mt-2 rounded-full border border-hydri-leaf/40 bg-hydri-leaf/10 px-4 py-2 text-sm font-semibold text-hydri-ink shadow-glass transition hover:bg-hydri-leaf/20 active:scale-95 disabled:opacity-50 dark:text-white"
            >
              {triggering ? 'Watch the overlay window…' : '🔔 Trigger a Real Reminder'}
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-3 text-sm font-semibold text-hydri-ink/80 dark:text-white/70">Choose Your Companion</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CHARACTERS.map((character) => {
            const selected = character.id === characterId
            return (
              <button
                key={character.id}
                onClick={() => updateSettings({ characterId: character.id })}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
                  selected
                    ? 'border-hydri-blue bg-hydri-blue/10'
                    : 'border-black/5 bg-black/5 hover:bg-black/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex h-28 items-end justify-center">
                  <Mascot characterId={character.id} pose="idle" size="small" />
                </div>
                <span className="text-sm font-semibold text-hydri-ink dark:text-white">{character.label}</span>
                <span className="text-xs text-hydri-ink/60 dark:text-white/50">{character.description}</span>
                {selected && <span className="text-xs font-semibold text-hydri-blue">Selected</span>}
              </button>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
