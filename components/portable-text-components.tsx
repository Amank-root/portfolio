import { PortableTextComponents } from '@portabletext/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <div className="my-6">
          <div className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-muted">
            <Image
              src={urlFor(value).width(1200).quality(90).url()}
              alt={value.alt || 'Image'}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '500px' }}
            />
          </div>
          {value.alt && (
            <p className="mt-2 text-center text-sm text-muted-foreground italic">{value.alt}</p>
          )}
        </div>
      )
    },
    code: ({ value }) => {
      const { code, language = 'javascript', filename } = value
      return (
        <div className="my-6 overflow-hidden rounded-xl border border-border/50 bg-card">
          {filename && (
            <div className="border-b border-border/30 bg-muted/50 px-4 py-2 text-xs font-mono text-muted-foreground flex items-center justify-between">
              <span>{filename}</span>
              <span className="text-primary/60">{language}</span>
            </div>
          )}
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{ margin: 0, background: '#0d1117', borderRadius: 0, fontSize: '0.85rem' }}
            codeTagProps={{ style: { fontFamily: 'var(--font-fira-code), JetBrains Mono, monospace' } }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => <h1 className="mb-6 mt-10 text-3xl font-bold gradient-text">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-4 mt-8 text-2xl font-semibold text-foreground border-b border-border/30 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-6 text-xl font-semibold text-foreground">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 mt-4 text-lg font-semibold text-foreground">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary bg-primary/5 pl-4 py-2 italic text-muted-foreground rounded-r-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 text-foreground/85 leading-7">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-primary">{children}</code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 list-disc pl-6 text-foreground/85 space-y-1.5 marker:text-primary">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 list-decimal pl-6 text-foreground/85 space-y-1.5 marker:text-primary">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}
