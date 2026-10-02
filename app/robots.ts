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
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  }
}
