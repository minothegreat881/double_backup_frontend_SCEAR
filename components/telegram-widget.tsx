"use client"

import { useEffect, useState } from "react"
import { Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TelegramWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show chat button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-12 z-50">
      {/* Chat Window */}
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg w-[350px] mb-4 transition-all duration-300 transform",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        {/* Chat Header */}
        <div className="bg-red-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-1 mr-3">
              <Send className="h-5 w-5 text-red-800" />
            </div>
            <div>
              <h3 className="font-bold">S.C.E.A.R.</h3>
              <p className="text-xs opacity-80">Telegram skupina</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Widget Container - Using iframe instead of script */}
        <div className="bg-gray-50 h-[450px] overflow-hidden">
          {isOpen && (
            <iframe
              src="https://t.me/scear_group"
              width="100%"
              height="450"
              frameBorder="0"
              title="Telegram Chat"
              className="w-full h-full"
            />
          )}
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-red-800 hover:bg-red-900 text-white rounded-full p-4 shadow-lg flex items-center justify-center relative"
        aria-label="Open Telegram chat"
      >
        <Send className="h-6 w-6" />
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 h-3 w-3 bg-white rounded-full animate-pulse"></span>
      </button>
    </div>
  )
}
