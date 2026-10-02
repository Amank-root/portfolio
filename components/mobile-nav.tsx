'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Briefcase, Code, BookOpen, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Skills', path: '/skills', icon: Code },
  { name: 'Blog', path: '/blog', icon: BookOpen },
  { name: 'Contact', path: '/contact', icon: Mail },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background-elevated/90 backdrop-blur-md md:hidden"
    >
      {navItems.map(item => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
        return (
          <Link
            key={item.path}
            href={item.path}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              // `relative` is required by the active underline below — without
              // it the bar positioned against the viewport, not the link.
              'relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 transition-colors duration-200',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon size={18} aria-hidden />
            <span className={cn('text-[9px] font-medium', isActive && 'text-primary')}>{item.name}</span>
            {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-primary" aria-hidden />}
          </Link>
        )
      })}
    </nav>
  )
}
