'use client'
import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

export function useHasMounted() {
  // SSR-safe hydration detection (same pattern next-themes uses).
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useHasMounted()
  if (!mounted) return <>{fallback}</>
  return <>{children}</>
}
