"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SidebarLayout from "../../components/SidebarLayout"

function formatDate(str) {
  if (!str) return ""
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function StatusBadge({ status }) {
  const map = {
    open:        { label: "Open",        bg: "rgba(181,242,61,0.1)",  color: "#b5f23d",  border: "rgba(181,242,61,0.25)", dot: "#b5f23d" },
    matched:     { label: "Matched",     bg: "rgba(74,158,245,0.1)",  color: "#4a9ef5",  border: "rgba(74,158,245,0.25)", dot: "#4a9ef5" },
    in_progress: { label: "In Progress", bg: "rgba(240,168,48,0.1)",  color: "#f0a830",  border: "rgba(240,168,48,0.25)", dot: "#f0a830" },
    completed:   { label: "Completed",   bg: "rgba(61,186,122,0.1)",  color: "#3dba7a",  border: "rgba(61,186,122,0.25)", dot: "#3dba7a" },
  }
  const s = map[status] || map.open
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  )
}

const TOPIC_ICONS = {
  react: "⚛️", python: "🐍", javascript: "💛", java: "☕", system: "🏗️",
  ml: "🤖", ai: "🤖", data: "📊", cloud: "☁️", devops: "⚙️",
  css: "🎨", design: "🎨", node: "🟢", go: "🐹", rust: "🦀",
  default: "🎤"
}



