import { Tray, Menu, nativeImage } from 'electron'

export function createTray({
  iconPath,
  getPaused,
  onOpenDashboard,
  onDrinkNow,
  onPause,
  onResume,
  onOpenSettings,
  onCheckUpdates,
  onExit
}) {
  const image = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
  const tray = new Tray(image)
  tray.setToolTip('Hydri — Your Caring Health Companion')

  function buildMenu() {
    return Menu.buildFromTemplate([
      { label: 'Open Dashboard', click: onOpenDashboard },
      { label: 'Drink Water Now', click: onDrinkNow },
      { type: 'separator' },
      getPaused()
        ? { label: 'Resume Reminders', click: onResume }
        : { label: 'Pause Reminders', click: onPause },
      { label: 'Settings', click: onOpenSettings },
      { type: 'separator' },
      { label: 'Check for Updates', click: onCheckUpdates },
      { type: 'separator' },
      { label: 'Exit', click: onExit }
    ])
  }

  tray.setContextMenu(buildMenu())
  tray.on('click', onOpenDashboard)

  return {
    tray,
    refreshMenu: () => tray.setContextMenu(buildMenu())
  }
}
