"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Trash2, ChevronUp, ChevronDown, Type, Image as ImageIcon, Quote, List, Code, Heading } from "lucide-react"
import ImageBlockEditor from './image-block-editor'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Block {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'quote' | 'list'
  content?: any
  level?: number
  format?: 'ordered' | 'unordered'
  // Image block specific fields
  imageId?: number
  imageUrl?: string
  caption?: string
  alt?: string
  position?: 'left' | 'right' | 'center' | 'full'
  width?: '30' | '40' | '50' | '60' | '100'
  showCaption?: boolean
  rounded?: boolean
  shadow?: boolean
  pairWithNext?: boolean
}

interface SimpleBlocksEditorProps {
  content: Block[] | any
  existingImages?: any[]
  onChange: (content: any, images?: any[]) => void
}

export default function SimpleBlocksEditor({ content, existingImages, onChange }: SimpleBlocksEditorProps) {
  // Handle various content types
  const initialBlocks: Block[] = (() => {
    const textBlocks: Block[] = []

    // Process text content first
    if (Array.isArray(content) && content.length > 0) {
      // Check if content is already in Strapi format
      if (content[0]?.children) {
        // Convert from Strapi format to blocks
        content.forEach((item, index) => {
          const textContent = item.children?.[0]?.text || ''
          if (item.type === 'heading') {
            textBlocks.push({ id: String(index), type: 'heading' as const, content: textContent, level: item.level || 2 })
          }
          else if (item.type === 'list') {
            const items = item.children?.map((child: any) => child.children?.[0]?.text || '') || []
            textBlocks.push({ id: String(index), type: 'list' as const, content: items, format: item.format })
          }
          else if (item.type === 'quote') {
            textBlocks.push({ id: String(index), type: 'quote' as const, content: { text: textContent } })
          }
          else {
            textBlocks.push({ id: String(index), type: 'paragraph' as const, content: textContent })
          }
        })
      } else {
        textBlocks.push(...content)
      }
    }
    else if (typeof content === 'string' && content) {
      textBlocks.push({ id: '1', type: 'paragraph', content })
    }
    else if (content && typeof content === 'object' && !Array.isArray(content)) {
      textBlocks.push({ id: '1', type: 'paragraph', content: JSON.stringify(content) })
    }
    else {
      textBlocks.push({ id: '1', type: 'paragraph', content: '' })
    }

    // Add existing images as blocks
    const imageBlocks: Block[] = existingImages?.map((img, index) => {
      const imageData = img.image?.data?.attributes || img.image?.attributes || img.image || {}
      const imageUrl = imageData.url || img.imageUrl || img.url

      return {
        id: `img-${index}`,
        type: 'image' as const,
        imageId: img.image?.id || img.image?.data?.id || img.imageId,
        imageUrl: imageUrl,
        caption: img.caption || '',
        alt: img.alt || '',
        position: img.position || 'left',
        width: img.width || '50',
        showCaption: img.showCaption !== false,
        rounded: img.rounded !== false,
        shadow: img.shadow !== false,
        pairWithNext: img.pairWithNext === true
      }
    }) || []

    // Merge text blocks and image blocks
    // Insert images at appropriate positions
    if (imageBlocks.length > 0) {
      const combinedBlocks = [...textBlocks]
      // Insert first image after first paragraph if it exists
      if (combinedBlocks.length > 1) {
        combinedBlocks.splice(1, 0, imageBlocks[0])
        // Add remaining images at intervals
        for (let i = 1; i < imageBlocks.length; i++) {
          const insertIndex = Math.min(2 + i * 2, combinedBlocks.length)
          combinedBlocks.splice(insertIndex, 0, imageBlocks[i])
        }
      } else {
        // If only one text block, add images at the end
        combinedBlocks.push(...imageBlocks)
      }
      return combinedBlocks
    }

    return textBlocks
  })()

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  // Helper function to convert blocks to Strapi Blocks format
  const convertToStrapiFormat = (blocks: Block[]) => {
    // Filter out image blocks - they'll be handled separately
    const textBlocks = blocks.filter(block => block.type !== 'image')

    return textBlocks.map(block => {
      if (block.type === 'paragraph') {
        return {
          type: 'paragraph',
          children: [{ type: 'text', text: block.content || '' }]
        }
      }
      if (block.type === 'heading') {
        return {
          type: 'heading',
          level: block.level || 2,
          children: [{ type: 'text', text: block.content || '' }]
        }
      }
      if (block.type === 'list') {
        const items = Array.isArray(block.content) ? block.content : []
        return {
          type: 'list',
          format: block.format || 'unordered',
          children: items.filter(Boolean).map((item: any) => ({
            type: 'list-item',
            children: [{ type: 'text', text: String(item) }]
          }))
        }
      }
      if (block.type === 'quote') {
        const text = typeof block.content === 'object' ? block.content?.text || '' : block.content || ''
        return {
          type: 'quote',
          children: [{ type: 'text', text: String(text) }]
        }
      }
      // Default to paragraph
      return {
        type: 'paragraph',
        children: [{ type: 'text', text: typeof block.content === 'string' ? block.content : '' }]
      }
    })
  }

  // Helper function to extract image blocks for separate handling
  const extractImageBlocks = (blocks: Block[]) => {
    return blocks
      .filter(block => block.type === 'image')
      .map((block, index) => ({
        image: block.imageId,
        caption: block.caption || '',
        alt: block.alt || '',
        position: block.position || 'left',
        width: block.width || '50',
        showCaption: block.showCaption !== false,
        rounded: block.rounded !== false,
        shadow: block.shadow !== false,
        pairWithNext: block.pairWithNext === true
      }))
  }

  // Add new block
  const addBlock = (type: Block['type'], afterId?: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'list' ? [] : type === 'image' ? undefined : '',
      level: type === 'heading' ? 3 : undefined,  // Default to H3 for article sections
      format: type === 'list' ? 'unordered' : undefined,
      // Image block defaults
      ...(type === 'image' && {
        position: 'left',
        width: '50',
        showCaption: true,
        rounded: true,
        shadow: true,
        pairWithNext: false,
        alt: ''
      })
    }

    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      setBlocks(newBlocks)
      onChange(convertToStrapiFormat(newBlocks), extractImageBlocks(newBlocks))
    } else {
      const newBlocks = [...blocks, newBlock]
      setBlocks(newBlocks)
      onChange(convertToStrapiFormat(newBlocks), extractImageBlocks(newBlocks))
    }
  }

  // Update block
  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    )
    setBlocks(newBlocks)
    onChange(convertToStrapiFormat(newBlocks), extractImageBlocks(newBlocks))
  }

  // Delete block
  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return // Keep at least one block
    const newBlocks = blocks.filter(block => block.id !== id)
    setBlocks(newBlocks)
    onChange(convertToStrapiFormat(newBlocks), extractImageBlocks(newBlocks))
  }

  // Move block
  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, removed)
    setBlocks(newBlocks)
    onChange(convertToStrapiFormat(newBlocks), extractImageBlocks(newBlocks))
  }

  // Render block editor
  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case 'image':
        return (
          <ImageBlockEditor
            block={block as any}
            onChange={(updated) => updateBlock(block.id, updated)}
            onRemove={() => deleteBlock(block.id)}
          />
        )
      case 'heading':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select
                value={block.level?.toString()}
                onValueChange={(value) => updateBlock(block.id, { level: parseInt(value) })}
              >
                <SelectTrigger className="w-24 bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
                placeholder="Enter heading text..."
              />
            </div>
          </div>
        )

      case 'paragraph':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
            placeholder="Enter paragraph text..."
          />
        )

      case 'quote':
        return (
          <div className="space-y-2">
            <Textarea
              value={block.content?.text || ''}
              onChange={(e) => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Quote text..."
            />
            <Input
              value={block.content?.author || ''}
              onChange={(e) => updateBlock(block.id, { content: { ...block.content, author: e.target.value } })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Author (optional)..."
            />
          </div>
        )

      case 'list':
        return (
          <div className="space-y-2">
            <Select
              value={block.format}
              onValueChange={(value) => updateBlock(block.id, { format: value as 'ordered' | 'unordered' })}
            >
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unordered">Bullet List</SelectItem>
                <SelectItem value="ordered">Numbered List</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={Array.isArray(block.content) ? block.content.join('\n') : ''}
              onChange={(e) => updateBlock(block.id, { content: e.target.value.split('\n').filter(Boolean) })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter list items (one per line)..."
              rows={5}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Blocks */}
      {blocks.map((block, index) => (
        <Card key={block.id} className="p-4 bg-gray-700/50 border-gray-600">
          <div className="flex items-start gap-3">
            {/* Block Controls */}
            <div className="flex flex-col gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => moveBlock(block.id, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => moveBlock(block.id, 'down')}
                disabled={index === blocks.length - 1}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* Block Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase">
                  {block.type}
                </span>
              </div>
              {renderBlockEditor(block)}
            </div>

            {/* Delete Button */}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-400 hover:text-red-300"
              onClick={() => deleteBlock(block.id)}
              disabled={blocks.length === 1}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Add Block Button */}
          <div className="mt-3 pt-3 border-t border-gray-600">
            <BlockInserter onInsert={(type) => addBlock(type, block.id)} />
          </div>
        </Card>
      ))}

      {/* Add Block at End */}
      {blocks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No content yet. Add your first block:</p>
          <BlockInserter onInsert={(type) => addBlock(type)} />
        </div>
      )}
    </div>
  )
}

// Block Inserter Component
function BlockInserter({ onInsert }: { onInsert: (type: Block['type']) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const blockTypes = [
    { type: 'heading' as const, icon: Type, label: 'Heading' },
    { type: 'paragraph' as const, icon: Type, label: 'Paragraph' },
    { type: 'image' as const, icon: ImageIcon, label: 'Image' },
    { type: 'quote' as const, icon: Quote, label: 'Quote' },
    { type: 'list' as const, icon: List, label: 'List' },
  ]

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-white"
      >
        <Plus className="mr-2 h-3 w-3" />
        Add Block
      </Button>
    )
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {blockTypes.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          onClick={() => {
            onInsert(type)
            setIsOpen(false)
          }}
          className="text-xs"
        >
          <Icon className="mr-1 h-3 w-3" />
          {label}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(false)}
        className="text-xs"
      >
        Cancel
      </Button>
    </div>
  )
}