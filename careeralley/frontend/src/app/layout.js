import "./globals.css"
import { ThemeProvider } from "../lib/ThemeContext"

export const metadata = {
  title: "CareerAlley – Navigate Your Learning",
  description: "Personalized career roadmaps powered by AI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}