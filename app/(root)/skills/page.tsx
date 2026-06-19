import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getSkills } from '@/sanity/lib/queries'
import { Code2, Globe, Server, Wrench, Cpu } from 'lucide-react'
import type { Skill } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills and expertise of Aman Kushwaha — frontend, backend, databases, and tools.',
  alternates: {
    canonical: `/skills`
  }
}

// export const revalidate = 60

const categoryConfig: Record<string, { label: string; icon: typeof Code2; color: string }> = {
  frontend: { label: 'Frontend', icon: Globe, color: 'text-primary' },
  backend: { label: 'Backend', icon: Server, color: 'text-accent' },
  tools: { label: 'Tools & DevOps', icon: Wrench, color: 'text-secondary' },
  other: { label: 'Other', icon: Cpu, color: 'text-muted-foreground' },
}

const FALLBACK_SKILLS: Skill[] = [
  { _id: '1', title: 'Frontend', description: '', category: 'frontend', skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'] },
  { _id: '2', title: 'Backend', description: '', category: 'backend', skills: ['Node.js', 'Express.js', 'FastAPI', 'Python', 'REST APIs', 'GraphQL', 'WebSockets'] },
  { _id: '3', title: 'Database & Cloud', description: '', category: 'tools', skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase', 'Sanity CMS', 'Vercel', 'AWS S3'] },
  { _id: '4', title: 'AI & Tools', description: '', category: 'other', skills: ['Machine Learning', 'TensorFlow', 'Git', 'Docker', 'Linux', 'Figma', 'Postman'] },
]

export default function SkillsPage() {
  return (
    <Suspense fallback={<SkillsPageSkeleton />}>
      <SkillsPageContent />
    </Suspense>
  )
}

async function SkillsPageContent() {
  const sanitySkills = await getSkills().catch(() => []) as Skill[]
  const skills = sanitySkills.length > 0 ? sanitySkills : FALLBACK_SKILLS

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <span className="section-label mb-3 flex items-center gap-2">
            <Code2 size={12} />
            Expertise
          </span>
          <h1 className="text-4xl font-bold gradient-text">Skills</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            My technical toolkit — continuously growing and evolving.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categorySkills]) => {
            const config = categoryConfig[category] || categoryConfig.other
            return (
              <div key={category} className="glass rounded-xl p-6 border border-border/50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <config.icon size={16} className={config.color} />
                  </div>
                  <h2 className="font-semibold text-foreground">{config.label}</h2>
                </div>

                {categorySkills.map((group) => (
                  <div key={group._id} className="mb-5 last:mb-0">
                    {group.title && group.title !== config.label && (
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">{group.title}</h3>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {group.skills?.map((skill) => (
                        <div
                          key={skill}
                          className="group flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-sm text-foreground/80 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-default"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SkillsPageSkeleton() {
  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-12 space-y-3">
          <div className="h-4 w-24 rounded-full bg-muted/40" />
          <div className="h-10 w-40 rounded-lg bg-muted/40" />
          <div className="h-4 w-full max-w-lg rounded-lg bg-muted/30" />
        </div>

        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/50 bg-muted/20 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted/40" />
                <div className="h-5 w-32 rounded-lg bg-muted/40" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 7 }).map((_, skillIndex) => (
                  <div key={skillIndex} className="h-8 w-24 rounded-lg bg-muted/30" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
