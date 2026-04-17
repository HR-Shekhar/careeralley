"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { get } from "../../lib/api"
import SidebarLayout from "../../components/SidebarLayout"

export default function FieldsPage() {
  const router = useRouter()
  const [fields, setFields] = useState([])
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    const loadFields = async () => {
      const token = localStorage.getItem("token")
      const data = await get("/fields", token)
      if (data) {
        setFields(data)
      }
    }
    loadFields()
  }, [])

  const selectField = (field) => {
    router.push(`/cards?field=${encodeURIComponent(field.name)}`)
  }

  if (!fields.length) {
    return (
      <SidebarLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "3px solid var(--border)",
              borderTopColor: "var(--neon)",
              animation: "spin-slow 1s linear infinite",
              margin: "0 auto 16px",
            }}/>
            <p style={{ color: "var(--text-muted)" }}>Loading fields...</p>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
              Getting Started
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 38px)", marginBottom: 12 }}>
            Choose Your Field
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Select a field to explore career paths and get a personalized roadmap.
          </p>
        </div>

        {/* Fields grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 18,
        }}>
          {fields.map((field, i) => {
            const isHovered = hoveredId === field.id
            return (
              <button
                key={field.id}
                onClick={() => selectField(field)}
                onMouseEnter={() => setHoveredId(field.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: "var(--bg-card)",
                  border: `2px solid ${isHovered ? "var(--neon)" : "var(--border)"}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 12px 32px var(--neon-glow)" : "var(--shadow)",
                  animation: `fadeIn 0.4s ease forwards`,
                  animationDelay: `${i * 0.06}s`,
                  opacity: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isHovered && (
                  <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0,
                    width: "40%",
                    background: "linear-gradient(90deg, transparent, rgba(181,242,61,0.04))",
                    pointerEvents: "none",
                  }}/>
                )}
                <div style={{
                  width: 58, height: 58, borderRadius: 16,
                  background: isHovered ? "linear-gradient(135deg, rgba(181,242,61,0.15), rgba(181,242,61,0.05))" : "var(--bg-2)",
                  border: `1.5px solid ${isHovered ? "rgba(181,242,61,0.3)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, marginBottom: 18,
                  transition: "all 0.2s",
                }}>
                  {field.icon}
                </div>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17,
                  color: isHovered ? "var(--neon-dim)" : "var(--text-primary)",
                  marginBottom: 8, transition: "color 0.2s",
                }}>
                  {field.name}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                  {field.description}
                </p>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: isHovered ? "var(--neon-dim)" : "var(--text-muted)",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif",
                  transition: "color 0.2s",
                }}>
                  Explore careers
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </SidebarLayout>
  )
}