/**
 * Single source of truth for site-wide constants.
 * Anything URL-related (metadata, sitemap, robots, JSON-LD, OG images) reads
 * from here so the canonical host can never drift between routes.
 */

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

export const siteConfig = {
  name: 'Aman Kushwaha',
  shortName: 'Aman',
  title: 'Aman Kushwaha — Full Stack Developer & AI/ML Engineer',
  titleTemplate: '%s | Aman Kushwaha',
  role: 'Full Stack Developer',
  tagline: 'Full Stack Developer',
  description:
    'Aman Kushwaha is a full stack developer and AI/ML engineer building fast, accessible web products with Next.js, TypeScript, React and Python. He ships machine learning systems, design-system-grade interfaces and open-source tools.',
  shortDescription:
    'Full stack developer and AI/ML engineer building fast, accessible web products with Next.js, TypeScript and Python.',
  locale: 'en_US',
  url: rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://www.amankushwaha.dev',
  email: 'contact@amank-root.slmail.me',
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
    url: rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://www.amankushwaha.dev',
  },
  keywords: [
    'Aman Kushwaha',
    'amank-root',
    'Full Stack Developer',
    'Data Scientist',
    'AI/ML Engineer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'MERN Stack',
    'Machine Learning',
    'Python',
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
