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
import { CalendarDays, Clock, ArrowLeft, Tag, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageViewTracker } from '@/components/page-view-tracker'
import type { BlogCategory, BlogPost } from '@/sanity/lib/types'

// export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug).catch(() => null) as BlogPost | null
  if (!post) return { title: 'Post Not Found' }

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || `Read "${post.title}" on Aman Kushwaha's blog`
  const ogImageUrl = post.seo?.ogImage?.asset?.url || (post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Aman Kushwaha'],
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    ...(post.seo?.noIndex ? { robots: { index: false, follow: false } } : { robots : {index: true, follow: true }}),
    ...(post.seo?.canonicalUrl ? { alternates: { canonical: post.seo.canonicalUrl } } : {alternates: { canonical: `/blog/${slug}`}}),
  }
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs().catch(() => []) as { slug: string }[]
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage ? urlFor(post.mainImage).url() : undefined,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Aman Kushwaha',
    },
    datePublished: post.publishedAt,
    publisher: {
      '@type': 'Person',
      name: 'Aman Kushwaha',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageViewTracker path={`/blog/${slug}`} blogSlug={slug} />

      <article className="min-h-full">
        {/* Hero */}
        <div className="relative">
          {post.mainImage ? (
            <div className="relative h-72 sm:h-96 overflow-hidden">
              <Image
                src={urlFor(post.mainImage).width(1400).height(600).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/40 to-background" />
            </div>
          ) : (
            <div className="h-32 bg-linear-to-br from-primary/5 via-background to-secondary/5" />
          )}

          <div className="relative px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32">
            <div className="mx-auto max-w-3xl">
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="mb-6 gap-2 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={12} /> Back to Blog
                </Button>
              </Link>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories?.map((cat: BlogCategory) => (
                  <span key={cat._id} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                    {cat.title}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="glass rounded-xl px-5 py-4 border border-border/30 mb-8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      {post.author.image?.asset?.url ? (
                        <Image
                          src={post.author.image.asset.url}
                          alt={post.author.name}
                          width={28}
                          height={28}
                          className="rounded-full border border-border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <User size={12} className="text-primary" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground">{post.author.name}</span>
                    </div>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays size={13} />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock size={13} />
                      {post.readTime} min read
                    </span>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/20">
                    <Tag size={12} className="text-muted-foreground" />
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mx-auto max-w-3xl">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4 italic">
                {post.excerpt}
              </p>
            )}

            {/* Body */}
            <div>
              {post.contentType === 'markdown' && post.markdownBody ? (
                <ClientOnly
                  fallback={
                    <div className="prose-blog my-6 rounded-xl border border-border/30 bg-muted/20 p-6 text-sm text-muted-foreground">
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
                <div className="text-center py-12 text-muted-foreground">
                  <p>No content available for this post.</p>
                </div>
              )}
            </div>

            {/* Reactions */}
            <div className="mt-12">
              <BlogReactions blogSlug={slug} initialReactions={aggregatedReactions} />
            </div>

            {/* Comments */}
            <BlogComments blogSlug={slug} initialComments={commentsData as any} />

            {/* Related posts */}
            {(relatedPosts as BlogPost[]).length > 0 && (
              <div className="mt-16 pt-8 border-t border-border/30">
                <h3 className="text-lg font-semibold mb-6 text-foreground">Related Posts</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(relatedPosts as BlogPost[]).map(related => (
                    <Link key={related._id} href={`/blog/${related.slug.current}`} className="group">
                      <div className="glass rounded-xl overflow-hidden border-border/30 hover:border-primary/25 hover-card">
                        {related.mainImage && (
                          <div className="relative h-32 overflow-hidden">
                            <Image
                              src={urlFor(related.mainImage).width(300).height(150).url()}
                              alt={related.mainImage.alt || related.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 mb-2">{related.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Read <ArrowRight size={10} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="min-h-full animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 h-9 w-32 rounded-full bg-muted/40" />
        <div className="mb-8 h-72 w-full rounded-2xl bg-muted/40 sm:h-96" />
        <div className="mb-8 space-y-3">
          <div className="h-4 w-24 rounded-full bg-muted/30" />
          <div className="h-10 w-3/4 rounded-lg bg-muted/40" />
          <div className="h-4 w-full rounded-lg bg-muted/30" />
          <div className="h-4 w-5/6 rounded-lg bg-muted/30" />
        </div>
        <div className="mb-8 rounded-xl border border-border/30 bg-muted/20 p-5">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-6 w-20 rounded-full bg-muted/40" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 rounded-lg bg-muted/40" />
          <div className="h-4 w-full rounded bg-muted/30" />
          <div className="h-4 w-5/6 rounded bg-muted/30" />
          <div className="h-4 w-2/3 rounded bg-muted/30" />
        </div>
      </div>
    </div>
  )
}
