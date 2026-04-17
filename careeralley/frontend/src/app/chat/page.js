"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import SidebarLayout from "../../components/SidebarLayout"
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
} from "@livekit/components-react"

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

function Avatar({ name, size = 34 }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"
  const colors = ["#b5f23d", "#4a9ef5", "#f0a830", "#3dba7a", "#e05252", "#a855f7"]
  const colorIndex = name?.charCodeAt(0) % colors.length || 0
  const bg = colors[colorIndex]

  return (
    <div style={{
      width: size, height: size, borderRadius: size / 3,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800,
      color: "#0d1008",
      fontFamily: "'Syne', sans-serif",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function MessageBubble({ msg, isOwn, showName, showDate, dateLabel }) {
  return (
    <>
      {showDate && (
        <div style={{
          textAlign: "center", margin: "16px 0 12px",
          fontSize: 11, color: "var(--text-muted)",
          fontFamily: "'Syne', sans-serif", fontWeight: 600,
          letterSpacing: "0.5px",
        }}>
          <span style={{
            padding: "3px 12px", borderRadius: 99,
            background: "var(--bg-2)", border: "1px solid var(--border)",
          }}>
            {dateLabel}
          </span>
        </div>
      )}

      <div style={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 4,
        animation: "fadeIn 0.2s ease forwards",
      }}>
        {!isOwn && (
          <div style={{ flexShrink: 0, marginBottom: 2 }}>
            {showName ? <Avatar name={msg.user_name} /> : <div style={{ width: 34 }} />}
          </div>
        )}

        <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
          {showName && !isOwn && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: "var(--neon-dim)",
              fontFamily: "'Syne', sans-serif",
              marginBottom: 4, marginLeft: 4,
            }}>
              {msg.user_name}
            </span>
          )}
          <div style={{
            padding: "10px 14px",
            borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: isOwn
              ? "linear-gradient(135deg, var(--neon-dim), var(--neon))"
              : "var(--bg-card)",
            color: isOwn ? "#0d1008" : "var(--text-primary)",
            border: isOwn ? "none" : "1px solid var(--border)",
            boxShadow: isOwn
              ? "0 4px 12px rgba(181,242,61,0.2)"
              : "var(--shadow)",
            fontSize: 14,
            lineHeight: 1.55,
            fontFamily: "'DM Sans', sans-serif",
            wordBreak: "break-word",
          }}>
            {msg.content}
          </div>
          <span style={{
            fontSize: 10, color: "var(--text-muted)",
            marginTop: 3,
            fontFamily: "'DM Sans', sans-serif",
            paddingLeft: isOwn ? 0 : 4,
            paddingRight: isOwn ? 4 : 0,
          }}>
            {formatTime(msg.created_at)}
          </span>
        </div>
      </div>
    </>
  )
}

function VoiceParticipant({ participant }) {
  const { isSpeaking, isMicrophoneEnabled } = participant;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        position: 'relative',
        boxShadow: isSpeaking ? '0 0 12px var(--neon-glow)' : 'none',
        borderRadius: '50%', border: isSpeaking ? '2px solid var(--neon)' : '2px solid transparent',
        transition: 'all 0.2s', padding: 2
      }}>
        <Avatar name={participant.name || participant.identity} size={40} />
        {!isMicrophoneEnabled && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            background: 'var(--danger)', borderRadius: '50%',
            width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff'
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12h2a5 5 0 0 0 8.45 3.35"></path><line x1="19" y1="12" x2="21" y2="12"></line></svg>
          </div>
        )}
      </div>
      <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif" }}>
        {(participant.name || participant.identity).split(' ')[0]}
      </span>
    </div>
  )
}

