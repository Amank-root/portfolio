import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Sanity publish webhook target.
 *
 * Queries are tagged by document type (see sanity/lib/queries.ts), so this can
 * purge a single blog post's cache instead of re-rendering the entire site.
 *
 * `revalidateTag(tag, 'max')` uses stale-while-revalidate: the first visitor
 * after a publish still gets the cached page instantly while the fresh version
 * is fetched in the background. The accompanying revalidatePath call handles
 * the route segment itself.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, slug } = body as { type?: string; slug?: string }

    switch (type) {
      case 'post':
        revalidateTag('post', 'max')
        if (slug) revalidateTag(`post:${slug}`, 'max')
        revalidateTag('featured-posts', 'max')
        revalidatePath('/blog', 'page')
        if (slug) revalidatePath(`/blog/${slug}`, 'page')
        break
      case 'about':
        revalidateTag('about', 'max')
        revalidatePath('/about', 'page')
        revalidatePath('/', 'page')
        break
      case 'project':
        revalidateTag('project', 'max')
        if (slug) revalidateTag(`project:${slug}`, 'max')
        revalidateTag('featured-projects', 'max')
        revalidatePath('/projects', 'page')
        if (slug) revalidatePath(`/projects/${slug}`, 'page')
        revalidatePath('/', 'page')
        break
      case 'skill':
        revalidateTag('skill', 'max')
        revalidatePath('/skills', 'page')
        break
      case 'contact':
        revalidateTag('contact', 'max')
        revalidatePath('/contact', 'page')
        break
      case 'comment':
      case 'reaction':
        revalidateTag('blogComment', 'max')
        revalidateTag('blogReaction', 'max')
        if (slug) {
          revalidateTag(`comment:${slug}`, 'max')
          revalidateTag(`reaction:${slug}`, 'max')
          revalidatePath(`/blog/${slug}`, 'page')
        }
        break
      default:
        revalidateTag('sanity', 'max')
        revalidatePath('/', 'page')
    }

    return NextResponse.json({ ok: true, revalidated: type ?? 'all' })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}

/** Sanity's "revalidate on publish" can also ping a GET endpoint. */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret') ?? req.nextUrl.searchParams.get('secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  revalidateTag('sanity', 'max')
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true })
}
