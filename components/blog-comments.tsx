'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, User, Clock } from 'lucide-react'
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
  const [comments, setComments] = useState<Comment[]>(initialComments)
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
      setName(''); setEmail(''); setContent('')
      setShowForm(false)
    } catch {
      toast.error('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          Discussion ({comments.length})
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(f => !f)}
          className="border-border/50 hover:border-primary/50 text-xs"
        >
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
            <form onSubmit={submit} className="glass rounded-xl p-5 border border-border/50 mb-8">
              <h4 className="text-sm font-semibold mb-4">Share your thoughts</h4>
              <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="h-9 text-sm bg-background border-border/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email (optional)</label>
                  <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    type="email"
                    className="h-9 text-sm bg-background border-border/50"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Comment *</label>
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your comment here..."
                  required
                  rows={4}
                  className="text-sm bg-background border-border/50 resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Comments are moderated before appearing.</p>
                <Button type="submit" size="sm" disabled={submitting} className="gap-2">
                  {submitting ? 'Submitting...' : <><Send size={12} /> Submit</>}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 border border-border/30"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-foreground">{comment.name}</span>
                    {comment.createdAt && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
