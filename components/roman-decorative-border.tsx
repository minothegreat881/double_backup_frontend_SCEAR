import type React from "react"

interface RomanDecorativeBorderProps {
  children: React.ReactNode
  className?: string
}

export default function RomanDecorativeBorder({ children, className = "" }: RomanDecorativeBorderProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Top left corner */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-roman-gold-400/70"></div>

      {/* Top right corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-roman-gold-400/70"></div>

      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-roman-gold-400/70"></div>

      {/* Bottom right corner */}
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-roman-gold-400/70"></div>

      {/* Content */}
      <div className="px-4 py-4">{children}</div>
    </div>
  )
}
