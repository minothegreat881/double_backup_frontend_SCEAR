"use client"

import EnhancedImage from "./enhanced-image"
import { cn } from "@/lib/utils"

interface ContentBlockImage {
  src: string
  alt: string
  caption?: string
  position?: "full-width" | "left" | "right" | "center"
  size?: "small" | "medium" | "large" | "full"
  spacing?: "none" | "small" | "medium" | "large"
  borderRadius?: "none" | "small" | "medium" | "large" | "full"
  shadow?: boolean
  priority?: boolean
}

interface ContentBlockProps {
  type: "paragraph" | "heading" | "quote" | "list" | "divider"
  content?: string
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6"
  images?: ContentBlockImage[]
  alignment?: "left" | "center" | "right" | "justify"
  backgroundColor?: "transparent" | "light-gray" | "dark-gray" | "red-accent"
  padding?: "none" | "small" | "medium" | "large"
  order?: number
  className?: string
}

export default function ContentBlock({
  type,
  content,
  headingLevel = "h3",
  images = [],
  alignment = "left",
  backgroundColor = "transparent",
  padding = "none",
  order = 0,
  className,
}: ContentBlockProps) {
  const getContentElement = () => {
    const textAlignClasses = {
      "left": "text-left",
      "center": "text-center",
      "right": "text-right",
      "justify": "text-justify"
    }

    const textAlign = textAlignClasses[alignment]

    switch (type) {
      case "heading":
        const HeadingTag = headingLevel as keyof JSX.IntrinsicElements
        return (
          <HeadingTag className={cn(
            "font-bold text-stone-900 mb-4",
            headingLevel === "h2" && "text-3xl",
            headingLevel === "h3" && "text-2xl",
            headingLevel === "h4" && "text-xl",
            headingLevel === "h5" && "text-lg",
            headingLevel === "h6" && "text-base",
            textAlign
          )}>
            {content}
          </HeadingTag>
        )

      case "quote":
        return (
          <blockquote className={cn(
            "bg-stone-100 p-6 rounded-lg border-l-4 border-red-800 my-6 italic text-stone-700",
            textAlign
          )}>
            {content}
          </blockquote>
        )

      case "list":
        return (
          <div
            className={cn(
              "prose prose-stone max-w-none",
              textAlign
            )}
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        )

      case "divider":
        return <hr className="border-stone-300 my-8" />

      case "paragraph":
      default:
        return (
          <p className={cn(
            "text-stone-800 leading-relaxed mb-4",
            textAlign
          )}>
            {content}
          </p>
        )
    }
  }

  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case "light-gray":
        return "bg-stone-50"
      case "dark-gray":
        return "bg-stone-100"
      case "red-accent":
        return "bg-red-50"
      case "transparent":
      default:
        return "bg-transparent"
    }
  }

  const getPaddingClasses = () => {
    switch (padding) {
      case "small":
        return "p-4"
      case "medium":
        return "p-6"
      case "large":
        return "p-8"
      case "none":
      default:
        return ""
    }
  }

  return (
    <div
      className={cn(
        "content-block",
        getBackgroundClasses(),
        getPaddingClasses(),
        className
      )}
      style={{ order }}
    >
      {/* Render images that should appear before content */}
      {images
        .filter(img => img.position === "full-width")
        .map((image, index) => (
          <EnhancedImage key={`before-${index}`} {...image} />
        ))}

      {/* Main content with floating images */}
      <div className="relative overflow-hidden">
        {/* Render floating images */}
        {images
          .filter(img => img.position === "left" || img.position === "right")
          .map((image, index) => (
            <EnhancedImage key={`float-${index}`} {...image} />
          ))}

        {/* Render content - with proper text flow */}
        <div className="text-flow">
          {getContentElement()}
        </div>

        {/* Clear floats */}
        <div className="clear-both" />
      </div>

      {/* Render centered images after content */}
      {images
        .filter(img => img.position === "center")
        .map((image, index) => (
          <EnhancedImage key={`after-${index}`} {...image} />
        ))}
    </div>
  )
}