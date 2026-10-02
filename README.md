# Portfolio [Live Link](https://amankushwaha.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/0e820de8-b2f9-4a71-8a6d-63cd83ef4cfe/deploy-status)](https://app.netlify.com/sites/amankushwaha/deploys)
A motion-forward portfolio on a warm, low-chroma palette: **champagne paper** in
light mode and **warm charcoal** in dark, with a muted aurora providing depth and
**Syne** carrying the display type. Hand-authored in the Aceternity idiom
(spotlight cards, animated gradient borders, magnetic buttons, text generate,
number tickers, marquee) on top of `motion`.

## 🚀 Features

- **Canvas aurora background**: three slow-moving radial gradients composited with
  `lighter`, rendered at 60% device resolution with the blur applied once to the
  canvas element — far cheaper than the usual stack of `blur(3xl)` divs. Intensity
  drops to ~34% in light mode, since additive blending fights text on a pale field
- **Warm neutral palette**: hue held near champagne/charcoal in both themes; only
  the value range shifts. Surfaces that need to read as raised use `--card`, never
  `--background` (a panel filled with the page colour is invisible)
- **Motion components** (`components/`): `aurora`, `spotlight-card`,
  `animated-border`, `text-generate`, `number-ticker`, `marquee`, `magnetic`,
  `scroll-progress`
- **Three-voice typography**: Syne (display), Instrument Sans (body), Geist Mono
  (code and micro-labels only)
- **Dark-first theming**: dark is the default; light is a hand-tuned "dawn" variant
  of the same hue family. Every text token clears WCAG AA in both themes
- **Reduced-motion first**: every animation component checks
  `prefers-reduced-motion` in JS and skips its work entirely, rather than
  relying on the CSS override alone
- **Performance guards**: the aurora pauses on hidden tabs and off-screen; the
  marquee derives its duration from measured track width so speed is constant
  regardless of how many items the CMS returns
- **Content**: Projects, skills, posts and bio are all managed in Sanity

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Motion (`motion/react`)
- **Form Handling**: Formspree
- **Icons**: Lucide Icons
- **Deployment**: Netlify

## 🚦 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Amank-root/portfolio.git
cd portfolio
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

```bash
# Create a .env.local file and add:
NEXT_PUBLIC_FORM=your_formspree_form_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
NETLIFY_NEXT_PLUGIN_SKIP=true
```

4. **Run the development server**

```bash
npm run dev
# or
pnpm dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```markdown
portfolio/
├── app/ # Next.js app directory
│ ├── about/ # About page
│ ├── contact/ # Contact page
│ ├── projects/ # Projects page
│ ├── skills/ # Skills page
│ └── layout.tsx # Root layout
│ └── (root)/ # Routes that share the site header and footer
├── components/ # Reusable components
│ └── sections/ # Page-level sections (hero)
├── lib/ # Site constants, navigation, SEO helpers
├── sanity/ # CMS schema, queries and types
└── public/ # Static assets
```

## 🎨 Customization

1. **Site-wide constants**: `lib/site.ts` (name, URLs, socials, SEO defaults)
2. **Navigation**: `lib/navigation.ts` — the single source for header, footer and
   mobile menu, all of which read from it
3. **Colors**: the two palettes at the top of `app/globals.css`
4. **Projects / skills / posts**: managed in Sanity Studio, not in code
5. **Section headers**: `components/section.tsx` (`SectionHeading`, `PageHeader`)

## 📱 Responsive Design

- **Desktop**: Single-column editorial measure with a sidebar grid on the inner
  pages (project meta, contact details)
- **Mobile**: Same reading order; the nav collapses into a disclosure menu

## 🔧 Development

- Run tests: `npm run test`
- Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Your Name - [@AmanKushwaha_28](https://twitter.com/AmanKushwaha_28)
Project Link: [https://github.com/Amank-root/portfolio](https://github.com/Amank-root/portfolio)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Formspree](https://formspree.io/) for form handling
- [Framer Motion](https://www.framer.com/motion/) for animations
