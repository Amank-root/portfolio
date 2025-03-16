"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Terminal } from "@/components/terminal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowRight, Github, ExternalLink, Download, Code, Briefcase, User, Mail } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

const fullTextTyping = ["Full Stack Developer", "Ai/ML Developer", "Machine Learning Enthusiast"]

export default function Home() {
  const [text, setText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Typing effect
  useEffect(() => {
    const currentText = fullTextTyping[textIndex]
    const typingSpeed = isDeleting ? 50 : 100 // Faster when deleting
    const delayBeforeDelete = 2000 // Wait time before starting to delete
    const delayBeforeNextWord = 500 // Wait time before typing next word

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setText(currentText.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), delayBeforeDelete)
        }
      } else {
        if (charIndex > 0) {
          setText(currentText.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % fullTextTyping.length)
          // Small delay before typing next word
          setTimeout(() => setCharIndex(0), delayBeforeNextWord)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [charIndex, textIndex, isDeleting])

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

  // Featured projects
  const imgGen = "https://dummyimage.com/600X192/1f2023/f9f2ed.png&text="
  const featuredProjects = [
    {
      title: "Attendance System Using OpenCV",
      description: "A Python-based attendance system that utilizes facial recognition to accurately identify students and mark their attendance on specific dates.",
      image: `${imgGen}Attendance System Using OpenCV`, // Replace with the actual image path
      tags: ["Python", "OpenCV", "Face Recognition", "pandas", "Tkinter"],
      github: "https://github.com/Amank-root/attendance_sys_using_opencv",
      demo: "https://github.com/Amank-root/attendance_sys_using_opencv", // Provide a link to a live demo if available
    },
    {
      title: "MooMovies - Streaming Platform",
      description: "Your one-stop destination for streaming movies, anime, and manga across Bollywood, Hollywood, and other genres.",
      image: `${imgGen}MooMovies - Streaming Platform`, // Replace with the actual image path
      tags: ["Nextjs", "TypeScript", "Tailwind CSS", "TheMovieDB API"],
      github: "https://moomoviev2.pages.dev/",
      demo: "https://moomoviev2.pages.dev/",
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 md:flex-row md:py-20 lg:px-8 lg:py-24">
        <motion.div
          className="mb-8 flex flex-col md:mb-0 md:w-1/2 md:pr-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            Hello, I&apos;m <span className="text-accent">Aman Kushwaha</span>
          </h1>
          <h2 className="mb-6 h-auto text-xl font-semibold text-muted-foreground sm:text-2xl md:text-3xl">
            {text ? text : ""}
            <span className="animate-blink">|</span>
          </h2>
          <p className="mb-8 text-base text-muted-foreground sm:text-lg">
            A passionate Full Stack Developer specializing in MERN stack development. I create efficient, scalable, and user-friendly solutions 
            with a focus on modern web technologies and best practices. Currently pursuing B.Tech in Computer Science.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size={isMobile ? "default" : "lg"} className="gap-2">
                <Link href="/contact">
                  Contact Me <ArrowRight size={16} />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="gap-2">
                <Link href="/AmanKushwaha_Resume.pdf" target="_blank" download>
                  Resume <Download size={16} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-accent sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-80 lg:w-80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <Image src="/aman-pic.jpg" alt="Profile" fill className="object-cover" priority />
        </motion.div>
      </section>

      {/* Quick Links */}
      <section className="bg-card px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={item}>
            <QuickLinkCard icon={Code} title="Skills" description="Check out my technical expertise" href="/skills" />
          </motion.div>
          <motion.div variants={item}>
            <QuickLinkCard
              icon={Briefcase}
              title="Projects"
              description="Browse through my portfolio of recent work"
              href="/projects"
            />
          </motion.div>
          <motion.div variants={item}>
            <QuickLinkCard
              icon={User}
              title="About Me"
              description="Learn more about my background and experience"
              href="/about"
            />
          </motion.div>
          <motion.div variants={item}>
            <QuickLinkCard
              icon={Mail}
              title="Contact"
              description="Get in touch for collaborations or opportunities"
              href="/contact"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Terminal Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="mb-6 text-xl font-bold text-primary sm:text-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Terminal
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Terminal>
              <div className="terminal-prompt">whoami</div>
              <div className="terminal-output mb-4">Aman Kushwaha (alias: amank-root)</div>

              <div className="terminal-prompt">cat introduction.txt</div>
              <div className="terminal-output mb-4">
                Hello! I&apos;m a Full Stack Developer with expertise in the MERN stack. I have a strong foundation in web development
                and a passion for creating innovative solutions. Currently pursuing my B.Tech in Computer Science, I combine academic
                knowledge with practical development experience.
              </div>

              <div className="terminal-prompt">ls skills/</div>
              <div className="terminal-output mb-4">
                <span className="syntax-string">frontend/</span> <span className="syntax-string">backend/</span>{" "}
                <span className="syntax-string">database/</span> <span className="syntax-string">tools/</span>
              </div>

              <div className="terminal-prompt">ls skills/frontend/</div>
              <div className="terminal-output mb-4">
                <span className="syntax-variable">React.js</span> <span className="syntax-variable">Next.js</span>{" "}
                <span className="syntax-variable">JavaScript</span> <span className="syntax-variable">Tailwind</span>
              </div>

              <div className="terminal-prompt">echo $CONTACT_INFO</div>
              <div className="terminal-output">
                GitHub: github.com/amank-root | LinkedIn: linkedin.com/in/amank-root
              </div>
            </Terminal>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <motion.h2
              className="text-xl font-bold text-primary sm:text-2xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Featured Projects
            </motion.h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/projects">
                  View All <ArrowRight size={16} />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="overflow-hidden rounded-lg border border-border bg-background shadow-md transition-all"
              >
                <div className="relative h-48 w-full">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="mb-2 text-lg font-bold text-accent sm:text-xl">{project.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground sm:text-base">{project.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="sm" variant="outline" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                        <Link href={project.github} target="_blank">
                          <Github size={14} /> GitHub
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="sm" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                        <Link href={project.demo} target="_blank">
                          <ExternalLink size={14} /> Live Demo
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
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

