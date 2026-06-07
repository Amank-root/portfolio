'use client'

import type React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Terminal } from '@/components/terminal'
import { Mail, MapPin, Github, Linkedin, Twitter, Globe, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import type { Contact } from '@/sanity/lib/types'

const ICON_MAP: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
  website: Globe,
  phone: Phone,
}

interface ContactClientProps {
  contact: Contact | null
}

export function ContactClient({ contact }: ContactClientProps) {
  const email = contact?.email || 'contact@amank-root.slmail.me'
  const location = contact?.location || 'New Delhi, Delhi, India'
  const title = contact?.title || 'Get In Touch'
  const description =
    contact?.description ||
    'Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form below or via my contact information.'

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Parse social links or use defaults
  const socialLinks = contact?.socialLinks || [
    { platform: 'GitHub', url: 'https://github.com/amank-root' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/amank-root' },
    { platform: 'Twitter', url: 'https://twitter.com/AmanKushwaha_28' },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-border/10 bg-card/20">
        <div className="mx-auto max-w-6xl">
          <motion.h1
            className="mb-4 text-3xl font-bold gradient-text sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Contact Form */}
          <motion.div variants={item}>
            <ContactForm
              formspreeEndpoint={contact?.formspreeEndpoint}
              recaptchaSiteKey={contact?.recaptchaSiteKey}
            />
          </motion.div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <motion.div variants={item}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContactItem
                    icon={Mail}
                    title="Email"
                    value={email}
                    href={`mailto:${email}`}
                  />
                  <ContactItem icon={MapPin} title="Location" value={location} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {socialLinks.map((link, idx) => {
                    const iconName = link.platform.toLowerCase()
                    const Icon = ICON_MAP[iconName] || Globe
                    return (
                      <SocialButton
                        key={idx}
                        icon={Icon}
                        label={link.platform}
                        href={link.url}
                      />
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                    Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Terminal>
                    <div className="terminal-prompt">cat contact_info.txt</div>
                    <div className="terminal-output mb-4">
                      Email: {email}
                      {"\n"}
                      Location: {location}
                    </div>

                    <div className="terminal-prompt">
                      echo &quot;I&apos;m looking forward to hearing from you!&quot;
                    </div>
                    <div className="terminal-output">I&apos;m looking forward to hearing from you!</div>
                  </Terminal>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

interface ContactItemProps {
  icon: React.ElementType
  title: string
  value: string
  href?: string
}

function ContactItem({ icon: Icon, title, value, href }: ContactItemProps) {
  return (
    <motion.div className="flex items-start gap-3" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
      <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
        <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
        {href ? (
          <a href={href} className="text-xs text-muted-foreground hover:text-primary hover:underline sm:text-sm">
            {value}
          </a>
        ) : (
          <p className="text-xs text-muted-foreground sm:text-sm">{value}</p>
        )}
      </div>
    </motion.div>
  )
}

interface SocialButtonProps {
  icon: React.ElementType
  label: string
  href: string
}

function SocialButton({ icon: Icon, label, href }: SocialButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      {label}
    </motion.a>
  )
}
