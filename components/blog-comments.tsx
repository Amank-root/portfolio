'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Comment {
  _id: string
  name: string
  content: string
  createdAt: string
}

interface BlogCommentsProps {
  blogSlug: string
  initialComments?: Comment[]
}

export function BlogComments({ blogSlug, initialComments = [] }: BlogCommentsProps) {
  const [comments] = useState<Comment[]>(initialComments)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/blog/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogSlug, name, email, content }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      toast.success('Comment submitted for review!', {
        description: 'Your comment will appear after moderation.',
      })
      setName('')
      setEmail('')
      setContent('')
      setShowForm(false)
    } catch {
      toast.error('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* "Discussion (0)" on every post read as a dead widget to visitors and
            as an empty string to crawlers. With no comments there is nothing to
            show but the invitation to leave the first one. */}
        <h3 className="eyebrow">{comments.length > 0 ? `Discussion (${comments.length})` : 'Discussion'}</h3>
        <Button size="sm" variant="outline" onClick={() => setShowForm(f => !f)}>
          {showForm ? 'Cancel' : 'Leave a comment'}
        </Button>
      </div>

      {/* Comment form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={submit} className="my-8 border-y border-border py-8">
              <h4 className="font-display text-lg mb-6">Share your thoughts</h4>
              <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <div>
                  <label className="eyebrow mb-2 block">Name</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-2 block">Email (optional)</label>
                  <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    type="email"
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="eyebrow mb-2 block">Comment</label>
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your comment here..."
                  required
                  rows={4}
                  className="text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-foreground-subtle">Comments are moderated before appearing.</p>
                <Button type="submit" size="sm" disabled={submitting} className="gap-2">
                  {submitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={12} /> Submit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="py-12 text-sm text-foreground-subtle">No comments yet — be the first to share your thoughts.</p>
      ) : (
        <ul className="mt-4">
          {comments.map((comment, i) => (
            <motion.li
              key={comment._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border py-6 last:border-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-medium text-foreground">{comment.name}</span>
                {comment.createdAt && (
                  <span className="font-mono text-xs text-foreground-subtle">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-foreground-muted">{comment.content}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}
