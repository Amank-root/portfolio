import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/portable-text-components'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import type { Project } from '@/sanity/lib/types'
import { BlogMarkdownRenderer } from '@/components/blog-markdown-renderer'

type Props = { params: Promise<{ slug: string }> }

// longDescription can be a Portable Text array (legacy docs) or a plain
// markdown string (docs created while the field was typed as `text`).
function flattenLongDescription(value: Project['longDescription']): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.map(block => (block.children ?? []).map(child => child.text).join('')).join('\n\n')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = (await getProject(slug).catch(() => null)) as Project | null
  if (!project) return { title: 'Project Not Found', robots: { index: false, follow: false } }

  const title = project.title
  const description = project.description
  const url = absoluteUrl(`/projects/${slug}`)
  const ogImageUrl = project.mainImage
    ? urlFor(project.mainImage).width(1200).height(630).fit('crop').url()
    : absoluteUrl('/opengraph-image')
  const techNames = project.technologies?.map(t => t.name)

  return {
    title,
    description,
    keywords: techNames,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      type: 'article',
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.author.twitter,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
  }
}

export async function generateStaticParams() {
  const projects = (await getProjects().catch(() => [])) as Project[]
  return projects.map(p => ({ slug: p.slug.current }))
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense fallback={<ProjectPageSkeleton />}>
      <ProjectPageContent params={params} />
    </Suspense>
  )
}

async function ProjectPageContent({ params }: Props) {
  const { slug } = await params
  const project = (await getProject(slug).catch(() => null)) as Project | null

  if (!project) notFound()

  const projectJsonLd = graph(
    {
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: absoluteUrl(`/projects/${slug}`),
      ...(project.mainImage ? { image: [urlFor(project.mainImage).width(1200).height(630).fit('crop').url()] } : {}),
      ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
      ...(project.demoUrl ? { url: project.demoUrl } : {}),
      author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
      ...(project.technologies?.length ? { keywords: project.technologies.map(t => t.name).join(', ') } : {}),
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: project.title, path: `/projects/${slug}` },
    ])
  )

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <header className="border-b border-border pb-12 pt-16 sm:pt-24">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
              All work
            </Link>

            <p className="eyebrow mt-10 font-mono text-primary">
              {[project.status, project.featured ? 'featured' : null].filter(Boolean).join(' · ')}
            </p>

            <h1 className="mt-5 font-display text-display text-foreground">{project.title}</h1>
            {project.description && <p className="mt-6 text-lede text-foreground-muted">{project.description}</p>}

            {(project.githubUrl || project.demoUrl) && (
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                  >
                    <Github size={15} aria-hidden />
                    Source on GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                  >
                    <ExternalLink size={15} aria-hidden />
                    Live demo
                  </a>
                )}
              </div>
            )}
          </header>

          {/* Cover image, inside the measure. */}
          {project.mainImage && (
            <div className="relative my-12 aspect-[16/9] w-full overflow-hidden rounded-md border border-border bg-muted">
              <Image
                src={urlFor(project.mainImage).width(1200).height(675).url()}
                alt={project.mainImage.alt || `${project.title} preview`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Stack as running text under a hairline. */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-12 border-y border-border py-6">
              <h2 className="eyebrow">Built with</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <li key={tech._id} className="tag-pill">
                    {tech.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Long description: markdown-flavored content -> markdown renderer, else Portable Text */}
          {(() => {
            const text = flattenLongDescription(project.longDescription)
            if (!text) return null
            if (text.trimStart().startsWith('#')) {
              return <BlogMarkdownRenderer content={text} />
            }
            if (Array.isArray(project.longDescription)) {
              return (
                <div className="prose-blog">
                  <PortableText value={project.longDescription} components={portableTextComponents} />
                </div>
              )
            }
            return (
              <div className="prose-blog">
                {text.split('\n').map((line, i) => line.trim() && <p key={i}>{line}</p>)}
              </div>
            )
          })()}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="mt-14">
              <h2 className="eyebrow">Gallery</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {project.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[3/2] overflow-hidden rounded-md border border-border">
                    <Image
                      src={urlFor(img).width(600).height(400).url()}
                      alt={img.alt || `${project.title} screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.publishedAt && (
            <p className="mt-14 border-t border-border pt-6 font-mono text-xs text-foreground-subtle">
              {new Date(project.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

function ProjectPageSkeleton() {
  return (
    <div className="container animate-pulse">
      <div className="mx-auto max-w-3xl">
        <div className="border-b border-border pb-12 pt-16 sm:pt-24">
          <div className="h-4 w-20 rounded bg-muted/60" />
          <div className="mt-8 h-3 w-24 rounded bg-muted/60" />
          <div className="mt-5 h-11 w-3/4 rounded-lg bg-muted/40" />
          <div className="mt-7 h-4 w-full rounded bg-muted/50" />
        </div>
        <div className="my-12 aspect-[16/9] rounded-md bg-muted/50" />
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-muted/40" />
          <div className="h-4 w-full rounded bg-muted/30" />
          <div className="h-4 w-5/6 rounded bg-muted/30" />
          <div className="h-4 w-2/3 rounded bg-muted/30" />
        </div>
      </div>
    </div>
  )
}
