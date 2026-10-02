import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const alt = `${siteConfig.name} — ${siteConfig.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Site-wide OG card. Generated rather than a static asset so it stays in sync
 * with siteConfig and costs ~0 bytes of repo/CDN until requested.
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
        background: '#0b0e14',
        backgroundImage:
          'radial-gradient(circle at 15% 20%, #10344a 0%, transparent 45%), radial-gradient(circle at 85% 80%, #1c2b52 0%, transparent 45%)',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Brand mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            fontWeight: 700,
            color: '#0b0e14',
          }}
        >
          AK
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#e6edf3', lineHeight: 1.2 }}>{siteConfig.name}</div>
          <div style={{ fontSize: '22px', color: '#7d8590', lineHeight: 1.3 }}>{siteConfig.role}</div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            fontSize: '62px',
            fontWeight: 800,
            color: '#e6edf3',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}
        >
          I build fast, accessible web products — and the AI systems behind them.
        </div>
        <div style={{ fontSize: '28px', color: '#8b949e', lineHeight: 1.4, maxWidth: '880px' }}>
          Next.js, TypeScript, React, Python, machine learning, and open-source tooling.
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #21262d',
          paddingTop: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: '#34d399' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#34d399' }} />
          Available for opportunities
        </div>
        <div style={{ fontSize: '24px', color: '#7d8590' }}>amankushwaha.dev</div>
      </div>
    </div>,
    size
  )
}
