import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { z } from 'zod'

const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const IngestSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  content: z.string().min(10),
  excerpt: z.string().max(300).optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().int().positive().optional(),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
})

export async function POST(req: NextRequest) {
  // Verify API key
  const apiKey = req.headers.get('x-api-key')
  if (apiKey !== process.env.BLOG_INGEST_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = IngestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { title, slug, content, excerpt, tags, readTime, published, featured } = parsed.data

    // Check if slug already exists
    const existing = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug }
    )

    if (existing) {
      // Update existing post
      await writeClient.patch(existing)
        .set({
          title,
          markdownBody: content,
          contentType: 'markdown',
          excerpt: excerpt || undefined,
          tags: tags || [],
          readTime: readTime || undefined,
          featured: featured || false,
          ...(published ? { publishedAt: new Date().toISOString() } : {}),
        })
        .commit()

      return NextResponse.json({ ok: true, action: 'updated', id: existing })
    }

    // Create new post
    const doc = await writeClient.create({
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      markdownBody: content,
      contentType: 'markdown',
      excerpt: excerpt || undefined,
      tags: tags || [],
      readTime: readTime || undefined,
      featured: featured || false,
      publishedAt: published ? new Date().toISOString() : undefined,
    })

    return NextResponse.json({ ok: true, action: 'created', id: doc._id }, { status: 201 })
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (apiKey !== process.env.BLOG_INGEST_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    endpoint: '/api/blog/ingest',
    method: 'POST',
    headers: { 'x-api-key': 'YOUR_BLOG_INGEST_API_KEY', 'Content-Type': 'application/json' },
    body: {
      title: 'string (required, 5-200 chars)',
      slug: 'string (required, lowercase-alphanumeric-hyphens)',
      content: 'string (required, Markdown with Mermaid support)',
      excerpt: 'string (optional, max 300 chars)',
      tags: 'string[] (optional)',
      readTime: 'number (optional, minutes)',
      published: 'boolean (optional, default false)',
      featured: 'boolean (optional, default false)',
    },
    example: {
      title: 'Building a Real-time Chat App with Next.js',
      slug: 'real-time-chat-nextjs',
      content: '# Introduction\n\nIn this post...\n\n```mermaid\nflowchart TD\n  A[User] --> B[Next.js]\n  B --> C[WebSocket]\n```',
      excerpt: 'Learn how to build real-time features with Next.js and WebSockets',
      tags: ['nextjs', 'websockets', 'realtime'],
      readTime: 8,
      published: true,
    },
  })
}
