'use client'

import type React from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Section shell with a scroll-triggered entrance.
 *
 * The one place the site defines "how content arrives": fade + 20px rise over
 * 0.7s on an ease-out-expo curve, triggered once at ~12% visibility. Every
 * section reuses it, so the page has a single motion rhythm instead of each
 * page inventing its own timings.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  /** Travel distance in px. */
  y?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'ul' | 'header'
}) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Section header. The eyebrow is a mono micro-label preceded by a short
 * gradient rule — the recurring "chapter" marker for the site. An optional
 * action sits on the same row as the label, so "view all" links line up with
 * the rule rather than floating.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('mb-12', className)}>
      {eyebrow && (
        <div className={cn('mb-5 flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span
            aria-hidden
            className="h-px w-8 bg-[linear-gradient(90deg,hsl(var(--aurora-coral)),hsl(var(--aurora-violet)))]"
          />
          <span className="eyebrow">{eyebrow}</span>
          {action && <span className="ml-auto">{action}</span>}
        </div>
      )}
      <h2 className={cn('max-w-3xl font-display text-section', align === 'center' && 'mx-auto text-center')}>
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted',
            align === 'center' && 'mx-auto text-center'
          )}
        >
          {lede}
        </p>
      )}
    </div>
  )
}

/** Page-level header shared by every route, so they all open identically. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="pt-16 pb-14 sm:pt-24">
      <Reveal>
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-8 bg-[linear-gradient(90deg,hsl(var(--aurora-coral)),hsl(var(--aurora-violet)))]"
          />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h1 className="max-w-3xl font-display text-page">{title}</h1>
      </Reveal>

      {lede && (
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lede text-foreground-muted">{lede}</p>
        </Reveal>
      )}

      {children && (
        <Reveal delay={0.24}>
          <div className="mt-10">{children}</div>
        </Reveal>
      )}
    </header>
  )
}
