import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Buttons are pill-shaped with a soft radius. The old `rounded-md` + drop-shadow
 * treatment read as a UI kit; the site now uses text links for most actions and
 * reserves filled buttons for genuine form submits.
 */
const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:opacity-90',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        outline:
          'border border-border-strong bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/10',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
        ghost: 'text-foreground-muted hover:bg-muted hover:text-foreground',
        link: 'text-primary underline underline-offset-4 hover:opacity-80',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-[0.95rem]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
