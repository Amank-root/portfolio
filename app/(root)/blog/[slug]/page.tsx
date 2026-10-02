import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogSlugs, getRelatedPosts, getBlogReactions, getBlogComments } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/portable-text-components'
import { ClientOnly } from '@/components/client-only'
import { BlogMarkdownRenderer } from '@/components/blog-markdown-renderer'
import { BlogReactions } from '@/components/blog-reactions'
import { BlogComments } from '@/components/blog-comments'
import { ArrowLeft } from 'lucide-react'
import { PageViewTracker } from '@/components/page-view-tracker'
import { JsonLd } from '@/components/json-ld'
import { blogPostingSchema, breadcrumbSchema, graph } from '@/lib/seo'
import { absoluteUrl, siteConfig } from '@/lib/site'
import type { BlogCategory, BlogPost } from '@/sanity/lib/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = (await getBlogPost(slug).catch(() => null)) as BlogPost | null
  if (!post) return { title: 'Post Not Found', robots: { index: false, follow: false } }

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || `Read "${post.title}" on ${siteConfig.name}'s blog`
  const ogImageUrl = post.seo?.ogImage?.asset?.url
    ? urlFor(post.seo.ogImage).width(1200).height(630).fit('crop').url()
    : post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
      : absoluteUrl('/opengraph-image')

  const url = absoluteUrl(`/blog/${slug}`)

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author?.name || siteConfig.name, url: siteConfig.url }],
    creator: post.author?.name || siteConfig.name,
    alternates: {
      canonical: post.seo?.canonicalUrl || `/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author?.name || siteConfig.name],
      section: post.categories?.[0]?.title,
      tags: post.tags,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.author.twitter,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    robots: post.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export async function generateStaticParams() {
  const slugs = (await getBlogSlugs().catch(() => [])) as { slug: string }[]
  return slugs.map(({ slug }) => ({ slug }))
}

export default function BlogPostPage({ params }: Props) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

async function BlogPostContent({ params }: Props) {
  const { slug } = await params

  const [post, relatedPosts, reactionsData, commentsData] = await Promise.all([
    getBlogPost(slug).catch(() => null),
    getRelatedPosts(slug).catch(() => []),
    getBlogReactions(slug).catch(() => []),
    getBlogComments(slug).catch(() => []),
  ])

  if (!post) notFound()

  // Aggregate reactions
  const reactionCounts: Record<string, number> = {}
  for (const r of reactionsData as { type: string }[]) {
    reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1
  }
  const aggregatedReactions = Object.entries(reactionCounts).map(([type, count]) => ({ type, count }))

  const jsonLd = graph(
    blogPostingSchema({
      title: post.title,
      description: post.excerpt,
      slug,
      publishedAt: post.publishedAt,
      authorName: post.author?.name,
      image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url() : undefined,
      categories: post.categories?.map(c => c.title),
      keywords: post.tags,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${slug}` },
    ])
  )

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageViewTracker path={`/blog/${slug}`} blogSlug={slug} />

      <article className="container">
        {/* Header. No full-bleed cover image — the cover, when there is one,
            sits inside the article column directly above the body, so the
            title and the byline stay on paper instead of on a photo. */}
        <header className="mx-auto max-w-2xl border-b border-border pb-12 pt-16 sm:pt-24">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" aria-hidden />
            All writing
          </Link>

          {post.categories?.length ? (
            <div className="mt-10 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-[linear-gradient(90deg,hsl(var(--aurora-coral)),hsl(var(--aurora-violet)))]"
              />
              <span className="eyebrow font-mono text-primary">
                {post.categories.map((cat: BlogCategory) => cat.title).join(' · ')}
              </span>
            </div>
          ) : null}

          <h1 className="mt-5 font-display text-display text-foreground">{post.title}</h1>

          {post.excerpt && <p className="mt-6 text-lede text-foreground-muted">{post.excerpt}</p>}

          {/* Byline as a plain meta line under a hairline. */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-foreground-muted">
            {post.author && <span className="text-foreground">{post.author.name}</span>}
            {post.publishedAt && (
              <span className="font-mono text-xs">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
            {post.readTime && <span className="font-mono text-xs">{post.readTime} min read</span>}
          </div>

          {post.tags && post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <li key={tag} className="tag-pill">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Content */}
        <div className="py-14 sm:py-20">
          <div className="mx-auto max-w-2xl">
            {/* Cover. Inside the measure, above the body. */}
            {post.mainImage && (
              <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.mainImage.alt || `${post.title} cover`}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Body */}
            <div>
              {post.contentType === 'markdown' && post.markdownBody ? (
                <ClientOnly
                  fallback={
                    <div className="prose-blog rounded-md border border-border bg-muted/30 p-6 text-sm text-foreground-muted">
                      Loading article content...
                    </div>
                  }
                >
                  <BlogMarkdownRenderer content={post.markdownBody} />
                </ClientOnly>
              ) : post.body ? (
                <div className="prose-blog">
                  <PortableText value={post.body} components={portableTextComponents} />
                </div>
              ) : (
                <div className="py-12 text-center text-foreground-muted">
                  <p>No content available for this post.</p>
                </div>
              )}
            </div>

            {/* Reactions */}
            <div className="mt-20">
              <BlogReactions blogSlug={slug} initialReactions={aggregatedReactions} />
            </div>

            {/* Comments */}
            <BlogComments blogSlug={slug} initialComments={commentsData} />

            {/* Related posts — a list, like everywhere else on the site. */}
            {(relatedPosts as BlogPost[]).length > 0 && (
              <section className="mt-16 border-t border-border pt-10">
                <h3 className="eyebrow">Keep reading</h3>
                <ul className="mt-6">
                  {(relatedPosts as BlogPost[]).map(related => (
                    <li key={related._id} className="border-b border-border last:border-0">
                      <Link href={`/blog/${related.slug.current}`} className="row-lift group block py-5">
                        <h4 className="font-display text-lg text-foreground transition-colors group-hover:text-primary">
                          {related.title}
                        </h4>
                        {related.categories?.[0] && (
                          <p className="mt-1.5 font-mono text-xs text-foreground-subtle">
                            {related.categories[0].title}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="container animate-pulse">
      <div className="mx-auto max-w-2xl">
        <div className="border-b border-border pb-12 pt-16 sm:pt-24">
          <div className="h-4 w-24 rounded bg-muted/60" />
          <div className="mt-6 h-4 w-full rounded-lg bg-muted/40" />
          <div className="mt-3 h-4 w-4/5 rounded-lg bg-muted/40" />
          <div className="mt-7 h-4 w-full rounded bg-muted/50" />
          <div className="mt-3 h-4 w-3/5 rounded bg-muted/50" />
          <div className="mt-9 h-px w-full bg-border" />
          <div className="mt-6 h-3 w-56 rounded bg-muted/60" />
        </div>
        <div className="space-y-4 py-14 sm:py-20">
          <div className="h-6 w-40 rounded bg-muted/40" />
          <div className="h-4 w-full rounded bg-muted/30" />
          <div className="h-4 w-5/6 rounded bg-muted/30" />
          <div className="h-4 w-2/3 rounded bg-muted/30" />
        </div>
      </div>
    </div>
  )
}
