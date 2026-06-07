import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, slug } = body

    if (type === 'post') {
      revalidatePath('/blog')
      if (slug) revalidatePath(`/blog/${slug}`)
    } else if (type === 'about') {
      revalidatePath('/about')
      revalidatePath('/')
    } else if (type === 'project') {
      revalidatePath('/projects')
      if (slug) revalidatePath(`/projects/${slug}`)
      revalidatePath('/')
    } else {
      revalidatePath('/')
    }

    return NextResponse.json({ ok: true, revalidated: type })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
