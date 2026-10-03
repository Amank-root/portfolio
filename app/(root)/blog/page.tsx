import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { getBlogPosts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PageHeader, Reveal } from '@/components/section'
import { SpotlightCard } from '@/components/spotlight-card'
import { AnimatedBorder } from '@/components/animated-border'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, collectionSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import type { BlogPost } from '@/sanity/lib/types'

const BLOG_DESCRIPTION =
  'Writing on web development, system design, AI/ML and software engineering by Aman Kushwaha — tutorials, build notes and lessons learned.'

export const metadata: Metadata = {
  title: 'Blog',
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: BLOG_DESCRIPTION,
    url: absoluteUrl('/blog'),
    type: 'website',
    // Declaring openGraph here means the layout's images are NOT inherited
    // (Next merges per-key), so they have to be repeated.
    images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: siteConfig.title, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.name}`,
    description: BLOG_DESCRIPTION,
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    images: [absoluteUrl('/og.png')],
  },
}

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={graph(
          collectionSchema({ name: 'Blog', path: '/blog', description: BLOG_DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ])
        )}
      />
      <Suspense fallback={<BlogPageSkeleton />}>
        <BlogPageContent />
      </Suspense>
    </>
  )
}

async function BlogPageContent() {
  const posts = (await getBlogPosts().catch(() => [])) as BlogPost[]

  const featured = posts.find(p => p.featured)
  const rest = posts.filter(p => p._id !== featured?._id)

  return (
    <div className="container">
      <PageHeader
        eyebrow="Writing"
        title="Notes from the work."
        lede="Web development, system design, AI/ML, and the occasional note on getting things done. Written for the person who will maintain it next."
      />

      {posts.length === 0 ? (
        <p className="py-24 text-center text-foreground-muted">Nothing published yet — check back soon.</p>
      ) : (
        <>
          {/* Lead post, inside the animated gradient border so the featured
              item is visibly distinguished without a special-case colour. */}
          {featured && (
            <Reveal className="mb-4">
              <AnimatedBorder duration={7}>
                <Link href={`/blog/${featured.slug.current}`} className="group block p-2 sm:p-3">
                  <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center lg:gap-14">
                    <div className="p-3 lg:p-5">
                      <p className="eyebrow font-mono text-primary">
                        Featured
                        {featured.categories?.[0] && (
                          <span className="ml-3 text-foreground-subtle">{featured.categories[0].title}</span>
                        )}
                      </p>
                      <h2 className="mt-5 max-w-2xl font-display text-3xl leading-tight transition-colors group-hover:text-primary sm:text-4xl">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-5 max-w-2xl text-lede text-foreground-muted">{featured.excerpt}</p>
                      )}
                      <p className="mt-6 font-mono text-xs text-foreground-subtle">
                        {featured.publishedAt &&
                          new Date(featured.publishedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        {featured.readTime ? ` · ${featured.readTime} min read` : ''}
                      </p>
                    </div>

                    {featured.mainImage && (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                        <Image
                          src={urlFor(featured.mainImage).width(800).height(500).url()}
                          alt={featured.mainImage.alt || featured.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 352px"
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          priority
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </AnimatedBorder>
            </Reveal>
          )}

          {/* Everything else, as spotlight cards. */}
          {rest.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Reveal key={post._id} delay={i * 0.06}>
                  <Link href={`/blog/${post.slug.current}`} className="group block h-full">
                    <SpotlightCard className="h-full">
                      {post.mainImage && (
                        <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden rounded-t-2xl">
                          <Image
                            src={urlFor(post.mainImage).width(500).height(280).url()}
                            alt={post.mainImage.alt || post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 400px"
                            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-background/45 to-transparent" />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] text-foreground-subtle">
                        {post.publishedAt && (
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {post.readTime && <span>· {post.readTime} min</span>}
                      </div>

                      <h2 className="mt-4 line-clamp-2 font-display text-lg leading-snug transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="mt-3 line-clamp-3 text-[0.9rem] leading-relaxed text-foreground-muted">
                          {post.excerpt}
                        </p>
                      )}

                      {post.categories?.[0] && (
                        <span className="mt-5 inline-flex">
                          <span className="tag-pill">{post.categories[0].title}</span>
                        </span>
                      )}
                    </SpotlightCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function BlogPageSkeleton() {
  return (
    <div className="container animate-pulse">
      <div className="pt-16 pb-14 sm:pt-24">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="mt-6 h-12 w-2/3 max-w-lg rounded bg-muted" />
        <div className="mt-7 h-4 w-full max-w-lg rounded bg-muted/60" />
      </div>
      <div className="grid gap-8 rounded-2xl border border-border p-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <div className="h-3 w-20 rounded bg-muted/60" />
          <div className="h-9 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted/60" />
        </div>
        <div className="aspect-[16/10] rounded-2xl bg-muted/50" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-2xl border border-border bg-card/40 p-6">
            <div className="aspect-[16/9] rounded-2xl bg-muted/50" />
            <div className="h-3 w-24 rounded bg-muted/60" />
            <div className="h-5 w-4/5 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
