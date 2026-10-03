'use cache'
import { cacheLife } from 'next/cache'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { ArrowUpRight, Github } from 'lucide-react'
import { PageHeader, Reveal } from '@/components/section'
import { SpotlightCard } from '@/components/spotlight-card'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, collectionSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import { projectPlaceholder } from '@/lib/placeholder'
import type { Project } from '@/sanity/lib/types'

const PROJECTS_DESCRIPTION =
  'Selected projects by Aman Kushwaha — AI/ML systems, retrieval pipelines, full stack web apps and developer tooling built with Python, Next.js, TypeScript and React.'

export const metadata: Metadata = {
  title: 'Projects',
  description: PROJECTS_DESCRIPTION,
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description: PROJECTS_DESCRIPTION,
    url: absoluteUrl('/projects'),
    type: 'website',
    // A route-level openGraph replaces the inherited one key-by-key, so the
    // layout's images have to be restated here.
    images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: siteConfig.title, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Projects | ${siteConfig.name}`,
    description: PROJECTS_DESCRIPTION,
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    images: [absoluteUrl('/og.png')],
  },
}

function formatDate(value?: string): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function ProjectsPage() {
  cacheLife('days')

  const projects = (await getProjects().catch(() => [])) as Project[]

  return (
    <>
      <JsonLd
        data={graph(
          collectionSchema({ name: 'Projects', path: '/projects', description: PROJECTS_DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
          ])
        )}
      />

      <div className="container">
        <PageHeader
          eyebrow="Selected work"
          title="Things I've built."
          lede="Products, tools and experiments — mostly full-stack web work, increasingly with a machine learning component. Each entry links to a write-up where there is one."
        />

        {projects.length === 0 ? (
          <p className="py-24 text-center text-foreground-muted">
            Nothing published yet — projects are added from the CMS.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project._id} delay={i * 0.06}>
                <SpotlightCard
                  className="h-full !p-0"
                  glowColor={i % 2 ? 'var(--aurora-cyan)' : 'var(--aurora-violet)'}
                >
                  <article className="group flex h-full flex-col">
                    <Link
                      href={`/projects/${project.slug?.current}`}
                      className="relative block aspect-[16/10] overflow-hidden rounded-t-2xl"
                    >
                      <Image
                        src={
                          project.mainImage
                            ? urlFor(project.mainImage).width(700).height(440).url()
                            : projectPlaceholder(project.title)
                        }
                        alt={project.mainImage?.alt || `${project.title} preview`}
                        fill
                        sizes="(max-width: 640px) 100vw, 560px"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/55 via-background/10 to-transparent" />
                      {project.status && (
                        <span className="absolute top-4 right-4 rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[0.625rem] tracking-wider text-foreground-muted uppercase backdrop-blur-sm">
                          {project.status}
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="font-display text-2xl">
                          <Link
                            href={`/projects/${project.slug?.current}`}
                            className="transition-colors hover:text-primary"
                          >
                            {project.title}
                          </Link>
                        </h2>
                        {project.featured && (
                          <span className="shrink-0 font-mono text-[0.625rem] tracking-wider text-primary uppercase">
                            featured
                          </span>
                        )}
                      </div>

                      {project.description && (
                        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-foreground-muted">
                          {project.description}
                        </p>
                      )}

                      {project.technologies?.length ? (
                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map(tech => (
                            <li key={tech._id} className="tag-pill">
                              {tech.name}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-sm">
                        <Link
                          href={`/projects/${project.slug?.current}`}
                          className="group/link inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary"
                        >
                          Read more
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            aria-hidden
                          />
                        </Link>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-foreground-muted transition-colors hover:text-foreground"
                          >
                            <Github size={14} aria-hidden />
                            Source
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-foreground-muted transition-colors hover:text-foreground"
                          >
                            <ArrowUpRight size={14} aria-hidden />
                            Live demo
                          </a>
                        )}
                        <span className="ml-auto font-mono text-xs text-foreground-subtle">
                          {formatDate(project.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
