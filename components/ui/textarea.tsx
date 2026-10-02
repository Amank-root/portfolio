import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[8rem] w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm leading-relaxed resize-none',
          'placeholder:text-foreground-subtle',
          'focus-visible:outline-hidden focus-visible:border-primary/60',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
