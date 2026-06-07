import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, blogSlug, sessionId, referrer, device } = body

    // Skip studio/api routes
    if (path?.startsWith('/studio') || path?.startsWith('/api')) {
      return NextResponse.json({ ok: true })
    }

    // Rate limit: check if this session already viewed this path in the last 30 min
    const recentView = await client.fetch(
      `*[_type == "pageView" && sessionId == $sessionId && path == $path && dateTime(viewedAt) > dateTime(now()) - 60*30][0]._id`,
      { sessionId, path }
    )

    if (recentView) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const country = req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') || 'Unknown'

    await writeClient.create({
      _type: 'pageView',
      path,
      blogSlug: blogSlug || undefined,
      viewedAt: new Date().toISOString(),
      country,
      device: device || 'unknown',
      referrer: referrer || undefined,
      sessionId,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
