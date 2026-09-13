'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REACTIONS = [
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'insightful', emoji: '💡', label: 'Insightful' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate' },
  { type: 'thinking', emoji: '🤔', label: 'Thinking' },
]

interface BlogReactionsProps {
  blogSlug: string
  initialReactions?: { type: string; count: number }[]
}

export function BlogReactions({ blogSlug, initialReactions = [] }: BlogReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    initialReactions.forEach(r => {
      map[r.type] = r.count
    })
    return map
  })
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<string | null>(null)
  const [particles, setParticles] = useState<{ id: string; emoji: string; x: number; y: number }[]>([])
  const particleId = useRef(0)

  // Hydrate user reactions from localStorage when the post changes.
  // Skipped in SSR; functional updates keep this effect's state-sync clean.
  useEffect(() => {
    // from localStorage; safe one-shot read per slug, state is idempotent.
    const stored = localStorage.getItem(`reactions-${blogSlug}`)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setUserReactions(new Set(JSON.parse(stored)))
    else setUserReactions(new Set())
  }, [blogSlug])

  const react = async (type: string, e: React.MouseEvent) => {
    if (loading) return
    setLoading(type)

    const hasReacted = userReactions.has(type)
    const emoji = REACTIONS.find(r => r.type === type)?.emoji || '❤️'

    // Add particle effect
    const id = 'p' + particleId.current
    particleId.current += 1
    if (!hasReacted) {
      setParticles(prev => [...prev, { id, emoji, x: e.clientX, y: e.clientY }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1000)
    }

    // Optimistic update
    setReactions(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + (hasReacted ? -1 : 1),
    }))
    const newUserReactions = new Set(userReactions)
    if (hasReacted) newUserReactions.delete(type)
    else newUserReactions.add(type)
    setUserReactions(newUserReactions)
    localStorage.setItem(`reactions-${blogSlug}`, JSON.stringify([...newUserReactions]))

    try {
      await fetch('/api/blog/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogSlug, type, action: hasReacted ? 'remove' : 'add' }),
      })
    } catch {
      // Rollback on error
      setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) - (hasReacted ? -1 : 1) }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative">
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="fixed pointer-events-none z-50 text-2xl"
            initial={{ opacity: 1, scale: 0.5, y: 0, x: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -80 }}
            exit={{ opacity: 0 }}
            style={{ left: p.x, top: p.y }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="glass rounded-2xl p-6 border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4 text-center">React to this post</h3>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {REACTIONS.map(({ type, emoji, label }) => {
            const count = reactions[type] || 0
            const hasReacted = userReactions.has(type)
            return (
              <motion.button
                key={type}
                onClick={e => react(type, e)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                disabled={loading !== null}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 min-w-[64px] ${
                  hasReacted
                    ? 'bg-primary/15 border border-primary/30 shadow-xs shadow-primary/10'
                    : 'bg-muted/50 border border-border/30 hover:bg-muted hover:border-border'
                }`}
                title={label}
              >
                <motion.span
                  className="text-2xl"
                  animate={hasReacted ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {emoji}
                </motion.span>
                <span className={`text-xs font-medium ${hasReacted ? 'text-primary' : 'text-muted-foreground'}`}>
                  {count > 0 ? count : label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
