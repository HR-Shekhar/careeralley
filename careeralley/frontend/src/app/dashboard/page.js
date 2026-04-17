// // "use client"

// // import { useEffect, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import { get } from "../../lib/api"

// // export default function DashboardPage(){

// //   const router = useRouter()

// //   const [stats,setStats] = useState(null)
// //   const [cards,setCards] = useState([])

// //   useEffect(()=>{

// //     const loadDashboard = async ()=>{

// //       const token = localStorage.getItem("token")

// //       const data = await get("/user-dashboard",token)

// //       if(data){

// //         setStats({
// //           today:data.today_minutes,
// //           weekly:data.weekly_minutes
// //         })

// //         setCards(data.active_cards)

// //       }

// //     }

// //     loadDashboard()

// //   },[])


// //   const openRoadmap = (cardID)=>{

// //     router.push(`/roadmap/${cardID}`)

// //   }


// //   if(!stats){
// //     return <div className="p-10">Loading dashboard...</div>
// //   }


// //   return(

// //     <div className="p-10 max-w-5xl mx-auto">

// //       <h1 className="text-4xl font-bold mb-8">
// //         Dashboard
// //       </h1>


// //       {/* Study Stats */}

// //       <div className="grid grid-cols-2 gap-6 mb-10">

// //         <div className="border rounded-lg p-6 bg-blue-50">

// //           <h2 className="text-xl font-semibold mb-2">
// //             Today's Study
// //           </h2>

// //           <p className="text-3xl font-bold">
// //             {stats.today} minutes
// //           </p>

// //         </div>


// //         <div className="border rounded-lg p-6 bg-green-50">

// //           <h2 className="text-xl font-semibold mb-2">
// //             Weekly Study
// //           </h2>

// //           <p className="text-3xl font-bold">
// //             {stats.weekly} minutes
// //           </p>

// //         </div>

// //       </div>



// //       {/* Active Learning */}

// //       <h2 className="text-2xl font-bold mb-6">
// //         Your Learning Paths
// //       </h2>


// //       {cards.length === 0 && (

// //         <div className="border p-6 rounded-lg text-gray-600">
// //           No active learning paths yet.
// //         </div>

// //       )}


// //       <div className="grid grid-cols-2 gap-6">

// //         {cards.map((card,index)=>(

// //           <div
// //             key={index}
// //             className="border rounded-lg p-6 shadow-sm"
// //           >

// //             <h3 className="text-xl font-semibold mb-3">
// //               {card.card_name}
// //             </h3>

// //             <p className="mb-2">
// //               Level: <strong>{card.level}</strong>
// //             </p>

// //             <p className="mb-4">
// //               Progress: <strong>{card.progress_percent}%</strong>
// //             </p>


// //             {/* Progress bar */}

// //             <div className="w-full bg-gray-200 h-3 rounded mb-4">

// //               <div
// //                 className="bg-blue-500 h-3 rounded"
// //                 style={{width:`${card.progress_percent}%`}}
// //               />

// //             </div>


// //             {/* Continue button */}

// //             <button
// //               onClick={()=>openRoadmap(card.card_id)}
// //               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //             >
// //               Continue Learning
// //             </button>

// //           </div>

// //         ))}

// //       </div>


// //     </div>

// //   )

// // }

// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { get } from "../../lib/api"

// export default function DashboardPage(){

//   const router = useRouter()

//   const [stats,setStats] = useState(null)
//   const [cards,setCards] = useState([])

//   useEffect(()=>{

//     const loadDashboard = async ()=>{

//       const token = localStorage.getItem("token")

//       const data = await get("/user-dashboard",token)

//       if(data){

//         setStats({
//           today:data.today_minutes || 0,
//           weekly:data.weekly_minutes || 0
//         })

//         setCards(data.active_cards || [])

//       }

//     }

//     loadDashboard()

//   },[])


//   const openRoadmap = (cardID)=>{

//     router.push(`/roadmap/${cardID}`)

//   }


//   if(!stats){
//     return <div className="p-10">Loading dashboard...</div>
//   }


//   return(

//     <div className="p-10 max-w-5xl mx-auto">

//       <h1 className="text-4xl font-bold mb-8">
//         Dashboard
//       </h1>


//       <div className="grid grid-cols-2 gap-6 mb-10">

//         <div className="border rounded-lg p-6 bg-blue-50">

//           <h2 className="text-xl font-semibold mb-2">
//             Today's Study
//           </h2>

//           <p className="text-3xl font-bold">
//             {stats.today} minutes
//           </p>

//         </div>


//         <div className="border rounded-lg p-6 bg-green-50">

//           <h2 className="text-xl font-semibold mb-2">
//             Weekly Study
//           </h2>

