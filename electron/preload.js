import { contextBridge, ipcRenderer } from 'electron'

function subscribe(channel, callback) {
  const listener = (_event, payload) => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

contextBridge.exposeInMainWorld('hydri', {
  water: {
    getStats: () => ipcRenderer.invoke('water:getStats'),
    logGlass: () => ipcRenderer.invoke('water:logGlass')
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (partial) => ipcRenderer.invoke('settings:update', partial)
  },
  reminders: {
    respondDrink: () => ipcRenderer.invoke('reminders:respondDrink'),
    respondSnooze: (minutes) => ipcRenderer.invoke('reminders:respondSnooze', minutes),
    pause: () => ipcRenderer.invoke('reminders:pause'),
    resume: () => ipcRenderer.invoke('reminders:resume'),
    onTrigger: (callback) => subscribe('reminder:trigger', callback),
    onStatsUpdated: (callback) => subscribe('reminder:stats-updated', callback)
  },
  updater: {
    checkNow: () => ipcRenderer.invoke('updater:checkNow'),
    quitAndInstall: () => ipcRenderer.invoke('updater:quitAndInstall'),
    onReadyToInstall: (callback) => subscribe('updater:ready-to-install', callback)
  },
  companion: {
    hide: () => ipcRenderer.invoke('companion:hide')
  },
  navigation: {
    onNavigate: (callback) => subscribe('navigate', callback)
  }
})
