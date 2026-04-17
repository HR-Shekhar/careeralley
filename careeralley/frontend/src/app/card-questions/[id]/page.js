// "use client"

// import { useEffect,useState } from "react"
// import { useParams,useRouter } from "next/navigation"
// import { get,post } from "../../../lib/api"

// export default function CardQuestionsPage(){

//   const params = useParams()
//   const router = useRouter()

//   const cardId = params.id

//   const [questions,setQuestions] = useState([])
//   const [answers,setAnswers] = useState({})

//   useEffect(()=>{

//     const loadQuestions = async ()=>{

//       const token = localStorage.getItem("token")

//       const data = await get(`/ai-card-questions/${cardId}`,token)

//       if(data && data.questions){
//         setQuestions(data.questions)
//       }

//     }

//     loadQuestions()

//   },[cardId])


//   const selectOption = (qIndex,level)=>{

//     setAnswers({
//       ...answers,
//       [qIndex]:level
//     })

//   }


//   const submitAnswers = async ()=>{

//   let score={
//     beginner:0,
//     intermediate:0,
//     advanced:0
//   }

//   const answerTexts=[]

//   questions.forEach((q,i)=>{

//     const level=answers[i]

//     if(level){
//       score[level]++
//       answerTexts.push(q.question + " -> " + level)
//     }

//   })

//   let level="beginner"

//   if(score.advanced>=2) level="advanced"
//   else if(score.intermediate>=2) level="intermediate"

//   const token = localStorage.getItem("token")

//   await post(
//     "/generate-roadmap",
//     {
//       card_id:parseInt(cardId),
//       level:level,
//       answers:answerTexts
//     },
//     token
//   )

//   router.push(`/roadmap/${cardId}`)

// }


//   if(questions.length===0){
//     return <div className="p-10">Generating AI questions...</div>
//   }


//   return(

//     <div className="p-10 max-w-2xl mx-auto">

//       <h1 className="text-3xl font-bold mb-6">
//         Skill Assessment
//       </h1>

//       {questions.map((q,i)=>(

//         <div key={i} className="mb-8">

//           <h2 className="text-lg font-semibold mb-3">
//             {q.question}
//           </h2>

//           {q.options.map((opt,j)=>(

//             <div
//               key={j}
//               onClick={()=>selectOption(i,opt.level)}
//               className={`p-3 border rounded mb-2 cursor-pointer 
//               ${answers[i]===opt.level ? "bg-blue-200 border-blue-500" : "hover:bg-gray-100"}`}
//             >
//               {opt.text}
//             </div>

//           ))}

//         </div>

//       ))}

//       <button
//         onClick={submitAnswers}
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//       >
//         Generate Roadmap
//       </button>

//     </div>

//   )

// }
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { get, post } from "../../../lib/api"
import SidebarLayout from "../../../components/SidebarLayout"

export default function CardQuestionsPage() {
  const params = useParams()
  const router = useRouter()
  const cardId = params.id

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [direction, setDirection] = useState("forward")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadQuestions = async () => {
      const token = localStorage.getItem("token")
      const data = await get(`/ai-card-questions/${cardId}`, token)
      if (data && data.questions) {
        setQuestions(data.questions)
      }
    }
    loadQuestions()
  }, [cardId])

  const selectOption = (qIndex, level) => {
    setAnswers({ ...answers, [qIndex]: level })
    if (qIndex < questions.length - 1) {
      setTimeout(() => navigate("forward"), 400)
    }
  }

