"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

type GalleryImage = {
  id: number
  src: string
  alt: string
  category: string
}

type CardSwiperProps = {
  images: GalleryImage[]
  activeCategory?: string
}

export default function CardSwiper({ images, activeCategory = "All" }: CardSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitX, setExitX] = useState<number>(0)

  // Filter images based on active category
  const filteredImages = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory)

  // Get current card
  const currentImage = filteredImages[currentIndex]

  // Motion values for drag
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  // Handle drag end
  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      // Swiped right
      setExitX(200)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredImages.length) % filteredImages.length)
        setExitX(0)
      }, 300)
    } else if (info.offset.x < -100) {
      // Swiped left
      setExitX(-200)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredImages.length)
        setExitX(0)
      }, 300)
    }
  }

  if (!currentImage) return <div>No images available</div>

  return (
    <div className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
      {/* Instruction overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
        <div className="text-center">
          <p className="text-2xl font-bold">← Swipe →</p>
          <p>Drag cards to navigate</p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute w-[80%] max-w-md h-[500px] rounded-2xl shadow-xl cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ x: exitX, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: exitX, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 400px"
            />

            {/* Card content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex justify-between">
                <Badge className="bg-red-800">{currentImage.category}</Badge>
                <Badge variant="outline" className="bg-black/30 text-white border-none">
                  {currentIndex + 1}/{filteredImages.length}
                </Badge>
              </div>

              <div className="bg-gradient-to-t from-black/80 to-transparent p-4 -mx-6 -mb-6">
                <h3 className="text-xl font-bold text-white">{currentImage.alt}</h3>
                <p className="text-sm text-white/80 mt-1">Swipe to see more</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
