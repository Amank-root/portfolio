'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, ExternalLink, Sparkles } from 'lucide-react'

const TYPING_TEXTS = ['Full Stack Developer', 'AI/ML Enthusiast', 'Next.js Expert', 'Open Source Builder']

interface HeroSectionProps {
  about: {
    resumeFile?: { asset?: { url?: string } }
    profileImage?: { asset?: { url?: string }; alt?: string }
  } | null
}

export function HeroSection({ about }: HeroSectionProps) {
  const [text, setText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
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
  }, [mounted, charIndex, textIndex, isDeleting])

  const resumeUrl = about?.resumeFile?.asset?.url || '/AmanKushwaha_Resume.pdf'

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-5xl w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
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
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6"
            >
              <Sparkles size={12} className="animate-pulse" />
              Available for opportunities
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hey, I&apos;m{' '}
              <span className="gradient-text glow-text-primary">
                Aman Kushwaha
              </span>
            </motion.h1>

            {/* Typing text */}
            <motion.div
              className="text-xl sm:text-2xl font-semibold text-muted-foreground mb-6 h-8 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-accent">{mounted ? text : TYPING_TEXTS[0]}</span>
              <span className="animate-blink text-primary ml-0.5">█</span>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Full Stack Developer specializing in MERN stack & Next.js. Building
              scalable, performant web applications with clean code and great UX.
              Currently pursuing B.Tech in Computer Science.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center md:justify-start mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/contact">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Contact Me <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="gap-2 border-border/60 hover:border-primary/50 hover:text-primary">
                  View Projects <ExternalLink size={14} />
                </Button>
              </Link>
              <Link href={resumeUrl} target="_blank" download>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  <Download size={14} /> Resume
                </Button>
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex items-center gap-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-xs text-muted-foreground">Find me on</span>
              <div className="flex gap-3">
                <Link
                  href="https://github.com/amank-root"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 active:scale-95 transition-transform"
                >
                  <Github size={18} />
                </Link>
                <Link
                  href="https://linkedin.com/in/amank-root"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 transition-transform"
                >
                  <Linkedin size={18} />
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
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-primary/10 animate-rotate-slow" />
              <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-accent/10" style={{ animationDirection: 'reverse' }} />
            </div>

            {/* Image container */}
            <motion.div
              className="relative h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 rounded-full overflow-hidden border-2 border-primary/30 glow-primary animate-float"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Image
                src="/aman-pic.jpg"
                alt="Aman Kushwaha"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/10" />
            </motion.div>

            {/* Floating skill badges */}
            <motion.div
              className="absolute -bottom-2 -left-4 glass rounded-lg px-3 py-1.5 text-xs font-medium text-accent border border-accent/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              ⚡ Next.js 16
            </motion.div>
            <motion.div
              className="absolute top-4 -right-6 glass rounded-lg px-3 py-1.5 text-xs font-medium text-primary border border-primary/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              🤖 AI/ML
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { label: 'Projects Built', value: '10+' },
            { label: 'Technologies', value: '20+' },
            { label: 'GitHub Stars', value: '50+' },
            { label: 'Contributions', value: '200+' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center border-border/30">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
