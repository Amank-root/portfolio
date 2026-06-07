'use client'
import { useState, useEffect } from 'react'

export function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return mounted
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
