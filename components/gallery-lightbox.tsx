"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Download, Share, Heart, MapPin, Tag, Info } from "lucide-react"

type GalleryLightboxProps = {
  images: {
    id: number
    src: string
    alt: string
    category: string
    location?: string
    activity?: string
    date?: string
  }[]
  currentImageId: number | null
  onClose: () => void
}

export default function GalleryLightbox({ images, currentImageId, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [panelWidth, setPanelWidth] = useState(15)
  const [mobileInfoVisible, setMobileInfoVisible] = useState(false)
  
  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Typography system - responsive font sizes
  const getTypographySizes = () => {
    const baseSize = isMobile ? 0.875 : 1 // 14px mobile, 16px desktop
    return {
      title: isMobile ? 'text-lg' : 'text-xl',
      label: isMobile ? 'text-xs' : 'text-sm', 
      content: isMobile ? 'text-sm' : 'text-base',
      counter: 'text-xs'
    }
  }

  // Check if mobile on mount and window resize - FIXED: increased threshold to 1024px
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Set current index based on currentImageId and reset loading states
  useEffect(() => {
    if (currentImageId === null) return
    const index = images.findIndex((img) => img.id === currentImageId)
    if (index !== -1) {
      setCurrentIndex(index)
      setImageLoading(true)
      setImageError(false)
    }
  }, [currentImageId, images])

  // Reset loading state when current image changes
  useEffect(() => {
    setImageLoading(true)
    setImageError(false)
  }, [currentIndex])

  // Calculate optimal panel width based on content
  useEffect(() => {
    const image = images[currentIndex]
    if (image) {
      const titleLength = image.alt?.length || 0
      const locationLength = image.location?.length || 0
      const activityLength = image.activity?.length || 0
      const categoryLength = image.category?.length || 0
      
      const totalContentLength = titleLength + locationLength + activityLength + categoryLength
      const avgLineLength = 40 // chars per line estimate
      const estimatedLines = Math.ceil(totalContentLength / avgLineLength)
      
      // Dynamic width: 12-25% based on content
      let optimalWidth = 15 // default
      if (estimatedLines > 8) optimalWidth = 22
      else if (estimatedLines > 6) optimalWidth = 20 
      else if (estimatedLines > 4) optimalWidth = 18
      else if (estimatedLines < 3) optimalWidth = 12
      
      setPanelWidth(isMobile ? 100 : optimalWidth)
    }
  }, [currentIndex, images, isMobile])

  // Smart preloading - preload next and previous images
  useEffect(() => {
    if (images.length <= 1) return
    
    const preloadImages = [
      images[(currentIndex + 1) % images.length],
      images[(currentIndex - 1 + images.length) % images.length]
    ]
    
    preloadImages.forEach(img => {
      if (img?.src) {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = img.src
        link.setAttribute('data-preload', 'gallery')
        document.head.appendChild(link)
      }
    })
    
    // Cleanup old preloaded images
    return () => {
      document.querySelectorAll('link[data-preload="gallery"]').forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      })
    }
  }, [currentIndex, images])

  // Handle keyboard navigation and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden'
    document.body.classList.add('lightbox-open')
    
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = 'unset'
      document.body.classList.remove('lightbox-open')
    }
  }, [onClose])

  // Get current image - moved after all useEffects to avoid initialization error
  const currentImage = images[currentIndex]

  // Simple navigation functions
  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Handle close with stopPropagation
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  // Share functionality with fallback
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const shareData = {
      title: currentImage.alt,
      text: `${currentImage.location ? currentImage.location + ' - ' : ''}${currentImage.activity || 'Galéria SCEAR'}`,
      url: `${window.location.origin}${window.location.pathname}#photo-${currentImage.id}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && touchEnd) nextImage()
    if (isRightSwipe && touchEnd) prevImage()
    
    setTouchStart(null)
    setTouchEnd(null)
  }

  if (!currentImage) return null

  // Use React Portal to render lightbox at document.body level
  const lightboxContent = (
    <div className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center" onClick={onClose} style={{width: '100vw', height: '100vh', top: 0, left: 0, position: 'fixed'}}>
      {/* Main container */}
      <div className="relative w-full h-full flex" onClick={(e) => e.stopPropagation()}>
        {/* Image container - dynamically adjusted based on panel width */}
        <div 
          className={`${isMobile ? "w-full" : `w-[${100-panelWidth}%]`} h-full flex items-center justify-center relative transition-all duration-500 ease-out group`}
          style={{ width: isMobile ? '100%' : `${100-panelWidth}%` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image */}
          <div className="relative h-[85vh] w-full">
            {/* Loading skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-800/50 animate-pulse flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white/70 text-sm">Načítavam obrázok...</p>
                </div>
              </div>
            )}
            
            {/* Error state */}
            {imageError && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-red-400 text-6xl">⚠️</div>
                  <p className="text-white text-lg">Obrázok sa nepodarilo načítať</p>
                  <button 
                    onClick={() => {
                      setImageError(false)
                      setImageLoading(true)
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Skúsiť znovu
                  </button>
                </div>
              </div>
            )}
            
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className={`object-contain transition-opacity duration-300 ${
                imageLoading || imageError ? "opacity-0" : "opacity-100"
              }`}
              sizes="85vw"
              priority={true}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false)
                setImageError(true)
              }}
            />
          </div>

          {/* Enhanced Navigation buttons with hover effects */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 group" onClick={(e) => e.stopPropagation()}>
            <button
              className="w-16 h-16 flex items-center justify-center bg-black/60 hover:bg-red-900/70 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl border border-red-900/30 backdrop-blur-sm"
              onClick={prevImage}
              aria-label="Predchádzajúci obrázok"
            >
              <ChevronLeft className="h-8 w-8 text-white transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
            
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 group" onClick={(e) => e.stopPropagation()}>
            <button
              className="w-16 h-16 flex items-center justify-center bg-black/60 hover:bg-red-900/70 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl border border-red-900/30 backdrop-blur-sm"
              onClick={nextImage}
              aria-label="Ďalší obrázok"
            >
              <ChevronRight className="h-8 w-8 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            
          </div>
        </div>

        {/* Mobile Close Button - positioned over image area */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-red-900/70 rounded-full transition-colors duration-200 shadow-lg border border-white/20"
            onClick={handleClose}
          >
            <X className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Mobile Sliding Info Panel */}
        {isMobile && (
          <>
            {/* Handle for sliding panel */}
            <div 
              className="absolute bottom-0 left-0 right-0 z-40"
              onClick={() => setMobileInfoVisible(!mobileInfoVisible)}
            >
              <div className="flex justify-center py-2 bg-black/60 backdrop-blur-sm">
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
            
            {/* Sliding info panel */}
            <div 
              className={`absolute bottom-0 left-0 right-0 z-30 bg-[#111]/95 backdrop-blur-sm border-t border-red-900/40 transition-transform duration-300 ease-out ${
                mobileInfoVisible ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ height: '40vh' }}
            >
              {/* Panel content */}
              <div className="h-full flex flex-col p-4">
                {/* Title */}
                <div className="border-b border-red-900/40 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {currentImage.alt}
                  </h3>
                </div>

                {/* Info sections */}
                <div className="flex-grow space-y-4 overflow-y-auto">
                  {/* Location */}
                  {currentImage.location && (
                    <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 rounded-lg p-3 border border-red-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-red-400" />
                        <h4 className="text-red-300 font-semibold text-sm">Location</h4>
                      </div>
                      <p className="text-gray-200 text-sm">{currentImage.location}</p>
                    </div>
                  )}

                  {/* Activity */}
                  {currentImage.activity && (
                    <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-lg p-3 border border-blue-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-400" />
                        <h4 className="text-blue-300 font-semibold text-sm">Activity</h4>
                      </div>
                      <p className="text-gray-200 text-sm">{currentImage.activity}</p>
                    </div>
                  )}

                  {/* Category */}
                  {currentImage.category && (
                    <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 rounded-lg p-3 border border-amber-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4 text-amber-400" />
                        <h4 className="text-amber-300 font-semibold text-sm">Category</h4>
                      </div>
                      <p className="text-gray-200 text-sm">{currentImage.category}</p>
                    </div>
                  )}
                </div>

                {/* Counter */}
                <div className="pt-3 border-t border-red-900/40">
                  <div className="text-center">
                    <span className="text-xs font-mono text-gray-300 bg-gray-900/60 px-3 py-1 rounded-full">
                      {currentIndex + 1} / {images.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Desktop Info panel */}
        <div 
          className={`${
            isMobile 
              ? "hidden" 
              : "block h-full bg-gradient-to-b from-[#111] to-[#0a0a0a] border-l border-red-900/30 shadow-2xl"
          } transition-all duration-500 ease-out`}
          style={{ width: isMobile ? '0%' : `${panelWidth}%` }}
        >
          {/* Close button - only show on desktop since panel is hidden on mobile */}
          {!isMobile && (
            <button
              className="absolute top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-red-900/70 rounded-full transition-colors duration-200"
              onClick={handleClose}
            >
              <X className="h-5 w-5 text-white" />
            </button>
          )}

          {/* Content container */}
          <div className="h-full flex flex-col">
            {/* Title section - Enhanced typography */}
            <div className="p-4 border-b border-red-900/40 bg-gradient-to-r from-black/60 to-black/40">
              <h3 className={`${getTypographySizes().title} font-bold text-white leading-tight tracking-wide drop-shadow-sm`}>
                {currentImage.alt}
              </h3>
            </div>

            {/* Info sections */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
              {/* Location - Enhanced styling */}
              {currentImage.location && (
                <div className="bg-gradient-to-r from-red-900/10 to-red-800/5 rounded-lg p-4 border border-red-800/20 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-red-700 to-red-900 p-2 rounded-full shadow-lg">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <h4 className={`${getTypographySizes().label} text-red-300 font-semibold tracking-wide`}>Location</h4>
                  </div>
                  <p className={`${getTypographySizes().content} text-gray-200 pl-1 leading-relaxed`}>{currentImage.location}</p>
                </div>
              )}

              {/* Activity - Enhanced styling */}
              {currentImage.activity && (
                <div className="bg-gradient-to-r from-blue-900/10 to-blue-800/5 rounded-lg p-4 border border-blue-800/20 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-2 rounded-full shadow-lg">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                    <h4 className={`${getTypographySizes().label} text-blue-300 font-semibold tracking-wide`}>Activity</h4>
                  </div>
                  <p className={`${getTypographySizes().content} text-gray-200 pl-1 leading-relaxed`}>{currentImage.activity}</p>
                </div>
              )}

              {/* Category - Enhanced styling */}
              {currentImage.category && (
                <div className="bg-gradient-to-r from-amber-900/10 to-amber-800/5 rounded-lg p-4 border border-amber-800/20 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-2 rounded-full shadow-lg">
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    <h4 className={`${getTypographySizes().label} text-amber-300 font-semibold tracking-wide`}>Category</h4>
                  </div>
                  <p className={`${getTypographySizes().content} text-gray-200 pl-1 leading-relaxed`}>{currentImage.category}</p>
                </div>
              )}
            </div>

            {/* Footer - Enhanced with better visual hierarchy */}
            <div className="p-4 border-t border-red-900/40 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`${getTypographySizes().counter} font-mono text-gray-300 bg-gray-900/60 px-3 py-1.5 rounded-full border border-gray-700/50 shadow-lg`}>
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
                    isLiked 
                      ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-red-500/30" 
                      : "bg-black/60 hover:bg-red-900/50 text-white border border-red-800/30"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLiked(!isLiked)
                  }}
                  title={isLiked ? "Zrušiť obľúbenie" : "Obľúbiť"}
                >
                  <Heart className={`h-4 w-4 transition-all duration-200 ${
                    isLiked ? "fill-white text-white scale-110" : "text-white"
                  }`} />
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-blue-900/50 text-white border border-blue-800/30 transition-all duration-300 transform hover:scale-110 shadow-lg relative"
                  onClick={handleShare}
                  title="Zdieľať obrázok"
                >
                  <Share className="h-4 w-4 text-white" />
                  {shareSuccess && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-green-400/30 animate-bounce">
                      Skopírované!
                    </div>
                  )}
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-green-900/50 text-white border border-green-800/30 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Simple download functionality
                    const link = document.createElement('a')
                    link.href = currentImage.src
                    link.download = `${currentImage.alt || 'image'}.jpg`
                    link.target = '_blank'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  title="Stiahnuť obrázok"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Thumbnails with better styling */}
      <div className="absolute bottom-6 left-0 right-0 overflow-x-auto py-3 px-6">
        <div className="flex gap-3 justify-center">
          {images.slice(Math.max(0, currentIndex - 3), Math.min(images.length, currentIndex + 4)).map((img) => (
            <div
              key={img.id}
              className={`relative h-18 w-18 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 shadow-lg backdrop-blur-sm ${
                img.id === currentImage.id
                  ? "ring-2 ring-red-400 scale-110 shadow-red-500/30"
                  : "opacity-60 hover:opacity-100 hover:scale-105 ring-1 ring-white/20"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(images.findIndex((image) => image.id === img.id))
              }}
            >
              <Image 
                src={img.src || "/placeholder.svg"} 
                alt={img.alt} 
                fill 
                className="object-cover transition-transform duration-300 hover:scale-110" 
              />
              
              {/* Subtle overlay for non-active thumbnails */}
              {img.id !== currentImage.id && (
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render through portal to document.body
  return typeof window !== 'undefined' ? createPortal(lightboxContent, document.body) : null
}
