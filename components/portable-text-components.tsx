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
          <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={urlFor(value).width(1200).quality(90).url()}
              alt={value.alt || 'Image'}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '500px' }}
            />
          </div>
          {value.alt && <p className="mt-2 text-center text-sm text-muted-foreground italic">{value.alt}</p>}
        </div>
      )
    },
    code: ({ value }) => {
      const { code, language = 'javascript', filename } = value

      return (
        <div className="my-6 overflow-hidden rounded-lg border bg-card">
          {filename && (
            <div className="border-b bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">{filename}</div>
          )}
          <div className="relative">
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: 'transparent',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'var(--font-fira-code), Consolas, Monaco, "Courier New", monospace',
                },
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => <h1 className="mb-4 text-3xl font-bold text-foreground">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-3 text-2xl font-semibold text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 text-xl font-semibold text-foreground">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 text-lg font-semibold text-foreground">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic text-foreground">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 list-disc pl-6 text-foreground">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1 text-foreground">{children}</li>,
  },
}
