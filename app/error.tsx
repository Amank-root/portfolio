'use client'

import { useEffect } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <TriangleAlert size={44} className="mb-6 text-destructive" />
      <h1 className="text-3xl font-bold tracking-tight">Something broke</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred while rendering this page. Reloading usually clears it.
      </p>
      {error.digest && <p className="mt-3 font-mono text-xs text-muted-foreground/70">digest: {error.digest}</p>}
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RotateCcw size={14} /> Try again
      </button>
    </div>
  )
}
