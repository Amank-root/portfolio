'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, ExternalLink, Sparkles } from 'lucide-react'
import { siteConfig } from '@/lib/site'

const TYPING_TEXTS = ['Full Stack Developer', 'AI/ML Engineer', 'Next.js Specialist', 'Open Source Builder']

interface HeroSectionProps {
  about: {
    resumeFile?: { asset?: { url?: string } }
    profileImage?: { asset?: { url?: string }; alt?: string }
  } | null
}

export function HeroSection({ about }: HeroSectionProps) {
  // Seeded with the first role so the server-rendered HTML already contains
  // real text for crawlers and for users with JS disabled — an empty string
  // here would leave the hero's <h2> blank in the initial paint.
  const [text, setText] = useState(TYPING_TEXTS[0])
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Respect prefers-reduced-motion: render the first role statically instead
    // of animating a typewriter effect forever.
    if (prefersReducedMotion) return

    const currentText = TYPING_TEXTS[textIndex]
    const speed = isDeleting ? 40 : 90

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setText(currentText.slice(0, charIndex + 1))
          setCharIndex(c => c + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setText(currentText.slice(0, charIndex - 1))
          setCharIndex(c => c - 1)
        } else {
          setIsDeleting(false)
          setTextIndex(i => (i + 1) % TYPING_TEXTS.length)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [charIndex, textIndex, isDeleting, prefersReducedMotion])

  const resumeUrl = about?.resumeFile?.asset?.url
  const roleText = prefersReducedMotion ? TYPING_TEXTS[0] : text || TYPING_TEXTS[0]

  return (
    <section className="relative flex min-h-[calc(100svh-2.5rem)] items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/3 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row">
          {/* Text content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary"
            >
              <Sparkles size={12} className="animate-pulse" aria-hidden />
              Available for opportunities
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
            </motion.div>

            {/* Name */}
            <motion.h1
              className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hey, I&apos;m <span className="gradient-text glow-text-primary">{siteConfig.name}</span>
            </motion.h1>

            {/* Typing text. aria-live is off so screen readers aren't spammed by
                every keystroke; the static role is exposed once below. */}
            <motion.div
              className="mb-6 h-8 font-mono text-xl font-semibold text-muted-foreground sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              aria-hidden
            >
              <span className="text-accent">{roleText}</span>
              {!prefersReducedMotion && <span className="ml-0.5 animate-blink text-primary">█</span>}
            </motion.div>
            {/* Screen-reader / crawler equivalent of the animated line. */}
            <p className="sr-only">{TYPING_TEXTS.join(', ')}</p>

            {/* Description */}
            <motion.p
              className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              I build fast, accessible web products and the AI systems behind them — from machine learning pipelines to
              production interfaces in Next.js and TypeScript.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mb-8 flex flex-wrap justify-center gap-3 md:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/contact">
                <Button className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
                  Contact Me <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="gap-2 border-border/60 hover:border-primary/50 hover:text-primary">
                  View Projects <ExternalLink size={14} />
                </Button>
              </Link>
              {resumeUrl && (
                <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  >
                    <Download size={14} /> Resume
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex items-center justify-center gap-4 md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-xs text-muted-foreground">Find me on</span>
              <div className="flex gap-3">
                <Link
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-muted-foreground transition-all hover:scale-110 hover:text-foreground active:scale-95"
                >
                  <Github size={18} />
                </Link>
                <Link
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-muted-foreground transition-all hover:scale-110 hover:text-primary active:scale-95"
                >
                  <Linkedin size={18} />
                </Link>
                <Link
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="text-muted-foreground transition-all hover:scale-110 hover:text-foreground active:scale-95"
                >
                  <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="h-72 w-72 animate-rotate-slow rounded-full border border-primary/10 sm:h-80 sm:w-80" />
              <div
                className="absolute h-64 w-64 rounded-full border border-accent/10 sm:h-72 sm:w-72"
                style={{ animationDirection: 'reverse' }}
              />
            </div>

            <motion.div
              className="glow-primary relative h-56 w-56 animate-float overflow-hidden rounded-full border-2 border-primary/30 sm:h-64 sm:w-64 lg:h-72 lg:w-72"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Image
                src="/aman-pic.jpg"
                alt={`${siteConfig.name}, ${siteConfig.role}`}
                fill
                sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/10" />
            </motion.div>

            <motion.div
              className="glass absolute -bottom-2 -left-4 rounded-lg border border-accent/20 px-3 py-1.5 text-xs font-medium text-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              ⚡ Next.js 16
            </motion.div>
            <motion.div
              className="glass absolute -right-6 top-4 rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              🤖 AI/ML
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.dl
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { label: 'Projects Built', value: '10+' },
            { label: 'Technologies', value: '20+' },
            { label: 'GitHub Stars', value: '50+' },
            { label: 'Contributions', value: '200+' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl border-border/30 p-4 text-center">
              <dd className="gradient-text text-2xl font-bold">{stat.value}</dd>
              <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
