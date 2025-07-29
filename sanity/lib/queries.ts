import { client } from './client'
import { groq } from 'next-sanity'

// Project queries
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    description,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    technologies[]->{
      _id,
      name,
      color,
      category
    },
    githubUrl,
    demoUrl,
    featured,
    status,
    publishedAt
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    description,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    technologies[]->{
      _id,
      name,
      color,
      category
    },
    githubUrl,
    demoUrl,
    featured,
    status,
    publishedAt
  }
`

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    longDescription,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    gallery[] {
      asset->{
        _id,
        url
      },
      alt
    },
    technologies[]->{
      _id,
      name,
      color,
      category
    },
    githubUrl,
    demoUrl,
    featured,
    status,
    publishedAt
  }
`

// Skills queries
export const skillsQuery = groq`
  *[_type == "skill"] | order(order asc) {
    _id,
    title,
    description,
    category,
    skills,
    icon,
    order
  }
`

export const skillsByCategoryQuery = groq`
  *[_type == "skill" && category == $category] | order(order asc) {
    _id,
    title,
    description,
    category,
    skills,
    icon,
    order
  }
`

// About queries
export const aboutQuery = groq`
  *[_type == "about"][0] {
    _id,
    title,
    bio,
    profileImage {
      asset->{
        _id,
        url
      },
      alt
    },
    experiences[] {
      title,
      company,
      startDate,
      endDate,
      current,
      description,
      skills
    },
    education[] {
      degree,
      institution,
      startDate,
      endDate,
      current,
      description
    },
    interests[] {
      name,
      icon
    },
    resumeFile {
      asset->{
        _id,
        url,
        originalFilename
      }
    }
  }
`

// Contact queries
export const contactQuery = groq`
  *[_type == "contact"][0] {
    _id,
    title,
    description,
    email,
    phone,
    location,
    socialLinks[] {
      platform,
      url,
      icon
    },
    formspreeEndpoint,
    recaptchaSiteKey
  }
`

// Tags queries
export const tagsQuery = groq`
  *[_type == "tag"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    color,
    category
  }
`

// Fetch functions
export async function getProjects() {
  return client.fetch(projectsQuery)
}

export async function getFeaturedProjects() {
  return client.fetch(featuredProjectsQuery)
}

export async function getProject(slug: string) {
  return client.fetch(projectQuery, { slug })
}

export async function getProjectBySlug(slug: string) {
  return client.fetch(projectQuery, { slug })
}

export async function getSkills() {
  return client.fetch(skillsQuery)
}

export async function getSkillsByCategory(category: string) {
  return client.fetch(skillsByCategoryQuery, { category })
}

export async function getAbout() {
  return client.fetch(aboutQuery)
}

export async function getContact() {
  return client.fetch(contactQuery)
}

export async function getTags() {
  return client.fetch(tagsQuery)
}
