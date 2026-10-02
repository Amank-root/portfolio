'use client'

import type React from 'react'
import { cn } from '@/lib/utils'

/**
 * Animated gradient border.
 *
 * A conic gradient rotates behind an opaque inner surface, so what you see is
 * a 1px ring of travelling colour. Implemented with a padding-box/border-box
 * double background rather than a rotated pseudo-element: the border thickness
 * stays exactly constant, so nothing reflows, and it works on any radius.
 *
 * `--angle` is a registered custom property (see globals.css), which is what
 * lets the browser interpolate it. Animating `rotate` on a pseudo-element would
 * also work but thickens/corners the ring as it turns.
 */
export function AnimatedBorder({
  children,
  className,
  containerClassName,
  duration = 6,
}: {
  children: React.ReactNode
  /** Applied to the inner (opaque) surface. */
  className?: string
  /** Applied to the outer gradient shell. */
  containerClassName?: string
  /** Seconds per revolution. */
  duration?: number
}) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-2xl p-px',
        'bg-[conic-gradient(from_var(--angle),hsl(var(--aurora-coral)),hsl(var(--aurora-violet)),hsl(var(--aurora-cyan)),hsl(var(--aurora-coral)))]',
        'animate-border',
        containerClassName
      )}
      style={{ animationDuration: `${duration}s` }}
    >
      {/* `bg-card`, not `bg-background`: the inner surface has to sit a step
          lighter than the page or the panel reads as a black void in dark
          mode. That was the real cause of the stats band looking "all black",
          not the palette itself. */}
      <div className={cn('relative isolate overflow-hidden rounded-[calc(2rem-1px)] bg-card', className)}>
        {children}
      </div>
    </div>
  )
}
