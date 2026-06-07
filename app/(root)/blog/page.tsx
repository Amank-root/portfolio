import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { getBlogPosts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { CalendarDays, Clock, Tag, BookOpen, ArrowRight, Search } from 'lucide-react'
import type { BlogPost } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, tutorials, and insights on web development, AI/ML, and technology.',
}

// export const revalidate = 60

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageContent />
    </Suspense>
  )
}

async function BlogPageContent() {
  const posts = await getBlogPosts().catch(() => []) as BlogPost[]

  const featured = posts.filter(p => p.featured).slice(0, 1)[0]
  const rest = posts.filter(p => !p.featured || p._id !== featured?._id)

  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <span className="section-label mb-3 flex items-center gap-2">
            <BookOpen size={12} />
            Writing
          </span>
          <h1 className="text-4xl font-bold gradient-text">Blog</h1>
          <p className="mt-3 text-muted-foreground max-w-lg">
            Thoughts on web development, system design, AI/ML, and the occasional life lesson.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No posts yet</h2>
            <p className="text-muted-foreground text-sm">Check back soon — content is being published from Sanity CMS.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug.current}`} className="group block mb-10">
                <div className="glass rounded-2xl overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover-card">
                  <div className="flex flex-col lg:flex-row">
                    {featured.mainImage && (
                      <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden">
                        <Image
                          src={urlFor(featured.mainImage).width(800).height(500).url()}
                          alt={featured.mainImage.alt || featured.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-transparent to-background/20 lg:bg-linear-to-l" />
                      </div>
                    )}
                    <div className="p-6 lg:p-8 lg:w-3/5 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          ✨ Featured
                        </span>
                        {featured.categories?.[0] && (
                          <span className="text-xs text-muted-foreground">{featured.categories[0].title}</span>
                        )}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                        {featured.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {featured.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {featured.readTime} min read
                          </span>
                        )}
                        <span className="ml-auto flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                          Read Post <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post grid */}
            {rest.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-foreground mb-5">All Posts</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug.current}`} className="group">
                      <article className="glass rounded-xl overflow-hidden border-border/50 hover:border-primary/20 hover-card transition-all duration-300 h-full flex flex-col">
                        {post.mainImage ? (
                          <div className="relative h-44 overflow-hidden">
                            <Image
                              src={urlFor(post.mainImage).width(500).height(280).url()}
                              alt={post.mainImage.alt || post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background/70 to-transparent" />
                          </div>
                        ) : (
                          <div className="h-32 bg-linear-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                            <BookOpen size={32} className="text-primary/30" />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.categories?.slice(0, 2).map(cat => (
                              <span key={cat._id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary/80 border border-primary/15">
                                {cat.title}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 flex-1">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/30">
                            {post.publishedAt && (
                              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            )}
                            {post.readTime && (
                              <span className="flex items-center gap-1">
                                <Clock size={10} /> {post.readTime}m
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function BlogPageSkeleton() {
  return (
    <div className="min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mb-12 space-y-3">
          <div className="h-4 w-24 rounded-full bg-muted/40" />
          <div className="h-10 w-40 rounded-lg bg-muted/40" />
          <div className="h-4 w-full max-w-lg rounded-lg bg-muted/30" />
        </div>

        <div className="mb-10 overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
          <div className="grid min-h-72 lg:grid-cols-5">
            <div className="h-56 bg-muted/40 lg:col-span-2 lg:h-auto" />
            <div className="space-y-4 p-6 lg:col-span-3 lg:p-8">
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-muted/40" />
                <div className="h-6 w-24 rounded-full bg-muted/30" />
              </div>
              <div className="h-8 w-3/4 rounded-lg bg-muted/40" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted/30" />
                <div className="h-4 w-5/6 rounded bg-muted/30" />
                <div className="h-4 w-2/3 rounded bg-muted/30" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-border/40 bg-muted/20">
              <div className="h-44 bg-muted/40" />
              <div className="space-y-3 p-5">
                <div className="flex gap-1.5">
                  <div className="h-5 w-16 rounded-full bg-muted/40" />
                  <div className="h-5 w-20 rounded-full bg-muted/30" />
                </div>
                <div className="h-6 w-5/6 rounded-lg bg-muted/40" />
                <div className="h-4 w-full rounded bg-muted/30" />
                <div className="h-4 w-3/4 rounded bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
