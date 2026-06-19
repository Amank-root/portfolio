"use cache";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github, ExternalLink, Download, Code, Briefcase, User, Mail, BookOpen, Star, Zap } from 'lucide-react'
import { getFeaturedProjects, getFeaturedBlogPosts, getAbout } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { HeroSection } from '@/components/sections/hero-section'
import { TerminalSection } from '@/components/sections/terminal-section'
import type { Project, BlogPost } from '@/sanity/lib/types'
import { Metadata } from 'next';

// export const revalidate = 60
export const metadata: Metadata = {
  title: 'Home',
  alternates: {
    canonical: `/`
  }
}

export default async function Home() {
  const [featuredProjects, featuredPosts, about] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getFeaturedBlogPosts().catch(() => []),
    getAbout().catch(() => null),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection about={about} />

      {/* Quick Nav Cards */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="section-label">
              <span className="dot-separator" />
              Navigate
            </span>
            <h2 className="mt-2 text-2xl font-bold">Explore My Work</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Code, title: 'Skills', desc: 'Tech stack & expertise', href: '/skills', color: 'primary' },
              { icon: Briefcase, title: 'Projects', desc: 'Portfolio of work', href: '/projects', color: 'accent' },
              { icon: User, title: 'About', desc: 'My story & journey', href: '/about', color: 'secondary' },
              { icon: BookOpen, title: 'Blog', desc: 'Thoughts & tutorials', href: '/blog', color: 'primary' },
              { icon: Mail, title: 'Contact', desc: 'Let\'s collaborate', href: '/contact', color: 'accent' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <div className="glass rounded-xl p-5 hover-card border-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className={`mb-3 inline-flex rounded-lg p-2.5 ${item.color === 'primary' ? 'bg-primary/10' : item.color === 'accent' ? 'bg-accent/10' : 'bg-secondary/10'}`}>
                    <item.icon size={18} className={item.color === 'primary' ? 'text-primary' : item.color === 'accent' ? 'text-accent' : 'text-secondary'} />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal */}
      <TerminalSection />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-background-elevated/30">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="section-label">
                  <Zap size={12} />
                  Featured Work
                </span>
                <h2 className="mt-2 text-2xl font-bold">Recent Projects</h2>
              </div>
              <Link href="/projects">
                <Button variant="outline" size="sm" className="gap-2 text-xs border-border/50 hover:border-primary/50">
                  View All <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {(featuredProjects as Project[]).slice(0, 4).map((project) => (
                <div key={project._id} className="group glass rounded-xl overflow-hidden hover-card border-border/50 hover:border-primary/20">
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={
                        project.mainImage
                          ? urlFor(project.mainImage).width(600).height(300).url()
                          : `https://dummyimage.com/600X300/0d1117/00c8ff.png&text=${encodeURIComponent(project.title)}`
                      }
                      alt={project.mainImage?.alt || project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                    {project.status && (
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${project.status === 'completed' ? 'bg-accent/20 text-accent border border-accent/30' :
                          project.status === 'development' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-secondary/20 text-secondary border border-secondary/30'
                          }`}>
                          {project.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                      <Link href={`/projects/${project.slug.current}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies?.slice(0, 4).map(tech => (
                        <span key={tech._id} className="tag-pill">{tech.name}</span>
                      ))}
                      {(project.technologies?.length || 0) > 4 && (
                        <span className="tag-pill">+{(project.technologies?.length || 0) - 4}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Link href={project.githubUrl} target="_blank">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7 border-border/50 hover:border-primary/50">
                            <Github size={12} /> Code
                          </Button>
                        </Link>
                      )}
                      {project.demoUrl && (
                        <Link href={project.demoUrl} target="_blank">
                          <Button size="sm" className="gap-1.5 text-xs h-7 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30">
                            <ExternalLink size={12} /> Demo
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="section-label">
                  <Star size={12} />
                  Latest Writing
                </span>
                <h2 className="mt-2 text-2xl font-bold">From the Blog</h2>
              </div>
              <Link href="/blog">
                <Button variant="outline" size="sm" className="gap-2 text-xs border-border/50 hover:border-primary/50">
                  All Posts <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {(featuredPosts as BlogPost[]).map((post) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`} className="group">
                  <div className="glass rounded-xl overflow-hidden hover-card border-border/50 hover:border-primary/20 h-full">
                    {post.mainImage && (
                      <div className="relative h-36 overflow-hidden">
                        <Image
                          src={urlFor(post.mainImage).width(400).height(200).url()}
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {post.categories?.[0] && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {post.categories[0].title}
                          </span>
                        )}
                        {post.readTime && (
                          <span className="text-[10px] text-muted-foreground">{post.readTime} min read</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-3 text-xs text-muted-foreground">
                        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
