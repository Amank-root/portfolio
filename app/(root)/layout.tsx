import type React from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { MobileNav } from '@/components/mobile-nav'
import { JsonLd } from '@/components/json-ld'
import { graph, personSchema, webSiteSchema } from '@/lib/seo'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Site-level structured data: tells search engines who the site belongs
          to, which feeds the knowledge panel and sitelinks. */}
      <JsonLd data={graph(personSchema(), webSiteSchema())} />

      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main id="main-content" className="flex-1 overflow-auto pb-20 md:pb-0" tabIndex={-1}>
          {children}
        </main>
      </div>
      <footer className="hidden h-7 items-center justify-between border-t border-border/30 bg-background-elevated/50 px-4 font-mono text-[10px] text-muted-foreground md:flex">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            main
          </span>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/sitemap.xml" className="transition-colors hover:text-foreground" aria-label="Sitemap">
            sitemap.xml
          </a>
          <a href="/rss.xml" className="transition-colors hover:text-foreground" aria-label="RSS feed">
            RSS
          </a>
          <span>Next.js 16</span>
        </div>
      </footer>
      <MobileNav />
    </div>
  )
}
