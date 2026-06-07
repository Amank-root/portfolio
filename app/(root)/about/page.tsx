"use cache";

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAbout } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/portable-text-components'
import { Button } from '@/components/ui/button'
import {
  Briefcase, GraduationCap, Heart, Download, ExternalLink,
  Calendar, MapPin, Code2, User, Clock
} from 'lucide-react'
import type { About } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Aman Kushwaha — Full Stack Developer, MERN specialist, and AI/ML enthusiast.',
}

// export const revalidate = 60

export default async function AboutPage() {
  const about = await getAbout().catch(() => null) as About | null

  // Resume URL: prefer Sanity CMS asset, fallback to static file
  const resumeUrl = about?.resumeFile?.asset?.url || '/AmanKushwaha_Resume.pdf'

  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <span className="section-label mb-3 flex items-center gap-2">
            <User size={12} />
            About Me
          </span>
          <h1 className="text-4xl font-bold gradient-text">My Story</h1>
        </div>

        {/* Profile + Bio */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          <div className="shrink-0">
            {about?.profileImage?.asset?.url ? (
              <div className="relative w-52 h-52 rounded-2xl overflow-hidden border-2 border-primary/30 glow-primary mx-auto lg:mx-0">
                <Image
                  src={urlFor(about.profileImage).width(400).height(400).url()}
                  alt={about.profileImage.alt || 'Aman Kushwaha'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-52 h-52 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto lg:mx-0">
                <User size={64} className="text-primary/40" />
              </div>
            )}

            {/* Download resume - uses Sanity CMS url if available */}
            <div className="mt-5 text-center lg:text-left">
              <Link href={resumeUrl} target="_blank" download>
                <Button className="gap-2 w-full lg:w-auto bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
                  <Download size={14} />
                  Download Resume
                </Button>
              </Link>
              {about?.resumeFile?.asset?.url && (
                <p className="text-xs text-accent mt-2 flex items-center gap-1 justify-center lg:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {/* Latest from Sanity CMS */}
                  Click to Download
                </p>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {about?.title || 'About Me'}
            </h2>

            {about?.bio ? (
              <div className="prose-blog">
                <PortableText value={about.bio} components={portableTextComponents} />
              </div>
            ) : (
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  I&apos;m a passionate Full Stack Developer currently pursuing B.Tech in Computer Science
                  and Engineering. I love creating efficient, scalable, and user-friendly solutions using
                  modern web technologies.
                </p>
                <p>
                  My expertise spans across the MERN stack, Next.js, TypeScript, and AI/ML development.
                  I enjoy taking on challenging projects that push the boundaries of what&apos;s possible.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary" />
                India
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap size={14} className="text-primary" />
                B.Tech CS, MDU Rohtak
              </div>
              <div className="flex items-center gap-2 text-sm text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Available for hire
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        {about?.experiences && about.experiences.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Briefcase size={18} className="text-primary" />
              Experience
            </h2>
            <div className="space-y-4">
              {about.experiences.map((exp, i) => (
                <div key={i} className="glass rounded-xl p-5 border border-border/50 hover:border-primary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-primary text-sm font-medium">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar size={11} />
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      {' — '}
                      {exp.current ? <span className="text-accent font-medium">Present</span> : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{exp.description}</p>
                  )}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map(skill => (
                        <span key={skill} className="tag-pill text-[11px]">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {about?.education && about.education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <GraduationCap size={18} className="text-primary" />
              Education
            </h2>
            <div className="space-y-4">
              {about.education.map((edu, i) => (
                <div key={i} className="glass rounded-xl p-5 border border-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-accent text-sm">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar size={11} />
                      {edu.startDate ? new Date(edu.startDate).getFullYear() : ''}
                      {' — '}
                      {edu.current ? <span className="text-accent font-medium">Present</span> : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {about?.interests && about.interests.length > 0 && (
          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Heart size={18} className="text-primary" />
              Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {about.interests.map((interest, i) => (
                <div key={i} className="glass rounded-full px-4 py-2 border border-border/50 hover:border-primary/30 transition-colors">
                  <span className="text-sm text-foreground/80">{interest.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
