import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple touch icon. Renders as a route rather than a committed PNG so the mark
 * stays crisp at 180px — app/favicon.ico is a 32px bitmap, and upscaling it to
 * touch-icon size produced an illegible smear.
 *
 * Deliberately matches the existing favicon: near-black field (#0b1320) with a
 * light "AK" monogram, so the home-screen icon and the browser tab agree.
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
        background: '#0b1320',
        color: '#e8edf5',
        fontSize: 82,
        fontWeight: 700,
        letterSpacing: -2,
        fontFamily: 'sans-serif',
      }}
    >
      AK
    </div>,
    size
  )
}
