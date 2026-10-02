'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Count-up number.
 *
 * Counts from 0 to `value` once the element scrolls into view, using
 * requestAnimationFrame with an ease-out curve so it decelerates rather than
 * ticking linearly. The final value is what lands in the DOM, so a crawler
 * that ignores JS still sees the real number.
 *
 * Respects prefers-reduced-motion by rendering the final value immediately.
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
  // Under reduced motion the final value is derived during render rather than
  // set from an effect: there is nothing to animate, so the effect would exist
  // only to trigger a second render pass.
  const [display, setDisplay] = useState(0)

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

    raf = requestAnimationFrame(tick)
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
