import React from "react"

type WatchTimeHeatmapProps = {
  watchedAt: string[]
}

export default function WatchTimeHeatmap({ watchedAt }: WatchTimeHeatmapProps) {
  const hourCount = Array(24).fill(0)

  for (const iso of watchedAt) {
    const hour = new Date(iso).getHours()
    hourCount[hour]++
  }

  const max = Math.max(...hourCount)

  return (
    <div className="chart-placeholder">
      Watch Time Heatmap:
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "4px", marginTop: "1rem" }}>
        {hourCount.map((count, hour) => {
          const intensity = max === 0 ? 0 : Math.round((count / max) * 255)
          const color = `rgb(255,${255 - intensity}, ${255 - intensity})`

          return (
            <div
              key={hour}
              style={{
                backgroundColor: color,
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
                color: "black",
                borderRadius: "4px",
              }}
              title={`${hour}:00 - ${hour + 1}:00 (${count})`}
            >
              {hour}
            </div>
          )
        })}
      </div>
    </div>
  )
}