export default function MockInterviewsPage() {
  const router = useRouter()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [joiningID, setJoiningID] = useState(null)
  const [currentUserID, setCurrentUserID] = useState(null)

  const [form, setForm] = useState({
    topic: "", description: "", question_count: 5, scheduled_at: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setCurrentUserID(payload.user_id)
    } catch {}
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://localhost:8080/mock-interviews", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setInterviews(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!form.topic.trim()) return
    setSubmitting(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://localhost:8080/mock-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          question_count: parseInt(form.question_count),
          scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : new Date().toISOString(),
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ topic: "", description: "", question_count: 5, scheduled_at: "" })
        fetchInterviews()
      }
    } catch {}
    setSubmitting(false)
  }

  const handleJoin = async (id) => {
    setJoiningID(id)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/mock-interviews/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) router.push(`/mock-interviews/${id}`)
      else alert(data.error || "Failed to join")
    } catch {}
    setJoiningID(null)
  }

  const handleEnter = (id) => router.push(`/mock-interviews/${id}`)

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:8080/mock-interviews/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    })
    fetchInterviews()
  }

  const myInterviews = interviews.filter(i => i.requester_id === currentUserID || i.responder_id === currentUserID)
  const openInterviews = interviews.filter(i => i.status === "open" && i.requester_id !== currentUserID)

  return (
    <SidebarLayout>
      <style>{`
        .interview-card:hover { border-color: var(--border-strong) !important; transform: translateY(-2px); box-shadow: var(--shadow-lg) !important; }
        .score-btn { transition: all 0.15s ease; }
        .score-btn:hover { transform: scale(1.1); }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Hero Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)", animation: "pulse-neon 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                  Mock Interviews
                </span>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3vw, 38px)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 8 }}>
                Practice Interviews
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 480 }}>
                Sharpen your skills with AI-powered peer mock interviews. Request a session or join an open one.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-neon"
              style={{ padding: "13px 24px", borderRadius: 12, fontSize: 14, display: "flex", alignItems: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap" }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Request
            </button>
          </div>

          {/* Stats bar */}
          {!loading && (
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              {[
                { label: "My Sessions", value: myInterviews.length, icon: "👤", color: "var(--neon)" },
                { label: "Open Requests", value: openInterviews.length, icon: "🔓", color: "#4a9ef5" },
                { label: "Completed", value: interviews.filter(i => i.status === "completed" && (i.requester_id === currentUserID || i.responder_id === currentUserID)).length, icon: "✅", color: "#3dba7a" },
              ].map((s, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", borderRadius: 12,
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 540, boxShadow: "var(--shadow-lg)", animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>New Interview Request</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Set up your mock interview session</p>
                </div>
                <button onClick={() => setShowForm(false)} style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-muted)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Topic *</label>
                  <input className="input-field" placeholder="e.g. React Hooks, System Design, Python..." value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Description</label>
                  <textarea className="input-field" placeholder="What specific areas should the interview focus on?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Questions Each</label>
                    <select className="input-field" value={form.question_count} onChange={e => setForm(f => ({ ...f, question_count: e.target.value }))}>
                      {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Schedule</label>
                    <input className="input-field" type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
                  </div>
                </div>

                {/* Preview */}
                {form.topic && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{getTopicIcon(form.topic)}</span>
                    <div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--neon-dim)" }}>{form.topic}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{form.question_count} questions each side</div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14 }}>
                    Cancel
                  </button>
                  <button onClick={handleCreate} disabled={!form.topic.trim() || submitting} className="btn-neon" style={{ flex: 2, padding: "13px", borderRadius: 12, fontSize: 14 }}>
                    {submitting ? "Creating..." : "Create Request →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)", animation: "spin-slow 1s linear infinite" }} />
          </div>
        ) : (
          <>
            {/* My Interviews */}
            {myInterviews.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div className="section-dot" />
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>My Interviews</h2>
                  <span style={{ padding: "2px 8px", borderRadius: 99, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", fontSize: 11, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                    {myInterviews.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myInterviews.map(iv => (
                    <InterviewCard key={iv.id} interview={iv} currentUserID={currentUserID} onJoin={handleJoin} onEnter={handleEnter} onDelete={handleDelete} joiningID={joiningID} />
                  ))}
                </div>
              </div>
            )}

            {/* Open Requests */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div className="section-dot" />
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>Open Requests</h2>
                <span style={{ padding: "2px 8px", borderRadius: 99, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", fontSize: 11, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                  {openInterviews.length}
                </span>
              </div>

              {openInterviews.length === 0 ? (
                <div style={{ background: "var(--bg-card)", border: "2px dashed var(--border)", borderRadius: 24, padding: "56px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🎤</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>No open requests yet</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 360, lineHeight: 1.6 }}>Be the first! Create a mock interview request and get matched with a peer to practice with.</p>
                  <button onClick={() => setShowForm(true)} className="btn-neon" style={{ padding: "11px 28px", borderRadius: 10, fontSize: 14 }}>
                    Create First Request
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {openInterviews.map(iv => (
                    <InterviewCard key={iv.id} interview={iv} currentUserID={currentUserID} onJoin={handleJoin} onEnter={handleEnter} onDelete={handleDelete} joiningID={joiningID} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SidebarLayout>
  )
}

function InterviewCard({ interview, currentUserID, onJoin, onEnter, onDelete, joiningID }) {
  const isRequester = interview.requester_id === currentUserID
  const isResponder = interview.responder_id === currentUserID
  const isParticipant = isRequester || isResponder
  const canJoin = interview.status === "open" && !isRequester
  const canEnter = isParticipant && (interview.status === "matched" || interview.status === "in_progress")
  const canViewResult = isParticipant && interview.status === "completed"

  return (
    <div className="interview-card" style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 18, padding: "20px 24px", boxShadow: "var(--shadow)",
      display: "flex", alignItems: "center", gap: 18, transition: "all 0.2s",
    }}>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
        background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        position: "relative", overflow: "hidden",
      }}>
        {getTopicIcon(interview.topic)}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top right, rgba(181,242,61,0.15), transparent 70%)" }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
            {interview.topic}
          </h3>
          <StatusBadge status={interview.status} />
        </div>
        {interview.description && (
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 }}>
            {interview.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            <span>👤</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {interview.requester_name}{interview.responder_name ? ` · ${interview.responder_name}` : ""}
            </span>
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            <span>❓</span> {interview.question_count} questions each
          </span>
          {interview.scheduled_at && (
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <span>🕐</span> {formatDate(interview.scheduled_at)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
        {canJoin && (
          <button onClick={() => onJoin(interview.id)} disabled={joiningID === interview.id} className="btn-neon" style={{ padding: "9px 22px", borderRadius: 10, fontSize: 13 }}>
            {joiningID === interview.id ? "Joining..." : "Join →"}
          </button>
        )}
        {canEnter && (
          <button onClick={() => onEnter(interview.id)} style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, background: "rgba(74,158,245,0.1)", border: "1px solid rgba(74,158,245,0.3)", color: "#4a9ef5", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Enter Room
          </button>
        )}
        {canViewResult && (
          <button onClick={() => onEnter(interview.id)} style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, background: "rgba(61,186,122,0.1)", border: "1px solid rgba(61,186,122,0.3)", color: "#3dba7a", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            View Results
          </button>
        )}
        {isRequester && interview.status === "open" && (
          <button onClick={() => onDelete(interview.id)} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.2)", color: "#e05252", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

function getTopicIcon(topic) {
  if (!topic) return "🎤"
  const t = topic.toLowerCase()
  const map = { react: "⚛️", python: "🐍", javascript: "💛", java: "☕", system: "🏗️", ml: "🤖", ai: "🤖", data: "📊", cloud: "☁️", devops: "⚙️", css: "🎨", design: "🎨", node: "🟢", go: "🐹", rust: "🦀" }
  for (const [key, icon] of Object.entries(map)) {
    if (t.includes(key)) return icon
  }
  return "🎤"
}