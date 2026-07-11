import { useState } from 'react'
import { motion } from 'framer-motion'
import fullLogo from '../../assets/hydri-full-logo.png'

export default function OnboardingModal({ onSubmit, onSkip }) {
  const [name, setName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl border border-white/40 bg-white/85 p-8 text-center shadow-glass backdrop-blur-glass dark:border-white/10 dark:bg-slate-800/90"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <motion.div
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-hydri-blue/20 blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-hydri-leaf/20 blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        <motion.img
          src={fullLogo}
          alt="Hydri — Your Caring Health Companion"
          className="relative mx-auto mb-3 w-56 max-w-full"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
        />
        <p className="relative mt-1 mb-5 text-sm text-hydri-ink/60 dark:text-white/60">
          I'm your caring hydration companion. What should I call you?
        </p>

        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          maxLength={40}
          className="relative w-full rounded-xl border border-black/10 bg-white/90 px-4 py-2.5 text-center text-sm font-medium text-hydri-ink shadow-sm focus:border-hydri-blue focus:outline-none dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
        />

        <motion.button
          type="submit"
          disabled={!name.trim()}
          whileHover={name.trim() ? { scale: 1.03 } : undefined}
          whileTap={name.trim() ? { scale: 0.97 } : undefined}
          className="relative mt-4 w-full rounded-full bg-hydri-blue px-4 py-2.5 text-sm font-semibold text-white shadow-glass transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Let's Go →
        </motion.button>

        <button
          type="button"
          onClick={onSkip}
          className="relative mt-3 text-xs font-medium text-hydri-ink/50 underline-offset-2 hover:underline dark:text-white/40"
        >
          Skip for now
        </button>
      </motion.form>
    </motion.div>
  )
}
