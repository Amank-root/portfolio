import type React from 'react'
import type { Metadata } from 'next'
import { Fira_Code, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Aman Kushwaha ~ Data Scientist',
    template: '%s | Aman Kushwaha',
  },
  description:
    'Aman Kushwaha — Results-driven Data Science undergraduate with hands-on experience in machine learning, AI systems, full-stack development, and open-source projects. Passionate about building scalable solutions, learning emerging technologies, and collaborating with diverse teams to solve complex challenges. Seeking opportunities to contribute technical expertise while continuing to grow as an engineer.',
  keywords: ['Data Scientist', 'Full Stack Developer', 'MERN Stack', 'Next.js', 'React', 'TypeScript', 'AI/ML', 'Aman Kushwaha', 'amank-root', "amank root"],
  authors: [{ name: 'Aman Kushwaha' }],
  creator: 'Aman Kushwaha',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amankushwaha.dev',
    siteName: 'Aman Kushwaha Portfolio',
    title: 'Aman Kushwaha ~ Full Stack Developer',
    description: 'Results-driven Data Science undergraduate with hands-on experience in machine learning, AI systems, full-stack development, and open-source projects. Passionate about building scalable solutions, learning emerging technologies, and collaborating with diverse teams to solve complex challenges. Seeking opportunities to contribute technical expertise while continuing to grow as an engineer.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aman Kushwaha ~ Full Stack Developer',
    description: 'Results-driven Data Science undergraduate with hands-on experience in machine learning, AI systems, full-stack development, and open-source projects. Passionate about building scalable solutions, learning emerging technologies, and collaborating with diverse teams to solve complex challenges. Seeking opportunities to contribute technical expertise while continuing to grow as an engineer.',
    creator: '@AmanKushwaha_28',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          // forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(220 13% 13%)',
                border: '1px solid hsl(220 12% 20%)',
                color: 'hsl(210 30% 96%)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
