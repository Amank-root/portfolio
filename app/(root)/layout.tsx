import type React from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { MobileNav } from '@/components/mobile-nav'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">{children}</main>
      </div>
      <footer className="hidden md:flex h-7 items-center justify-between border-t border-border/30 bg-background-elevated/50 px-4 text-[10px] text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            main
          </span>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Next.js 16</span>
          <span>Sanity CMS</span>
          <span>Ln 1, Col 1</span>
        </div>
      </footer>
      <MobileNav />
    </div>
  )
}
