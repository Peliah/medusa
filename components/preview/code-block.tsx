"use client"

import * as React from "react"

import { highlightCode, tokenClass } from "@/components/preview/highlight-code"
import type { PreviewFormat } from "@/lib/query-engine/generators"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  format: PreviewFormat
  flash?: boolean
  className?: string
}

export function CodeBlock({
  code,
  format,
  flash = false,
  className,
}: CodeBlockProps) {
  const lines = React.useMemo(() => highlightCode(code, format), [code, format])

  return (
    <pre
      key={flash ? code : undefined}
      className={cn(
        "preview-code-block h-full overflow-auto overscroll-contain rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100",
        flash && "preview-code-block--flash",
        className
      )}
    >
      <code className="block whitespace-pre">
        {lines.map((line, lineIndex) => (
          <React.Fragment key={line.key}>
            {line.tokens.map((token, index) => (
              <span key={index} className={tokenClass(token.kind)}>
                {token.text}
              </span>
            ))}
            {lineIndex < lines.length - 1 ? "\n" : null}
          </React.Fragment>
        ))}
      </code>
    </pre>
  )
}
