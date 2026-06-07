'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useForm, ValidationError } from '@formspree/react'
import dynamic from 'next/dynamic'

// Dynamically import ReCAPTCHA with SSR disabled to prevent "window is not defined" errors
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

  // Show toast and handle success transition
  useEffect(() => {
    if (state.succeeded) {
      toast.success('Message sent successfully!', {
        description: "Thank you for your message. I'll get back to you soon.",
      })
      setShowSuccess(true)
      // Reset form data and recaptcha token
      setFormData({ name: '', email: '', subject: '', message: '' })
      setRecaptchaToken(null)

      // Hide success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [state.succeeded])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (siteKey && !recaptchaToken) {
      toast.error('reCAPTCHA Required', {
        description: 'Please complete the reCAPTCHA verification.',
      })
      return
    }

    handleSubmit(e)
  }

  return (
    <div className="glass rounded-xl p-6 border border-border/50">
      <h2 className="font-semibold text-foreground mb-6">Send a Message</h2>

      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
          <p className="text-muted-foreground text-sm">I&apos;ll get back to you within 24 hours.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-xs text-muted-foreground mb-1.5 block">
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="bg-background border-border/50 focus:border-primary/50 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs text-muted-foreground mb-1.5 block">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="bg-background border-border/50 focus:border-primary/50 text-sm"
              />
              <ValidationError field="email" prefix="Email" errors={state.errors} />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="text-xs text-muted-foreground mb-1.5 block">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
              className="bg-background border-border/50 focus:border-primary/50 text-sm"
            />
          </div>

          <div>
            <label htmlFor="message" className="text-xs text-muted-foreground mb-1.5 block">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, idea, or just say hi..."
              required
              rows={6}
              className="bg-background border-border/50 focus:border-primary/50 resize-none text-sm"
            />
          </div>

          {/* ReCAPTCHA — token is captured via onChange, avoiding ref forwarding issues */}
          {siteKey && (
            <div className="mb-4 flex justify-center">
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
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={14} />
              <ValidationError errors={state.errors} />
            </div>
          )}

          <Button
            type="submit"
            disabled={state.submitting}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {state.submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={14} />
                Send Message
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
