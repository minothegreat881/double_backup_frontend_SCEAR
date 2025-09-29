"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Save, X, Eye, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  createHistoryArticle,
  updateHistoryArticle,
  uploadArticleImage,
  generateSlug,
  calculateReadingTime,
  type HistoryArticle
} from "@/lib/history-articles-api"
import SimpleBlocksEditor from "./blocks-editor/simple-blocks-editor"
import SidebarComponentsEditor from "./sidebar/sidebar-components-editor"
import MediaLibrary from "../media-library"

interface ArticleEditorProps {
  article: HistoryArticle
  onSave: (article: HistoryArticle) => void
  onCancel: () => void
}

// Helper function to normalize sidebar components from API
function normalizeSidebarComponents(components: any[]): any[] {
  if (!components || !Array.isArray(components)) return []

  return components.map(comp => {
    if (!comp || !comp.__component) return null

    // Normalize timeline component
    if (comp.__component === 'sidebar.timeline') {
      // Ensure events are in the correct structure
      const events = comp.events || comp.data?.events || []
      return {
        ...comp,
        data: {
          events: Array.isArray(events) ? events.filter((e: any) => e && (e.event || e.year)).map((e: any) => ({
            year: String(e?.year || ''),
            event: String(e?.event || '')
          })) : []
        },
        // Remove direct events property to avoid conflicts
        events: undefined
      }
    }

    // Normalize key facts component
    if (comp.__component === 'sidebar.key-facts') {
      // Ensure facts are in the correct structure
      const facts = comp.facts || comp.data?.facts || []
      return {
        ...comp,
        data: {
          facts: Array.isArray(facts) ? facts.filter((f: any) => f && f.title).map((f: any) => ({
            number: parseInt(f?.number) || 0,
            title: String(f?.title || ''),
            description: String(f?.description || '')
          })) : []
        },
        // Remove direct facts property to avoid conflicts
        facts: undefined
      }
    }

    return comp
  }).filter(Boolean)
}

