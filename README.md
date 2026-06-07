# Portfolio [Live Link](https://amankushwaha.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/0e820de8-b2f9-4a71-8a6d-63cd83ef4cfe/deploy-status)](https://app.netlify.com/sites/amankushwaha/deploys)
A unique portfolio website designed to mimic the Visual Studio Code interface, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **VS Code-Inspired Design**: Familiar interface with a file explorer, tabs, and terminal
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Responsive Layout**: Mobile-friendly design with collapsible sidebar
- **Interactive Elements**: Smooth animations and transitions using Framer Motion
- **Contact Form**: Integrated with Formspree for easy communication
- **Project Showcase**: Dynamic project cards with links to live demos and source code
- **Skills Section**: Visual representation of technical skills and expertise
- **Terminal Interface**: Interactive terminal-like component for a unique user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
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
├── components/ # Reusable components
├── hooks/ # Custom hooks
├── styles/ # Global styles
└── public/ # Static assets
```

## 🎨 Customization

1. **Personal Information**: Update your details in the respective page components
2. **Projects**: Modify the projects data in `app/projects/page.tsx`
3. **Skills**: Update your skills in `app/skills/page.tsx`
4. **Theme**: Customize colors in `tailwind.config.js`
5. **Content**: Modify text content in each page component

## 📱 Responsive Design

- **Desktop**: Full VS Code-like interface
- **Tablet**: Collapsible sidebar with main content
- **Mobile**: Optimized mobile view with bottom navigation

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
