// // "use client";

// // import { useEffect, useState, use } from "react";
// // import { get, post } from "../../../lib/api";

// // export default function RoadmapPage({ params }) {

// //   const resolvedParams = use(params);
// //   const cardId = resolvedParams.id;

// //   const [roadmap, setRoadmap] = useState(null);
// //   const [completed, setCompleted] = useState({});
// //   const [activeSession, setActiveSession] = useState(null);

// //   useEffect(() => {

// // 	const token = localStorage.getItem("token")

// // 	get(`/roadmap/${cardId}`, token).then((data) => {

// // 		setRoadmap(data)

// // 		const progress = {}

// // 		data.Topics.forEach(topic => {

// // 			topic.Subtopics.forEach(sub => {

// // 				if(sub.completed){
// // 					progress[sub.id] = true
// // 				}

// // 			})

// // 		})

// // 		setCompleted(progress)

// // 	})

// // }, [cardId])

// //   const handleProgress = async (subtopicId) => {

// //     const token = localStorage.getItem("token");

// //     const newState = !completed[subtopicId];

// //     try {

// //       await post(
// //         "/progress",
// //         {
// //           subtopic_id: subtopicId,
// //           completed: newState
// //         },
// //         token
// //       );

// //       setCompleted((prev) => ({
// //         ...prev,
// //         [subtopicId]: newState
// //       }));

// //     } catch (err) {

// //       console.log("Progress update failed", err);

// //     }

// //   };

// //   const startStudy = async (subtopicId) => {

// //     const token = localStorage.getItem("token");

// //     try {

// //       const res = await post(
// //         "/study-session/start",
// //         {
// //           subtopic_id: subtopicId
// //         },
// //         token
// //       );

// //       setActiveSession(res.session_id);

// //     } catch (err) {

// //       console.log(err);

// //     }

// //   };

// //   const endStudy = async () => {

// //     const token = localStorage.getItem("token");

// //     try {

// //       const res = await post(
// //         "/study-session/end",
// //         {
// //           session_id: activeSession
// //         },
// //         token
// //       );

// //       alert(`Studied ${res.duration_minutes} minutes`);

// //       setActiveSession(null);

// //     } catch (err) {

// //       console.log(err);

// //     }

// //   };

// //   if (!roadmap) {

// //     return <div className="p-10">Loading roadmap...</div>;

// //   }

// //   return (

// //     <div className="p-10">

// //       <h1 className="text-3xl font-bold mb-8">
// //         Learning Roadmap
// //       </h1>

// //       {roadmap.Topics.map((topic) => (

// //         <div key={topic.id} className="mb-8">

// //           <h2 className="text-xl font-semibold mb-4">
// //             {topic.title}
// //           </h2>

// //           <div className="space-y-3">

// //             {topic.Subtopics.map((sub) => (

// //               <div
// //                 key={sub.id}
// //                 className="flex items-center justify-between border p-3 rounded"
// //               >

// //                 <div className="flex items-center gap-3">

// //                   <input
// //                     type="checkbox"
// //                     checked={completed[sub.id] || false}
// //                     onChange={() => handleProgress(sub.id)}
// //                     className="w-4 h-4"
// //                   />

// //                   <span
// //                     className={
// //                       completed[sub.id]
// //                         ? "line-through text-gray-400"
// //                         : ""
// //                     }
// //                   >
// //                     {sub.title}
// //                   </span>

// //                 </div>

// //                 <div>

// //                   {!activeSession && (

// //                     <button
// //                       className="bg-green-500 text-white px-3 py-1 rounded"
// //                       onClick={() => startStudy(sub.id)}
// //                     >
// //                       Start
// //                     </button>

// //                   )}

// //                   {activeSession && (

// //                     <button
// //                       className="bg-red-500 text-white px-3 py-1 rounded"
// //                       onClick={endStudy}
// //                     >
// //                       Stop
// //                     </button>

// //                   )}

// //                 </div>

// //               </div>

// //             ))}

// //           </div>

// //         </div>

// //       ))}

// //     </div>

// //   );

// // }

// "use client";

// import { useEffect, useState, use } from "react";
// import { get, post } from "../../../lib/api";

// export default function RoadmapPage({ params }) {

//   const resolvedParams = use(params);
//   const cardId = resolvedParams.id;

//   const [roadmap, setRoadmap] = useState(null);
//   const [completed, setCompleted] = useState({});
//   const [activeSession, setActiveSession] = useState(null);

//   const [journeyStarted, setJourneyStarted] = useState(false);
//   const [journeyStartTime, setJourneyStartTime] = useState(null);
//   const [journeyTimer, setJourneyTimer] = useState(0);


