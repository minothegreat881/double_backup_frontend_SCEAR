"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { MapPin, CalendarIcon, Shield, Swords, User } from "lucide-react"
import SimpleMap from "@/components/simple-map"
import ModernCalendar from "@/components/modern-calendar"
import ScrollingFeatureCards from "@/components/scrolling-feature-cards"
import { generateCalendarEvents, generateMapLocations } from "@/lib/events-data"
import { fetchActivities, type ActivityData } from "@/lib/strapi-api"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useHeroImage } from "@/hooks/use-hero-images"

// Feature cards data with the provided images
const featureCards = [
  {
    id: 1,
    title: "Tréning",
    description:
      "Systematické vzdelávanie v rímskych bojových umeniach so zameraním na autentické bojové techniky a historickú presnosť.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1020_Roman%20Training%20Emblem_simple_compose_01jvc2td2se6zaqd5wtz0t1tee-jJIKRGlhbh4kyK37jGc8MKcHMTZick.png",
  },
  {
    id: 2,
    title: "Remeselné zručnosti",
    description:
      "Získajte remeselné zručnosti pri výrobe výstroja pre vystúpenia a iné podujatia, učte sa tradičné metódy a materiály.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1026_Artisan%20Crafting%20Roman%20Armor_simple_compose_01jvc34p6sfw3t9pzd86ahpzb1-rlGbL8F1B141laGOtORNqllf6OBt9z.png",
  },
  {
    id: 3,
    title: "Vystúpenia",
    description:
      "Prezentácia našich vedomostí a zručností prostredníctvom ukážok historického šermu a bojových ukážok pre divákov všetkých vekových kategórií.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1031_Roman%20Battle%20Scene_simple_compose_01jvc3fckber5v90dhec99qn6b-RcjISR8OgDZmRMouxJUUmx2XlaWZkb.png",
  },
  {
    id: 4,
    title: "Workshopy",
    description:
      "Vzdelávacie programy pre deti a mládež, zdieľanie našich odborných znalostí so širokou verejnosťou prostredníctvom interaktívnych vzdelávacích zážitkov.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1035_Mentor%20Circle%20Logo_simple_compose_01jvc3p6k1ebqbzc5g1e64wn6j-wpL8l9VIIdZqjFNxsqLbSGUkFmfKjN.png",
  },
  {
    id: 5,
    title: "Návšteva Ríma",
    description:
      'Už dvakrát sme sa zúčastnili osláv "Natale di Roma" a pripravujeme sa na ďalšiu účasť.',
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1038_Colosseum%20Sunrise%20Badge_simple_compose_01jvc3t50be77s120jtpv3resc-XdLRzbjotvOGWWH60fYI2mkHEMhU47.png",
  },
]

// Equipment Card Component
interface EquipmentCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  latin: string
  description: string
  items: string[]
}

