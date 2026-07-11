import si from 'systeminformation'

const POLL_INTERVAL_MS = 5 * 60 * 1000 // battery % changes slowly; no need to poll more often

/**
 * Watches system battery status and fires once whenever the laptop is both
 * plugged in AND at/above the configured charge threshold -- the moment
 * leaving it plugged in stops helping and starts aging the battery.
 *
 * Deliberately edge-triggered rather than repeating on every poll: it fires
 * once per "plugged in and full" session, then goes quiet until the
 * condition clears (unplugged, or charge drops back below the threshold),
 * so it nags once instead of every five minutes.
 */
export function createBatteryMonitor({ settingsStore, onFullyCharged }) {
  let timer = null
  let alreadyNotified = false
  let snoozeUntil = 0

  async function poll() {
    if (!settingsStore.get('batteryReminderEnabled')) return

    let battery
    try {
      battery = await si.battery()
    } catch (error) {
      console.warn('[batteryMonitor] could not read battery status:', error?.message ?? error)
      return
    }

    if (!battery?.hasBattery) return // desktops / VMs with no battery: nothing to do

    const threshold = settingsStore.get('batteryReminderThreshold')
    const isFullAndPluggedIn = battery.acConnected && battery.percent >= threshold

    if (!isFullAndPluggedIn) {
      alreadyNotified = false
      return
    }

    if (alreadyNotified || Date.now() < snoozeUntil) return

    alreadyNotified = true
    onFullyCharged()
  }

  function snooze(minutes = 10) {
    snoozeUntil = Date.now() + minutes * 60 * 1000
    alreadyNotified = false
  }

  function acknowledge() {
    // Stay quiet until the condition actually clears (unplugged, or drops
    // below the threshold) -- re-arming immediately would just nag again
    // on the very next poll while still plugged in.
    alreadyNotified = true
  }

  function start() {
    if (timer) return
    poll()
    timer = setInterval(poll, POLL_INTERVAL_MS)
  }

  function stop() {
    if (timer) clearInterval(timer)
    timer = null
  }

  return { start, stop, snooze, acknowledge }
}
