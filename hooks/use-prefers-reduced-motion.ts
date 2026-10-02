'use client'

import { useMediaQuery } from './use-media-query'

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * ## Why not `useReducedMotion` from `motion/react`
 *
 * That hook seeds `useState` from a module-level ref which `null` on the server
 * and which the client populates *synchronously, before the first render*:
 *
 *   const prefersReducedMotion = { current: null }        // server
 *   !hasReducedMotionListener.current && initPrefersReducedMotion()  // client
 *   const [shouldReduceMotion] = useState(prefersReducedMotion.current)
 *
 * So it returns `false` during SSR and the *real* value on the client's first
 * render. Any component that branches on it during render therefore produces
 * different markup on server and client for exactly the users who have reduced
 * motion enabled — the one group least likely to want a broken animation. The
 * mismatch is unrecoverable: React discards the server HTML.
 *
 * ## This version
 *
 * `useMediaQuery` uses `useSyncExternalStore` with an explicit `false` server
 * snapshot, so the first client render matches the server and the real value
 * lands in the commit *after* hydration. No mismatch, no discarded HTML.
 *
 * The cost is one extra render for reduced-motion users, which is the correct
 * trade: a correct first paint, and no `whileInView` animation ever plays.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
