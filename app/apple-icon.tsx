import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple touch icon. Renders as a route rather than a committed PNG so the mark
 * stays crisp at 180px — app/favicon.ico is a 32px bitmap, and upscaling it to
 * touch-icon size produced an illegible smear.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #141311 0%, #241f1a 100%)',
        color: '#c47850',
        fontSize: 92,
        fontWeight: 700,
        letterSpacing: -4,
        fontFamily: 'sans-serif',
      }}
    >
      A
    </div>,
    size
  )
}
