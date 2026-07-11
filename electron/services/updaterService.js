import { autoUpdater } from 'electron-updater'
import { app } from 'electron'

export function createUpdaterService({ settingsStore, getMainWindow }) {
  autoUpdater.autoDownload = false

  autoUpdater.on('update-available', () => {
    autoUpdater.downloadUpdate()
  })

  autoUpdater.on('update-downloaded', () => {
    const win = getMainWindow()
    win?.webContents.send('updater:ready-to-install')
  })

  autoUpdater.on('error', (error) => {
    console.warn('[updater] error:', error?.message ?? error)
  })

  function checkForUpdates() {
    // No-ops safely in dev, or when the GitHub publish config is still a placeholder.
    if (!app.isPackaged) {
      console.log('[updater] Skipped update check in development.')
      return
    }
    if (!settingsStore.get('autoUpdateEnabled')) return

    autoUpdater.checkForUpdates().catch((error) => {
      console.warn('[updater] check failed:', error?.message ?? error)
    })
  }

  function quitAndInstall() {
    app.isQuitting = true
    autoUpdater.quitAndInstall()
  }

  return { checkForUpdates, quitAndInstall }
}
