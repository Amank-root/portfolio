import { client } from './client'
import { groq } from 'next-sanity'

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

// ===== ABOUT QUERY (with resumeFile fix) =====
export const aboutQuery = groq`
  *[_type == "about"][0] {
    _id, title, bio,
    profileImage { asset->{ _id, url }, alt },
    experiences[] {
      title, company, startDate, endDate, current, description, skills
    },
    education[] {
      degree, institution, startDate, endDate, current, description
    },
    interests[] { name, icon },
    resumeFile {
      asset->{ _id, url, originalFilename, size, mimeType }
    }
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

export const blogCountQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(publishedAt)])`

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
export const analyticsStatsQuery = groq`{
  "totalViews": count(*[_type == "pageView"]),
  "blogViews": count(*[_type == "pageView" && defined(blogSlug)]),
  "totalReactions": count(*[_type == "blogReaction"]),
  "totalComments": count(*[_type == "blogComment" && approved == true]),
  "topPosts": *[_type == "pageView" && defined(blogSlug)] {blogSlug} | order(count(*[_type == "pageView" && blogSlug == ^.blogSlug]) desc) [0...5]
}`

export const blogReactionsQuery = groq`
  *[_type == "blogReaction" && blogSlug == $blogSlug] {
    _id, type, createdAt
  }
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
export async function getProjects() { return client.fetch(projectsQuery) }
export async function getFeaturedProjects() { return client.fetch(featuredProjectsQuery) }
export async function getProject(slug: string) { return client.fetch(projectQuery, { slug }) }
export async function getProjectBySlug(slug: string) { return client.fetch(projectQuery, { slug }) }
export async function getSkills() { return client.fetch(skillsQuery) }
export async function getAbout() { return client.fetch(aboutQuery) }
export async function getContact() { return client.fetch(contactQuery) }
export async function getBlogPosts() { return client.fetch(blogPostsQuery) }
export async function getFeaturedBlogPosts() { return client.fetch(featuredBlogPostsQuery) }
export async function getBlogPost(slug: string) { return client.fetch(blogPostQuery, { slug }) }
export async function getBlogSlugs() { return client.fetch(blogSlugsQuery) }
export async function getRelatedPosts(slug: string) { return client.fetch(relatedPostsQuery, { slug }) }
export async function getBlogReactions(blogSlug: string) { return client.fetch(blogReactionsQuery, { blogSlug }) }
export async function getBlogComments(blogSlug: string) { return client.fetch(blogCommentsQuery, { blogSlug }) }
