'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

/**
 * Magnetic button.
 *
 * The element eases toward the cursor while it's nearby, then springs back to
 * centre on leave. The translation is applied to the inner element while the
 * outer keeps its layout box, so the button never reflows its neighbours.
 *
 * Disables itself entirely under prefers-reduced-motion, and for coarse
 * pointers — a magnetic target is meaningless on touch and would only cause
 * the button to shift under a finger mid-tap.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  radius = 90,
}: {
  children: ReactNode
  className?: string
  /** 0..1 — how far toward the cursor the element travels. */
  strength?: number
  /** Distance (px) within which the element starts to respond. */
  radius?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  // Touch devices have no hover position, so the effect is pure noise there.
  const canHover = !reduced && typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(offsetX, offsetY)

    // Linear falloff to the edge of `radius`, then nothing — the pull shouldn't
    // snap on the moment the cursor crosses the threshold.
    if (distance > rect.width / 2 + radius) {
      x.set(0)
      y.set(0)
      return
    }
    const falloff = 1 - Math.min(distance / (rect.width / 2 + radius), 1)
    x.set(offsetX * strength * falloff)
    y.set(offsetY * strength * falloff)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={className}
      style={canHover ? { x: sx, y: sy } : undefined}
    >
      {children}
    </motion.div>
  )
}
