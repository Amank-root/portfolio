'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { isBadge } from '@/lib/utils'

interface BlogMarkdownRendererProps {
  content: string
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const isMermaid = language === 'mermaid'
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMermaid || !containerRef.current) return
    let mermaid: typeof import('mermaid').default | null = null

    const loadMermaid = async () => {
      try {
        const m = await import('mermaid')
        mermaid = m.default
        mermaid.initialize({
          startOnLoad: false,
          // 'neutral' keeps diagrams legible against the paper background
          // without importing the site's accent hue into every node.
          theme: 'neutral',
          themeVariables: {
            primaryColor: '#f2efe9',
            primaryTextColor: '#26221c',
            primaryBorderColor: '#b9b0a3',
            lineColor: '#8a8175',
            secondaryColor: '#ece7de',
            tertiaryColor: '#f7f4ee',
            background: 'transparent',
            mainBkg: '#f2efe9',
            nodeBorder: '#b9b0a3',
            clusterBkg: '#f7f4ee',
            titleColor: '#26221c',
            edgeLabelBackground: '#f7f4ee',
            fontFamily: 'inherit',
          },
          flowchart: { useMaxWidth: true, htmlLabels: true },
        })
        const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, children)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p class="text-sm text-destructive">Could not render this diagram.</p>`
        }
      }
    }

    loadMermaid()
  }, [children, isMermaid])

  if (isMermaid) {
    return (
      <div className="mermaid-container">
        <div ref={containerRef} className="flex justify-center overflow-x-auto" />
      </div>
    )
  }

  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-7 overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="font-mono text-xs text-foreground-subtle">{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-foreground-subtle transition-colors hover:text-foreground"
        >
          {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneLight}
        customStyle={{
          margin: 0,
          background: 'hsl(var(--background-card))',
          padding: '1.1rem 1rem',
          fontSize: '0.85rem',
          lineHeight: 1.65,
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-code), ui-monospace, monospace' } }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

export function BlogMarkdownRenderer({ content }: BlogMarkdownRendererProps) {
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          /* Everything below inherits from `.prose-blog` in globals.css —
             these overrides only cover the cases the utility can't express.
             The previous version re-styled every element here, which meant a
             palette change had to be made in two places. */
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            if (match && children) {
              return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
            }
            return <code {...props}>{children}</code>
          },
          table: ({ children }) => (
            <div className="my-7 overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
          /* Markdown bodies that open with `# Title` were rendering a second
             <h1> directly beneath the page's own <h1>, so every post and
             project had two. Only the first level is demoted — ## stays ##. */
          h1: ({ children }) => <h2>{children}</h2>,
          img: ({ src, alt }) => (
            /* Markdown bodies embed a mix of sources: Sanity CDN for project
               screenshots, and shields.io / badgen.net for status badges.
               A plain <img> left those badges unoptimised and able to shift
               layout as they loaded, so they now go through next/image with a
               declared aspect box. `unoptimized` is set for badge hosts because
               running a 200x20 SVG-ish badge through the AVIF/WebP pipeline
               costs more than it saves.

               The `isBadge` helper and the extra remotePatterns live in
               next.config.ts / lib/utils respectively. */
            <Image
              src={String(src)}
              alt={alt || ''}
              // Badges are intrinsically small and vary in height, so give them
              // their own generous box and let `h-auto` + `w-auto` preserve the
              // real aspect ratio. Pinning one height for all of them made a
              // short badge and a tall badge render at visibly different sizes.
              width={isBadge(String(src)) ? 200 : 1200}
              height={isBadge(String(src)) ? 24 : 675}
              sizes={isBadge(String(src)) ? '200px' : '(max-width: 768px) 100vw, 672px'}
              unoptimized={isBadge(String(src))}
              loading="lazy"
              // `data-badge` opts out of `.prose-blog img { w-full }`, which
              // would otherwise stretch a small badge to the full column.
              data-badge={isBadge(String(src)) ? '' : undefined}
              className={isBadge(String(src)) ? 'align-middle' : 'mx-auto h-auto w-full rounded-md'}
            />
          ),
          hr: () => <hr />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
