import { ipcMain, app } from 'electron'

export function registerIpcHandlers({ waterService, settingsStore, scheduler, updaterService, getCompanionWindow }) {
  ipcMain.handle('water:getStats', () => waterService.getStats())
  ipcMain.handle('water:logGlass', () => waterService.drinkNow())

  ipcMain.handle('settings:get', () => settingsStore.store)

  ipcMain.handle('settings:update', (_event, partial) => {
    for (const [key, value] of Object.entries(partial)) {
      settingsStore.set(key, value)
    }
    if ('runAtStartup' in partial) {
      app.setLoginItemSettings({ openAtLogin: !!partial.runAtStartup })
    }
    return settingsStore.store
  })

  ipcMain.handle('reminders:respondDrink', () => scheduler.respondDrink())
  ipcMain.handle('reminders:respondSnooze', (_event, minutes) => scheduler.respondSnooze(minutes))

  ipcMain.handle('reminders:pause', () => {
    scheduler.pause()
    settingsStore.set('remindersPaused', true)
  })

  ipcMain.handle('reminders:resume', () => {
    scheduler.resume()
    settingsStore.set('remindersPaused', false)
  })

  ipcMain.handle('updater:checkNow', () => updaterService.checkForUpdates())
  ipcMain.handle('updater:quitAndInstall', () => updaterService.quitAndInstall())

  ipcMain.handle('companion:hide', () => {
    getCompanionWindow()?.hide()
  })
}
