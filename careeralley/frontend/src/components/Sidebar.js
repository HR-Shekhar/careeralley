// // "use client"

// // // import { useTheme } from "@/lib/ThemeContext"
// // // import { useTheme } from "@/lib/ThemeContext"
// // import Link from "next/link"
// // import { usePathname } from "next/navigation"
// // // import { useTheme } from "../../lib/ThemeContext"
// // import { useTheme } from "../lib/ThemeContext"
// // const navItems = [
// //   {
// //     label: "Dashboard",
// //     href: "/dashboard",
// //     icon: (
// //       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //         <rect x="3" y="3" width="7" height="7" rx="1.5"/>
// //         <rect x="14" y="3" width="7" height="7" rx="1.5"/>
// //         <rect x="3" y="14" width="7" height="7" rx="1.5"/>
// //         <rect x="14" y="14" width="7" height="7" rx="1.5"/>
// //       </svg>
// //     ),
// //   },
// //   {
// //     label: "Roadmaps",
// //     href: "/roadmaps",
// //     icon: (
// //       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //         <path d="M3 12h4l3-9 4 18 3-9h4"/>
// //       </svg>
// //     ),
// //   },
// //   {
// //     label: "New Roadmap",
// //     href: "/fields",
// //     icon: (
// //       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //         <circle cx="12" cy="12" r="9"/>
// //         <path d="M12 8v8M8 12h8"/>
// //       </svg>
// //     ),
// //     highlight: true,
// //   },
// //   {
// //     label: "AI Assistant",
// //     href: "/ai-assistant",
// //     icon: (
// //       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //         <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.6-4.5 6.7V17h-5v-1.3C6.8 14.6 5 12 5 9a7 7 0 0 1 7-7z"/>
// //         <path d="M9 21h6M10 17v4M14 17v4"/>
// //       </svg>
// //     ),
// //     soon: true,
// //   },
// //   {
// //     label: "Study Groups",
// //     href: "/groups",
// //     icon: (
// //       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //         <circle cx="9" cy="7" r="3"/>
// //         <circle cx="15" cy="7" r="3"/>
// //         <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6"/>
// //       </svg>
// //     ),
// //     soon: true,
// //   },
// //   {
// //     label: "Group Chat",
// //     href: "/chat",
// //     icon: (
// //       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
// //       </svg>
// //     ),
// //     soon: true,
// //   },
// // ]

// // export default function Sidebar() {
// //   const pathname = usePathname()
// //   const { theme, toggleTheme } = useTheme()

