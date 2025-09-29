"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ContentImageProps {
  text: string
  image: {
    id: number
    url: string
    name: string
    alternativeText?: string
    caption?: string
    width: number
    height: number
    formats?: any
  }
  imagePosition: "left" | "right" | "center" | "full-width"
  imageSize: "small" | "medium" | "large"
  textAlignment: "left" | "center" | "right" | "justify"
  imageCaption?: string
  imageAlt: string
}

export default function ContentImage({
  text,
  image,
  imagePosition,
  imageSize,
  textAlignment,
  imageCaption,
  imageAlt
}: ContentImageProps) {

  const getImageClasses = () => {
    const baseClasses = "relative overflow-hidden rounded-lg"

    const sizeClasses = {
      "small": imagePosition === "full-width" ? "h-48" : "w-64 h-48",
      "medium": imagePosition === "full-width" ? "h-64" : "w-80 h-60",
      "large": imagePosition === "full-width" ? "h-96" : "w-96 h-72"
    }

    const positionClasses = {
      "left": "float-left mr-6 mb-4",
      "right": "float-right ml-6 mb-4",
      "center": "mx-auto mb-6",
      "full-width": "w-full mb-6"
    }

    return cn(
      baseClasses,
      sizeClasses[imageSize],
      positionClasses[imagePosition],
      "shadow-lg"
    )
  }

  const getTextClasses = () => {
    const alignmentClasses = {
      "left": "text-left",
      "center": "text-center",
      "right": "text-right",
      "justify": "text-justify"
    }

    return cn(
      "text-stone-800 leading-relaxed text-lg",
      alignmentClasses[textAlignment]
    )
  }

  return (
    <div className="mb-8 overflow-hidden">
      {/* Image */}
      <div className={getImageClasses()}>
        <Image
          src={image.url}
          alt={imageAlt || image.alternativeText || image.name}
          fill
          className="object-cover"
        />
        {imageCaption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm">
            {imageCaption}
          </div>
        )}
      </div>

      {/* Text content with proper text wrapping */}
      <div
        className={getTextClasses()}
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {/* Clear float for left/right positioned images */}
      {(imagePosition === "left" || imagePosition === "right") && (
        <div className="clear-both"></div>
      )}
    </div>
  )
}