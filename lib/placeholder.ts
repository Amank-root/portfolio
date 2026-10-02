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
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0e1621" />
      <stop offset="100%" stop-color="#131c2b" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0v40" fill="none" stroke="#1e293b" stroke-width="1" opacity="0.6" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#g)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <circle cx="600" cy="300" r="76" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.35" />
  <text x="600" y="300" font-family="ui-sans-serif, system-ui, sans-serif" font-size="64" font-weight="700"
        fill="#22d3ee" fill-opacity="0.55" text-anchor="middle" dominant-baseline="central">${escapeXml(initials || '//')}</text>
  <text x="600" y="440" font-family="ui-sans-serif, system-ui, sans-serif" font-size="34" font-weight="500"
        fill="#94a3b8" text-anchor="middle">${escapeXml(truncate(title, 42))}</text>
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