// //   return (
// //     <aside className="sidebar">
// //       {/* Logo */}
// //       <div style={{
// //         padding: "28px 24px 20px",
// //         borderBottom: "1px solid rgba(181,242,61,0.08)",
// //       }}>
// //         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //           <div style={{
// //             width: 36,
// //             height: 36,
// //             borderRadius: 10,
// //             background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             flexShrink: 0,
// //           }}>
// //             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //               <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008"/>
// //               <path d="M3 12l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
// //               <path d="M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
// //             </svg>
// //           </div>
// //           <div>
// //             <div style={{
// //               fontFamily: "'Syne', sans-serif",
// //               fontWeight: 800,
// //               fontSize: 17,
// //               color: "#b5f23d",
// //               letterSpacing: "-0.3px",
// //               lineHeight: 1.1,
// //             }}>
// //               CareerAlley
// //             </div>
// //             <div style={{
// //               fontSize: 10,
// //               color: "rgba(181,242,61,0.45)",
// //               fontFamily: "'DM Sans', sans-serif",
// //               letterSpacing: "0.5px",
// //               textTransform: "uppercase",
// //             }}>
// //               Navigate Your Learning
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Nav */}
// //       <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
// //         <div style={{ marginBottom: 6, padding: "0 12px 8px", fontSize: 10, fontWeight: 700, color: "rgba(181,242,61,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
// //           Menu
// //         </div>
// //         {navItems.map((item) => {
// //           const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
// //           return (
// //             <Link
// //               key={item.href}
// //               href={item.soon ? "#" : item.href}
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: 12,
// //                 padding: "10px 14px",
// //                 borderRadius: 10,
// //                 marginBottom: 3,
// //                 textDecoration: "none",
// //                 color: isActive ? "#b5f23d" : "rgba(181,242,61,0.5)",
// //                 background: isActive ? "rgba(181,242,61,0.1)" : "transparent",
// //                 borderLeft: isActive ? "2px solid #b5f23d" : "2px solid transparent",
// //                 transition: "all 0.15s ease",
// //                 position: "relative",
// //                 fontSize: 14,
// //                 fontFamily: "'DM Sans', sans-serif",
// //                 fontWeight: isActive ? 600 : 400,
// //                 cursor: item.soon ? "default" : "pointer",
// //               }}
// //               onMouseEnter={e => {
// //                 if (!isActive && !item.soon) {
// //                   e.currentTarget.style.background = "rgba(181,242,61,0.07)"
// //                   e.currentTarget.style.color = "rgba(181,242,61,0.8)"
// //                 }
// //               }}
// //               onMouseLeave={e => {
// //                 if (!isActive) {
// //                   e.currentTarget.style.background = "transparent"
// //                   e.currentTarget.style.color = "rgba(181,242,61,0.5)"
// //                 }
// //               }}
// //             >
// //               <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
// //               <span style={{ flex: 1 }}>{item.label}</span>
// //               {item.highlight && !item.soon && (
// //                 <span style={{
// //                   width: 6, height: 6, borderRadius: "50%",
// //                   background: "#b5f23d",
// //                   boxShadow: "0 0 8px rgba(181,242,61,0.6)",
// //                 }} />
// //               )}
// //               {item.soon && (
// //                 <span style={{
// //                   fontSize: 9,
// //                   fontFamily: "'Syne', sans-serif",
// //                   fontWeight: 700,
// //                   letterSpacing: "0.5px",
// //                   padding: "2px 6px",
// //                   borderRadius: 4,
// //                   background: "rgba(181,242,61,0.08)",
// //                   color: "rgba(181,242,61,0.4)",
// //                   border: "1px solid rgba(181,242,61,0.12)",
// //                   textTransform: "uppercase",
// //                 }}>
// //                   Soon
// //                 </span>
// //               )}
// //             </Link>
// //           )
// //         })}
// //       </nav>

// //       {/* Bottom */}
// //       <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(181,242,61,0.08)" }}>
// //         <Link
// //           href="/about"
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 12,
// //             padding: "10px 14px",
// //             borderRadius: 10,
// //             textDecoration: "none",
// //             color: "rgba(181,242,61,0.4)",
// //             fontSize: 14,
// //             fontFamily: "'DM Sans', sans-serif",
// //             marginBottom: 8,
// //             transition: "all 0.15s",
// //           }}
// //           onMouseEnter={e => { e.currentTarget.style.color = "rgba(181,242,61,0.7)"; e.currentTarget.style.background = "rgba(181,242,61,0.05)" }}
// //           onMouseLeave={e => { e.currentTarget.style.color = "rgba(181,242,61,0.4)"; e.currentTarget.style.background = "transparent" }}
// //         >
// //           <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //             <circle cx="12" cy="12" r="10"/>
// //             <path d="M12 16v-4M12 8h.01"/>
// //           </svg>
// //           About
// //         </Link>