const submitAnswers = async () => {
  setLoading(true)

  let score = { beginner: 0, intermediate: 0, advanced: 0 }
  const answerTexts = []

  questions.forEach((q, i) => {
    const level = answers[i]
    if (level) {
      score[level]++
      answerTexts.push(q.question + " -> " + level)
    }
  })

  let level = "beginner"
  if (score.advanced >= 2) level = "advanced"
  else if (score.intermediate >= 2) level = "intermediate"

  const token = localStorage.getItem("token")

  // 🔍 DEBUG
  console.log("=== SUBMIT DEBUG ===")
  console.log("token:", token)
  console.log("cardId:", cardId)
  console.log("level:", level)
  console.log("answers:", answers)
  console.log("answerTexts:", answerTexts)
  console.log("payload:", { card_id: parseInt(cardId), level, answers: answerTexts })
  console.log("====================")

  try {
    const res = await post(
      "/generate-roadmap",
      {
        card_id: parseInt(cardId),
        level: level,
        answers: answerTexts,
      },
      token
    )
    console.log("generate-roadmap response:", res)
    router.push(`/roadmap/${cardId}`)
  } catch (err) {
    console.error("generate-roadmap error:", err)
    setLoading(false)
  }
}

  const navigate = (dir) => {
    setDirection(dir)
    setVisible(false)
    setTimeout(() => {
      if (dir === "forward" && currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1)
      } else if (dir === "backward" && currentIndex > 0) {
        setCurrentIndex(i => i - 1)
      }
      setVisible(true)
    }, 250)
  }

  const currentQ = questions[currentIndex]
  const total = questions.length
  const isAnswered = answers[currentIndex] !== undefined
  const isLast = currentIndex === total - 1

  if (questions.length === 0) {
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
            <p style={{ color: "var(--text-muted)" }}>Generating AI questions...</p>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (loading) {
    return (
      <SidebarLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh", flexDirection: "column", gap: 20 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "3px solid var(--neon-subtle)",
            }}/>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "3px solid transparent",
              borderTopColor: "var(--neon)",
              animation: "spin-slow 1s linear infinite",
            }}/>
            <div style={{
              position: "absolute", inset: "10px",
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "rgba(181,242,61,0.4)",
              animation: "spin-slow 0.7s linear infinite reverse",
            }}/>
          </div>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8, color: "var(--neon)" }}>
              Generating Your Roadmap
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Our AI is crafting a personalized learning path for you...
            </p>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
              Skill Assessment
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {currentIndex + 1} / {total}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / total) * 100}%` }}/>
          </div>
        </div>

        {/* Question card */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(0)"
            : direction === "forward" ? "translateX(30px)" : "translateX(-30px)",
          transition: "all 0.25s ease",
        }}>

          {/* Step dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32, justifyContent: "center" }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: i === currentIndex ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i <= currentIndex ? "var(--neon)" : "var(--border)",
                transition: "all 0.3s ease",
                boxShadow: i === currentIndex ? "0 0 8px var(--neon-glow)" : "none",
              }}/>
            ))}
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(20px, 3.5vw, 30px)",
            lineHeight: 1.25, marginBottom: 32,
          }}>
            {currentQ.question}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentQ.options.map((opt, j) => {
              const selected = answers[currentIndex] === opt.level
              return (
                <button
                  key={j}
                  onClick={() => selectOption(currentIndex, opt.level)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: `2px solid ${selected ? "var(--neon)" : "var(--border)"}`,
                    background: selected ? "var(--neon-subtle)" : "var(--bg-card)",
                    color: selected ? "var(--neon-dim)" : "var(--text-primary)",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                    textAlign: "left", width: "100%",
                    transition: "all 0.2s ease",
                    boxShadow: selected ? "0 0 0 1px var(--neon), 0 4px 16px var(--neon-glow)" : "none",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                    fontWeight: selected ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = "var(--border-strong)" }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = "var(--border)" }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: selected ? "rgba(181,242,61,0.2)" : "var(--bg-2)",
                    border: `1.5px solid ${selected ? "var(--neon)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12,
                    color: selected ? "var(--neon)" : "var(--text-muted)",
                    transition: "all 0.2s",
                  }}>
                    {selected ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : String.fromCharCode(65 + j)}
                  </div>
                  {opt.text}
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32 }}>
            <button
              onClick={() => navigate("backward")}
              disabled={currentIndex === 0}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                opacity: currentIndex === 0 ? 0.4 : 1,
                transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>

            {isLast ? (
              <button
                onClick={submitAnswers}
                disabled={!isAnswered}
                className="btn-neon"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 10, fontSize: 15,
                  opacity: !isAnswered ? 0.5 : 1,
                  cursor: !isAnswered ? "not-allowed" : "pointer",
                }}
              >
                Generate My Roadmap ✨
              </button>
            ) : (
              <button
                onClick={() => navigate("forward")}
                disabled={!isAnswered}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 10,
                  background: isAnswered ? "var(--neon)" : "var(--border)",
                  color: isAnswered ? "#0d1008" : "var(--text-muted)",
                  border: "none",
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                  cursor: !isAnswered ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                Next
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}