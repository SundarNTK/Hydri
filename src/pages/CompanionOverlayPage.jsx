import { useCallback, useEffect } from 'react'
import CompanionStage from '../components/companion/CompanionStage.jsx'
import { useReminderState } from '../hooks/useReminderState.js'
import { useSettings } from '../hooks/useSettings.js'
import { api } from '../ipc/api.js'

const REACTION_DISPLAY_MS = 2600

export default function CompanionOverlayPage() {
  const { phase, setPhase, dialogue, drinkNow, snooze, finishExit } = useReminderState()
  const { settings } = useSettings()

  const handleArrived = useCallback(() => {
    setPhase((current) => (current === 'entering' ? 'greeting' : current))
  }, [setPhase])

  const handleDeparted = useCallback(() => {
    finishExit()
    api.companion.hide()
  }, [finishExit])

  useEffect(() => {
    if (phase !== 'happy' && phase !== 'annoyed') return
    const timeout = setTimeout(() => setPhase('exiting'), REACTION_DISPLAY_MS)
    return () => clearTimeout(timeout)
  }, [phase, setPhase])

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent">
      <CompanionStage
        phase={phase}
        dialogue={dialogue}
        characterSize={settings?.characterSize ?? 'medium'}
        onArrived={handleArrived}
        onDeparted={handleDeparted}
        onDrinkNow={drinkNow}
        onSnooze={() => snooze(5)}
      />
    </div>
  )
}
