import { absoluteUrl, siteConfig } from './site'

type Json = Record<string, unknown>

/**
 * Structured data helpers. Google consumes these for rich results (article
 * cards, knowledge panels, breadcrumbs) — they are the highest-leverage SEO
 * surface on a content site, and they were entirely missing before.
 */

const PERSON_ID = absoluteUrl('/#person')
const WEBSITE_ID = absoluteUrl('/#website')

export function personSchema(): Json {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl('/aman-pic.jpg'),
    jobTitle: 'Full Stack Developer',
    description: siteConfig.shortDescription,
    email: `mailto:${siteConfig.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    knowsAbout: [
      'Machine Learning',
      'Artificial Intelligence',
      'TypeScript',
      'React',
      'Next.js',
      'Python',
      'Data Science',
    ],
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.twitter],
  }
}

export function webSiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.shortDescription,
    inLanguage: 'en-US',
    publisher: { '@id': PERSON_ID },
  }
}

export function blogPostingSchema(input: {
  title: string
  description?: string
  slug: string
  publishedAt?: string
  authorName?: string
  image?: string
  categories?: string[]
  keywords?: string[]
}): Json {
  const url = absoluteUrl(`/blog/${input.slug}`)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.title.slice(0, 110),
    description: input.description,
    url,
    ...(input.image ? { image: [input.image] } : {}),
    datePublished: input.publishedAt,
    dateModified: input.publishedAt,
    author: {
      '@type': 'Person',
      name: input.authorName || siteConfig.name,
      url: siteConfig.url,
    },
    publisher: { '@id': PERSON_ID },
    ...(input.categories?.length ? { articleSection: input.categories } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

export function collectionSchema(input: { name: string; path: string; description?: string }): Json {
  return {
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
  }
}

/** Wraps one or more schema objects into a single @graph document. */
export function graph(...nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