// //         {/* Theme toggle */}
// //         <button
// //           onClick={toggleTheme}
// //           style={{
// //             width: "100%",
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 12,
// //             padding: "10px 14px",
// //             borderRadius: 10,
// //             border: "1px solid rgba(181,242,61,0.12)",
// //             background: "rgba(181,242,61,0.05)",
// //             color: "rgba(181,242,61,0.6)",
// //             cursor: "pointer",
// //             fontSize: 13,
// //             fontFamily: "'DM Sans', sans-serif",
// //             transition: "all 0.15s",
// //           }}
// //           onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(181,242,61,0.25)"; e.currentTarget.style.color = "#b5f23d" }}
// //           onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(181,242,61,0.12)"; e.currentTarget.style.color = "rgba(181,242,61,0.6)" }}
// //         >
// //           {theme === "dark" ? (
// //             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //               <circle cx="12" cy="12" r="5"/>
// //               <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
// //             </svg>
// //           ) : (
// //             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
// //               <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
// //             </svg>
// //           )}
// //           {theme === "dark" ? "Light Mode" : "Dark Mode"}
// //         </button>
// //       </div>
// //     </aside>
// //   )
// // }
// "use client"

// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { useTheme } from "../lib/ThemeContext"

// const navItems = [
//   {
//     label: "Dashboard",
//     href: "/dashboard",
//     icon: (
//       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <rect x="3" y="3" width="7" height="7" rx="1.5"/>
//         <rect x="14" y="3" width="7" height="7" rx="1.5"/>
//         <rect x="3" y="14" width="7" height="7" rx="1.5"/>
//         <rect x="14" y="14" width="7" height="7" rx="1.5"/>
//       </svg>
//     ),
//   },
//   {
//     label: "Roadmaps",
//     href: "/roadmaps",
//     icon: (
//       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <path d="M3 12h4l3-9 4 18 3-9h4"/>
//       </svg>
//     ),
//   },
//   {
//     label: "New Roadmap",
//     href: "/fields",
//     icon: (
//       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <circle cx="12" cy="12" r="9"/>
//         <path d="M12 8v8M8 12h8"/>
//       </svg>
//     ),
//     highlight: true,
//   },
//   {
//     label: "AI Assistant",
//     href: "/ai-assistant",
//     icon: (
//       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.6-4.5 6.7V17h-5v-1.3C6.8 14.6 5 12 5 9a7 7 0 0 1 7-7z"/>
//         <path d="M9 21h6M10 17v4M14 17v4"/>
//       </svg>
//     ),
//     soon: false,
//   },
//   {
//     label: "Study Groups",
//     href: "/groups",
//     icon: (
//       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <circle cx="9" cy="7" r="3"/>
//         <circle cx="15" cy="7" r="3"/>
//         <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6"/>
//       </svg>
//     ),
//     soon: true,
//   },
//   {
//     label: "Group Chat",
//     href: "/chat",
//     icon: (
//       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
//       </svg>
//     ),
//     soon: false,
//   },
// ]

// export default function Sidebar() {
//   const pathname = usePathname()
//   const router = useRouter()
//   const { theme, toggleTheme } = useTheme()

//   const isLight = theme === "light"

//   const c = {
//     // Sidebar shell
//     bg:               isLight ? "#ffffff"                      : "#0a0e05",
//     border:           isLight ? "rgba(26,31,15,0.1)"           : "rgba(181,242,61,0.08)",

//     // Logo
//     logoText:         isLight ? "#1a1f0f"                      : "#b5f23d",
//     logoSub:          isLight ? "rgba(26,31,15,0.4)"           : "rgba(181,242,61,0.45)",

//     // Menu label
//     menuLabel:        isLight ? "rgba(26,31,15,0.3)"           : "rgba(181,242,61,0.3)",

//     // Nav items
//     navActive:        isLight ? "#3a6b00"                      : "#b5f23d",
//     navActiveBg:      isLight ? "rgba(90,160,20,0.1)"          : "rgba(181,242,61,0.1)",
//     navActiveBorder:  isLight ? "#5a9010"                      : "#b5f23d",
//     navInactive:      isLight ? "rgba(26,31,15,0.45)"          : "rgba(181,242,61,0.5)",
//     navHoverBg:       isLight ? "rgba(90,160,20,0.07)"         : "rgba(181,242,61,0.07)",
//     navHoverColor:    isLight ? "rgba(26,31,15,0.75)"          : "rgba(181,242,61,0.8)",