//           <p className="text-3xl font-bold">
//             {stats.weekly} minutes
//           </p>

//         </div>

//       </div>


//       <h2 className="text-2xl font-bold mb-6">
//         Your Learning Paths
//       </h2>


//       {cards.length === 0 && (

//         <div className="border p-6 rounded-lg text-gray-600">
//           No active learning paths yet.
//         </div>

//       )}


//       <div className="grid grid-cols-2 gap-6">

//         {cards.map((card,index)=>(

//           <div
//             key={index}
//             className="border rounded-lg p-6 shadow-sm"
//           >

//             <h3 className="text-xl font-semibold mb-3">
//               {card.card_name}
//             </h3>

//             <p className="mb-2">
//               Level: <strong>{card.level}</strong>
//             </p>

//             <p className="mb-4">
//               Progress: <strong>{card.progress_percent}%</strong>
//             </p>


//             <div className="w-full bg-gray-200 h-3 rounded mb-4">

//               <div
//                 className="bg-blue-500 h-3 rounded"
//                 style={{width:`${card.progress_percent}%`}}
//               />

//             </div>


//             <button
//               onClick={()=>openRoadmap(card.card_id)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Continue Learning
//             </button>

//           </div>

//         ))}

//       </div>

//     </div>

//   )

// }

"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { get } from "../../lib/api"
import SidebarLayout from "../../components/SidebarLayout"

