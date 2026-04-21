// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { post } from "../../lib/api"

// export default function LoginPage(){

//   const router = useRouter()

//   const [email,setEmail] = useState("")
//   const [password,setPassword] = useState("")
//   const [error,setError] = useState("")

//   const handleLogin = async(e)=>{

//     e.preventDefault()

//     try{

//       const res = await post("/login",{
//         email,
//         password
//       })

//       localStorage.setItem("token",res.token)

//       if(res.onboarded){
//         router.push("/dashboard")
//       }else{
//         router.push("/onboarding")
//       }

//     }catch(err){

//       setError("Login failed")

//     }

//   }


//   const googleLogin = ()=>{

//     window.location.href = "http://localhost:8080/auth/google"

//   }


//   return(

//     <div className="flex items-center justify-center min-h-screen">

//       <div className="border p-8 rounded w-96">

//         <h1 className="text-2xl font-bold mb-6">
//           Login
//         </h1>

//         <form onSubmit={handleLogin} className="space-y-4">

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e)=>setEmail(e.target.value)}
//             className="border p-2 w-full rounded"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e)=>setPassword(e.target.value)}
//             className="border p-2 w-full rounded"
//           />

//           {error && (
//             <p className="text-red-500 text-sm">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded"
//           >
//             Login
//           </button>

//         </form>


//         <button
//           onClick={googleLogin}
//           className="w-full border mt-4 py-2 rounded"
//         >
//           Sign in with Google
//         </button>


//         <p className="mt-6 text-sm text-center">

//           Don't have an account?{" "}

//           <Link
//             href="/signup"
//             className="text-blue-600"
//           >
//             Sign up
//           </Link>

//         </p>

//       </div>

//     </div>

//   )

// }
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { post } from "../../lib/api"
import { useTheme } from "../../lib/ThemeContext"

export default function LoginPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await post("/login", { email, password })
      localStorage.setItem("token", res.token)
      router.push(res.onboarded ? "/dashboard" : "/onboarding")
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google"
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background effects */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: theme === "dark"
          ? "radial-gradient(ellipse at 20% 50%, rgba(181,242,61,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(143,190,42,0.04) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(181,242,61,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(143,190,42,0.1) 0%, transparent 50%)",
        pointerEvents: "none",
      }}/>

      {/* Left panel */}
      <div style={{
        display: "none",
        flex: 1,
        background: "#0a0e05",
        padding: "48px",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        '@media(minWidth:900px)': { display: "flex" },
      }}
      className="login-left">
        {/* Decorative */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,242,61,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}/>
        <div style={{
          position: "absolute", bottom: "10%", left: "-60px",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,242,61,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}/>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008"/>
              <path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#b5f23d" }}>
            CareerAlley
          </span>
        </div>

        <div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 4vw, 48px)", color: "#e8f0d0",
            lineHeight: 1.1, marginBottom: 20,
          }}>
            Navigate your<br/>
            <span style={{
              background: "linear-gradient(135deg, #b5f23d, #e8f500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              learning journey
            </span>
          </h2>
          <p style={{ color: "rgba(181,242,61,0.5)", fontSize: 16, lineHeight: 1.7 }}>
            AI-generated roadmaps tailored to your goals. Track progress, study smarter, level up faster.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["Personalized career roadmaps", "Progress tracking & analytics", "AI-powered question system"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "rgba(181,242,61,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="10" height="10" fill="none" stroke="#b5f23d" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, color: "rgba(181,242,61,0.6)" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
      }}>
        {/* Theme toggle top right */}
        <button onClick={toggleTheme} style={{
          position: "absolute", top: 24, right: 24,
          width: 40, height: 40, borderRadius: "50%",
          border: "1.5px solid var(--border-strong)",
          background: "var(--bg-card)", color: "var(--neon-dim)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}>
          {theme === "dark" ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <div style={{
          width: "100%", maxWidth: 400,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease",
        }}>
          <div style={{ marginBottom: 36 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--neon)" }}>
                CareerAlley
              </span>
            </Link>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginTop: 24, marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Continue your learning journey
            </p>
          </div>

          {/* Google button */}
          <button onClick={googleLogin} style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: 10,
            border: "1.5px solid var(--border-strong)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
            transition: "all 0.2s",
            marginBottom: 20,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.background = "var(--neon-subtle)" }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--bg-card)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
            <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>or with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", display: "flex", alignItems: "center",
                  }}
                >
                  {showPass ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 8,
                background: "rgba(224,82,82,0.1)",
                border: "1px solid rgba(224,82,82,0.25)",
                color: "#e05252", fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-neon"
              style={{
                padding: "13px 20px",
                borderRadius: 10,
                fontSize: 15,
                width: "100%",
                opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin-slow 1s linear infinite" }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "var(--neon-dim)", fontWeight: 600, textDecoration: "none" }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-left { display: flex !important; }
        }
      `}</style>
    </div>
  )
}