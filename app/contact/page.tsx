"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal } from "@/components/terminal"
import { useToast } from "@/hooks/use-toast"
import { Mail, MapPin, Github, Linkedin, Twitter, Send, MessageSquare, User } from "lucide-react"

export default function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string
    }

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      })

      setShowSuccess(true)
      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      })
      e.currentTarget.reset()
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h1
            className="mb-4 text-2xl font-bold text-primary sm:text-3xl md:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className="max-w-3xl text-base text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form
            below or via my contact information.
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Send a Message</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form name="contact" data-netlify-recaptcha="true" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" method="POST" data-netlify="true">
                <input type="hidden" name="form-name" value="contact" />
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="name" className="text-xs font-medium sm:text-sm">
                          Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="text-xs sm:text-sm pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="email" className="text-xs font-medium sm:text-sm">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email"
                            required
                            className="text-xs sm:text-sm pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <label htmlFor="subject" className="text-xs font-medium sm:text-sm">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        required
                        className="text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <label htmlFor="message" className="text-xs font-medium sm:text-sm">
                        Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your message"
                          className="min-h-[120px] text-xs sm:min-h-[150px] sm:text-sm pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div data-netlify-recaptcha="true"></div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full gap-2 text-xs sm:text-sm" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="h-3 w-3 animate-spin sm:h-4 sm:w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-800"
                    >
                      Message sent successfully!
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Here are the ways you can reach me directly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <ContactItem
                    icon={Mail}
                    title="Email"
                    value="contact@amank-root.slmail.me"
                    href="mailto:contact@amank-root.slmail.me"
                  />

                  {/* <ContactItem icon={Phone} title="Phone" value="+1 (555) 123-4567" href="tel:+15551234567" /> */}

                  <ContactItem icon={MapPin} title="Location" value="New Delhi, Delhi, India" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Social Media</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Connect with me on social platforms.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 sm:gap-4">
                  <SocialButton icon={Github} label="GitHub" href="https://github.com/amank-root" />

                  <SocialButton icon={Linkedin} label="LinkedIn" href="https://linkedin.com/in/amank-root" />

                  <SocialButton icon={Twitter} label="Twitter" href="https://twitter.com/AmanKushwaha_28" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Terminal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Terminal>
                    <div className="terminal-prompt">cat contact_info.txt</div>
                    <div className="terminal-output mb-4">
                      Email: contact@amank-root.slmail.me Location: New Delhi, Delhi, India
                    </div>

                    <div className="terminal-prompt">echo &quot;I&apos;m looking forward to hearing from you!&quot;</div>
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
      <div className="rounded-full bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
      </div>
      <div>
        <h3 className="text-sm font-medium sm:text-base">{title}</h3>
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

