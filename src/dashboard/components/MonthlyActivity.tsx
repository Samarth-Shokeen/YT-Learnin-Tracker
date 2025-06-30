import React from "react"

type MonthlyActivityProps = {
  watchedAt: string[]
}

export default function MonthlyActivity({ watchedAt }: MonthlyActivityProps) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay() // Sunday = 0

  const activityMap: Record<string, number> = {}

  watchedAt.forEach((iso) => {
    const date = new Date(iso)
    if (date.getFullYear() === year && date.getMonth() === month) {
      const key = date.toLocaleDateString("en-CA")
      activityMap[key] = (activityMap[key] || 0) + 1
    }
  })

  const calendarCells: JSX.Element[] = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = new Date(year, month, day).toLocaleDateString("en-CA")
    const count = activityMap[dayStr] || 0
    const intensity = Math.min(255, count * 40)
    const bgColor = count
      ? `rgb(${255 - intensity}, 255, ${255 - intensity})`
      : "#e0e0e0"

    calendarCells.push(
      <div
        key={dayStr}
        title={`${dayStr}: ${count} video${count !== 1 ? "s" : ""}`}
        style={{
          backgroundColor: bgColor,
          width: "28px",
          height: "28px",
          borderRadius: "4px",
          fontSize: "10px",
          textAlign: "center",
          lineHeight: "28px",
          cursor: "default",
        }}
      >
        {day}
      </div>
    )
  }

  return (
    <div className="chart-placeholder">
      Monthly Activity ({now.toLocaleString("default", { month: "long" })})
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginTop: "1rem",
        }}
      >
        {calendarCells}
      </div>
    </div>
  )
}
