/**
 * A shared, more realistic walk cycle used by every companion character.
 *
 * Three layered motions instead of just a leg/arm swing:
 *   1. Contralateral leg/arm swing (opposite arm and leg move together,
 *      like a real gait).
 *   2. A vertical body bob at *double* the stride frequency -- a real
 *      walking gait bounces twice per full left-right cycle (once per
 *      footfall), not once.
 *   3. A subtle whole-character sway (weight shifting side to side).
 */
export function applyWalkCycle(gsap, refs, origins, options = {}) {
  const { leftLeg, rightLeg, leftArm, rightArm, body, root } = refs
  const strideDuration = options.strideDuration ?? 0.34
  const legSwing = options.legSwing ?? 22
  const armSwing = options.armSwing ?? 20
  const bobHeight = options.bobHeight ?? 3
  const sway = options.sway ?? 2.5

  const timeline = gsap.timeline({ repeat: -1 })

  timeline.to(
    leftLeg,
    { rotate: legSwing, svgOrigin: origins.leftLeg, duration: strideDuration, ease: 'sine.inOut', yoyo: true, repeat: 1 },
    0
  )
  timeline.to(
    rightLeg,
    { rotate: -legSwing, svgOrigin: origins.rightLeg, duration: strideDuration, ease: 'sine.inOut', yoyo: true, repeat: 1 },
    0
  )
  timeline.to(
    leftArm,
    { rotate: -armSwing, svgOrigin: origins.leftArm, duration: strideDuration, ease: 'sine.inOut', yoyo: true, repeat: 1 },
    0
  )
  timeline.to(
    rightArm,
    { rotate: armSwing, svgOrigin: origins.rightArm, duration: strideDuration, ease: 'sine.inOut', yoyo: true, repeat: 1 },
    0
  )

  if (body) {
    timeline.to(body, { y: -bobHeight, duration: strideDuration / 2, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0)
  }
  if (root) {
    timeline.to(
      root,
      { rotate: sway, transformOrigin: 'bottom center', duration: strideDuration, ease: 'sine.inOut', yoyo: true, repeat: 1 },
      0
    )
  }

  return timeline
}
