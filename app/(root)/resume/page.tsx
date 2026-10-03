'use cache'
import { cacheLife } from 'next/cache'
import type { Metadata } from 'next'
import { getAbout } from '@/sanity/lib/queries'
import { PageHeader } from '@/components/section'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Resume',
  description: `Résumé of ${siteConfig.name}, ${siteConfig.role} — experience, education and skills.`,
  alternates: { canonical: '/resume' },
}

/**
 * Stable résumé URL.
 *
 * The PDF lives in Sanity, so every hardcoded link to it eventually 404s when
 * the asset is replaced. This route owns the permanent path and reads the
 * current asset, and /AmanKushwaha_Resume.pdf redirects here — which is the
 * exact URL Google had indexed, so the old link keeps resolving.
 */
export default async function ResumePage() {
  cacheLife('days')

  const about = await getAbout().catch(() => null)
  const resumeUrl = about?.resumeFile?.asset?.url

  return (
    <div className="container">
      <PageHeader
        eyebrow="Résumé"
        title="The one-pager."
        lede={`Experience, education and the tools behind them. ${siteConfig.availability}.`}
      />

      <div className="pb-4 justify-between item-center flex">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
          Back home
        </Link>

        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
          >
            <Download size={17} aria-hidden />
            Download PDF
          </a>
        ) : (
          <p className="mt-8 max-w-xl text-foreground-muted">
            The PDF isn&apos;t published yet — email{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-foreground underline underline-offset-4">
              {siteConfig.email}
            </a>{' '}
            and I&apos;ll send it over.
          </p>
        )}
        {/* {console.warn(resumeUrl)} */}
        {/* <ResumeDemo url={resumeUrl || '/resume'} /> */}
      </div>
      <iframe src={resumeUrl} className="w-full h-screen" />
    </div>
  )
}
