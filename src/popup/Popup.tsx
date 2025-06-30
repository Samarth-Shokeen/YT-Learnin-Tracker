import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { addVideoToPlan, getStorage, toggleWatched } from './lib/storage'
import PlanSelector from './components/PlanSelector'
import './Popup.css'

const Popup = () => {
  const [videoId, setVideoId] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [isTracked, setIsTracked] = useState(false)
  const [watched, setWatched] = useState(false)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      const url = new URL(tab?.url || "")
      const id = url.searchParams.get("v") || ""
      const title = tab?.title?.replace(" - YouTube", "") || ""

      setVideoId(id)
      setVideoTitle(title)

      getStorage().then((data) => {
        const existing = data.videos[id]
        setIsTracked(!!existing)
        if (existing) setWatched(existing.watched)
      })
    })
  }, [])

  if (!videoId) return (<div className="popup-wrapper">❌ Not a YouTube video.
  <button
          className="popup-dashboard-link"
          onClick={() => {
            const url = chrome.runtime.getURL("dashboard.html")
            window.open(url)
          }}
        >
          → Go to Dashboard
        </button>
  </div>
  )

  if (isTracked) {
    return (
      <div className="popup-wrapper">
        <h2 className="popup-title">🎬 {videoTitle}</h2>
        <p className="popup-status">✅ Already added to your learning plan.</p>
        <p className="popup-watch-status">
          Status: {watched ? "✅ Watched" : "⏳ Unwatched"}
        </p>

        <button
          className="popup-toggle-button"
          onClick={async () => {
            await toggleWatched(videoId)
            const updated = await getStorage()
            setWatched(updated.videos[videoId].watched)
          }}
        >
          Mark as {watched ? "⏳ Unwatched" : "✅ Watched"}
        </button>

        <button
          className="popup-dashboard-link"
          onClick={() => {
            const url = chrome.runtime.getURL("dashboard.html")
            window.open(url)
          }}
        >
          → Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="popup-wrapper popup-space-y">
      <h2 className="popup-title">🎬 {videoTitle}</h2>
      <PlanSelector selected={selectedPlan} onChange={setSelectedPlan} />
      <button
        disabled={!selectedPlan}
        className="popup-add-button"
        onClick={async () => {
          await addVideoToPlan(videoId, videoTitle, selectedPlan)
          setIsTracked(true)
        }}
      >
        + Add to Plan
      </button>

      <button
        className="popup-dashboard-link"
        onClick={() => {
          const url = chrome.runtime.getURL("dashboard.html")
          window.open(url)
        }}
      >
        → Go to Dashboard
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />)
