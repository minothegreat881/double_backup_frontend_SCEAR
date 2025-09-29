"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Plus, Edit2, Trash2, MapPin, Clock } from "lucide-react"
import { fetchActivities, createActivity, updateActivity, deleteActivity, ActivityData } from '@/lib/strapi-api'

interface ActivityFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  locationName: string
  locationAddress: string
  coordinates?: { latitude: number; longitude: number }
  category: 'training' | 'meeting' | 'workshop' | 'introduction'
  file?: File
}

const defaultFormData: ActivityFormData = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  locationName: '',
  locationAddress: '',
  coordinates: undefined,
  category: 'training',
  file: undefined
}

// Map frontend categories to backend Slovak enum values
const categoryMapping = {
  'training': 'Týždenný tréning',
  'meeting': 'Stretnutie skupiny',
  'workshop': 'Workshop',
  'introduction': 'Príprava výstroja'
} as const

// Reverse mapping for displaying backend values in frontend
const categoryReverseMapping = {
  'Týždenný tréning': 'training',
  'Stretnutie na Devíne': 'meeting',
  'Workshop': 'workshop',
  'Príprava výstroja': 'introduction',
  'Stretnutie skupiny': 'meeting',
  'Špeciálny tréning': 'training'
} as const

export default function ActivitiesManager() {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [formData, setFormData] = useState<ActivityFormData>(defaultFormData)
  const [editingActivity, setEditingActivity] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const data = await fetchActivities()
      setActivities(data)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date.toISOString() }))
    }
  }

  const handleInputChange = (field: keyof ActivityFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): string[] => {
    const errors: string[] = []
    
    if (!formData.title.trim()) errors.push('Title is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.startDate) errors.push('Start date is required')
    if (!formData.endDate) errors.push('End date is required')
    if (!formData.locationName.trim()) errors.push('Location name is required')
    if (!formData.category) errors.push('Category is required')
    
    // Check that end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        errors.push('End date must be after start date')
      }
    }
    
    return errors
  }

  const handleSaveActivity = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'))
      return
    }

    try {
      setLoading(true)
      let result = null
      
      if (editingActivity) {
        // Map frontend category to backend Slovak category before sending
        const mappedFormData = {
          ...formData,
          category: categoryMapping[formData.category] || formData.category
        }
        result = await updateActivity(editingActivity.documentId || editingActivity.id, mappedFormData)
        if (result) {
          console.log('✅ Activity updated successfully')
        } else {
          console.warn('⚠️ Activity update failed - using optimistic update')
        }
      } else {
        // Map frontend category to backend Slovak category before sending
        const mappedFormData = {
          ...formData,
          category: categoryMapping[formData.category] || formData.category
        }
        result = await createActivity(mappedFormData)
        if (result) {
          console.log('✅ Activity created successfully')
        } else {
          console.warn('⚠️ Activity creation failed - API might be unavailable')
          alert('Activity creation failed - the backend might be unavailable. Please try again later or check your connection.')
          return
        }
      }
      
      await loadActivities()
      resetForm()
    } catch (error) {
      console.error('❌ Activity save failed:', error)
      alert('Failed to save activity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditActivity = (activity: ActivityData) => {
    setEditingActivity(activity)
    // Map backend Slovak category to frontend English category for editing
    const mappedCategory = categoryReverseMapping[activity.category] || activity.category
    setFormData({
      title: activity.title,
      description: activity.description,
      startDate: activity.startDate,
      endDate: activity.endDate,
      locationName: activity.location?.name || '',
      locationAddress: activity.location?.address || '',
      coordinates: activity.location?.coordinates ? {
        latitude: activity.location.coordinates[0],
        longitude: activity.location.coordinates[1]
      } : undefined,
      category: mappedCategory as 'training' | 'meeting' | 'workshop' | 'introduction',
      file: undefined
    })
    setShowForm(true)
  }

  const handleDeleteActivity = async (activityId: string | number) => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    try {
      setLoading(true)
      await deleteActivity(activityId)
      console.log('✅ Activity deleted successfully')
      await loadActivities()
    } catch (error) {
      console.error('❌ Activity deletion failed:', error)
      alert('Failed to delete activity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(defaultFormData)
    setEditingActivity(null)
    setShowForm(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training': return 'bg-blue-100 text-blue-800'
      case 'meeting': return 'bg-green-100 text-green-800'
      case 'workshop': return 'bg-purple-100 text-purple-800'
      case 'introduction': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP p')
    } catch {
      return 'Invalid date'
    }
  }

  if (loading && activities.length === 0) {
    return <div className="p-6">Loading activities...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Activities Management</h2>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Activity Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingActivity ? 'Edit Activity' : 'Create New Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Activity title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Activity description"
                rows={3}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(parseISO(formData.startDate), 'PPP') : 'Pick start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate ? parseISO(formData.startDate) : undefined}
                      onSelect={(d) => handleDateChange("startDate", d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(parseISO(formData.endDate), 'PPP') : 'Pick end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate ? parseISO(formData.endDate) : undefined}
                      onSelect={(d) => handleDateChange("endDate", d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Name *</label>
                <Input
                  value={formData.locationName}
                  onChange={(e) => handleInputChange('locationName', e.target.value)}
                  placeholder="e.g. Sad Janka Kráľa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.locationAddress}
                  onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                  placeholder="Full address (optional)"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="introduction">Introduction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* GPS Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={formData.coordinates?.latitude || ''}
                  onChange={(e) => {
                    const lat = e.target.value ? parseFloat(e.target.value) : undefined
                    setFormData(prev => ({
                      ...prev,
                      coordinates: lat !== undefined ? { 
                        ...prev.coordinates, 
                        latitude: lat,
                        longitude: prev.coordinates?.longitude || 0
                      } : undefined
                    }))
                  }}
                  placeholder="48.1486"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={formData.coordinates?.longitude || ''}
                  onChange={(e) => {
                    const lng = e.target.value ? parseFloat(e.target.value) : undefined
                    setFormData(prev => ({
                      ...prev,
                      coordinates: lng !== undefined ? { 
                        ...prev.coordinates, 
                        longitude: lng,
                        latitude: prev.coordinates?.latitude || 0
                      } : undefined
                    }))
                  }}
                  placeholder="17.1077"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setFormData(prev => ({ ...prev, file }))
                }}
              />
              {formData.file && (
                <p className="text-xs text-gray-500">Selected: {formData.file.name}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSaveActivity} disabled={loading}>
                {loading ? 'Saving...' : (editingActivity ? 'Update' : 'Create')}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No activities yet. Create your first activity!</p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{activity.title}</h3>
                      <Badge className={getCategoryColor(activity.category)}>
                        {activity.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    {activity.image && (
                      <div className="mb-2">
                        <img 
                          src={activity.image} 
                          alt={activity.title}
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(activity.startDate)} - {formatDateTime(activity.endDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.location?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditActivity(activity)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteActivity(activity.documentId || activity.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}