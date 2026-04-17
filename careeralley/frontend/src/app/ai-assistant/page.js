"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import SidebarLayout from "../../components/SidebarLayout"

const SUGGESTIONS = [
  "I want to learn Web Development from scratch",
  "What should I learn for Data Science?",
  "Help me get into Cloud Computing",
  "I'm a beginner in Python, what's next?",
  "Create a roadmap for Machine Learning",
]

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 18px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--neon)",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === "user"

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 16,
      animation: "fadeIn 0.3s ease forwards",
    }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 10, alignSelf: "flex-end",
          boxShadow: "0 0 12px rgba(181,242,61,0.3)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.6-4.5 6.7V17h-5v-1.3C6.8 14.6 5 12 5 9a7 7 0 0 1 7-7z" fill="#0d1008"/>
            <path d="M9 21h6M10 17v4M14 17v4" stroke="#0d1008" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      <div style={{
        maxWidth: "72%",
        padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser
          ? "linear-gradient(135deg, var(--neon-dim), var(--neon))"
          : "var(--bg-card)",
        color: isUser ? "#0d1008" : "var(--text-primary)",
        border: isUser ? "none" : "1px solid var(--border)",
        boxShadow: isUser
          ? "0 4px 16px rgba(181,242,61,0.25)"
          : "var(--shadow)",
        fontSize: 14,
        lineHeight: 1.65,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: isUser ? 500 : 400,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {msg.content}
      </div>

      {isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginLeft: 10, alignSelf: "flex-end",
          fontSize: 16,
        }}>
          👤
        </div>
      )}
    </div>
  )
}

