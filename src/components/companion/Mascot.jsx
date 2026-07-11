import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// Attachment points in SVG user-space (viewBox units) — used as GSAP's
// svgOrigin so limbs pivot from the correct joint regardless of how their
// bounding box grows (e.g. the rose hanging off the left hand).
const LEFT_LEG_ORIGIN = '56 130'
const RIGHT_LEG_ORIGIN = '76 130'
const LEFT_ARM_ORIGIN = '46 84'
const RIGHT_ARM_ORIGIN = '84 84'

export default function Mascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

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
        <g ref={leftLegRef}>
          <line x1="56" y1="130" x2="48" y2="160" stroke="#4a6fa5" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="48" cy="158" rx="7" ry="4" fill="#7d97b8" />
          <ellipse cx="48" cy="164" rx="9" ry="5.5" fill="#e0473e" stroke="#a02f28" strokeWidth="1.2" />
        </g>
        <g ref={rightLegRef}>
          <line x1="76" y1="130" x2="84" y2="160" stroke="#4a6fa5" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="84" cy="158" rx="7" ry="4" fill="#7d97b8" />
          <ellipse cx="84" cy="164" rx="9" ry="5.5" fill="#e0473e" stroke="#a02f28" strokeWidth="1.2" />
        </g>

        <g ref={bodyRef}>
          {/* long hair, drawn behind the head and shoulders */}
          <ellipse cx="65" cy="40" rx="34" ry="36" fill="#5a3620" />
          <path
            d="M 38 42 C 20 60, 16 100, 24 150 C 30 156, 40 152, 36 142 C 30 105, 34 68, 46 46 Z"
            fill="#6b4226"
          />
          <path
            d="M 92 42 C 112 60, 118 105, 106 155 C 100 160, 90 156, 94 146 C 102 105, 96 68, 82 46 Z"
            fill="#6b4226"
          />

          {/* neck */}
          <rect x="58" y="70" width="14" height="10" fill="#ffe0c2" />

          {/* white collar peeking above the overalls bib */}
          <path d="M 50 76 Q 65 86 80 76 L 78 81 Q 65 90 52 81 Z" fill="#ffffff" stroke="#dcdcdc" strokeWidth="1" />

          {/* denim overalls: bib + shorts, straps, pocket */}
          <path
            d="M 48 78 L 82 78 L 86 132 Q 65 142 44 132 Z"
            fill="#4a6fa5"
            stroke="#33506e"
            strokeWidth="2"
          />
          <rect x="50" y="66" width="7" height="14" fill="#4a6fa5" stroke="#33506e" strokeWidth="1.5" />
          <rect x="73" y="66" width="7" height="14" fill="#4a6fa5" stroke="#33506e" strokeWidth="1.5" />
          <rect x="57" y="98" width="16" height="13" rx="2" fill="none" stroke="#33506e" strokeWidth="1.5" />

          {/* head */}
          <circle cx="65" cy="52" r="23" fill="#ffe0c2" />

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
              <circle cx="57" cy="55" r="5.2" fill="#3aa1d6" />
              <circle cx="73" cy="55" r="5.2" fill="#3aa1d6" />
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
            fill="#6b4226"
          />

          {/* rose hair clip */}
          <g transform="translate(84, 30)">
            <circle cx="0" cy="0" r="4.5" fill="#c1272d" />
            <circle cx="4" cy="-2" r="4" fill="#d63447" />
            <circle cx="-3" cy="-3" r="3.5" fill="#d63447" />
            <circle cx="0" cy="-4" r="3" fill="#e0555f" />
            <path d="M -2 4 Q 4 8 8 4" stroke="#3f8f3f" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>

        <g ref={leftArmRef}>
          <line x1="46" y1="84" x2="28" y2="112" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="28" cy="112" r="5" fill="#ffe0c2" />
          {/* rose held in hand */}
          <line x1="26" y1="116" x2="18" y2="136" stroke="#3f8f3f" strokeWidth="2" strokeLinecap="round" />
          <path d="M 18 122 Q 12 126 16 132" stroke="#2e7d32" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="114" r="4.5" fill="#c1272d" />
          <circle cx="19" cy="111" r="4" fill="#d63447" />
          <circle cx="12" cy="112" r="3.8" fill="#d63447" />
          <circle cx="16" cy="109" r="3.4" fill="#e0555f" />
        </g>
        <g ref={rightArmRef}>
          <line x1="84" y1="84" x2="102" y2="112" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="102" cy="112" r="5" fill="#ffe0c2" />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}

function Sparkles() {
  const items = [
    { left: '8%', top: '8%', delay: '0s', icon: '✨' },
    { left: '78%', top: '12%', delay: '0.15s', icon: '❤️' },
    { left: '82%', top: '55%', delay: '0.3s', icon: '✨' },
    { left: '4%', top: '52%', delay: '0.45s', icon: '❤️' }
  ]

  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((item) => (
        <span
          key={`${item.left}-${item.top}`}
          className="absolute animate-ping text-lg"
          style={{ left: item.left, top: item.top, animationDelay: item.delay, animationDuration: '1.1s' }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  )
}
