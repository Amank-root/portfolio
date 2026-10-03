import type { Metadata } from 'next'
import { getContact } from '@/sanity/lib/queries'
import { ContactClient } from '@/components/contact-client'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import type { Contact } from '@/sanity/lib/types'
import { Suspense } from 'react'

const CONTACT_DESCRIPTION = `Get in touch with ${siteConfig.name} — ${siteConfig.availability}. Also available for freelance projects and collaborations.`

export const metadata: Metadata = {
  title: 'Contact',
  description: CONTACT_DESCRIPTION,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description: CONTACT_DESCRIPTION,
    url: absoluteUrl('/contact'),
    type: 'website',
    images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: siteConfig.title, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact | ${siteConfig.name}`,
    description: CONTACT_DESCRIPTION,
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    images: [absoluteUrl('/og.png')],
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-full">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ])
        )}
      />
      <Suspense fallback={<ContactPageSkeleton />}>
        <ContactPageContent />
      </Suspense>
    </div>
  )
}

async function ContactPageContent() {
  const contact = (await getContact().catch(() => null)) as Contact | null

  return <ContactClient contact={contact} />
}

function ContactPageSkeleton() {
  return (
    <div className="container animate-pulse">
      <div className="border-b border-border pb-14 pt-16 sm:pt-24">
        <div className="h-3 w-28 rounded bg-muted" />
        <div className="mt-6 h-12 w-2/3 max-w-lg rounded bg-muted" />
        <div className="mt-7 h-4 w-full max-w-xl rounded bg-muted/60" />
      </div>

      <div className="grid gap-16 py-20 lg:grid-cols-[1fr_18rem] lg:gap-20 sm:py-28">
        <div className="max-w-xl space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-20 rounded bg-muted/60" />
              <div className="h-11 w-full rounded-md bg-muted/50" />
            </div>
          ))}
        </div>
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 border-t border-border pt-5">
              <div className="h-3 w-16 rounded bg-muted/60" />
              <div className="h-4 w-40 rounded bg-muted/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
