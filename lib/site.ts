/**
 * Single source of truth for site-wide constants.
 * Anything URL-related (metadata, sitemap, robots, JSON-LD, OG images) reads
 * from here so the canonical host can never drift between routes.
 */

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

/**
 * The one canonical origin. Apex, not www — that is the host that actually
 * serves, and every consumer (canonical, og:url, JSON-LD, robots Host,
 * sitemap) reads from here, so the two hosts can never drift apart again.
 */
const canonicalUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://amankushwaha.dev'

export const siteConfig = {
  name: 'Aman Kushwaha',
  shortName: 'Aman',
  title: 'Aman Kushwaha — AI/ML Engineer & Full Stack Developer',
  titleTemplate: '%s | Aman Kushwaha',
  // ML leads everywhere: title, H1, schema and hero alt all read from this.
  role: 'AI/ML Engineer',
  tagline: 'AI/ML Engineer',
  description:
    'AI/ML engineer and full stack developer building retrieval systems, fine-tuning and evaluation pipelines — and the fast, accessible Next.js products that ship them.',
  shortDescription:
    'AI/ML engineer building retrieval, fine-tuning and evaluation pipelines, plus the accessible Next.js products that ship them.',
  // Availability line. "Remote" belongs on the homepage and About — it is a
  // screening keyword for the roles this site is actually aimed at.
  availability: 'Open to remote AI/ML and full stack roles',
  locale: 'en_US',
  url: canonicalUrl,
  email: 'query@amankushwaha.dev',
  location: {
    city: 'New Delhi',
    region: 'Delhi',
    country: 'India',
    countryCode: 'IN',
  },
  social: {
    github: 'https://github.com/amank-root',
    linkedin: 'https://linkedin.com/in/amank-root',
    twitter: 'https://twitter.com/AmanKushwaha_28',
  },
  author: {
    twitter: '@AmanKushwaha_28',
    name: 'Aman Kushwaha',
    url: canonicalUrl,
  },
  keywords: [
    'Aman Kushwaha',
    'amank-root',
    'AI/ML Engineer',
    'Machine Learning Engineer',
    'Full Stack Developer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'Python',
    'RAG',
    'Data Science',
    'Portfolio',
  ],
  /** Fallback OG image. Generated per-route with opengraph-image.tsx where possible. */
  ogImage: '/opengraph-image',
} as const

/** Absolute URL helper — always returns a fully-qualified URL. */
export function absoluteUrl(path = '/'): string {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.url}${suffix === '/' ? '' : suffix}`
}

/** Drops undefined/empty values so Next never emits `metadata: undefined`. */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Partial<T>
}
