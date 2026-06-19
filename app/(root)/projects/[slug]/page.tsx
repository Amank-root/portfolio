import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/portable-text-components'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, ArrowLeft, Calendar, Tag } from 'lucide-react'
import type { Project } from '@/sanity/lib/types'
import { BlogMarkdownRenderer } from '@/components/blog-markdown-renderer'

// export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug).catch(() => null) as Project | null
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}`
    }
  }
}

export async function generateStaticParams() {
  const projects = await getProjects().catch(() => []) as Project[]
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
  const project = await getProject(slug).catch(() => null) as Project | null

  if (!project) notFound()

  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-6 gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft size={12} /> Back to Projects
          </Button>
        </Link>

        {/* Hero image */}
        {project.mainImage && (
          <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-border/50 mb-8">
            <Image
              src={urlFor(project.mainImage).width(1200).height(600).url()}
              alt={project.mainImage.alt || project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {project.status && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${project.status === 'completed' ? 'bg-accent/15 text-accent border-accent/30' :
                  project.status === 'development' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                    'bg-secondary/15 text-secondary border-secondary/30'
                  }`}>
                  {project.status}
                </span>
              )}
              {project.featured && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  ⭐ Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{project.title}</h1>
            <p className="mt-2 text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          <div className="flex gap-2 shrink-0">
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank">
                <Button variant="outline" className="gap-2 border-border/50 hover:border-primary/50">
                  <Github size={14} /> GitHub
                </Button>
              </Link>
            )}
            {project.demoUrl && (
              <Link href={project.demoUrl} target="_blank">
                <Button className="gap-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
                  <ExternalLink size={14} /> Live Demo
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="glass rounded-xl p-5 border border-border/50 mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Tag size={13} /> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech._id} className="tag-pill">{tech.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Long description */}
        { /* if longdesc starts with # then blogmarkdownrender else portable render */}
        {
          project.longDescription && project.longDescription.map((block) => block.children.map((child, i) => child.text).join('')).join('\n\n').startsWith('#') ? (
            <BlogMarkdownRenderer content={project.longDescription && project.longDescription.map((block) => block.children.map((child, i) => child.text).join('')).join('\n\n') || ""} />
          ) : (
            project.longDescription && (
              <div className="prose-blog">
                <PortableText value={project.longDescription} components={portableTextComponents} />
              </div>
            )
          )
        }
        {/* {console.log(JSON.stringify(project.longDescription))} */}
        {/* <BlogMarkdownRenderer content={JSON.stringify(project.longDescription)} /> */}
        {/* {project.longDescription && project.longDescription.map((block) => block.children.map((child, i) => child.text).join('')).join('\n')} */}
        {/* {project.longDescription && (
          <div className="prose-blog">
            <PortableText value={project.longDescription} components={portableTextComponents} />
          </div>
        )} */}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((img, i) => (
                <div key={i} className="relative h-48 overflow-hidden rounded-xl border border-border/50">
                  <Image
                    src={urlFor(img).width(600).height(400).url()}
                    alt={img.alt || `Screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {project.publishedAt && (
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={12} />
            {new Date(project.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectPageSkeleton() {
  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-6 h-9 w-32 rounded-full bg-muted/40" />
        <div className="mb-8 h-72 w-full rounded-2xl bg-muted/40 sm:h-96" />
        <div className="mb-8 space-y-3">
          <div className="h-4 w-24 rounded-full bg-muted/30" />
          <div className="h-10 w-3/4 rounded-lg bg-muted/40" />
          <div className="h-4 w-full rounded-lg bg-muted/30" />
          <div className="h-4 w-5/6 rounded-lg bg-muted/30" />
        </div>
        <div className="mb-8 rounded-xl border border-border/50 bg-muted/20 p-5">
          <div className="mb-3 h-4 w-24 rounded-full bg-muted/30" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-7 w-20 rounded-full bg-muted/40" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 rounded-lg bg-muted/40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-48 rounded-xl bg-muted/40" />
            <div className="h-48 rounded-xl bg-muted/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
