// "use client"

// import { useEffect,useState } from "react"
// import { useRouter,useSearchParams } from "next/navigation"
// import { get } from "../../lib/api"

// export default function CardsPage(){

//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const field = searchParams.get("field")

//   const [cards,setCards] = useState([])

//   useEffect(()=>{

//     const loadCards = async ()=>{

//       const data = await get("/career-cards")

//       if(data){

//         const filtered = data.filter(c=>c.field===field)

//         setCards(filtered)

//       }

//     }

//     loadCards()

//   },[field])


//   const selectCard = (card)=>{

//     router.push(`/card-questions/${card.id}`)

//   }


//   return(

//     <div className="p-10">

//       <h1 className="text-3xl font-bold mb-6">
//         Choose your career path
//       </h1>

//       <div className="grid grid-cols-3 gap-6">

//         {cards.map(card=>(

//           <div
//             key={card.id}
//             onClick={()=>selectCard(card)}
//             className="border rounded-lg p-6 cursor-pointer hover:bg-gray-100"
//           >

//             <div className="text-3xl mb-2">
//               {card.icon}
//             </div>

//             <h2 className="font-bold">
//               {card.name}
//             </h2>

//             <p className="text-sm text-gray-600">
//               {card.description}
//             </p>

//           </div>

//         ))}

//       </div>

//     </div>

//   )

// }
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { get } from "../../lib/api"
import SidebarLayout from "../../components/SidebarLayout"

export default function CardsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const field = searchParams.get("field")

  const [cards, setCards] = useState([])
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    const loadCards = async () => {
      const token = localStorage.getItem("token")
      const data = await get("/career-cards", token)
      if (data) {
        setCards(data.filter(c => c.field === field))
      }
    }
    loadCards()
  }, [field])

  const selectCard = (card) => {
    router.push(`/card-questions/${card.id}`)
  }

  if (!cards.length) {
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
            <p style={{ color: "var(--text-muted)" }}>Loading careers...</p>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: "var(--text-muted)" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Fields
          </button>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{field}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
              {field}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 38px)", marginBottom: 12 }}>
            Choose Your Career Path
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Pick a specific role. We'll assess your level and generate a personalized roadmap.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 18,
        }}>
          {cards.map((card, i) => {
            const isHovered = hoveredId === card.id
            return (
              <button
                key={card.id}
                onClick={() => selectCard(card)}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: "var(--bg-card)",
                  border: `2px solid ${isHovered ? "var(--neon)" : "var(--border)"}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 12px 32px var(--neon-glow)" : "var(--shadow)",
                  animation: `fadeIn 0.4s ease forwards`,
                  animationDelay: `${i * 0.06}s`,
                  opacity: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isHovered && (
                  <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0,
                    width: "40%",
                    background: "linear-gradient(90deg, transparent, rgba(181,242,61,0.04))",
                    pointerEvents: "none",
                  }}/>
                )}
                <div style={{
                  width: 58, height: 58, borderRadius: 16,
                  background: isHovered ? "linear-gradient(135deg, rgba(181,242,61,0.15), rgba(181,242,61,0.05))" : "var(--bg-2)",
                  border: `1.5px solid ${isHovered ? "rgba(181,242,61,0.3)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, marginBottom: 18,
                  transition: "all 0.2s",
                }}>
                  {card.icon}
                </div>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17,
                  color: isHovered ? "var(--neon-dim)" : "var(--text-primary)",
                  marginBottom: 8, transition: "color 0.2s",
                }}>
                  {card.name}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                  {card.description}
                </p>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: isHovered ? "var(--neon-dim)" : "var(--text-muted)",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif",
                  transition: "color 0.2s",
                }}>
                  Start this path
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </SidebarLayout>
  )
}