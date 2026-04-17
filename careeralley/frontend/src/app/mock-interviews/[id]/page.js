"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import SidebarLayout from "../../../components/SidebarLayout"

export default function InterviewRoomPage() {
  const router = useRouter()
  const params = useParams()
  const interviewID = params.id

  const [interview, setInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [results, setResults] = useState([])
  const [jitsiURL, setJitsiURL] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUserID, setCurrentUserID] = useState(null)

  const [phase, setPhase] = useState("waiting")
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [generatingQ, setGeneratingQ] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [pendingScore, setPendingScore] = useState(null)
  const [round1IntervieweeID, setRound1IntervieweeID] = useState(null)

  const phaseRef = useRef("waiting")
  const currentUserIDRef = useRef(null)
  const pollRef = useRef(null)
  const interviewerIDRef = useRef(null)

  const setPhaseWithRef = (p) => { phaseRef.current = p; setPhase(p) }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setCurrentUserID(payload.user_id)
      currentUserIDRef.current = payload.user_id
    } catch {}
    fetchRoom()
  }, [interviewID])

  useEffect(() => {
    pollRef.current = setInterval(() => { fetchRoom() }, 3000)
    return () => clearInterval(pollRef.current)
  }, [interviewID])

  const fetchRoom = useCallback(async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/mock-interviews/${interviewID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) { router.push("/mock-interviews"); return }

      const iv = data.interview
      const qs = data.questions || []
      const uid = currentUserIDRef.current

      setInterview(iv)
      setQuestions(qs)
      setResults(data.results || [])
      setJitsiURL(data.jitsi_url || "")

      if (iv.interviewer_id) {
        interviewerIDRef.current = iv.interviewer_id
        const intervieweeID = iv.interviewer_id === iv.requester_id ? iv.responder_id : iv.requester_id
        setRound1IntervieweeID(intervieweeID)
      }

      const currentPhase = phaseRef.current

      if (iv.status === "completed") { setPhaseWithRef("completed"); setLoading(false); return }

      if (currentPhase === "waiting" && (iv.status === "matched" || iv.status === "in_progress")) {
        setPhaseWithRef("briefing"); setLoading(false); return
      }

      if (currentPhase === "round1" || currentPhase === "round2") {
        const roundLabel = currentPhase === "round1" ? "first" : "second"
        const intervieweeForThisRound = currentPhase === "round1"
          ? (iv.interviewer_id === iv.requester_id ? iv.responder_id : iv.requester_id)
          : iv.interviewer_id

        const isInterviewee = uid !== iv.interviewer_id ? currentPhase === "round1" : currentPhase === "round2"

        if (isInterviewee) {
          const roundQs = qs.filter(q => q.round === roundLabel && q.for_user_id === intervieweeForThisRound)
          if (roundQs.length > 0) setQuestionNumber(roundQs[roundQs.length - 1].question_number)
        }

        if (currentPhase === "round1") {
          const round1Qs = qs.filter(q => q.round === "first")
          if (round1Qs.length >= iv.question_count && round1Qs.every(q => q.score > 0 || q.score === 0)) {
            setPhaseWithRef("round2_briefing")
          }
        }

        if (currentPhase === "round2") {
          const round2Qs = qs.filter(q => q.round === "second")
          if (round2Qs.length >= iv.question_count && round2Qs.every(q => q.score > 0 || q.score === 0)) {
            setPhaseWithRef("completed")
          }
        }
      }
    } catch {}
    setLoading(false)
  }, [interviewID, router])

  const iAmInterviewerRound1 = interview && currentUserID === interview.interviewer_id
  const iAmInterviewerRound2 = interview && currentUserID !== interview.interviewer_id
  const iAmInterviewer = (phase === "round1" && iAmInterviewerRound1) || (phase === "round2" && iAmInterviewerRound2)
  const intervieweeID = phase === "round1" ? round1IntervieweeID : interview?.interviewer_id ?? null

  const getParticipantName = (uid) => {
    if (!interview || uid == null) return "Participant"
    if (uid === interview.requester_id) return interview.requester_name
    if (uid === interview.responder_id) return interview.responder_name || "Participant"
    return "Participant"
  }

  const startRound = (round) => {
    setPhaseWithRef(round === 1 ? "round1" : "round2")
    setQuestionNumber(1)
    setCurrentQuestion(null)
    setPendingScore(null)
  }

  const generateNextQuestion = async () => {
    if (!interview) return
    setGeneratingQ(true)
    setPendingScore(null)
    const round = phase === "round1" ? "first" : "second"
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8080/mock-interviews/${interviewID}/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ round, for_user_id: intervieweeID, question_number: questionNumber }),
      })
      const data = await res.json()
      if (res.ok) { setCurrentQuestion(data); setQuestions(prev => [...prev, data]) }
    } catch {}
    setGeneratingQ(false)
  }

  const submitScore = async (score) => {
    if (!currentQuestion || scoring) return
    setScoring(true)
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:8080/mock-interviews/${interviewID}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question_id: currentQuestion.id, score }),
    })
    setScoring(false)
    setPendingScore(null)
    setCurrentQuestion(null)
    if (questionNumber >= interview.question_count) {
      if (phase === "round1") setPhaseWithRef("round2_briefing")
      else await completeInterview()
    } else {
      setQuestionNumber(n => n + 1)
    }
  }

  const completeInterview = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:8080/mock-interviews/${interviewID}/complete`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setResults(data.results || [])
    setPhaseWithRef("completed")
    setInterview(prev => prev ? { ...prev, status: "completed" } : prev)
  }

  const scoreColor = (s) => s >= 7 ? "var(--neon)" : s >= 4 ? "#f0a830" : "#e05252"
  const scoreBg = (s) => s >= 7 ? "rgba(181,242,61,0.15)" : s >= 4 ? "rgba(240,168,48,0.15)" : "rgba(224,82,82,0.15)"
  const scoreBorder = (s) => s >= 7 ? "rgba(181,242,61,0.4)" : s >= 4 ? "rgba(240,168,48,0.4)" : "rgba(224,82,82,0.4)"

  if (loading) return (
    <SidebarLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)", animation: "spin-slow 1s linear infinite" }} />
        <p style={{ color: "var(--text-muted)" }}>Loading interview room...</p>
      </div>
    </SidebarLayout>
  )

  if (!interview) return null

  return (
    <SidebarLayout>
      <style>{`
        .score-btn { transition: all 0.15s ease; border: 2px solid var(--border); background: var(--bg-2); cursor: pointer; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
        .score-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .score-btn.selected { transform: translateY(-2px) scale(1.1); }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <button onClick={() => router.push("/mock-interviews")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: 0 }}>
              ← Back to interviews
            </button>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text-primary)" }}>{interview.topic}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
              {interview.requester_name} vs {interview.responder_name || "..."} · {interview.question_count} questions each
            </p>
          </div>
          {jitsiURL && (
            <a href={jitsiURL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "rgba(74,158,245,0.1)", border: "1px solid rgba(74,158,245,0.3)", color: "#4a9ef5", textDecoration: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14"/>
                <rect x="3" y="6" width="12" height="12" rx="2"/>
              </svg>
              Open Video Call
            </a>
          )}
        </div>

        {/* ==================== WAITING ==================== */}
        {phase === "waiting" && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "56px 32px", textAlign: "center", boxShadow: "var(--shadow)" }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 24px" }}>⏳</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Waiting for a participant...</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.7 }}>
              Share this page's URL with someone to join your mock interview session.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", animation: "pulse-neon 2s infinite" }} />
              Checking for participants every 3s...
            </div>
          </div>
        )}

        {/* ==================== BRIEFING ==================== */}
        {phase === "briefing" && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "40px 32px", boxShadow: "var(--shadow)", animation: "fadeIn 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Both participants are here!</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Join the video call first, then start when both are ready.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Round 1 Interviewer", uid: interview.interviewer_id, role: "Asks questions", icon: "🎙️" },
                { label: "Round 1 Interviewee", uid: round1IntervieweeID, role: "Answers questions", icon: "🎤" },
              ].map((p, i) => (
                <div key={i} style={{ padding: "20px 24px", borderRadius: 16, background: p.uid === currentUserID ? "var(--neon-subtle)" : "var(--bg-2)", border: `1px solid ${p.uid === currentUserID ? "rgba(181,242,61,0.3)" : "var(--border)"}`, position: "relative", overflow: "hidden" }}>
                  {p.uid === currentUserID && <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: "radial-gradient(circle, rgba(181,242,61,0.2), transparent)", borderRadius: "0 0 0 60px" }} />}
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{p.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: p.uid === currentUserID ? "var(--neon-dim)" : "var(--text-primary)" }}>
                    {getParticipantName(p.uid)} {p.uid === currentUserID && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--neon)" }}>(You)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{p.role}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {jitsiURL && (
                <a href={jitsiURL} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "14px", borderRadius: 12, textAlign: "center", background: "rgba(74,158,245,0.1)", border: "1px solid rgba(74,158,245,0.3)", color: "#4a9ef5", textDecoration: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 }}>
                  📹 Join Video Call First
                </a>
              )}
              <button onClick={() => startRound(1)} className="btn-neon" style={{ flex: 1, padding: "14px", borderRadius: 12, fontSize: 14 }}>
                🚀 Start Interview
              </button>
            </div>
          </div>
        )}

        {/* ==================== ROUND 1 / ROUND 2 ==================== */}
        {(phase === "round1" || phase === "round2") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>

            {/* Round header */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ padding: "4px 14px", borderRadius: 99, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", fontSize: 12, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                  Round {phase === "round1" ? 1 : 2}
                </div>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  {iAmInterviewer
                    ? `🎙️ You are interviewing ${getParticipantName(intervieweeID)}`
                    : `🎤 You are being interviewed by ${getParticipantName(phase === "round1" ? interview.interviewer_id : round1IntervieweeID)}`
                  }
                </span>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text-muted)" }}>
                Q {questionNumber} / {interview.question_count}
              </div>
            </div>

            {/* Progress */}
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${((questionNumber - 1) / interview.question_count) * 100}%` }} />
            </div>

            {/* INTERVIEWER VIEW */}
            {iAmInterviewer ? (
              <div>
                {!currentQuestion && !generatingQ && (
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 32px", textAlign: "center", boxShadow: "var(--shadow)" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 20px" }}>💡</div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Ready for Question {questionNumber}?</h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
                      AI will generate a question on <strong>{interview.topic}</strong>.<br/>Ask it to the candidate on the video call.
                    </p>
                    <button onClick={generateNextQuestion} className="btn-neon" style={{ padding: "13px 32px", borderRadius: 12, fontSize: 15 }}>
                      Generate Question {questionNumber} →
                    </button>
                  </div>
                )}

                {generatingQ && (
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 32px", textAlign: "center", boxShadow: "var(--shadow)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)", animation: "spin-slow 1s linear infinite", margin: "0 auto 20px" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Generating question with AI...</p>
                  </div>
                )}

                {currentQuestion && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                    {/* LEFT — Question */}
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "24px", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "var(--neon-dim)" }}>
                            Q{questionNumber}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Question</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.65, padding: "16px 18px", borderRadius: 14, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                          {currentQuestion.question}
                        </div>
                      </div>

                      {/* Score buttons */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 12 }}>
                          Score the Answer
                          {pendingScore !== null && (
                            <span style={{ marginLeft: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: scoreColor(pendingScore) }}>
                              {pendingScore}/10
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <button
                              key={n}
                              className={`score-btn ${pendingScore === n ? "selected" : ""}`}
                              onClick={() => setPendingScore(n)}
                              style={{
                                color: pendingScore === n ? scoreColor(n) : "var(--text-muted)",
                                background: pendingScore === n ? scoreBg(n) : "var(--bg-2)",
                                borderColor: pendingScore === n ? scoreBorder(n) : "var(--border)",
                                boxShadow: pendingScore === n ? `0 0 12px ${scoreBg(n)}` : "none",
                              }}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 8, paddingLeft: 2 }}>
                          <span>Poor</span><span>Average</span><span>Excellent</span>
                        </div>
                      </div>

                      <button
                        onClick={() => submitScore(pendingScore)}
                        disabled={pendingScore === null || scoring}
                        className="btn-neon"
                        style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, opacity: pendingScore === null ? 0.5 : 1 }}
                      >
                        {scoring ? "Saving..." : questionNumber >= interview.question_count ? "Submit & Finish Round ✓" : "Submit Score & Next →"}
                      </button>
                    </div>

                    {/* RIGHT — Model Answer */}
                    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(181,242,61,0.2)", borderRadius: 20, padding: "24px", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(181,242,61,0.1)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                          ✨
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Model Answer</span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, padding: "16px 18px", borderRadius: 14, background: "rgba(181,242,61,0.04)", border: "1px solid rgba(181,242,61,0.12)", flex: 1 }}>
                        {currentQuestion.suggested_answer}
                      </div>
                      <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                        💡 Use this as a reference to evaluate the candidate's response. Award points based on how well they cover these key concepts.
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              /* INTERVIEWEE VIEW */
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "56px 32px", textAlign: "center", boxShadow: "var(--shadow)" }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 24px" }}>🎤</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 12 }}>You are being interviewed</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.7 }}>
                  Your interviewer is asking you questions on the video call. Listen carefully and give your best answers!
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 12, background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)", fontSize: 14, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", animation: "pulse-neon 2s infinite" }} />
                  Question {questionNumber} of {interview.question_count}
                </div>

                {/* Mini progress dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                  {Array.from({ length: interview.question_count }).map((_, i) => (
                    <div key={i} style={{
                      width: i < questionNumber - 1 ? 10 : 8,
                      height: i < questionNumber - 1 ? 10 : 8,
                      borderRadius: "50%",
                      background: i < questionNumber - 1 ? "var(--neon)" : i === questionNumber - 1 ? "var(--neon-dim)" : "var(--border)",
                      boxShadow: i === questionNumber - 1 ? "0 0 8px var(--neon-glow)" : "none",
                      transition: "all 0.3s",
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ROUND 2 BRIEFING ==================== */}
        {phase === "round2_briefing" && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "48px 32px", textAlign: "center", boxShadow: "var(--shadow)", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔄</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Round 1 Complete!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>Roles are switching — now it's the other person's turn to answer!</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 440, margin: "0 auto 32px" }}>
              {[
                { label: "Round 2 Interviewer", uid: round1IntervieweeID, role: "now asks questions", icon: "🎙️" },
                { label: "Round 2 Interviewee", uid: interview.interviewer_id, role: "now answers questions", icon: "🎤" },
              ].map((p, i) => (
                <div key={i} style={{ padding: "18px 20px", borderRadius: 14, background: p.uid === currentUserID ? "var(--neon-subtle)" : "var(--bg-2)", border: `1px solid ${p.uid === currentUserID ? "rgba(181,242,61,0.3)" : "var(--border)"}` }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: p.uid === currentUserID ? "var(--neon-dim)" : "var(--text-primary)" }}>
                    {getParticipantName(p.uid)} {p.uid === currentUserID && "(You)"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{p.role}</div>
                </div>
              ))}
            </div>
            <button onClick={() => startRound(2)} className="btn-neon" style={{ padding: "14px 40px", borderRadius: 12, fontSize: 15 }}>
              Start Round 2 →
            </button>
          </div>
        )}

        {/* ==================== COMPLETED ==================== */}
        {phase === "completed" && (
          <div style={{ animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Results card */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--neon)", borderRadius: 24, padding: "40px 32px", textAlign: "center", boxShadow: "0 0 40px rgba(181,242,61,0.12)" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🏆</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Interview Complete!</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 36 }}>
                Great practice session on <strong style={{ color: "var(--text-primary)" }}>{interview.topic}</strong>
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 520, margin: "0 auto 36px" }}>
                {results.map((r, i) => {
                  const pct = r.max_score > 0 ? Math.round((r.total_score / r.max_score) * 100) : 0
                  const isMe = r.user_id === currentUserID
                  const color = pct >= 70 ? "var(--neon)" : pct >= 40 ? "#f0a830" : "#e05252"
                  return (
                    <div key={i} style={{ padding: "28px 24px", borderRadius: 20, background: isMe ? "var(--neon-subtle)" : "var(--bg-2)", border: `2px solid ${isMe ? "rgba(181,242,61,0.4)" : "var(--border)"}`, position: "relative", overflow: "hidden" }}>
                      {isMe && <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(circle, rgba(181,242,61,0.2), transparent)", borderRadius: "0 0 0 80px" }} />}
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
                        {r.user_name} {isMe && <span style={{ color: "var(--neon)" }}>(You)</span>}
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 44, color, lineHeight: 1, marginBottom: 6 }}>
                        {r.total_score}<span style={{ fontSize: 18, color: "var(--text-muted)", fontWeight: 600 }}>/{r.max_score}</span>
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color }}>{pct}%</div>
                      <div style={{ marginTop: 12 }}>
                        <div style={{ height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color, transition: "width 1s ease" }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button onClick={() => router.push("/mock-interviews")} className="btn-neon" style={{ padding: "13px 36px", borderRadius: 12, fontSize: 15 }}>
                Back to Interviews
              </button>
            </div>

            {/* Question Review — now with answers */}
            {questions.length > 0 && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "28px", boxShadow: "var(--shadow)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div className="section-dot" />
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>Question Review</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {questions.map((q, i) => {
                    const color = q.score >= 7 ? "var(--neon)" : q.score >= 4 ? "#f0a830" : "#e05252"
                    const bg = q.score >= 7 ? "rgba(181,242,61,0.08)" : q.score >= 4 ? "rgba(240,168,48,0.08)" : "rgba(224,82,82,0.08)"
                    const border = q.score >= 7 ? "rgba(181,242,61,0.2)" : q.score >= 4 ? "rgba(240,168,48,0.2)" : "rgba(224,82,82,0.2)"
                    return (
                      <div key={i} style={{ borderRadius: 16, border: `1px solid ${border}`, background: bg, overflow: "hidden" }}>
                        {/* Header */}
                        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ padding: "2px 8px", borderRadius: 99, background: "var(--bg-2)", border: "1px solid var(--border)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", textTransform: "uppercase" }}>
                              {q.round === "first" ? "Round 1" : "Round 2"}
                            </span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Q{q.question_number} · {getParticipantName(q.for_user_id)}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color }}>{q.score}/10</span>
                            <div style={{ height: 6, width: 60, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${(q.score / 10) * 100}%`, background: color, borderRadius: 99 }} />
                            </div>
                          </div>
                        </div>
                        {/* Q & A side by side */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                          <div style={{ padding: "16px 18px", borderRight: `1px solid ${border}` }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Question</div>
                            <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>{q.question}</div>
                          </div>
                          <div style={{ padding: "16px 18px" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: color, fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Model Answer</div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{q.suggested_answer}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}