function EquipmentCard({ icon: Icon, title, latin, description, items }: EquipmentCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-red-800/30 hover:border-red-600/50 transition-all duration-300 group h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-red-800 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-white text-center text-xl">{title}</CardTitle>
        <CardDescription className="text-red-300 text-center font-medium">
          {latin}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-center text-sm leading-relaxed">
          {description}
        </p>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-red-500 mt-1 text-sm">•</span>
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function JoinUsClientPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>(1)
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const { heroImage } = useHeroImage('joinUsPage')

  // Load activities from Strapi
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        const activitiesData = await fetchActivities()
        setActivities(activitiesData)
        if (activitiesData.length > 0) {
          setSelectedEvent(activitiesData[0].id)
        }
      } catch (error) {
        console.error('Error loading activities:', error)
      } finally {
        setLoading(false)
      }
    }
    loadActivities()
  }, [])

  // Check for scroll to section parameter from URL
  useEffect(() => {
    if (!loading) {
      const scrollTo = searchParams.get('scrollTo')
      if (scrollTo) {
        // Wait a bit for the page to fully render
        setTimeout(() => {
          const element = document.getElementById(scrollTo)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, [loading, searchParams]) // Trigger after loading is complete

  // Filter training activities from Strapi data
  const trainingEvents = useMemo(
    () => activities.filter((activity) => activity.category === "training" || activity.category === "meeting" || activity.category === "workshop"),
    [activities],
  )

  // Get calendar events
  const calendarEventInstances = useMemo(() => generateCalendarEvents(), [])

  // Generate map locations from activities
  const mapLocations = useMemo(() => {
    return activities.map((activity) => ({
      id: activity.id,
      position: activity.location.coordinates,
      title: activity.title,
      description: `${activity.recurring ? "Recurring activity" : "One-time activity"} at ${activity.location.name}`,
      type: activity.category,
    }))
  }, [activities])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would handle form submission here
    console.log("Form submitted:", formData)
    alert("Thank you for your interest! We will contact you soon.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const faqs = [
    {
      question: "Potrebujem predchádzajúce skúsenosti?",
      answer:
        "Nie, predchádzajúce skúsenosti nie sú potrebné. Vítame nadšencov všetkých zameraní a poskytujeme tréning pre nových členov.",
    },
    {
      question: "Aké sú členské poplatky?",
      answer:
        "Členské poplatky sú €X ročne, čo pokrýva skupinové poistenie, tréningové jednotky a základnú údržbu výstroja. Noví členovia si postupom času môžu potrebovať investovať do vlastnej výstroje.",
    },
    {
      question: "Aký časový záväzok je potrebný?",
      answer:
        "Zvyčajne sa stretávame dvakrát mesačne na tréningoch a podujatiach. Členov povzbudzujeme k pravidelnému účasti, ale chápeme, že osobné záväzky sa líšia.",
    },
    {
      question: "Musím si zabezpečiť vlastnú výstroj?",
      answer:
        "Spočiatku môže skupina poskytnúť základnú požičanú výstroj pre nových členov. Postupom času sa od členov očakáva, že si obstarajú vlastnú historicky presnú výstroj s naším vedením.",
    },
    {
      question: "Aké sú vekové požiadavky?",
      answer:
        "Členovia musia mať aspoň 18 rokov pre plné členstvo. Ponúkame juniorský program pre tých vo veku 16-17 rokov s rodičovským súhlasom a dohľadom.",
    },
  ]

  // Handle calendar event click - map it back to the parent event
  const handleCalendarEventClick = (eventId: number) => {
    const calendarEvent = calendarEventInstances.find((e) => e.id === eventId)
    if (calendarEvent) {
      setSelectedEvent(calendarEvent.parentId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/90">Načítavam aktivity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Hero Section - Mobile Optimized */}
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />
        <div className="absolute inset-0 bg-red-900/20 z-10" />
        <Image
          src={heroImage}
          alt="Roman legionaries in formation"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-red-800/20 rounded-full blur-2xl sm:blur-3xl z-10"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-24 h-24 sm:w-48 sm:h-48 bg-red-600/20 rounded-full blur-xl sm:blur-2xl z-10"></div>

        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center sm:justify-center md:justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mt-20 sm:mt-0"
          >
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-red-800/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-2xl">
                <span className="text-white text-base sm:text-lg">🏃‍♂️</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl text-red-200 font-semibold drop-shadow-lg">Training & Events</h2>
            </div>

            {/* Enhanced Title - Progressive Scaling */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl tracking-tight">
              Pridajte sa k nám
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed drop-shadow-lg">
              Pripojte sa k našim tréningom a podujatiam. Zažite rímsku vojenskú históriu na vlastnej koži.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">Čo vás čaká v našej skupine?</h2>
          <p className="text-lg text-center text-white/90 max-w-3xl mx-auto mb-12">
            Ak vás zaujíma história rímskej vojenskej technológie, stratégie, rímska kultúra a spoločnosť,
            a politika – ste na správnom mieste. U nás nájdete:
          </p>

          <ScrollingFeatureCards cards={featureCards} />
        </div>
      </section>

      {/* Main Content - 3 Column Layout */}
      <section id="training" className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        <div className="relative container mx-auto px-4">
        {/* Mobile-First Layout: Stacked on mobile, 3-column on desktop */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:h-[85vh]">

          {/* Training Events List - Mobile: full width card, Desktop: 1/3 width with fixed height */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 overflow-hidden flex flex-col relative border border-red-800/30 h-auto lg:h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-800 rounded-t-2xl" />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-800 rounded-lg shadow-sm">
                  <span className="text-white text-sm">🏃‍♂️</span>
                </div>
                <h2 className="text-lg font-bold text-white">Tréningy</h2>
              </div>
              <Badge variant="secondary" className="text-xs bg-red-800/20 text-red-400 border border-red-800/30">
                {trainingEvents.length}
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 lg:space-y-6 pr-2 scrollbar-thin scrollbar-thumb-red-800 scrollbar-track-gray-200 hover:scrollbar-thumb-red-700 pl-1 pt-1 max-h-[50vh] sm:max-h-[60vh] lg:max-h-none">
              {trainingEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all duration-300 touch-manipulation active:scale-95 hover:shadow-xl hover:-translate-y-1 bg-white/5 backdrop-blur-sm overflow-hidden group border border-red-800/20 hover:border-red-600/40 ${
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
                          <span className="font-medium text-red-800">{event.recurring ? "Recurring event" : format(new Date(event.startDate), "PPP")}</span>
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
          <div className="hidden lg:flex bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden flex-col relative border border-red-800/20 h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 via-red-700 to-red-800 rounded-t-2xl" />

            {/* Map Section */}
            <div className="h-1/2 flex flex-col">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-red-800/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-800 to-red-900 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Mapa</h2>
                </div>
              </div>
              
              <div className="h-full w-full">
                <SimpleMap
                  locations={mapLocations}
                  selectedLocationId={selectedEvent}
                  onMarkerClick={setSelectedEvent}
                />
              </div>
            </div>
            
            {/* Event Detail Section */}
            <div className="h-1/2 flex flex-col">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-red-800/20 bg-gradient-to-r from-red-800/10 to-red-700/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-800 to-red-900 rounded-lg shadow-sm">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Detail tréningů</h2>
                </div>
              </div>
              
              {selectedEvent && (
                <div className="h-full flex flex-col p-4">
                  {(() => {
                    const event = trainingEvents.find((e) => e.id === selectedEvent)
                    return event ? (
                      <div className="space-y-4">
                        {/* Event Info */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-white leading-tight">
                            {event.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center text-sm text-white/80">
                              <span className="mr-2 text-red-600">📅</span>
                              {event.recurring ? "Recurring" : format(new Date(event.startDate), "PP")}
                            </div>
                            <div className="flex items-center text-sm text-white/80">
                              <span className="mr-2 text-red-600">⏰</span>
                              {format(new Date(event.startDate), "HH:mm")}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-white/80">
                            <MapPin className="mr-2 h-4 w-4 text-red-600" />
                            <span>{event.location.name}</span>
                          </div>
                        </div>
                        
                        {/* Compact Event Image */}
                        {event.image && (
                          <div className="mb-3">
                            <div className="relative h-24 w-full rounded-lg overflow-hidden">
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                style={{ imageOrientation: 'none' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <div className="flex-1 overflow-y-auto max-h-20">
                          <p className="text-xs text-white/90 leading-relaxed line-clamp-3">
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
                  <h2 className="text-lg font-bold text-white">Lokácia tréningy</h2>
                </div>
              </div>

              <div className="h-64 w-full rounded-xl overflow-hidden bg-gray-100 relative">
                <SimpleMap
                  locations={mapLocations.filter(loc => loc.id === selectedEvent)}
                  selectedLocationId={selectedEvent}
                  onMarkerClick={setSelectedEvent}
                />
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
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Detail tréningy</h2>
                </div>
              </div>

              {(() => {
                const event = trainingEvents.find((e) => e.id === selectedEvent)
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
                          event.category === "training" || event.category === "meeting"
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
                          {event.recurring ? "Recurring event" : format(new Date(event.startDate), "PPP")}
                        </div>
                        <div className="flex items-center text-base text-gray-300 p-3 bg-white/5 rounded-lg">
                          <span className="mr-3 h-5 w-5 text-red-600">⏰</span>
                          {format(new Date(event.startDate), "HH:mm")}
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

          {/* Right Column: Categories and Calendar - 1/3 width with fixed height */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col lg:h-full relative border border-red-800/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 via-red-700 to-red-800 rounded-t-2xl" />

            {/* Categories Section - Compact for Desktop */}
            <div className="p-3 lg:p-3">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-red-800/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-red-800 to-red-900 rounded-md shadow-sm">
                    <span className="text-white text-xs">🏷️</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Kategórie</h3>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full justify-start text-xs h-8 bg-red-800 hover:bg-red-700"
                >
                  Training & Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-8 hover:bg-red-800/10"
                >
                  Weekly Training
                </Button>
                <Button
                  variant="outline"  
                  size="sm"
                  className="w-full justify-start text-xs h-8 hover:bg-red-800/10"
                >
                  Club Meetings
                </Button>
              </div>
            </div>

            {/* Calendar Section - Proportional */}
            <div className="flex-1 p-3 lg:p-3 overflow-hidden bg-gradient-to-b from-transparent to-red-800/10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-red-800/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-800 to-red-900 rounded-lg shadow-sm">
                    <span className="text-white text-sm">📅</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Kalendár</h2>
                </div>
              </div>

              <div className="scale-85">
                <ModernCalendar
                  events={calendarEventInstances}
                  onEventClick={handleCalendarEventClick}
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Enhanced Membership Process - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        
        <div className="relative container mx-auto px-4">
          {/* Section Header - Mobile Optimized */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-red-800/30 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-red-800 rounded-lg">
                <span className="text-white text-sm sm:text-lg">🛡️</span>
              </div>
              <span className="font-bold text-white text-sm sm:text-base">Cesta do Légií</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Členský Proces</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Štyri jednoduché kroky k členstvu v našej rímskej skupine
            </p>
          </div>

          {/* Mobile Optimized Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-sm/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/5 backdrop-blur-sm/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-sm">📧</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Kontaktujte nás
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Vyplňte formulár a vyjadrite svoj záujem. Ozveme sa vám do 48 hodín.
                </p>
              </div>
              {/* Arrow connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-red-800"></div>
                <div className="w-0 h-0 border-l-8 border-l-red-800 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-8 -mt-4"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-sm/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/5 backdrop-blur-sm/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-sm">🤝</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Úvodné stretnutie
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Zúčastnite sa úvodnej schôdzky a spoznajte našu skupinu.
                </p>
              </div>
              {/* Arrow connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-red-800"></div>
                <div className="w-0 h-0 border-l-8 border-l-red-800 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-8 -mt-4"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-sm/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/5 backdrop-blur-sm/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-sm">⚔️</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Začnite tréning
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Začnite základným tréningom rímskych vojenských techník.
                </p>
              </div>
              {/* Arrow connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-red-800"></div>
                <div className="w-0 h-0 border-l-8 border-l-red-800 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-8 -mt-4"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="bg-white/5 backdrop-blur-sm/5 backdrop-blur-sm border border-red-800/30 rounded-2xl p-6 h-full hover:bg-white/5 backdrop-blur-sm/10 transition-all duration-300 hover:border-red-700/50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">4</span>
                  </div>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-sm">👑</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Plnohodnotný člen
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  Budete vítaný ako plnohodnotný člen S.C.E.A.R.
                </p>
              </div>
            </div>
          </div>

          {/* Success Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-800 to-red-700 text-white px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border border-red-600">
              <span className="text-3xl">🏛️</span>
              <span className="font-bold text-2xl">Víta vás SCEAR!</span>
              <span className="text-3xl">⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roman Equipment Guide Section */}
      <section id="equipment" className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>

        <div className="relative container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-red-800/30 mb-6">
              <div className="p-2 bg-red-800 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-white">Autentická výstroj</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Sprievodca rímskou výstrojou</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Objavte autentickú výstroj rímskych pomocných zborov - od helm a zbroje až po zbrane a doplnky
            </p>
          </div>

          {/* Hero Image with Equipment */}
          <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://res.cloudinary.com/dii0wl9ke/image/upload/v1758200733/20250705_203408_1758200732275.jpg"
                  alt="SCEAR členovia v plnej výstroji"
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-3xl font-bold text-white mb-6">Historicky presná rekonštrukcia</h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Naša skupina sa venuje presnej rekonštrukcii výstroje rímskych pomocných zborov.
                Každý kus výstroje je vytvorený podľa historických nálezov a archeologických dôkazov
                z 1. až 3. storočia nášho letopočtu.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-300">Autentické materiály a techniky výroby</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-300">Založené na archeologických nálezoch</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-300">Schválené historickými expertmi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <EquipmentCard
              icon={Shield}
              title="Helmy a ochrana"
              latin="Galea"
              description="Rímske helmy chrániace hlavu a tvár vojaka"
              items={["Galea - bojová helma", "Lícnice pre ochranu tváre", "Ozdobné chocholy a hreben"]}
            />
            <EquipmentCard
              icon={Swords}
              title="Zbroj a štíty"
              latin="Lorica & Scutum"
              description="Ochranné vybavenie pre trup a boj"
              items={["Lorica hamata - kroužková zbroj", "Scutum - veľký štít", "Parma - menší štít auxilií"]}
            />
            <EquipmentCard
              icon={Swords}
              title="Zbrane"
              latin="Gladius & Hasta"
              description="Bojové zbrane pre blízky a diaľkový boj"
              items={["Gladius - krátky meč", "Spatha - dlhý meč", "Hasta/Lancea - kopije"]}
            />
            <EquipmentCard
              icon={User}
              title="Doplnky"
              latin="Cingulum & Caligae"
              description="Nevyhnutné vojenské vybavenie"
              items={["Cingulum - vojenský pás", "Caligae - vojenské sandále", "Pugio - vojenská dýka"]}
            />
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-3xl p-12 border border-red-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">Zaujíma vás rímska vojenská výstroj?</h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Pridajte sa k našej skupine a naučte sa vytvárať autentickú rímsku výstroj vlastnými rukami
            </p>
            <Button size="lg" className="bg-red-800 hover:bg-red-700 text-white px-8 py-4">
              <a href="#contact" className="flex items-center gap-2">
                Pridajte sa k nám
                <Shield className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form and FAQs - Mobile Optimized */}
      <section id="faq" className="py-12 sm:py-16 relative bg-gray-900 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-red-600/10 rounded-full blur-2xl"></div>
        
        <div className="relative container mx-auto px-4">
          {/* Enhanced Header - Mobile Optimized */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-red-800/30 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-red-800 rounded-lg">
                <span className="text-white text-sm sm:text-lg">📝</span>
              </div>
              <span className="font-bold text-white text-sm sm:text-base">Pridajte sa k nám</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white px-4">
              Máte záujem o členstvo?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              Vyplňte formulár nižšie a my vás budeme kontaktovať s ďalšími informáciami o členstve.
            </p>
          </div>

          {/* Mobile Optimized Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
            
            {/* Left Column - Contact Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm/5 backdrop-blur-sm rounded-3xl border border-red-800/30"></div>
              
              <Card className="relative bg-transparent border-none shadow-none rounded-3xl overflow-hidden h-fit">
                <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-red-800 rounded-2xl shadow-lg">
                      <span className="text-white text-lg sm:text-2xl">🛡️</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-white mb-2">Kontaktný formulár</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-300">
                    Odpovieme vám do 48 hodín • Všetky polia sú povinné
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-semibold text-white flex items-center gap-2">
                        <span className="text-red-400">👤</span>
                        Meno a priezvisko
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-12 sm:h-11 bg-white/5 backdrop-blur-sm border-2 border-red-800/50 focus:border-red-600 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-red-500 text-base touch-manipulation"
                        placeholder="Vaše celé meno"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="email" className="text-sm font-semibold text-white flex items-center gap-2">
                        <span className="text-red-400">📧</span>
                        Email adresa
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-12 sm:h-11 bg-white/5 backdrop-blur-sm border-2 border-red-800/50 focus:border-red-600 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-red-500 text-base touch-manipulation"
                        placeholder="vas.email@gmail.com"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="phone" className="text-sm font-semibold text-white flex items-center gap-2">
                        <span className="text-red-400">📱</span>
                        Telefónne číslo
                      </label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required
                        className="h-12 sm:h-11 bg-white/5 backdrop-blur-sm border-2 border-red-800/50 focus:border-red-600 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-red-500 text-base touch-manipulation"
                        placeholder="+421 xxx xxx xxx"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="message" className="text-sm font-semibold text-white flex items-center gap-2">
                        <span className="text-red-400">💬</span>
                        Prečo máte záujem o členstvo?
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="bg-white/5 backdrop-blur-sm border-2 border-red-800/50 focus:border-red-600 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-red-500 resize-none text-base touch-manipulation"
                        placeholder="Napíšte nám o svojom záujme o rímsku históriu, vojenské techniky, alebo čo vás priťahuje k našej skupine..."
                      />
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full h-12 sm:h-12 font-bold bg-red-800 hover:bg-red-900 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl touch-manipulation text-base sm:text-lg"
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span>Odoslať prihlášku</span>
                          <span className="text-xl">⚡</span>
                        </span>
                      </Button>
                    </div>
                  </form>
                  
                  {/* Additional info */}
                  <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm/5 rounded-2xl border border-red-800/30">
                    <div className="flex items-center justify-center gap-3 text-gray-300">
                      <span className="text-xl">🛡️</span>
                      <span className="text-xs font-medium text-center">Vaše údaje sú v bezpečí a nebudú zdieľané s treťou stranou</span>
                      <span className="text-xl">🔒</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - FAQs */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm/5 backdrop-blur-sm rounded-3xl border border-red-800/30"></div>
              
              <Card className="relative bg-transparent border-none shadow-none rounded-3xl overflow-hidden h-fit">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-800 rounded-2xl shadow-lg">
                      <span className="text-white text-2xl">❓</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-2">Často kladené otázky</CardTitle>
                  <CardDescription className="text-base text-gray-300">
                    Najčastejšie otázky o členstve
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 pb-8">
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`}
                        className="border border-red-800/30 rounded-xl px-4 bg-white/5 backdrop-blur-sm/5 data-[state=open]:bg-white/5 backdrop-blur-sm/10 hover:bg-white/5 backdrop-blur-sm/10 transition-all duration-300"
                      >
                        <AccordionTrigger className="text-left font-semibold text-white hover:text-red-300 py-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
