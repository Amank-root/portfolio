import { PortableTextComponents } from '@portabletext/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-md border border-border bg-muted">
            {/* Height comes from the asset's real aspect ratio rather than a
                fixed 800px box, so the reserved space matches the image and
                nothing shifts as it decodes. */}
            <Image
              src={urlFor(value).width(1200).quality(90).url()}
              alt={value.alt || 'Image'}
              width={value.asset?.metadata?.dimensions?.width || 1200}
              height={value.asset?.metadata?.dimensions?.height || 800}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full object-contain"
            />
          </div>
          {value.alt && (
            <figcaption className="mt-3 text-center text-sm italic text-foreground-subtle">{value.alt}</figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => {
      const { code, language = 'javascript', filename } = value
      return (
        <div className="my-7 overflow-hidden rounded-md border border-border bg-card">
          {filename && (
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
              <span className="font-mono text-xs text-foreground-subtle">{filename}</span>
              <span className="font-mono text-xs text-primary/70">{language}</span>
            </div>
          )}
          <SyntaxHighlighter
            language={language}
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
            {code}
          </SyntaxHighlighter>
        </div>
      )
    },
  },
  /* Typography comes from `.prose-blog` (globals.css). Only the elements that
     need an anchor target or a wrapper are mapped here — the old version
     restyled every block and mark, duplicating the stylesheet. */
  block: {
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}
