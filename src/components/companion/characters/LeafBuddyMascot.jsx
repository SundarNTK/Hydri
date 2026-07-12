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

export default function LeafBuddyMascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

  const uid = useId()
  const leafId = `leaf-body-${uid}`
  const shadowId = `leaf-shadow-${uid}`
  const dropShadowFilterId = `leaf-dropshadow-${uid}`

  useEffect(() => {
    const ctx = gsap.context(() => {
      const limbs = [leftLegRef.current, rightLegRef.current, leftArmRef.current, rightArmRef.current]
      gsap.killTweensOf([...limbs, bodyRef.current, rootRef.current])

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

  return (
    <div
      ref={rootRef}
      style={{ width: sizePx, height: sizePx * 1.25, transform: facingLeft ? 'scaleX(-1)' : 'none' }}
      className="relative"
    >
      <svg viewBox="0 0 120 150" width="100%" height="100%">
        <defs>
          <linearGradient id={leafId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a3e8b0" />
            <stop offset="55%" stopColor="#4caf50" />
            <stop offset="100%" stopColor="#2e7d32" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1a22" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1a22" stopOpacity="0" />
          </radialGradient>
          <filter id={dropShadowFilterId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1.2" dy="2" stdDeviation="1.5" floodColor="#12220f" floodOpacity="0.35" />
          </filter>
        </defs>

        <ellipse cx="60" cy="145" rx="30" ry="7" fill={`url(#${shadowId})`} />

        <g ref={leftLegRef}>
          <line x1="52" y1="112" x2="46" y2="142" stroke="#2e7d32" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g ref={rightLegRef}>
          <line x1="68" y1="112" x2="74" y2="142" stroke="#2e7d32" strokeWidth="7" strokeLinecap="round" />
        </g>

        <g ref={bodyRef}>
          {/* leaf-shaped body: a pointed tip at the stem, rounded at the base */}
          <path
            d="M60 6 C 100 30, 112 66, 100 96 A 44 44 0 1 1 20 96 C 8 66, 20 30, 60 6 Z"
            fill={`url(#${leafId})`}
            stroke="#2e7d32"
            strokeWidth="2"
          />
          {/* center vein */}
          <path
            d="M60 16 C 58 40, 60 70, 60 100"
            stroke="#2e7d32"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
          {/* rim-light */}
          <path
            d="M42 22 C 28 40, 20 60, 18 78"
            stroke="#e3ffe6"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* small water droplet accent, mirroring the water-drop mascot */}
          <path
            d="M84 76 C 92 84, 96 92, 90 98 C 84 104, 76 100, 76 92 C 76 86, 80 80, 84 76 Z"
            fill="#3aa1d6"
            stroke="#1c6f9c"
            strokeWidth="2"
            filter={`url(#${dropShadowFilterId})`}
          />
          <circle cx="34" cy="88" r="6" fill="#ffffff" opacity="0.5" />

          {pose === 'annoyed' ? (
            <>
              <path d="M40 78 L52 82" stroke="#12220f" strokeWidth="4" strokeLinecap="round" />
              <path d="M80 78 L68 82" stroke="#12220f" strokeWidth="4" strokeLinecap="round" />
              <path d="M46 100 Q60 92 74 100" stroke="#12220f" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="46" cy="82" r="4.5" fill="#12220f" />
              <circle cx="74" cy="82" r="4.5" fill="#12220f" />
              <path
                d={pose === 'happy' ? 'M44 98 Q60 114 76 98' : 'M46 98 Q60 108 74 98'}
                stroke="#12220f"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
        </g>

        <g ref={leftArmRef}>
          <line x1="30" y1="88" x2="14" y2="108" stroke="#2e7d32" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g ref={rightArmRef}>
          <line x1="90" y1="88" x2="106" y2="108" stroke="#2e7d32" strokeWidth="7" strokeLinecap="round" />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
