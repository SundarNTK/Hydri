import { Notification } from 'electron'

export function createNotifier() {
  return {
    notifyReminder() {
      if (!Notification.isSupported()) return
      new Notification({
        title: 'Hydri',
        body: 'Time to drink some water! 💧'
      }).show()
    },
    notifyBatteryFull() {
      if (!Notification.isSupported()) return
      new Notification({
        title: 'Hydri',
        body: 'Battery fully charged — unplug the charger to help protect its health. 🔋'
      }).show()
    }
  }
}
