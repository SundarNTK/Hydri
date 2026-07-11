import { Notification } from 'electron'

export function createNotifier() {
  return {
    notifyReminder() {
      if (!Notification.isSupported()) return
      new Notification({
        title: 'Hydri',
        body: 'Time to drink some water! 💧'
      }).show()
    }
  }
}
