'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Spotlight card.
 *
 * A radial highlight that tracks the pointer. The highlight is written as two
 * CSS custom properties on the element and consumed by a ::before pseudo-element,
 * which means:
 *  - no React re-render on mouse move (the values go straight to the DOM), and
 *  - the effect is composited on the GPU rather than triggering paint on the
 *    card's own subtree.
 *
 * The glow fades in on enter and out on leave so it never feels glued to the
 * cursor. Keyboard users get a border highlight via :focus-within.
 */
export function SpotlightCard({
  children,
  className,
  glowColor = 'var(--aurora-violet)',
}: {
  children: ReactNode
  className?: string
  /** Any CSS colour. Defaults to the site's violet aurora token. */
  glowColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // x/y are -1..1, centred on the element. Mouse-normalised rather than pixel
  // offsets so the gradient maths is resolution-independent.
  const x = useMotionValue(-0.6)
  const y = useMotionValue(-0.6)
  const [active, setActive] = useState(false)
  const [opacity, setOpacity] = useState(0)

  // x/y are normalised to -1..1, so they're mapped into percentage offsets here
  // (0%..100%) rather than at the call site — that's the part MotionValue
  // arithmetic can't do inline in a template string.
  const backgroundCss = useMotionTemplate`radial-gradient(320px circle at calc(50% + ${x} * 50%) calc(50% + ${y} * 50%), ${glowColor}, transparent 72%)`

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
    y.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => {
        setActive(true)
        setOpacity(0.16)
      }}
      onPointerLeave={() => {
        setActive(false)
        setOpacity(0)
      }}
      className={cn(
        'group relative isolate overflow-hidden rounded-2xl border border-border bg-card/55 p-6 transition-colors duration-500 hover:border-primary/40',
        className
      )}
    >
      {/* The spotlight layer. `active` is read here only to avoid painting a
          permanent radial gradient on every card at rest. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{ background: backgroundCss, opacity: reduced ? 0 : active ? opacity : 0 }}
      />
      {children}
    </div>
  )
}
