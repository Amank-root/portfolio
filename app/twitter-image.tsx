import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const alt = `${siteConfig.name} — ${siteConfig.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Twitter/X uses the same 1200x630 card as OG — no separate design needed. */
export default async function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#0b0e14',
        backgroundImage: 'radial-gradient(circle at 20% 25%, #10344a 0%, transparent 50%)',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: '72px', fontWeight: 800, color: '#e6edf3', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {siteConfig.name}
      </div>
      <div style={{ fontSize: '38px', color: '#22d3ee', marginTop: '16px', fontWeight: 600 }}>{siteConfig.role}</div>
      <div style={{ fontSize: '28px', color: '#8b949e', marginTop: '28px', maxWidth: '820px', lineHeight: 1.4 }}>
        Building fast, accessible web products with Next.js, TypeScript and machine learning.
      </div>
    </div>,
    size
  )
}
