"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Trash2, Upload } from "lucide-react"
import Image from "next/image"

interface ImageBlock {
  id: string
  url: string
  position: "left" | "right" | "center" | "full"
  size: "small" | "medium" | "large"
  caption?: string
  alt: string
  wrapText?: boolean
}

interface RichContentEditorProps {
  content: string
  setContent: (content: string) => void
  imageBlocks: ImageBlock[]
  setImageBlocks: (blocks: ImageBlock[]) => void
}

export default function RichContentEditor({
  content,
  setContent,
  imageBlocks,
  setImageBlocks
}: RichContentEditorProps) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'scear_preset')

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dii0wl9ke/image/upload',
        {
          method: 'POST',
          body: formData
        }
      )

      if (response.ok) {
        const data = await response.json()

        const newImage: ImageBlock = {
          id: `img-${Date.now()}`,
          url: data.secure_url,
          position: "left",
          size: "medium",
          alt: file.name,
          caption: "",
          wrapText: true
        }

        setImageBlocks([...imageBlocks, newImage])
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const updateImageBlock = (id: string, updates: Partial<ImageBlock>) => {
    setImageBlocks(
      imageBlocks.map(img =>
        img.id === id ? { ...img, ...updates } : img
      )
    )
  }

  const deleteImageBlock = (id: string) => {
    setImageBlocks(imageBlocks.filter(img => img.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Rich Text Content</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] font-mono"
          placeholder="Enter rich text content (HTML supported)..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium">Image Blocks</label>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Add Image'}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <div className="space-y-4">
          {imageBlocks.map((img) => (
            <Card key={img.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Select
                    value={img.position}
                    onValueChange={(value) => updateImageBlock(img.id, { position: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={img.size}
                    onValueChange={(value) => updateImageBlock(img.id, { size: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Alt text"
                    value={img.alt}
                    onChange={(e) => updateImageBlock(img.id, { alt: e.target.value })}
                  />

                  <Input
                    placeholder="Caption (optional)"
                    value={img.caption || ''}
                    onChange={(e) => updateImageBlock(img.id, { caption: e.target.value })}
                  />

                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={img.wrapText !== false}
                        onChange={(e) => updateImageBlock(img.id, { wrapText: e.target.checked })}
                      />
                      <span className="text-sm">Allow text wrapping</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteImageBlock(img.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}