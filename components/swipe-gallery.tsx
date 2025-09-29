"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type GalleryImage = {
  id: number
  src: string
  alt: string
  category: string
}

type SwipeGalleryProps = {
  images: GalleryImage[]
  activeCategory?: string
}

export default function SwipeGallery({ images, activeCategory = "All" }: SwipeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Filter images based on active category
  const filteredImages = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory)

  // Reset index when filtered images change
  useEffect(() => {
    setCurrentIndex(0)
  }, [activeCategory])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredImages.length)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredImages.length) % filteredImages.length)
  }

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const touchDiff = touchStartX.current - touchEndX.current

    // If swipe distance is significant enough
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe left, go next
        handleNext()
      } else {
        // Swipe right, go previous
        handlePrevious()
      }
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  // Get current image
  const currentImage = filteredImages[currentIndex]

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  if (!currentImage) return <div>No images available</div>

  return (
    <div className="relative w-full">
      {/* Main Gallery View */}
      <div
        className="relative overflow-hidden rounded-xl shadow-xl bg-white"
        style={{ height: isFullscreen ? "100vh" : "70vh" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={currentImage.src || "/placeholder.svg"}
                alt={currentImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 70vw"
              />

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <Badge className="mb-2">{currentImage.category}</Badge>
                <h3 className="text-2xl font-bold mb-1">{currentImage.alt}</h3>
                <p className="text-sm text-white/80">
                  Image {currentIndex + 1} of {filteredImages.length}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 z-10"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 z-10 h-12 w-12 rounded-full"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 z-10 h-12 w-12 rounded-full"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 overflow-x-auto py-2">
        <div className="flex gap-2">
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              className={`relative h-20 w-20 rounded-md overflow-hidden cursor-pointer transition-all ${
                index === currentIndex ? "ring-2 ring-red-800 scale-105" : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
            >
              <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 z-10"
              onClick={() => setIsFullscreen(false)}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 z-10 h-12 w-12 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 z-10 h-12 w-12 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
