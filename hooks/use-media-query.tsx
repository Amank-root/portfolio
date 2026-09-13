'use client'

import { useSyncExternalStore } from 'react'

/**
 * Subscribes to window.matchMedia. Browser-only: the empty server snapshot
 * makes this SSR-safe (renders false on the server, true match value on the
 * client after hydration — no effects or manual state needed).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false // server snapshot — used during SSR
  )
}
