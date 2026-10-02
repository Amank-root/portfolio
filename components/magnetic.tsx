'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { useMediaQuery } from '@/hooks/use-media-query'

/**
 * Magnetic button.
 *
 * The element eases toward the cursor while it's nearby, then springs back to
 * centre on leave. Translation is applied to the inner element while the outer
 * keeps its layout box, so the button never reflows its neighbours.
 *
 * ## Hydration
 *
 * The `style` prop is ALWAYS applied, and hover capability is used only inside
 * the event handlers. An earlier version computed `canHover` during render and
 * did `style={canHover ? {x, y} : undefined}`. `typeof window` is false on the
 * server, so the server emitted no `style` at all while the client emitted
 * `style="transform: none"` — a hydration mismatch on every magnetic button,
 * which React cannot patch up.
 *
 * The springs rest at 0, so both sides now render an identical
 * `transform: none` and the initial paint is stable. Capability checks happen
 * in an effect and are read from state inside the handlers, where a render-time
 * difference is harmless.
 *
 * A magnetic target is meaningless on touch (it would shift the button under a
 * finger mid-tap) and under prefers-reduced-motion, so both disable it.
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
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  // `useMediaQuery` is built on useSyncExternalStore with an explicit `false`
  // server snapshot, so this reads `false` during SSR *and* on the first client
  // render — the hydration-safe path — then the real value lands in the
  // following commit. Deriving it in an effect instead would be the same
  // set-state-in-effect cascade the lint rule (rightly) warns about.
  const hoverCapable = useMediaQuery('(hover: hover)')
  const canHover = hoverCapable && !reduced

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(offsetX, offsetY)

    // Linear falloff out to `radius`, then nothing — the pull shouldn't snap on
    // the moment the cursor crosses the threshold.
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
      // Unconditional: the springs rest at 0 and emit `transform: none`, which
      // is what the server renders too. Never branch this on a browser check.
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.div>
  )
}
