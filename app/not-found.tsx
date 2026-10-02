import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col justify-center py-24">
      {/* Oversized gradient numeral, so the 404 reads as a page of the same
          site rather than a system error screen. */}
      <p className="text-gradient font-display text-[7rem] leading-none tracking-tight sm:text-[9rem]">404</p>

      <h1 className="mt-6 max-w-xl font-display text-section">This page doesn&apos;t exist.</h1>
      <p className="mt-5 max-w-md leading-relaxed text-foreground-muted">
        The link may be broken, or the page may have moved. Everything else is still where you left it.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
        >
          <Home size={15} aria-hidden />
          Back home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong bg-card/40 px-6 text-sm backdrop-blur-sm transition-colors hover:border-primary/50"
        >
          <ArrowLeft size={15} aria-hidden />
          Read the writing
        </Link>
      </div>
    </div>
  )
}
