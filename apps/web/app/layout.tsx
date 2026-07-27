import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "DeVibe — AI-native cloud orchestration",
    template: "%s · DeVibe",
  },
  description:
    "Turn any idea into production-ready software. DeVibe runs autonomous agents that design, build, deploy and scale multi-cloud architectures for you.",
  keywords: [
    "AI agents",
    "cloud orchestration",
    "multi-cloud",
    "infrastructure as code",
    "Cloudflare Workers",
    "DevOps automation",
  ],
  openGraph: {
    title: "DeVibe — AI-native cloud orchestration",
    description:
      "Autonomous agents that design, build, deploy and scale multi-cloud software from a single prompt.",
    type: "website",
    siteName: "DeVibe",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeVibe — AI-native cloud orchestration",
    description: "Turn any idea into production-ready software with autonomous AI agents.",
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[9999]" />
        {children}
      </body>
    </html>
  )
}
