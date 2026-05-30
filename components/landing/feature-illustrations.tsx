export function PreviewIllustration() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Query preview
        </p>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-border p-4 sm:border-r sm:border-b-0">
          <div className="mb-3 flex gap-1">
            {["SQL", "Mongo", "GQL"].map((tab, i) => (
              <span
                key={tab}
                className={`rounded-md px-2 py-1 text-xs ${
                  i === 0
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <pre className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            {`SELECT *\nFROM agents\nWHERE clearanceLevel = 'LEVEL_5'\n  AND missionsCompleted > 10`}
          </pre>
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs text-muted-foreground">Validation</p>
          <div className="space-y-2">
            {[
              "Field selected",
              "Operator compatible",
              "Value required — ok",
              "No empty groups",
            ].map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-foreground"
              >
                <span
                  className={`size-1.5 rounded-full ${
                    i < 3 ? "bg-chart-2" : "bg-muted-foreground/40"
                  }`}
                />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Complexity · Moderate · 4 conditions
          </p>
        </div>
      </div>
    </div>
  )
}

export function ExecutionIllustration() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Results
        </p>
        <span className="text-xs text-chart-2">12 matched</span>
      </div>
      <div className="p-4">
        <div className="mb-3 grid grid-cols-4 gap-2 border-b border-border pb-2 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          <span>codename</span>
          <span>clearance</span>
          <span>status</span>
          <span>missions</span>
        </div>
        {[
          ["Ghost", "LEVEL_5", "active", "47"],
          ["Cipher", "LEVEL_3", "inactive", "23"],
          ["Viper", "LEVEL_5", "active", "61"],
          ["Shadow", "LEVEL_4", "active", "38"],
        ].map((row) => (
          <div
            key={row[0]}
            className="grid grid-cols-4 gap-2 border-b border-border py-2 font-mono text-[11px] last:border-0"
          >
            {row.map((cell) => (
              <span key={cell} className="truncate text-foreground/90">
                {cell}
              </span>
            ))}
          </div>
        ))}
        <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Page 1 of 2</span>
          <span>87 total records</span>
        </div>
      </div>
    </div>
  )
}
