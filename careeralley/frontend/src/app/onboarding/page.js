// "use client";

// import { useEffect, useState } from "react";
// import { get, post } from "../../lib/api";
// import { useRouter } from "next/navigation";

// export default function OnboardingPage() {

//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const router = useRouter();

//   useEffect(() => {

//     const token = localStorage.getItem("token");

//     get("/onboarding-questions", token).then(setQuestions);

//   }, []);

//   const selectOption = (questionId, optionId) => {

//     setAnswers({
//       ...answers,
//       [questionId]: optionId
//     });

//   };

//   const submitAnswers = async () => {

//     const token = localStorage.getItem("token");

//     const formatted = Object.entries(answers).map(([q, o]) => ({
//       question_id: Number(q),
//       option_id: o
//     }));

//     await post("/onboarding-answers", { answers: formatted }, token);

//     router.push("/fields");

//   };

//   if (!questions.length) {
//     return <div className="p-10">Loading...</div>;
//   }

//   return (
//     <div className="p-10">

//       <h1 className="text-3xl mb-8">Tell us about yourself</h1>

//       {questions.map(q => (
//         <div key={q.id} className="mb-6">

//           <h2 className="mb-3">{q.question}</h2>

//           {q.options.map(opt => {

//             const selected = answers[q.id] === opt.id;

//             return (
//               <div
//                 key={opt.id}
//                 onClick={() => selectOption(q.id, opt.id)}
//                 className={`border p-3 mb-2 cursor-pointer
//                 ${selected ? "bg-blue-500 text-white" : ""}`}
//               >
//                 {opt.text}
//               </div>
//             );

//           })}

//         </div>
//       ))}

//       <button
//         onClick={submitAnswers}
//         className="bg-blue-500 text-white px-4 py-2"
//       >
//         Continue
//       </button>

//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import { get, post } from "../../lib/api"
import { useRouter } from "next/navigation"
import { useTheme } from "../../lib/ThemeContext"

export default function OnboardingPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState("forward")
  const [visible, setVisible] = useState(true)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem("token")
    get("/onboarding-questions", token).then(setQuestions)
  }, [])

  const currentQ = questions[currentIndex]
  const total = questions.length
  const progress = total > 0 ? ((currentIndex) / total) * 100 : 0
  const isAnswered = currentQ ? answers[currentQ.id] !== undefined : false
  const isLast = currentIndex === total - 1

  const navigate = (dir) => {
    setDirection(dir)
    setVisible(false)
    setTimeout(() => {
      if (dir === "forward" && currentIndex < total - 1) {
        setCurrentIndex(i => i + 1)
      } else if (dir === "backward" && currentIndex > 0) {
        setCurrentIndex(i => i - 1)
      }
      setVisible(true)
    }, 250)
  }

  const selectOption = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
    // Auto-advance after a brief delay
    if (!isLast) {
      setTimeout(() => navigate("forward"), 400)
    }
  }

  const submitAnswers = async () => {
    const token = localStorage.getItem("token")
    const formatted = Object.entries(answers).map(([q, o]) => ({
      question_id: Number(q),
      option_id: o,
    }))
    await post("/onboarding-answers", { answers: formatted }, token)
    router.push("/fields")
  }

  if (!questions.length) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTopColor: "var(--neon)",
            animation: "spin-slow 1s linear infinite",
            margin: "0 auto 16px",
          }}/>
          <p style={{ color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Loading your questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG */}
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse at 30% 20%, rgba(181,242,61,0.08) 0%, transparent 60%)",
        pointerEvents: "none",
      }}/>

      {/* Header */}
      <div style={{
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "var(--neon)" }}>
          CareerAlley
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
            {currentIndex + 1} of {total}
          </span>
          <button onClick={toggleTheme} style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1.5px solid var(--border-strong)",
            background: "var(--bg-card)", color: "var(--neon-dim)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {theme === "dark" ? (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--border)", position: "relative" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${((currentIndex + (isAnswered ? 1 : 0)) / total) * 100}%`,
          background: "linear-gradient(90deg, #8fbe2a, #b5f23d)",
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
          borderRadius: "0 2px 2px 0",
        }}/>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 600,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(0)"
            : direction === "forward" ? "translateX(30px)" : "translateX(-30px)",
          transition: "all 0.25s ease",
        }}>
          {/* Step indicator dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 36, justifyContent: "center" }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: i === currentIndex ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i < currentIndex
                  ? "var(--neon)"
                  : i === currentIndex
                  ? "var(--neon)"
                  : "var(--border)",
                transition: "all 0.3s ease",
                boxShadow: i === currentIndex ? "0 0 8px var(--neon-glow)" : "none",
              }}/>
            ))}
          </div>

          {/* Question */}
          <div style={{ marginBottom: 12 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: "1.5px",
              color: "var(--neon-dim)", textTransform: "uppercase",
              fontFamily: "'Syne', sans-serif",
            }}>
              Question {currentIndex + 1}
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px, 4vw, 32px)",
            lineHeight: 1.2,
            marginBottom: 36,
            color: "var(--text-primary)",
          }}>
            {currentQ.question}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentQ.options.map((opt, i) => {
              const selected = answers[currentQ.id] === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(currentQ.id, opt.id)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: `2px solid ${selected ? "var(--neon)" : "var(--border)"}`,
                    background: selected
                      ? "var(--neon-subtle)"
                      : "var(--bg-card)",
                    color: selected ? "var(--neon-dim)" : "var(--text-primary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                    width: "100%",
                    transition: "all 0.2s ease",
                    transform: "translateX(0)",
                    boxShadow: selected ? "0 0 0 1px var(--neon), 0 4px 16px var(--neon-glow)" : "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 16,
                    fontWeight: selected ? 600 : 400,
                  }}
                  onMouseEnter={e => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = "var(--border-strong)"
                      e.currentTarget.style.transform = "translateX(4px)"
                    }
                  }}
                  onMouseLeave={e => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = "var(--border)"
                      e.currentTarget.style.transform = "translateX(0)"
                    }
                  }}
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
                    ) : String.fromCharCode(65 + i)}
                  </div>
                  {opt.text}
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 36,
          }}>
            <button
              onClick={() => navigate("backward")}
              disabled={currentIndex === 0}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: currentIndex === 0 ? "var(--text-muted)" : "var(--text-secondary)",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
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
                Continue to Career Selection
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={() => navigate("forward")}
                disabled={!isAnswered}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 10,
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
    </div>
  )
}