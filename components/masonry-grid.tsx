"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { GalleryImage } from "@/lib/gallery-data"

type MasonryGridProps = {
  images: GalleryImage[]
  onImageClick?: (imageId: number) => void
}

export default function MasonryGrid({ images, onImageClick }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          className="mb-4 break-inside-avoid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onImageClick && onImageClick(image.id)}
        >
          <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all cursor-pointer group">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="font-medium">{image.alt}</p>
              <p className="text-sm text-white/80">{image.category}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
