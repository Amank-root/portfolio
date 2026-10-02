'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Theme toggle.
 *
 * Both icons are rendered and CSS decides which one shows, keyed off the `.dark`
 * class next-themes writes to <html> before paint. The obvious alternative —
 * a `mounted` state flag set from an effect — is deliberately avoided: it
 * forces a second render pass on every page load and is exactly the cascading
 * setState that causes a hydration flash. This way the server and client agree
 * on the markup, so there is nothing to reconcile.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
        className
      )}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {/* Resolved via peer/.dark selectors defined in globals.css */}
      <Sun size={13} className="hidden [.dark_&]:block" aria-hidden />
      <Moon size={13} className="block [.dark_&]:hidden" aria-hidden />
    </button>
  )
}
