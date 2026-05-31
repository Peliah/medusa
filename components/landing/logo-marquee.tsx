const rowOne = [
  "Agents",
  "Cities",
  "Incidents",
  "SQL",
  "MongoDB",
  "GraphQL",
  "Nested AND/OR",
  "Schema-driven",
  "Drag & drop",
  "Query history",
]

const rowTwo = [
  "Validation engine",
  "Live preview",
  "Export JSON",
  "Saved presets",
  "Date filters",
  "Enum selects",
  "Tag inputs",
  "Regex support",
  "Keyboard shortcuts",
  "Mock execution",
]

function MarqueeRow({
  items,
  direction,
}: {
  items: string[]
  direction: "left" | "right"
}) {
  const doubled = [...items, ...items]

  return (
    <div className="landing-marquee-mask py-3">
      <div
        className={
          direction === "left"
            ? "landing-marquee-left gap-10 px-5"
            : "landing-marquee-right gap-10 px-5"
        }
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 text-sm font-medium tracking-wide text-muted-foreground/70 uppercase"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LogoMarquee() {
  return (
    <section className="border-y border-border py-2" aria-label="Capabilities">
      <MarqueeRow items={rowOne} direction="left" />
      <MarqueeRow items={rowTwo} direction="right" />
    </section>
  )
}
