function bridge() {
  if (!window.hydri) {
    throw new Error('Hydri preload bridge is not available on window.hydri')
  }
  return window.hydri
}

export const api = {
  water: {
    getStats: () => bridge().water.getStats(),
    logGlass: () => bridge().water.logGlass()
  },
  settings: {
    get: () => bridge().settings.get(),
    update: (partial) => bridge().settings.update(partial),
    onUpdated: (callback) => bridge().settings.onUpdated(callback)
  },
  reminders: {
    triggerNow: () => bridge().reminders.triggerNow(),
    respondDrink: () => bridge().reminders.respondDrink(),
    respondSnooze: (minutes) => bridge().reminders.respondSnooze(minutes),
    pause: () => bridge().reminders.pause(),
    resume: () => bridge().reminders.resume(),
    onTrigger: (callback) => bridge().reminders.onTrigger(callback),
    onStatsUpdated: (callback) => bridge().reminders.onStatsUpdated(callback)
  },
  updater: {
    checkNow: () => bridge().updater.checkNow(),
    quitAndInstall: () => bridge().updater.quitAndInstall(),
    onReadyToInstall: (callback) => bridge().updater.onReadyToInstall(callback)
  },
  companion: {
    hide: () => bridge().companion.hide()
  },
  navigation: {
    onNavigate: (callback) => bridge().navigation.onNavigate(callback)
  }
}
