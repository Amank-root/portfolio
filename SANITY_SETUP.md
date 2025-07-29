# Portfolio with Sanity CMS Integration

This portfolio website is built with Next.js 15 and fully integrated with Sanity CMS for dynamic content management.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Sanity project details in `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Access the Sanity Studio**
   - Portfolio: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

## 📝 Content Management

### Schema Types Available

1. **Projects** (`/studio/projects`)
   - Title, description, and detailed content
   - Main image and gallery
   - Technologies used (referenced from tags)
   - GitHub and demo URLs
   - Featured projects appear on home page

2. **Skills** (`/studio/skills`)
   - Categorized skill sets (frontend, backend, tools, etc.)
   - Icons and descriptions
   - Order-based display

3. **About** (`/studio/about`)
   - Personal biography with rich text
   - Work experience and education
   - Personal interests
   - Profile image

4. **Contact** (`/studio/contact`)
   - Contact information
   - Social media links
   - Form configuration

5. **Tags** (`/studio/tags`)
   - Technology tags for projects
   - Categorized and color-coded
   - Reusable across projects

### Adding Sample Content

1. **Automated (Recommended)**
   ```bash
   node setup-sanity.js
   ```

2. **Manual Import**
   - Uncomment the last line in `sanity/sample-data.ts`
   - Run: `node -r ts-node/register sanity/sample-data.ts`

3. **Manual Entry**
   - Go to http://localhost:3000/studio
   - Create content using the Sanity Studio interface

## 🛠 Features

### Frontend Features
- ✅ Responsive design with Tailwind CSS
- ✅ Dark/light theme support
- ✅ Smooth animations with Framer Motion
- ✅ TypeScript for type safety
- ✅ Modern React 19 with hooks
- ✅ SEO optimized

### Content Management Features
- ✅ Real-time content updates
- ✅ Rich text editing with Portable Text
- ✅ Image optimization with Sanity
- ✅ Content validation and relationships
- ✅ Draft/publish workflow

### Pages & Routing
- ✅ **Home** (`/`) - Hero section with featured projects
- ✅ **About** (`/about`) - Personal information and experience
- ✅ **Projects** (`/projects`) - All projects with filtering
- ✅ **Project Details** (`/projects/[slug]`) - Individual project pages
- ✅ **Skills** (`/skills`) - Categorized skill showcase
- ✅ **Contact** (`/contact`) - Contact form and information
- ✅ **Studio** (`/studio`) - Sanity CMS admin interface

## 🔧 Configuration

### Environment Variables
```env
# Required - Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"

# Optional - Contact Form
NEXT_PUBLIC_FORM="your-formspree-form-id"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"

# Optional - Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Sanity Configuration
- Project configuration: `sanity.config.ts`
- Schema definitions: `sanity/schemaTypes/`
- Content structure: `sanity/structure.ts`
- API client: `sanity/lib/client.ts`

## 📂 Project Structure

```
├── app/                    # Next.js app router
│   ├── (root)/            # Main portfolio pages
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   ├── projects/      # Projects listing
│   │   │   └── [slug]/    # Individual project pages
│   │   └── skills/        # Skills showcase
│   └── studio/            # Sanity Studio
├── components/            # React components
│   └── ui/               # Reusable UI components
├── sanity/               # Sanity CMS configuration
│   ├── lib/              # Sanity utilities
│   └── schemaTypes/      # Content schemas
└── public/               # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- Make sure to set environment variables
- Build command: `npm run build`
- Output directory: `.next`

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📟 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥 Large screens (1440px+)

## 🎨 Customization

### Themes
- Built-in dark/light theme support
- Customizable color schemes in `tailwind.config.ts`
- Theme persistence across sessions

### Content
- All content is managed through Sanity CMS
- Real-time updates without redeployment
- Rich text editing capabilities
- Image optimization and transformation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you need help setting up or customizing your portfolio:
1. Check the documentation
2. Review the sample data structure
3. Test with the development environment
4. Check Sanity Studio for content management

---

Built with ❤️ using Next.js, Sanity CMS, and TypeScript.
