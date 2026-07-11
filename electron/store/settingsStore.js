import Store from 'electron-store'

const schema = {
  userName: { type: 'string', default: '' },
  onboardingSeen: { type: 'boolean', default: false },
  reminderInterval: { type: 'number', default: 60 },
  customIntervalMinutes: { type: 'number', default: 60 },
  dailyGoalMl: { type: 'number', default: 2000 },
  theme: { type: 'string', enum: ['light', 'dark'], default: 'light' },
  soundEnabled: { type: 'boolean', default: true },
  voiceVolume: { type: 'number', default: 0.7 },
  runAtStartup: { type: 'boolean', default: false },
  startMinimized: { type: 'boolean', default: false },
  autoUpdateEnabled: { type: 'boolean', default: true },
  reminderPosition: { type: 'string', enum: ['bottom-left', 'bottom-right'], default: 'bottom-left' },
  characterSize: { type: 'string', enum: ['small', 'medium', 'large'], default: 'medium' },
  // Keep in sync with the `id`s in src/components/companion/characters/index.js
  characterId: { type: 'string', enum: ['girl', 'boy', 'waterdrop', 'leafbuddy'], default: 'girl' },
  remindersPaused: { type: 'boolean', default: false }
}

export function createSettingsStore() {
  return new Store({ name: 'hydri-settings', schema })
}
