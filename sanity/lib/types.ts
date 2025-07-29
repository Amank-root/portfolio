import { PortableTextBlock } from '@portabletext/types'
import { SanityImageAssetDocument } from 'next-sanity'

export interface SanityImage {
  asset: SanityImageAssetDocument
  alt?: string
}

export interface SanityFile {
  asset: {
    _id: string
    url: string
    originalFilename: string
  }
}

export interface Tag {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'gray'
  category: 'language' | 'framework' | 'library' | 'tool' | 'database' | 'platform' | 'other'
}

export interface Project {
  _id: string
  title: string
  slug: {
    current: string
  }
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
