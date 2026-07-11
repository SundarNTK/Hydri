import { BrowserWindow, app } from 'electron'

export function createMainWindow({ iconPath, preloadPath, rendererUrl, rendererFile, startMinimized }) {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 980,
    minHeight: 640,
    show: !startMinimized,
    autoHideMenuBar: true,
    backgroundColor: '#0b1220',
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      sandbox: false
    }
  })

  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win.hide()
    }
  })

  if (rendererUrl) {
    win.loadURL(`${rendererUrl}#/dashboard`)
  } else {
    win.loadFile(rendererFile, { hash: '/dashboard' })
  }

  return win
}
