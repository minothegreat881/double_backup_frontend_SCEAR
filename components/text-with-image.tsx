"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface TextWithImageProps {
  content: string
  image?: {
    src: string
    alt: string
    caption?: string
    position: "left" | "right"
    size?: "small" | "medium" | "large"
  }
  alignment?: "left" | "center" | "right" | "justify"
  className?: string
}

export default function TextWithImage({
  content,
  image,
  alignment = "justify",
  className,
}: TextWithImageProps) {
  if (!image) {
    return (
      <p className={cn(
        "text-stone-800 leading-relaxed mb-4",
        alignment === "left" && "text-left",
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
        alignment === "justify" && "text-justify",
        className
      )}>
        {content}
      </p>
    )
  }

  const getImageSize = () => {
    switch (image.size || "medium") {
      case "small": return "w-80 h-60"
      case "medium": return "w-96 h-72"
      case "large": return "w-[400px] h-80"
      default: return "w-96 h-72"
    }
  }

  const getImageHeight = () => {
    switch (image.size || "medium") {
      case "small": return "h-60"
      case "medium": return "h-72"
      case "large": return "h-80"
      default: return "h-72"
    }
  }

  // Split content into parts - text that fits next to image and overflow text
  const splitContent = (text: string, imageHeight: string) => {
    // Estimate how many characters fit based on image height
    const heightMap = { "h-60": 240, "h-72": 288, "h-80": 320 } as const
    const pixels = heightMap[imageHeight as keyof typeof heightMap] || 288
    const lineHeight = 28 // ~1.75rem in pixels
    const lines = Math.floor(pixels / lineHeight)
    const charsPerLine = 80 // Approximate characters per line
    const maxChars = lines * charsPerLine

    if (text.length <= maxChars) {
      return { wrappingText: text, overflowText: "" }
    }

    // Find a good break point near the limit
    const breakPoint = text.lastIndexOf(" ", maxChars)
    return {
      wrappingText: text.substring(0, breakPoint),
      overflowText: text.substring(breakPoint + 1)
    }
  }

  const imageHeight = getImageHeight()
  const { wrappingText, overflowText } = splitContent(content, imageHeight)

  return (
    <>
      <div className={cn(
        "flex gap-6 mb-6 items-start",
        image.position === "right" && "flex-row-reverse",
        className
      )}>
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden rounded-lg shadow-lg flex-shrink-0",
          getImageSize()
        )}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm">
              {image.caption}
            </div>
          )}
        </div>

        {/* Text content that wraps around image */}
        <div className={cn(
          "flex-1 flex flex-col justify-start",
          imageHeight
        )}>
          <div className="overflow-hidden h-full">
            <p className={cn(
              "text-stone-800 leading-relaxed text-lg h-full",
              alignment === "left" && "text-left",
              alignment === "center" && "text-center",
              alignment === "right" && "text-right",
              alignment === "justify" && "text-justify"
            )}>
              {wrappingText}
            </p>
          </div>
        </div>
      </div>

      {/* Overflow text continues below */}
      {overflowText && (
        <div className="mb-6">
          <p className={cn(
            "text-stone-800 leading-relaxed text-lg",
            alignment === "left" && "text-left",
            alignment === "center" && "text-center",
            alignment === "right" && "text-right",
            alignment === "justify" && "text-justify"
          )}>
            {overflowText}
          </p>
        </div>
      )}
    </>
  )
}