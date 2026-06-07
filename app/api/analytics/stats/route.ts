import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-dashboard-key')
  if (authHeader !== process.env.DASHBOARD_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [totalViews, blogViews, viewsByDay, totalReactions, totalComments] = await Promise.all([
      client.fetch(`count(*[_type == "pageView"])`),
      client.fetch(`count(*[_type == "pageView" && defined(blogSlug)])`),
      client.fetch(`
        *[_type == "pageView" && dateTime(viewedAt) > dateTime(now()) - 60*60*24*30] | order(viewedAt asc) {
          "date": viewedAt[0...10], path, blogSlug
        }
      `),
      client.fetch(`count(*[_type == "blogReaction"])`),
      client.fetch(`count(*[_type == "blogComment" && approved == true])`),
    ])

    const slugCounts: Record<string, number> = {}
    const dateCounts: Record<string, number> = {}

    for (const v of viewsByDay as { date: string; path: string; blogSlug?: string }[]) {
      if (v.date) dateCounts[v.date] = (dateCounts[v.date] || 0) + 1
      if (v.blogSlug) slugCounts[v.blogSlug] = (slugCounts[v.blogSlug] || 0) + 1
    }

    return NextResponse.json({
      totalViews,
      blogViews,
      totalReactions,
      totalComments,
      topPosts: Object.entries(slugCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, count]) => ({ slug, count })),
      viewsByDay: Object.entries(dateCounts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count })),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
