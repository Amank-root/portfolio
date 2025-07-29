'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Terminal } from '@/components/terminal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, GraduationCap, Heart, Coffee, Gamepad2, BookOpen, Music, Code, Download } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useHasMounted } from '@/components/client-only'
import { getAbout } from '@/sanity/lib/queries'
import type { About } from '@/sanity/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export default function About() {
  const mounted = useHasMounted()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [aboutData, setAboutData] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)

  // Fallback data
  // @ts-expect-error Temporary fallback data structure for development with incomplete type definitions
  const fallbackAboutData: About = useMemo(
    () => ({
      _id: 'about',
      _type: 'about',
      title: 'About Me',
      bio: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: [],
              text: "I'm a passionate Full Stack Developer currently pursuing B.Tech in Computer Science and Engineering. I love creating efficient, scalable, and user-friendly solutions using modern web technologies.",
            },
          ],
        },
      ],
      experiences: [
        {
          title: 'Campus Ambassador',
          company: 'GeeksforGeeks',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          current: false,
          description:
            'Represented GeeksforGeeks at my college by organizing coding contests, seminars, and workshops.',
          skills: ['Event Planning', 'Leadership', 'Communication', 'Marketing'],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Technology in Data Science',
          institution: 'MDU, Rohtak',
          startDate: '2023-01-01',
          endDate: '2027-01-01',
          current: true,
          description: 'Currently pursuing B.Tech with focus on data science and web development',
        },
      ],
      interests: [
        { name: 'Coding', icon: 'Code' },
        { name: 'Gaming', icon: 'Gamepad2' },
        { name: 'Music', icon: 'Music' },
      ],
    }),
    []
  )

  // Fetch about data from Sanity
  useEffect(() => {
    async function fetchAbout() {
      try {
        setLoading(true)
        const data = await getAbout()
        setAboutData(data || fallbackAboutData)
      } catch (error) {
        console.error('Error fetching about data:', error)
        setAboutData(fallbackAboutData)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchAbout()
    }
  }, [mounted, fallbackAboutData])

  // Use aboutData or fallback
  const currentData = aboutData || fallbackAboutData

  // Icon mapping for interests
  const iconMap: Record<string, React.ElementType> = {
    Code,
    Gamepad2,
    Music,
    Coffee,
    BookOpen,
    Heart,
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
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (!mounted || loading) {
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6">
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-muted"></div>
        <div className="mb-8 h-64 w-full animate-pulse rounded bg-muted"></div>
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
              {currentData.title || 'About Me'}
            </h1>
            <div className="mb-6 text-base text-muted-foreground sm:text-lg">
              {currentData.bio ? (
                <PortableText value={currentData.bio} />
              ) : (
                <p>
                  I&apos;m a passionate Full Stack Developer currently pursuing my B.Tech in Computer Science. I
                  specialize in MERN stack development and have a strong foundation in web technologies. I love turning
                  complex problems into simple, beautiful, and intuitive solutions.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size={isMobile ? 'default' : 'lg'} className="gap-2">
                  <Link href="/contact">Get In Touch</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size={isMobile ? 'default' : 'lg'} className="gap-2">
                  <Link href="/AmanKushwaha_Resume.pdf" target="_blank" download>
                    Download Resume <Download size={16} />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="relative h-48 w-48 overflow-hidden rounded-lg border-4 border-accent sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Image
                src={(() => {
                  try {
                    return currentData.profileImage && currentData.profileImage.asset?._id
                      ? urlFor(currentData.profileImage).width(400).height(400).url()
                      : '/aman-pic.jpg'
                  } catch (error) {
                    console.warn('Error generating profile image URL:', error)
                    return '/aman-pic.jpg'
                  }
                })()}
                alt={currentData.profileImage?.alt || 'Profile'}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="mb-8 h-auto grid w-full grid-cols-3">
              <TabsTrigger value="experience" className="text-xs sm:text-sm md:text-base">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs sm:text-sm md:text-base">
                Education
              </TabsTrigger>
              <TabsTrigger value="personal" className="text-xs sm:text-sm md:text-base">
                Personal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="experience" className="mt-0">
              <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
                {currentData.experiences?.map((experience, idx) => (
                  <motion.div key={idx} variants={item}>
                    <TimelineItem
                      title={experience.title}
                      company={experience.company}
                      date={`${new Date(experience.startDate).getFullYear()} - ${experience.current ? 'Present' : new Date(experience.endDate || '').getFullYear()}`}
                      description={experience.description}
                      skills={experience.skills || []}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <motion.div
                className="grid gap-4 sm:gap-6 md:grid-cols-2"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {currentData.education?.map((edu, idx) => (
                  <motion.div key={edu.degree + idx} variants={item}>
                    <EducationCard
                      degree={edu.degree}
                      institution={edu.institution}
                      date={`${new Date(edu.startDate).getFullYear()} - ${edu.current ? 'Present' : new Date(edu.endDate || '').getFullYear()}`}
                      description={edu.description || ''}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="personal" className="mt-0">
              <motion.div
                className="grid gap-4 sm:gap-6 md:grid-cols-2"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Heart className="h-4 w-4 text-accent sm:h-5 sm:w-5" /> Interests & Hobbies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 sm:gap-4">
                      {currentData.interests?.map((interest, idx) => {
                        const IconComponent = getIcon(interest.icon)
                        return <InterestItem key={idx} icon={IconComponent} text={interest.name} />
                      })}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Terminal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Terminal>
                        <div className="terminal-prompt">cat about_me.md</div>
                        <div className="terminal-output mb-4">
                          # About Me I&apos;m a dedicated Full Stack Developer with a passion for creating efficient and
                          scalable web applications. Currently pursuing my B.Tech in Computer Science, I combine my
                          academic knowledge with practical development experience. I&apos;m always eager to learn new
                          technologies and contribute to innovative projects.
                        </div>

                        <div className="terminal-prompt">echo $LIFE_PHILOSOPHY</div>
                        <div className="terminal-output">
                          &quot;Code is not just about making things work, it&apos;s about making them work
                          elegantly.&quot;
                        </div>
                      </Terminal>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

interface TimelineItemProps {
  title: string
  company: string
  date: string
  description: string
  skills: string[]
}

function TimelineItem({ title, company, date, description, skills }: TimelineItemProps) {
  return (
    <motion.div className="relative border-l border-border pl-6" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
      <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Briefcase className="h-3 w-3" />
      </div>

      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h3>
        <span className="text-xs text-muted-foreground sm:text-sm">at {company}</span>
      </div>

      <p className="mb-2 text-xs text-muted-foreground sm:text-sm">{date}</p>
      <p className="mb-4 text-sm text-muted-foreground sm:text-base">{description}</p>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

interface EducationCardProps {
  degree: string
  institution: string
  date: string
  description?: string
}

function EducationCard({ degree, institution, date, description = '' }: EducationCardProps) {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card className="h-full">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex items-start gap-3 sm:gap-4">
            <div className="rounded-full bg-accent/10 p-2 sm:p-3">
              <GraduationCap className="h-4 w-4 text-accent sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold sm:text-lg">{degree}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {institution} | {date}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface InterestItemProps {
  icon: React.ElementType
  text: string
}

function InterestItem({ icon: Icon, text }: InterestItemProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <div className="flex items-center gap-2 rounded-md border border-border p-2">
        <Icon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">{text}</span>
      </div>
    </motion.div>
  )
}
