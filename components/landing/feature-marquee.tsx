const items = [
  "Nested AND / OR groups",
  "Schema-driven inputs",
  "SQL · MongoDB · GraphQL",
  "Drag-and-drop reorder",
  "Live validation",
  "Query history",
  "Saved presets",
  "Export / import JSON",
  "Dark & light mode",
  "Keyboard shortcuts",
]

export function FeatureMarquee() {
  const doubled = [...items, ...items]

  return (
    <section className="border-y bg-card py-4" aria-hidden>
      <div className="landing-marquee flex w-max gap-3">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 rounded-4xl border bg-background px-4 py-1.5 text-sm text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
