'use client'

import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex min-h-screen flex-col justify-center py-24">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-px w-8 bg-[linear-gradient(90deg,hsl(var(--aurora-coral)),hsl(var(--aurora-violet)))]"
        />
        <span className="eyebrow font-mono text-destructive">Error</span>
      </div>
      <h1 className="mt-6 max-w-xl font-display text-section">Something broke.</h1>
      <p className="mt-5 max-w-md leading-relaxed text-foreground-muted">
        An unexpected error occurred while rendering this page. Reloading usually clears it.
      </p>
      {error.digest && <p className="mt-3 font-mono text-xs text-foreground-subtle">digest: {error.digest}</p>}
      <button
        onClick={reset}
        className="mt-10 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
      >
        <RotateCcw size={14} aria-hidden />
        Try again
      </button>
    </div>
  )
}
