"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Grid2x2, Columns, Rows, Maximize } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import MasonryGrid from "@/components/masonry-grid"
import GalleryLightbox from "@/components/gallery-lightbox"
import type { GalleryImage } from "@/lib/gallery-data"

type InteractiveGalleryProps = {
  images: GalleryImage[]
  categories: string[]
  onFilterChange?: (category: string) => void
}

export default function InteractiveGallery({ images, categories, onFilterChange }: InteractiveGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "masonry" | "carousel">("grid")
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)

  const filteredImages = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (onFilterChange) onFilterChange(category)
  }

  return (
    <div className="space-y-8">
      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === activeCategory ? "default" : "outline"}
              className={category === activeCategory ? "bg-red-800 hover:bg-red-900" : ""}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            className={viewMode === "grid" ? "bg-red-800 hover:bg-red-900" : ""}
            size="icon"
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "masonry" ? "default" : "outline"}
            className={viewMode === "masonry" ? "bg-red-800 hover:bg-red-900" : ""}
            size="icon"
            onClick={() => setViewMode("masonry")}
            title="Masonry View"
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "carousel" ? "default" : "outline"}
            className={viewMode === "carousel" ? "bg-red-800 hover:bg-red-900" : ""}
            size="icon"
            onClick={() => setViewMode("carousel")}
            title="Carousel View"
          >
            <Rows className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Content */}
      <div>
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="font-medium">{image.alt}</p>
                    <p className="text-sm text-white/80">{image.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/50"
                    onClick={() => setSelectedImageId(image.id)}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === "masonry" && (
          <MasonryGrid images={filteredImages} onImageClick={(imageId) => setSelectedImageId(imageId)} />
        )}

        {viewMode === "carousel" && (
          <div className="relative py-10">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {filteredImages.map((image) => (
                  <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                    <div
                      className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImageId(image.id)}
                    >
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-medium">{image.alt}</p>
                        <p className="text-sm text-white/80">{image.category}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -left-4 -right-4 top-0 bottom-0 flex items-center justify-between pointer-events-none">
                <CarouselPrevious className="relative left-0 pointer-events-auto" />
                <CarouselNext className="relative right-0 pointer-events-auto" />
              </div>
            </Carousel>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <GalleryLightbox images={images} currentImageId={selectedImageId} onClose={() => setSelectedImageId(null)} />
    </div>
  )
}
