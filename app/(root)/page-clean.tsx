'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Terminal } from '@/components/terminal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowRight, Github, ExternalLink, Download, Code, Briefcase, User, Mail } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useHasMounted } from '@/components/client-only'
import { getFeaturedProjects } from '@/sanity/lib/queries'
import type { Project } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'

const fullTextTyping = ['Full Stack Developer', 'AI/ML Developer', 'Machine Learning Enthusiast']

export default function Home() {
  const [text, setText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const mounted = useHasMounted()
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Fetch featured projects
  useEffect(() => {
    async function loadFeaturedProjects() {
      try {
        const projects = await getFeaturedProjects()
        setFeaturedProjects(projects)
      } catch (error) {
        console.error('Error fetching featured projects:', error)
      }
    }

    if (mounted) {
      loadFeaturedProjects()
    }
  }, [mounted])

  // Typing effect - only start after component mounts
  useEffect(() => {
    if (!mounted) return

    const currentText = fullTextTyping[textIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const delayBeforeDelete = 2000
    const delayBeforeNextWord = 500

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setText(currentText.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), delayBeforeDelete)
        }
      } else {
        if (charIndex > 0) {
          setText(currentText.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % fullTextTyping.length)
          setTimeout(() => setCharIndex(0), delayBeforeNextWord)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [mounted, charIndex, textIndex, isDeleting])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 md:flex-row md:py-20 lg:px-8 lg:py-24">
        <motion.div
          className="mb-8 flex flex-col md:mb-0 md:w-1/2 md:pr-8"
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            Hello, I&apos;m <span className="text-accent">Aman Kushwaha</span>
          </h1>
          <h2 className="mb-6 h-auto text-xl font-semibold text-muted-foreground sm:text-2xl md:text-3xl">
            {mounted ? text || 'Full Stack Developer' : 'Full Stack Developer'}
            <span className="animate-blink">|</span>
          </h2>
          <p className="mb-8 text-base text-muted-foreground sm:text-lg">
            A passionate Full Stack Developer specializing in MERN stack development. I create efficient, scalable, and
            user-friendly solutions with a focus on modern web technologies and best practices. Currently pursuing
            B.Tech in Computer Science.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size={isMobile ? 'default' : 'lg'} className="gap-2">
                <Link href="/contact">
                  Contact Me <ArrowRight size={16} />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size={isMobile ? 'default' : 'lg'} className="gap-2">
                <Link href="/AmanKushwaha_Resume.pdf" target="_blank" download>
                  Resume <Download size={16} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2"
          initial={mounted ? { opacity: 0, x: 20 } : false}
          animate={mounted ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Terminal className="w-full">
            <div className="terminal-prompt">
              <span className="text-accent">aman@portfolio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-muted-foreground">$</span>
            </div>
            <div className="terminal-output">
              <div className="text-green-400">Welcome to my portfolio! 👋</div>
              <div className="mt-2">
                <span className="text-yellow-400">Skills:</span>
                <div className="ml-2 mt-1">
                  • React.js & Next.js
                  <br />
                  • Node.js & Express.js
                  <br />
                  • TypeScript & JavaScript
                  <br />
                  • MongoDB & PostgreSQL
                  <br />• Python & Machine Learning
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-400">$ cat contact.txt</span>
                <div className="ml-2 mt-1">
                  📧 amank.root@gmail.com
                  <br />
                  🔗 github.com/Amank-root
                  <br />
                  💼 linkedin.com/in/amank-root
                </div>
              </div>
            </div>
          </Terminal>
        </motion.div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="mb-8 text-center text-2xl font-bold text-primary sm:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore My Work
          </motion.h2>
          <motion.div
            className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <QuickLinkCard
              icon={Code}
              title="Projects"
              description="View my latest projects and case studies"
              href="/projects"
            />
            <QuickLinkCard
              icon={User}
              title="About"
              description="Learn more about my background and experience"
              href="/about"
            />
            <QuickLinkCard
              icon={Briefcase}
              title="Skills"
              description="Explore my technical skills and expertise"
              href="/skills"
            />
            <QuickLinkCard icon={Mail} title="Contact" description="Get in touch for collaborations" href="/contact" />
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="mb-8 text-center text-2xl font-bold text-primary sm:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {featuredProjects.map(project => (
              <motion.div key={project._id} variants={item} className="h-full">
                <Card className="h-full overflow-hidden bg-card transition-all hover:shadow-lg">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        project.mainImage ? urlFor(project.mainImage).width(600).height(300).url() : '/placeholder.svg'
                      }
                      alt={project.mainImage?.alt || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="mb-2 text-lg font-bold text-accent sm:text-xl">{project.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground sm:text-base">{project.description}</p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies?.map(tech => (
                        <span
                          key={tech._id}
                          className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button asChild size="sm" variant="outline" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                            <Link href={project.githubUrl} target="_blank">
                              <Github size={14} /> GitHub
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                      {project.demoUrl && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button asChild size="sm" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                            <Link href={project.demoUrl} target="_blank">
                              <ExternalLink size={14} /> Live Demo
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

interface QuickLinkCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
}

function QuickLinkCard({ icon: Icon, title, description, href }: QuickLinkCardProps) {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card className="h-full transition-all hover:border-accent hover:shadow-md">
        <CardContent className="flex h-full flex-col items-center p-4 text-center sm:p-6">
          <div className="mb-4 rounded-full bg-accent/10 p-3">
            <Icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
          </div>
          <h3 className="mb-2 text-base font-semibold sm:text-lg">{title}</h3>
          <p className="mb-4 text-xs text-muted-foreground sm:text-sm">{description}</p>
          <motion.div className="mt-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" size="sm">
              <Link href={href}>Explore</Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
