import React from "react"

type CreatorPieChartProps = {
  videos: Record<string, { watched: boolean; creator?: string }>
}

export default function CreatorPieChart({ videos }: CreatorPieChartProps) {
  const creatorCount: Record<string, number> = {}

  for (const video of Object.values(videos)) {
    if (video.watched && video.creator) {
      creatorCount[video.creator] = (creatorCount[video.creator] || 0) + 1
    }
  }

  const creators = Object.keys(creatorCount)
  const total = creators.reduce((acc, cur) => acc + creatorCount[cur], 0)

  if (total === 0) {
    return (
      <div className="chart-placeholder">
         Most Watched Creators
        <p style={{ color: "#888", fontSize: "14px", marginTop: "1rem" }}>
          No watched videos with creator info.
        </p>
      </div>
    )
  }

  const colors = [
    "#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899",
    "#14b8a6", "#6366f1", "#eab308", "#e879f9", "#06b6d4"
  ]

  let startAngle = 0
  const radius = 80
  const cx = 100
  const cy = 100

  const segments = creators.map((creator, i) => {
    const value = creatorCount[creator]
    const angle = (value / total) * 360
    const color = colors[i % colors.length]

    const startX = cx + radius * Math.cos((Math.PI / 180) * startAngle)
    const startY = cy + radius * Math.sin((Math.PI / 180) * startAngle)
    const endAngle = startAngle + angle
    const endX = cx + radius * Math.cos((Math.PI / 180) * endAngle)
    const endY = cy + radius * Math.sin((Math.PI / 180) * endAngle)
    const largeArcFlag = angle > 180 ? 1 : 0

    const path = `
      M ${cx} ${cy}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `

    startAngle += angle

    return { path, color, creator, value }
  })

  return (
    <div className="chart-placeholder">
      <h3 style={{ marginBottom: "1rem" }}>Most Watched Creators</h3>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <svg width={220} height={220} viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.path}
              fill={seg.color}
              stroke="#fff"
              strokeWidth={1}
              style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
            />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {segments.map((seg) => (
            <div key={seg.creator} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{
                width: "14px",
                height: "14px",
                backgroundColor: seg.color,
                borderRadius: "3px",
                display: "inline-block"
              }} />
              <span><strong>{seg.creator}</strong> — {seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