export default function ArticleEditor({
  article,
  onSave,
  onCancel
}: ArticleEditorProps) {
  // Normalize the article data when loading
  const normalizedArticle = {
    ...article,
    sidebarComponents: normalizeSidebarComponents(article.sidebarComponents),
    // Ensure contentImages is always an array
    contentImages: article.contentImages || []
  }

  const [formData, setFormData] = useState<HistoryArticle>(normalizedArticle)
  const [isSaving, setIsSaving] = useState(false)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<'hero' | 'seo' | 'main'>('hero')
  const { toast } = useToast()

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && (!formData.slug || formData.slug.startsWith('new-article'))) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }))
    }
  }, [formData.title])

  // Calculate reading time when content changes
  useEffect(() => {
    const readingTime = calculateReadingTime(formData.mainContent)
    setFormData(prev => ({
      ...prev,
      readingTime
    }))
  }, [formData.mainContent])

  // Handle form field changes
  const handleFieldChange = (field: keyof HistoryArticle, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle save
  const handleSave = async () => {
    // Validate required fields
    if (!formData.title) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    // Generate slug if missing
    if (!formData.slug) {
      formData.slug = generateSlug(formData.title)
    }

    // Clean up sidebar components - remove empty entries
    if (formData.sidebarComponents && Array.isArray(formData.sidebarComponents)) {
      // First, deep clean any existing data
      const deepCleanComponents = (components: any[]) => {
        return components.map(comp => {
          if (!comp || !comp.__component) return null

          const cleaned: any = {
            ...comp,
            __component: comp.__component
          }

          // Handle timeline
          if (comp.__component === 'sidebar.timeline') {
            // Get events from the correct location (should be in data.events after normalization)
            const events = comp.data?.events || []
            const cleanedEvents: any[] = []

            for (const event of events) {
              if (!event) continue
              // Keep event if it has either year or event field with content
              const eventText = String(event.event || '').trim()
              const yearText = String(event.year || '').trim()

              // Only require that at least one field has content
              if (eventText || yearText) {
                cleanedEvents.push({
                  year: yearText,
                  event: eventText
                })
              }
            }

            if (cleanedEvents.length > 0) {
              // Ensure proper structure for API
              cleaned.data = { events: cleanedEvents }
              // Remove any direct events property that might have been added
              delete cleaned.events
            } else {
              return null
            }
          }

          // Handle key facts
          else if (comp.__component === 'sidebar.key-facts') {
            // Get facts from the correct location (should be in data.facts after normalization)
            const facts = comp.data?.facts || []
            const cleanedFacts: any[] = []

            for (const fact of facts) {
              if (!fact) continue
              // Only add if title field has content
              const titleText = String(fact.title || '').trim()

              if (titleText) {
                cleanedFacts.push({
                  number: parseInt(fact.number) || 0,
                  title: titleText,
                  description: String(fact.description || '').trim()
                })
              }
            }

            if (cleanedFacts.length > 0) {
              // Ensure proper structure for API
              cleaned.data = { facts: cleanedFacts }
              // Remove any direct facts property that might have been added
              delete cleaned.facts
            } else {
              return null
            }
          }

          return cleaned
        }).filter(comp => comp !== null)
      }

      formData.sidebarComponents = deepCleanComponents(formData.sidebarComponents)

      // Double check - remove any component that still might have invalid data
      formData.sidebarComponents = formData.sidebarComponents.filter(comp => {
        if (comp.__component === 'sidebar.timeline') {
          // Allow timeline if it has at least one valid event (with year OR event)
          return comp.data?.events?.length > 0 &&
                 comp.data.events.some((e: any) => e && (e.event || e.year))
        }
        if (comp.__component === 'sidebar.key-facts') {
          // Require at least one fact with a title
          return comp.data?.facts?.length > 0 &&
                 comp.data.facts.some((f: any) => f && f.title)
        }
        return true
      })

      // Final validation log
      console.log('=== FINAL CLEANED DATA ===')
      console.log('sidebarComponents:', JSON.stringify(formData.sidebarComponents, null, 2))

      // If still having issues, just filter out problematic components entirely
      if (formData.sidebarComponents.length === 0) {
        // If no valid components, set to empty array
        formData.sidebarComponents = []
      }
    } else {
      // Ensure sidebarComponents is at least an empty array
      formData.sidebarComponents = []
    }

    setIsSaving(true)

    try {
      let savedArticle: HistoryArticle | null

      if (formData.id) {
        // Update existing article - pass documentId if available, otherwise id
        const articleIdentifier = formData.documentId || formData.id
        savedArticle = await updateHistoryArticle(articleIdentifier, formData)
      } else {
        // Create new article - ensure all required fields
        // Remove id and documentId as they should not be sent when creating
        const { id, documentId, createdAt, updatedAt, publishedAt, ...cleanFormData } = formData
        const newArticleData = {
          ...cleanFormData,
          category: formData.category || 'legion-history',
          status: formData.status || 'draft',
          featured: formData.featured ?? false,
          sortOrder: formData.sortOrder ?? 0,
          publishedDate: formData.publishedDate || new Date().toISOString()
        }
        console.log('Article Editor - Creating new article with data:', newArticleData)
        console.log('Article Editor - FormData had id?', formData.id)
        savedArticle = await createHistoryArticle(newArticleData)
      }

      if (savedArticle) {
        toast({
          title: "Success",
          description: "Article saved successfully",
        })
        onSave(savedArticle)
      } else {
        throw new Error("Failed to save article")
      }
    } catch (error) {
      console.error("Error saving article:", error)
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle media selection
  const handleMediaSelect = (imageUrl: string, mediaId?: number) => {
    // For Strapi relations, we need to pass the media ID directly
    // The API will handle converting this to proper relation format
    if (mediaTarget === 'hero') {
      handleFieldChange('heroImage', mediaId || undefined)
    } else if (mediaTarget === 'seo') {
      handleFieldChange('seoImage', mediaId || undefined)
    } else if (mediaTarget === 'main') {
      handleFieldChange('mainImage', mediaId || undefined)
    }
    setIsMediaLibraryOpen(false)
  }

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const uploadedImage = await uploadArticleImage(file)
      if (uploadedImage) {
        // Pass the uploaded image ID to handleMediaSelect
        handleMediaSelect(uploadedImage.url, uploadedImage.id)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="h-full bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {formData.id ? 'Edit Article' : 'New Article'}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-red-800 text-white hover:bg-red-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="general" className="h-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Title */}
              <div className="col-span-2">
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter article title"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug" className="text-white">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleFieldChange('slug', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="article-slug"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleFieldChange('category', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auxiliary-forces">Auxiliary Forces</SelectItem>
                    <SelectItem value="legion-history">Legion History</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="tactics">Tactics</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="archaeology">Archaeology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subtitle */}
              <div className="col-span-2">
                <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle || ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Brief description of the article"
                />
              </div>

              {/* Published Date */}
              <div>
                <Label className="text-white">Published Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white",
                        !formData.publishedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.publishedDate ? (
                        format(new Date(formData.publishedDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.publishedDate ? new Date(formData.publishedDate) : undefined}
                      onSelect={(date) => handleFieldChange('publishedDate', date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-white">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleFieldChange('status', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured */}
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleFieldChange('featured', checked)}
                />
                <Label htmlFor="featured" className="text-white">Featured Article</Label>
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author" className="text-white">Author</Label>
                <Input
                  id="author"
                  value={formData.author || ''}
                  onChange={(e) => handleFieldChange('author', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Article author"
                />
              </div>

              {/* Sort Order */}
              <div>
                <Label htmlFor="sortOrder" className="text-white">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleFieldChange('sortOrder', parseInt(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Hero Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Hero Section</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-white">Hero Image</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMediaTarget('hero')
                        setIsMediaLibraryOpen(true)
                      }}
                      className="flex-1"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {formData.heroImage?.url ? 'Change Image' : 'Select Image'}
                    </Button>
                    {formData.heroImage?.url && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFieldChange('heroImage', null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {formData.heroImage?.url && (
                    <img
                      src={formData.heroImage.url}
                      alt="Hero"
                      className="mt-2 rounded-lg w-full h-48 object-cover"
                    />
                  )}
                </div>

                <div className="col-span-2">
                  <Label className="text-white">Main Image (Article Featured Image)</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMediaTarget('main')
                        setIsMediaLibraryOpen(true)
                      }}
                      className="flex-1"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {formData.mainImage?.url ? 'Change Main Image' : 'Select Main Image'}
                    </Button>
                    {formData.mainImage?.url && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFieldChange('mainImage', null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {formData.mainImage?.url && (
                    <img
                      src={formData.mainImage.url}
                      alt="Main"
                      className="mt-2 rounded-lg w-full h-48 object-cover"
                    />
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="heroTitle" className="text-white">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={formData.heroTitle || ''}
                    onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Hero section title"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="heroDescription" className="text-white">Hero Description</Label>
                  <Textarea
                    id="heroDescription"
                    value={formData.heroDescription || ''}
                    onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Hero section description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="h-full">
            <SimpleBlocksEditor
              content={formData.mainContent || []}
              existingImages={formData.contentImages || []}
              onChange={(content, images) => {
                handleFieldChange('mainContent', content)
                // Only set contentImages if there are actual images
                if (images && images.length > 0) {
                  handleFieldChange('contentImages', images)
                } else {
                  // Clear contentImages if no images
                  handleFieldChange('contentImages', [])
                }
              }}
            />
          </TabsContent>

          {/* Sidebar Tab */}
          <TabsContent value="sidebar" className="h-full">
            <SidebarComponentsEditor
              components={formData.sidebarComponents || []}
              onChange={(components) => handleFieldChange('sidebarComponents', components)}
            />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="seoTitle" className="text-white">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle || ''}
                  onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="SEO optimized title (max 60 characters)"
                  maxLength={60}
                />
                <span className="text-xs text-gray-400">
                  {formData.seoTitle?.length || 0}/60 characters
                </span>
              </div>

              <div>
                <Label htmlFor="seoDescription" className="text-white">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription || ''}
                  onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="SEO meta description (max 160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <span className="text-xs text-gray-400">
                  {formData.seoDescription?.length || 0}/160 characters
                </span>
              </div>

              <div>
                <Label className="text-white">SEO Image</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMediaTarget('seo')
                      setIsMediaLibraryOpen(true)
                    }}
                    className="flex-1"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {formData.seoImage?.url ? 'Change Image' : 'Select Image'}
                  </Button>
                  {formData.seoImage?.url && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleFieldChange('seoImage', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {formData.seoImage?.url && (
                  <img
                    src={formData.seoImage.url}
                    alt="SEO"
                    className="mt-2 rounded-lg w-full h-48 object-cover"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="tags" className="text-white">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Comma separated tags"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Media Library Modal */}
      <MediaLibrary
        open={isMediaLibraryOpen}
        onOpenChange={setIsMediaLibraryOpen}
        onSelectImage={handleMediaSelect}
      />
    </Card>
  )
}