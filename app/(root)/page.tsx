'use cache'
import { cacheLife } from 'next/cache'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github, Sparkles, Cpu, Layers, Gauge } from 'lucide-react'
import { getFeaturedProjects, getFeaturedBlogPosts, getAbout, getSkills } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { HeroSection } from '@/components/sections/hero-section'
import { SectionHeading, Reveal } from '@/components/section'
import { SpotlightCard } from '@/components/spotlight-card'
import { AnimatedBorder } from '@/components/animated-border'
import { NumberTicker } from '@/components/number-ticker'
import { Marquee } from '@/components/marquee'
import { TextReveal } from '@/components/text-generate'
import { projectPlaceholder } from '@/lib/placeholder'
import type { Project, BlogPost, Skill } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Home',
  alternates: {
    canonical: `/`,
  },
}

/** Bento tiles. Each pairs an icon with a title and one tight sentence. */
const CAPABILITIES = [
  {
    icon: Layers,
    title: 'Product engineering',
    body: 'Full-stack Next.js and TypeScript — design systems, data layers, and the unglamorous parts that keep things fast and accessible.',
    glow: 'var(--aurora-violet)',
  },
  {
    icon: Cpu,
    title: 'Applied machine learning',
    body: 'Retrieval pipelines, fine-tuning and evaluation, wired into real products instead of left in notebooks.',
    glow: 'var(--aurora-cyan)',
  },
  {
    icon: Sparkles,
    title: 'Interface craft',
    body: 'Typography, spacing, motion and accessibility — the difference between a page that works and one people enjoy.',
    glow: 'var(--aurora-coral)',
  },
  {
    icon: Gauge,
    title: 'Platform work',
    body: 'CI, content pipelines, analytics and docs: the infrastructure that keeps a team shipping without drama.',
    glow: 'var(--aurora-violet)',
  },
]

const STATS = [
  { value: 10, suffix: '+', label: 'Projects shipped' },
  { value: 20, suffix: '+', label: 'Technologies' },
  { value: 50, suffix: '+', label: 'GitHub stars' },
  { value: 200, suffix: '+', label: 'Commits this year' },
]

function formatDate(value?: string): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function Home() {
  // Explicit lifetime: the Sanity reads below are already cached, this scopes the
  // rendered page itself. `days` keeps it in the App Shell and prerenders.
  cacheLife('days')

  const [featuredProjects, featuredPosts, about, skills] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getFeaturedBlogPosts().catch(() => []),
    getAbout().catch(() => null),
    getSkills().catch(() => []),
  ])

  const projects = (featuredProjects as Project[]).slice(0, 4)
  const posts = (featuredPosts as BlogPost[]).slice(0, 4)

  // Flatten the CMS skill groups into one list for the marquee, with a static
  // fallback so the section never renders empty.
  const allSkills = (skills as Skill[]).flatMap(group => group.skills ?? [])
  const marqueeItems =
    allSkills.length > 0
      ? allSkills
      : [
          'React',
          'Next.js',
          'TypeScript',
          'Node.js',
          'Python',
          'Tailwind',
          'PostgreSQL',
          'Docker',
          'PyTorch',
          'Sanity',
          'Vercel',
          'LangChain',
        ]

  return (
    <div className="flex flex-col">
      <HeroSection about={about} />

      {/* Stats band — count-ups on scroll, inside an animated gradient border. */}
      <section className="container py-16 sm:py-20">
        <AnimatedBorder duration={8}>
          <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="px-6 py-10 text-center">
                <p className="font-display text-4xl sm:text-5xl">
                  <NumberTicker value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 font-mono text-[0.6875rem] tracking-wider text-foreground-subtle uppercase">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </AnimatedBorder>
      </section>

      {/* Capabilities bento */}
      <section className="container py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="What I do"
            title="Four things I spend most of my time on."
            lede="Not a services list — these are the problems I keep asking for."
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {CAPABILITIES.map((capability, i) => (
            <Reveal key={capability.title} delay={i * 0.08}>
              <SpotlightCard glowColor={capability.glow} className="h-full">
                <capability.icon size={22} className="text-primary" aria-hidden />
                <h3 className="mt-5 font-display text-xl">{capability.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground-muted">{capability.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Selected work */}
      {projects.length > 0 && (
        <section className="container py-20 sm:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Selected work"
              title="Things I shipped recently."
              action={
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs text-foreground-muted transition-colors hover:text-foreground"
                >
                  All projects
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              }
            />
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project._id} delay={i * 0.08}>
                <SpotlightCard className="h-full !p-0" glowColor="var(--aurora-cyan)">
                  <Link href={`/projects/${project.slug.current}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                      <Image
                        src={
                          project.mainImage
                            ? urlFor(project.mainImage).width(700).height(440).url()
                            : projectPlaceholder(project.title)
                        }
                        alt={project.mainImage?.alt || `${project.title} preview`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                      {/* Wash matched to the page background so the image melts
                          into the card rather than ending on a hard edge. It
                          starts at ~55% rather than fully opaque, which keeps
                          the lower third of the cover visible. */}
                      <div className="absolute inset-0 bg-linear-to-t from-background/55 via-background/10 to-transparent" />

                      {project.status && (
                        <span className="absolute top-4 right-4 rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[0.625rem] tracking-wider text-foreground-muted uppercase backdrop-blur-sm">
                          {project.status}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-2xl transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-foreground-muted">
                          {project.description}
                        </p>
                      )}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <span className="font-mono text-[0.6875rem] text-foreground-subtle">
                          {formatDate(project.publishedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-all group-hover:gap-2.5 group-hover:text-foreground">
                          View case
                          <ArrowRight size={14} aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Stack marquee — the tools, moving. */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Stack"
              title="Tools I reach for."
              align="center"
              action={
                <Link
                  href="/skills"
                  className="font-mono text-xs text-foreground-muted transition-colors hover:text-foreground"
                >
                  Full list
                </Link>
              }
            />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Marquee>
            {marqueeItems.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="flex items-center gap-3 px-6 font-display text-2xl text-foreground-subtle transition-colors hover:text-foreground sm:text-3xl"
              >
                {skill}
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              </span>
            ))}
          </Marquee>
        </Reveal>
      </section>

      {/* Writing */}
      {posts.length > 0 && (
        <section className="container py-20 sm:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Writing"
              title="Notes from the work."
              action={
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs text-foreground-muted transition-colors hover:text-foreground"
                >
                  All posts
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              }
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((post, i) => (
              <Reveal key={post._id} delay={i * 0.08}>
                <Link href={`/blog/${post.slug.current}`} className="group block h-full">
                  <SpotlightCard className="h-full" glowColor="var(--aurora-coral)">
                    <div className="flex items-center gap-3 font-mono text-[0.6875rem] text-foreground-subtle">
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.readTime && <span>· {post.readTime} min</span>}
                    </div>
                    <h3 className="mt-4 font-display text-xl leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-foreground-muted">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read <ArrowUpRight size={12} aria-hidden />
                    </span>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Direct repository links — the concrete proof behind the project cards. */}
      {projects.length > 0 && (
        <section className="container pb-8">
          <TextReveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border/60 pt-10 font-mono text-xs text-foreground-subtle">
            {projects.slice(0, 3).map(project => (
              <span key={`links-${project._id}`} className="flex flex-wrap gap-x-5">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <Github size={12} aria-hidden />
                    {project.title}
                  </a>
                )}
              </span>
            ))}
          </TextReveal>
        </section>
      )}
    </div>
  )
}
