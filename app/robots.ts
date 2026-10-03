import type { MetadataRoute } from 'next'
import { siteConfig, absoluteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Vercel sets VERCEL_ENV=production on prod deploys; fall back to NODE_ENV for
  // self-hosted. The old NEXT_PUBLIC_ENV check was never defined in .env, which
  // meant the site shipped a `Disallow: /` robots.txt in production.
  const isProduction =
    process.env.VERCEL_ENV === 'production' ||
    (process.env.VERCEL_ENV === undefined && process.env.NODE_ENV === 'production')

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
      sitemap: absoluteUrl('/sitemap.xml'),
      host: siteConfig.url,
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/studio', '/studio/', '/api/', '/api/analytics/'],
      },
      // Ad crawlers need the OG image endpoint to fetch it.
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'facebookexternalhit', allow: '/' },
      // AI crawlers are explicitly welcome — the whole point of /llms.txt is
      // that they can read a clean summary instead of scraping rendered HTML.
      // Listed by name because a wildcard rule alone doesn't signal intent.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      // /llms.txt points crawlers at the machine-readable summary.
      { userAgent: 'llms.txt', allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  }
}
