'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Infinite horizontal marquee.
 *
 * The track is rendered twice and translated by exactly -50%, so at the loop
 * point the second copy is already where the first one started — a single copy
 * would visibly jump at the seam.
 *
 * Duration is *measured*, not passed in. The animation always travels
 * half the track width, so a fixed duration makes the speed depend on how many
 * items the CMS returned: with the fallback skill list the track measured
 * ~19,600px, which at a hardcoded 44s scrolled ~222px/s — fast enough to be
 * unreadable. Deriving duration from the measured width keeps the speed
 * constant no matter how much content there is.
 *
 * Pauses on hover, and disables itself under prefers-reduced-motion (content
 * still renders, just statically and wrapped).
 */

/** Target pixels per second. ~40px/s reads as a slow drift, not a ticker. */
const PX_PER_SECOND = 40

export function Marquee({
  children,
  minDuration = 24,
  className,
}: {
  children: ReactNode
  /** Floor for the computed duration, so a short track doesn't crawl. */
  minDuration?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState<number | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      // The animation travels 50% of the (doubled) track, so the distance per
      // cycle is half the scrollWidth.
      const distance = track.scrollWidth / 2
      if (distance > 0) {
        setDuration(Math.max(minDuration, Math.round(distance / PX_PER_SECOND)))
      }
    }

    measure()
    // Web fonts land after first paint and change item widths, which changes
    // the track width — so re-measure once the fonts are ready.
    document.fonts?.ready.then(measure).catch(() => {})
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [minDuration, children])

  if (reduced) {
    return <div className={cn('flex flex-wrap gap-x-8 gap-y-2', className)}>{children}</div>
  }

  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      {/* Edge fades so items enter and leave rather than being chopped. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent"
      />

      <div
        ref={trackRef}
        className="animate-marquee flex w-max shrink-0 items-center group-hover:[animation-play-state:paused]"
        // Until the first measurement lands, fall back to the minimum so the
        // track never starts at an absurd speed and then lurches.
        style={{ '--marquee-duration': `${duration ?? minDuration}s` } as React.CSSProperties}
      >
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  )
}
