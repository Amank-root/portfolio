import type { MetadataRoute } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { getBlogPosts, getProjects } from '@/sanity/lib/queries'
import { absoluteUrl } from '@/lib/site'
import type { BlogPost, Project } from '@/sanity/lib/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // cacheComponents replaces route-segment `revalidate` with `use cache` +
  // cacheLife; the underlying queries already carry their own lifetimes.
  'use cache'
  cacheLife('hours')
  cacheTag('sanity', 'sitemap')

  const [allPosts, allProjects] = await Promise.all([
    getBlogPosts().catch(() => [] as BlogPost[]),
    getProjects().catch(() => [] as Project[]),
  ])

  const blogURLs: MetadataRoute.Sitemap = allPosts.map(post => ({
    url: absoluteUrl(`/blog/${post.slug.current}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    // Content changes when edited, not on a fixed weekly schedule. Telling
    // crawlers 'yearly' made fresh posts look stale; 'monthly' is the honest signal.
    changeFrequency: 'monthly',
    priority: post.featured ? 0.8 : 0.6,
  }))

  const projectURLs: MetadataRoute.Sitemap = allProjects.map(project => ({
    url: absoluteUrl(`/projects/${project.slug.current}`),
    lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: project.featured ? 0.8 : 0.6,
  }))

  // No lastModified on static routes: they have no CMS-backed content, and
  // stamping `new Date()` on every request tells crawlers everything is new.
  const staticURLs: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/projects'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/blog'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/skills'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.5 },
    // The canonical résumé target of the old /AmanKushwaha_Resume.pdf 301.
    { url: absoluteUrl('/resume'), changeFrequency: 'monthly', priority: 0.6 },
  ]

  return [...staticURLs, ...projectURLs, ...blogURLs]
}
