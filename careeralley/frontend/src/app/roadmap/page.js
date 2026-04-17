// "use client"

// import { useEffect, useState } from "react"
// import { get } from "../../lib/api"
// import { useRouter } from "next/navigation"
// import SidebarLayout from "../../components/SidebarLayout"

// export default function FieldsPage() {
//   const [fields, setFields] = useState([])
//   const [hoveredId, setHoveredId] = useState(null)
//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     get("/fields", token).then(data => setFields(data || []))
//   }, [])

//   const selectField = (field) => {
//     router.push(`/cards?field=${encodeURIComponent(field.name)}`)
//   }

//   if (!fields.length) {
//     return (
//       <SidebarLayout>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
//           <div style={{ textAlign: "center" }}>
//             <div style={{
//               width: 48, height: 48, borderRadius: "50%",
//               border: "3px solid var(--border)",
//               borderTopColor: "var(--neon)",
//               animation: "spin-slow 1s linear infinite",
//               margin: "0 auto 16px",
//             }}/>
//             <p style={{ color: "var(--text-muted)" }}>Loading fields...</p>
//           </div>
//         </div>
//       </SidebarLayout>
//     )
//   }

//   return (
//     <SidebarLayout>
//       <div style={{ maxWidth: 900, margin: "0 auto" }}>
//         {/* Header */}
//         <div style={{ marginBottom: 40 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//             <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }}/>
//             <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
//               New Roadmap
//             </span>
//           </div>
//           <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", marginBottom: 12 }}>
//             Choose Your Field
//           </h1>
//           <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
//             Select the domain you want to explore. We'll help you find the right career path within it.
//           </p>
//         </div>

//         {/* Grid */}
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//           gap: 18,
//         }}>
//           {fields.map((field, i) => {
//             const isHovered = hoveredId === field.id
//             return (
//               <button
//                 key={field.id}
//                 onClick={() => selectField(field)}
//                 onMouseEnter={() => setHoveredId(field.id)}
//                 onMouseLeave={() => setHoveredId(null)}
//                 style={{
//                   background: "var(--bg-card)",
//                   border: `2px solid ${isHovered ? "var(--neon)" : "var(--border)"}`,
//                   borderRadius: 20,
//                   padding: "28px 24px",
//                   cursor: "pointer",
//                   textAlign: "left",
//                   transition: "all 0.2s ease",
//                   transform: isHovered ? "translateY(-4px)" : "translateY(0)",
//                   boxShadow: isHovered ? "0 12px 32px var(--neon-glow)" : "var(--shadow)",
//                   animation: `fadeIn 0.4s ease forwards`,
//                   animationDelay: `${i * 0.05}s`,
//                   opacity: 0,
//                 }}
//               >
//                 <div style={{
//                   width: 56, height: 56, borderRadius: 16,
//                   background: isHovered ? "var(--neon-subtle)" : "var(--bg-2)",
//                   border: `1.5px solid ${isHovered ? "rgba(181,242,61,0.3)" : "var(--border)"}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: 28, marginBottom: 18,
//                   transition: "all 0.2s",
//                 }}>
//                   {field.icon}
//                 </div>
//                 <h2 style={{
//                   fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17,
//                   color: isHovered ? "var(--neon-dim)" : "var(--text-primary)",
//                   marginBottom: 8, transition: "color 0.2s",
//                 }}>
//                   {field.name}
//                 </h2>
//                 <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
//                   {field.description}
//                 </p>
//                 {isHovered && (
//                   <div style={{
//                     marginTop: 16, display: "flex", alignItems: "center", gap: 6,
//                     color: "var(--neon-dim)", fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif",
//                   }}>
//                     Explore paths
//                     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                       <path d="M5 12h14M12 5l7 7-7 7"/>
//                     </svg>
//                   </div>
//                 )}
//               </button>
//             )
//           })}
//         </div>
//       </div>
//     </SidebarLayout>
//   )
// }

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RoadmapIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [])

  return null
}