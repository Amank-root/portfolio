'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'
import { isActivePath, navItems } from '@/lib/navigation'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  // The header condenses once the page scrolls, so it occupies less of a
  // small viewport when the reader is actually reading.
  const [condensed, setCondensed] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', latest => {
    const next = latest > 24
    // Guard against redundant sets: this fires on every scroll frame, and
    // React bails out of identical state anyway, but the guard keeps the
    // dependency array honest.
    setCondensed(current => (current === next ? current : next))
  })

  // The menu overlays the page on small screens, so it must close on
  // navigation. Links call `close()` directly rather than an effect watching
  // `pathname` — that indirection costs an extra render pass on every route
  // change and trips the set-state-in-effect lint rule.
  const close = () => setOpen(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-500',
        open
          ? 'border-border bg-background/80 backdrop-blur-xl'
          : condensed
            ? 'border-border/60 bg-background/60 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
      )}
    >
      <div
        className={cn(
          'container flex items-center justify-between gap-6 transition-all duration-500',
          condensed ? 'h-14' : 'h-18'
        )}
      >
        {/* Wordmark: a gradient monogram plus the name. */}
        <Link
          href="/"
          onClick={close}
          className="group flex items-center gap-3"
          aria-label={`${siteConfig.name} — home`}
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--aurora-coral)),hsl(var(--aurora-violet)))] text-sm font-bold text-primary-foreground transition-transform duration-500 group-hover:rotate-[12deg]"
          >
            A
          </span>
          <span className="font-display text-lg leading-none tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav. The active item carries a small gradient dot, which is
            quieter than an underline or a filled pill. */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map(item => {
            const active = isActivePath(pathname, item.path)
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={active ? 'page' : undefined}
                onClick={close}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm transition-colors duration-200',
                  active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full border border-primary/30 bg-primary/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="p-2" />
          <Link
            href="/contact"
            className="hidden rounded-full border border-border-strong px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-primary/50 hover:bg-card/60 sm:inline-flex"
          >
            Let&apos;s talk
          </Link>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="-mr-2 rounded-full p-2 text-foreground-muted transition-colors hover:bg-card/60 hover:text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container flex flex-col py-4">
              {navItems.map((item, i) => {
                const active = isActivePath(pathname, item.path)
                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                    className="border-b border-border/50 last:border-0"
                  >
                    <Link
                      href={item.path}
                      aria-current={active ? 'page' : undefined}
                      onClick={close}
                      className="flex items-center justify-between py-4"
                    >
                      <span className={cn('font-display text-xl', active && 'text-primary')}>{item.name}</span>
                      <span className="font-mono text-xs text-foreground-subtle">{item.description}</span>
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
