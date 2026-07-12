const DIALOGUE = {
  nearFullGreeting: [
    "🔋 Almost there! You're at 95% — start thinking about unplugging soon.",
    'Battery is nearly full (95%). No rush, but keep an eye on it! 😊',
    "🔌 95% charged already! Won't be long now."
  ],
  fullGreeting: [
    '🔋 Your battery is fully charged! Unplugging now helps keep it healthy long-term.',
    "Hey! You're at full charge — mind unplugging the charger? 😊",
    "🔌 Battery's full! Time to disconnect the charger."
  ],
  happy: ['Great choice! Your battery will thank you. 💚', 'Yay! Unplugged and healthy!', "That's the way to do it!"],
  annoyed: ["Overcharging isn't great for the battery, you know... 😒", 'Okay, but not too long!', "Don't forget about me!"]
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Presents battery milestone reminders through the same companion overlay
 * window the water reminders use, tagged with kind: 'battery' so the
 * renderer shows charger-appropriate dialogue and buttons instead of
 * Drink Now / Snooze.
 *
 * Two distinct milestones, both surfaced through the same UI:
 *   - 'near-full': battery hit 95% while charging (early heads-up).
 *   - 'full': battery hit 100% and is still plugged in (the real ask).
 */
export function createBatteryReminderPresenter({ getCompanionWindow, batteryMonitor, notifier }) {
  function fire(stage) {
    const dialogueSet = stage === 'full' ? DIALOGUE.fullGreeting : DIALOGUE.nearFullGreeting
    const companionWindow = getCompanionWindow()
    if (companionWindow) {
      companionWindow.show()
      companionWindow.sendReminderTrigger({
        kind: 'battery',
        dialogue: pickRandom(dialogueSet)
      })
    }
    notifier.notifyBatteryFull(stage)
  }

  function acknowledge() {
    batteryMonitor.acknowledge()
    return { dialogue: pickRandom(DIALOGUE.happy) }
  }

  function snooze(minutes = 10) {
    batteryMonitor.snooze(minutes)
    return { dialogue: pickRandom(DIALOGUE.annoyed) }
  }

  return { fire, acknowledge, snooze }
}
