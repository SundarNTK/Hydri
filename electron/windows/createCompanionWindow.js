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

  if (rendererUrl) {
    win.loadURL(`${rendererUrl}#/companion`)
  } else {
    win.loadFile(rendererFile, { hash: '/companion' })
  }

  return win
}
