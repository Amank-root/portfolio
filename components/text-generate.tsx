'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
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
 */
export function TextGenerate({
  words,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = 'span',
}: {
  words: string
  className?: string
  /** Seconds before the first word animates. */
  delay?: number
  /** Seconds between words. */
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div'
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduced = useReducedMotion()
  const list = words.split(' ')

  if (reduced) {
    return <Tag className={className}>{words}</Tag>
  }

  return (
    <Tag ref={ref as never} className={cn('inline-block', className)}>
      {list.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
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
  const reduced = useReducedMotion()

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
