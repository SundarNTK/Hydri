const DIALOGUE = {
  greeting: [
    '🔋 Your battery is fully charged! Unplugging now helps keep it healthy long-term.',
    'Hey! You\'re at full charge — mind unplugging the charger? 😊',
    "🔌 Battery's full! Time to disconnect the charger."
  ],
  happy: ['Great choice! Your battery will thank you. 💚', 'Yay! Unplugged and healthy!', "That's the way to do it!"],
  annoyed: ["Overcharging isn't great for the battery, you know... 😒", 'Okay, but not too long!', "Don't forget about me!"]
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Presents battery-full reminders through the same companion overlay window
 * the water reminders use, tagged with kind: 'battery' so the renderer shows
 * charger-appropriate dialogue and buttons instead of Drink Now / Snooze.
 */
export function createBatteryReminderPresenter({ getCompanionWindow, batteryMonitor, notifier }) {
  function fire() {
    const companionWindow = getCompanionWindow()
    if (companionWindow) {
      companionWindow.show()
      companionWindow.webContents.send('reminder:trigger', {
        kind: 'battery',
        dialogue: pickRandom(DIALOGUE.greeting)
      })
    }
    notifier.notifyBatteryFull()
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
