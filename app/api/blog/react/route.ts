import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { blogSlug, type, action } = await req.json()

    if (!blogSlug || !type || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const validTypes = ['love', 'fire', 'insightful', 'celebrate', 'thinking']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    if (action === 'add') {
      await writeClient.create({
        _type: 'blogReaction',
        blogSlug,
        type,
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 })
  }
}
