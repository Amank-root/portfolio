import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Badge hosts embedded in markdown bodies (project write-ups and blog posts).
 *
 * These serve tiny generated SVG/PNG badges. Routing them through the image
 * optimizer buys nothing — the AVIF/WebP encode of a 200x20 badge costs more
 * than it saves — so they're marked unoptimized and given a fixed box to
 * prevent layout shift as they load.
 *
 * Kept in one place because the CSP header, the next/image `remotePatterns`
 * config and this predicate all have to agree on the same host list.
 */
export const BADGE_HOSTS = ['img.shields.io', 'badgen.net'] as const

export function isBadge(src: string): boolean {
  return BADGE_HOSTS.some(host => src.includes(host))
}
