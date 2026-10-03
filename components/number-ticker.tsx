'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Count-up number.
 *
 * The final value is what SSRs into the HTML, so a crawler (or a visitor with
 * JS disabled) reads "200+", not "0+". Previously state started at 0, which
 * meant the prerendered document shipped zeros and only client hydration
 * filled them in — Google indexed the zeros.
 *
 * The animation therefore only arms for counters that start *below* the fold:
 * if the element is already on screen at mount, rendering 0 and counting up
 * would be a visible flash from the correct number back to zero. Reduced
 * motion skips it entirely.
 *
 * Counts 0 → `value` once the element scrolls into view, using
 * requestAnimationFrame with an ease-out curve so it decelerates rather than
 * ticking linearly.
 */
export function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.6,
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  /** Seconds to reach the final value. */
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = usePrefersReducedMotion()
  // Tracks whether this counter has already run its count-up, so the effect is
  // idempotent across re-renders.
  const animatedRef = useRef(false)
  // Server-rendered and initial client render both show the real number; the
  // effect below swaps in the count-up only when it can do so unseen.
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (reduced || !inView) return

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      // easeOutExpo — fast start, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    // Only animate if this element was still below the fold on first paint;
    // otherwise the jump back to zero is visible. `animatedRef` is untouched by
    // later renders, so scrolling back up never re-triggers it either.
    if (!animatedRef.current) {
      animatedRef.current = true
      setDisplay(0)
      raf = requestAnimationFrame(tick)
    }

    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduced])

  const shown = reduced ? value : display
  const formatted = shown.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
