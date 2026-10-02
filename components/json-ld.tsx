/**
 * Renders a schema.org JSON-LD graph.
 *
 * Uses a plain <script> rather than next/script: JSON-LD must be in the initial
 * HTML for crawlers that don't execute JS, and next/script's afterInteractive
 * default would defer it.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Serialized server-side from trusted, code-owned data — never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
