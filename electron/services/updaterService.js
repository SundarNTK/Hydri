import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow } from 'electron'

/**
 * Tracks update status as explicit state (rather than only firing one-off
 * events) so a renderer that mounts *after* a check already completed --
 * e.g. the download finished before the Dashboard page loaded -- can still
 * ask "what's the current status?" via getStatus() instead of permanently
 * missing the signal.
 */
export function createUpdaterService({ settingsStore, getMainWindow }) {
  autoUpdater.autoDownload = false

  let status = { state: 'idle' }

  function setStatus(next) {
    status = next
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send('updater:status', status)
    }
  }

  autoUpdater.on('checking-for-update', () => {
    setStatus({ state: 'checking' })
  })

  autoUpdater.on('update-available', (info) => {
    setStatus({ state: 'downloading', version: info?.version })
    autoUpdater.downloadUpdate()
  })

  autoUpdater.on('update-not-available', (info) => {
    setStatus({ state: 'not-available', version: info?.version })
  })

  autoUpdater.on('update-downloaded', (info) => {
    setStatus({ state: 'ready', version: info?.version })
  })

  autoUpdater.on('error', (error) => {
    console.warn('[updater] error:', error?.message ?? error)
    setStatus({ state: 'error', message: error?.message ?? String(error) })
  })

  function checkForUpdates() {
    if (!app.isPackaged) {
      setStatus({ state: 'error', message: 'Updates only run in the installed app, not in development.' })
      return
    }
    if (!settingsStore.get('autoUpdateEnabled')) {
      setStatus({ state: 'error', message: 'Automatic updates are turned off in Settings.' })
      return
    }

    autoUpdater.checkForUpdates().catch((error) => {
      console.warn('[updater] check failed:', error?.message ?? error)
      setStatus({ state: 'error', message: error?.message ?? String(error) })
    })
  }

  function quitAndInstall() {
    app.isQuitting = true
    autoUpdater.quitAndInstall()
  }

  function getStatus() {
    return status
  }

  return { checkForUpdates, quitAndInstall, getStatus }
}
