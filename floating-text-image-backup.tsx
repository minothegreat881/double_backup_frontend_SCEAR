"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface FloatingTextImageProps {
  content: string
  image?: {
    src: string
    alt: string
    caption?: string
    position: "left" | "right" | "center" | "full-width"
    size?: "small" | "medium" | "large" | "full"
    spacing?: "none" | "small" | "medium" | "large"
    shadow?: boolean
  }
  alignment?: "left" | "center" | "right" | "justify"
  className?: string
}

export default function FloatingTextImage({
  content,
  image,
  alignment = "justify",
  className,
}: FloatingTextImageProps) {
  if (!image) {
    return (
      <p className={cn(
        "text-stone-800 leading-relaxed text-lg mb-6",
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

  const getImageClasses = () => {
    const baseClasses = "relative overflow-hidden rounded-lg mb-4"
    const sizeClasses = {
      "small": image.position === "full-width" ? "h-48" : "w-80 h-60",
      "medium": image.position === "full-width" ? "h-64" : "w-96 h-72",
      "large": image.position === "full-width" ? "h-96" : "w-[400px] h-80",
      "full": image.position === "full-width" ? "h-[50vh]" : "w-96 h-72"
    }
    const positionClasses = {
      "left": "float-left mr-6",
      "right": "float-right ml-6",
      "center": "mx-auto",
      "full-width": "w-full"
    }
    const shadowClass = (image.shadow !== false) ? "shadow-lg" : ""

    return cn(
      baseClasses,
      sizeClasses[image.size || "medium"],
      positionClasses[image.position],
      shadowClass
    )
  }

  return (
    <div className={cn("mb-8 overflow-hidden", className)}>
      {/* Floating Image */}
      <div className={getImageClasses()}>
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

      {/* Text that flows around the image */}
      <div className={cn(
        "text-stone-800 leading-relaxed text-lg",
        alignment === "left" && "text-left",
        alignment === "center" && "text-center",
        alignment === "right" && "text-right",
        alignment === "justify" && "text-justify"
      )}>
        {content}
      </div>

      {/* Clear float only for left/right positions */}
      {(image.position === "left" || image.position === "right") && (
        <div className="clear-both"></div>
      )}
    </div>
  )
}