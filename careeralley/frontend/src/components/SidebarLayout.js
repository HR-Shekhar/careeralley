"use client"

import { useTheme } from "../lib/ThemeContext"
import Sidebar from "./Sidebar"
// import Sidebar from "../Sidebar"
// import { useTheme } from "../../lib/ThemeContext"

export default function SidebarLayout({ children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {/* Top bar with theme toggle */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 32px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          backdropFilter: "blur(8px)",
        }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "1.5px solid var(--border-strong)",
              background: "var(--bg-card)",
              color: "var(--neon-dim)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: "var(--shadow)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--neon)"
              e.currentTarget.style.boxShadow = "0 0 16px var(--neon-glow)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-strong)"
              e.currentTarget.style.boxShadow = "var(--shadow)"
            }}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  )
}