//   useEffect(() => {

//     const token = localStorage.getItem("token")

//     get(`/roadmap/${cardId}`, token).then((data) => {

//       setRoadmap(data)

//       const progress = {}

//       data.Topics.forEach(topic => {

//         topic.Subtopics.forEach(sub => {

//           if(sub.completed){
//             progress[sub.id] = true
//           }

//         })

//       })

//       setCompleted(progress)

//     })

//   }, [cardId])


//   useEffect(() => {

//     let interval = null

//     if(journeyStarted){

//       interval = setInterval(() => {

//         setJourneyTimer(Math.floor((Date.now() - journeyStartTime)/1000))

//       },1000)

//     }

//     return () => clearInterval(interval)

//   },[journeyStarted, journeyStartTime])


//   const startJourney = () => {

//     setJourneyStarted(true)
//     setJourneyStartTime(Date.now())

//   }


//   const formatTime = (seconds) => {

//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60

//     return `${mins}m ${secs}s`

//   }


//   useEffect(()=>{

//     if(!roadmap) return

//     const totalSubtopics = roadmap.Topics.reduce(
//       (sum,topic)=> sum + topic.Subtopics.length,0
//     )

//     const completedCount = Object.values(completed).filter(Boolean).length

//     if(totalSubtopics > 0 && completedCount === totalSubtopics && journeyStarted){

//       setJourneyStarted(false)

//       alert(`Journey Completed in ${formatTime(journeyTimer)}`)

//     }

//   },[completed])


//   const handleProgress = async (subtopicId) => {

//     const token = localStorage.getItem("token");

//     const newState = !completed[subtopicId];

//     try {

//       await post(
//         "/progress",
//         {
//           subtopic_id: subtopicId,
//           completed: newState
//         },
//         token
//       );

//       setCompleted((prev) => ({
//         ...prev,
//         [subtopicId]: newState
//       }));

//     } catch (err) {

//       console.log("Progress update failed", err);

//     }

//   };


//   const startStudy = async (subtopicId) => {

//     const token = localStorage.getItem("token");

//     try {

//       const res = await post(
//         "/study-session/start",
//         {
//           subtopic_id: subtopicId
//         },
//         token
//       );

//       setActiveSession(res.session_id);

//     } catch (err) {

//       console.log(err);

//     }

//   };


//   const endStudy = async () => {

//     const token = localStorage.getItem("token");

//     try {

//       const res = await post(
//         "/study-session/end",
//         {
//           session_id: activeSession
//         },
//         token
//       );

//       alert(`Studied ${res.duration_minutes} minutes`);

//       setActiveSession(null);

//     } catch (err) {

//       console.log(err);

//     }

//   };


//   if (!roadmap) {

//     return <div className="p-10">Loading roadmap...</div>;

//   }


//   return (

//     <div className="p-10">

//       <div className="flex justify-between items-center mb-8">

//         <h1 className="text-3xl font-bold">
//           Learning Roadmap
//         </h1>

//         <div className="flex items-center gap-4">

//           {journeyStarted && (
//             <div className="text-lg font-semibold">
//               ⏱ {formatTime(journeyTimer)}
//             </div>
//           )}

//           {!journeyStarted && (
//             <button
//               onClick={startJourney}
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Start Your Journey
//             </button>
//           )}

//         </div>

//       </div>


//       {roadmap.Topics.map((topic) => (

//         <div key={topic.id} className="mb-8">

//           <h2 className="text-xl font-semibold mb-4">
//             {topic.title}
//           </h2>

//           <div className="space-y-3">

//             {topic.Subtopics.map((sub) => (

//               <div
//                 key={sub.id}
//                 className="flex items-center justify-between border p-3 rounded"
//               >

//                 <div className="flex items-center gap-3">

//                   <input
//                     type="checkbox"
//                     checked={completed[sub.id] || false}
//                     onChange={() => handleProgress(sub.id)}
//                     className="w-4 h-4"
//                   />

//                   <span
//                     className={
//                       completed[sub.id]
//                         ? "line-through text-gray-400"
//                         : ""
//                     }
//                   >
//                     {sub.title}
//                   </span>

//                 </div>

//                 <div>

//                   {!activeSession && (

//                     <button
//                       className="bg-green-500 text-white px-3 py-1 rounded"
//                       onClick={() => startStudy(sub.id)}
//                     >
//                       Start
//                     </button>

//                   )}

//                   {activeSession && (

//                     <button
//                       className="bg-red-500 text-white px-3 py-1 rounded"
//                       onClick={endStudy}
//                     >
//                       Stop
//                     </button>

//                   )}

//                 </div>

//               </div>

//             ))}

