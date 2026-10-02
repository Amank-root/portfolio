'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Download } from 'lucide-react'
import { Magnetic } from '@/components/magnetic'
import { TextGenerate } from '@/components/text-generate'
import { siteConfig } from '@/lib/site'

const ROLES = ['Full Stack Developer', 'AI/ML Engineer', 'Interface Craftsman']

interface HeroSectionProps {
  about: {
    resumeFile?: { asset?: { url?: string } }
    profileImage?: { asset?: { url?: string }; alt?: string }
  } | null
}

/**
 * Rotating role line. Each word runs its own 9s opacity/blur cycle offset by
 * 3s, so exactly one is legible at a time and the sequence never restarts from
 * a blank line. Fixed height + overflow-hidden means the swap can't reflow the
 * paragraph beneath it.
 */
function RoleSwap() {
  const reduced = useReducedMotion()

  if (reduced) return <span>{ROLES[0]}</span>

  return (
    <span className="relative inline-flex h-7 items-center overflow-hidden align-bottom">
      {ROLES.map((role, i) => (
        <motion.span
          key={role}
          className="absolute left-0 whitespace-nowrap"
          initial={false}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [12, 0, 0, -12],
            filter: ['blur(5px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
          }}
          transition={{
            duration: 9,
            times: [0, 0.12, 0.78, 1],
            delay: i * 3,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          {role}
        </motion.span>
      ))}
    </span>
  )
}

export function HeroSection({ about }: HeroSectionProps) {
  const reduced = useReducedMotion()
  const resumeUrl = about?.resumeFile?.asset?.url

  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Perspective grid, masked to a soft ellipse so it fades out before it
          reaches the edges. Decorative, never interactive. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-x-[-25%] top-[-15%] h-[130%] opacity-[0.10] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000,transparent_78%)]"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--primary) / 0.55) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.55) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            transform: 'perspective(1000px) rotateX(58deg)',
            transformOrigin: 'top center',
          }}
        />
      </div>

      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          {/* Copy */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/40 py-1.5 pr-4 pl-2.5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span className="font-mono text-xs tracking-wide text-foreground-muted">Available for work</span>
            </motion.div>

            <h1 className="mt-8 font-display text-display">
              <TextGenerate words="Building for the" className="block" stagger={0.07} delay={0.1} />
              <TextGenerate words="modern web." className="text-gradient block" stagger={0.07} delay={0.34} />
            </h1>

            <div className="mt-7 flex items-center gap-3 font-mono text-sm tracking-wide text-foreground-muted">
              <span className="text-primary" aria-hidden>
                ▸
              </span>
              <RoleSwap />
              {/* One announcement for screen readers, rather than a new one
                  every time the visible word changes. */}
              <span className="sr-only">{ROLES.join(', ')}</span>
            </div>

            <motion.p
              className="mt-7 max-w-xl text-lede text-foreground-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              I&apos;m {siteConfig.name}. I design and build fast, accessible web products — and the machine learning
              systems that power them.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <Magnetic>
                <Link
                  href="/projects"
                  className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
                >
                  {/* Sheen sweeping across on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,hsl(var(--primary-foreground)/0.3),transparent)] transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="relative">See the work</span>
                  <ArrowRight
                    size={17}
                    className="relative transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Link
                  href="/contact"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-border-strong bg-card/40 px-7 text-[0.95rem] font-medium backdrop-blur-sm transition-colors duration-300 hover:border-primary/50 hover:bg-card/70"
                >
                  Let&apos;s talk
                  <span className="text-primary transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                </Link>
              </Magnetic>

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-2 text-sm text-foreground-subtle transition-colors hover:text-foreground"
                >
                  <Download size={15} aria-hidden />
                  Résumé
                </a>
              )}
            </motion.div>
          </div>

          {/* Portrait in a floating glass frame, with an orbiting dashed ring
              and two stat chips. */}
          <motion.div
            className="relative mx-auto w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-none absolute -inset-5" aria-hidden>
              <svg className="animate-spin-slow h-full w-full" viewBox="0 0 100 100" fill="none">
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  stroke="hsl(var(--primary) / 0.4)"
                  strokeWidth="0.35"
                  strokeDasharray="2 5"
                />
              </svg>
            </div>

            <div className={reduced ? 'relative' : 'animate-float relative'}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card">
                <Image
                  src="/aman-pic.jpg"
                  alt={`${siteConfig.name}, ${siteConfig.role}`}
                  fill
                  sizes="(max-width: 1024px) 384px, 30vw"
                  className="object-cover"
                  priority
                />
                {/* Scrim so the caption stays legible over any photo. */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background/80 via-background/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                  <div>
                    <p className="font-display text-sm">{siteConfig.name}</p>
                    <p className="font-mono text-[0.6875rem] text-foreground-subtle">{siteConfig.location.city}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[0.625rem] tracking-wider text-foreground-muted backdrop-blur-sm">
                    <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    OPEN
                  </span>
                </div>
              </div>
            </div>

            {/* The chips overlap the portrait by design, but on a 390px
                viewport the second one would hang off the right edge — so
                they're desktop/tablet only. */}
            <motion.div
              className="glass absolute -top-3 -left-3 hidden rounded-2xl px-4 py-3 sm:block"
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[0.625rem] tracking-wider text-foreground-subtle uppercase">
                Projects shipped
              </p>
              <p className="font-display text-2xl">
                10<span className="text-primary">+</span>
              </p>
            </motion.div>

            <motion.div
              className="glass absolute -right-3 bottom-20 hidden rounded-2xl px-4 py-3 sm:block"
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[0.625rem] tracking-wider text-foreground-subtle uppercase">
                Commits this year
              </p>
              <p className="font-display text-2xl">
                200<span className="text-primary">+</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
