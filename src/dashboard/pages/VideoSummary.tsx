import React, { useEffect, useState } from "react"
import "./VideoSummary.css"

type Props = {
  videoId: string
}

export default function VideoSummary({ videoId }: Props) {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [notes, setNotes] = useState("")
  const notesKey = `notes_${videoId}`

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:8000/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId }),
        })

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)

        const data = await res.json()
        setSummary(data.summary)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const savedNotes = localStorage.getItem(notesKey)
    if (savedNotes) setNotes(savedNotes)

    fetchSummary()
  }, [videoId])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setNotes(val)
    localStorage.setItem(notesKey, val)
  }

  return (
    <div className="summary-container">
      <h1 className="summary-heading">Summary for Video</h1>
      <p className="summary-id">Video ID: {videoId}</p>

      {loading ? (
        <p className="summary-loading">Loading summary...</p>
      ) : error ? (
        <p className="summary-error">❌ {error}</p>
      ) : (
        <div className="summary-text">{summary}</div>
      )}

      <div className="notes-section">
        <h2 className="notes-heading">Your Notes</h2>
        <textarea
          className="notes-input"
          placeholder="Write your personal notes here..."
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
    </div>
  )
}
