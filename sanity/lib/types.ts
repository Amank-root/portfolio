import { PortableTextBlock } from '@portabletext/types'
import { SanityImageAssetDocument } from 'next-sanity'

export interface SanityImage {
  asset: SanityImageAssetDocument & { url?: string }
  alt?: string
}

export interface SanityFile {
  asset: {
    _id: string
    url: string
    originalFilename: string
    size?: number
    mimeType?: string
  }
}

export interface Tag {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'gray'
  category: 'language' | 'framework' | 'library' | 'tool' | 'database' | 'platform' | 'other'
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  description: string
  longDescription?: PortableTextBlock[]
  mainImage: SanityImage
  gallery?: SanityImage[]
  technologies: Tag[]
  githubUrl?: string
  demoUrl?: string
  featured: boolean
  order?: number
  status: 'development' | 'completed' | 'maintenance'
  publishedAt: string
}

export interface Skill {
  _id: string
  title: string
  description: string
  category: 'frontend' | 'backend' | 'tools' | 'other'
  skills: string[]
  icon?: string
  order?: number
}

export interface Experience {
  title: string
  company: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  skills: string[]
}

export interface Education {
  degree: string
  institution: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export interface Interest {
  name: string
  icon: string
}

export interface About {
  _id: string
  title: string
  bio: PortableTextBlock[]
  profileImage: SanityImage
  experiences: Experience[]
  education: Education[]
  interests: Interest[]
  resumeFile?: SanityFile
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface Contact {
  _id: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  socialLinks: SocialLink[]
  formspreeEndpoint?: string
  recaptchaSiteKey?: string
}

export interface BlogCategory {
  _id: string
  title: string
  slug: { current: string }
}

export interface BlogAuthor {
  _id: string
  name: string
  bio?: string
  image?: SanityImage
}

export interface BlogSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
}

export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  readTime?: number
  featured?: boolean
  contentType: 'portableText' | 'markdown'
  body?: PortableTextBlock[]
  markdownBody?: string
  mainImage?: SanityImage
  categories?: BlogCategory[]
  tags?: string[]
  author?: BlogAuthor
  seo?: BlogSeo
}

export interface PageView {
  _id: string
  path: string
  blogSlug?: string
  viewedAt: string
  country?: string
  device?: string
  referrer?: string
  sessionId?: string
}

export interface BlogReaction {
  _id: string
  blogSlug: string
  type: 'love' | 'fire' | 'insightful' | 'celebrate' | 'thinking'
  createdAt: string
}

export interface BlogComment {
  _id: string
  blogSlug: string
  name: string
  email?: string
  content: string
  approved: boolean
  createdAt: string
}
