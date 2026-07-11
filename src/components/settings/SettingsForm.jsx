const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120]

const selectClass =
  'w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm text-hydri-ink shadow-sm focus:border-hydri-blue focus:outline-none dark:border-white/10 dark:bg-slate-900/60 dark:text-white'
const inputClass = selectClass

function Section({ title, children }) {
  return (
    <div className="border-b border-black/5 pb-5 last:border-b-0 last:pb-0 dark:border-white/5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-hydri-ink/60 dark:text-white/50">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
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
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full transition ${checked ? 'bg-hydri-blue' : 'bg-black/15 dark:bg-white/15'}`}
      >
        <span
          className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

export default function SettingsForm({ settings, onUpdate }) {
  const isCustomInterval = settings.reminderInterval === 'custom' || !INTERVAL_OPTIONS.includes(settings.reminderInterval)

  return (
    <div className="space-y-5">
      <Section title="Reminders">
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

      <Section title="Sound">
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
            className="w-full"
          />
        </Field>
      </Section>

      <Section title="Startup & Updates">
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
    </div>
  )
}
