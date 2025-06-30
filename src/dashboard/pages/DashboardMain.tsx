import React, { useEffect, useState } from "react"
import {
  getStorage,
  toggleWatched,
  removeVideoFromPlan,
} from "../../popup/lib/storage"
import "./DashboardMain.css"

export default function DashboardMain() {
  const [plans, setPlans] = useState<{ [plan: string]: string[] }>({})
  const [videos, setVideos] = useState<Record<string, any>>({})

  useEffect(() => {
    getStorage().then((data) => {
      setPlans(data.learningPlans)
      setVideos(data.videos)
    })
  }, [])

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Your Learning Plans</h1>

      {Object.keys(plans).length === 0 ? (
        <p className="dashboard-empty">No learning plans added yet.</p>
      ) : (
        <div className="dashboard-plan-container">
          {Object.entries(plans).map(([plan, videoIds]) => {
            const watchedCount = videoIds.filter((id) => videos[id]?.watched).length
            const totalCount = videoIds.length
            const progress = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0

            return (
              <div key={plan} className="plan-card">
                <div className="plan-header">
                  <div>
                    <h2 className="plan-title">{plan}</h2>
                    <p className="plan-progress-text">
                      {watchedCount} of {totalCount} watched
                    </p>
                  </div>

                  <div className="plan-actions">
                    <a
                      href={`dashboard.html?plan=${encodeURIComponent(plan)}`}
                      className="plan-link"
                    >
                       View Analytics
                    </a>
                    <button
                      className="plan-delete"
                      onClick={async () => {
                        const updated = await getStorage()
                        for (const id of videoIds) delete updated.videos[id]
                        delete updated.learningPlans[plan]
                        chrome.storage.sync.set(updated, () => {
                          setPlans(updated.learningPlans)
                          setVideos(updated.videos)
                        })
                      }}
                    >
                       Delete Plan
                    </button>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="video-table-wrapper">
                  <table className="video-table">
                    <thead>
                      <tr className="video-table-header">
                        <th>Video</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoIds.map((id) => (
                        <tr key={id} className="video-row">
                          <td className="video-title-cell">
                            <div className="video-title-wrapper">
                              <a
                                href={`dashboard.html?video=${id}`}
                                className="video-title-link"
                              >
                                {videos[id]?.title || "Untitled"}
                              </a>
                              <button
                                onClick={() =>
                                  window.open(`https://www.youtube.com/watch?v=${id}`, "_blank")
                                }
                                title="Open on YouTube"
                                className="youtube-button"
                              >
                                ▶
                              </button>
                            </div>
                          </td>
                          <td className="video-status">
                            {videos[id]?.watched ? "✅ Watched" : "⏳ Unwatched"}
                          </td>
                          <td className="video-actions">
                            <div className="action-buttons">
                              <button
                                className="mark-button"
                                onClick={async () => {
                                  await toggleWatched(id)
                                  const updated = await getStorage()
                                  setVideos(updated.videos)
                                }}
                              >
                                Mark as {videos[id]?.watched ? "Unwatched" : "Watched"}
                              </button>
                              <button
                                className="remove-button"
                                onClick={async () => {
                                  await removeVideoFromPlan(id)
                                  const updated = await getStorage()
                                  setPlans(updated.learningPlans)
                                  setVideos(updated.videos)
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
