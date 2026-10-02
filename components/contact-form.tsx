'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useForm, ValidationError } from '@formspree/react'

/**
 * reCAPTCHA v2 checkbox.
 *
 * The widget injects `window.grecaptcha` during script load, so it cannot be
 * rendered on the server — a plain import throws "window is not defined" at
 * build time. `ssr: false` is the fix; it is also why the component itself
 * stays a separate client file rather than being inlined into a server page.
 */
const ReCAPTCHAComponent = dynamic(() => import('react-google-recaptcha'), { ssr: false })

interface ContactFormProps {
  formspreeEndpoint?: string
  recaptchaSiteKey?: string
}

export function ContactForm({ formspreeEndpoint, recaptchaSiteKey }: ContactFormProps) {
  // Use the form ID from Sanity or fallback to environment variables
  const formKey = formspreeEndpoint || process.env.NEXT_PUBLIC_FORM || ''
  const siteKey = recaptchaSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  const [state, handleSubmit] = useForm(formKey)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  // Toast + success transition once Formspree confirms the send.
  useEffect(() => {
    if (!state.succeeded) return

    toast.success('Message sent', { description: "Thanks — I'll get back to you soon." })

    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets an event-driven success panel, not derived state
    setShowSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setRecaptchaToken(null)

    const timer = setTimeout(() => setShowSuccess(false), 4000)
    return () => clearTimeout(timer)
  }, [state.succeeded])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // v2 renders a real checkbox, so an empty token means the user simply has
    // not ticked it yet — asking them to complete the verification is accurate.
    if (siteKey && !recaptchaToken) {
      toast.error('reCAPTCHA Required', {
        description: 'Please complete the reCAPTCHA verification.',
      })
      return
    }

    handleSubmit(e)
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-2xl">Send a message</h2>
      <p className="mt-2 text-sm text-foreground-muted">
        Fill this in and it goes straight to my inbox. No tracking, no newsletter.
      </p>

      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-16 text-center"
        >
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border">
            <CheckCircle2 size={22} className="text-accent" />
          </div>
          <h3 className="font-display text-2xl text-foreground">Message sent</h3>
          <p className="mt-3 text-sm text-foreground-muted">I&apos;ll get back to you within a day or two.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="eyebrow mb-2 block">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="h-11 bg-background/60 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow mb-2 block">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="h-11 bg-background/60 text-sm"
              />
              <ValidationError field="email" prefix="Email" errors={state.errors} />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="eyebrow mb-2 block">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
              className="h-11 bg-background/60 text-sm"
            />
          </div>

          <div>
            <label htmlFor="message" className="eyebrow mb-2 block">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, idea, or just say hi..."
              required
              rows={6}
              className="resize-none bg-background/60 text-sm"
            />
          </div>

          {/* reCAPTCHA v2 — token is captured via onChange rather than a ref, so
              there is no ref-forwarding problem through the dynamic import. */}
          {siteKey && (
            <div className="flex justify-center py-1">
              <ReCAPTCHAComponent
                sitekey={siteKey}
                theme="dark"
                onChange={(token: string | null) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>
          )}

          {/* General form errors */}
          {state.errors && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={14} />
              <ValidationError errors={state.errors} />
            </div>
          )}

          <Button type="submit" disabled={state.submitting} size="lg" className="w-full gap-2">
            {state.submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Sending…
              </>
            ) : (
              <>
                <Send size={15} />
                Send message
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
