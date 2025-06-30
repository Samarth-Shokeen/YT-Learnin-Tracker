import React, { useEffect, useState } from "react"
import { getStorage } from "../lib/storage"

export default function PlanSelector({
  selected,
  onChange
}: {
  selected: string
  onChange: (plan: string) => void
}) {
  const [plans, setPlans] = useState<string[]>([])
  const [newPlan, setNewPlan] = useState("")

  useEffect(() => {
    getStorage().then((data) => {
      setPlans(Object.keys(data.learningPlans))
    })
  }, [])

  const handleAddPlan = () => {
    const trimmed = newPlan.trim()
    if (trimmed && !plans.includes(trimmed)) {
      setPlans((prev) => [...prev, trimmed])
      onChange(trimmed)
      setNewPlan("")
    }
  }

  return (
    <div className="card" style={{ padding: "1rem", borderRadius: "8px", background: "#f9f9f9" }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>🎯 Manage Learning Plans</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Select Existing Plan
        </label>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px"
          }}
        >
          <option value="">-- Choose a plan --</option>
          {plans.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Create New Plan
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            placeholder="e.g. Frontend, AI"
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            style={{
              flexGrow: 1,
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          />
          <button
            onClick={handleAddPlan}
            disabled={!newPlan.trim()}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              cursor: newPlan.trim() ? "pointer" : "not-allowed"
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
