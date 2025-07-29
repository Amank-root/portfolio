"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Server,
  Wrench,
  Braces,
  Database,
  Globe,
  GitBranch,
  Cloud,
  Palette,
} from "lucide-react"
import { useHasMounted } from "@/components/client-only"
import { getSkills } from "@/sanity/lib/queries"
import { Skill } from "@/sanity/lib/types"

interface SkillCardProps {
  icon: React.ElementType
  title: string
  description: string
  skills: string[]
}

function SkillCard({ icon: Icon, title, description, skills }: SkillCardProps) {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5 sm:p-2">
              <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
            <CardTitle className="text-sm sm:text-base lg:text-lg">{title}</CardTitle>
          </div>
          <CardDescription className="mt-2 text-xs sm:text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
            {skills.map((skill, index) => (
              <motion.span
                key={index}
                className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Skills() {
  const mounted = useHasMounted()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch skills from Sanity
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        const skillsData = await getSkills()
        setSkills(skillsData || fallbackSkills)
      } catch (error) {
        console.error('Error fetching skills:', error)
        setSkills(fallbackSkills)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchSkills()
    }
  }, [mounted])

  // Fallback skills data
  const fallbackSkills: Skill[] = [
    {
      _id: "frontend",
      _type: "skill",
      title: "Frontend Development",
      description: "Creating responsive and interactive user interfaces",
      category: "frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
      icon: "Code",
      order: 1
    },
    {
      _id: "backend",
      _type: "skill", 
      title: "Backend Development",
      description: "Building robust server-side applications and APIs",
      category: "backend",
      skills: ["Node.js", "Express.js", "Python", "MongoDB", "PostgreSQL", "REST APIs"],
      icon: "Server",
      order: 2
    },
    {
      _id: "tools",
      _type: "skill",
      title: "Development Tools",
      description: "Tools and technologies for efficient development",
      category: "tools", 
      skills: ["Git", "VS Code", "Docker", "AWS", "Vercel", "Figma"],
      icon: "Wrench",
      order: 3
    }
  ]

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Icon mapping
  const iconMap: Record<string, React.ElementType> = {
    Code,
    Server, 
    Wrench,
    Braces,
    Database,
    Globe,
    GitBranch,
    Cloud,
    Palette,
  }

  // Get icon component
  const getIcon = (iconName?: string) => {
    if (!iconName) return Code
    return iconMap[iconName] || Code
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="bg-card px-3 py-8 sm:px-4 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h1 
            className="mb-3 text-xl font-bold text-primary sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Skills & Expertise
          </motion.h1>
          <motion.p 
            className="max-w-3xl text-sm text-muted-foreground sm:text-base lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            As a Full Stack Developer, I specialize in the MERN stack and modern web technologies.
            Here&apos;s an overview of my technical skills and areas of expertise.
          </motion.p>
        </div>
      </section>
      
      {/* Skills Tabs */}
      <section className="px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="frontend" className="w-full">
            <TabsList className="grid w-full h-auto grid-cols-2 gap-1 p-1 sm:grid-cols-4 sm:gap-2">
              <TabsTrigger value="frontend" className="text-xs font-medium sm:text-sm">Frontend</TabsTrigger>
              <TabsTrigger value="backend" className="text-xs font-medium sm:text-sm">Backend</TabsTrigger>
              <TabsTrigger value="tools" className="text-xs font-medium sm:text-sm">Tools</TabsTrigger>
              <TabsTrigger value="other" className="text-xs font-medium sm:text-sm">Other</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frontend" className="mt-4 sm:mt-6">
              <motion.div 
                className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Braces}
                    title="Core Technologies"
                    description="Proficient in JavaScript and modern web development fundamentals."
                    skills={["JavaScript", "HTML5", "CSS3", "ES6+", "TypeScript"]}
                  />
                </motion.div>
                
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Code}
                    title="Frontend Framework"
                    description="Experience with React.js ecosystem and modern frontend development."
                    skills={["React.js", "Next.js", "Redux", "React Hooks"]}
                  />
                </motion.div>
                
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Palette}
                    title="Styling & UI"
                    description="Modern CSS frameworks and UI design implementation."
                    skills={["Tailwind CSS", "Material UI", "Responsive Design", "CSS3"]}
                  />
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="backend" className="mt-6">
              <motion.div 
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Server}
                    title="Backend Development"
                    description="Experience with Node.js and Express.js for building RESTful APIs."
                    skills={["Node.js", "Express.js", "REST APIs", "JWT", "Auth.js", "Redis"]}
                  />
                </motion.div>
                
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Database}
                    title="Database"
                    description="Experience with MongoDB and database management."
                    skills={["MongoDB", "Mongoose", "Database Design", "CRUD Operations", "MySql", "NeonDB"]}
                  />
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="tools" className="mt-6">
              <motion.div 
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={GitBranch}
                    title="Version Control"
                    description="Proficient with Git and GitHub for version control and collaboration."
                    skills={["Git", "GitHub", "Version Control", "Collaboration"]}
                  />
                </motion.div>
                
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Wrench}
                    title="Development Tools"
                    description="Experience with modern development tools and environments."
                    skills={["VS Code", "npm", "Postman", "Chrome DevTools"]}
                  />
                </motion.div>

                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Cloud}
                    title="Deployment"
                    description="Experience with web hosting and deployment platforms."
                    skills={["Vercel", "Netlify", "Cloudflare Pages", "Cloudflare Workers"]}
                  />
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="other" className="mt-6">
              <motion.div 
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="h-full">
                  <SkillCard 
                    icon={Globe}
                    title="Other Skills"
                    description="Additional technical and soft skills."
                    skills={["Problem Solving", "Team Collaboration", "Time Management", "Communication"]}
                  />
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

