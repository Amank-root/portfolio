import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const alt = `${siteConfig.name} — ${siteConfig.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Site-wide OG card. Generated rather than a static asset so it stays in sync
 * with siteConfig and costs ~0 bytes of repo/CDN until requested.
 *
 * Mirrors the live site's palette — warm charcoal with the same muted aurora
 * blooms the canvas paints — so a shared link looks like a page from the site
 * rather than a different product.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#141311',
        backgroundImage:
          'radial-gradient(circle at 18% 12%, rgba(196,120,80,0.24) 0%, transparent 48%), radial-gradient(circle at 88% 88%, rgba(130,140,120,0.18) 0%, transparent 45%), radial-gradient(circle at 62% 40%, rgba(150,120,180,0.14) 0%, transparent 45%)',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #c47850 0%, #8b7fb8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            fontWeight: 700,
            color: '#141311',
            letterSpacing: '-0.02em',
          }}
        >
          A
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '30px', fontWeight: 600, color: '#26221c', lineHeight: 1.2 }}>{siteConfig.name}</div>
          <div style={{ fontSize: '20px', color: '#a9a196', lineHeight: 1.4 }}>{siteConfig.role}</div>
        </div>
      </div>

      {/* Headline — the serif voice, approximated with a light weight and
          generous tracking at this size. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#ece8e0',
            lineHeight: 1.14,
            letterSpacing: '-0.03em',
            maxWidth: '920px',
          }}
        >
          I build AI/ML systems that reach production — and the web products that ship them.
        </div>
        <div style={{ fontSize: '26px', color: '#a9a196', lineHeight: 1.45, maxWidth: '880px' }}>
          Retrieval, fine-tuning and evaluation pipelines in Python and PyTorch. Next.js, TypeScript and React on top.
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #332f2a',
          paddingTop: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '23px', color: '#8fae8b' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#8fae8b' }} />
          {siteConfig.availability}
        </div>
        <div style={{ fontSize: '23px', color: '#8d867a' }}>amankushwaha.dev</div>
      </div>
    </div>,
    size
  )
}