//           </div>

//         </div>

//       ))}

//     </div>

//   );

// }
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { get, post } from "../../../lib/api"
import SidebarLayout from "../../../components/SidebarLayout"

export default function RoadmapPage() {
  const params = useParams()
  const cardId = params.id
  const router = useRouter()

  const [roadmap, setRoadmap] = useState(null)
  const [completed, setCompleted] = useState({})
  const [activeSession, setActiveSession] = useState(null)
  const [activeSubtopic, setActiveSubtopic] = useState(null)
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [journeyStartTime, setJourneyStartTime] = useState(null)
  const [journeyTimer, setJourneyTimer] = useState(0)
  const [expandedTopics, setExpandedTopics] = useState({})

  useEffect(() => {
    const token = localStorage.getItem("token")
    get(`/roadmap/${cardId}`, token).then((data) => {
      setRoadmap(data)
      const progress = {}
      const expanded = {}
      data.Topics?.forEach(topic => {
        expanded[topic.id] = true
        topic.Subtopics?.forEach(sub => {
          if (sub.completed) progress[sub.id] = true
        })
      })
      setCompleted(progress)
      setExpandedTopics(expanded)
    })
  }, [cardId])

  useEffect(() => {
    let interval = null
    if (journeyStarted) {
      interval = setInterval(() => {
        setJourneyTimer(Math.floor((Date.now() - journeyStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [journeyStarted, journeyStartTime])

  useEffect(() => {
    if (!roadmap) return
    const total = roadmap.Topics?.reduce((s, t) => s + (t.Subtopics?.length || 0), 0) || 0
    const done = Object.values(completed).filter(Boolean).length
    if (total > 0 && done === total && journeyStarted) {
      setJourneyStarted(false)
      setTimeout(() => {
        alert(`🎉 Journey Completed in ${formatTime(journeyTimer)}! Amazing work!`)
      }, 300)
    }
  }, [completed])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}h ${m}m ${sec}s`
    return `${m}m ${sec}s`
  }

  const startJourney = () => {
    setJourneyStarted(true)
    setJourneyStartTime(Date.now())
  }

  const handleProgress = async (subtopicId) => {
    const token = localStorage.getItem("token")
    const newState = !completed[subtopicId]
    try {
      await post("/progress", { subtopic_id: subtopicId, completed: newState }, token)
      setCompleted(prev => ({ ...prev, [subtopicId]: newState }))
    } catch (err) {
      console.log("Progress update failed", err)
    }
  }

  const startStudy = async (subtopicId) => {
    const token = localStorage.getItem("token")
    try {
      const res = await post("/study-session/start", { subtopic_id: subtopicId }, token)
      setActiveSession(res.session_id)
      setActiveSubtopic(subtopicId)
    } catch (err) { console.log(err) }
  }

  const endStudy = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await post("/study-session/end", { session_id: activeSession }, token)
      setActiveSession(null)
      setActiveSubtopic(null)
      const toast = document.createElement("div")
      toast.style.cssText = `
        position:fixed;bottom:24px;right:24px;z-index:9999;
        background:#b5f23d;color:#0d1008;padding:14px 20px;
        border-radius:12px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;
        box-shadow:0 8px 24px rgba(181,242,61,0.4);
        animation:fadeIn 0.3s ease;
      `
      toast.textContent = `✅ Studied ${res.duration_minutes} minutes!`
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)
    } catch (err) { console.log(err) }
  }

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }))
  }

  if (!roadmap) {
    return (
      <SidebarLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "3px solid var(--neon-subtle)",
            borderTopColor: "var(--neon)",
            animation: "spin-slow 1s linear infinite",
          }}/>
          <p style={{ color: "var(--text-muted)" }}>Loading your roadmap...</p>
        </div>
      </SidebarLayout>
    )
  }

  const totalSubtopics = roadmap.Topics?.reduce((s, t) => s + (t.Subtopics?.length || 0), 0) || 0
  const completedCount = Object.values(completed).filter(Boolean).length
  const overallProgress = totalSubtopics > 0 ? Math.round((completedCount / totalSubtopics) * 100) : 0

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 20, padding: 0,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 36px)", marginBottom: 8 }}>
                Learning Roadmap
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                  {completedCount} of {totalSubtopics} subtopics completed
                </span>
                <span style={{
                  padding: "3px 10px", borderRadius: 99,
                  background: "var(--neon-subtle)",
                  border: "1px solid rgba(181,242,61,0.2)",
                  fontSize: 12, fontWeight: 700,
                  color: "var(--neon-dim)",
                  fontFamily: "'Syne', sans-serif",
                }}>
                  {overallProgress}%
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {journeyStarted && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 16px", borderRadius: 10,
                  background: "var(--neon-subtle)",
                  border: "1px solid rgba(181,242,61,0.3)",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", animation: "pulse-neon 1s infinite" }}/>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--neon-dim)" }}>
                    {formatTime(journeyTimer)}
                  </span>
                </div>
              )}
              {!journeyStarted && (
                <button
                  onClick={startJourney}
                  className="btn-neon"
                  style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14 }}
                >
                  ▶ Start Journey
                </button>
              )}
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={{ marginTop: 20 }}>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${overallProgress}%` }}/>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {roadmap.Topics?.map((topic, ti) => {
            const topicCompleted = topic.Subtopics?.filter(s => completed[s.id]).length || 0
            const topicTotal = topic.Subtopics?.length || 0
            const topicPct = topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0
            const isExpanded = expandedTopics[topic.id]

            return (
              <div
                key={topic.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  animation: `fadeIn 0.4s ease forwards`,
                  animationDelay: `${ti * 0.06}s`,
                  opacity: 0,
                }}
              >
                {/* Topic header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  style={{
                    width: "100%", padding: "20px 24px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: topicPct === 100 ? "var(--neon)" : "var(--neon-subtle)",
                    border: `1.5px solid ${topicPct === 100 ? "var(--neon)" : "rgba(181,242,61,0.2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {topicPct === 100 ? (
                      <svg width="16" height="16" fill="none" stroke="#0d1008" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : (
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "var(--neon-dim)" }}>
                        {ti + 1}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
                      {topic.title}
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 3, background: "var(--border)", borderRadius: 2, maxWidth: 120 }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          width: `${topicPct}%`,
                          background: "var(--neon)",
                          transition: "width 0.4s ease",
                        }}/>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif" }}>
                        {topicCompleted}/{topicTotal}
                      </span>
                    </div>
                  </div>

                  <svg
                    width="18" height="18" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {/* Subtopics */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "12px 24px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {topic.Subtopics?.map((sub) => {
                        const isDone = completed[sub.id] || false
                        const isStudying = activeSubtopic === sub.id

                        return (
                          <div
                            key={sub.id}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "12px 16px",
                              borderRadius: 12,
                              background: isDone ? "var(--neon-subtle)" : isStudying ? "rgba(74,158,245,0.06)" : "var(--bg-2)",
                              border: `1.5px solid ${isDone ? "rgba(181,242,61,0.2)" : isStudying ? "rgba(74,158,245,0.2)" : "transparent"}`,
                              transition: "all 0.2s",
                            }}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => handleProgress(sub.id)}
                              style={{
                                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                border: `2px solid ${isDone ? "var(--neon)" : "var(--border-strong)"}`,
                                background: isDone ? "var(--neon)" : "transparent",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                            >
                              {isDone && (
                                <svg width="12" height="12" fill="none" stroke="#0d1008" strokeWidth="3" viewBox="0 0 24 24">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              )}
                            </button>

                            {/* Title */}
                            <span style={{
                              flex: 1, fontSize: 14,
                              color: isDone ? "var(--text-muted)" : "var(--text-primary)",
                              textDecoration: isDone ? "line-through" : "none",
                              fontFamily: "'DM Sans', sans-serif",
                              transition: "all 0.2s",
                            }}>
                              {sub.title}
                            </span>

                            {/* Study button */}
                            {isStudying ? (
                              <button
                                onClick={endStudy}
                                style={{
                                  display: "flex", alignItems: "center", gap: 6,
                                  padding: "6px 12px", borderRadius: 8,
                                  background: "rgba(224,82,82,0.1)",
                                  border: "1px solid rgba(224,82,82,0.25)",
                                  color: "#e05252",
                                  cursor: "pointer",
                                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12,
                                  transition: "all 0.2s",
                                  animation: "pulse-neon 1.5s infinite",
                                }}
                              >
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e05252", animation: "pulse-neon 1s infinite" }}/>
                                Stop
                              </button>
                            ) : !activeSession ? (
                              <button
                                onClick={() => startStudy(sub.id)}
                                style={{
                                  display: "flex", alignItems: "center", gap: 6,
                                  padding: "6px 12px", borderRadius: 8,
                                  background: "var(--neon-subtle)",
                                  border: "1px solid rgba(181,242,61,0.2)",
                                  color: "var(--neon-dim)",
                                  cursor: "pointer",
                                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12,
                                  transition: "all 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(181,242,61,0.2)"}
                                onMouseLeave={e => e.currentTarget.style.background = "var(--neon-subtle)"}
                              >
                                ▶ Study
                              </button>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </SidebarLayout>
  )
}