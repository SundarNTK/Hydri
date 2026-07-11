import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

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
        tl.to(leftLegRef.current, { rotate: 24, transformOrigin: 'top center' }, 0)
        tl.to(rightLegRef.current, { rotate: -24, transformOrigin: 'top center' }, 0)
        tl.to(leftArmRef.current, { rotate: -18, transformOrigin: 'top center' }, 0)
        tl.to(rightArmRef.current, { rotate: 18, transformOrigin: 'top center' }, 0)
        tl.to(bodyRef.current, { y: -4 }, 0)
      } else if (pose === 'happy') {
        gsap.set(limbs, { rotate: 0, transformOrigin: 'top center' })
        gsap.to(rootRef.current, { y: -16, duration: 0.28, yoyo: true, repeat: 5, ease: 'power1.out' })
        gsap.to(leftArmRef.current, { rotate: -155, transformOrigin: 'top center', duration: 0.4, ease: 'back.out(2)' })
        gsap.to(rightArmRef.current, { rotate: 155, transformOrigin: 'top center', duration: 0.4, ease: 'back.out(2)' })
      } else if (pose === 'annoyed') {
        gsap.set(leftArmRef.current, { rotate: -105, transformOrigin: 'top center' })
        gsap.set(rightArmRef.current, { rotate: 105, transformOrigin: 'top center' })
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
        gsap.set(limbs, { rotate: 0, transformOrigin: 'top center' })
        gsap.to(bodyRef.current, { y: -3, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [pose])

  const sizePx = SIZE_MAP[size] ?? SIZE_MAP.medium
  const aspect = 170 / 120

  return (
    <div
      ref={rootRef}
      style={{ width: sizePx, height: sizePx * aspect, transform: facingLeft ? 'scaleX(-1)' : 'none' }}
      className="relative"
    >
      <svg viewBox="0 0 120 170" width="100%" height="100%">
        <defs>
          <linearGradient id="hydriDressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#3aa1d6" />
          </linearGradient>
        </defs>

        <g ref={leftLegRef}>
          <line x1="52" y1="128" x2="46" y2="158" stroke="#1c6f9c" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="46" cy="161" rx="8" ry="5" fill="#ffffff" stroke="#1c6f9c" strokeWidth="1.5" />
        </g>
        <g ref={rightLegRef}>
          <line x1="68" y1="128" x2="74" y2="158" stroke="#1c6f9c" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="74" cy="161" rx="8" ry="5" fill="#ffffff" stroke="#1c6f9c" strokeWidth="1.5" />
        </g>

        <g ref={bodyRef}>
          {/* twin-tail hair, drawn behind the head */}
          <ellipse cx="26" cy="58" rx="13" ry="18" fill="#274b5e" />
          <ellipse cx="94" cy="58" rx="13" ry="18" fill="#274b5e" />

          {/* dress */}
          <path
            d="M 40 76 L 80 76 L 92 130 Q 60 141 28 130 Z"
            fill="url(#hydriDressGradient)"
            stroke="#1c6f9c"
            strokeWidth="2"
          />
          <circle cx="40" cy="80" r="7" fill="#3aa1d6" stroke="#1c6f9c" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="7" fill="#3aa1d6" stroke="#1c6f9c" strokeWidth="1.5" />

          {/* neck */}
          <rect x="53" y="62" width="14" height="12" fill="#ffdfc0" />

          {/* hair cap peeking around the face, then the face itself on top */}
          <circle cx="60" cy="36" r="29" fill="#274b5e" />
          <circle cx="60" cy="44" r="24" fill="#ffdfc0" stroke="#1c6f9c" strokeWidth="1" />

          <circle cx="45" cy="50" r="4" fill="#ff9eb0" opacity="0.55" />
          <circle cx="75" cy="50" r="4" fill="#ff9eb0" opacity="0.55" />

          {pose === 'annoyed' ? (
            <>
              <path d="M 40 42 L 50 46" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" />
              <path d="M 80 42 L 70 46" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" />
              <path d="M 50 60 Q 60 54 70 60" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="52" cy="44" r="3.2" fill="#2b2b2b" />
              <circle cx="68" cy="44" r="3.2" fill="#2b2b2b" />
              <path
                d={pose === 'happy' ? 'M 48 58 Q 60 70 72 58' : 'M 50 58 Q 60 65 70 58'}
                stroke="#2b2b2b"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* leaf hair clip — ties back to the Hydri logo */}
          <path
            d="M 84 34 C 94 30, 102 38, 98 48 C 88 50, 80 44, 84 34 Z"
            fill="#4caf50"
            stroke="#2e7d32"
            strokeWidth="1.5"
          />
        </g>

        <g ref={leftArmRef}>
          <line x1="40" y1="82" x2="24" y2="108" stroke="#ffdfc0" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g ref={rightArmRef}>
          <line x1="80" y1="82" x2="96" y2="108" stroke="#ffdfc0" strokeWidth="7" strokeLinecap="round" />
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
