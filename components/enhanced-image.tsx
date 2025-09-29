"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface EnhancedImageProps {
  src: string
  alt: string
  caption?: string
  position?: "full-width" | "left" | "right" | "center"
  size?: "small" | "medium" | "large" | "full"
  spacing?: "none" | "small" | "medium" | "large"
  borderRadius?: "none" | "small" | "medium" | "large" | "full"
  shadow?: boolean
  priority?: boolean
  className?: string
}

export default function EnhancedImage({
  src,
  alt,
  caption,
  position = "center",
  size = "medium",
  spacing = "medium",
  borderRadius = "small",
  shadow = true,
  priority = false,
  className,
}: EnhancedImageProps) {
  const getContainerClasses = () => {
    const base = "relative overflow-hidden"

    // Use CSS Grid/Flexbox instead of float for better control
    const positionClasses = {
      "full-width": "w-full my-8",
      "left": "float-left mr-4 mb-4 shape-outside-margin-box",
      "right": "float-right ml-4 mb-4 shape-outside-margin-box",
      "center": "mx-auto my-6"
    }

    const sizeClasses = {
      "small": position === "full-width" ? "h-48" : "w-48 h-36",
      "medium": position === "full-width" ? "h-64" : "w-64 h-48",
      "large": position === "full-width" ? "h-96" : "w-80 h-60",
      "full": position === "full-width" ? "h-[50vh]" : "w-96 h-72"
    }

    const spacingClasses = {
      "none": "",
      "small": "my-2",
      "medium": "my-4",
      "large": "my-8"
    }

    const borderRadiusClasses = {
      "none": "rounded-none",
      "small": "rounded-md",
      "medium": "rounded-lg",
      "large": "rounded-xl",
      "full": "rounded-full"
    }

    const shadowClass = shadow ? "shadow-lg" : ""

    return cn(
      base,
      positionClasses[position],
      sizeClasses[size],
      spacingClasses[spacing],
      borderRadiusClasses[borderRadius],
      shadowClass,
      className
    )
  }

  const getClearfix = () => {
    if (position === "left" || position === "right") {
      return <div className="clear-both" />
    }
    return null
  }

  return (
    <>
      <figure className={getContainerClasses()}>
        <Image
          src={src}
          alt={alt}
          fill={position === "full-width"}
          width={position !== "full-width" ? 400 : undefined}
          height={position !== "full-width" ? 400 : undefined}
          className="object-cover"
          priority={priority}
        />
        {caption && (
          <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm">
            {caption}
          </figcaption>
        )}
      </figure>
      {getClearfix()}
    </>
  )
}