'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Terminal, ChevronRight, Maximize2, Minus, X } from 'lucide-react'

const COMMANDS = [
  { prompt: 'whoami', output: 'Aman Kushwaha (alias: amank-root)' },
  { prompt: 'cat profile.json', output: `{
  "role": "Full Stack Developer",
  "stack": ["React", "Next.js", "Node.js", "TypeScript"],
  "education": "B.Tech CS @ MDU, Rohtak",
  "status": "Available for hire 🟢"
}` },
  { prompt: 'ls skills/', output: 'frontend/  backend/  database/  devops/  ml/' },
  { prompt: 'cat interests.txt', output: 'Building scalable apps · Open source · AI/ML · System design · Clean code' },
  { prompt: 'echo $CONTACT', output: 'github.com/amank-root | linkedin.com/in/amank-root' },
]

export function TerminalSection() {
  const [lines, setLines] = useState<{ prompt?: string; output?: string; typing?: boolean }[]>([])
  const [currentCmd, setCurrentCmd] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'output' | 'pause'>('typing')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentCmd >= COMMANDS.length) return

    const cmd = COMMANDS[currentCmd]

    if (phase === 'typing') {
      if (charIdx < cmd.prompt.length) {
        const t = setTimeout(() => {
          setLines(prev => {
            const next = [...prev]
            if (next.length === 0 || !next[next.length - 1].typing) {
              next.push({ prompt: cmd.prompt.slice(0, charIdx + 1), typing: true })
            } else {
              next[next.length - 1] = { prompt: cmd.prompt.slice(0, charIdx + 1), typing: true }
            }
            return next
          })
          setCharIdx(c => c + 1)
        }, 60)
        return () => clearTimeout(t)
      } else {
        setPhase('output')
      }
    } else if (phase === 'output') {
      const t = setTimeout(() => {
        setLines(prev => {
          const next = [...prev]
          next[next.length - 1] = { prompt: cmd.prompt, typing: false, output: cmd.output }
          return next
        })
        setPhase('pause')
      }, 200)
      return () => clearTimeout(t)
    } else if (phase === 'pause') {
      const t = setTimeout(() => {
        setCurrentCmd(c => c + 1)
        setCharIdx(0)
        setPhase('typing')
      }, 800)
      return () => clearTimeout(t)
    }
  }, [currentCmd, charIdx, phase])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-background-elevated/20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <span className="section-label">
            <Terminal size={12} />
            Interactive
          </span>
          <h2 className="mt-2 text-2xl font-bold">Terminal</h2>
        </div>

        <motion.div
          className="rounded-xl overflow-hidden border border-border/50 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Terminal titlebar */}
          <div className="flex items-center justify-between bg-card border-b border-border/30 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Terminal size={12} />
              <span>bash — amank-root@portfolio</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Minus size={12} className="cursor-pointer hover:text-foreground" />
              <Maximize2 size={12} className="cursor-pointer hover:text-foreground" />
              <X size={12} className="cursor-pointer hover:text-red-400" />
            </div>
          </div>

          {/* Terminal body */}
          <div
            ref={containerRef}
            className="bg-[#0d1117] p-5 font-mono text-sm min-h-[300px] max-h-[400px] overflow-y-auto"
          >
            {/* Intro line */}
            <div className="text-green-400/60 text-xs mb-4">
              Welcome to Aman&apos;s Portfolio Terminal v2.0.0 — Type &apos;help&apos; for commands
            </div>

            {lines.map((line, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-semibold">amank</span>
                  <span className="text-muted-foreground/60">@</span>
                  <span className="text-primary/80">portfolio</span>
                  <span className="text-muted-foreground/60 mr-1">~$</span>
                  <span className="text-foreground">{line.prompt}</span>
                  {line.typing && currentCmd < COMMANDS.length && (
                    <span className="animate-blink text-primary">█</span>
                  )}
                </div>
                {line.output && (
                  <div className="mt-1 ml-0 text-muted-foreground/80 whitespace-pre-wrap leading-relaxed pl-2 border-l border-border/30">
                    {line.output}
                  </div>
                )}
              </div>
            ))}

            {/* Active prompt */}
            {currentCmd >= COMMANDS.length && (
              <div className="flex items-center gap-2">
                <span className="text-accent font-semibold">amank</span>
                <span className="text-muted-foreground/60">@</span>
                <span className="text-primary/80">portfolio</span>
                <span className="text-muted-foreground/60 mr-1">~$</span>
                <span className="animate-blink text-primary">█</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
