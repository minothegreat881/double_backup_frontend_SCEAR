"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface RichTextRendererProps {
  content: any
  className?: string
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  if (!content) return null

  // If content is a string, render as paragraph
  if (typeof content === "string") {
    return <p className={`text-lg leading-relaxed text-justify ${className}`}>{content}</p>
  }

  // If content is array of blocks from Strapi
  if (Array.isArray(content)) {
    return (
      <div className={className}>
        {content.map((block, index) => {
          // Paragraph block
          if (block.type === 'paragraph' && block.children) {
            const text = block.children.map((child: any) => child.text || '').join('')
            if (!text.trim()) return null
            return (
              <p key={index} className="mb-4 text-justify">
                {text}
              </p>
            )
          }

          // Heading block - render as actual HTML heading
          if (block.type === 'heading' && block.children) {
            const text = block.children.map((child: any) => child.text || '').join('')
            const level = block.level || 2

            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
            const headingClasses = {
              2: "text-3xl font-bold mt-8 mb-4",
              3: "text-2xl font-bold mt-6 mb-3",
              4: "text-xl font-semibold mt-4 mb-2",
              5: "text-lg font-semibold mt-3 mb-2",
              6: "text-base font-semibold mt-2 mb-1"
            }

            return React.createElement(
              HeadingTag,
              {
                key: index,
                className: headingClasses[level as keyof typeof headingClasses] || headingClasses[3]
              },
              text
            )
          }

          // List block
          if (block.type === 'list' && block.children) {
            const items = block.children.map((item: any, itemIndex: number) => {
              const text = item.children?.map((child: any) => child.text || '').join('') || ''
              return <li key={itemIndex}>{text}</li>
            })

            if (block.format === 'ordered') {
              return (
                <ol key={index} className="list-decimal list-inside mb-4 ml-4">
                  {items}
                </ol>
              )
            }
            return (
              <ul key={index} className="list-disc list-inside mb-4 ml-4">
                {items}
              </ul>
            )
          }

          // Quote block
          if (block.type === 'quote' && block.children) {
            const text = block.children.map((child: any) => child.text || '').join('')
            return (
              <blockquote key={index} className="bg-stone-100 p-6 rounded-lg my-6 border-l-4 border-red-800">
                <p className="italic text-stone-700">{text}</p>
              </blockquote>
            )
          }

          // Enhanced Image block with text wrapping support
          if (block.type === 'image' && block.image) {
            const position = block.position || 'left'
            const width = block.width || '50'
            const showCaption = block.showCaption !== false
            const rounded = block.rounded !== false
            const shadow = block.shadow !== false

            // Build image URL
            const imageUrl = block.image.url?.startsWith('http')
              ? block.image.url
              : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1341'}${block.image.url}`

            // Position and width styles for text wrapping
            const getImageStyles = () => {
              if (position === 'full' || width === '100') {
                return 'w-full block my-6'
              }

              const widthClasses = {
                '30': 'w-[30%]',
                '40': 'w-[40%]',
                '50': 'w-[50%]',
                '60': 'w-[60%]'
              }

              const positionClasses = {
                'left': 'float-left mr-6 mb-4',
                'right': 'float-right ml-6 mb-4',
                'center': 'mx-auto block my-6'
              }

              return cn(
                widthClasses[width as keyof typeof widthClasses] || widthClasses['50'],
                positionClasses[position as keyof typeof positionClasses] || positionClasses['left']
              )
            }

            return (
              <figure key={index} className={cn("image-block", getImageStyles())}>
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt={block.image.alt || block.image.alternativeText || 'Article image'}
                    width={1200}
                    height={800}
                    className={cn(
                      "w-full h-auto object-cover",
                      rounded && "rounded-lg",
                      shadow && "shadow-lg"
                    )}
                    sizes={position === 'full' || width === '100'
                      ? "100vw"
                      : width === '60' ? "60vw"
                      : width === '40' ? "40vw"
                      : width === '30' ? "30vw"
                      : "50vw"}
                  />
                </div>
                {showCaption && block.image.caption && (
                  <figcaption className="text-sm text-gray-600 mt-2 italic">
                    {block.image.caption}
                  </figcaption>
                )}
              </figure>
            )
          }

          return null
        })}
      </div>
    )
  }

  // Fallback for other content types
  return <div className={className}>{JSON.stringify(content)}</div>
}