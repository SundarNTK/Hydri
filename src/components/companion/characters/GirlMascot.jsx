import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Sparkles from '../Sparkles.jsx'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// Attachment points in SVG user-space (viewBox units) — used as GSAP's
// svgOrigin so limbs pivot from the correct joint regardless of how their
// bounding box grows (e.g. the rose hanging off the left hand).
const LEFT_LEG_ORIGIN = '56 130'
const RIGHT_LEG_ORIGIN = '76 130'
const LEFT_ARM_ORIGIN = '46 84'
const RIGHT_ARM_ORIGIN = '84 84'

export default function GirlMascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

  // Every gradient/filter id is scoped to this instance so multiple
  // GirlMascot previews (e.g. the character picker) can render at once
  // without colliding <defs> ids.
  const uid = useId()
  const skinId = `girl-skin-${uid}`
  const hairId = `girl-hair-${uid}`
  const hairSideId = `girl-hair-side-${uid}`
  const denimId = `girl-denim-${uid}`
  const shoeId = `girl-shoe-${uid}`
  const collarId = `girl-collar-${uid}`
  const shadowId = `girl-shadow-${uid}`
  const dropShadowId = `girl-dropshadow-${uid}`
  const irisId = `girl-iris-${uid}`
  const roseId = `girl-rose-${uid}`

  useEffect(() => {
    const ctx = gsap.context(() => {
      const limbs = [leftLegRef.current, rightLegRef.current, leftArmRef.current, rightArmRef.current]
      gsap.killTweensOf([...limbs, bodyRef.current, rootRef.current])

      if (pose === 'walking') {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.32, ease: 'sine.inOut' } })
        tl.to(leftLegRef.current, { rotate: 24, svgOrigin: LEFT_LEG_ORIGIN }, 0)
        tl.to(rightLegRef.current, { rotate: -24, svgOrigin: RIGHT_LEG_ORIGIN }, 0)
        tl.to(leftArmRef.current, { rotate: -18, svgOrigin: LEFT_ARM_ORIGIN }, 0)
        tl.to(rightArmRef.current, { rotate: 18, svgOrigin: RIGHT_ARM_ORIGIN }, 0)
        tl.to(bodyRef.current, { y: -4 }, 0)
      } else if (pose === 'happy') {
        gsap.set(limbs, { rotate: 0 })
        gsap.to(rootRef.current, { y: -16, duration: 0.28, yoyo: true, repeat: 5, ease: 'power1.out' })
        gsap.to(leftArmRef.current, { rotate: -155, svgOrigin: LEFT_ARM_ORIGIN, duration: 0.4, ease: 'back.out(2)' })
        gsap.to(rightArmRef.current, { rotate: 155, svgOrigin: RIGHT_ARM_ORIGIN, duration: 0.4, ease: 'back.out(2)' })
      } else if (pose === 'annoyed') {
        gsap.set(leftArmRef.current, { rotate: -105, svgOrigin: LEFT_ARM_ORIGIN })
        gsap.set(rightArmRef.current, { rotate: 105, svgOrigin: RIGHT_ARM_ORIGIN })
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
        gsap.to(bodyRef.current, { y: -3, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [pose])

  const sizePx = SIZE_MAP[size] ?? SIZE_MAP.medium
  const aspect = 185 / 130

  return (
    <div
      ref={rootRef}
      style={{ width: sizePx, height: sizePx * aspect, transform: facingLeft ? 'scaleX(-1)' : 'none' }}
      className="relative"
    >
      <svg viewBox="0 0 130 185" width="100%" height="100%">
        <defs>
          <radialGradient id={skinId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffefdb" />
            <stop offset="55%" stopColor="#ffe0c2" />
            <stop offset="100%" stopColor="#eab890" />
          </radialGradient>
          <linearGradient id={hairId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a5a3a" />
            <stop offset="45%" stopColor="#6b4226" />
            <stop offset="100%" stopColor="#432911" />
          </linearGradient>
          <linearGradient id={hairSideId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a4d31" />
            <stop offset="100%" stopColor="#4a2c15" />
          </linearGradient>
          <linearGradient id={denimId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d8cba" />
            <stop offset="55%" stopColor="#4a6fa5" />
            <stop offset="100%" stopColor="#33506e" />
          </linearGradient>
          <linearGradient id={shoeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0776c" />
            <stop offset="60%" stopColor="#e0473e" />
            <stop offset="100%" stopColor="#a02f28" />
          </linearGradient>
          <linearGradient id={collarId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e2e2" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1a22" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1a22" stopOpacity="0" />
          </radialGradient>
          <filter id={dropShadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" floodColor="#1a1008" floodOpacity="0.35" />
          </filter>
          <radialGradient id={irisId} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="60%" stopColor="#3aa1d6" />
            <stop offset="100%" stopColor="#1c6f9c" />
          </radialGradient>
          <radialGradient id={roseId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f28b8b" />
            <stop offset="55%" stopColor="#d63447" />
            <stop offset="100%" stopColor="#8f1f28" />
          </radialGradient>
        </defs>

        {/* ambient contact shadow beneath her feet */}
        <ellipse cx="65" cy="172" rx="34" ry="9" fill={`url(#${shadowId})`} />

        <g ref={leftLegRef}>
          <line x1="56" y1="130" x2="48" y2="160" stroke={`url(#${denimId})`} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="48" cy="158" rx="7" ry="4" fill="#7d97b8" />
          <ellipse cx="48" cy="164" rx="9" ry="5.5" fill={`url(#${shoeId})`} stroke="#a02f28" strokeWidth="1.2" />
        </g>
        <g ref={rightLegRef}>
          <line x1="76" y1="130" x2="84" y2="160" stroke={`url(#${denimId})`} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="84" cy="158" rx="7" ry="4" fill="#7d97b8" />
          <ellipse cx="84" cy="164" rx="9" ry="5.5" fill={`url(#${shoeId})`} stroke="#a02f28" strokeWidth="1.2" />
        </g>

        <g ref={bodyRef}>
          {/* long hair, drawn behind the head and shoulders */}
          <ellipse cx="65" cy="40" rx="34" ry="36" fill={`url(#${hairId})`} />
          <path
            d="M 38 42 C 20 60, 16 100, 24 150 C 30 156, 40 152, 36 142 C 30 105, 34 68, 46 46 Z"
            fill={`url(#${hairSideId})`}
            filter={`url(#${dropShadowId})`}
          />
          <path
            d="M 92 42 C 112 60, 118 105, 106 155 C 100 160, 90 156, 94 146 C 102 105, 96 68, 82 46 Z"
            fill={`url(#${hairSideId})`}
            filter={`url(#${dropShadowId})`}
          />
          {/* rim-light along the crown, catching the light from above */}
          <path
            d="M 40 32 Q 65 6 90 32"
            stroke="#c99a6f"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* neck */}
          <rect x="58" y="70" width="14" height="10" fill={`url(#${skinId})`} />

          {/* white collar peeking above the overalls bib */}
          <path
            d="M 50 76 Q 65 86 80 76 L 78 81 Q 65 90 52 81 Z"
            fill={`url(#${collarId})`}
            stroke="#c9c9c9"
            strokeWidth="1"
          />

          {/* denim overalls: bib + shorts, straps, pocket */}
          <path
            d="M 48 78 L 82 78 L 86 132 Q 65 142 44 132 Z"
            fill={`url(#${denimId})`}
            stroke="#2a4258"
            strokeWidth="2"
            filter={`url(#${dropShadowId})`}
          />
          {/* rim-light along the bib's top-left edge */}
          <path d="M 49 79 L 48 96" stroke="#a8c0e0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <rect x="50" y="66" width="7" height="14" fill={`url(#${denimId})`} stroke="#2a4258" strokeWidth="1.5" />
          <rect x="73" y="66" width="7" height="14" fill={`url(#${denimId})`} stroke="#2a4258" strokeWidth="1.5" />
          <rect x="57" y="98" width="16" height="13" rx="2" fill="none" stroke="#2a4258" strokeWidth="1.5" />

          {/* head */}
          <circle cx="65" cy="52" r="23" fill={`url(#${skinId})`} />
          {/* soft cheek sheen */}
          <ellipse cx="57" cy="45" rx="7" ry="5" fill="#ffffff" opacity="0.25" />

          <ellipse cx="48" cy="60" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />
          <ellipse cx="82" cy="60" rx="5" ry="3" fill="#ff9eb0" opacity="0.5" />

          {pose === 'annoyed' ? (
            <>
              <path d="M 50 42 L 60 46" stroke="#4a2f18" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 80 42 L 70 46" stroke="#4a2f18" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 55 68 Q 65 62 75 68" stroke="#7a3b3b" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 51 44 Q 57 40 63 44" stroke="#4a2f18" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 67 44 Q 73 40 79 44" stroke="#4a2f18" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* big anime eyes */}
              <ellipse cx="57" cy="53" rx="6.5" ry="8.5" fill="#ffffff" stroke="#d8c3ab" strokeWidth="0.5" />
              <ellipse cx="73" cy="53" rx="6.5" ry="8.5" fill="#ffffff" stroke="#d8c3ab" strokeWidth="0.5" />
              <circle cx="57" cy="55" r="5.2" fill={`url(#${irisId})`} />
              <circle cx="73" cy="55" r="5.2" fill={`url(#${irisId})`} />
              <circle cx="57" cy="55" r="2.6" fill="#1a2b3d" />
              <circle cx="73" cy="55" r="2.6" fill="#1a2b3d" />
              <circle cx="55" cy="52" r="1.5" fill="#ffffff" />
              <circle cx="71" cy="52" r="1.5" fill="#ffffff" />

              <path
                d={pose === 'happy' ? 'M 58 67 Q 65 74 72 67' : 'M 60 67 Q 65 71 70 67'}
                stroke="#7a3b3b"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* front hair lock draped over the shoulder */}
          <path
            d="M 82 55 C 90 70, 86 90, 92 110 C 94 115, 88 116, 86 111 C 80 92, 78 72, 76 58 Z"
            fill={`url(#${hairSideId})`}
            filter={`url(#${dropShadowId})`}
          />

          {/* rose hair clip */}
          <g transform="translate(84, 30)" filter={`url(#${dropShadowId})`}>
            <circle cx="0" cy="0" r="4.5" fill={`url(#${roseId})`} />
            <circle cx="4" cy="-2" r="4" fill={`url(#${roseId})`} />
            <circle cx="-3" cy="-3" r="3.5" fill={`url(#${roseId})`} />
            <circle cx="0" cy="-4" r="3" fill="#f0a0a0" opacity="0.8" />
            <path d="M -2 4 Q 4 8 8 4" stroke="#3f8f3f" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>

        <g ref={leftArmRef}>
          <line x1="46" y1="84" x2="28" y2="112" stroke={`url(#${collarId})`} strokeWidth="7" strokeLinecap="round" />
          <circle cx="28" cy="112" r="5" fill={`url(#${skinId})`} />
          {/* rose held in hand */}
          <g filter={`url(#${dropShadowId})`}>
            <line x1="26" y1="116" x2="18" y2="136" stroke="#3f8f3f" strokeWidth="2" strokeLinecap="round" />
            <path d="M 18 122 Q 12 126 16 132" stroke="#2e7d32" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="114" r="4.5" fill={`url(#${roseId})`} />
            <circle cx="19" cy="111" r="4" fill={`url(#${roseId})`} />
            <circle cx="12" cy="112" r="3.8" fill={`url(#${roseId})`} />
            <circle cx="16" cy="109" r="3.4" fill="#f0a0a0" opacity="0.8" />
          </g>
        </g>
        <g ref={rightArmRef}>
          <line x1="84" y1="84" x2="102" y2="112" stroke={`url(#${collarId})`} strokeWidth="7" strokeLinecap="round" />
          <circle cx="102" cy="112" r="5" fill={`url(#${skinId})`} />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
