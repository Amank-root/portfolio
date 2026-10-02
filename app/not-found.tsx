import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, ArrowLeft, FileQuestion } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-24 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden>
          <div className="mx-auto h-40 w-40 rounded-full bg-primary/20" />
        </div>
        <FileQuestion size={56} className="mx-auto text-primary/60" />
      </div>

      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        This page <span className="gradient-text">doesn&apos;t exist</span>
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The link may be broken, or the page may have been moved. Try the explorer on the left, or head back home.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Home size={14} /> Back home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
        >
          <ArrowLeft size={14} /> Read the blog
        </Link>
      </div>
    </div>
  )
}
