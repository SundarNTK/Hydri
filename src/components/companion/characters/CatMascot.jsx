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
        svgOrigin: '92 100',
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

        <ellipse cx="60" cy="145" rx="28" ry="7" fill={`url(#${shadowId})`} />

        {/* tail, drawn behind everything */}
        <path
          ref={tailRef}
          d="M 92 100 C 108 96, 112 78, 100 66"
          stroke={`url(#${furId})`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        <g ref={leftLegRef}>
          <line x1="52" y1="112" x2="46" y2="140" stroke={`url(#${furId})`} strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="46" cy="142" rx="6.5" ry="4" fill={`url(#${furId})`} />
        </g>
        <g ref={rightLegRef}>
          <line x1="68" y1="112" x2="74" y2="140" stroke={`url(#${furId})`} strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="74" cy="142" rx="6.5" ry="4" fill={`url(#${furId})`} />
        </g>

        <g ref={bodyRef}>
          {/* pointed ears */}
          <path d="M 34 42 L 28 18 L 50 34 Z" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="2" />
          <path d="M 86 42 L 92 18 L 70 34 Z" fill={`url(#${furId})`} stroke="#b56b1f" strokeWidth="2" />
          <path d="M 35 36 L 32 24 L 44 33 Z" fill="#ffc9d6" opacity="0.8" />
          <path d="M 85 36 L 88 24 L 76 33 Z" fill="#ffc9d6" opacity="0.8" />

          {/* head + body */}
          <path
            d="M60 8 C 90 45, 108 70, 108 92 A 48 48 0 1 1 12 92 C 12 70, 30 45, 60 8 Z"
            fill={`url(#${furId})`}
            stroke="#b56b1f"
            strokeWidth="2"
            filter={`url(#${dropShadowId})`}
          />
          <path d="M 60 60 C 78 62, 88 78, 84 98 C 70 106, 50 106, 36 98 C 32 78, 42 62, 60 60 Z" fill={`url(#${bellyId})`} />

          {/* tabby stripes */}
          <path d="M 46 30 Q 50 22 56 20" stroke="#b56b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M 74 30 Q 70 22 64 20" stroke="#b56b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* whiskers */}
          <path d="M 30 82 L 12 78" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M 30 88 L 10 88" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M 90 82 L 108 78" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M 90 88 L 110 88" stroke="#7a4a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

          <ellipse cx="42" cy="90" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />
          <ellipse cx="78" cy="90" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />

          {pose === 'annoyed' ? (
            <>
              <path d="M 40 76 L 52 80" stroke="#3a2410" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 80 76 L 68 80" stroke="#3a2410" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 52 98 Q 60 92 68 98" stroke="#3a2410" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="48" cy="80" r="5" fill="#ffffff" />
              <circle cx="72" cy="80" r="5" fill="#ffffff" />
              <circle cx="49" cy="81" r="3.4" fill="#4caf50" />
              <circle cx="71" cy="81" r="3.4" fill="#4caf50" />
              <circle cx="49" cy="81" r="1.6" fill="#111" />
              <circle cx="71" cy="81" r="1.6" fill="#111" />
              <circle cx="47" cy="79" r="1" fill="#ffffff" />
              <circle cx="69" cy="79" r="1" fill="#ffffff" />
              <path d="M 58 92 L 62 92" stroke="#b56b1f" strokeWidth="2" strokeLinecap="round" />
              <path
                d={pose === 'happy' ? 'M 48 98 Q 60 108 72 98' : 'M 52 96 Q 60 100 68 96'}
                stroke="#3a2410"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
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
