"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"

export default function TelegramButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-12 z-50">
      <a
        href="https://t.me/scear_group"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-800 hover:bg-red-900 text-white rounded-full p-4 shadow-lg flex items-center justify-center relative"
        aria-label="Join our Telegram group"
      >
        <Send className="h-6 w-6" />
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 h-3 w-3 bg-white rounded-full animate-pulse"></span>
      </a>
    </div>
  )
}
