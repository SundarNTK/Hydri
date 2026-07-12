import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120]

const selectClass =
  'w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm text-hydri-ink shadow-sm transition focus:border-hydri-blue focus:outline-none focus:ring-2 focus:ring-hydri-blue/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white'
const inputClass = selectClass

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

function Section({ title, icon, children }) {
  return (
    <motion.div
      variants={sectionVariants}
      className="border-b border-black/5 pb-5 last:border-b-0 last:pb-0 dark:border-white/5"
    >
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-hydri-ink/60 dark:text-white/50">
        <span className="text-base leading-none">{icon}</span> {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </motion.div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-hydri-ink/80 dark:text-white/70">{label}</span>
      {children}
    </label>
  )
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm font-medium text-hydri-ink/80 dark:text-white/70">{label}</span>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.92 }}
        animate={{ backgroundColor: checked ? '#3aa1d6' : 'rgba(120,120,130,0.25)' }}
        transition={{ duration: 0.2 }}
        className="flex h-6 w-11 items-center rounded-full px-0.5"
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          animate={{ x: checked ? 20 : 0 }}
          className="block h-5 w-5 rounded-full bg-white shadow"
        />
      </motion.button>
    </label>
  )
}

function NameField({ value, onUpdate }) {
  const [name, setName] = useState(value ?? '')
  const [saved, setSaved] = useState(false)

  const commit = () => {
    const trimmed = name.trim()
    if (trimmed === (value ?? '')) return
    onUpdate({ userName: trimmed })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <Field label="Your name">
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
          }}
          maxLength={40}
          placeholder="What should Hydri call you?"
          className={inputClass}
        />
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-lg text-hydri-leaf"
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="mt-1 block text-xs text-hydri-ink/50 dark:text-white/40">
        Used to personalize reminder messages, e.g. "Hi {name || 'there'}! Time for water."
      </span>
    </Field>
  )
}

export default function SettingsForm({ settings, onUpdate }) {
  const isCustomInterval = settings.reminderInterval === 'custom' || !INTERVAL_OPTIONS.includes(settings.reminderInterval)

  return (
    <motion.div className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
      <Section title="Profile" icon="👤">
        <NameField value={settings.userName} onUpdate={onUpdate} />
      </Section>

      <Section title="Reminders" icon="💧">
        <Field label="Reminder interval">
          <select
            value={isCustomInterval ? 'custom' : settings.reminderInterval}
            onChange={(event) => {
              const value = event.target.value
              onUpdate(value === 'custom' ? { reminderInterval: 'custom' } : { reminderInterval: Number(value) })
            }}
            className={selectClass}
          >
            {INTERVAL_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
            <option value="custom">Custom…</option>
          </select>
        </Field>

        {isCustomInterval && (
          <Field label="Custom interval (minutes)">
            <input
              type="number"
              min={1}
              value={settings.customIntervalMinutes}
              onChange={(event) => onUpdate({ customIntervalMinutes: Number(event.target.value) || 1 })}
              className={inputClass}
            />
          </Field>
        )}

        <Field label="Daily water goal (ml)">
          <input
            type="number"
            min={250}
            step={250}
            value={settings.dailyGoalMl}
            onChange={(event) => onUpdate({ dailyGoalMl: Number(event.target.value) || 250 })}
            className={inputClass}
          />
        </Field>

        <Field label="Reminder position">
          <select
            value={settings.reminderPosition}
            onChange={(event) => onUpdate({ reminderPosition: event.target.value })}
            className={selectClass}
          >
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </Field>

        <Field label="Character size">
          <select
            value={settings.characterSize}
            onChange={(event) => onUpdate({ characterSize: event.target.value })}
            className={selectClass}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </Field>
      </Section>

      <Section title="Sound" icon="🔊">
        <ToggleField
          label="Enable sound"
          checked={settings.soundEnabled}
          onChange={(checked) => onUpdate({ soundEnabled: checked })}
        />
        <Field label={`Voice volume (${Math.round(settings.voiceVolume * 100)}%)`}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.voiceVolume}
            onChange={(event) => onUpdate({ voiceVolume: Number(event.target.value) })}
            className="w-full accent-hydri-blue"
          />
        </Field>
      </Section>

      <Section title="Battery" icon="🔋">
        <ToggleField
          label="Remind me about charging (95% heads-up, then unplug at 100%)"
          checked={settings.batteryReminderEnabled}
          onChange={(checked) => onUpdate({ batteryReminderEnabled: checked })}
        />
      </Section>

      <Section title="Startup & Updates" icon="🚀">
        <ToggleField
          label="Run at Windows startup"
          checked={settings.runAtStartup}
          onChange={(checked) => onUpdate({ runAtStartup: checked })}
        />
        <ToggleField
          label="Start minimized to tray"
          checked={settings.startMinimized}
          onChange={(checked) => onUpdate({ startMinimized: checked })}
        />
        <ToggleField
          label="Enable automatic updates"
          checked={settings.autoUpdateEnabled}
          onChange={(checked) => onUpdate({ autoUpdateEnabled: checked })}
        />
      </Section>
    </motion.div>
  )
}
