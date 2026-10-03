'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { ArrowRight, Download } from 'lucide-react'
import { Magnetic } from '@/components/magnetic'
import { TextGenerate } from '@/components/text-generate'
import { siteConfig } from '@/lib/site'

const ROLES = ['AI/ML Engineer', 'Full Stack Developer', 'Interface Craftsman']

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
  const reduced = usePrefersReducedMotion()

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
  const reduced = usePrefersReducedMotion()
  // Prefer the CMS portrait so replacing the photo in Sanity updates the hero
  // too; the bundled file stays as the fallback for when the query fails.
  const portraitSrc = about?.profileImage?.asset?.url
  const portraitAlt = about?.profileImage?.alt || `${siteConfig.name}, ${siteConfig.role}`

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
              <span className="font-mono text-xs tracking-wide text-foreground-muted">{siteConfig.availability}</span>
            </motion.div>

            {/* ML leads the H1. "Building for the modern web" was a slogan
                that described every full stack dev on the internet and gave
                search engines nothing to index. */}
            <h1 className="mt-8 font-display text-display">
              <TextGenerate words="I build AI/ML systems" className="block" stagger={0.07} delay={0.1} />
              {/* `gradient` moves text-gradient onto each word span — see the
                  note in TextGenerate. Passing it via className left the
                  wrapper holding the gradient while the glyphs sat in child
                  spans, so the text painted as fully transparent. */}
              <TextGenerate words="that reach production." className="block" gradient stagger={0.07} delay={0.34} />
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
              {/* `role` is inserted verbatim — lowercasing it here would render
                  "an ai/ml engineer" and lose the acronym. */}
              I&apos;m {siteConfig.name}, an {siteConfig.role} building retrieval and fine-tuning pipelines — and the
              fast, accessible web products that ship them.
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

              {/* Always rendered: /resume handles the "no PDF uploaded yet"
                  case itself, and a link that vanishes with CMS state is a
                  worse default than one that leads somewhere useful. */}
              <Link
                href={about?.resumeFile?.asset?.url || '/resume'}
                // href="/resume"
                className="inline-flex items-center gap-2 px-2 text-sm text-foreground-subtle transition-colors hover:text-foreground"
              >
                <Download size={15} aria-hidden />
                Résumé
              </Link>
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
                  src={portraitSrc || '/aman-pic.jpg'}
                  alt={portraitAlt}
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
