import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Sparkles from '../Sparkles.jsx'
import { applyWalkCycle } from '../walkCycle.js'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// A distinct head + torso (like Girl/Boy) rather than the water-drop's
// single teardrop silhouette -- this is meant to read as an actual cat.
const LEFT_LEG_ORIGIN = '54 128'
const RIGHT_LEG_ORIGIN = '76 128'
const LEFT_ARM_ORIGIN = '42 96'
const RIGHT_ARM_ORIGIN = '88 96'

export default function CatMascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const tailRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

  const uid = useId()
  const furId = `cat-fur-${uid}`
  const bellyId = `cat-belly-${uid}`
  const shadowId = `cat-shadow-${uid}`
  const dropShadowId = `cat-dropshadow-${uid}`

  useEffect(() => {
    const ctx = gsap.context(() => {
      const limbs = [leftLegRef.current, rightLegRef.current, leftArmRef.current, rightArmRef.current]
      gsap.killTweensOf([...limbs, bodyRef.current, rootRef.current, tailRef.current])

      // The tail sways gently in every pose, independent of the limbs, for a
      // touch of continuous life even when idle.
      gsap.to(tailRef.current, {
        rotate: 14,
        svgOrigin: '92 112',
        duration: 0.9,
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
        gsap.to(rootRef.current, { y: -14, duration: 0.28, yoyo: true, repeat: 5, ease: 'power1.out' })
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
            <stop offset="0%" stopColor="#f4a856" />
            <stop offset="100%" stopColor="#d9862f" />
          </linearGradient>
          <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3e0" />
            <stop offset="100%" stopColor="#ffe4b8" />
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

        {/* tail, drawn behind everything */}
        <path
          ref={tailRef}
          d="M 90 115 C 110 110, 118 90, 104 74"
          stroke={`url(#${furId})`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        <g ref={leftLegRef}>
          <line x1="54" y1="128" x2="48" y2="154" stroke={`url(#${furId})`} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="48" cy="157" rx="7" ry="4.5" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="1" />
        </g>
        <g ref={rightLegRef}>
          <line x1="76" y1="128" x2="82" y2="154" stroke={`url(#${furId})`} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="82" cy="157" rx="7" ry="4.5" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="1" />
        </g>

        <g ref={bodyRef}>
          {/* torso, separate from the head */}
          <path
            d="M 40 98 Q 65 88 90 98 L 94 130 Q 65 142 36 130 Z"
            fill={`url(#${furId})`}
            stroke="#b56b1f"
            strokeWidth="2"
            filter={`url(#${dropShadowId})`}
          />
          <path d="M 48 104 Q 65 98 82 104 L 84 128 Q 65 136 46 128 Z" fill={`url(#${bellyId})`} />

          {/* neck */}
          <rect x="57" y="82" width="16" height="14" fill={`url(#${furId})`} />

          {/* pointed ears, behind the head */}
          <path d="M 42 40 L 34 14 L 60 32 Z" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="2" />
          <path d="M 88 40 L 96 14 L 70 32 Z" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="2" />
          <path d="M 43 34 L 39 20 L 53 31 Z" fill="#ffc9d6" opacity="0.85" />
          <path d="M 87 34 L 91 20 L 77 31 Z" fill="#ffc9d6" opacity="0.85" />

          {/* head */}
          <circle cx="65" cy="56" r="28" fill={`url(#${furId})`} />
          <ellipse cx="55" cy="47" rx="8" ry="6" fill="#ffffff" opacity="0.2" />

          {/* tabby stripes on the forehead */}
          <path d="M 50 34 Q 55 26 62 24" stroke="#b56b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M 80 34 Q 75 26 68 24" stroke="#b56b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />

          {/* whiskers */}
          <path d="M 36 62 L 16 58" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M 36 68 L 14 68" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M 94 62 L 114 58" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M 94 68 L 116 68" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

          <ellipse cx="46" cy="66" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />
          <ellipse cx="84" cy="66" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />

          {!showCuteEyes ? (
            <>
              <path d="M 46 50 L 58 55" stroke="#3a2410" strokeWidth="3" strokeLinecap="round" />
              <path d="M 84 50 L 72 55" stroke="#3a2410" strokeWidth="3" strokeLinecap="round" />
              <path d="M 55 76 Q 65 70 75 76" stroke="#3a2410" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="53" cy="55" r="5.4" fill="#ffffff" />
              <circle cx="77" cy="55" r="5.4" fill="#ffffff" />
              <circle cx="54" cy="56" r="3.7" fill="#4caf50" />
              <circle cx="76" cy="56" r="3.7" fill="#4caf50" />
              <circle cx="54" cy="56" r="1.8" fill="#111" />
              <circle cx="76" cy="56" r="1.8" fill="#111" />
              <circle cx="52" cy="53" r="1.1" fill="#ffffff" />
              <circle cx="74" cy="53" r="1.1" fill="#ffffff" />
              <path d="M 63 67 L 67 67" stroke="#b56b1f" strokeWidth="2" strokeLinecap="round" />
              <path
                d={pose === 'happy' ? 'M 52 73 Q 65 84 78 73' : 'M 56 71 Q 65 76 74 71'}
                stroke="#3a2410"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
        </g>

        <g ref={leftArmRef}>
          <line x1="42" y1="96" x2="26" y2="118" stroke={`url(#${furId})`} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="26" cy="120" rx="5.5" ry="4" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="1" />
        </g>
        <g ref={rightArmRef}>
          <line x1="88" y1="96" x2="104" y2="118" stroke={`url(#${furId})`} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="104" cy="120" rx="5.5" ry="4" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="1" />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
