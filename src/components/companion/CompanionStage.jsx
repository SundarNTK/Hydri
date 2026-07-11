import { AnimatePresence, motion } from 'framer-motion'
import Mascot from './Mascot.jsx'
import SpeechBubble from './SpeechBubble.jsx'
import ReminderCard from './ReminderCard.jsx'

const START_X = -260
const ENTER_X = 160
const EXIT_X = 820

const TARGET_X_BY_PHASE = {
  hidden: START_X,
  entering: ENTER_X,
  greeting: ENTER_X,
  happy: ENTER_X,
  annoyed: ENTER_X,
  exiting: EXIT_X
}

const POSE_BY_PHASE = {
  hidden: 'walking',
  entering: 'walking',
  greeting: 'idle',
  happy: 'happy',
  annoyed: 'annoyed',
  exiting: 'walking'
}

export default function CompanionStage({
  phase,
  dialogue,
  characterId,
  characterSize,
  onArrived,
  onDeparted,
  onDrinkNow,
  onSnooze
}) {
  const targetX = TARGET_X_BY_PHASE[phase] ?? START_X
  const pose = POSE_BY_PHASE[phase] ?? 'idle'
  const showBubble = phase === 'greeting' || phase === 'happy' || phase === 'annoyed'

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute bottom-4 left-0"
        initial={{ x: START_X, opacity: 0 }}
        animate={{ x: targetX, opacity: phase === 'hidden' ? 0 : 1 }}
        transition={{ duration: phase === 'exiting' ? 1.6 : 2.2, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          if (phase === 'entering') onArrived?.()
          if (phase === 'exiting') onDeparted?.()
        }}
      >
        <Mascot characterId={characterId} pose={pose} size={characterSize} facingLeft={phase === 'exiting'} />
      </motion.div>

      <AnimatePresence>
        {showBubble && (
          <motion.div
            key="bubble"
            className="absolute bottom-40"
            style={{ left: targetX + 90 }}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <SpeechBubble text={dialogue} />
            {phase === 'greeting' && <ReminderCard onDrinkNow={onDrinkNow} onSnooze={onSnooze} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
