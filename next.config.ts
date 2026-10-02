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
      // reCAPTCHA injects these; without them the widget silently fails to
      // load, so the form looked like it had no captcha at all.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
      "style-src 'self' 'unsafe-inline'",
      // Markdown bodies commonly embed shields.io / badgen.net badges. These
      // were absent from img-src, so the images were blocked outright and
      // rendered as broken-image icons in project write-ups.
      "img-src 'self' blob: data: https://cdn.sanity.io https://dummyimage.com https://img.shields.io https://badgen.net",
      "font-src 'self' data:",
      // Formspree must be here, not just in form-action: `useForm` submits with
      // fetch(), and connect-src is what governs fetch/XHR. With only form-action
      // allowing it, the POST was blocked and surfaced as a bare "Failed to fetch".
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://www.google.com/recaptcha/ https://formspree.io",
      "frame-src 'self' https://*.sanity.io https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
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
  // Inlined at build time. The footer needs a copyright year, but calling
  // `new Date()` during render makes the page dynamic and blocks static
  // prerendering — the value only changes when a deploy happens anyway.
  env: {
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  // Prefetch one reusable App Shell per route instead of a full route payload
  // per visible link. Every route here is now fully cacheable, so the shell is
  // shared by all links pointing at it (header nav, footer, card grids).
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
      // Status badges embedded in markdown bodies (see lib/utils.ts isBadge).
      { protocol: 'https', hostname: 'img.shields.io' },
      { protocol: 'https', hostname: 'badgen.net' },
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
  logging: {
    fetches: {
      // Full URLs in build logs include Sanity project IDs and query params.
      fullUrl: false,
    },
  },
  // reactCompiler is available and its babel plugin is installed; enabling it
  // removes the need for most manual memoization. Left off until the
  // `set-state-in-effect` lint warnings are resolved.
  // experimental: {
  //   reactCompiler: true,
  // },
}

export default nextConfig