//     // Soon badge
//     soonBg:           isLight ? "rgba(26,31,15,0.05)"          : "rgba(181,242,61,0.08)",
//     soonColor:        isLight ? "rgba(26,31,15,0.35)"          : "rgba(181,242,61,0.4)",
//     soonBorder:       isLight ? "rgba(26,31,15,0.1)"           : "rgba(181,242,61,0.12)",

//     // Highlight dot
//     dotBg:            isLight ? "#5a9010"                      : "#b5f23d",
//     dotShadow:        isLight ? "0 0 8px rgba(90,144,16,0.5)"  : "0 0 8px rgba(181,242,61,0.6)",

//     // About link
//     aboutColor:       isLight ? "rgba(26,31,15,0.4)"           : "rgba(181,242,61,0.4)",
//     aboutHoverColor:  isLight ? "rgba(26,31,15,0.75)"          : "rgba(181,242,61,0.7)",
//     aboutHoverBg:     isLight ? "rgba(26,31,15,0.04)"          : "rgba(181,242,61,0.05)",

//     // Theme toggle
//     toggleBorder:     isLight ? "rgba(26,31,15,0.12)"          : "rgba(181,242,61,0.12)",
//     toggleBg:         isLight ? "rgba(26,31,15,0.04)"          : "rgba(181,242,61,0.05)",
//     toggleColor:      isLight ? "rgba(26,31,15,0.5)"           : "rgba(181,242,61,0.6)",
//     toggleHoverBorder:isLight ? "rgba(26,31,15,0.25)"          : "rgba(181,242,61,0.25)",
//     toggleHoverColor: isLight ? "#1a1f0f"                      : "#b5f23d",

//     // Logout
//     logoutBorder:     "rgba(224,82,82,0.15)",
//     logoutBg:         "rgba(224,82,82,0.05)",
//     logoutColor:      "rgba(224,82,82,0.6)",
//     logoutHoverBorder:"rgba(224,82,82,0.35)",
//     logoutHoverColor: "#e05252",
//     logoutHoverBg:    "rgba(224,82,82,0.1)",
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     router.replace("/login")
//   }

