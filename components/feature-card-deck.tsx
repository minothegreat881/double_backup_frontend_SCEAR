"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"

type FeatureCard = {
  id: number
  title: string
  description: string
  image: string
}

type FeatureCardDeckProps = {
  cards: FeatureCard[]
  className?: string
}

export default function FeatureCardDeck({ cards, className = "" }: FeatureCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-10, 10])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  // Handle drag end
  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      // Swiped right
      setDirection(-1)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
    } else if (info.offset.x < -100) {
      // Swiped left
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length)
    }
  }

  // Auto-advance cards
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [cards.length])

  return (
    <div className={`relative w-full h-[500px] flex items-center justify-center ${className}`}>
      {/* Instruction overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
        <div className="text-center">
          <p className="text-2xl font-bold">← Swipe →</p>
          <p>Drag cards to navigate</p>
        </div>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentIndex}
          className="absolute w-[300px] h-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            x,
            rotate,
            opacity,
            backgroundImage: `linear-gradient(to bottom, rgba(153, 27, 27, 0.8), rgba(153, 27, 27, 0.4))`,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-white">
            <div className="relative w-32 h-32 mb-6 bg-white/10 rounded-full p-4">
              <Image
                src={cards[currentIndex].image || "/placeholder.svg"}
                alt={cards[currentIndex].title}
                fill
                className="object-contain p-2"
              />
            </div>

            <h3 className="text-2xl font-bold mb-4 text-center">{cards[currentIndex].title}</h3>
            <p className="text-center text-white/90">{cards[currentIndex].description}</p>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
