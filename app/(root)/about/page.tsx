'use cache'
import { cacheLife } from 'next/cache'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAbout } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/portable-text-components'
import { PageHeader, SectionHeading } from '@/components/section'
import { SpotlightCard } from '@/components/spotlight-card'
import { Download, MapPin, GraduationCap } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import type { About } from '@/sanity/lib/types'

const ABOUT_DESCRIPTION =
  'About Aman Kushwaha — AI/ML engineer and full stack developer in India, open to remote work. Builds retrieval and fine-tuning pipelines and the web systems that ship them.'

export const metadata: Metadata = {
  title: 'About',
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description: ABOUT_DESCRIPTION,
    url: absoluteUrl('/about'),
    type: 'profile',
    // The root layout's images are inherited by nested routes only when the
    // route doesn't declare its own openGraph object at all — this one does,
    // so og:image has to be repeated here or the card renders imageless.
    images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: siteConfig.title, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About | ${siteConfig.name}`,
    description: ABOUT_DESCRIPTION,
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    images: [absoluteUrl('/og.png')],
  },
}

function formatRange(start?: string, end?: string, current?: boolean): string {
  const fmt = (value?: string) =>
    value ? new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
  const from = fmt(start)
  const to = current ? 'Present' : fmt(end)
  if (from && to) return `${from} — ${to}`
  return from || to
}

export default async function AboutPage() {
  cacheLife('days')

  const about = (await getAbout().catch(() => null)) as About | null

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ])
        )}
      />

      <div className="container">
        <PageHeader
          eyebrow="Background"
          title={about?.title || 'A short version of the story.'}
          lede="AI/ML engineer and full stack developer, currently finishing a B.Tech in Computer Science. I build retrieval and fine-tuning pipelines, and the accessible web products that ship them."
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-foreground-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} className="text-primary" aria-hidden />
              {siteConfig.location.city}, {siteConfig.location.country}
            </span>
            <span className="inline-flex items-center gap-2">
              <GraduationCap size={14} className="text-primary" aria-hidden />
              B.Tech CS, MDU Rohtak
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {siteConfig.availability}
            </span>
            {/* The stable /resume route, not the raw Sanity asset — that URL
                changes whenever the PDF is replaced. */}
            <Link
              href="/resume"
              className="group inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
            >
              <Download size={14} aria-hidden />
              Résumé
            </Link>
          </div>
        </PageHeader>

        {/* Bio + portrait */}
        <section className="grid gap-12 py-20 lg:grid-cols-[1fr_18rem] lg:gap-20 sm:py-28">
          <div className="max-w-2xl">
            {about?.bio ? (
              <div className="prose-blog">
                <PortableText value={about.bio} components={portableTextComponents} />
              </div>
            ) : (
              <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-foreground-muted">
                <p>
                  I&apos;m a full stack developer currently pursuing B.Tech in Computer Science and Engineering. I like
                  building things that are efficient, scalable and genuinely pleasant to use — modern web technology,
                  applied where it earns its keep.
                </p>
                <p>
                  My work spans the MERN stack, Next.js, TypeScript and AI/ML. I&apos;m happiest on problems that need
                  both an interface and a model behind it, and I&apos;m happiest when the result is simple enough that
                  the next person can pick it up.
                </p>
              </div>
            )}
          </div>

          <div className="lg:justify-self-end">
            <SpotlightCard className="!p-0" glowColor="var(--aurora-violet)">
              {about?.profileImage?.asset?.url ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={urlFor(about.profileImage).width(500).height(625).url()}
                    alt={about.profileImage.alt || siteConfig.name}
                    fill
                    sizes="224px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-t-2xl bg-card">
                  <span className="font-display text-5xl text-foreground-subtle">{siteConfig.shortName.charAt(0)}</span>
                </div>
              )}
            </SpotlightCard>
          </div>
        </section>

        {/* Experience — a table-like list, dates in the left column. */}
        {about?.experiences && about.experiences.length > 0 && (
          <section className="py-16 sm:py-20">
            <SectionHeading eyebrow="Experience" title="Where I've worked." />
            <ul className="border-t border-border">
              {about.experiences.map((exp, i) => (
                <li key={i} className="grid gap-4 border-b border-border py-9 lg:grid-cols-[11rem_1fr] lg:gap-10">
                  <div>
                    <span className="font-mono text-xs text-foreground-subtle">
                      {formatRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-foreground">{exp.title}</h3>
                    <p className="mt-1 text-sm text-primary">{exp.company}</p>
                    {exp.description && (
                      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-foreground-muted">
                        {exp.description}
                      </p>
                    )}
                    {exp.skills?.length ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {exp.skills.map(skill => (
                          <li key={skill} className="tag-pill">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {about?.education && about.education.length > 0 && (
          <section className="py-16 sm:py-20">
            <SectionHeading eyebrow="Education" title="What I studied." />
            <ul className="border-t border-border">
              {about.education.map((edu, i) => (
                <li key={i} className="grid gap-4 border-b border-border py-9 lg:grid-cols-[11rem_1fr] lg:gap-10">
                  <span className="font-mono text-xs text-foreground-subtle">
                    {formatRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-foreground">{edu.degree}</h3>
                    <p className="mt-1 text-sm text-primary">{edu.institution}</p>
                    {edu.description && (
                      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-foreground-muted">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Interests — a comma-run. It was a field of glass pills. */}
        {about?.interests && about.interests.length > 0 && (
          <section className="py-16 sm:py-20">
            <SectionHeading eyebrow="Interests" title="What I keep coming back to." />
            <p className="max-w-3xl border-t border-border pt-8 text-lg leading-relaxed text-foreground-muted">
              {about.interests.map(interest => interest.name).join(' · ')}
            </p>
          </section>
        )}

        {/* Close */}
        <section className="border-t border-border py-16 sm:py-20">
          <p className="max-w-2xl font-display text-section leading-snug text-foreground">
            Want the long version, or interested in working together?
          </p>
          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Get in touch
          </Link>
        </section>
      </div>
    </>
  )
}
