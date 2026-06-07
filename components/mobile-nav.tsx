'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Briefcase, Code, BookOpen, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Skills', path: '/skills', icon: Code },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Mail },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background-elevated/90 backdrop-blur-md md:hidden">
      {navItems.map(item => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-200',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon size={18} className={isActive ? 'text-primary' : ''} />
            <span className={cn('text-[9px] font-medium', isActive ? 'text-primary' : '')}>
              {item.name}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-t-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
