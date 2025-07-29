'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, Server, Wrench, Braces, Database, Globe, GitBranch, Cloud, Palette } from 'lucide-react'
import { useHasMounted } from '@/components/client-only'
import { getSkills } from '@/sanity/lib/queries'
import { Skill } from '@/sanity/lib/types'

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

  // Fallback skills data
  const fallbackSkills: Skill[] = useMemo(
    () => [
      {
        _id: 'frontend',
        _type: 'skill',
        title: 'Frontend Development',
        description: 'Creating responsive and interactive user interfaces',
        category: 'frontend',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
        icon: 'Code',
        order: 1,
      },
      {
        _id: 'backend',
        _type: 'skill',
        title: 'Backend Development',
        description: 'Building robust server-side applications and APIs',
        category: 'backend',
        skills: ['Node.js', 'Express.js', 'Python', 'MongoDB', 'PostgreSQL', 'REST APIs'],
        icon: 'Server',
        order: 2,
      },
      {
        _id: 'tools',
        _type: 'skill',
        title: 'Development Tools',
        description: 'Tools and technologies for efficient development',
        category: 'tools',
        skills: ['Git', 'VS Code', 'Docker', 'AWS', 'Vercel', 'Figma'],
        icon: 'Wrench',
        order: 3,
      },
    ],
    []
  )

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
  }, [mounted, fallbackSkills])

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    return skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
      },
      {} as Record<string, Skill[]>
    )
  }, [skills])

  // Icon mapping
  const iconMap: Record<string, React.ElementType> = useMemo(
    () => ({
      Code,
      Server,
      Wrench,
      Braces,
      Database,
      Globe,
      GitBranch,
      Cloud,
      Palette,
    }),
    []
  )

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
            As a Full Stack Developer, I specialize in the MERN stack and modern web technologies. Here&apos;s an
            overview of my technical skills and areas of expertise.
          </motion.p>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted"></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Grid */}
      {!loading && (
        <section className="px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Tabs defaultValue="frontend" className="w-full">
              <TabsList className="grid w-full h-auto grid-cols-2 gap-1 p-1 sm:grid-cols-4 sm:gap-2">
                <TabsTrigger value="frontend" className="text-xs font-medium sm:text-sm">
                  Frontend
                </TabsTrigger>
                <TabsTrigger value="backend" className="text-xs font-medium sm:text-sm">
                  Backend
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs font-medium sm:text-sm">
                  Tools
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs font-medium sm:text-sm">
                  All
                </TabsTrigger>
              </TabsList>

              {/* Frontend Skills */}
              <TabsContent value="frontend" className="mt-4 sm:mt-6">
                <motion.div
                  className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {skillsByCategory.frontend?.map(skill => (
                    <motion.div key={skill._id} variants={item} className="h-full">
                      <SkillCard
                        icon={getIcon(skill.icon)}
                        title={skill.title}
                        description={skill.description}
                        skills={skill.skills}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Backend Skills */}
              <TabsContent value="backend" className="mt-4 sm:mt-6">
                <motion.div
                  className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {skillsByCategory.backend?.map(skill => (
                    <motion.div key={skill._id} variants={item} className="h-full">
                      <SkillCard
                        icon={getIcon(skill.icon)}
                        title={skill.title}
                        description={skill.description}
                        skills={skill.skills}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Tools Skills */}
              <TabsContent value="tools" className="mt-4 sm:mt-6">
                <motion.div
                  className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {skillsByCategory.tools?.map(skill => (
                    <motion.div key={skill._id} variants={item} className="h-full">
                      <SkillCard
                        icon={getIcon(skill.icon)}
                        title={skill.title}
                        description={skill.description}
                        skills={skill.skills}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* All Skills */}
              <TabsContent value="all" className="mt-4 sm:mt-6">
                <motion.div
                  className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {skills.map(skill => (
                    <motion.div key={skill._id} variants={item} className="h-full">
                      <SkillCard
                        icon={getIcon(skill.icon)}
                        title={skill.title}
                        description={skill.description}
                        skills={skill.skills}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}
    </div>
  )
}
