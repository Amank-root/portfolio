import type React from 'react'
import { Mail, MapPin, Github, Linkedin, Twitter, Globe, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { PageHeader, Reveal } from '@/components/section'
import { SpotlightCard } from '@/components/spotlight-card'
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
  const title = contact?.title || 'Get in touch'
  const description =
    contact?.description ||
    'Have a project in mind, or want to talk through an idea? Send a note using the form, or email me directly — either works.'

  // Parse social links or use defaults
  const socialLinks = contact?.socialLinks || [
    { platform: 'GitHub', url: 'https://github.com/amank-root', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/amank-root', icon: 'linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com/AmanKushwaha_28', icon: 'twitter' },
  ]

  return (
    <div className="container">
      <PageHeader eyebrow="Contact" title={title} lede={description} />

      <div className="grid gap-10 pb-20 lg:grid-cols-[1fr_20rem] lg:gap-12 sm:pb-28">
        {/* Form — the primary column, so it gets the width. */}
        <Reveal>
          <ContactForm formspreeEndpoint={contact?.formspreeEndpoint} recaptchaSiteKey={contact?.recaptchaSiteKey} />
        </Reveal>

        {/* Details, as one spotlight panel rather than four stacked cards. */}
        <Reveal delay={0.12}>
          <SpotlightCard className="h-full" glowColor="var(--aurora-cyan)">
            <p className="eyebrow">Details</p>

            <dl className="mt-6 space-y-6">
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${email}`}
                    className="break-all text-[0.95rem] text-foreground transition-colors hover:text-primary"
                  >
                    {email}
                  </a>
                </dd>
              </div>

              <div className="border-t border-border/60 pt-5">
                <dt className="eyebrow">Based in</dt>
                <dd className="mt-2 flex items-start gap-2 text-[0.95rem] text-foreground-muted">
                  <MapPin size={14} className="mt-1 shrink-0 text-primary" aria-hidden />
                  {location}
                </dd>
              </div>

              <div className="border-t border-border/60 pt-5">
                <dt className="eyebrow">Elsewhere</dt>
                <dd className="mt-3 flex flex-col gap-2.5">
                  {socialLinks.map((link, idx) => {
                    const Icon = ICON_MAP[link.platform.toLowerCase()] || Globe
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 text-[0.95rem] text-foreground-muted transition-colors hover:text-foreground"
                      >
                        <Icon size={14} className="text-foreground-subtle" aria-hidden />
                        {link.platform}
                      </a>
                    )
                  })}
                </dd>
              </div>

              <div className="border-t border-border/60 pt-5">
                <dt className="eyebrow">Response time</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-foreground-muted">
                  Usually within a day or two. If it&apos;s urgent, email beats the form.
                </dd>
              </div>
            </dl>
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  )
}
