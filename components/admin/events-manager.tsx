"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Clock, MapPin, Plus, Pencil, Trash2, Save, X, ImageIcon, Upload } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import MediaLibrary from "./media-library"
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "@/lib/strapi-api"

// Event type definition (matching Strapi EventData)
type Event = {
  id: number
  documentId?: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: {
    name: string
    address: string
    coordinates: [number, number] // [latitude, longitude]
  }
  image?: string
  category: "reenactment" | "training" | "exhibition" | "workshop" | "meeting"
  recurring?: boolean
  featured?: boolean
}

const initialEvents: Event[] = []

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Partial<Event>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<{id: number, documentId?: string} | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null)
  const { toast } = useToast()

  const loadEventsData = async () => {
    try {
      const eventsData = await fetchEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents(initialEvents)
    }
  }

  useEffect(() => {
    loadEventsData()
  }, [])


  const handleEditEvent = (event: Event) => {
    setFormData(event)
    setIsEditing(event.id)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setFormData({
      title: "",
      description: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: {
        name: "",
        address: "",
        coordinates: [48.669, 19.699],
      },
      image: "",
      category: "reenactment",
    })
    setIsEditing(null)
    setIsAddingNew(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setIsAddingNew(false)
    setFormData({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        [name]: value,
      },
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as "reenactment" | "training" | "exhibition" | "workshop",
    }))
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date.toISOString() }))
    }
  }

  const handleImageSelect = (imageUrl: string, file?: File) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
    if (file) {
      setSelectedFile(file)
    }
    setIsMediaLibraryOpen(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]
      
      // Store the selected file and create preview
      setSelectedFile(file)
      const imageUrl = URL.createObjectURL(file)
      
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
      }))

      toast({ 
        title: "Image selected", 
        description: `${file.name} ready for upload` 
      })
    } catch (error) {
      console.error('Error processing file:', error)
      toast({ 
        title: "Selection failed", 
        description: `Failed to select ${files[0]?.name}`,
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

  const handleSaveEvent = async () => {
    console.log('🚀 SAVE EVENT: selectedFile =', selectedFile)
    console.log('🚀 SAVE EVENT: formData.image =', formData.image)
    
    if (!formData.title || !formData.description || !formData.location?.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      if (isAddingNew) {
        // Create new event via Strapi (same approach as gallery)
        const eventData = {
          title: formData.title || '',
          description: formData.description || '',
          startDate: formData.startDate || new Date().toISOString(),
          endDate: formData.endDate || new Date().toISOString(),
          locationName: formData.location?.name || '',
          locationAddress: formData.location?.address || '',
          coordinates: formData.location?.coordinates ? {
            latitude: formData.location.coordinates[0],
            longitude: formData.location.coordinates[1]
          } : undefined,
          category: formData.category || 'reenactment',
          recurring: formData.recurring || false,
          featured: formData.featured || false,
          file: selectedFile, // Pass file directly like gallery
        }

        const result = await createEvent(eventData)
        if (result) {
          await loadEventsData() // Reload data from Strapi
          toast({ title: "Event created", description: "The new event has been successfully created" })
        } else {
          throw new Error('Failed to create event')
        }
      } else if (isEditing) {
        // Update existing event via Strapi (same approach as gallery)
        const updateData = {
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          locationName: formData.location?.name,
          locationAddress: formData.location?.address,
          coordinates: formData.location?.coordinates ? {
            latitude: formData.location.coordinates[0],
            longitude: formData.location.coordinates[1]
          } : undefined,
          category: formData.category,
          recurring: formData.recurring,
          featured: formData.featured,
          file: selectedFile, // Pass file directly like gallery
        }

        const eventToUpdate = events.find(e => e.id === isEditing)
        const updateId = eventToUpdate?.documentId || isEditing
        const result = await updateEvent(updateId, updateData)
        if (result) {
          await loadEventsData() // Reload data from Strapi
          toast({ title: "Event updated", description: "The event has been successfully updated" })
        } else {
          throw new Error('Failed to update event')
        }
      }

      handleCancelEdit()
    } catch (error) {
      console.error('Error saving event:', error)
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setSelectedFile(null)
    }
  }

  const confirmDelete = (event: Event) => {
    setEventToDelete({id: event.id, documentId: event.documentId})
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        const deleteId = eventToDelete.documentId || eventToDelete.id
        const result = await deleteEvent(deleteId)
        if (result) {
          await loadEventsData() // Reload data from Strapi
          toast({ title: "Event deleted", description: "The event has been successfully deleted" })
        } else {
          throw new Error('Failed to delete event')
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        toast({
          title: "Error",
          description: "Failed to delete event. Please try again.",
          variant: "destructive",
        })
      }
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Hidden file input */}
      <input
        type="file"
        ref={setFileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
        <Button onClick={handleAddNew} className="bg-red-800 hover:bg-red-900">
          <Plus className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>

      {(isEditing || isAddingNew) && (
        <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">{isAddingNew ? "Add New Event" : "Edit Event"}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">Event Title*</label>
                  <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange} className="bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">Description*</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={5}
                    className="bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-gray-700">Category*</label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="reenactment">Reenactment</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label>Image*</label>
                  <div className="relative aspect-video w-full border rounded-md overflow-hidden">
                    {formData.image ? (
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-stone-100">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Start Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(parseISO(formData.startDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-200">
                        <Calendar
                          mode="single"
                          selected={formData.startDate ? parseISO(formData.startDate) : undefined}
                          onSelect={(d) => handleDateChange("startDate", d)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(parseISO(formData.endDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-200">
                        <Calendar
                          mode="single"
                          selected={formData.endDate ? parseISO(formData.endDate) : undefined}
                          onSelect={(d) => handleDateChange("endDate", d)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="locationName" className="text-sm font-medium text-gray-700">Location Name*</label>
                  <Input
                    id="locationName"
                    name="name"
                    value={formData.location?.name || ""}
                    onChange={handleLocationChange}
                    className="bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="locationAddress" className="text-sm font-medium text-gray-700">Location Address*</label>
                  <Input
                    id="locationAddress"
                    name="address"
                    value={formData.location?.address || ""}
                    onChange={handleLocationChange}
                    className="bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude</label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.location?.coordinates?.[0] || ""}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value) || 0
                        const lng = formData.location?.coordinates?.[1] || 0
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            name: prev.location?.name || "",
                            address: prev.location?.address || "",
                            coordinates: [lat, lng] as [number, number]
                          }
                        }))
                      }}
                      placeholder="48.1426"
                      className="bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude</label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.location?.coordinates?.[1] || ""}
                      onChange={(e) => {
                        const lng = parseFloat(e.target.value) || 0
                        const lat = formData.location?.coordinates?.[0] || 0
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            name: prev.location?.name || "",
                            address: prev.location?.address || "",
                            coordinates: [lat, lng] as [number, number]
                          }
                        }))
                      }}
                      placeholder="17.1017"
                      className="bg-white border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-white border-t border-gray-200">
            <Button variant="outline" onClick={handleCancelEdit} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              className="bg-red-800 hover:bg-red-900" 
              onClick={handleSaveEvent}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Event
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden bg-white border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 bg-gray-50 p-4 flex flex-col justify-between border-r border-gray-200">
                <div>
                  <Badge className="mb-2 bg-red-800">{event.category}</Badge>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{event.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {format(parseISO(event.startDate), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {format(parseISO(event.startDate), "h:mm a")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {event.location.name}
                    </div>
                    {event.location.coordinates && (
                      <div className="flex items-center text-xs">
                        <span className="mr-1">📍</span>
                        {event.location.coordinates[0].toFixed(4)}, {event.location.coordinates[1].toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 bg-white border-gray-300 hover:bg-red-50"
                    onClick={() => confirmDelete(event)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
              <div className="md:w-3/4 p-4 bg-white">
                <div className="flex flex-col space-y-4">
                  {event.image && (
                    <div className="w-full">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <p className="text-gray-700">{event.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-600">Are you sure you want to delete this event?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaLibrary open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen} onSelectImage={handleImageSelect} />
    </div>
  )
}
