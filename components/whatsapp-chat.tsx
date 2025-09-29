"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"

export default function WhatsAppChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const phoneNumber = "+421900123456" // Replace with the actual phone number
  const message = "Hello! I'm interested in your services." // Replace with the desired message

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
        aria-label="WhatsApp Chat"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </div>
  )
}
