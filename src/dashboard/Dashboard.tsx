import React from "react"
import ReactDOM from "react-dom/client"
import DashboardMain from "./pages/DashboardMain"
import AnalyticsPage from "./pages/AnalyticsPage"
import VideoSummary from "./pages/VideoSummary"

const App = () => {
  const params = new URLSearchParams(window.location.search)
  const plan = params.get("plan")
  const video = params.get("video")

  if (plan) return <AnalyticsPage planName={plan} />
  if (video) return <VideoSummary videoId={video} />
  return <DashboardMain />
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