//   return (
//     <aside
//       className="sidebar"
//       style={{ background: c.bg, borderRightColor: c.border, transition: "background 0.3s ease, border-color 0.3s ease" }}
//     >
//       {/* Logo */}
//       <div style={{
//         padding: "28px 24px 20px",
//         borderBottom: `1px solid ${c.border}`,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 36,
//             height: 36,
//             borderRadius: 10,
//             background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexShrink: 0,
//           }}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//               <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008"/>
//               <path d="M3 12l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
//               <path d="M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </div>
//           <div>
//             <div style={{
//               fontFamily: "'Syne', sans-serif",
//               fontWeight: 800,
//               fontSize: 17,
//               color: c.logoText,
//               letterSpacing: "-0.3px",
//               lineHeight: 1.1,
//               transition: "color 0.3s ease",
//             }}>
//               CareerAlley
//             </div>
//             <div style={{
//               fontSize: 10,
//               color: c.logoSub,
//               fontFamily: "'DM Sans', sans-serif",
//               letterSpacing: "0.5px",
//               textTransform: "uppercase",
//               transition: "color 0.3s ease",
//             }}>
//               Navigate Your Learning
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
//         <div style={{
//           marginBottom: 6,
//           padding: "0 12px 8px",
//           fontSize: 10,
//           fontWeight: 700,
//           color: c.menuLabel,
//           letterSpacing: "1.5px",
//           textTransform: "uppercase",
//           fontFamily: "'Syne', sans-serif",
//           transition: "color 0.3s ease",
//         }}>
//           Menu
//         </div>
//         {navItems.map((item) => {
//           const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
//           return (
//             <Link
//               key={item.href}
//               href={item.soon ? "#" : item.href}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 padding: "10px 14px",
//                 borderRadius: 10,
//                 marginBottom: 3,
//                 textDecoration: "none",
//                 color: isActive ? c.navActive : c.navInactive,
//                 background: isActive ? c.navActiveBg : "transparent",
//                 borderLeft: `2px solid ${isActive ? c.navActiveBorder : "transparent"}`,
//                 transition: "all 0.15s ease",
//                 position: "relative",
//                 fontSize: 14,
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontWeight: isActive ? 600 : 400,
//                 cursor: item.soon ? "default" : "pointer",
//               }}
//               onMouseEnter={e => {
//                 if (!isActive && !item.soon) {
//                   e.currentTarget.style.background = c.navHoverBg
//                   e.currentTarget.style.color = c.navHoverColor
//                 }
//               }}
//               onMouseLeave={e => {
//                 if (!isActive) {
//                   e.currentTarget.style.background = "transparent"
//                   e.currentTarget.style.color = c.navInactive
//                 }
//               }}
//             >
//               <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
//               <span style={{ flex: 1 }}>{item.label}</span>
//               {item.highlight && !item.soon && (
//                 <span style={{
//                   width: 6, height: 6, borderRadius: "50%",
//                   background: c.dotBg,
//                   boxShadow: c.dotShadow,
//                 }} />
//               )}
//               {item.soon && (
//                 <span style={{
//                   fontSize: 9,
//                   fontFamily: "'Syne', sans-serif",
//                   fontWeight: 700,
//                   letterSpacing: "0.5px",
//                   padding: "2px 6px",
//                   borderRadius: 4,
//                   background: c.soonBg,
//                   color: c.soonColor,
//                   border: `1px solid ${c.soonBorder}`,
//                   textTransform: "uppercase",
//                 }}>
//                   Soon
//                 </span>
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Bottom */}
//       <div style={{ padding: "16px 12px", borderTop: `1px solid ${c.border}` }}>
//         <Link
//           href="/about"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "10px 14px",
//             borderRadius: 10,
//             textDecoration: "none",
//             color: c.aboutColor,
//             fontSize: 14,
//             fontFamily: "'DM Sans', sans-serif",
//             marginBottom: 8,
//             transition: "all 0.15s",
//           }}
//           onMouseEnter={e => {
//             e.currentTarget.style.color = c.aboutHoverColor
//             e.currentTarget.style.background = c.aboutHoverBg
//           }}
//           onMouseLeave={e => {
//             e.currentTarget.style.color = c.aboutColor
//             e.currentTarget.style.background = "transparent"
//           }}
//         >
//           <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="10"/>
//             <path d="M12 16v-4M12 8h.01"/>
//           </svg>
//           About
//         </Link>

