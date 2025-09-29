"use client"
import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import { Search, X, Upload, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary, type CloudinaryUploadResponse } from "@/lib/cloudinary-upload"

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1341';
const USE_CLOUDINARY = false; // Use Strapi raw-upload like gallery does

type StrapiMediaFile = {
  id: number
  name: string
  alternativeText?: string
  caption?: string
  width: number
  height: number
  formats?: any
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string
  provider: string
  provider_metadata?: any
  createdAt: string
  updatedAt: string
}

type MediaLibraryProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectImage: (imageUrl: string, mediaId?: number) => void
}

export default function MediaLibrary({ open, onOpenChange, onSelectImage }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [strapiImages, setStrapiImages] = useState<StrapiMediaFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const loadStrapiImages = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('strapi-jwt-token')
      const response = await fetch(`${STRAPI_BASE_URL}/api/upload/files`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      if (response.ok) {
        const images = await response.json()
        setStrapiImages(images.filter((file: any) => file.mime.startsWith('image/')))
      }
    } catch (error) {
      console.error('Error loading Strapi images:', error)
      toast({
        title: 'Error loading images',
        description: 'Failed to load images from Strapi',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadStrapiImages()
    }
  }, [open])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          if (USE_CLOUDINARY) {
            // Upload to Cloudinary
            const cloudinaryResponse = await uploadToCloudinary(file, 'scear/media-library')

            if (cloudinaryResponse) {
              // Convert Cloudinary response to Strapi-like format for compatibility
              const strapiLikeFile: StrapiMediaFile = {
                id: Date.now(), // Temporary ID
                name: file.name,
                alternativeText: file.name.replace(/\.[^/.]+$/, ''),
                width: cloudinaryResponse.width,
                height: cloudinaryResponse.height,
                hash: cloudinaryResponse.public_id,
                ext: `.${cloudinaryResponse.format}`,
                mime: `image/${cloudinaryResponse.format}`,
                size: cloudinaryResponse.bytes / 1024, // Convert to KB
                url: cloudinaryResponse.secure_url,
                provider: 'cloudinary',
                createdAt: cloudinaryResponse.created_at,
                updatedAt: cloudinaryResponse.created_at,
              }

              setStrapiImages(prev => [...prev, strapiLikeFile])

              toast({
                title: 'Image uploaded to Cloudinary',
                description: `${file.name} uploaded successfully`,
              })
            } else {
              throw new Error(`Failed to upload ${file.name} to Cloudinary`)
            }
          } else {
            // Original Strapi upload (won't work without authentication)
            const formData = new FormData()
            formData.append('files', file)

            const response = await fetch(`${STRAPI_BASE_URL}/api/raw-upload`, {
              method: 'POST',
              body: formData,
            })

            if (response.ok) {
              const uploadedFiles = await response.json()
              const uploadedFile = uploadedFiles[0]

              setStrapiImages(prev => [...prev, uploadedFile])

              toast({
                title: 'Image uploaded',
                description: `${file.name} uploaded successfully`,
              })
            } else {
              throw new Error(`Failed to upload ${file.name}`)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }

    // Clear file input
    if (event.target) {
      event.target.value = ''
    }
  }

  const filteredImages = useMemo(() => {
    return strapiImages.filter((image) => {
      const searchLower = searchTerm.toLowerCase()
      const imageName = image.name.toLowerCase()
      const altText = (image.alternativeText || '').toLowerCase()
      return imageName.includes(searchLower) || altText.includes(searchLower)
    })
  }, [searchTerm, strapiImages])

  const handleSelect = (image: StrapiMediaFile) => {
    // Use full Strapi URL
    const imageUrl = image.url.startsWith('http') ? image.url : `${STRAPI_BASE_URL}${image.url}`
    onSelectImage(imageUrl, image.id)
    onOpenChange(false)
  }

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>Upload images from your computer to use in your events.</DialogDescription>
        </DialogHeader>
        
        <div className="flex-shrink-0 space-y-4">
          {/* Upload Button */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Button
              onClick={handleUploadButtonClick}
              disabled={isUploading}
              className="bg-red-800 hover:bg-red-900 text-white disabled:opacity-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </Button>
            <span className="text-sm text-gray-600">
              {strapiImages.length} {strapiImages.length === 1 ? 'image' : 'images'} available
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <Input
              placeholder="Search uploaded images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-grow mt-4 pr-4 -mr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredImages.length === 0 && strapiImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Upload className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images available</h3>
              <p className="text-gray-500 mb-4">Upload images to Strapi to get started.</p>
              <Button
                onClick={handleUploadButtonClick}
                disabled={isUploading}
                className="bg-red-800 hover:bg-red-900 text-white disabled:opacity-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Your First Image'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((image) => {
                const imageUrl = image.url.startsWith('http') ? image.url : `${STRAPI_BASE_URL}${image.url}`
                return (
                  <button
                    key={image.id}
                    onClick={() => handleSelect(image)}
                    className="relative aspect-square rounded-md overflow-hidden group border-2 border-transparent hover:border-red-800 focus:border-red-800 focus:outline-none transition-all"
                  >
                    <Image src={imageUrl} alt={image.alternativeText || image.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-semibold truncate">{image.alternativeText || image.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}