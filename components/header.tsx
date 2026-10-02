'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileCode2, X, CircleDot } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'

const tabs = [
  { name: 'index.tsx', path: '/' },
  { name: 'about.tsx', path: '/about' },
  { name: 'projects.tsx', path: '/projects' },
  { name: 'skills.tsx', path: '/skills' },
  { name: 'blog.md', path: '/blog' },
  { name: 'contact.tsx', path: '/contact' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 flex h-10 items-center border-b border-border/50 bg-background-elevated/80 backdrop-blur-md">
      {/* Brand */}
      <div className="flex h-full items-center gap-2 border-r border-border/30 px-4">
        <FileCode2 size={14} className="text-primary" aria-hidden />
        <span className="text-xs font-medium text-foreground/70">{siteConfig.shortName.toLowerCase()}.dev</span>
        <ThemeToggle />
      </div>

      {/* Tabs */}
      <nav className="scrollbar-none flex flex-1 overflow-x-auto" aria-label="Primary">
        {tabs.map(tab => {
          const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path))
          return (
            <Link
              key={tab.path}
              href={tab.path}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex h-10 items-center whitespace-nowrap border-r border-border/30 px-4 text-xs transition-all duration-200',
                isActive
                  ? 'bg-background text-foreground'
                  : 'bg-background-elevated/50 text-muted-foreground hover:bg-background/50 hover:text-foreground'
              )}
            >
              {isActive && <span className="absolute inset-x-0 top-0 h-[2px] bg-primary" aria-hidden />}
              <span className="mr-2">{tab.name}</span>
              {isActive ? (
                <CircleDot size={10} className="text-primary" aria-hidden />
              ) : (
                <X size={10} className="opacity-0 transition-opacity group-hover:opacity-60" aria-hidden />
              )}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
