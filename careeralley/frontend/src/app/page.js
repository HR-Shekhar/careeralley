"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "../lib/ThemeContext"

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Roadmaps",
    desc: "Our AI generates personalized learning paths based on your experience and goals — not generic guides.",
  },
  {
    icon: "🎯",
    title: "Goal-Oriented Learning",
    desc: "Every topic and subtopic is curated to move you closer to your career destination efficiently.",
  },
  {
    icon: "📊",
    title: "Progress Analytics",
    desc: "Track daily and weekly study time. See your progress at a glance on an elegant dashboard.",
  },
  {
    icon: "⏱",
    title: "Study Timer",
    desc: "Start and stop study sessions for any subtopic. Your time is measured and celebrated.",
  },
  {
    icon: "🗺",
    title: "Structured Roadmaps",
    desc: "From beginner to advanced — beautifully organized topics and subtopics you can check off.",
  },
  {
    icon: "🔐",
    title: "Secure & Personal",
    desc: "Login with email or Google. Your roadmaps, progress, and data are always yours.",
  },
]

const careers = ["Web Development", "AI / Machine Learning", "Cybersecurity", "Data Science", "Mobile Dev", "Cloud Engineering"]

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [visible, setVisible] = useState(false)
  const [activeCareer, setActiveCareer] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const interval = setInterval(() => setActiveCareer(p => (p + 1) % careers.length), 2000)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: theme === "dark" ? "rgba(13,16,8,0.85)" : "rgba(245,247,240,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008"/>
              <path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "var(--neon)" }}>
            CareerAlley
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleTheme} style={{
            width: 38, height: 38, borderRadius: "50%",
            border: "1.5px solid var(--border-strong)",
            background: "var(--bg-card)", color: "var(--neon-dim)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            {theme === "dark" ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <Link href="/login" style={{
            padding: "8px 20px", borderRadius: 8,
            border: "1.5px solid var(--border-strong)",
            color: "var(--text-primary)",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14,
            transition: "all 0.2s",
          }}>Log in</Link>
          <Link href="/signup" style={{
            padding: "8px 20px", borderRadius: 8,
            background: "var(--neon)", color: "#0d1008",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
            transition: "all 0.2s",
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 48px 80px",
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "20%", left: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,242,61,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }}/>
        <div style={{
          position: "absolute", bottom: "15%", right: "8%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,242,61,0.08) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }}/>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99,
            background: "var(--neon-subtle)",
            border: "1px solid rgba(181,242,61,0.25)",
            marginBottom: 32,
            fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600,
            color: "var(--neon-dim)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon)", display: "inline-block", boxShadow: "0 0 8px var(--neon-glow)" }}/>
            AI-Powered Career Learning Platform
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: 24,
            maxWidth: 800,
          }}>
            Your Path to{" "}
            <span style={{
              background: "linear-gradient(135deg, #b5f23d 0%, #e8f500 50%, #8fbe2a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {careers[activeCareer]}
            </span>
            {" "}Starts Here
          </h1>

          <p style={{
            fontSize: 20,
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            Answer a few questions. Get a personalized AI-generated roadmap. Track every step of your journey.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{
              padding: "14px 36px", borderRadius: 12,
              background: "var(--neon)", color: "#0d1008",
              textDecoration: "none",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16,
              boxShadow: "0 8px 32px var(--neon-glow)",
              transition: "all 0.2s",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Start Your Journey
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/login" style={{
              padding: "14px 36px", borderRadius: 12,
              border: "1.5px solid var(--border-strong)",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 16,
              transition: "all 0.2s",
            }}>
              I have an account
            </Link>
          </div>
        </div>

        {/* Floating cards preview */}
        <div style={{
          marginTop: 80,
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          maxWidth: 700,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          {[
            { pct: 68, name: "Web Dev Roadmap", topics: 12 },
            { pct: 34, name: "AI/ML Fundamentals", topics: 18 },
            { pct: 91, name: "Cybersecurity Pro", topics: 9 },
          ].map((item, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16, padding: "18px",
              boxShadow: "var(--shadow)",
              textAlign: "left",
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}>
              <div style={{ fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "var(--neon)", marginBottom: 10 }}>
                {item.pct}%
              </div>
              <div className="progress-bar" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{ width: `${item.pct}%` }}/>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.topics} topics</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 16 }}>
            Everything you need to{" "}
            <span style={{
              background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              grow fast
            </span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
            A complete learning platform built around your career goals.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{
              padding: "28px",
              animationDelay: `${i * 0.05}s`,
              borderRadius: 20,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "var(--neon-subtle)",
                border: "1px solid rgba(181,242,61,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 18,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 15 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 48px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          maxWidth: 700, margin: "0 auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 28, padding: "60px 48px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(181,242,61,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}/>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, marginBottom: 16, position: "relative" }}>
            Ready to navigate your career?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, marginBottom: 36, position: "relative" }}>
            Join thousands of learners who found their path through CareerAlley.
          </p>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 36px", borderRadius: 12,
            background: "var(--neon)", color: "#0d1008",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16,
            boxShadow: "0 8px 32px var(--neon-glow)",
            position: "relative",
          }}>
            Get Started — It's Free
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "24px 48px",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "var(--neon)", fontSize: 15 }}>
          CareerAlley
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
          © 2026 CareerAlley. Navigate Your Learning.
        </span>
      </footer>
    </div>
  )
}