function LocalParticipantControls({ onLeave }) {
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
      <button 
        onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
        style={{
          background: isMicrophoneEnabled ? "var(--bg-2)" : "var(--danger)",
          border: "1px solid var(--border)",
          color: isMicrophoneEnabled ? "var(--text-primary)" : "#fff",
          width: 36, height: 36, borderRadius: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
        title="Toggle Microphone"
      >
        {isMicrophoneEnabled ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12h2a5 5 0 0 0 8.45 3.35"></path><line x1="19" y1="12" x2="21" y2="12"></line></svg>
        )}
      </button>
      <button 
        onClick={onLeave}
        style={{
          background: "var(--danger)",
          border: "none",
          color: "#fff",
          width: 36, height: 36, borderRadius: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
        title="Disconnect"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
      </button>
    </div>
  )
}

function ActiveVoiceCall({ onLeave }) {
  const participants = useParticipants();
  return (
    <div style={{
      padding: "16px 20px",
      background: "var(--bg-2)", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 16, overflowX: "auto"
    }}>
      <RoomAudioRenderer />
      {participants.map(p => (
        <VoiceParticipant key={p.identity} participant={p} />
      ))}
      {participants.length === 0 && <span style={{fontSize:12, color:"var(--text-muted)"}}>Waiting for others...</span>}
      <LocalParticipantControls onLeave={onLeave} />
    </div>
  );
}

export default function GroupChatPage() {
  const [myCards, setMyCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [onlineCount, setOnlineCount] = useState(1)
  const [voiceToken, setVoiceToken] = useState(null)

  const wsRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const currentUserID = useRef(null)

  // Fetch cards user has joined
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    // Decode user ID from JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      currentUserID.current = payload.user_id
    } catch {}

    fetch("http://localhost:8080/chat/my-cards", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setMyCards(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Connect WebSocket when card selected
  const connectToCard = useCallback((card) => {
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setSelectedCard(card)
    setMessages([])
    setConnected(false)
    setVoiceToken(null)

    const token = localStorage.getItem("token")

    // Load history first
    fetch(`http://localhost:8080/chat/${card.card_id}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : [])
      })
      .catch(() => {})

    // Connect WebSocket
    const ws = new WebSocket(`ws://localhost:8080/chat/${card.card_id}/ws?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      console.log("[WS] Connected to card", card.card_id)
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        setMessages(prev => [...prev, msg])
      } catch {}
    }

    ws.onclose = () => {
      setConnected(false)
      console.log("[WS] Disconnected")
    }

    ws.onerror = (err) => {
      console.error("[WS] Error", err)
      setConnected(false)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [])

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    wsRef.current.send(JSON.stringify({ content: input.trim() }))
    setInput("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Group messages by date and consecutive sender
  const groupedMessages = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1]
    const showName = !prev || prev.user_id !== msg.user_id
    const showDate = !prev || formatDate(msg.created_at) !== formatDate(prev.created_at)
    acc.push({ ...msg, showName, showDate, dateLabel: formatDate(msg.created_at) })
    return acc
  }, [])

  const joinVoiceChannel = async () => {
    if (!selectedCard) return;
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8080/chat/${selectedCard.card_id}/voice/token`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.token) {
        console.log("Got Voice Token:", data.token)
        setVoiceToken(data.token)
      } else {
        console.error("Failed to get token, response:", data)
      }
    } catch (e) {
      console.error("Failed to fetch voice token", e)
    }
  }

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", height: "calc(100vh - 130px)", display: "flex", gap: 20 }}>

        {/* Sidebar — card list */}
        <div style={{
          width: 260, flexShrink: 0,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          display: "flex", flexDirection: "column",
          boxShadow: "var(--shadow)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Group Chat
              </span>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "var(--text-primary)" }}>
              Your Groups
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Based on your roadmaps
            </p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--neon-subtle)", borderTopColor: "var(--neon)", animation: "spin-slow 1s linear infinite" }} />
              </div>
            ) : myCards.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🗺</div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Start a roadmap to join its group chat
                </p>
              </div>
            ) : (
              myCards.map(card => {
                const isActive = selectedCard?.card_id === card.card_id
                return (
                  <button
                    key={card.card_id}
                    onClick={() => connectToCard(card)}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 12px",
                      borderRadius: 12,
                      marginBottom: 4,
                      border: isActive ? "1px solid rgba(181,242,61,0.3)" : "1px solid transparent",
                      background: isActive ? "var(--neon-subtle)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-2)" }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: isActive ? "rgba(181,242,61,0.15)" : "var(--bg-2)",
                      border: `1px solid ${isActive ? "rgba(181,242,61,0.3)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                    }}>
                      {card.icon || "💼"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                        color: isActive ? "var(--neon-dim)" : "var(--text-primary)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {card.card_name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                        Group discussion
                      </div>
                    </div>
                    {isActive && connected && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 6px var(--neon-glow)", flexShrink: 0 }} />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          boxShadow: "var(--shadow)",
          overflow: "hidden",
        }}>
          {!selectedCard ? (
            // Empty state
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 16, padding: 40, textAlign: "center",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "var(--neon-subtle)",
                border: "1px solid rgba(181,242,61,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36,
              }}>
                💬
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text-primary)" }}>
                Select a group to start chatting
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 300, lineHeight: 1.6 }}>
                Each career roadmap has its own group chat. Pick one from the left to join the discussion.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "var(--neon-subtle)",
                    border: "1px solid rgba(181,242,61,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {selectedCard.icon || "💼"}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>
                      {selectedCard.card_name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: connected ? "var(--neon)" : "var(--danger)",
                        boxShadow: connected ? "0 0 6px var(--neon-glow)" : "none",
                      }} />
                      <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                        {connected ? "Connected · Group discussion" : "Connecting..."}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    padding: "5px 12px", borderRadius: 99,
                    background: "var(--neon-subtle)",
                    border: "1px solid rgba(181,242,61,0.2)",
                    fontSize: 12, fontWeight: 700, color: "var(--neon-dim)",
                    fontFamily: "'Syne', sans-serif",
                  }}>
                    # {selectedCard.card_name.toLowerCase().replace(/\s+/g, "-")}
                  </div>
                  {!voiceToken && (
                    <button onClick={joinVoiceChannel} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 12px", borderRadius: 99,
                      background: "rgba(181,242,61,0.1)", border: "1px solid rgba(181,242,61,0.4)",
                      fontSize: 12, fontWeight: 700, color: "var(--neon-dim)",
                      cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(181,242,61,0.2)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(181,242,61,0.1)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      Join Voice
                    </button>
                  )}
                </div>
              </div>

              {/* Voice Banner */}
              {voiceToken && process.env.NEXT_PUBLIC_LIVEKIT_URL && (
                <LiveKitRoom
                  video={false}
                  audio={false} // don't ask for mic immediately to prevent permission crash
                  token={voiceToken}
                  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                  connect={true}
                  onDisconnected={() => {
                    console.log('LiveKit disconnected');
                    setVoiceToken(null);
                  }}
                  onError={(err) => console.error('LiveKit Error:', err)}
                >
                  <ActiveVoiceCall onLeave={() => setVoiceToken(null)} />
                </LiveKitRoom>
              )}

              {/* Messages */}
              <div style={{
                flex: 1, overflowY: "auto",
                padding: "16px 20px",
              }}>
                {messages.length === 0 && connected && (
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", height: "100%", gap: 12, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 40 }}>👋</div>
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                      No messages yet. Be the first to say something!
                    </p>
                  </div>
                )}

                {groupedMessages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id || i}
                    msg={msg}
                    isOwn={msg.user_id === currentUserID.current}
                    showName={msg.showName}
                    showDate={msg.showDate}
                    dateLabel={msg.dateLabel}
                  />
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--border)",
                display: "flex", alignItems: "flex-end", gap: 10,
                flexShrink: 0,
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={connected ? `Message #${selectedCard.card_name.toLowerCase()}...` : "Connecting..."}
                  disabled={!connected}
                  rows={1}
                  style={{
                    flex: 1,
                    background: "var(--bg-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--text-primary)",
                    outline: "none",
                    resize: "none",
                    maxHeight: 100,
                    overflowY: "auto",
                    lineHeight: 1.5,
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--neon)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                  onInput={e => {
                    e.target.style.height = "auto"
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || !connected}
                  style={{
                    width: 42, height: 42,
                    borderRadius: 12, border: "none",
                    background: input.trim() && connected ? "var(--neon)" : "var(--bg-2)",
                    color: input.trim() && connected ? "#0d1008" : "var(--text-muted)",
                    cursor: input.trim() && connected ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s", flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}