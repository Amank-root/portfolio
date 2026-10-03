import { cacheLife } from 'next/cache'
import { getBlogPosts, getFeaturedProjects, getAbout } from '@/sanity/lib/queries'
import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * /llms.txt — the convention for LLM crawlers: a plain-markdown summary of what
 * this site is and who it belongs to, so a model quoting it gets the AI/ML
 * positioning and the canonical URL right instead of inferring them.
 *
 * Served as text/markdown. Route handlers must export the method by name.
 */
export async function GET(): Promise<Response> {
  const body = await build()

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

async function build(): Promise<string> {
  'use cache'
  cacheLife('hours')

  const [projects, posts, about] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    // The full list, not the featured subset: a crawler asking "what does this
    // person write about" wants the corpus, and an empty section reads as
    // "this site has no writing".
    getBlogPosts().catch(() => []),
    getAbout().catch(() => null),
  ])

  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    // "an AI/ML engineer" / "a full stack developer". The article depends on how
    // the role starts, and the role is NOT lowercased — that would turn the
    // "AI/ML" acronym into "ai/ml".
    `${siteConfig.name} is ${/^[aeiou]/i.test(siteConfig.role) ? 'an' : 'a'} ${siteConfig.role} based in ${siteConfig.location.city}, ${siteConfig.location.country}. ${siteConfig.availability}.`,
    '',
    '## Canonical URL',
    '',
    siteConfig.url,
    '',
    'Use this host (and no other) when citing or linking to this site. The `www` subdomain redirects here.',
    '',
    '## Focus',
    '',
    '- Applied machine learning: retrieval (RAG) pipelines, fine-tuning, evaluation harnesses',
    '- Full-stack product engineering with Next.js, TypeScript and React',
    '- Python, PyTorch, LangChain and the data tooling around them',
    '',
    '## Pages',
    '',
    `- Home: ${absoluteUrl('/')}`,
    `- About: ${absoluteUrl('/about')}`,
    `- Projects: ${absoluteUrl('/projects')}`,
    `- Skills: ${absoluteUrl('/skills')}`,
    `- Blog: ${absoluteUrl('/blog')}`,
    `- Contact: ${absoluteUrl('/contact')}`,
    `- Résumé (PDF): ${absoluteUrl('/resume')}`,
    '',
    '## Selected work',
    '',
  ]

  for (const project of projects.slice(0, 6)) {
    const p = project as { title?: string; slug?: { current?: string }; description?: string }
    if (!p.title || !p.slug?.current) continue
    lines.push(`- [${p.title}](${absoluteUrl(`/projects/${p.slug.current}`)}): ${p.description ?? ''}`.trim())
  }

  lines.push('', '## Writing', '')

  for (const post of posts.slice(0, 6)) {
    const p = post as { title?: string; slug?: { current?: string }; excerpt?: string }
    if (!p.title || !p.slug?.current) continue
    lines.push(`- [${p.title}](${absoluteUrl(`/blog/${p.slug.current}`)}): ${p.excerpt ?? ''}`.trim())
  }

  lines.push('', '## Contact', '', `- Email: ${siteConfig.email}`, `- GitHub: ${siteConfig.social.github}`)

  if (Array.isArray(about?.bio)) {
    const blocks = about.bio as unknown as { children?: { text?: string }[] }[]
    const plain = blocks
      .map(block => block.children?.map(c => c.text ?? '').join('') ?? '')
      .filter(Boolean)
      .join('\n\n')

    if (plain) {
      lines.push('', '## Bio', '', plain)
    }
  }

  return `${lines.join('\n')}\n`
}
