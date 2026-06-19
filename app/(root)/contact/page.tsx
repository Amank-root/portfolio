import type { Metadata } from 'next'
import { getContact } from '@/sanity/lib/queries'
import { ContactClient } from '@/components/contact-client'
import type { Contact } from '@/sanity/lib/types'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Aman Kushwaha for collaborations, opportunities, or just to say hi.',
  alternates: {
    canonical: `/contact`
  }
}

export default function ContactPage() {
  return (
    <div className="min-h-full">
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
    <div className="flex h-full flex-col animate-pulse">
      {/* Hero Skeleton */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-border/10 bg-card/20">
        <div className="mx-auto max-w-6xl space-y-3">
          <div className="h-10 w-64 rounded bg-muted/60" />
          <div className="h-5 w-full max-w-xl rounded bg-muted/60" />
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:gap-8">
          {/* Left Column (Form) */}
          <div className="glass rounded-xl p-6 border border-border/50 space-y-6">
            <div className="h-6 w-36 rounded bg-muted/60" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-12 rounded bg-muted/60" />
                <div className="h-10 rounded bg-muted/40" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-12 rounded bg-muted/60" />
                <div className="h-10 rounded bg-muted/40" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-muted/60" />
              <div className="h-10 rounded bg-muted/40" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-muted/60" />
              <div className="h-32 rounded bg-muted/40" />
            </div>
            <div className="h-10 rounded bg-muted/60" />
          </div>

          {/* Right Column (Info / Cards) */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
              <div className="h-6 w-40 rounded bg-muted/60" />
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted/40" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-muted/60" />
                    <div className="h-3 w-32 rounded bg-muted/40" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted/40" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-muted/60" />
                    <div className="h-3 w-32 rounded bg-muted/40" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
              <div className="h-6 w-32 rounded bg-muted/60" />
              <div className="flex gap-3">
                <div className="h-8 w-20 rounded bg-muted/40" />
                <div className="h-8 w-20 rounded bg-muted/40" />
                <div className="h-8 w-20 rounded bg-muted/40" />
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-border/50 space-y-4">
              <div className="h-6 w-24 rounded bg-muted/60" />
              <div className="h-24 rounded bg-muted/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
