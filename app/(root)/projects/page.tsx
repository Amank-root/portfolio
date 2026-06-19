"use cache";
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, Briefcase, ArrowRight } from 'lucide-react'
import type { Project } from '@/sanity/lib/types'
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Portfolio of web development, AI/ML, and full-stack projects by Aman Kushwaha.',
  alternates: {
    canonical: `/projects`
  }
}

// export const revalidate = 60

const statusColors: Record<string, string> = {
  completed: 'bg-accent/20 text-accent border-accent/30',
  development: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  maintenance: 'bg-secondary/20 text-secondary border-secondary/30',
}

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []) as Project[]

  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="section-label mb-3 flex items-center gap-2">
            <Briefcase size={12} />
            Portfolio
          </span>
          <h1 className="text-4xl font-bold gradient-text">Projects</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            A collection of projects I&apos;ve built — from full-stack web apps to AI/ML experiments.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24">
            <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground text-sm">Add projects in Sanity Studio to see them here.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <div key={project._id} className="group glass rounded-xl overflow-hidden border border-border/50 hover:border-primary/25 hover-card flex flex-col">
                <Link href={`/projects/${project.slug?.current}`} className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      project.mainImage
                        ? urlFor(project.mainImage).width(600).height(300).url()
                        : `https://dummyimage.com/600X300/0d1117/00c8ff.png&text=${encodeURIComponent(project.title)}`
                    }
                    alt={project.mainImage?.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                  {project.status && (
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColors[project.status] || ''}`}>
                        {project.status}
                      </span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                    <Link href={`/projects/${project.slug?.current}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies?.slice(0, 5).map(tech => (
                      <span key={tech._id} className="tag-pill text-[11px]">{tech.name}</span>
                    ))}
                    {(project.technologies?.length || 0) > 5 && (
                      <span className="tag-pill text-[11px]">+{(project.technologies?.length || 0) - 5}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank" className="flex-1">
                        <Button size="sm" variant="outline" className="gap-2 text-xs w-full border-border/50 hover:border-primary/50">
                          <Github size={12} /> GitHub
                        </Button>
                      </Link>
                    )}
                    {project.demoUrl && (
                      <Link href={project.demoUrl} target="_blank" className="flex-1">
                        <Button size="sm" className="gap-2 text-xs w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
                          <ExternalLink size={12} /> Live Demo
                        </Button>
                      </Link>
                    )}
                    {project.slug?.current && (
                      <Link href={`/projects/${project.slug.current}`}>
                        <Button size="sm" variant="ghost" className="text-xs px-2 text-muted-foreground hover:text-foreground">
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  )
}