//         {/* Theme toggle */}
//         <button
//           onClick={toggleTheme}
//           style={{
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "10px 14px",
//             borderRadius: 10,
//             border: `1px solid ${c.toggleBorder}`,
//             background: c.toggleBg,
//             color: c.toggleColor,
//             cursor: "pointer",
//             fontSize: 13,
//             fontFamily: "'DM Sans', sans-serif",
//             transition: "all 0.15s",
//             marginBottom: 8,
//           }}
//           onMouseEnter={e => {
//             e.currentTarget.style.borderColor = c.toggleHoverBorder
//             e.currentTarget.style.color = c.toggleHoverColor
//           }}
//           onMouseLeave={e => {
//             e.currentTarget.style.borderColor = c.toggleBorder
//             e.currentTarget.style.color = c.toggleColor
//           }}
//         >
//           {theme === "dark" ? (
//             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//               <circle cx="12" cy="12" r="5"/>
//               <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
//             </svg>
//           ) : (
//             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//               <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
//             </svg>
//           )}
//           {theme === "dark" ? "Light Mode" : "Dark Mode"}
//         </button>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           style={{
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "10px 14px",
//             borderRadius: 10,
//             border: `1px solid ${c.logoutBorder}`,
//             background: c.logoutBg,
//             color: c.logoutColor,
//             cursor: "pointer",
//             fontSize: 13,
//             fontFamily: "'DM Sans', sans-serif",
//             transition: "all 0.15s",
//           }}
//           onMouseEnter={e => {
//             e.currentTarget.style.borderColor = c.logoutHoverBorder
//             e.currentTarget.style.color = c.logoutHoverColor
//             e.currentTarget.style.background = c.logoutHoverBg
//           }}
//           onMouseLeave={e => {
//             e.currentTarget.style.borderColor = c.logoutBorder
//             e.currentTarget.style.color = c.logoutColor
//             e.currentTarget.style.background = c.logoutBg
//           }}
//         >
//           <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//             <polyline points="16 17 21 12 16 7"/>
//             <line x1="21" y1="12" x2="9" y2="12"/>
//           </svg>
//           Logout
//         </button>
//       </div>
//     </aside>
//   )
// }

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "../lib/ThemeContext"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    label: "Roadmaps",
    href: "/roadmaps",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 12h4l3-9 4 18 3-9h4"/>
      </svg>
    ),
  },
  {
    label: "New Roadmap",
    href: "/fields",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    ),
    highlight: true,
  },
  {
    label: "AI Assistant",
    href: "/ai-assistant",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.6-4.5 6.7V17h-5v-1.3C6.8 14.6 5 12 5 9a7 7 0 0 1 7-7z"/>
        <path d="M9 21h6M10 17v4M14 17v4"/>
      </svg>
    ),
    soon: false,
  },
  {
    label: "Mock Interviews",
    href: "/mock-interviews",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    soon: false,
  },
  {
    label: "Study Groups",
    href: "/groups",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="3"/>
        <circle cx="15" cy="7" r="3"/>
        <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6"/>
      </svg>
    ),
    soon: true,
  },
  {
    label: "Group Chat",
    href: "/chat",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    soon: false,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const isLight = theme === "light"

  const c = {
    bg:               isLight ? "#ffffff"                      : "#0a0e05",
    border:           isLight ? "rgba(26,31,15,0.1)"           : "rgba(181,242,61,0.08)",
    logoText:         isLight ? "#1a1f0f"                      : "#b5f23d",
    logoSub:          isLight ? "rgba(26,31,15,0.4)"           : "rgba(181,242,61,0.45)",
    menuLabel:        isLight ? "rgba(26,31,15,0.3)"           : "rgba(181,242,61,0.3)",
    navActive:        isLight ? "#3a6b00"                      : "#b5f23d",
    navActiveBg:      isLight ? "rgba(90,160,20,0.1)"          : "rgba(181,242,61,0.1)",
    navActiveBorder:  isLight ? "#5a9010"                      : "#b5f23d",
    navInactive:      isLight ? "rgba(26,31,15,0.45)"          : "rgba(181,242,61,0.5)",
    navHoverBg:       isLight ? "rgba(90,160,20,0.07)"         : "rgba(181,242,61,0.07)",
    navHoverColor:    isLight ? "rgba(26,31,15,0.75)"          : "rgba(181,242,61,0.8)",
    soonBg:           isLight ? "rgba(26,31,15,0.05)"          : "rgba(181,242,61,0.08)",
    soonColor:        isLight ? "rgba(26,31,15,0.35)"          : "rgba(181,242,61,0.4)",
    soonBorder:       isLight ? "rgba(26,31,15,0.1)"           : "rgba(181,242,61,0.12)",
    dotBg:            isLight ? "#5a9010"                      : "#b5f23d",
    dotShadow:        isLight ? "0 0 8px rgba(90,144,16,0.5)"  : "0 0 8px rgba(181,242,61,0.6)",
    aboutColor:       isLight ? "rgba(26,31,15,0.4)"           : "rgba(181,242,61,0.4)",
    aboutHoverColor:  isLight ? "rgba(26,31,15,0.75)"          : "rgba(181,242,61,0.7)",
    aboutHoverBg:     isLight ? "rgba(26,31,15,0.04)"          : "rgba(181,242,61,0.05)",
    toggleBorder:     isLight ? "rgba(26,31,15,0.12)"          : "rgba(181,242,61,0.12)",
    toggleBg:         isLight ? "rgba(26,31,15,0.04)"          : "rgba(181,242,61,0.05)",
    toggleColor:      isLight ? "rgba(26,31,15,0.5)"           : "rgba(181,242,61,0.6)",
    toggleHoverBorder:isLight ? "rgba(26,31,15,0.25)"          : "rgba(181,242,61,0.25)",
    toggleHoverColor: isLight ? "#1a1f0f"                      : "#b5f23d",
    logoutBorder:     "rgba(224,82,82,0.15)",
    logoutBg:         "rgba(224,82,82,0.05)",
    logoutColor:      "rgba(224,82,82,0.6)",
    logoutHoverBorder:"rgba(224,82,82,0.35)",
    logoutHoverColor: "#e05252",
    logoutHoverBg:    "rgba(224,82,82,0.1)",
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  return (
    <aside
      className="sidebar"
      style={{ background: c.bg, borderRightColor: c.border, transition: "background 0.3s ease, border-color 0.3s ease" }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${c.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008"/>
              <path d="M3 12l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17,
              color: c.logoText, letterSpacing: "-0.3px", lineHeight: 1.1, transition: "color 0.3s ease",
            }}>
              CareerAlley
            </div>
            <div style={{
              fontSize: 10, color: c.logoSub, fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.5px", textTransform: "uppercase", transition: "color 0.3s ease",
            }}>
              Navigate Your Learning
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{
          marginBottom: 6, padding: "0 12px 8px",
          fontSize: 10, fontWeight: 700, color: c.menuLabel,
          letterSpacing: "1.5px", textTransform: "uppercase",
          fontFamily: "'Syne', sans-serif", transition: "color 0.3s ease",
        }}>
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 10, marginBottom: 3,
                textDecoration: "none",
                color: isActive ? c.navActive : c.navInactive,
                background: isActive ? c.navActiveBg : "transparent",
                borderLeft: `2px solid ${isActive ? c.navActiveBorder : "transparent"}`,
                transition: "all 0.15s ease", position: "relative",
                fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 600 : 400,
                cursor: item.soon ? "default" : "pointer",
              }}
              onMouseEnter={e => {
                if (!isActive && !item.soon) {
                  e.currentTarget.style.background = c.navHoverBg
                  e.currentTarget.style.color = c.navHoverColor
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = c.navInactive
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.highlight && !item.soon && (
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: c.dotBg, boxShadow: c.dotShadow,
                }} />
              )}
              {item.soon && (
                <span style={{
                  fontSize: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  letterSpacing: "0.5px", padding: "2px 6px", borderRadius: 4,
                  background: c.soonBg, color: c.soonColor,
                  border: `1px solid ${c.soonBorder}`, textTransform: "uppercase",
                }}>
                  Soon
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${c.border}` }}>
        <Link
          href="/about"
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            borderRadius: 10, textDecoration: "none", color: c.aboutColor,
            fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 8, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = c.aboutHoverColor; e.currentTarget.style.background = c.aboutHoverBg }}
          onMouseLeave={e => { e.currentTarget.style.color = c.aboutColor; e.currentTarget.style.background = "transparent" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          About
        </Link>

        <button
          onClick={toggleTheme}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10,
            border: `1px solid ${c.toggleBorder}`, background: c.toggleBg, color: c.toggleColor,
            cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s", marginBottom: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = c.toggleHoverBorder; e.currentTarget.style.color = c.toggleHoverColor }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.toggleBorder; e.currentTarget.style.color = c.toggleColor }}
        >
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
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10,
            border: `1px solid ${c.logoutBorder}`, background: c.logoutBg, color: c.logoutColor,
            cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = c.logoutHoverBorder; e.currentTarget.style.color = c.logoutHoverColor; e.currentTarget.style.background = c.logoutHoverBg }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.logoutBorder; e.currentTarget.style.color = c.logoutColor; e.currentTarget.style.background = c.logoutBg }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}