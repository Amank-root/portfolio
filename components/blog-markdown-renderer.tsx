'use client'

import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

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
          img: ({ src, alt }) => (
            // renderer: images come from Sanity CDN with optimized srcset already;
            // swapping to next/image here would break the renderer's generic contract.
            // eslint-disable-next-line @next/next/no-img-element -- PortableText
            <img src={src} alt={alt} loading="lazy" />
          ),
          hr: () => <hr />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
