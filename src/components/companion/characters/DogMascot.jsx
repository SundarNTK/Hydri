import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Sparkles from '../Sparkles.jsx'
import { applyWalkCycle } from '../walkCycle.js'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// Same rig proportions as WaterDropMascot.jsx.
const LEFT_LEG_ORIGIN = '52 112'
const RIGHT_LEG_ORIGIN = '68 112'
const LEFT_ARM_ORIGIN = '30 88'
const RIGHT_ARM_ORIGIN = '90 88'

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
        svgOrigin: '90 96',
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
      } else if (pose === 'wave') {
        gsap.set(leftArmRef.current, { rotate: 0 })
        gsap.set(rightArmRef.current, { rotate: 130, svgOrigin: RIGHT_ARM_ORIGIN })
        gsap.to(rightArmRef.current, {
          rotate: 150,
          svgOrigin: RIGHT_ARM_ORIGIN,
          duration: 0.3,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        })
        gsap.to(bodyRef.current, { y: -3, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      } else if (pose === 'thinking') {
        gsap.set(leftArmRef.current, { rotate: 0 })
        gsap.to(rightArmRef.current, {
          rotate: 105,
          svgOrigin: RIGHT_ARM_ORIGIN,
          duration: 0.4,
          ease: 'back.out(1.6)'
        })
        gsap.to(rootRef.current, { rotate: -4, duration: 0.4, transformOrigin: 'bottom center' })
      } else {
        gsap.set(limbs, { rotate: 0 })
        gsap.set(rootRef.current, { rotate: 0 })
        gsap.to(bodyRef.current, { y: -3, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [pose])

  const sizePx = SIZE_MAP[size] ?? SIZE_MAP.medium

  return (
    <div
      ref={rootRef}
      style={{ width: sizePx, height: sizePx * 1.25, transform: facingLeft ? 'scaleX(-1)' : 'none' }}
      className="relative"
    >
      <svg viewBox="0 0 120 150" width="100%" height="100%">
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

        <ellipse cx="60" cy="145" rx="28" ry="7" fill={`url(#${shadowId})`} />

        {/* wagging tail, drawn behind everything */}
        <path
          ref={tailRef}
          d="M 90 96 C 106 90, 110 74, 100 62"
          stroke={`url(#${furId})`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        <g ref={leftLegRef}>
          <line x1="52" y1="112" x2="46" y2="140" stroke={`url(#${furId})`} strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="46" cy="142" rx="6.5" ry="4" fill="#fffaf2" />
        </g>
        <g ref={rightLegRef}>
          <line x1="68" y1="112" x2="74" y2="140" stroke={`url(#${furId})`} strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="74" cy="142" rx="6.5" ry="4" fill="#fffaf2" />
        </g>

        <g ref={bodyRef}>
          {/* floppy ears */}
          <path d="M 32 46 C 14 50, 10 76, 26 88 C 34 78, 36 58, 32 46 Z" fill={`url(#${earId})`} />
          <path d="M 88 46 C 106 50, 110 76, 94 88 C 86 78, 84 58, 88 46 Z" fill={`url(#${earId})`} />

          {/* head + body */}
          <path
            d="M60 8 C 90 45, 108 70, 108 92 A 48 48 0 1 1 12 92 C 12 70, 30 45, 60 8 Z"
            fill={`url(#${furId})`}
            stroke="#a97b45"
            strokeWidth="2"
            filter={`url(#${dropShadowId})`}
          />
          <path d="M 60 60 C 78 62, 88 78, 84 98 C 70 106, 50 106, 36 98 C 32 78, 42 62, 60 60 Z" fill={`url(#${bellyId})`} />

          {/* a couple of soft spots */}
          <ellipse cx="86" cy="55" rx="8" ry="6" fill="#a97b45" opacity="0.4" />
          <ellipse cx="38" cy="66" rx="6" ry="5" fill="#a97b45" opacity="0.3" />

          <ellipse cx="42" cy="90" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />
          <ellipse cx="78" cy="90" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />

          {pose === 'annoyed' ? (
            <>
              <path d="M 40 76 L 52 80" stroke="#4a3018" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 80 76 L 68 80" stroke="#4a3018" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="60" cy="95" rx="9" ry="7" fill="#4a3018" />
              <path d="M 50 96 Q 60 90 70 96" stroke="#2b1c0c" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="48" cy="80" r="5.2" fill="#ffffff" />
              <circle cx="72" cy="80" r="5.2" fill="#ffffff" />
              <circle cx="49" cy="81" r="3.6" fill="#5b3a1e" />
              <circle cx="71" cy="81" r="3.6" fill="#5b3a1e" />
              <circle cx="49" cy="81" r="1.7" fill="#111" />
              <circle cx="71" cy="81" r="1.7" fill="#111" />
              <circle cx="47" cy="79" r="1" fill="#ffffff" />
              <circle cx="69" cy="79" r="1" fill="#ffffff" />
              {/* nose */}
              <ellipse cx="60" cy="93" rx="6" ry="4.5" fill="#2b1c0c" />
              {pose === 'happy' ? (
                <>
                  <path d="M 48 99 Q 60 112 72 99" stroke="#2b1c0c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 55 103 Q 60 112 65 103" fill="#ff8fa3" stroke="#e0637a" strokeWidth="1" />
                </>
              ) : (
                <path d="M 52 99 Q 60 104 68 99" stroke="#2b1c0c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </>
          )}
        </g>

        <g ref={leftArmRef}>
          <line x1="30" y1="88" x2="16" y2="108" stroke={`url(#${furId})`} strokeWidth="7" strokeLinecap="round" />
        </g>
        <g ref={rightArmRef}>
          <line x1="90" y1="88" x2="104" y2="108" stroke={`url(#${furId})`} strokeWidth="7" strokeLinecap="round" />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
