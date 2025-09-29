"use client"

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ContentImage {
  id?: number
  imageId?: number
  imageUrl?: string
  url?: string
  caption?: string
  alt: string
  position: 'left' | 'right' | 'center' | 'full'
  width: '30' | '40' | '50' | '60' | '100'
  showCaption?: boolean
  rounded?: boolean
  shadow?: boolean
  pairWithNext?: boolean  // New property to explicitly request pairing
}

interface ArticleContentProps {
  mainContent: any
  contentImages?: any[]
}

export default function ArticleContent({ mainContent, contentImages = [] }: ArticleContentProps) {
  console.log('ArticleContent - Received contentImages:', contentImages)

  // Process content images
  const images: ContentImage[] = contentImages.map((img: any, index: number) => {
    // Handle image object
    const imageData = img.image?.data?.attributes || img.image?.attributes || img.image || {}
    const imageUrl = imageData.url || img.imageUrl || img.url

    const processedImage = {
      id: img.id,
      imageId: img.image?.id || img.imageId,
      imageUrl: imageUrl?.startsWith('http')
        ? imageUrl
        : imageUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1341'}${imageUrl}` : '',
      alt: img.alt || '',
      caption: img.caption || '',
      position: img.position || 'left',
      width: img.width || '50',
      showCaption: img.showCaption !== false,
      rounded: img.rounded !== false,
      shadow: img.shadow !== false,
      pairWithNext: img.pairWithNext === true
    }

    console.log(`Image ${index} - pairWithNext:`, img.pairWithNext, '-> processed:', processedImage.pairWithNext)
    return processedImage
  }).filter((img: ContentImage) => img.imageUrl)

  console.log('ArticleContent - Processed images:', images)

  // Render a single block
  const renderBlock = (block: any, index: number) => {
    if (!block) return null

    switch (block.type) {
      case 'paragraph':
        const text = block.children?.map((child: any) => child.text || '').join('') || ''
        if (!text.trim()) return null
        return (
          <p key={index} className="mb-4 text-justify leading-relaxed">
            {text}
          </p>
        )

      case 'heading':
        const headingText = block.children?.map((child: any) => child.text || '').join('') || ''
        if (!headingText.trim()) return null
        const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements
        const headingClasses = {
          h1: 'text-3xl font-bold mt-8 mb-4',
          h2: 'text-2xl font-bold mt-6 mb-3',
          h3: 'text-xl font-semibold mt-4 mb-2',
          h4: 'text-lg font-semibold mt-3 mb-2',
          h5: 'text-base font-semibold mt-2 mb-1',
          h6: 'text-base font-medium mt-2 mb-1'
        }
        return (
          <HeadingTag
            key={index}
            className={headingClasses[HeadingTag] || headingClasses.h3}
          >
            {headingText}
          </HeadingTag>
        )

      case 'list':
        const items = block.children?.map((item: any, itemIndex: number) => {
          const itemText = item.children?.map((child: any) => child.text || '').join('') || ''
          return itemText ? <li key={itemIndex} className="mb-1">{itemText}</li> : null
        }).filter(Boolean)

        if (!items || items.length === 0) return null

        const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
        const listClass = block.format === 'ordered'
          ? 'list-decimal list-inside mb-4 space-y-1 ml-4'
          : 'list-disc list-inside mb-4 space-y-1 ml-4'

        return (
          <ListTag key={index} className={listClass}>
            {items}
          </ListTag>
        )

      case 'quote':
        const quoteText = block.children?.map((child: any) => child.text || '').join('') || ''
        if (!quoteText.trim()) return null
        return [
          <div key={`clear-quote-${index}`} className="clear-both" />,
          <blockquote
            key={`quote-${index}`}
            className="bg-stone-100 p-6 rounded-lg my-6 border-l-4 border-red-800 italic text-stone-700"
          >
            {quoteText}
          </blockquote>
        ]

      default:
        return null
    }
  }

  // Render an image
  const renderImage = (image: ContentImage, index: number, isInPair: boolean = false) => {
    const widthClasses = {
      '30': 'w-[30%]',
      '40': 'w-[40%]',
      '50': 'w-[50%]',
      '60': 'w-[60%]',
      '100': 'w-full'
    }

    const positionClasses = {
      'left': isInPair ? '' : 'float-left mr-6 mb-4',
      'right': isInPair ? '' : 'float-right ml-6 mb-4',
      'center': 'mx-auto my-6 block',
      'full': 'w-full my-6'
    }

    const containerClass = cn(
      'relative',
      isInPair ? 'w-full' : (image.position === 'full' ? 'w-full' : widthClasses[image.width]),
      !isInPair && positionClasses[image.position],
      image.rounded && 'overflow-hidden rounded-lg',
      image.shadow && 'shadow-lg'
    )

    return (
      <div key={`img-${index}`} className={containerClass}>
        <div className="relative" style={{ paddingBottom: '66.67%' }}> {/* 3:2 aspect ratio */}
          <Image
            src={image.imageUrl || '/placeholder.svg'}
            alt={image.alt || 'Article image'}
            fill
            sizes={image.width === '100' ? '100vw' : `${image.width}vw`}
            className="object-cover"
            style={{ imageOrientation: 'none' }}
          />
        </div>
        {image.showCaption && image.caption && (
          <p className="text-sm text-gray-600 mt-2 italic text-center">
            {image.caption}
          </p>
        )}
      </div>
    )
  }

  // Combine text blocks and images
  const renderContent = () => {
    if (!mainContent || !Array.isArray(mainContent)) {
      return <p className="text-gray-500">No content available</p>
    }

    const elements: React.ReactNode[] = []
    let imageIndex = 0
    let paragraphCount = 0
    let lastFloatPosition: 'left' | 'right' | null = null

    // Process content blocks
    mainContent.forEach((block, blockIndex) => {
      // Track paragraphs and insert images BEFORE the paragraph
      if (block.type === 'paragraph') {
        paragraphCount++

        // Insert images before specific paragraph positions
        // Before 2nd paragraph: first image(s)
        // Before 4th paragraph: next image(s)
        // Before 6th paragraph: next image(s), etc.
        if (paragraphCount === 2 || (paragraphCount > 2 && paragraphCount % 2 === 0)) {
          // Check how many images we can insert at this position
          if (imageIndex < images.length) {
            const currentImg = images[imageIndex]
            console.log(`Processing image ${imageIndex}:`, {
              position: currentImg.position,
              pairWithNext: currentImg.pairWithNext
            })

            // Check if this image explicitly wants to be paired with the next one
            if (currentImg.pairWithNext && imageIndex + 1 < images.length) {
              const nextImg = images[imageIndex + 1]
              console.log(`Image ${imageIndex} wants to pair with image ${imageIndex + 1}`)
              console.log(`Positions: ${currentImg.position} + ${nextImg.position}`)

              // Only pair if they have opposite positions
              if ((currentImg.position === 'left' && nextImg.position === 'right') ||
                  (currentImg.position === 'right' && nextImg.position === 'left')) {
                console.log('Pairing images!')
                // Render as pair
                elements.push(<div key={`clear-pair-${blockIndex}`} className="clear-both" />)

                // Determine which image goes left and which goes right
                let leftImg, rightImg, leftIndex, rightIndex
                if (currentImg.position === 'left') {
                  leftImg = currentImg
                  rightImg = nextImg
                  leftIndex = imageIndex
                  rightIndex = imageIndex + 1
                } else {
                  leftImg = nextImg
                  rightImg = currentImg
                  leftIndex = imageIndex + 1
                  rightIndex = imageIndex
                }

                elements.push(
                  <div key={`pair-${blockIndex}`} className="clear-both my-6">
                    <div className="flex gap-6 items-stretch">
                      <div className={`flex-1`}>
                        {renderImage(leftImg, leftIndex, true)}
                      </div>
                      <div className={`flex-1`}>
                        {renderImage(rightImg, rightIndex, true)}
                      </div>
                    </div>
                  </div>
                )
                imageIndex += 2
                lastFloatPosition = null
              } else {
                // Can't pair - render normally
                // Clear if same side as previous
                if (lastFloatPosition === currentImg.position &&
                    (currentImg.position === 'left' || currentImg.position === 'right')) {
                  elements.push(<div key={`clear-${imageIndex}`} className="clear-both" />)
                }

                // Clear for center/full images
                if (currentImg.position === 'center' || currentImg.position === 'full') {
                  elements.push(<div key={`clear-${imageIndex}`} className="clear-both" />)
                }

                elements.push(renderImage(currentImg, imageIndex))
                lastFloatPosition = (currentImg.position === 'left' || currentImg.position === 'right')
                  ? currentImg.position
                  : null
                imageIndex++
              }
            } else {
              // Normal single image rendering
              // Clear if same side as previous floating image
              if (lastFloatPosition === currentImg.position &&
                  (currentImg.position === 'left' || currentImg.position === 'right')) {
                elements.push(<div key={`clear-${imageIndex}`} className="clear-both" />)
              }

              // Clear for center/full images
              if (currentImg.position === 'center' || currentImg.position === 'full') {
                elements.push(<div key={`clear-${imageIndex}`} className="clear-both" />)
              }

              elements.push(renderImage(currentImg, imageIndex))
              lastFloatPosition = (currentImg.position === 'left' || currentImg.position === 'right')
                ? currentImg.position
                : null
              imageIndex++
            }
          }
        }
      }

      // Add the content block AFTER processing images
      const element = renderBlock(block, blockIndex)
      if (element) {
        // If renderBlock returns an array (for quote), spread it
        if (Array.isArray(element)) {
          elements.push(...element)
        } else {
          elements.push(element)
        }
      }

      // Clear before headings if there's a floating image (but not if we're in middle of pairing)
      if (block.type === 'heading' && lastFloatPosition) {
        // Check if next image wants to pair
        const nextImg = imageIndex < images.length ? images[imageIndex] : null
        const prevImg = imageIndex > 0 ? images[imageIndex - 1] : null

        // Don't clear if previous image wants to pair with next
        if (!(prevImg && prevImg.pairWithNext)) {
          elements.push(<div key={`clear-heading-${blockIndex}`} className="clear-both" />)
          lastFloatPosition = null
        }
      }
    })

    // Add any remaining images at the end
    while (imageIndex < images.length) {
      const currentImg = images[imageIndex]
      console.log(`Processing remaining image ${imageIndex}:`, {
        position: currentImg.position,
        pairWithNext: currentImg.pairWithNext
      })

      // Check if this image wants to pair with the next one
      if (currentImg.pairWithNext && imageIndex + 1 < images.length) {
        const nextImg = images[imageIndex + 1]
        console.log(`Remaining image ${imageIndex} wants to pair with image ${imageIndex + 1}`)
        console.log(`Positions: ${currentImg.position} + ${nextImg.position}`)

        // Only pair if they have opposite positions
        if ((currentImg.position === 'left' && nextImg.position === 'right') ||
            (currentImg.position === 'right' && nextImg.position === 'left')) {
          console.log('Pairing remaining images!')
          // Clear before pairing
          elements.push(<div key={`clear-remaining-pair-${imageIndex}`} className="clear-both" />)

          // Determine which image goes left and which goes right
          let leftImg, rightImg, leftIndex, rightIndex
          if (currentImg.position === 'left') {
            leftImg = currentImg
            rightImg = nextImg
            leftIndex = imageIndex
            rightIndex = imageIndex + 1
          } else {
            leftImg = nextImg
            rightImg = currentImg
            leftIndex = imageIndex + 1
            rightIndex = imageIndex
          }

          elements.push(
            <div key={`remaining-pair-${imageIndex}`} className="clear-both my-6">
              <div className="flex gap-6 items-stretch">
                <div className={`flex-1`}>
                  {renderImage(leftImg, leftIndex, true)}
                </div>
                <div className={`flex-1`}>
                  {renderImage(rightImg, rightIndex, true)}
                </div>
              </div>
            </div>
          )
          imageIndex += 2
          lastFloatPosition = null
        } else {
          // Can't pair - render normally
          console.log(`Cannot pair remaining images ${imageIndex} and ${imageIndex + 1}: positions must be opposite`)

          // Clear if same side as previous or for center/full
          if ((lastFloatPosition === currentImg.position &&
              (currentImg.position === 'left' || currentImg.position === 'right')) ||
              currentImg.position === 'center' ||
              currentImg.position === 'full') {
            elements.push(<div key={`clear-remaining-${imageIndex}`} className="clear-both" />)
          }

          elements.push(renderImage(currentImg, imageIndex))
          lastFloatPosition = (currentImg.position === 'left' || currentImg.position === 'right')
            ? currentImg.position
            : null
          imageIndex++
        }
      } else {
        // Single image - no pairing
        // Clear if same side as previous or for center/full
        if ((lastFloatPosition === currentImg.position &&
            (currentImg.position === 'left' || currentImg.position === 'right')) ||
            currentImg.position === 'center' ||
            currentImg.position === 'full') {
          elements.push(<div key={`clear-remaining-${imageIndex}`} className="clear-both" />)
        }

        elements.push(renderImage(currentImg, imageIndex))
        lastFloatPosition = (currentImg.position === 'left' || currentImg.position === 'right')
          ? currentImg.position
          : null
        imageIndex++
      }
    }

    return <div className="clearfix">{elements}</div>
  }

  return (
    <div className="article-content prose prose-stone max-w-none">
      <style jsx global>{`
        .article-content img {
          image-orientation: none !important;
        }

        @media (max-width: 768px) {
          .article-content .float-left,
          .article-content .float-right {
            float: none !important;
            margin: 1.5rem auto !important;
            display: block !important;
            width: 100% !important;
          }
        }
      `}</style>
      {renderContent()}
    </div>
  )
}