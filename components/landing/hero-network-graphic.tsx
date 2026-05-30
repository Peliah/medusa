"use client"

const nodes = [
  { cx: 120, cy: 80, r: 3 },
  { cx: 280, cy: 60, r: 2.5 },
  { cx: 420, cy: 100, r: 3.5 },
  { cx: 540, cy: 70, r: 2 },
  { cx: 680, cy: 90, r: 3 },
  { cx: 200, cy: 180, r: 2.5 },
  { cx: 360, cy: 200, r: 4 },
  { cx: 500, cy: 170, r: 2.5 },
  { cx: 640, cy: 190, r: 3 },
  { cx: 100, cy: 260, r: 2 },
  { cx: 300, cy: 280, r: 3 },
  { cx: 480, cy: 250, r: 2.5 },
  { cx: 620, cy: 270, r: 3 },
  { cx: 750, cy: 220, r: 2 },
]

const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 10],
  [6, 11],
  [8, 12],
  [10, 11],
  [11, 12],
  [12, 13],
  [2, 7],
  [6, 3],
]

export function HeroNetworkGraphic() {
  return (
    <svg
      viewBox="0 0 820 320"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {edges.map(([a, b], i) => {
        const from = nodes[a]
        const to = nodes[b]
        return (
          <line
            key={`edge-${i}`}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            className="landing-network-line"
          />
        )
      })}
      {nodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          className="landing-network-node"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  )
}
