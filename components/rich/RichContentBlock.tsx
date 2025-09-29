"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageBlock {
  id: string
  url: string
  position: "left" | "right" | "center" | "full"
  size: "small" | "medium" | "large"
  caption?: string
  alt: string
  wrapText?: boolean
}

interface RichContentBlockProps {
  content: string
  imageBlocks?: ImageBlock[]
}

export default function RichContentBlock({ content, imageBlocks = [] }: RichContentBlockProps) {
  const getSizeClasses = (size: string, position: string) => {
    if (position === "full") return "w-full h-[400px]"
    if (position === "center") {
      const sizes = {
        small: "w-[400px] h-[300px]",
        medium: "w-[600px] h-[400px]",
        large: "w-[800px] h-[500px]"
      }
      return sizes[size] || sizes.medium
    }

    // For left/right floating
    const sizes = {
      small: "w-64 h-48",
      medium: "w-80 h-60",
      large: "w-96 h-72"
    }
    return sizes[size] || sizes.medium
  }

  const getPositionClasses = (position: string, wrapText: boolean) => {
    const positions = {
      left: wrapText ? "float-left mr-6 mb-4" : "block mb-4",
      right: wrapText ? "float-right ml-6 mb-4" : "block mb-4",
      center: "mx-auto mb-6 block",
      full: "w-full mb-6 block"
    }
    return positions[position] || positions.left
  }

  // Parse content into sections with embedded images
  const renderContentWithImages = () => {
    if (!imageBlocks || imageBlocks.length === 0) {
      return (
        <div
          className="prose prose-lg max-w-none text-justify"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }

    // Split content into paragraphs
    const paragraphs = content.split('</p>').filter(p => p.trim())
    const totalParagraphs = paragraphs.length
    const imagesPerParagraph = Math.floor(totalParagraphs / imageBlocks.length)

    return (
      <div className="rich-content-wrapper">
        {paragraphs.map((paragraph, pIndex) => {
          // Check if we should insert an image before this paragraph
          const imageIndex = Math.floor(pIndex / imagesPerParagraph)
          const shouldShowImage =
            imageIndex < imageBlocks.length &&
            pIndex === imageIndex * imagesPerParagraph

          return (
            <div key={pIndex} className="content-section">
              {shouldShowImage && imageBlocks[imageIndex] && (
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg shadow-lg",
                    getSizeClasses(imageBlocks[imageIndex].size, imageBlocks[imageIndex].position),
                    getPositionClasses(imageBlocks[imageIndex].position, imageBlocks[imageIndex].wrapText !== false)
                  )}
                >
                  <Image
                    src={imageBlocks[imageIndex].url}
                    alt={imageBlocks[imageIndex].alt}
                    fill
                    className="object-cover"
                    sizes={imageBlocks[imageIndex].position === "full" ? "100vw" :
                           imageBlocks[imageIndex].position === "center" ? "800px" : "400px"}
                  />
                  {imageBlocks[imageIndex].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                      {imageBlocks[imageIndex].caption}
                    </div>
                  )}
                </div>
              )}

              <div
                className="prose prose-lg max-w-none text-justify mb-4"
                dangerouslySetInnerHTML={{ __html: paragraph + '</p>' }}
              />
            </div>
          )
        })}

        {/* Clear floats */}
        <div className="clear-both" />
      </div>
    )
  }

  return (
    <div className="rich-content-block">
      {renderContentWithImages()}
    </div>
  )
}