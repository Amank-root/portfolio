/**
 * Primary navigation, defined once.
 *
 * The previous design kept three copies of this list — the tab bar, the file
 * explorer and the mobile bar all declared their own — which is why the terminal
 * redesign had three places to touch. One list, imported everywhere.
 */
export const navItems = [
  { name: 'Work', path: '/projects', description: 'Selected projects' },
  { name: 'About', path: '/about', description: 'Background and experience' },
  { name: 'Skills', path: '/skills', description: 'Tools and stack' },
  { name: 'Writing', path: '/blog', description: 'Notes and articles' },
  { name: 'Contact', path: '/contact', description: 'Start a conversation' },
] as const

/**
 * Home is reachable via the wordmark rather than the nav list, so it stays out
 * of the way. Matching a nested path (`/blog/some-post`) still marks `Writing`
 * as the current section.
 */
export function isActivePath(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(`${path}/`)
}
