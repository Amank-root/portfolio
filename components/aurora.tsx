'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * Aurora background, painted on a single <canvas>.
 *
 * The common approach (a stack of absolutely-positioned, heavily-blurred divs)
 * costs several full-screen composited layers and still repaints on every
 * animation frame. One canvas with three slow-moving radial gradients is
 * dramatically cheaper: the browser rasterises one element, and the work
 * scales with the smaller backing store we give it rather than with viewport
 * area × blur radius.
 *
 * Colours are read from the CSS custom properties the canvas itself inherits,
 * so the artwork can never drift from the UI palette in either theme.
 */
export function Aurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  // Re-paint when the theme flips: the aurora hues are lightness-tuned per
  // theme, so the dark palette's neon values would glow on a light field.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Cap the backing store. The aurora is entirely soft gradients, so
    // rendering at ~60% of device resolution is visually indistinguishable and
    // cuts fill-rate by ~3×. A 3× DPR phone would otherwise rasterise nine
    // million pixels of gradient per frame.
    const SCALE = 0.6
    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    let intensity = 1
    let colours: { cyan: string; violet: string; coral: string } | null = null

    const readColour = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

    const loadColours = () => {
      colours = {
        cyan: readColour('--aurora-cyan'),
        violet: readColour('--aurora-violet'),
        coral: readColour('--aurora-coral'),
      }
      // Light mode gets a fraction of the intensity: these blooms use additive
      // blending, which on a near-white field immediately fights the text.
      intensity = document.documentElement.classList.contains('dark') ? 1 : 0.34
    }

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr * SCALE))
      canvas.height = Math.max(1, Math.floor(height * dpr * SCALE))
    }

    /* Three blooms on slow, mutually prime orbits so the composite never
       visibly loops.

       Alphas are low (0.14–0.26). The original values were tuned against a
       near-black indigo page and read as a saturated nebula; on the warm
       charcoal background they tint the whole viewport. These keep the aurora
       as ambient depth rather than as the thing you look at. */
    const BLOOMS = [
      { hue: 'violet' as const, ax: 0.28, ay: 0.3, speed: 0.00006, size: 0.85, alpha: 0.26 },
      { hue: 'cyan' as const, ax: 0.72, ay: 0.24, speed: 0.000048, size: 0.7, alpha: 0.18 },
      { hue: 'coral' as const, ax: 0.5, ay: 0.78, speed: 0.000039, size: 0.95, alpha: 0.14 },
    ]

    const draw = (time: number) => {
      if (!colours) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 'lighter' is what makes overlapping blooms read as light rather than
      // as paint — the core of the aurora effect.
      ctx.globalCompositeOperation = 'lighter'

      for (const bloom of BLOOMS) {
        const cx = (bloom.ax + Math.sin(time * bloom.speed + bloom.ax * 9) * 0.16) * width
        const cy = (bloom.ay + Math.cos(time * bloom.speed * 1.3 + bloom.ay * 7) * 0.14) * height
        const radius = Math.max(width, height) * bloom.size

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        const a = bloom.alpha * intensity
        gradient.addColorStop(0, `hsl(${colours[bloom.hue]} / ${a})`)
        gradient.addColorStop(0.45, `hsl(${colours[bloom.hue]} / ${a * 0.28})`)
        gradient.addColorStop(1, `hsl(${colours[bloom.hue]} / 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (time: number) => {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (reduced.matches || !visible) {
        // Paint a single static frame — the composition still reads as an
        // aurora, it just doesn't move.
        draw(2400)
        return
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    }

    // Don't burn frames on a backgrounded tab or an off-screen canvas.
    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start()
      else cancelAnimationFrame(raf)
    }

    loadColours()
    resize()
    start()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    // Recompute when the OS preference changes…
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', loadColours)
    // …and when the in-app toggle flips the class on <html>, which is what
    // actually drives the palette. Without this the aurora keeps the old
    // theme's intensity until the next resize.
    const themeObserver = new MutationObserver(() => {
      loadColours()
      start()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    reduced.addEventListener('change', start)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      themeObserver.disconnect()
      media.removeEventListener('change', loadColours)
      reduced.removeEventListener('change', start)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [resolvedTheme])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* The blur is applied to the canvas element itself, so the browser blurs
          one composited layer instead of tracking several. No opacity here —
          the per-bloom alphas already carry the intensity, and compounding the
          two was what made the first pass read as a saturated wash. */}
      <canvas ref={canvasRef} className="h-full w-full blur-3xl" />
    </div>
  )
}
