import type { MetadataRoute } from 'next'
import { BlogPost, Project } from '@/sanity/lib/types'
import { getBlogPosts, getProjects } from '@/sanity/lib/queries'


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.amankushwaha.dev"


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    let allPosts: BlogPost[] = []
    let allProjects: Project[] = []

    try {
        const getBlogs = getBlogPosts().catch(() => [])
        const getAllProjects = getProjects().catch(() => [])

        const response = await Promise.all([getAllProjects, getBlogs]) as [Project[], BlogPost[]]

        [allProjects, allPosts] = response
    } catch (error) {
        console.error("failed to fetch posts for sitemap:", error)
    }

    const blogURLS = allPosts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug.current}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    }))

    const projectURLS = allProjects.map((project)=>({
        url: `${BASE_URL}/projects/${project.slug.current}`,
        lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5
    }))

    const staticURLS = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/skills`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        }
    ]
    return [
        ...staticURLS,
        ...blogURLS,
        ...projectURLS
    ]
}