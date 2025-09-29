"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import AdvancedTracker from '@/components/AdvancedTracker'
import { useState, useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [hideHeader, setHideHeader] = useState(false)

  useEffect(() => {
    let lastScrollY = 0
    let mapInView = false

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY

        // Kontrola, či je mapa v zobrazení (približne 300-800px od vrchu stránky)
        // Tieto hodnoty môžete upraviť podľa skutočnej pozície mapy
        mapInView = currentScrollY > 300 && currentScrollY < 800

        // Ak scrollujeme nahor a mapa je v zobrazení, skryjeme header
        if (currentScrollY < lastScrollY && mapInView) {
          setHideHeader(true)
        }
        // Ak scrollujeme nadol alebo mapa nie je v zobrazení, zobrazíme header
        else if (currentScrollY > lastScrollY || !mapInView) {
          setHideHeader(false)
        }

        // Aktualizujeme poslednú pozíciu scrollu
        lastScrollY = currentScrollY
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)

      // Cleanup event listener
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [])

  return (
    <div className={`${inter.className} min-h-screen flex flex-col`}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <Navbar hideHeader={hideHeader} />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
        <AdvancedTracker />
      </ThemeProvider>
    </div>
  )
}
