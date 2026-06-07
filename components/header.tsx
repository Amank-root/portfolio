'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileCode2, X, CircleDot } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  const tabs = [
    { name: 'index.tsx', path: '/' },
    { name: 'about.tsx', path: '/about' },
    { name: 'projects.tsx', path: '/projects' },
    { name: 'skills.tsx', path: '/skills' },
    { name: 'blog.md', path: '/blog' },
    { name: 'contact.tsx', path: '/contact' },
  ]

  return (
    <header className="flex h-10 items-center border-b border-border/50 bg-background-elevated/80 backdrop-blur-xs sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 border-r border-border/30 h-full">
        <FileCode2 size={14} className="text-primary" />
        <span className="text-xs font-medium text-foreground/70">Portfolio</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-1 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const isActive = pathname === tab.path ||
            (tab.path !== '/' && pathname.startsWith(tab.path))
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                'group relative flex h-10 items-center border-r border-border/30 px-4 text-xs transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'bg-background text-foreground'
                  : 'bg-background-elevated/50 text-muted-foreground hover:bg-background/50 hover:text-foreground'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
              )}
              <span className="mr-2">{tab.name}</span>
              {isActive ? (
                <CircleDot size={10} className="text-primary" />
              ) : (
                <X size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              )}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
