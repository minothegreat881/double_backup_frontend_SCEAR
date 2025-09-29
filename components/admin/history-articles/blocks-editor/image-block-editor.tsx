"use client"

import React, { useState, useCallback } from 'react'
import { ImageIcon, Upload, Trash2, AlignLeft, AlignCenter, AlignRight, Maximize, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageBlock {
  id?: string
  type: 'image'
  imageId?: number
  imageUrl?: string
  caption?: string
  alt: string
  position: 'left' | 'right' | 'center' | 'full'
  width: '30' | '40' | '50' | '60' | '100'
  showCaption?: boolean
  rounded?: boolean
  shadow?: boolean
  pairWithNext?: boolean
}

interface ImageBlockEditorProps {
  block: ImageBlock
  onChange: (block: ImageBlock) => void
  onRemove: () => void
}

export default function ImageBlockEditor({
  block,
  onChange,
  onRemove
}: ImageBlockEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  // Initialize block with defaults
  const currentBlock: ImageBlock = {
    type: 'image',
    position: 'left',
    width: '50',
    alt: '',
    showCaption: true,
    rounded: true,
    shadow: true,
    ...block
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    setUploading(true)

    try {
      // Use RAW upload endpoint to preserve quality and orientation
      const formData = new FormData()
      formData.append('files', file)

      console.log('🚀 Uploading image via RAW upload endpoint...')
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1341'}/api/raw-upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const uploadedFiles = await response.json()
      console.log('📦 Raw upload response:', uploadedFiles)
      console.log('📦 Raw upload response details:', JSON.stringify(uploadedFiles, null, 2))

      if (!uploadedFiles || uploadedFiles.length === 0) {
        console.error('❌ Upload response was empty or invalid:', uploadedFiles)
        throw new Error('No file was uploaded - response was empty')
      }

      const imageFile = uploadedFiles[0]
      console.log('✅ Image uploaded successfully:', imageFile)
      console.log('🔍 Image details - ID:', imageFile?.id, 'URL:', imageFile?.url)

      // Check if the image actually has required data
      if (!imageFile.id || !imageFile.url) {
        console.error('❌ Invalid image data:', imageFile)
        throw new Error('Upload response missing id or url')
      }

      // Update block with uploaded image data
      onChange({
        ...currentBlock,
        imageId: imageFile.id,
        imageUrl: imageFile.url.startsWith('http')
          ? imageFile.url
          : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1341'}${imageFile.url}`,
        alt: currentBlock.alt || file.name.replace(/\.[^/.]+$/, '')
      })

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully"
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const getPreviewStyles = () => {
    const position = currentBlock.position
    const width = currentBlock.width

    if (position === 'full' || width === '100') {
      return 'w-full'
    }

    const widthClasses = {
      '30': 'w-[30%]',
      '40': 'w-[40%]',
      '50': 'w-[50%]',
      '60': 'w-[60%]'
    }

    const positionClasses = {
      'left': 'float-left mr-4',
      'right': 'float-right ml-4',
      'center': 'mx-auto'
    }

    return cn(
      widthClasses[width as keyof typeof widthClasses],
      positionClasses[position as keyof typeof positionClasses]
    )
  }

  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-blue-400" />
          <span className="font-semibold text-white">Image Block</span>
        </div>
        <Button
          onClick={onRemove}
          size="sm"
          variant="ghost"
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Upload/Preview */}
      <div className="mb-4">
        {currentBlock.imageUrl ? (
          <div className="relative group">
            {/* Preview with position styles */}
            <div className={cn("relative", getPreviewStyles())}>
              <Image
                src={currentBlock.imageUrl}
                alt={currentBlock.alt || 'Article image'}
                width={800}
                height={600}
                className={cn(
                  "w-full h-auto",
                  currentBlock.rounded && "rounded-lg",
                  currentBlock.shadow && "shadow-lg"
                )}
                style={{ objectFit: 'cover' }}
              />
              {currentBlock.showCaption && currentBlock.caption && (
                <p className="text-sm text-gray-400 mt-2 italic">{currentBlock.caption}</p>
              )}
            </div>

            {/* Change/Remove overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button size="sm" variant="secondary">
                  Change Image
                </Button>
              </label>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onChange({ ...currentBlock, imageId: undefined, imageUrl: undefined })}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500",
              uploading && "pointer-events-none opacity-50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`image-upload-${block.id || 'new'}`}
              disabled={uploading}
            />

            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-2" />
                <p className="text-gray-400">Uploading image...</p>
              </div>
            ) : (
              <label
                htmlFor={`image-upload-${block.id || 'new'}`}
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Position Controls */}
      <div className="space-y-4">
        {/* Position */}
        <div>
          <Label className="text-white mb-2">Position</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'left', icon: AlignLeft, label: 'Left' },
              { value: 'center', icon: AlignCenter, label: 'Center' },
              { value: 'right', icon: AlignRight, label: 'Right' },
              { value: 'full', icon: Maximize, label: 'Full' }
            ].map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={currentBlock.position === value ? 'default' : 'outline'}
                onClick={() => {
                  const updates: Partial<ImageBlock> = { position: value as any }
                  if (value === 'full') {
                    updates.width = '100'
                  } else if (currentBlock.width === '100') {
                    updates.width = '50'
                  }
                  onChange({ ...currentBlock, ...updates })
                }}
                className={cn(
                  "flex flex-col gap-1 h-auto py-2",
                  currentBlock.position === value
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "text-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Width (not for full position) */}
        {currentBlock.position !== 'full' && (
          <div>
            <Label className="text-white mb-2">Width</Label>
            <Select
              value={currentBlock.width}
              onValueChange={(value) => onChange({ ...currentBlock, width: value as any })}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30% width</SelectItem>
                <SelectItem value="40">40% width</SelectItem>
                <SelectItem value="50">50% width (recommended)</SelectItem>
                <SelectItem value="60">60% width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Alt Text */}
        <div>
          <Label htmlFor="alt" className="text-white mb-2">Alt Text (required for SEO)</Label>
          <Input
            id="alt"
            value={currentBlock.alt}
            onChange={(e) => onChange({ ...currentBlock, alt: e.target.value })}
            placeholder="Describe the image for accessibility..."
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        {/* Caption */}
        <div>
          <Label htmlFor="caption" className="text-white mb-2">Caption</Label>
          <Textarea
            id="caption"
            value={currentBlock.caption || ''}
            onChange={(e) => onChange({ ...currentBlock, caption: e.target.value })}
            placeholder="Optional caption for the image..."
            rows={2}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        {/* Style Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showCaption" className="text-white text-sm">Show Caption</Label>
            <Switch
              id="showCaption"
              checked={currentBlock.showCaption}
              onCheckedChange={(checked) => onChange({ ...currentBlock, showCaption: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="rounded" className="text-white text-sm">Rounded</Label>
            <Switch
              id="rounded"
              checked={currentBlock.rounded}
              onCheckedChange={(checked) => onChange({ ...currentBlock, rounded: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="shadow" className="text-white text-sm">Shadow</Label>
            <Switch
              id="shadow"
              checked={currentBlock.shadow}
              onCheckedChange={(checked) => onChange({ ...currentBlock, shadow: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pairWithNext" className="text-white text-sm">Pair with Next</Label>
            <Switch
              id="pairWithNext"
              checked={currentBlock.pairWithNext || false}
              onCheckedChange={(checked) => onChange({ ...currentBlock, pairWithNext: checked })}
            />
          </div>
        </div>
      </div>

      {/* Preview Info */}
      {currentBlock.imageUrl && (
        <div className="mt-4 p-3 bg-gray-700/50 rounded text-xs text-gray-400">
          <p>💡 <strong>Text Wrapping:</strong></p>
          <ul className="ml-5 mt-1 space-y-1">
            {currentBlock.position === 'left' && <li>• Text will flow around the right side</li>}
            {currentBlock.position === 'right' && <li>• Text will flow around the left side</li>}
            {currentBlock.position === 'center' && <li>• Image will be centered with text above and below</li>}
            {currentBlock.position === 'full' && <li>• Full width image with text above and below</li>}
            {currentBlock.pairWithNext && <li>• <strong className="text-blue-400">Will pair with next image if positions are opposite (left+right)</strong></li>}
          </ul>
        </div>
      )}
    </Card>
  )
}