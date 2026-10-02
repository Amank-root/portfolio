import type React from 'react'

interface TerminalProps {
  children: React.ReactNode
  className?: string
}

/**
 * Terminal chrome. Stays dark in both themes on purpose — a terminal is dark,
 * and forcing it to match the page would break the metaphor. The surrounding
 * text color is set explicitly rather than inherited, because the previous
 * version inherited the page's muted foreground (a dark slate) onto a dark
 * background, leaving the output effectively unreadable.
 */
export function Terminal({ children, className = '' }: TerminalProps) {
  return (
    <div
      className={`terminal rounded-md border border-white/10 bg-[#12151c] p-3 font-mono text-xs leading-relaxed text-slate-200 sm:p-4 sm:text-sm ${className}`}
    >
      <div className="mb-3 flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
      </div>
      {children}
    </div>
  )
}
