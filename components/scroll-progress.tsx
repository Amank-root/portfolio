'use client'

import { motion, useScroll, useSpring } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

/**
 * Scroll progress bar.
 *
 * `useScroll` reports raw scroll progress, which updates on every frame the
 * page moves. Passing it straight into a style would jitter, so it's smoothed
 * through a spring first — the bar glides to the cursor position instead of
 * snapping to it.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = usePrefersReducedMotion()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[linear-gradient(90deg,hsl(var(--aurora-cyan)),hsl(var(--aurora-violet)),hsl(var(--aurora-coral)))]"
      style={{ scaleX }}
    />
  )
}
