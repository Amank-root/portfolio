'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/project-card'
import { getProjects } from '@/sanity/lib/queries'
import { Project } from '@/sanity/lib/types'
import { useHasMounted } from '@/components/client-only'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const mounted = useHasMounted()

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      loadProjects()
    }
  }, [mounted])

  if (!mounted || loading) {
    return (
      <div className="flex h-full flex-col p-6">
        <h1 className="mb-6 text-2xl font-bold text-primary">Projects</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-6">
      <h1 className="mb-6 text-2xl font-bold text-primary">Projects</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  )
}
