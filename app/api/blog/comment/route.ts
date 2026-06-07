import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { blogSlug, name, email, content } = await req.json()

    if (!blogSlug || !name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'blogComment',
      blogSlug,
      name: name.trim(),
      email: email?.trim() || undefined,
      content: content.trim(),
      approved: false,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  }
}
