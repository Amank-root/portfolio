import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
  github: string
  demo: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden bg-card">
      <div className="relative h-48 w-full">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>

      <CardHeader>
        <CardTitle className="text-accent">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span key={index} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
          <Link href={project.github} target="_blank">
            <Github size={16} />
            <span>Code</span>
          </Link>
        </Button>

        <Button asChild size="sm" className="flex items-center gap-1">
          <Link href={project.demo} target="_blank">
            <ExternalLink size={16} />
            <span>Demo</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

