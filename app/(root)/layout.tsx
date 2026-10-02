import type React from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Aurora } from '@/components/aurora'
import { ScrollProgress } from '@/components/scroll-progress'
import { JsonLd } from '@/components/json-ld'
import { graph, personSchema, webSiteSchema } from '@/lib/seo'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Site-level structured data: tells search engines who the site belongs
          to, which feeds the knowledge panel and sitelinks. */}
      <JsonLd data={graph(personSchema(), webSiteSchema())} />

      <Aurora />
      <ScrollProgress />
      <Header />

      {/* Content sits above the grain overlay (z-index 1 on body::before); the
          aurora is behind everything at -z-10. */}
      <main id="main-content" className="relative z-10 flex-1" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  )
}
