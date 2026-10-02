import { cacheLife, cacheTag } from 'next/cache'

import { client } from './client'
import { groq } from 'next-sanity'
import type { BlogComment, BlogPost, Project, Skill, About, Contact } from './types'

/**
 * All reads go through `cachedQuery`, which layers Next's `use cache` on top of
 * Sanity's CDN. Tags line up 1:1 with the Sanity document types so the
 * /api/revalidate webhook can purge precisely instead of blowing away the whole
 * site with revalidatePath.
 *
 * `cacheLife('hours')` still refreshes in the background, so content stays fresh
 * even if the webhook never fires.
 */
async function cachedQuery<T>(query: string, params: Record<string, unknown> = {}, tags: string[] = []): Promise<T> {
  'use cache'
  cacheLife('hours')
  cacheTag('sanity', ...tags)
  return client.fetch<T>(query, params)
}

// ===== PROJECT QUERIES =====
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id, title, slug, description,
    mainImage { asset->{ _id, url }, alt },
    technologies[]->{ _id, name, color, category },
    githubUrl, demoUrl, featured, status, publishedAt
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, publishedAt desc) [0...4] {
    _id, title, slug, description,
    mainImage { asset->{ _id, url }, alt },
    technologies[]->{ _id, name, color, category },
    githubUrl, demoUrl, featured, status, publishedAt
  }
`

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, description, longDescription,
    mainImage { asset->{ _id, url }, alt },
    gallery[] { asset->{ _id, url }, alt },
    technologies[]->{ _id, name, color, category },
    githubUrl, demoUrl, featured, status, publishedAt
  }
`

// ===== SKILLS QUERIES =====
export const skillsQuery = groq`
  *[_type == "skill"] | order(order asc) {
    _id, title, description, category, skills, icon, order
  }
`

// ===== ABOUT QUERY =====
export const aboutQuery = groq`
  *[_type == "about"][0] {
    _id, title, bio,
    profileImage { asset->{ _id, url }, alt },
    experiences[] { title, company, startDate, endDate, current, description, skills },
    education[] { degree, institution, startDate, endDate, current, description },
    interests[] { name, icon },
    resumeFile { asset->{ _id, url, originalFilename, size, mimeType } }
  }
`

// ===== CONTACT QUERY =====
export const contactQuery = groq`
  *[_type == "contact"][0] {
    _id, title, description, email, phone, location,
    socialLinks[] { platform, url, icon },
    formspreeEndpoint, recaptchaSiteKey
  }
`

// ===== BLOG QUERIES =====
export const blogPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
    _id, title, slug, excerpt, publishedAt, readTime, featured, contentType,
    mainImage { asset->{ _id, url }, alt },
    categories[]->{ _id, title, slug },
    tags,
    author->{ _id, name, image { asset->{ url } } }
  }
`

export const featuredBlogPostsQuery = groq`
  *[_type == "post" && featured == true && defined(publishedAt)] | order(publishedAt desc) [0...3] {
    _id, title, slug, excerpt, publishedAt, readTime, featured, contentType,
    mainImage { asset->{ _id, url }, alt },
    categories[]->{ _id, title, slug },
    tags,
    author->{ _id, name, image { asset->{ url } } }
  }
`

export const blogPostQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, excerpt, publishedAt, readTime, featured, contentType,
    body, markdownBody,
    mainImage { asset->{ _id, url }, alt },
    categories[]->{ _id, title, slug },
    tags,
    author->{ _id, name, bio, image { asset->{ url } } },
    seo { metaTitle, metaDescription, ogImage { asset->{ url } }, canonicalUrl, noIndex }
  }
`

export const blogSlugsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)] { "slug": slug.current }
`

export const relatedPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && slug.current != $slug] | order(publishedAt desc) [0...3] {
    _id, title, slug, excerpt, publishedAt, readTime,
    mainImage { asset->{ _id, url }, alt },
    categories[]->{ _id, title }
  }
`

// ===== ANALYTICS QUERIES =====
// These are write-path/aggregate reads and must NOT be cached for hours —
// reactions and comments need to reflect new writes immediately.
export const analyticsStatsQuery = groq`{
  "totalViews": count(*[_type == "pageView"]),
  "blogViews": count(*[_type == "pageView" && defined(blogSlug)]),
  "totalReactions": count(*[_type == "blogReaction"]),
  "totalComments": count(*[_type == "blogComment" && approved == true]),
  "topPosts": *[_type == "pageView" && defined(blogSlug)] {blogSlug} | order(count(*[_type == "pageView" && blogSlug == ^.blogSlug]) desc) [0...5]
}`

export const blogReactionsQuery = groq`
  *[_type == "blogReaction" && blogSlug == $blogSlug] { _id, type, createdAt }
`

export const blogCommentsQuery = groq`
  *[_type == "blogComment" && blogSlug == $blogSlug && approved == true] | order(createdAt desc) {
    _id, name, content, createdAt
  }
`

export const pageViewsByPathQuery = groq`
  *[_type == "pageView"] | order(viewedAt desc) {
    _id, path, blogSlug, viewedAt, country, device
  }
`

// ===== FETCH FUNCTIONS =====
export function getProjects(): Promise<Project[]> {
  return cachedQuery<Project[]>(projectsQuery, {}, ['project'])
}

export function getFeaturedProjects(): Promise<Project[]> {
  return cachedQuery<Project[]>(featuredProjectsQuery, {}, ['project', 'featured-projects'])
}

export function getProject(slug: string): Promise<Project | null> {
  return cachedQuery<Project | null>(projectQuery, { slug }, ['project', `project:${slug}`])
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return getProject(slug)
}

export function getSkills(): Promise<Skill[]> {
  return cachedQuery<Skill[]>(skillsQuery, {}, ['skill'])
}

export function getAbout(): Promise<About | null> {
  return cachedQuery<About | null>(aboutQuery, {}, ['about'])
}

export function getContact(): Promise<Contact | null> {
  return cachedQuery<Contact | null>(contactQuery, {}, ['contact'])
}

export function getBlogPosts(): Promise<BlogPost[]> {
  return cachedQuery<BlogPost[]>(blogPostsQuery, {}, ['post'])
}

export function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  return cachedQuery<BlogPost[]>(featuredBlogPostsQuery, {}, ['post', 'featured-posts'])
}

export function getBlogPost(slug: string): Promise<BlogPost | null> {
  return cachedQuery<BlogPost | null>(blogPostQuery, { slug }, ['post', `post:${slug}`])
}

export function getBlogSlugs(): Promise<{ slug: string }[]> {
  return cachedQuery<{ slug: string }[]>(blogSlugsQuery, {}, ['post'])
}

export function getRelatedPosts(slug: string): Promise<BlogPost[]> {
  return cachedQuery<BlogPost[]>(relatedPostsQuery, { slug }, ['post', `post:${slug}`])
}

/**
 * Reactions/comments use a short cacheLife so the optimistic UI converges on
 * real data quickly, while still collapsing a burst of concurrent requests
 * into a single Sanity query.
 */
export async function getBlogReactions(blogSlug: string): Promise<{ type: string }[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('blogReaction', `reaction:${blogSlug}`)
  return client.fetch(blogReactionsQuery, { blogSlug })
}

export async function getBlogComments(blogSlug: string): Promise<BlogComment[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('blogComment', `comment:${blogSlug}`)
  return client.fetch(blogCommentsQuery, { blogSlug })
}
