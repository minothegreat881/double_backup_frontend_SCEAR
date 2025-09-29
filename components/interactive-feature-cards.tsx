"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type FeatureCard = {
  id: number
  title: string
  description: string
  image: string
}

type InteractiveFeatureCardsProps = {
  cards: FeatureCard[]
  className?: string
}

export default function InteractiveFeatureCards({ cards, className = "" }: InteractiveFeatureCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle next card
  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length)
  }

  // Handle previous card
  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
  }

  // Handle mouse/touch events for dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    setAutoplayEnabled(false)

    // Get the starting position
    if ("touches" in e) {
      setStartX(e.touches[0].clientX)
    } else {
      setStartX(e.clientX)
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    let currentX: number

    if ("touches" in e) {
      currentX = e.touches[0].clientX
    } else {
      currentX = e.clientX
    }

    const diff = startX - currentX

    // If dragged far enough, change card
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
      setIsDragging(false)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Setup autoplay
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
  }, [autoplayEnabled, cards.length])

  // Pause autoplay when user interacts
  const pauseAutoplay = () => {
    setAutoplayEnabled(false)
  }

  // Resume autoplay after inactivity
  const resumeAutoplay = () => {
    setAutoplayEnabled(true)
  }

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={pauseAutoplay}
      onTouchEnd={() => setTimeout(resumeAutoplay, 5000)}
    >
      <div
        className="relative overflow-hidden rounded-xl bg-white shadow-xl h-[500px] md:h-[600px]"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col items-center"
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              {/* Logo/Image */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
                <Image
                  src={cards[currentIndex].image || "/placeholder.svg"}
                  alt={cards[currentIndex].title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-800">{cards[currentIndex].title}</h3>
                <p className="text-lg text-stone-700">{cards[currentIndex].description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-md z-10 h-10 w-10 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            handlePrevious()
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-md z-10 h-10 w-10 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentIndex ? "bg-red-800 w-6" : "bg-stone-300 hover:bg-stone-400"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
