"use client"

import { useState, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"

export default function LiveChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show chat button after a delay (remove Tawk.to for now)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    // Clean up
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    // TODO: Implement chat functionality or integrate with support system
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-12 z-50">
      <button
        onClick={toggleChat}
        className="bg-red-800 hover:bg-red-900 text-white rounded-full p-3 shadow-lg flex items-center justify-center relative"
        aria-label="Open Live Chat"
      >
        {isChatOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-white rounded-full animate-pulse"></span>
          </>
        )}
      </button>
    </div>
  )
}
