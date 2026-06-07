'use client'

import { useEffect } from 'react'

interface PageViewTrackerProps {
  path: string
  blogSlug?: string
}

export function PageViewTracker({ path, blogSlug }: PageViewTrackerProps) {
  useEffect(() => {
    const sessionId = getOrCreateSessionId()

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        blogSlug,
        sessionId,
        referrer: document.referrer,
        device: getDeviceType(),
      }),
    }).catch(() => {})
  }, [path, blogSlug])

  return null
}

function getOrCreateSessionId(): string {
  const key = 'portfolio-session'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = Math.random().toString(36).substr(2, 16)
    sessionStorage.setItem(key, id)
  }
  return id
}

function getDeviceType(): string {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}
