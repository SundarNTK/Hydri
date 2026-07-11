import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../ipc/api.js'

/**
 * Companion phase machine: hidden -> entering -> greeting -> (happy | annoyed) -> exiting -> hidden
 *
 * Drives both water reminders and battery-full reminders through the same
 * visual choreography. `kind` (read from the trigger payload) decides which
 * IPC calls the primary/secondary actions actually make and which dialogue
 * comes back, without needing a second parallel state machine.
 */
export function useReminderState() {
  const [phase, setPhase] = useState('hidden')
  const [dialogue, setDialogue] = useState('')
  const [kind, setKind] = useState('water')
  const reminderIdRef = useRef(null)

  useEffect(() => {
    return api.reminders.onTrigger((payload) => {
      reminderIdRef.current = payload.reminderId ?? null
      setKind(payload.kind ?? 'water')
      setDialogue(payload.dialogue)
      setPhase('entering')
    })
  }, [])

  const primaryAction = useCallback(async () => {
    const result = kind === 'battery' ? await api.battery.acknowledge() : await api.reminders.respondDrink()
    if (result?.dialogue) setDialogue(result.dialogue)
    setPhase('happy')
    return result
  }, [kind])

  const secondaryAction = useCallback(
    async (minutes) => {
      const result =
        kind === 'battery' ? await api.battery.snooze(minutes ?? 10) : await api.reminders.respondSnooze(minutes ?? 5)
      if (result?.dialogue) setDialogue(result.dialogue)
      setPhase('annoyed')
      return result
    },
    [kind]
  )

  const finishExit = useCallback(() => {
    reminderIdRef.current = null
    setPhase('hidden')
  }, [])

  return { phase, setPhase, dialogue, kind, primaryAction, secondaryAction, finishExit }
}
