import React, { useEffect, useState } from "react"
import { getStorage } from "../../popup/lib/storage"
import WeeklyChart from "../components/WeeklyChart"
import LongestStreak from "../components/LongestStreak"
import MonthlyActivity from "../components/MonthlyActivity"
import WatchTimeHeatmap from "../components/WatchTimeHeatmap"
import CreatorPieChart from "../components/CreatorPieChart"
import "./Analytics.css"

type AnalyticsPageProps = {
  planName: string
}

export default function AnalyticsPage({ planName }: AnalyticsPageProps) {
  const [videoIds, setVideoIds] = useState<string[]>([])
  const [videos, setVideos] = useState<Record<string, any>>({})

  useEffect(() => {
    getStorage().then((data) => {
      setVideoIds(data.learningPlans[planName] || [])
      setVideos(data.videos || {})
    })
  }, [planName])

  const planVideos: Record<string, any> = {}
  for (const id of videoIds) {
    if (videos[id]) {
      planVideos[id] = videos[id]
    }
  }

  const watchedVideos = Object.values(planVideos)
    .filter((v) => v?.watched)

  const watchedAtDates = watchedVideos
    .map((v) => v.watchedAt)
    .filter(Boolean) as string[]

  const totalCount = videoIds.length
  const watchedCount = watchedVideos.length
  const progress = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0

  const durations = watchedVideos.map((v) => v.duration ?? 0)
  const totalTimeSpent = durations.reduce((sum, d) => sum + d, 0)
  const avgDuration = durations.length > 0 ? totalTimeSpent / durations.length : 0

  const sortedByWatchTime = watchedVideos
    .filter((v) => v.watchedAt)
    .sort((a, b) => new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime())

  const firstWatched = sortedByWatchTime[0]?.watchedAt
  const lastWatched = sortedByWatchTime[sortedByWatchTime.length - 1]?.watchedAt

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—"

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.ceil(seconds % 60)
    return `${mins}m ${secs}s`
  }

  return (
    <div className="analytics-page">
      <h1 className="heading">Analytics for {planName}</h1>

      <section className="stats-grid">
        <div className="card">
          <h3>Total Videos</h3>
          <p>{totalCount}</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p>{watchedCount}</p>
        </div>
        <div className="card">
          <h3>Completion %</h3>
          <p>{Math.round(progress)}%</p>
        </div>
        <div className="card">
          <h3>First Watched</h3>
          <p>{formatDate(firstWatched)}</p>
        </div>
        <div className="card">
          <h3>Last Watched</h3>
          <p>{formatDate(lastWatched)}</p>
        </div>
        <div className="card">
          <h3>Avg Duration</h3>
          <p>{watchedCount > 0 ? formatDuration(avgDuration) : "—"}</p>
        </div>
        <div className="card">
          <h3>Total Time Spent</h3>
          <p>{formatDuration(totalTimeSpent)}</p>
        </div>
      </section>

      <section className="charts-section">
        <h2>Time-Based Insights</h2>
        <WeeklyChart videos={watchedVideos} />
        <LongestStreak watchedDates={watchedAtDates} />
        <WatchTimeHeatmap watchedAt={watchedAtDates} />
        <MonthlyActivity watchedAt={watchedAtDates} />
      </section>

      <section className="tags-section">
        <h2>Content Breakdown</h2>
        <CreatorPieChart videos={planVideos} />
      </section>
    </div>
  )
}
