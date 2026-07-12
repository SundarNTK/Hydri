import { BrowserWindow, screen } from 'electron'

const WINDOW_WIDTH = 900
const WINDOW_HEIGHT = 320

export function createCompanionWindow({ preloadPath, rendererUrl, rendererFile }) {
  const { workArea } = screen.getPrimaryDisplay()

  const win = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: workArea.x,
    y: workArea.y + workArea.height - WINDOW_HEIGHT,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: preloadPath,
      sandbox: false
    }
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  win.setIgnoreMouseEvents(false)

  // The companion window loads its own independent copy of the renderer
  // bundle and starts hidden -- reminders can fire (manual "Trigger Now"
  // buttons especially) before that page has finished loading and its
  // useReminderState effect has subscribed to 'reminder:trigger'. Sending
  // to a webContents with no listener attached yet silently drops the
  // message (no error), so the OS notification fires but the overlay never
  // appears. Gate sends on did-finish-load and queue the latest payload
  // (only the latest -- a stale earlier greeting isn't worth replaying)
  // until the page is ready.
  let isReady = false
  let pendingTrigger = null

  win.webContents.once('did-finish-load', () => {
    isReady = true
    if (pendingTrigger) {
      win.webContents.send('reminder:trigger', pendingTrigger)
      pendingTrigger = null
    }
  })

  win.sendReminderTrigger = (payload) => {
    if (isReady) {
      win.webContents.send('reminder:trigger', payload)
    } else {
      pendingTrigger = payload
    }
  }

  if (rendererUrl) {
    win.loadURL(`${rendererUrl}#/companion`)
  } else {
    win.loadFile(rendererFile, { hash: '/companion' })
  }

  return win
}
