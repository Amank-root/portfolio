import { cacheLife, cacheTag } from 'next/cache'
import { getBlogPosts } from '@/sanity/lib/queries'
import { absoluteUrl, siteConfig } from '@/lib/site'

const BLOG_DESCRIPTION = 'Writing on web development, AI/ML and systems engineering by Aman Kushwaha.'

/**
 * RSS 2.0 feed for the blog. Surfaced in the footer + <head> via metadata.alternates.
 *
 * Route handlers must export the HTTP method by name — a `default` export is
 * silently dropped and fails the generated RouteHandlerConfig type check.
 */
export async function GET(): Promise<Response> {
  const feed = await buildFeed()
  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

/**
 * The cached scope returns the XML *string*, not a Response. A `use cache`
 * scope on the handler itself would try to cache the Response object, which
 * fails prerender serialization ("Only plain objects ... can be passed").
 */
async function buildFeed(): Promise<string> {
  'use cache'
  cacheLife('hours')
  cacheTag('post', 'rss')

  const posts = await getBlogPosts().catch(() => [])

  const items = posts
    .map(post => {
      const url = absoluteUrl(`/blog/${post.slug.current}`)
      const categories = post.categories?.map(c => `      <category>${escapeXml(c.title)}</category>`).join('\n') ?? ''
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt ?? post.title)}</description>
      <author>${escapeXml(siteConfig.email)} (${escapeXml(post.author?.name ?? siteConfig.name)})</author>
${categories}
    </item>`
    })
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} — Blog`)}</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return feed
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
