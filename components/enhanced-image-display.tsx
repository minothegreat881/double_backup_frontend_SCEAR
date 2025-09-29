"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageData {
  image?: { url: string, id?: number }
  alt: string
  caption: string
  description?: string
  position?: 'left' | 'right' | 'center' | 'full' | 'side-by-side'
  size?: 'small' | 'medium' | 'large'
  wrapText?: boolean
  pairedWith?: number
  spacing?: 'tight' | 'normal' | 'wide'
}

interface EnhancedImageDisplayProps {
  images: ImageData[]
  content?: string
}

export default function EnhancedImageDisplay({ images, content }: EnhancedImageDisplayProps) {
  // Group side-by-side images
  const processedImages = images.reduce((acc, img, index) => {
    // Skip if already processed as part of a pair
    if (acc.some(group => group.some(i => i === img))) return acc

    if (img.position === 'side-by-side' && img.pairedWith !== undefined) {
      const pairedImg = images[img.pairedWith]
      if (pairedImg) {
        acc.push([img, pairedImg])
      } else {
        acc.push([img])
      }
    } else {
      acc.push([img])
    }

    return acc
  }, [] as ImageData[][])

  const getSizeClasses = (size: string = 'medium', position: string = 'left') => {
    if (position === 'full') return 'w-full h-[400px] md:h-[500px]'
    if (position === 'center') {
      const sizes = {
        small: 'w-[300px] h-[200px] md:w-[400px] md:h-[300px]',
        medium: 'w-[400px] h-[300px] md:w-[600px] md:h-[400px]',
        large: 'w-[500px] h-[350px] md:w-[800px] md:h-[500px]'
      }
      return sizes[size as keyof typeof sizes] || sizes.medium
    }

    // For left/right floating
    const sizes = {
      small: 'w-48 h-36 md:w-64 md:h-48',
      medium: 'w-64 h-48 md:w-80 md:h-60',
      large: 'w-80 h-60 md:w-96 md:h-72'
    }
    return sizes[size as keyof typeof sizes] || sizes.medium
  }

  const getSpacingClasses = (spacing: string = 'normal', position: string = 'left') => {
    const spacings = {
      tight: {
        left: 'mr-2 mb-2 md:mr-3 md:mb-3',
        right: 'ml-2 mb-2 md:ml-3 md:mb-3',
        center: 'my-3 md:my-4',
        full: 'my-3 md:my-4'
      },
      normal: {
        left: 'mr-4 mb-3 md:mr-6 md:mb-4',
        right: 'ml-4 mb-3 md:ml-6 md:mb-4',
        center: 'my-4 md:my-6',
        full: 'my-4 md:my-6'
      },
      wide: {
        left: 'mr-6 mb-4 md:mr-8 md:mb-6',
        right: 'ml-6 mb-4 md:ml-8 md:mb-6',
        center: 'my-6 md:my-8',
        full: 'my-6 md:my-8'
      }
    }

    const spacingSet = spacings[spacing as keyof typeof spacings] || spacings.normal
    return spacingSet[position as keyof typeof spacingSet] || spacingSet.left
  }

  const getPositionClasses = (position: string = 'left', wrapText: boolean = true) => {
    if (position === 'left' && wrapText) return 'float-left clear-left'
    if (position === 'right' && wrapText) return 'float-right clear-right'
    if (position === 'center') return 'mx-auto block clear-both'
    if (position === 'full') return 'w-full block clear-both'
    return 'block'
  }

  return (
    <div className="rich-image-content">
      {processedImages.map((imageGroup, groupIndex) => {
        if (imageGroup.length === 2 && imageGroup[0].position === 'side-by-side') {
          // Render side-by-side images
          return (
            <div
              key={groupIndex}
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 clear-both",
                getSpacingClasses(imageGroup[0].spacing, 'center')
              )}
            >
              {imageGroup.map((img, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-lg shadow-lg">
                  <div className={cn("relative", getSizeClasses(img.size, 'center'))}>
                    {img.image?.url && (
                      <Image
                        src={img.image.url}
                        alt={img.alt || 'Image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        } else {
          // Render single image
          const img = imageGroup[0]
          return (
            <div
              key={groupIndex}
              className={cn(
                "relative overflow-hidden rounded-lg shadow-lg",
                getSizeClasses(img.size, img.position),
                getSpacingClasses(img.spacing, img.position),
                getPositionClasses(img.position, img.wrapText)
              )}
            >
              {img.image?.url && (
                <Image
                  src={img.image.url}
                  alt={img.alt || 'Image'}
                  fill
                  className="object-cover"
                  sizes={
                    img.position === 'full' ? '100vw' :
                    img.position === 'center' ? '(max-width: 768px) 100vw, 800px' :
                    '(max-width: 768px) 100vw, 400px'
                  }
                />
              )}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                  {img.caption}
                </div>
              )}
            </div>
          )
        }
      })}

      {/* Content text that flows around floating images */}
      {content && (
        <div
          className="prose prose-lg max-w-none text-justify"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Clear floats at the end */}
      <div className="clear-both" />
    </div>
  )
}