function RoadmapPreview({ roadmap, onSave, saving }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--neon)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      boxShadow: "0 0 24px rgba(181,242,61,0.15)",
      animation: "fadeIn 0.4s ease forwards",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>
              Generated Roadmap
            </span>
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "var(--text-primary)" }}>
            {roadmap.card_name}
          </h3>
          <span style={{
            display: "inline-block", marginTop: 4,
            padding: "2px 10px", borderRadius: 99,
            background: "var(--neon-subtle)",
            border: "1px solid rgba(181,242,61,0.2)",
            fontSize: 11, fontWeight: 700, color: "var(--neon-dim)",
            fontFamily: "'Syne', sans-serif", textTransform: "capitalize",
          }}>
            {roadmap.level}
          </span>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: "8px 18px", borderRadius: 8,
            background: saving ? "var(--neon-subtle)" : "var(--neon)",
            color: saving ? "var(--neon-dim)" : "#0d1008",
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
            transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {saving ? (
            <>
              <div style={{ width: 12, height: 12, border: "2px solid var(--neon-dim)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
              Saving...
            </>
          ) : (
            <>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Roadmap
            </>
          )}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
        {roadmap.topics.map((topic, i) => (
          <div key={i} style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: "var(--neon-subtle)",
              border: "1px solid rgba(181,242,61,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "var(--neon-dim)",
              fontFamily: "'Syne', sans-serif",
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>
                {topic.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {topic.subtopics?.length || 0} subtopics · ~{topic.estimated_time}h · {topic.difficulty}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your CareerAlley AI Assistant 👋\n\nI can help you:\n• Decide what career path or skill to learn\n• Recommend learning strategies\n• Answer questions about tech fields\n• Create a personalized roadmap based on our conversation\n\nWhat would you like to learn today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingRoadmap, setPendingRoadmap] = useState(null)
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)
  const [savingRoadmap, setSavingRoadmap] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading, pendingRoadmap])

  const sendMessage = async (content) => {
    if (!content.trim() || loading) return

    const userMsg = { role: "user", content: content.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    setPendingRoadmap(null)
    setSavedSuccess(false)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      const assistantMsg = { role: "assistant", content: data.reply }
      setMessages(prev => [...prev, assistantMsg])

      // If AI flagged a roadmap should be generated
      if (data.has_roadmap) {
        setGeneratingRoadmap(true)
        const allMessages = [...newMessages, assistantMsg]
        await generateRoadmapFromConversation(allMessages)
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I ran into an issue. Please try again.",
      }])
    } finally {
      setLoading(false)
      setGeneratingRoadmap(false)
      inputRef.current?.focus()
    }
  }

  const generateRoadmapFromConversation = async (conversationMessages) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8080/assistant/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: conversationMessages }),
      })

      const data = await res.json()
      if (data.topics && data.topics.length > 0) {
        setPendingRoadmap(data)
      }
    } catch (err) {
      console.error("Roadmap generation failed", err)
    }
  }

  const saveRoadmap = async () => {
    if (!pendingRoadmap || savingRoadmap) return
    setSavingRoadmap(true)

    try {
      // We store it as a custom AI roadmap via the existing /generate-roadmap endpoint
      // by finding or creating a matching career card, or we save directly
      // For now we save the roadmap data and navigate to roadmaps page
      const token = localStorage.getItem("token")

      // Save to backend using the existing flow - post to a special endpoint
      const res = await fetch("http://localhost:8080/assistant/save-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pendingRoadmap),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `✅ Your "${pendingRoadmap.card_name}" roadmap has been saved! Head to the Roadmaps page to start learning.`,
        }])
        setPendingRoadmap(null)
        setTimeout(() => router.push("/roadmaps"), 2000)
      }
    } catch (err) {
      console.error("Save failed", err)
    } finally {
      setSavingRoadmap(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! What would you like to learn today?",
    }])
    setPendingRoadmap(null)
    setSavedSuccess(false)
  }

  return (
    <SidebarLayout>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      <div style={{ maxWidth: 820, margin: "0 auto", height: "calc(100vh - 130px)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)", animation: "pulse-neon 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                  AI Assistant
                </span>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 34px)", color: "var(--text-primary)" }}>
                CareerAlley Assistant
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                Powered by Llama 3.3 · Ask me anything about learning and careers
              </p>
            </div>
            <button
              onClick={clearChat}
              style={{
                padding: "8px 14px", borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-muted)",
                cursor: "pointer", fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-primary)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)" }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.99"/>
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "24px 20px",
          marginBottom: 16,
          boxShadow: "var(--shadow)",
          display: "flex",
          flexDirection: "column",
        }}>

          {/* Suggestion chips — show only at start */}
          {messages.length === 1 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 10, textTransform: "uppercase" }}>
                Try asking
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "7px 14px", borderRadius: 99,
                      border: "1px solid var(--border)",
                      background: "var(--bg-2)",
                      color: "var(--text-secondary)",
                      cursor: "pointer", fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.color = "var(--neon-dim)"; e.currentTarget.style.background = "var(--neon-subtle)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-2)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginRight: 10, alignSelf: "flex-end",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.6-4.5 6.7V17h-5v-1.3C6.8 14.6 5 12 5 9a7 7 0 0 1 7-7z" fill="#0d1008"/>
                  <path d="M9 21h6M10 17v4M14 17v4" stroke="#0d1008" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "18px 18px 18px 4px",
                boxShadow: "var(--shadow)",
              }}>
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Generating roadmap indicator */}
          {generatingRoadmap && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 12,
              background: "var(--neon-subtle)",
              border: "1px solid rgba(181,242,61,0.2)",
              marginBottom: 16, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ width: 16, height: 16, border: "2px solid var(--neon)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "var(--neon-dim)", fontFamily: "'DM Sans', sans-serif" }}>
                Generating your personalized roadmap from our conversation...
              </span>
            </div>
          )}

          {/* Roadmap preview */}
          {pendingRoadmap && (
            <RoadmapPreview
              roadmap={pendingRoadmap}
              onSave={saveRoadmap}
              saving={savingRoadmap}
            />
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "12px 16px",
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          boxShadow: "var(--shadow)",
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about learning paths, career advice, or say 'create a roadmap for me'..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-primary)",
              lineHeight: 1.6,
              maxHeight: 120,
              overflowY: "auto",
              padding: "4px 0",
            }}
            onInput={e => {
              e.target.style.height = "auto"
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: 40, height: 40,
              borderRadius: 10,
              border: "none",
              background: input.trim() && !loading ? "var(--neon)" : "var(--bg-2)",
              color: input.trim() && !loading ? "#0d1008" : "var(--text-muted)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 10, fontFamily: "'DM Sans', sans-serif" }}>
          Press <kbd style={{ padding: "1px 5px", borderRadius: 4, border: "1px solid var(--border)", fontSize: 10 }}>Enter</kbd> to send · <kbd style={{ padding: "1px 5px", borderRadius: 4, border: "1px solid var(--border)", fontSize: 10 }}>Shift+Enter</kbd> for new line
        </p>
      </div>
    </SidebarLayout>
  )
}