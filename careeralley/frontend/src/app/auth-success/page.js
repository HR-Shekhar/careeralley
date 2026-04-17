// "use client"

// import { useSearchParams } from "next/navigation"
// import { useEffect } from "react"
// import { useRouter } from "next/navigation"

// export default function AuthSuccess(){

//   const params = useSearchParams()
//   const router = useRouter()

//   useEffect(()=>{

//     const token = params.get("token")
//     const onboarded = params.get("onboarded")

//     if(token){
//       localStorage.setItem("token",token)
//     }

//     if(onboarded === "true"){
//       router.push("/dashboard")
//     }else{
//       router.push("/onboarding")
//     }

//   },[])

//   return <div className="p-10">Signing you in...</div>

// }

"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthSuccess() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = params.get("token")
    const onboarded = params.get("onboarded")
    if (token) localStorage.setItem("token", token)
    router.push("/dashboard")
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      flexDirection: "column",
      gap: 20,
    }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "3px solid rgba(181,242,61,0.15)",
        }}/>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "3px solid transparent",
          borderTopColor: "#b5f23d",
          animation: "spin-slow 1s linear infinite",
        }}/>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--neon)" }}>
          Signing you in...
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
          Just a moment
        </p>
      </div>
    </div>
  )
}
