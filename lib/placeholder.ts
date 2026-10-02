/**
 * Local placeholder for projects that have no `mainImage`.
 *
 * Previously these fell back to `https://dummyimage.com/...`, which meant every
 * project card without an image fired a request to a third-party host (a slow
 * one, which also leaks every visitor's IP and referrer to them, and shows an
 * ad-hoc placeholder if the host is down). This is a self-hosted SVG instead.
 */
export function projectPlaceholder(title: string): string {
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('')

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#161412" />
      <stop offset="100%" stop-color="#241f19" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="470" cy="240" r="260" fill="#c47850" fill-opacity="0.14" />
  <circle cx="760" cy="430" r="200" fill="#7c8f74" fill-opacity="0.10" />
  <circle cx="600" cy="300" r="76" fill="none" stroke="#c47850" stroke-width="2" opacity="0.6" />
  <text x="600" y="300" font-family="ui-sans-serif, system-ui, sans-serif" font-size="60" font-weight="700"
        fill="#d8b99f" fill-opacity="0.7" text-anchor="middle" dominant-baseline="central">${escapeXml(initials || '//')}</text>
  <text x="600" y="440" font-family="ui-sans-serif, system-ui, sans-serif" font-size="34" font-weight="400"
        fill="#8d867a" text-anchor="middle">${escapeXml(truncate(title, 42))}</text>
</svg>`.trim()

  // Inline data URI: no network request at all, and it satisfies next/image.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value
}
