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

      <div className="border-y border-border py-10 text-center">
        <h3 className="eyebrow">Did this land?</h3>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {REACTIONS.map(({ type, emoji, label }) => {
            const count = reactions[type] || 0
            const hasReacted = userReactions.has(type)
            return (
              <motion.button
                key={type}
                onClick={e => react(type, e)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                disabled={loading !== null}
                className={`flex min-w-[4.5rem] flex-col items-center gap-1.5 rounded-lg border px-4 py-3 transition-colors duration-200 ${
                  hasReacted
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border hover:border-border-strong hover:bg-muted'
                }`}
                title={label}
                aria-pressed={hasReacted}
              >
                <motion.span
                  className="text-xl"
                  animate={hasReacted ? { rotate: [0, -8, 8, 0] } : {}}
                  transition={{ duration: 0.35 }}
                >
                  {emoji}
                </motion.span>
                <span className={`font-mono text-xs ${hasReacted ? 'text-primary' : 'text-foreground-subtle'}`}>
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
