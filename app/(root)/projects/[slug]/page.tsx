"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Github, ExternalLink, Calendar, Clock } from "lucide-react"
import { getProjectBySlug } from "@/sanity/lib/queries"
import { Project } from "@/sanity/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { PortableText } from "@portabletext/react"
import { useHasMounted } from "@/components/client-only"

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useHasMounted()

  useEffect(() => {
    async function loadProject() {
      if (!slug) return
      
      try {
        const projectData = await getProjectBySlug(slug)
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (mounted) {
      loadProject()
    }
  }, [slug, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex h-full flex-col p-6">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-muted"></div>
        <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-muted"></div>
        <div className="mb-8 h-64 w-full animate-pulse rounded bg-muted"></div>
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h1 className="mb-4 text-2xl font-bold">Project Not Found</h1>
        <p className="mb-6 text-muted-foreground">The project you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Navigation */}
      <div className="border-b bg-card p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="bg-card p-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
              {project.title}
            </h1>
            
            <p className="mb-6 text-lg text-muted-foreground">
              {project.description}
            </p>

            {/* Project Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{project.status}</span>
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-6 flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <Badge key={tech._id} variant="secondary">
                  {tech.name}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {project.githubUrl && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline">
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </Link>
                  </Button>
                </motion.div>
              )}
              {project.demoUrl && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild>
                    <Link href={project.demoUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Image */}
      <section className="p-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="relative aspect-video w-full">
                <Image
                  src={project.mainImage ? urlFor(project.mainImage).width(800).height(450).url() : "https://dummyimage.com/400X200/1f2023/f9f2ed.png&text=" + project.title}
                  alt={project.mainImage?.alt || project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Project Description */}
      {project.longDescription && (
        <section className="p-6">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent className="prose prose-slate max-w-none p-6 dark:prose-invert">
                  <PortableText value={project.longDescription} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="p-6">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {project.gallery.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={urlFor(image).width(600).height(400).url()}
                        alt={image.alt || `${project.title} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
