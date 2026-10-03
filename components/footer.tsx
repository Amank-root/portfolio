'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Mail } from 'lucide-react'
import { Magnetic } from '@/components/magnetic'
import { Reveal } from '@/components/section'
import { siteConfig } from '@/lib/site'
import { navItems } from '@/lib/navigation'

const SOCIALS = [
  { label: 'GitHub', href: siteConfig.social.github },
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'X', href: siteConfig.social.twitter },
]

/**
 * Site footer. The site's main call to action lives here rather than repeating
 * a contact block on every page, so the close of the page is where the pitch
 * happens.
 */
export function Footer() {
  // Injected at build time by next.config `env`; reading the clock during
  // render would make every page dynamic and defeat static prerendering.
  const year = process.env.NEXT_PUBLIC_BUILD_YEAR

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60">
      {/* A soft aurora bloom anchored to the bottom edge, so the footer feels
          lit from below rather than pasted on. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-40 h-80 bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,hsl(var(--aurora-violet)/0.22),transparent_70%)]"
      />

      <div className="container relative py-20">
        {/* Closing statement + CTA */}
        <Reveal className="mb-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h2 className="max-w-2xl font-display text-section">
                Have something in mind? <span className="text-gradient">Let&apos;s build it.</span>
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-foreground-muted">
                Open to full-stack and AI/ML work — freelance, contract or full-time. Email is the fastest way to reach
                me.
              </p>
            </div>

            <Magnetic>
              <a
                href={`mailto:${siteConfig.email}`}
                className="group inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
              >
                <Mail size={16} aria-hidden />
                Get in touch
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <div className="grid gap-10 border-t border-border/60 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center">
              <Image className="invert dark:invert-0" src="/logo.png" alt={siteConfig.name} width={64} height={64} />
              {/* <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--aurora-coral)),hsl(var(--aurora-violet)))] text-sm font-bold text-primary-foreground transition-transform duration-500 group-hover:rotate-[12deg]"
              >
                A
              </span> */}
              <span className="font-display text-xl">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground-muted">
              Based in {siteConfig.location.city}, {siteConfig.location.country}. Building for the modern web.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="eyebrow">Pages</h3>
            <ul className="mt-5 space-y-3">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow">Elsewhere</h3>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map(social => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {social.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-opacity group-hover:opacity-70"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
              <li>
                <a href="/rss.xml" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
                  RSS feed
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border/60 pt-6 font-mono text-xs text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          <p>Set in Syne, Instrument Sans &amp; Geist Mono</p>
        </div>
      </div>
    </footer>
  )
}
