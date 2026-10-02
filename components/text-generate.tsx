'use client'

import { motion, useInView } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Word-by-word text reveal.
 *
 * Each word animates independently from a blurred, low-opacity state into
 * focus. Splitting on spaces (not per-character) keeps the DOM to a handful of
 * nodes instead of hundreds, and — critically — each word is `inline-block` so
 * it can transform independently without the whole line reflowing.
 *
 * The full string is always present in the DOM for crawlers and for
 * prefers-reduced-motion, which renders it statically.
 *
 * ## Gradient text (`text-gradient`)
 *
 * `background-clip: text` clips a background to the element's OWN text. It does
 * not reach into descendants: the wrapper here holds the gradient while the
 * animated glyphs live in child spans, so the children inherit
 * `color: transparent` but never receive the gradient paint — the text renders
 * completely invisible.
 *
 * So the gradient class is forwarded to every word span rather than left on the
 * wrapper. Each word then gets its own gradient box. `background-position-x` is
 * shared across words so they read as one continuous sweep instead of each
 * restarting from the left; the position is set from the word's index.
 */
export function TextGenerate({
  words,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = 'span',
  gradient = false,
}: {
  words: string
  className?: string
  /** Seconds before the first word animates. */
  delay?: number
  /** Seconds between words. */
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'
  /**
   * Apply the gradient to the glyphs rather than the wrapper. Required
   * whenever `className` contains `text-gradient` — see the note above.
   */
  gradient?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduced = usePrefersReducedMotion()
  const list = words.split(' ')

  if (reduced) {
    // The gradient is safe here: there's a single text node, so the wrapper's
    // own background-clip reaches its glyphs.
    return <Tag className={className}>{words}</Tag>
  }

  return (
    <Tag ref={ref as never} className={cn('inline-block', gradient ? undefined : className)}>
      {list.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={cn('inline-block will-change-transform', gradient && 'text-gradient')}
            style={
              gradient
                ? ({
                    // Spread the sweep across words so they read as one line.
                    backgroundPositionX: `${(i / Math.max(list.length - 1, 1)) * 100}%`,
                  } as React.CSSProperties)
                : undefined
            }
            initial={{ opacity: 0, y: '0.5em', filter: 'blur(6px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {/* Non-breaking space keeps the inline-block gaps from collapsing
                when a word animates to opacity 0. */}
            {i < list.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Same reveal, but for a line of body copy with a longer stagger. */
export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = usePrefersReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
