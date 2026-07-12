import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Sparkles from '../Sparkles.jsx'
import { applyWalkCycle } from '../walkCycle.js'

const SIZE_MAP = { small: 90, medium: 130, large: 180 }

// Same rig proportions as GirlMascot.jsx so both share one mental model for
// how the pivots line up with the walk/pose choreography.
const LEFT_LEG_ORIGIN = '56 128'
const RIGHT_LEG_ORIGIN = '76 128'
const LEFT_ARM_ORIGIN = '46 80'
const RIGHT_ARM_ORIGIN = '84 80'

export default function BoyMascot({ pose = 'idle', size = 'medium', facingLeft = false }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)

  const uid = useId()
  const skinId = `boy-skin-${uid}`
  const hairId = `boy-hair-${uid}`
  const shirtId = `boy-shirt-${uid}`
  const shortsId = `boy-shorts-${uid}`
  const shoeId = `boy-shoe-${uid}`
  const shadowId = `boy-shadow-${uid}`
  const dropShadowId = `boy-dropshadow-${uid}`
  const irisId = `boy-iris-${uid}`
  const bottleId = `boy-bottle-${uid}`

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
        gsap.to(rootRef.current, { y: -16, duration: 0.26, yoyo: true, repeat: 5, ease: 'power1.out' })
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
  const aspect = 180 / 130
  const showCuteEyes = pose !== 'annoyed'

  return (
    <div
      ref={rootRef}
      style={{ width: sizePx, height: sizePx * aspect, transform: facingLeft ? 'scaleX(-1)' : 'none' }}
      className="relative"
    >
      <svg viewBox="0 0 130 180" width="100%" height="100%">
        <defs>
          <radialGradient id={skinId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffefdb" />
            <stop offset="55%" stopColor="#ffe0c2" />
            <stop offset="100%" stopColor="#eab890" />
          </radialGradient>
          <linearGradient id={hairId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3527" />
            <stop offset="100%" stopColor="#2b1d13" />
          </linearGradient>
          <linearGradient id={shirtId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="60%" stopColor="#3aa1d6" />
            <stop offset="100%" stopColor="#1c6f9c" />
          </linearGradient>
          <linearGradient id={shortsId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a9a6b" />
            <stop offset="100%" stopColor="#5f6e46" />
          </linearGradient>
          <linearGradient id={shoeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d5dbe3" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1a22" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1a22" stopOpacity="0" />
          </radialGradient>
          <filter id={dropShadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" floodColor="#1a1008" floodOpacity="0.35" />
          </filter>
          <radialGradient id={irisId} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a3e8b0" />
            <stop offset="60%" stopColor="#4caf50" />
            <stop offset="100%" stopColor="#2e7d32" />
          </radialGradient>
          <linearGradient id={bottleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#bfe6fb" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>

        <ellipse cx="65" cy="168" rx="32" ry="8.5" fill={`url(#${shadowId})`} />

        <g ref={leftLegRef}>
          <line x1="56" y1="128" x2="50" y2="156" stroke={`url(#${skinId})`} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="50" cy="153" rx="6.5" ry="3.5" fill="#ffffff" />
          <ellipse cx="50" cy="160" rx="9" ry="5" fill={`url(#${shoeId})`} stroke="#2a4258" strokeWidth="1.2" />
          <path d="M 44 160 Q 50 164 56 160" stroke="#3aa1d6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
        <g ref={rightLegRef}>
          <line x1="76" y1="128" x2="82" y2="156" stroke={`url(#${skinId})`} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="82" cy="153" rx="6.5" ry="3.5" fill="#ffffff" />
          <ellipse cx="82" cy="160" rx="9" ry="5" fill={`url(#${shoeId})`} stroke="#2a4258" strokeWidth="1.2" />
          <path d="M 76 160 Q 82 164 88 160" stroke="#3aa1d6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        <g ref={bodyRef}>
          {/* shorts, with a stitched hem */}
          <path
            d="M 46 108 L 86 108 L 88 130 Q 65 138 44 130 Z"
            fill={`url(#${shortsId})`}
            stroke="#3f4a2e"
            strokeWidth="2"
          />
          <path
            d="M 46 108 L 86 108"
            stroke="#3f4a2e"
            strokeWidth="1"
            strokeDasharray="2.5,2"
            opacity="0.7"
          />
          {/* hoodie / t-shirt with a couple of soft fabric folds */}
          <path
            d="M 46 76 L 86 76 L 90 112 Q 65 120 42 112 Z"
            fill={`url(#${shirtId})`}
            stroke="#1c6f9c"
            strokeWidth="2"
            filter={`url(#${dropShadowId})`}
          />
          <path d="M 47 78 L 46 96" stroke="#bfe6fb" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 58 82 Q 60 96 57 108" stroke="#1c6f9c" strokeWidth="1.4" fill="none" opacity="0.35" />
          <path d="M 74 82 Q 72 96 75 108" stroke="#1c6f9c" strokeWidth="1.4" fill="none" opacity="0.35" />

          {/* neck */}
          <rect x="58" y="68" width="14" height="10" fill={`url(#${skinId})`} />

          {/* rounded ears, behind the head so only the outer curve peeks out */}
          <ellipse cx="40" cy="52" rx="4.5" ry="6.5" fill={`url(#${skinId})`} />
          <ellipse cx="90" cy="52" rx="4.5" ry="6.5" fill={`url(#${skinId})`} />

          {/* head */}
          <circle cx="65" cy="50" r="24" fill={`url(#${skinId})`} />
          <ellipse cx="56" cy="43" rx="7" ry="5" fill="#ffffff" opacity="0.25" />

          {/* short hair — a simple cap shape, no long locks */}
          <path
            d="M 38 46 C 34 20, 96 20, 92 46 C 92 34, 84 24, 65 24 C 46 24, 38 34, 38 46 Z"
            fill={`url(#${hairId})`}
            filter={`url(#${dropShadowId})`}
          />
          <path d="M 60 22 Q 65 14 70 22" stroke={`url(#${hairId})`} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 45 28 Q 55 20 64 20" stroke="#6b4f3a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

          <path d="M 63 59 Q 65 62 66 59" stroke="#dba171" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <ellipse cx="47" cy="58" rx="5" ry="3" fill="#ff9eb0" opacity="0.45" />
          <ellipse cx="83" cy="58" rx="5" ry="3" fill="#ff9eb0" opacity="0.45" />

          {!showCuteEyes ? (
            <>
              <path d="M 50 42 L 60 46" stroke="#2b1d13" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 80 42 L 70 46" stroke="#2b1d13" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 55 66 Q 65 60 75 66" stroke="#7a3b3b" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 51 43 Q 57 39 63 43" stroke="#2b1d13" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 67 43 Q 73 39 79 43" stroke="#2b1d13" strokeWidth="2" fill="none" strokeLinecap="round" />

              <circle cx="57" cy="51" r="5.6" fill="#ffffff" stroke="#d8c3ab" strokeWidth="0.5" />
              <circle cx="73" cy="51" r="5.6" fill="#ffffff" stroke="#d8c3ab" strokeWidth="0.5" />
              <circle cx="57" cy="52" r="4.4" fill={`url(#${irisId})`} />
              <circle cx="73" cy="52" r="4.4" fill={`url(#${irisId})`} />
              <circle cx="57" cy="52" r="2.2" fill="#1a2b3d" />
              <circle cx="73" cy="52" r="2.2" fill="#1a2b3d" />
              <circle cx="55.5" cy="50" r="1.3" fill="#ffffff" />
              <circle cx="71.5" cy="50" r="1.3" fill="#ffffff" />

              <path
                d={pose === 'happy' ? 'M 57 65 Q 65 72 73 65' : 'M 59 65 Q 65 69 71 65'}
                stroke="#7a3b3b"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
        </g>

        <g ref={leftArmRef}>
          <line x1="46" y1="80" x2="28" y2="106" stroke={`url(#${shirtId})`} strokeWidth="7" strokeLinecap="round" />
          <circle cx="28" cy="106" r="5" fill={`url(#${skinId})`} />
          {/* fingers gripping the bottle */}
          <path d="M 25 104 L 22 108" stroke="#eab890" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M 28 106 L 25 110" stroke="#eab890" strokeWidth="1.3" strokeLinecap="round" />
          {/* modern reusable water bottle: gradient body, cap, and a highlight for a slight glassy/transparent feel */}
          <g filter={`url(#${dropShadowId})`}>
            <rect x="19" y="106" width="11" height="21" rx="3.5" fill={`url(#${bottleId})`} stroke="#1c6f9c" strokeWidth="1.2" opacity="0.92" />
            <rect x="22" y="101" width="5" height="6" rx="1.2" fill="#3aa1d6" stroke="#1c6f9c" strokeWidth="1" />
            <rect x="21" y="109" width="2.2" height="15" rx="1.1" fill="#ffffff" opacity="0.45" />
          </g>
        </g>
        <g ref={rightArmRef}>
          <line x1="84" y1="80" x2="102" y2="106" stroke={`url(#${shirtId})`} strokeWidth="7" strokeLinecap="round" />
          <circle cx="102" cy="106" r="5" fill={`url(#${skinId})`} />
        </g>
      </svg>

      {pose === 'happy' && <Sparkles />}
    </div>
  )
}
