import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import { Project } from "@/sanity/lib/types"
import { urlFor } from "@/sanity/lib/image"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden bg-card">
      <div className="relative h-48 w-full">
        <Image 
          src={project.mainImage ? urlFor(project.mainImage).width(400).height(200).url() : `https://dummyimage.com/600X192/1f2023/f9f2ed.png&text=${project.title}`} 
          alt={project.mainImage?.alt || project.title} 
          fill 
          className="object-cover" 
        />
      </div>

      <CardHeader>
        <CardTitle className="text-accent">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
            <span key={tech._id} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              {tech.name}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Link href={`/projects/${project.slug.current}`} className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs">
          <Eye size={16} />
          <span>View</span>
        </Link>
        
        {project.githubUrl && (
          <Link href={project.githubUrl} target="_blank" className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs">
            <Github size={16} />
            <span>Code</span>
          </Link>
        )}

        {project.demoUrl && (
          <Link href={project.demoUrl} target="_blank" className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3 text-xs">
            <ExternalLink size={16} />
            <span>Demo</span>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

