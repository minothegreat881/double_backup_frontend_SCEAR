"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FeatureCard {
  id: number
  title: string
  description: string
  imageUrl: string
}

interface ScrollingFeatureCardsProps {
  cards: FeatureCard[]
}

export default function ScrollingFeatureCards({ cards }: ScrollingFeatureCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToCard = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current
      const cardWidth = container.scrollWidth / cards.length
      container.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % cards.length
    scrollToCard(nextIndex)
  }

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length
    scrollToCard(prevIndex)
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (autoplayEnabled) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext()
      }, 5000)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [currentIndex, autoplayEnabled])

  return (
    <div className="relative">
      {/* Navigation buttons - Smaller on mobile, larger on desktop */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center touch-manipulation"
        onClick={() => {
          handlePrev()
          setAutoplayEnabled(false)
          setTimeout(() => setAutoplayEnabled(true), 5000)
        }}
      >
        <ChevronLeft className="h-3 w-3 sm:h-6 sm:w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center touch-manipulation"
        onClick={() => {
          handleNext()
          setAutoplayEnabled(false)
          setTimeout(() => setAutoplayEnabled(true), 5000)
        }}
      >
        <ChevronRight className="h-3 w-3 sm:h-6 sm:w-6" />
      </Button>

      {/* Cards container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cards.map((card, index) => (
          <div key={card.id} className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-2 sm:px-3 lg:px-4 snap-center">
            <div className="flex flex-col rounded-lg overflow-hidden shadow-lg h-full min-h-[400px] sm:min-h-[450px]">
              <div className="bg-red-900 p-4 sm:p-5 lg:p-6 flex flex-col items-center text-center flex-grow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mb-4 sm:mb-5 lg:mb-6 relative">
                  <Image src={card.imageUrl || "/placeholder.svg"} alt={card.title} fill className="object-contain" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-amber-300">{card.title}</h3>
                <p className="text-white text-sm sm:text-base leading-relaxed line-clamp-4">{card.description}</p>
              </div>
              <Button
                variant="ghost"
                className="w-full py-3 sm:py-4 rounded-none bg-amber-50 text-red-900 hover:bg-amber-100 hover:text-red-800 text-sm sm:text-base touch-manipulation"
              >
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator - Mobile optimized */}
      <div className="flex justify-center mt-4 sm:mt-6 gap-2 sm:gap-3">
        {cards.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full transition-all touch-manipulation ${
              index === currentIndex ? "bg-red-800 w-6 sm:w-8" : "bg-stone-300 hover:bg-stone-400"
            }`}
            onClick={() => {
              scrollToCard(index)
              setAutoplayEnabled(false)
              setTimeout(() => setAutoplayEnabled(true), 5000)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
