import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Sparkles from '../Sparkles.jsx'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// Attachment points in SVG user-space (viewBox units) — see GirlMascot.jsx
// for why svgOrigin is used instead of bbox-relative transformOrigin.
const LEFT_LEG_ORIGIN = '52 112'
const RIGHT_LEG_ORIGIN = '68 112'
const LEFT_ARM_ORIGIN = '30 88'
const RIGHT_ARM_ORIGIN = '90 88'

export default function WaterDropMascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

  const uid = useId()
  const dropId = `drop-body-${uid}`
  const shadowId = `drop-shadow-${uid}`
  const dropShadowFilterId = `drop-dropshadow-${uid}`

  useEffect(() => {
    const ctx = gsap.context(() => {
      const limbs = [leftLegRef.current, rightLegRef.current, leftArmRef.current, rightArmRef.current]
      gsap.killTweensOf([...limbs, bodyRef.current, rootRef.current])

      if (pose === 'walking') {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.32, ease: 'sine.inOut' } })
        tl.to(leftLegRef.current, { rotate: 22, svgOrigin: LEFT_LEG_ORIGIN }, 0)
        tl.to(rightLegRef.current, { rotate: -22, svgOrigin: RIGHT_LEG_ORIGIN }, 0)
        tl.to(leftArmRef.current, { rotate: -18, svgOrigin: LEFT_ARM_ORIGIN }, 0)
        tl.to(rightArmRef.current, { rotate: 18, svgOrigin: RIGHT_ARM_ORIGIN }, 0)
        tl.to(bodyRef.current, { y: -4 }, 0)
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
          <linearGradient id={dropId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#3aa1d6" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1a22" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1a22" stopOpacity="0" />
          </radialGradient>
          <filter id={dropShadowFilterId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1.2" dy="2" stdDeviation="1.5" floodColor="#12333f" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ambient contact shadow */}
        <ellipse cx="60" cy="145" rx="30" ry="7" fill={`url(#${shadowId})`} />

        <g ref={leftLegRef}>
          <line x1="52" y1="112" x2="46" y2="142" stroke="#1c6f9c" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g ref={rightLegRef}>
          <line x1="68" y1="112" x2="74" y2="142" stroke="#1c6f9c" strokeWidth="7" strokeLinecap="round" />
        </g>

        <g ref={bodyRef}>
          <path
            d="M60 8 C 90 45, 108 70, 108 92 A 48 48 0 1 1 12 92 C 12 70, 30 45, 60 8 Z"
            fill={`url(#${dropId})`}
            stroke="#1c6f9c"
            strokeWidth="2"
          />
          {/* rim-light catching the light along the upper-left curve */}
          <path
            d="M 40 24 C 26 42, 18 62, 16 80"
            stroke="#d7f2ff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M78 78 C 92 74, 104 84, 100 98 C 88 100, 76 92, 78 78 Z"
            fill="#4caf50"
            stroke="#2e7d32"
            strokeWidth="2"
            filter={`url(#${dropShadowFilterId})`}
          />
          <circle cx="34" cy="90" r="6" fill="#ffffff" opacity="0.55" />

          {pose === 'annoyed' ? (
            <>
              <path d="M40 78 L52 82" stroke="#0d2b33" strokeWidth="4" strokeLinecap="round" />
              <path d="M80 78 L68 82" stroke="#0d2b33" strokeWidth="4" strokeLinecap="round" />
              <path d="M46 100 Q60 92 74 100" stroke="#0d2b33" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="46" cy="82" r="4.5" fill="#0d2b33" />
              <circle cx="74" cy="82" r="4.5" fill="#0d2b33" />
              <path
                d={pose === 'happy' ? 'M44 98 Q60 114 76 98' : 'M46 98 Q60 108 74 98'}
                stroke="#0d2b33"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
        </g>

        <g ref={leftArmRef}>
          <line x1="30" y1="88" x2="14" y2="108" stroke="#1c6f9c" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g ref={rightArmRef}>
          <line x1="90" y1="88" x2="106" y2="108" stroke="#1c6f9c" strokeWidth="7" strokeLinecap="round" />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
