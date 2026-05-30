"use client"

export function HeroDashboardMock() {
  return (
    <div className="landing-dashboard-mock">
      <div className="landing-dashboard-mock-inner">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2 rounded-full bg-chart-2" />
          <span className="size-2 rounded-full bg-chart-4" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">
            tobi — query builder
          </span>
        </div>

        <div className="grid grid-cols-5 gap-0">
          <div className="col-span-2 border-r border-border p-3">
            <p className="mb-2 text-[9px] font-medium tracking-widest text-muted-foreground uppercase">
              Schemas
            </p>
            {["Agents", "Cities", "Incidents"].map((s, i) => (
              <div
                key={s}
                className={`mb-1 rounded-md px-2 py-1.5 text-[10px] ${
                  i === 0
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          <div className="col-span-3 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-4xl bg-primary/15 px-2 py-0.5 text-[9px] font-medium text-primary">
                AND
              </span>
              <span className="text-[9px] text-muted-foreground">
                2 conditions
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="rounded-md border border-border bg-background/80 px-2 py-1.5 font-mono text-[9px]">
                <span className="text-chart-4">clearanceLevel</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-primary">LEVEL_5</span>
              </div>
              <div className="rounded-md border border-border bg-background/80 px-2 py-1.5 font-mono text-[9px]">
                <span className="text-chart-4">missionsCompleted</span>
                <span className="text-muted-foreground"> &gt; </span>
                <span className="text-primary">10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-foreground p-3 font-mono text-[8px] leading-relaxed text-background">
          <span className="text-chart-2">SELECT</span> *{" "}
          <span className="text-chart-2">FROM</span> agents{" "}
          <span className="text-chart-2">WHERE</span> clearanceLevel ={" "}
          <span className="text-primary-foreground/80">&apos;LEVEL_5&apos;</span>
        </div>
      </div>
    </div>
  )
}
