import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    // The OG image generator and the Sanity Studio bundle both need inline
    // styles/scripts; everything else is locked to self.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://cdn.sanity.io https://dummyimage.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io",
      "frame-src 'self' https://*.sanity.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://formspree.io",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Prefetch one reusable App Shell per route instead of a full route payload
  // per visible link. Every route here is now fully cacheable, so the shell is
  // shared by all links pointing at it (header tabs, sidebar, card grids).
  partialPrefetching: true,
  // Blog/CMS content is republished a few times a day and purged precisely by
  // the /api/revalidate webhook. `days` keeps it prerendered and in the shell;
  // the webhook, not the lifetime, is what makes an edit appear.
  cacheLife: {
    default: { stale: 300, revalidate: 3600, expire: 86400 },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dummyimage.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    // AVIF first, WebP fallback: meaningfully smaller than JPEG at equal quality.
    formats: ['image/avif', 'image/webp'],
    // Device widths aligned to what this layout actually renders, so we never
    // generate a 3840px variant for a 640px slot.
    deviceSizes: [360, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // logging: {
  //   fetches: {
  //     // Full URLs in build logs include Sanity project IDs and query params.
  //     fullUrl: false,
  //   },
  // },
  // reactCompiler is available and its babel plugin is installed; enabling it
  // removes the need for most manual memoization. Left off until the
  // `set-state-in-effect` lint warnings are resolved.
  // experimental: {
  //   reactCompiler: true,
  // },
}

export default nextConfig
