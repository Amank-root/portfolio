'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Code, Briefcase, Mail, ChevronRight, BookOpen, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/', icon: Home, ext: 'tsx' },
    { name: 'About', path: '/about', icon: User, ext: 'tsx' },
    { name: 'Projects', path: '/projects', icon: Briefcase, ext: 'tsx' },
    { name: 'Skills', path: '/skills', icon: Code, ext: 'tsx' },
    { name: 'Blog', path: '/blog', icon: BookOpen, ext: 'md' },
    { name: 'Contact', path: '/contact', icon: Mail, ext: 'tsx' },
  ]

  return (
    <aside
      className={cn(
        'hidden w-60 shrink-0 border-r border-border/50 bg-background-elevated md:flex md:flex-col',
        className
      )}
    >
      {/* h-[calc(100svh-2.5rem)] rather than sticky/h-full: the parent flex row
          is `overflow-hidden`, so a sticky child never gets a scroll container
          to stick within and the explorer doesn't stay put on long pages. */}
      <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto">
        {/* Explorer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Explorer</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
        </div>

        {/* Portfolio section */}
        <div className="px-2 py-2 flex-1">
          <div className="mb-1 flex items-center px-2 py-1 text-xs text-muted-foreground">
            <ChevronRight size={12} className="mr-1 text-primary" />
            <span className="font-medium">PORTFOLIO</span>
          </div>

          <nav className="space-y-0.5">
            {navItems.map(item => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
              return (
                <div key={item.path}>
                  <Link
                    href={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center rounded-md px-2 py-1.5 text-sm transition-all duration-200',
                      isActive
                        ? 'border border-primary/20 bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {isActive && <span className="absolute -left-2 h-6 w-0.5 rounded-r bg-primary" aria-hidden />}
                    <item.icon
                      size={14}
                      className={cn('mr-2 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    <span
                      className={cn('font-mono text-[10px]', isActive ? 'text-primary/60' : 'text-muted-foreground/40')}
                      aria-hidden
                    >
                      .{item.ext}
                    </span>
                  </Link>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom status */}
        <div className="px-4 py-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-mono">amank-root@portfolio</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
