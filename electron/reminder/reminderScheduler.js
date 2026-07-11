// Each entry is a function of the user's name (may be '') rather than a
// plain string, so every line can optionally address them by name without
// producing awkward doubled punctuation when no name has been set yet.
const DIALOGUE = {
  greeting: (name) => [
    `Hi${name ? ' ' + name : ''}! 😊 It's time to drink some water. Can you drink one glass now?`,
    `Hey${name ? ' ' + name : ' there'}! Time for a water break — one glass now?`,
    `Psst${name ? ', ' + name : ''}! Your body could use some water right now.`
  ],
  happy: (name) => [
    'Yay! Thank you!',
    `I'm proud of you${name ? ', ' + name : ''}.`,
    'Your body will thank you.',
    `Keep staying hydrated${name ? ', ' + name : ''}!`
  ],
  annoyed: (name) => [
    `Again${name ? ', ' + name : ''}? 😒`,
    'Five minutes only!',
    `Don't make me remind you twice${name ? ', ' + name : ''}.`,
    "I'm counting on you!"
  ]
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function createReminderScheduler({ settingsStore, waterService, notifier, getCompanionWindow, getMainWindow }) {
  let timer = null
  let paused = settingsStore.get('remindersPaused')
  let currentReminderId = null

  function intervalMs() {
    const interval = settingsStore.get('reminderInterval')
    const custom = settingsStore.get('customIntervalMinutes')
    const minutes = interval === 'custom' ? custom : interval
    return Math.max(1, Number(minutes) || 60) * 60 * 1000
  }

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = null
  }

  function scheduleNext(ms = intervalMs()) {
    clearTimer()
    if (paused) return
    timer = setTimeout(fire, ms)
  }

  function fire() {
    if (paused) return
    currentReminderId = waterService.createPendingReminder()
    const payload = {
      kind: 'water',
      reminderId: currentReminderId,
      dialogue: pickRandom(DIALOGUE.greeting(settingsStore.get('userName')))
    }

    const companionWindow = getCompanionWindow()
    if (companionWindow) {
      companionWindow.show()
      companionWindow.webContents.send('reminder:trigger', payload)
    }
    notifier.notifyReminder()
  }

  function triggerNow() {
    clearTimer()
    fire()
  }

  function respondDrink() {
    if (currentReminderId == null) return null
    const result = waterService.drinkNow(currentReminderId)
    currentReminderId = null

    const mainWindow = getMainWindow()
    if (mainWindow) mainWindow.webContents.send('reminder:stats-updated', result.stats)

    scheduleNext()
    return { ...result, dialogue: pickRandom(DIALOGUE.happy(settingsStore.get('userName'))) }
  }

  function respondSnooze(minutes = 5) {
    if (currentReminderId == null) return null
    waterService.snooze(currentReminderId)
    currentReminderId = null

    scheduleNext(minutes * 60 * 1000)
    return { dialogue: pickRandom(DIALOGUE.annoyed(settingsStore.get('userName'))) }
  }

  function pause() {
    paused = true
    clearTimer()
  }

  function resume() {
    paused = false
    scheduleNext()
  }

  function start() {
    if (!paused) scheduleNext()
  }

  return {
    start,
    pause,
    resume,
    triggerNow,
    respondDrink,
    respondSnooze,
    get paused() {
      return paused
    }
  }
}
