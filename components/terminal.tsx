import type React from "react"
interface TerminalProps {
  children: React.ReactNode
  className?: string
}

export function Terminal({ children, className = "" }: TerminalProps) {
  return (
    <div
      className={`terminal rounded-md border border-border bg-[#1e1e1e] p-3 font-mono text-xs leading-relaxed sm:p-4 sm:text-sm ${className}`}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive sm:h-3 sm:w-3"></div>
        <div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3"></div>
        <div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3"></div>
      </div>
      {children}
    </div>
  )
}

