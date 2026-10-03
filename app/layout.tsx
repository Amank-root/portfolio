import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Syne, Instrument_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { siteConfig } from '@/lib/site'

/**
 * Three voices:
 *  - Syne (display) — a wide, characterful grotesk. It does the work a
 *    gradient can't: at display sizes it's immediately not-a-template.
 *  - Instrument Sans (body) — a neutral grotesque for running text.
 *  - Geist Mono (code + micro-labels) — tags, small caps labels and code only.
 */
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display-family',
  display: 'swap',
  // Variable weight: the opsz axis can only be requested alongside a variable
  // range, so weight must not be pinned to discrete values.
  weight: 'variable',
  // axes: ['opsz'],
  style: ['normal'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono-family',
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  // Required for any relative URL in metadata (canonical, OG images) to resolve
  // to an absolute URL. Without it Next warns and social cards break.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${siteConfig.name} — Blog` }],
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    // `site` attributes the card to the account; `creator` attributes the
    // post. Both were missing `site`, so nothing linked back to the profile.
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    images: [`${siteConfig.url}/og.png`],
  },
  // Icons are intentionally not listed here: app/favicon.ico and
  // app/apple-icon.tsx are file conventions, so Next injects the <link> tags
  // itself. An explicit `icons` entry overrode the auto-detected ones.
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2efe9' },
    { media: '(prefers-color-scheme: dark)', color: '#141311' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    /* The font variables must live on <html>, not <body>. Tailwind emits
       `--font-sans: var(--font-body)` into its `:root` theme block, and a
       variable declared on a descendant is not visible to `:root` — the
       reference resolves to nothing and every heading and paragraph silently
       falls back to the system UI font. */
    <html
      lang="en"
      className={`${syne.variable} ${instrumentSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans" suppressHydrationWarning>
        {/* Skip link: keyboard users currently have to tab through the whole
            header + sidebar nav on every page. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
