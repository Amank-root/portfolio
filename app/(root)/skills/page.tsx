import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getSkills } from '@/sanity/lib/queries'
import { PageHeader, Reveal } from '@/components/section'
import { SpotlightCard } from '@/components/spotlight-card'

/** Rotate the spotlight hue per tile so the grid doesn't read as one colour. */
const GLOWS = ['var(--aurora-violet)', 'var(--aurora-cyan)', 'var(--aurora-coral)', 'var(--aurora-violet)']
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, collectionSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import type { Skill } from '@/sanity/lib/types'

const SKILLS_DESCRIPTION =
  'The technical toolkit of Aman Kushwaha — AI/ML (PyTorch, RAG, fine-tuning, evaluation), frontend (React, Next.js, TypeScript), backend (Node.js, Python) and cloud.'

export const metadata: Metadata = {
  title: 'Skills',
  description: SKILLS_DESCRIPTION,
  alternates: {
    canonical: '/skills',
  },
  openGraph: {
    title: `Skills | ${siteConfig.name}`,
    description: SKILLS_DESCRIPTION,
    url: absoluteUrl('/skills'),
    type: 'website',
    // Repeating the layout's images is required: a route-level openGraph
    // object replaces the inherited one key-by-key rather than merging it.
    images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: siteConfig.title, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Skills | ${siteConfig.name}`,
    description: SKILLS_DESCRIPTION,
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    images: [absoluteUrl('/og.png')],
  },
}

/** Display order and labels for the CMS categories. */
const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Data & Infrastructure',
  other: 'AI & Machine Learning',
}

const CATEGORY_NOTES: Record<string, string> = {
  frontend: 'Interfaces I build and the tooling around them.',
  backend: 'Services, APIs and the machine learning work behind them.',
  tools: 'Where data lives and how it gets deployed.',
  other: 'The ML stack, plus the rest of the toolkit and how I work.',
}

/**
 * Canonical brand casing for skill names that get typed as `Lora`, `Pytorch`
 * or `Tensorflow`. These live in Sanity, so the misspelling is data rather than
 * code — correcting it at render keeps the CMS editable without letting a
 * lowercase "pytorch" reach a `<title>`, a schema blob or a keyword list.
 *
 * Keyed case-insensitively; unknown skills pass through untouched.
 */
const BRAND_CASING: Record<string, string> = {
  lora: 'LoRA',
  qlora: 'QLoRA',
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  'scikit-learn': 'scikit-learn',
  'next.js': 'Next.js',
  'node.js': 'Node.js',
  fastapi: 'FastAPI',
  langchain: 'LangChain',
  'react.js': 'React',
  reactjs: 'React',
  tailwind: 'Tailwind CSS',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  'mongo db': 'MongoDB',
  supabase: 'Supabase',
  vercel: 'Vercel',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  aws: 'AWS',
  gcp: 'GCP',
  openai: 'OpenAI',
  huggingface: 'Hugging Face',
  'hugging face': 'Hugging Face',
  sklearn: 'scikit-learn',
  'computer vision': 'Computer Vision',
  'data science': 'Data Science',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'web development': 'Web Development',
  'design systems': 'Design Systems',
  'ci/cd': 'CI/CD',
}

function normalizeSkill(name: string): string {
  return BRAND_CASING[name.trim().toLowerCase()] ?? name
}

const FALLBACK_SKILLS: Skill[] = [
  {
    _id: '1',
    title: 'Frontend',
    description: '',
    category: 'frontend',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
  },
  {
    _id: '2',
    title: 'Backend',
    description: '',
    category: 'backend',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'Python', 'REST APIs', 'GraphQL', 'WebSockets'],
  },
  {
    _id: '3',
    title: 'Database & Cloud',
    description: '',
    category: 'tools',
    skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase', 'Sanity CMS', 'Vercel', 'AWS S3'],
  },
  {
    _id: '4',
    title: 'AI & Tools',
    description: '',
    category: 'other',
    skills: ['Machine Learning', 'TensorFlow', 'Git', 'Docker', 'Linux', 'Figma', 'Postman'],
  },
]

export default function SkillsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          collectionSchema({ name: 'Skills', path: '/skills', description: SKILLS_DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Skills', path: '/skills' },
          ])
        )}
      />
      <Suspense fallback={<SkillsPageSkeleton />}>
        <SkillsPageContent />
      </Suspense>
    </>
  )
}

async function SkillsPageContent() {
  const sanitySkills = (await getSkills().catch(() => [])) as Skill[]
  const skills = sanitySkills.length > 0 ? sanitySkills : FALLBACK_SKILLS

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  // Render categories in a fixed editorial order rather than CMS insertion
  // order, so the page reads the same way on every visit. AI/ML leads: it is
  // the positioning the rest of the site commits to, and burying it in the
  // fourth tile contradicted the title and the Person schema.
  const order = ['other', 'frontend', 'backend', 'tools']
  const categories = order.filter(key => grouped[key]?.length)

  return (
    <div className="container">
      <PageHeader
        eyebrow="Toolkit"
        title="What I work with."
        lede="The ML stack first, then everything around it. A working list, not a certification wall — anything here has shipped something."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category, i) => {
          const label = CATEGORY_LABELS[category] ?? category
          return (
            <Reveal key={category} delay={i * 0.08}>
              <SpotlightCard className="h-full" glowColor={GLOWS[i % GLOWS.length]}>
                <p className="eyebrow font-mono text-primary">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-4 font-display text-2xl">{label}</h2>
                {CATEGORY_NOTES[category] && (
                  <p className="mt-3 text-sm leading-relaxed text-foreground-subtle">{CATEGORY_NOTES[category]}</p>
                )}

                {grouped[category].map(group => (
                  <div key={group._id} className="mt-6 border-t border-border/60 pt-5">
                    {group.title && group.title !== label && <p className="eyebrow mb-3">{group.title}</p>}
                    {group.description && (
                      <p className="mb-4 text-[0.9rem] leading-relaxed text-foreground-muted">{group.description}</p>
                    )}
                    <ul className="flex flex-wrap gap-2">
                      {group.skills?.map(rawSkill => (
                        <li key={rawSkill} className="tag-pill">
                          {normalizeSkill(rawSkill)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </SpotlightCard>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

function SkillsPageSkeleton() {
  return (
    <div className="container animate-pulse">
      <div className="pt-16 pb-14 sm:pt-24">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="mt-6 h-12 w-2/3 max-w-xl rounded bg-muted" />
        <div className="mt-7 h-4 w-full max-w-lg rounded bg-muted/70" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-2xl border border-border bg-card/40 p-6">
            <div className="h-3 w-8 rounded bg-muted" />
            <div className="h-6 w-40 rounded bg-muted" />
            <div className="h-3 w-56 rounded bg-muted/60" />
            <div className="flex flex-wrap gap-2 pt-4">
              {Array.from({ length: 8 }).map((__, j) => (
                <div key={j} className="h-6 w-20 rounded-full bg-muted/60" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
