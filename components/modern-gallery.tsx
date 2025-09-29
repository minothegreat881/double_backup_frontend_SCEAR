"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GalleryImage } from "@/lib/strapi-api"
import { fetchGalleryPhotos, fetchGalleryCategories } from "@/lib/strapi-api"
import GalleryLightbox from "./gallery-lightbox"

type ModernGalleryProps = {
  initialImages?: GalleryImage[]
  initialCategories?: string[]
}

export default function ModernGallery({ initialImages = [], initialCategories = [] }: ModernGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const galleryRef = useRef<HTMLDivElement>(null)
  const featuredCarouselRef = useRef<HTMLDivElement>(null)

  // Load data from Strapi on mount
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true)
        const [photosData, categoriesData] = await Promise.all([
          fetchGalleryPhotos(),
          fetchGalleryCategories()
        ])
        setImages(photosData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading gallery data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (initialImages.length === 0) {
      loadGalleryData()
    } else {
      setLoading(false)
    }
  }, [initialImages.length])

  // Handle hash-based photo selection on mount and hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#photo-')) {
        const photoId = parseInt(hash.replace('#photo-', ''), 10)
        if (photoId && !isNaN(photoId)) {
          setSelectedImageId(photoId)
        }
      }
    }

    // Handle initial hash on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Auto-open photo when images load and we have a hash
  useEffect(() => {
    if (!loading && images.length > 0) {
      const hash = window.location.hash
      if (hash.startsWith('#photo-')) {
        const photoId = parseInt(hash.replace('#photo-', ''), 10)
        if (photoId && !isNaN(photoId)) {
          const photo = images.find(img => img.id === photoId)
          if (photo) {
            setSelectedImageId(photoId)
          }
        }
      }
    }
  }, [loading, images])

  // Filter images based on active category and organize by aspect ratio
  useEffect(() => {
    const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory)
    
    // Organize images by aspect ratio for better layout
    const organizedImages = [...filtered].sort((a, b) => {
      const aspectA = (a.width && a.height) ? a.width / a.height : 1
      const aspectB = (b.width && b.height) ? b.width / b.height : 1
      
      // Group by aspect ratio: landscape, square, portrait
      const getCategory = (aspect: number) => {
        if (aspect > 1.3) return 0 // landscape
        if (aspect > 0.7) return 1 // square-ish
        return 2 // portrait
      }
      
      return getCategory(aspectA) - getCategory(aspectB)
    })
    
    setFilteredImages(organizedImages)

    // Set featured images
    setFeaturedImages(images.filter((img) => img.featured))
  }, [activeCategory, images])

  // Handle image click
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImageId(image.id)
  }

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImageId(null)
    // Clear hash from URL when closing lightbox
    if (window.location.hash.startsWith('#photo-')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const scrollFeatured = (direction: "left" | "right") => {
    if (featuredCarouselRef.current) {
      const scrollAmount = featuredCarouselRef.current.offsetWidth
      featuredCarouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
          <p className="text-stone-600">Načítavam galériu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Featured Images Carousel - hidden on mobile */}
      {featuredImages.length > 0 && (
        <div className="hidden sm:block relative">
          <div
            ref={featuredCarouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl shadow-xl"
          >
            {featuredImages.map((image) => (
              <div
                key={image.id}
                className="relative flex-shrink-0 w-full snap-center cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] w-full">
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    style={{ 
                      imageRendering: 'high-quality',
                      objectFit: 'cover',
                    }}
                  />
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md line-clamp-2">{image.alt}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-red-400" />
                      <span className="text-base md:text-lg font-medium line-clamp-1">{image.location}</span>
                    </div>
                    <p className="text-white/90 max-w-2xl text-base md:text-lg line-clamp-2">{image.activity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg transition-all duration-200 hover:scale-110 touch-manipulation"
            onClick={() => scrollFeatured("left")}
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg transition-all duration-200 hover:scale-110 touch-manipulation"
            onClick={() => scrollFeatured("right")}
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "outline"}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 text-sm sm:text-base touch-manipulation min-h-[44px] ${
              category === activeCategory
                ? "bg-red-800 hover:bg-red-900 shadow-md"
                : "hover:border-red-800 hover:text-red-800 border-gray-600 text-white"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Large Gallery Grid - optimized for quality and size */}
      <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-[250px] sm:auto-rows-[300px] lg:auto-rows-[350px]">
        {filteredImages.map((image, index) => {
          const aspectRatio = (image.width && image.height) ? image.width / image.height : 1
          
          // Simplified mobile-first sizing with occasional larger tiles on desktop
          let colSpan = "col-span-1"
          let rowSpan = "row-span-1"
          
          // Only add special sizing on larger screens to keep mobile simple
          const isFeaturePosition = (index + 1) % 5 === 0 || (index + 1) % 7 === 0
          
          if (isFeaturePosition && aspectRatio > 1.2) {
            // Feature landscape images: span 2 columns only on larger screens
            colSpan = "lg:col-span-2"
            rowSpan = "row-span-1"
          } else if (isFeaturePosition && aspectRatio < 0.8) {
            // Feature portrait images: span 2 rows only on larger screens
            colSpan = "col-span-1"
            rowSpan = "lg:row-span-2"
          }
          
          return (
            <motion.div
              key={image.id}
              className={`${colSpan} ${rowSpan} cursor-pointer group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading={index < 6 ? "eager" : "lazy"}
                style={{ 
                  imageRendering: 'high-quality',
                  objectFit: 'cover',
                }}
              />

              {/* Category badge */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                <Badge className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 px-2 sm:px-2.5 py-0.5 text-xs font-medium shadow-lg border border-red-700/20">
                  {image.category}
                </Badge>
              </div>

              {/* Text container - COMPLETELY REMOVED ON MOBILE - only on large desktop */}
              <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-medium text-sm text-white mb-1 line-clamp-1">{image.alt}</h3>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-red-400 flex-shrink-0" />
                  <span className="text-xs font-light text-gray-200 line-clamp-1">{image.location}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedImageId !== null && (
        <GalleryLightbox images={filteredImages} currentImageId={selectedImageId} onClose={closeLightbox} />
      )}
    </div>
  )
}
