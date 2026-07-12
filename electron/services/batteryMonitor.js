import si from 'systeminformation'

const POLL_INTERVAL_MS = 5 * 60 * 1000 // battery % changes slowly; no need to poll more often

const NEAR_FULL_THRESHOLD = 95
const FULL_THRESHOLD = 100

/**
 * Watches system battery status and fires on two distinct scenarios while
 * plugged in:
 *   1. "near full" -- battery has reached 95% and is still charging, an
 *      early heads-up.
 *   2. "full" -- battery is at 100% and *still* plugged in, the point where
 *      staying connected stops helping and starts aging the battery.
 *
 * Each stage is edge-triggered (fires once per charging session) rather
 * than repeating on every poll, and both reset together once unplugged (or
 * the level drops back below 95%), so a fresh charge cycle gets its own
 * pair of reminders instead of nagging every five minutes.
 */
export function createBatteryMonitor({ settingsStore, onMilestone }) {
  let timer = null
  let notifiedNearFull = false
  let notifiedFull = false
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

    if (!battery.acConnected || battery.percent < NEAR_FULL_THRESHOLD) {
      notifiedNearFull = false
      notifiedFull = false
      return
    }

    if (Date.now() < snoozeUntil) return

    if (battery.percent >= FULL_THRESHOLD) {
      if (!notifiedFull) {
        notifiedFull = true
        onMilestone('full')
      }
    } else if (!notifiedNearFull) {
      notifiedNearFull = true
      onMilestone('near-full')
    }
  }

  function snooze(minutes = 10) {
    snoozeUntil = Date.now() + minutes * 60 * 1000
  }

  function acknowledge() {
    // Stay quiet until the condition actually clears (unplugged, or drops
    // below the threshold) -- re-arming immediately would just nag again
    // on the very next poll while still plugged in.
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
