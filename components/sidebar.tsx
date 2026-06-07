'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, User, Code, Briefcase, Mail, ChevronRight, BookOpen, BarChart3, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
    <aside className={cn('hidden w-60 shrink-0 border-r border-border/50 bg-background-elevated md:flex md:flex-col', className)}>
      <div className="sticky top-0 flex flex-col h-full">
        {/* Explorer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Explorer
          </span>
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
            {navItems.map((item, i) => {
              const isActive = pathname === item.path ||
                (item.path !== '/' && pathname.startsWith(item.path))
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.path}
                    className={cn(
                      'group flex items-center rounded-md px-2 py-1.5 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute left-0 w-0.5 h-6 bg-primary rounded-r"
                        layoutId="activeIndicator"
                      />
                    )}
                    <item.icon
                      size={14}
                      className={cn(
                        'mr-2 shrink-0',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className={cn(
                      'text-[10px] font-mono',
                      isActive ? 'text-primary/60' : 'text-muted-foreground/40'
                    )}>
                      .{item.ext}
                    </span>
                  </Link>
                </motion.div>
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
