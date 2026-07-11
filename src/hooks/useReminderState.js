import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../ipc/api.js'

/**
 * Companion phase machine: hidden -> entering -> greeting -> (happy | annoyed) -> exiting -> hidden
 */
export function useReminderState() {
  const [phase, setPhase] = useState('hidden')
  const [dialogue, setDialogue] = useState('')
  const reminderIdRef = useRef(null)

  useEffect(() => {
    return api.reminders.onTrigger((payload) => {
      reminderIdRef.current = payload.reminderId
      setDialogue(payload.dialogue)
      setPhase('entering')
    })
  }, [])

  const drinkNow = useCallback(async () => {
    const result = await api.reminders.respondDrink()
    if (result?.dialogue) setDialogue(result.dialogue)
    setPhase('happy')
    return result
  }, [])

  const snooze = useCallback(async (minutes = 5) => {
    const result = await api.reminders.respondSnooze(minutes)
    if (result?.dialogue) setDialogue(result.dialogue)
    setPhase('annoyed')
    return result
  }, [])

  const finishExit = useCallback(() => {
    reminderIdRef.current = null
    setPhase('hidden')
  }, [])

  return { phase, setPhase, dialogue, drinkNow, snooze, finishExit }
}
