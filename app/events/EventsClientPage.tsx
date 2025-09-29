"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Camera, MapPin, CalendarIcon, Clock, ChevronRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ModernCalendar from "@/components/modern-calendar"
import DynamicEventMap from "@/components/dynamic-event-map"
import { fetchEvents, type EventData } from "@/lib/strapi-api"
import { eventsData } from "@/lib/events-data"
import { useHeroImage } from "@/hooks/use-hero-images"
import "leaflet/dist/leaflet.css"

export default function EventsClientPage() {
  const searchParams = useSearchParams()
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [events, setEvents] = useState<EventData[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const { heroImage } = useHeroImage('eventsPage')

  // Load events from Strapi with fallback
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        // Try to fetch from Strapi first
        let fetchedEvents: EventData[] = []
        try {
          fetchedEvents = await fetchEvents()
        } catch (error) {
          console.warn('Strapi not available, using fallback data:', error)
          // Convert local events data to EventData format
          fetchedEvents = eventsData.map(event => ({
            ...event,
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
          })) as EventData[]
        }
        setEvents(fetchedEvents)
        
        // Check for event ID from URL query parameter
        const eventIdFromUrl = searchParams.get('event')
        if (eventIdFromUrl) {
          const eventId = parseInt(eventIdFromUrl, 10)
          if (fetchedEvents.find(e => e.id === eventId)) {
            setSelectedEvent(eventId)
          } else if (fetchedEvents.length > 0) {
            setSelectedEvent(fetchedEvents[0].id)
          }
        } else if (fetchedEvents.length > 0) {
          setSelectedEvent(fetchedEvents[0].id)
        }
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [searchParams])

  // Generate map locations
  const mapLocations = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      position: event.location.coordinates as [number, number],
      title: event.title,
      category: event.category,
    }))
  }, [events])

  // Generate calendar events
  const calendarEvents = useMemo(() => {
    return events.map((event, index) => ({
      id: index + 1,
      title: event.title,
      description: event.description,
      location: event.location.name,
      date: new Date(event.startDate),
      endDate: new Date(event.endDate),
      type: event.category,
      parentId: event.id,
    }))
  }, [events])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let filtered = events
    if (filter !== "all") {
      filtered = filtered.filter((event) => event.category === filter)
    }
    setFilteredEvents(filtered)
  }, [filter, events])

  const handleMarkerClick = (eventId: number) => {
    setSelectedEvent(eventId)
  }

  const handleCalendarEventClick = (eventId: number) => {
    const calendarEvent = calendarEvents.find((e) => e.id === eventId)
    if (calendarEvent) {
      setSelectedEvent(calendarEvent.parentId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Načítavam podujatia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Hero Section - Mobile Optimized */}
      <section className="relative w-full min-h-[80vh] sm:min-h-screen md:h-[90vh] md:min-h-[700px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <div className="absolute inset-0 bg-red-900/10 z-10" />
        <Image
          src={heroImage}
          alt="Roman auxiliary forces events"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/20 rounded-full blur-3xl z-10"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/20 rounded-full blur-2xl z-10"></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-red-800/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-2xl">
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl text-red-200 font-semibold drop-shadow-lg">Podujatia a aktivity</h2>
            </div>
            
            {/* Enhanced Title - Progressive Scaling */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-2xl tracking-tight">
              Podujatia
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed drop-shadow-lg mb-4 sm:mb-6 lg:mb-8">
              Pripojte sa k našim nadchádzajúcim rekonštrukciám, tréningom, výstavám a workshopom po celej Európe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - 3 Column Layout */}
      <section className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
        {/* Mobile-First Layout: Stacked on mobile, 3-column on desktop */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:h-[80vh] lg:min-h-[600px]">
          
          {/* Events List - Mobile: full width card, Desktop: 1/3 width with fixed height */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden flex flex-col relative border border-red-800/30 h-auto lg:h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-800 rounded-t-2xl" />
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Podujatia</h2>
              </div>
              <Badge variant="secondary" className="text-xs bg-red-800/20 text-red-400 border border-red-800/30">
                {filteredEvents.length}
              </Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2 scrollbar-thin scrollbar-thumb-red-800 scrollbar-track-gray-200 hover:scrollbar-thumb-red-700 pl-1 pt-1 max-h-[60vh] lg:max-h-none">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/5 backdrop-blur-sm overflow-hidden group border border-red-800/20 hover:border-red-600/40 ${
                    selectedEvent === event.id 
                      ? "shadow-2xl ring-4 ring-red-800/40 scale-105 bg-white/10" 
                      : "shadow-xl hover:shadow-2xl hover:bg-white/8"
                  }`}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <div className="flex flex-col">
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <Image 
                        src={event.image || "/images/gallery/roman-festival.png"} 
                        alt={event.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-colors duration-300" />
                      
                      <Badge
                        className={`absolute top-3 right-3 shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 ${
                          event.category === "training"
                            ? "bg-red-800/90 hover:bg-red-700"
                            : event.category === "meeting"
                              ? "bg-red-800/90 hover:bg-red-700"
                              : "bg-red-800/90 hover:bg-red-700"
                        }`}
                      >
                        ✨ {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                      
                      {event.recurring && (
                        <Badge className="absolute top-3 left-3 bg-red-800/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-110">
                          🔄 Opakujúce sa
                        </Badge>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-800 opacity-70" />
                      
                      <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-white pl-3 relative">
                        {event.title}
                        <div className="absolute -left-1 top-0 w-2 h-full bg-red-800/20 rounded-r" />
                      </h3>
                      
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 pl-3">
                        <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-md border-l-2 border-red-800/30">
                          <CalendarIcon className="h-4 w-4 text-red-700" />
                          <span className="font-medium text-red-800">{event.recurring ? "Recurring event" : new Date(event.startDate).toLocaleDateString('sk-SK')}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-md border-l-2 border-red-800/30">
                          <MapPin className="h-4 w-4 text-red-700" />
                          <span className="font-medium text-red-800">{event.location.name}</span>
                        </div>
                      </div>
                      
                      
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-red-800/5 rounded-tl-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Map and Event Detail - Mobile: hidden, Desktop: 1/3 width with fixed height */}
          <div className="hidden lg:flex bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex-col relative border border-red-800/30 h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-800 rounded-t-2xl" />
            
            {/* Map Section */}
            <div className="h-1/2 flex flex-col">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Mapa</h2>
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                {isClient ? (
                  <DynamicEventMap
                    locations={mapLocations}
                    selectedEventId={selectedEvent}
                    onMarkerClick={handleMarkerClick}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-300">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Event Detail Section */}
            <div className="h-1/2 flex flex-col">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Detail podujatia</h2>
                </div>
              </div>
              
              {selectedEvent && (
                <div className="h-full flex flex-col p-4">
                  {(() => {
                    const event = events.find((e) => e.id === selectedEvent)
                    return event ? (
                      <div className="space-y-4">
                        {/* Compact Photo */}
                        <div className="relative h-24 rounded-xl overflow-hidden group">
                          <Image
                            src={event.image || "/images/gallery/roman-festival.png"}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <Badge
                            className={`absolute top-3 right-3 text-xs font-medium shadow-lg ${
                              event.category === "reenactment" || event.category === "training"
                                ? "bg-red-800 hover:bg-red-900"
                                : event.category === "workshop"
                                  ? "bg-red-800 hover:bg-amber-800"
                                  : "bg-red-800 hover:bg-red-700"
                            } text-white`}
                          >
                            {event.category}
                          </Badge>
                        </div>

                        {/* Event Info */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-white leading-tight">
                            {event.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center text-sm text-gray-300">
                              <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                              {new Date(event.startDate).toLocaleDateString('sk-SK')}
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <Clock className="mr-2 h-4 w-4 text-red-600" />
                              {new Date(event.startDate).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <MapPin className="mr-2 h-4 w-4 text-red-600" />
                            <span>{event.location.name}, {event.location.address}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div className="flex-1 overflow-y-auto max-h-20">
                          <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Compact Map - Shows when event selected on mobile */}
          {selectedEvent && (
            <div className="lg:hidden bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-red-800/30 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-800 rounded-t-2xl" />
              
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Lokácia podujatia</h2>
                </div>
              </div>
              
              <div className="h-64 w-full rounded-xl overflow-hidden bg-gray-100 relative">
                <div className="w-full h-full">
                  {isClient ? (
                    <DynamicEventMap
                      locations={mapLocations.filter(loc => loc.id === selectedEvent)}
                      selectedEventId={selectedEvent}
                      onMarkerClick={handleMarkerClick}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Načítavam mapu...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Event Detail - Shows when event selected on mobile */}
          {selectedEvent && (
            <div className="lg:hidden bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-red-800/30 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-800 rounded-t-2xl" />
              
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Detail podujatia</h2>
                </div>
              </div>
              
              {(() => {
                const event = events.find((e) => e.id === selectedEvent)
                return event ? (
                  <div className="space-y-4">
                    {/* Event Photo */}
                    <div className="relative h-48 rounded-xl overflow-hidden group">
                      <Image
                        src={event.image || "/images/gallery/roman-festival.png"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge
                        className={`absolute top-3 right-3 text-sm font-medium shadow-lg ${
                          event.category === "reenactment" || event.category === "training"
                            ? "bg-red-800 hover:bg-red-900"
                            : event.category === "workshop"
                              ? "bg-red-800 hover:bg-amber-800"
                              : "bg-red-800 hover:bg-red-700"
                        } text-white`}
                      >
                        {event.category}
                      </Badge>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {event.title}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center text-base text-gray-300 p-3 bg-white/5 rounded-lg">
                          <CalendarIcon className="mr-3 h-5 w-5 text-red-600" />
                          {new Date(event.startDate).toLocaleDateString('sk-SK')}
                        </div>
                        <div className="flex items-center text-base text-gray-300 p-3 bg-white/5 rounded-lg">
                          <Clock className="mr-3 h-5 w-5 text-red-600" />
                          {new Date(event.startDate).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center text-base text-gray-300 p-3 bg-white/5 rounded-lg">
                          <MapPin className="mr-3 h-5 w-5 text-red-600" />
                          <span>{event.location.name}, {event.location.address}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-base text-gray-300 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* Categories and Calendar - Mobile: full width, Desktop: 1/3 width with fixed height */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col h-auto lg:h-full relative border border-red-800/30">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-800 rounded-t-2xl" />
            
            {/* Categories Section - Compact for Desktop */}
            <div className="p-3 sm:p-4 lg:p-3">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-800 rounded-md shadow-sm">
                    <span className="text-white text-xs">🏷️</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Kategórie</h3>
                </div>
              </div>
              
              {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:space-y-1.5 lg:overflow-x-visible lg:pb-0">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={`flex-shrink-0 justify-start text-xs h-10 px-4 touch-manipulation lg:w-full lg:h-8 lg:px-3 ${
                    filter === "all" ? "bg-red-800 hover:bg-red-700" : "hover:bg-gray-100"
                  }`}
                >
                  Všetky
                </Button>
                {["reenactment", "training", "exhibition", "workshop", "meeting"].map((category) => (
                  <Button
                    key={category}
                    variant={filter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(category)}
                    className={`flex-shrink-0 justify-start text-xs h-10 px-4 touch-manipulation lg:w-full lg:h-8 lg:px-3 ${
                      filter === category ? "bg-red-800 hover:bg-red-700" : "hover:bg-gray-100"
                    }`}
                  >
                    {category === "reenactment" ? "Rekonštrukcie" :
                     category === "training" ? "Tréningy" :
                     category === "exhibition" ? "Výstavy" :
                     category === "workshop" ? "Workshopy" : "Stretnutia"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar Section - Proportional */}
            <div className="flex-1 p-3 sm:p-4 lg:p-3 overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Kalendár</h2>
                </div>
              </div>
              
              <div className="scale-75 sm:scale-90 lg:scale-85">
                <ModernCalendar
                  events={calendarEvents}
                  onEventClick={handleCalendarEventClick}
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}