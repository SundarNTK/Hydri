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
    notifyBatteryFull(stage = 'full') {
      if (!Notification.isSupported()) return
      const body =
        stage === 'full'
          ? 'Battery fully charged — unplug the charger to help protect its health. 🔋'
          : 'Battery at 95% — almost there. 🔋'
      new Notification({ title: 'Hydri', body }).show()
    },
    notifyStandUp() {
      if (!Notification.isSupported()) return
      new Notification({
        title: 'Hydri',
        body: 'Time to stand up and take a short walk! 🚶'
      }).show()
    }
  }
}
