const DIALOGUE = {
  greeting: (name) => [
    `Hey${name ? ' ' + name : ''}! 🚶 You've been sitting a while — stand up and take a short walk?`,
    `Psst${name ? ', ' + name : ''}! Time to stretch your legs for a minute.`,
    'Quick movement break! Stand up and walk around a bit. 🧍'
  ],
  happy: (name) => [
    'Nice, moving is great for you!',
    `Way to go${name ? ', ' + name : ''} — your body thanks you!`,
    'That short walk counts. Keep it up!'
  ],
  annoyed: (name) => [
    `Alright, but don't sit too much longer${name ? ', ' + name : ''}! 😒`,
    "Okay, I'll check back on you soon.",
    "Don't forget to move — I'm watching!"
  ]
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * A "stand up and walk" nudge, shown through the same companion overlay as
 * water/battery reminders (kind: 'standup'). No SQLite logging -- unlike
 * water intake, a movement break isn't tracked toward streaks/achievements,
 * so this is a pure interval timer gated by its own settings.
 */
export function createStandUpReminder({ settingsStore, notifier, getCompanionWindow }) {
  let timer = null

  function intervalMs() {
    const minutes = settingsStore.get('standUpIntervalMinutes')
    return Math.max(1, Number(minutes) || 60) * 60 * 1000
  }

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = null
  }

  function scheduleNext(ms = intervalMs()) {
    clearTimer()
    if (!settingsStore.get('standUpReminderEnabled')) return
    timer = setTimeout(fire, ms)
  }

  function fire() {
    if (!settingsStore.get('standUpReminderEnabled')) return
    const companionWindow = getCompanionWindow()
    if (companionWindow) {
      companionWindow.show()
      companionWindow.sendReminderTrigger({
        kind: 'standup',
        dialogue: pickRandom(DIALOGUE.greeting(settingsStore.get('userName')))
      })
    }
    notifier.notifyStandUp()
    scheduleNext()
  }

  function triggerNow() {
    clearTimer()
    fire()
  }

  function respondDone() {
    scheduleNext()
    return { dialogue: pickRandom(DIALOGUE.happy(settingsStore.get('userName'))) }
  }

  function respondSnooze(minutes = 10) {
    scheduleNext(minutes * 60 * 1000)
    return { dialogue: pickRandom(DIALOGUE.annoyed(settingsStore.get('userName'))) }
  }

  function start() {
    scheduleNext()
  }

  function stop() {
    clearTimer()
  }

  return { start, stop, triggerNow, respondDone, respondSnooze }
}
