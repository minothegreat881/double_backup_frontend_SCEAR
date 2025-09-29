"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Save, X, FolderPlus, ImageIcon, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import MediaLibrary from "./media-library"
import { fetchGalleryPhotos, uploadGalleryPhoto, deleteGalleryPhoto, updateGalleryPhoto } from "@/lib/strapi-api"
import { createImagePreviewWithoutRotation, stripEXIFData } from "@/lib/image-utils"

type GalleryItem = {
  id: number
  documentId: string
  title: string
  alt: string
  description?: string
  location?: string
  activity?: string
  imageUrl: string
  category: string
  featured: boolean
  date: string
}

const initialGallery: GalleryItem[] = []

const initialCategories = ["Equipment", "Training", "Military", "Reenactments", "Festivals", "Culture", "Camps"]

export default function GalleryManager() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Partial<GalleryItem>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const loadGalleryData = async () => {
    try {
      const photos = await fetchGalleryPhotos()
      const galleryItems: GalleryItem[] = photos.map(photo => ({
        id: photo.id,
        documentId: photo.documentId,
        title: photo.alt,
        alt: photo.alt,
        description: photo.activity,
        location: photo.location,
        activity: photo.activity,
        imageUrl: photo.src,
        category: photo.category,
        featured: photo.featured || false,
        date: new Date().toISOString().split("T")[0],
      }))
      setGallery(galleryItems)
    } catch (error) {
      console.error('Error loading gallery:', error)
      setGallery(initialGallery)
    }
  }

  useEffect(() => {
    loadGalleryData()
    setCategories(initialCategories)
  }, [])

  // Data is now managed by Strapi, no need for localStorage

  const handleEditItem = (item: GalleryItem) => {
    setFormData(item)
    setIsEditing(item.documentId)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setFormData({
      title: "",
      alt: "",
      description: "",
      location: "",
      activity: "",
      imageUrl: "",
      category: categories[0],
      featured: false,
      date: new Date().toISOString().split("T")[0],
    })
    setIsEditing(null)
    setIsAddingNew(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setIsAddingNew(false)
    setFormData({})
    setSelectedFile(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }))
    setIsMediaLibraryOpen(false)
  }

  const handleSaveItem = async () => {
    if (!formData.title || !formData.alt || !formData.imageUrl || !formData.category) {
      toast({ title: "Missing required fields: title, alt text, image, and category", variant: "destructive" })
      return
    }

    setUploading(true)

    try {
      if (isAddingNew && selectedFile) {
        // Upload new image to Strapi
        const photoData = {
          file: selectedFile,
          title: formData.title || '',
          alt: formData.alt || '',
          description: formData.description || '',
          location: formData.location || '',
          activity: formData.activity || '',
          category: formData.category || 'Equipment',
          featured: formData.featured || false,
        }

        const result = await uploadGalleryPhoto(photoData)
        
        if (result) {
          toast({ title: "Image uploaded to Strapi successfully!" })
          
          // Reload gallery data to show the new image
          const photos = await fetchGalleryPhotos()
          const galleryItems: GalleryItem[] = photos.map(photo => ({
            id: photo.id,
            documentId: photo.documentId,
            title: photo.alt,
            alt: photo.alt,
            description: photo.activity,
            location: photo.location,
            activity: photo.activity,
            imageUrl: photo.src,
            category: photo.category,
            featured: photo.featured || false,
            date: new Date().toISOString().split("T")[0],
          }))
          setGallery(galleryItems)
        } else {
          toast({ title: "Failed to upload to Strapi", variant: "destructive" })
        }
      } else if (isEditing) {
        // Update using Strapi API
        const updateData = {
          title: formData.title || '',
          alt: formData.alt || '',
          description: formData.description || '',
          location: formData.location || '',
          activity: formData.activity || '',
          category: formData.category || 'Equipment',
          featured: formData.featured || false,
        }
        
        const result = await updateGalleryPhoto(isEditing, updateData)
        if (result) {
          await loadGalleryData()
          toast({ title: "Image updated successfully" })
        } else {
          toast({ title: "Failed to update image", variant: "destructive" })
        }
      }

      // Clean up
      setSelectedFile(null)
      handleCancelEdit()
    } catch (error) {
      console.error('Error saving image:', error)
      toast({ title: "Error saving image", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const confirmDelete = (itemDocumentId: string) => {
    setItemToDelete(itemDocumentId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      const success = await deleteGalleryPhoto(itemToDelete)
      if (success) {
        // Reload fresh data from Strapi after delete
        await loadGalleryData()
        setIsDeleteDialogOpen(false)
        setItemToDelete(null)
        toast({ title: "Image deleted successfully" })
      } else {
        toast({ 
          title: "Delete failed", 
          description: "Failed to delete image from server",
          variant: "destructive" 
        })
      }
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory.trim())) {
      toast({ title: "Invalid category name", variant: "destructive" })
      return
    }
    setCategories([...categories, newCategory.trim()])
    setNewCategory("")
    setIsAddCategoryDialogOpen(false)
    toast({ title: "Category added" })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const originalFile = files[0] // Take only the first file
    
    try {
      console.log(`🔥 PROCESSING IMAGE WITHOUT ROTATION: ${originalFile.name}`)
      
      // KROK 1: Vytvoríme preview bez EXIF rotácie
      const imageUrl = await createImagePreviewWithoutRotation(originalFile)
      
      // KROK 2: Odstránime EXIF dáta z file pre upload
      const cleanFile = await stripEXIFData(originalFile)
      
      // Store the CLEAN file (bez EXIF) pre upload
      setSelectedFile(cleanFile)
      
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl,
        title: prev.title || originalFile.name.replace(/\.[^/.]+$/, ""),
        alt: prev.alt || originalFile.name.replace(/\.[^/.]+$/, "")
      }))
      
      toast({ 
        title: "Image processed", 
        description: `${originalFile.name} ready (EXIF removed)` 
      })
    } catch (error) {
      console.error('Error processing file:', error)
      toast({ 
        title: "Processing failed", 
        description: `Failed to process ${originalFile?.name}`,
        variant: "destructive" 
      })
    }
    
    // Reset file input
    if (fileInputRef) {
      fileInputRef.value = ''
    }
  }

  const triggerFileUpload = () => {
    fileInputRef?.click()
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Hidden file input */}
      <input
        type="file"
        ref={setFileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Gallery</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button onClick={handleAddNew} className="bg-red-800 hover:bg-red-900">
            <Plus className="mr-2 h-4 w-4" /> Add New Image
          </Button>
        </div>
      </div>

      {(isEditing || isAddingNew) && (
        <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">{isAddingNew ? "Add New Image" : "Edit Image"}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">Title*</label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title || ""} 
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="alt" className="text-sm font-medium text-gray-700">Alt Text*</label>
                  <Input 
                    id="alt" 
                    name="alt" 
                    value={formData.alt || ""} 
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location || ""} 
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="activity" className="text-sm font-medium text-gray-700">Activity</label>
                  <Input 
                    id="activity" 
                    name="activity" 
                    value={formData.activity || ""} 
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-gray-700">Category*</label>
                  <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="date">Date</label>
                  <Input id="date" name="date" type="date" value={formData.date || ""} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label>Image*</label>
                  <div className="relative aspect-video w-full border rounded-md overflow-hidden">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{ imageOrientation: 'none' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-stone-100">
                        <ImageIcon className="h-12 w-12 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="bg-green-700 hover:bg-green-800 text-white border-green-700"
                      onClick={triggerFileUpload}
                    >
                      <Upload className="mr-1 h-3 w-3" /> Upload from PC
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => setIsMediaLibraryOpen(true)}
                    >
                      Select from Library
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              className="bg-red-800 hover:bg-red-900" 
              onClick={handleSaveItem}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Image
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden bg-white border border-gray-200 shadow-sm">
            <div className="relative h-48">
              <img 
                src={item.imageUrl || "/placeholder.svg"} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ imageOrientation: 'none' }}
              />
            </div>
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">{item.title}</CardTitle>
              <CardDescription className="text-gray-600">{item.category}</CardDescription>
            </CardHeader>
            <CardContent className="bg-white">
              <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 bg-transparent"
                onClick={() => confirmDelete(item.documentId)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white text-gray-900 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="bg-white text-gray-900 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
              placeholder="Category name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaLibrary open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen} onSelectImage={handleImageSelect} />
    </div>
  )
}
