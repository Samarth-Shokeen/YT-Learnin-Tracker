import React from "react"

type LongestStreakProps = {
  watchedDates: string[]
}

function getLongestStreak(watchedDates: string[]): number {
  const dateSet = new Set(
    watchedDates.map((iso) =>
      new Date(iso).toLocaleDateString("en-CA")
    )
  )

  const sorted = Array.from(dateSet)
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime())

  let maxStreak = 0
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      current++
    } else {
      maxStreak = Math.max(maxStreak, current)
      current = 1
    }
  }

  return Math.max(maxStreak, current)
}

export default function LongestStreak({ watchedDates }: LongestStreakProps) {
  if (watchedDates.length === 0) {
    return <div className="chart-placeholder">Longest Streak: <span className="dim">—</span></div>
  }

  const streak = getLongestStreak(watchedDates)

  return (
    <div className="chart-placeholder">
      🔥Longest Streak: <strong>{streak} {streak === 1 ? "day" : "days"}</strong>
    </div>
  )
}