function MiniChart({ data = [], color = "#b5f23d" }) {
  const max = Math.max(...data, 1)
  const width = 200
  const height = 60
  const padding = 4

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - (val / max) * (height - padding * 2)
    return `${x},${y}`
  }).join(" ")

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace("#", "")})`}/>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((val, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2)
        const y = height - padding - (val / max) * (height - padding * 2)
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="4" fill={color} stroke="var(--bg-card)" strokeWidth="2"/>
        ) : null
      })}
    </svg>
  )
}

function WeeklyBarChart({ data = [] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const max = Math.max(...data, 1)

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
      {days.map((day, i) => {
        const val = data[i] || 0
        const pct = (val / max) * 100
        return (
          <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
            <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
              <div style={{
                width: "100%",
                height: `${Math.max(pct, 4)}%`,
                borderRadius: "4px 4px 0 0",
                background: i === new Date().getDay() - 1
                  ? "linear-gradient(180deg, #b5f23d, #8fbe2a)"
                  : "linear-gradient(180deg, rgba(181,242,61,0.4), rgba(181,242,61,0.15))",
                transition: "height 0.6s cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
                boxShadow: i === new Date().getDay() - 1 ? "0 0 12px rgba(181,242,61,0.4)" : "none",
              }}>
                {val > 0 && (
                  <div style={{
                    position: "absolute", bottom: "100%", left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10, fontWeight: 700, color: "var(--neon-dim)",
                    fontFamily: "'Syne', sans-serif", marginBottom: 2,
                    whiteSpace: "nowrap",
                  }}>
                    {val}m
                  </div>
                )}
              </div>
            </div>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif" }}>
              {day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [cards, setCards] = useState([])
  const [weeklyData] = useState([45, 30, 60, 20, 75, 50, 80])
  const [todayTrend] = useState([10, 25, 20, 40, 35, 55, 45, 70, 65])

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token")
      const data = await get("/user-dashboard", token)
      if (data) {
        setStats({ today: data.today_minutes || 0, weekly: data.weekly_minutes || 0 })
        setCards(data.active_cards || [])
      }
    }
    loadDashboard()
  }, [])

  if (!stats) {
    return (
      <SidebarLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "3px solid var(--neon-subtle)",
            borderTopColor: "var(--neon)",
            animation: "spin-slow 1s linear infinite",
          }}/>
          <p style={{ color: "var(--text-muted)" }}>Loading your dashboard...</p>
        </div>
      </SidebarLayout>
    )
  }

  const totalProgress = cards.length > 0
    ? Math.round(cards.reduce((sum, c) => sum + (c.progress_percent || 0), 0) / cards.length)
    : 0

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)", animation: "pulse-neon 2s infinite" }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
              Overview
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)" }}>
            Your Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 15 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            {
              label: "Today's Study",
              value: stats.today,
              unit: "min",
              icon: "⏱",
              trend: todayTrend,
              color: "#b5f23d",
              bg: "var(--neon-subtle)",
            },
            {
              label: "Weekly Total",
              value: stats.weekly,
              unit: "min",
              icon: "📅",
              trend: weeklyData,
              color: "#4a9ef5",
              bg: "rgba(74,158,245,0.08)",
            },
            {
              label: "Active Paths",
              value: cards.length,
              unit: "paths",
              icon: "🗺",
              trend: [2,2,3,3,3,4,cards.length],
              color: "#f0a830",
              bg: "rgba(240,168,48,0.08)",
            },
            {
              label: "Avg Progress",
              value: totalProgress,
              unit: "%",
              icon: "📈",
              trend: [10,18,25,30,40,45,totalProgress],
              color: "#3dba7a",
              bg: "rgba(61,186,122,0.08)",
            },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "22px 22px 16px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow)",
              animation: `fadeIn 0.4s ease forwards`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", marginBottom: 4 }}>
                    {stat.label.toUpperCase()}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: "var(--text-primary)" }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{stat.unit}</span>
                  </div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: stat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>
                  {stat.icon}
                </div>
              </div>
              <MiniChart data={stat.trend} color={stat.color}/>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Weekly chart */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "24px",
            boxShadow: "var(--shadow)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
                  Weekly Activity
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Minutes studied per day</p>
              </div>
              <div style={{
                padding: "4px 12px", borderRadius: 99,
                background: "var(--neon-subtle)",
                border: "1px solid rgba(181,242,61,0.2)",
                fontSize: 11, fontWeight: 700, color: "var(--neon-dim)",
                fontFamily: "'Syne', sans-serif",
              }}>
                This Week
              </div>
            </div>
            <WeeklyBarChart data={weeklyData}/>
          </div>

          {/* Progress overview */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "24px",
            boxShadow: "var(--shadow)",
          }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              Learning Progress
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Across all active roadmaps</p>

            {cards.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: 100, gap: 12,
              }}>
                <span style={{ fontSize: 32 }}>🗺</span>
                <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center" }}>
                  No roadmaps yet. Start one!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cards.slice(0, 4).map((card, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
                        {card.card_name}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                        {card.progress_percent}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${card.progress_percent}%` }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Overall ring */}
            <div style={{
              marginTop: 20, padding: "14px", borderRadius: 12,
              background: "var(--bg-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="4"/>
                  <circle
                    cx="24" cy="24" r="20"
                    fill="none" stroke="var(--neon)" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - totalProgress / 100)}`}
                    strokeLinecap="round"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11,
                  color: "var(--neon)",
                }}>
                  {totalProgress}%
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                  Overall Progress
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Across {cards.length} active path{cards.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning paths */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="section-dot"/>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20 }}>
                Your Learning Paths
              </h2>
            </div>
            <button
              onClick={() => router.push("/fields")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8,
                background: "var(--neon-subtle)",
                border: "1px solid rgba(181,242,61,0.2)",
                color: "var(--neon-dim)",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(181,242,61,0.18)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--neon-subtle)" }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Roadmap
            </button>
          </div>

          {cards.length === 0 ? (
            <div style={{
              background: "var(--bg-card)", border: "2px dashed var(--border)",
              borderRadius: 20, padding: "48px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 48 }}>🗺</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20 }}>
                No active learning paths yet
              </h3>
              <p style={{ color: "var(--text-muted)", maxWidth: 360 }}>
                Start your first roadmap and get a personalized AI-generated learning path.
              </p>
              <button
                onClick={() => router.push("/fields")}
                className="btn-neon"
                style={{ padding: "12px 28px", borderRadius: 10, fontSize: 15 }}
              >
                Create Your First Roadmap
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {cards.map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 20, padding: "24px",
                    boxShadow: "var(--shadow)",
                    position: "relative", overflow: "hidden",
                    animation: `fadeIn 0.4s ease forwards`,
                    animationDelay: `${i * 0.06}s`,
                    opacity: 0,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--neon)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px var(--neon-glow)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "var(--shadow)"
                  }}
                >
                  {/* Decorative bg */}
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: 100, height: 100, borderRadius: "50%",
                    background: "radial-gradient(circle, var(--neon-subtle) 0%, transparent 70%)",
                    transform: "translate(30px, -30px)",
                    pointerEvents: "none",
                  }}/>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        {card.card_name}
                      </h3>
                      <span style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "3px 8px", borderRadius: 99,
                        background: "var(--bg-2)",
                        border: "1px solid var(--border)",
                        fontSize: 11, fontWeight: 600,
                        color: "var(--text-muted)",
                        fontFamily: "'Syne', sans-serif",
                        textTransform: "capitalize",
                      }}>
                        {card.level}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: 24, color: "var(--neon)",
                    }}>
                      {card.progress_percent}%
                    </div>
                  </div>

                  <div className="progress-bar" style={{ marginBottom: 20 }}>
                    <div className="progress-fill" style={{ width: `${card.progress_percent}%` }}/>
                  </div>

                  <button
                    onClick={() => router.push(`/roadmap/${card.card_id}`)}
                    className="btn-neon"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 10, fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    Continue Learning
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}