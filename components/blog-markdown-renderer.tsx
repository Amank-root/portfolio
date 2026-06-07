'use client'

import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
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
          theme: 'dark',
          themeVariables: {
            primaryColor: '#00c8ff',
            primaryTextColor: '#f0f6fc',
            primaryBorderColor: '#1e3a5f',
            lineColor: '#00c8ff',
            secondaryColor: '#161b22',
            tertiaryColor: '#0d1117',
            background: '#0d1117',
            mainBkg: '#161b22',
            nodeBorder: '#00c8ff',
            clusterBkg: '#161b22',
            titleColor: '#f0f6fc',
            edgeLabelBackground: '#161b22',
          },
          flowchart: { useMaxWidth: true, htmlLabels: true },
        })
        const { svg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          children
        )
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (e) {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-red-400 text-sm">Mermaid error: ${e}</pre>`
        }
      }
    }

    loadMermaid()
  }, [children, isMermaid])

  if (isMermaid) {
    return (
      <div className="mermaid-container">
        <div className="text-xs text-muted-foreground mb-3 font-mono">// Diagram</div>
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
    <div className="relative group my-6 rounded-xl overflow-hidden border border-border/50">
      <div className="flex items-center justify-between bg-card px-4 py-2 border-b border-border/30">
        <span className="text-xs font-mono text-muted-foreground">{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, background: '#0d1117', borderRadius: 0, fontSize: '0.85rem' }}
        codeTagProps={{ style: { fontFamily: 'var(--font-fira-code), JetBrains Mono, monospace' } }}
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
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isBlock = !props.style // rough heuristic for inline vs block
            if (match && children) {
              return (
                <CodeBlock language={match[1]}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              )
            }
            return (
              <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-primary" {...props}>
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-card px-4 py-2.5 text-left text-sm font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2.5 text-sm text-foreground/85">{children}</td>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-lg border border-border my-6 w-full max-w-full" loading="lazy" />
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6 bg-primary/3 py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 mt-10 gradient-text">{children}</h1>
          ),
          h2: ({ children, id }) => (
            <h2 id={id} className="text-2xl font-semibold mb-4 mt-8 text-foreground border-b border-border/30 pb-2">{children}</h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="text-xl font-semibold mb-3 mt-6 text-foreground">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-foreground/85">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 space-y-1.5 list-disc marker:text-primary">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-6 space-y-1.5 list-decimal marker:text-primary">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/85 leading-relaxed">{children}</li>
          ),
          hr: () => <hr className="border-border my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
