import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Sparkles from '../Sparkles.jsx'
import { applyWalkCycle } from '../walkCycle.js'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// A distinct head + torso (like Girl/Boy) rather than the water-drop's
// single teardrop silhouette -- this is meant to read as an actual dog.
const LEFT_LEG_ORIGIN = '54 128'
const RIGHT_LEG_ORIGIN = '76 128'
const LEFT_ARM_ORIGIN = '42 96'
const RIGHT_ARM_ORIGIN = '88 96'

export default function DogMascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const tailRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

  const uid = useId()
  const furId = `dog-fur-${uid}`
  const bellyId = `dog-belly-${uid}`
  const earId = `dog-ear-${uid}`
  const shadowId = `dog-shadow-${uid}`
  const dropShadowId = `dog-dropshadow-${uid}`

  useEffect(() => {
    const ctx = gsap.context(() => {
      const limbs = [leftLegRef.current, rightLegRef.current, leftArmRef.current, rightArmRef.current]
      gsap.killTweensOf([...limbs, bodyRef.current, rootRef.current, tailRef.current])

      // A happily wagging tail plays continuously, a bit faster than the
      // cat's sway, to read as more energetic/dog-like.
      gsap.to(tailRef.current, {
        rotate: 22,
        svgOrigin: '90 112',
        duration: 0.22,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      if (pose === 'walking') {
        applyWalkCycle(
          gsap,
          {
            leftLeg: leftLegRef.current,
            rightLeg: rightLegRef.current,
            leftArm: leftArmRef.current,
            rightArm: rightArmRef.current,
            body: bodyRef.current,
            root: rootRef.current
          },
          { leftLeg: LEFT_LEG_ORIGIN, rightLeg: RIGHT_LEG_ORIGIN, leftArm: LEFT_ARM_ORIGIN, rightArm: RIGHT_ARM_ORIGIN }
        )
      } else if (pose === 'happy') {
        gsap.set(limbs, { rotate: 0 })
        gsap.to(rootRef.current, { y: -14, duration: 0.26, yoyo: true, repeat: 5, ease: 'power1.out' })
        gsap.to(leftArmRef.current, { rotate: -150, svgOrigin: LEFT_ARM_ORIGIN, duration: 0.4, ease: 'back.out(2)' })
        gsap.to(rightArmRef.current, { rotate: 150, svgOrigin: RIGHT_ARM_ORIGIN, duration: 0.4, ease: 'back.out(2)' })
      } else if (pose === 'annoyed') {
        gsap.set(leftArmRef.current, { rotate: -100, svgOrigin: LEFT_ARM_ORIGIN })
        gsap.set(rightArmRef.current, { rotate: 100, svgOrigin: RIGHT_ARM_ORIGIN })
        gsap.set([leftLegRef.current, rightLegRef.current], { rotate: 0 })
        gsap.to(rootRef.current, {
          rotate: 4,
          duration: 0.12,
          yoyo: true,
          repeat: 7,
          ease: 'sine.inOut',
          transformOrigin: 'bottom center'
        })
      } else {
        gsap.set(limbs, { rotate: 0 })
        gsap.set(rootRef.current, { rotate: 0 })
        gsap.to(bodyRef.current, { y: -3, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [pose])

  const sizePx = SIZE_MAP[size] ?? SIZE_MAP.medium
  const aspect = 175 / 130
  const showCuteEyes = pose !== 'annoyed'

  return (
    <div
      ref={rootRef}
      style={{ width: sizePx, height: sizePx * aspect, transform: facingLeft ? 'scaleX(-1)' : 'none' }}
      className="relative"
    >
      <svg viewBox="0 0 130 175" width="100%" height="100%">
        <defs>
          <linearGradient id={furId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c9a0" />
            <stop offset="100%" stopColor="#c99a63" />
          </linearGradient>
          <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf2" />
            <stop offset="100%" stopColor="#fbeed9" />
          </linearGradient>
          <linearGradient id={earId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9a6b3a" />
            <stop offset="100%" stopColor="#7a4f26" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1a22" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1a22" stopOpacity="0" />
          </radialGradient>
          <filter id={dropShadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1.2" dy="2" stdDeviation="1.5" floodColor="#3a2410" floodOpacity="0.3" />
          </filter>
        </defs>

        <ellipse cx="65" cy="168" rx="30" ry="7" fill={`url(#${shadowId})`} />

        {/* wagging tail, drawn behind everything */}
        <path
          ref={tailRef}
          d="M 90 115 C 108 108, 114 88, 102 72"
          stroke={`url(#${furId})`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        <g ref={leftLegRef}>
          <line x1="54" y1="128" x2="48" y2="154" stroke={`url(#${furId})`} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="48" cy="157" rx="7" ry="4.5" fill="#fffaf2" />
        </g>
        <g ref={rightLegRef}>
          <line x1="76" y1="128" x2="82" y2="154" stroke={`url(#${furId})`} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="82" cy="157" rx="7" ry="4.5" fill="#fffaf2" />
        </g>

        <g ref={bodyRef}>
          {/* torso, separate from the head */}
          <path
            d="M 40 98 Q 65 88 90 98 L 94 130 Q 65 142 36 130 Z"
            fill={`url(#${furId})`}
            stroke="#a97b45"
            strokeWidth="2"
            filter={`url(#${dropShadowId})`}
          />
          <path d="M 48 104 Q 65 98 82 104 L 84 128 Q 65 136 46 128 Z" fill={`url(#${bellyId})`} />
          <ellipse cx="80" cy="112" rx="8" ry="6" fill="#a97b45" opacity="0.3" />

          {/* neck */}
          <rect x="57" y="82" width="16" height="14" fill={`url(#${furId})`} />

          {/* floppy ears, behind the head */}
          <path d="M 40 46 C 20 52, 16 78, 32 92 C 42 82, 44 58, 40 46 Z" fill={`url(#${earId})`} />
          <path d="M 90 46 C 110 52, 114 78, 98 92 C 88 82, 86 58, 90 46 Z" fill={`url(#${earId})`} />

          {/* head */}
          <circle cx="65" cy="56" r="28" fill={`url(#${furId})`} />
          <ellipse cx="55" cy="47" rx="8" ry="6" fill="#ffffff" opacity="0.2" />

          {/* a soft patch over one eye */}
          <ellipse cx="82" cy="48" rx="9" ry="8" fill="#a97b45" opacity="0.35" />

          <ellipse cx="46" cy="66" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />
          <ellipse cx="84" cy="66" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />

          {/* snout */}
          <ellipse cx="65" cy="72" rx="14" ry="10" fill={`url(#${bellyId})`} stroke="#c99a63" strokeWidth="1.5" />

          {!showCuteEyes ? (
            <>
              <path d="M 46 48 L 58 53" stroke="#4a3018" strokeWidth="3" strokeLinecap="round" />
              <path d="M 84 48 L 72 53" stroke="#4a3018" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="65" cy="73" rx="6" ry="5" fill="#2b1c0c" />
              <path d="M 55 78 Q 65 72 75 78" stroke="#2b1c0c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="53" cy="54" r="5.6" fill="#ffffff" />
              <circle cx="77" cy="54" r="5.6" fill="#ffffff" />
              <circle cx="54" cy="55" r="3.9" fill="#5b3a1e" />
              <circle cx="76" cy="55" r="3.9" fill="#5b3a1e" />
              <circle cx="54" cy="55" r="1.9" fill="#111" />
              <circle cx="76" cy="55" r="1.9" fill="#111" />
              <circle cx="52" cy="52" r="1.1" fill="#ffffff" />
              <circle cx="74" cy="52" r="1.1" fill="#ffffff" />
              {/* nose */}
              <ellipse cx="65" cy="70" rx="6.5" ry="5" fill="#2b1c0c" />
              {pose === 'happy' ? (
                <>
                  <path d="M 53 78 Q 65 90 77 78" stroke="#2b1c0c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 59 81 Q 65 90 71 81" fill="#ff8fa3" stroke="#e0637a" strokeWidth="1" />
                </>
              ) : (
                <path d="M 56 78 Q 65 82 74 78" stroke="#2b1c0c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </>
          )}
        </g>

        <g ref={leftArmRef}>
          <line x1="42" y1="96" x2="26" y2="118" stroke={`url(#${furId})`} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="26" cy="120" rx="5.5" ry="4" fill={`url(#${furId})`} />
        </g>
        <g ref={rightArmRef}>
          <line x1="88" y1="96" x2="104" y2="118" stroke={`url(#${furId})`} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="104" cy="120" rx="5.5" ry="4" fill={`url(#${furId})`} />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
