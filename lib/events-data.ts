import { CalendarRange, CalendarDays } from "lucide-react"
import type { ElementType } from "react"

// The Event type uses a consistent structure with startDate and endDate.
// The `image` property is a string, ready for local public assets or a CMS.
export type Event = {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  location: {
    name: string
    address: string
    coordinates: [number, number] // [latitude, longitude]
  }
  image: string
  category: "reenactment" | "training" | "exhibition" | "workshop" | "meeting"
  recurring?: boolean
  icon?: ElementType // Use ElementType for passing component references like Lucide icons
  visible?: boolean
}

// Define the calendar event type
export type CalendarEvent = {
  id: number
  title: string
  description: string
  location: string
  date: Date
  endDate?: Date
  type: "training" | "festival" | "workshop" | "meeting"
  parentId: number
}

// Central events data store with corrected structure and image paths.
export const eventsData: Event[] = [
  {
    id: 1,
    title: "Týždenný tréning",
    description: "Pravidelný tréning pre všetkých členov. Nácvik formácií, bojových techník a historickej presnosti.",
    startDate: "2025-05-16T17:00:00",
    endDate: "2025-05-16T19:00:00",
    location: {
      name: "Sad Janka Kráľa",
      address: "Sad Janka Kráľa, Bratislava",
      coordinates: [48.1359, 17.1178],
    },
    image: "/images/gallery/roman-training.png",
    category: "training",
    recurring: true,
    icon: CalendarRange,
    visible: true,
  },
  {
    id: 2,
    title: "Club meetings in Devin",
    description:
      "Regular club meetings for all members to discuss upcoming events, historical research, and equipment.",
    startDate: "2025-06-02T18:00:00",
    endDate: "2025-06-02T20:00:00",
    location: {
      name: "Devín Castle",
      address: "Devín Castle, Bratislava",
      coordinates: [48.1744, 16.9798],
    },
    image: "/images/gallery/roman-camp.png",
    category: "meeting",
    recurring: true,
    icon: CalendarRange,
    visible: true,
  },
  {
    id: 3,
    title: "Germania Subacta Festival",
    description:
      "Každoročný historický festival s viacerými skupinami historického šermu, ukážkami a interakciou s verejnosťou.",
    startDate: "2025-06-10T10:00:00",
    endDate: "2025-06-12T18:00:00",
    location: {
      name: "Mušov",
      address: "Mušov, Morava, Česká republika",
      coordinates: [48.9086, 16.6158],
    },
    image: "/images/germania-subacta.jpeg",
    category: "reenactment",
    recurring: false,
    icon: CalendarDays,
    visible: true,
  },
  {
    id: 4,
    title: "Oradea Festival",
    description: "Medzinárodný historický festival v Rumunsku s účasťou rímskych legionárov a auxiliárnych jednotiek.",
    startDate: "2025-08-05T09:00:00",
    endDate: "2025-08-07T18:00:00",
    location: {
      name: "Oradea",
      address: "Oradea, Rumunsko",
      coordinates: [47.0465, 21.9189],
    },
    image: "/images/oradea-festival.jpeg",
    category: "reenactment",
    recurring: false,
    icon: CalendarDays,
    visible: true,
  },
  {
    id: 5,
    title: "Intenzívny bojový tréning",
    description: "Pokročilé bojové techniky a formácie pre skúsených členov.",
    startDate: "2025-05-25T09:00:00",
    endDate: "2025-05-25T16:00:00",
    location: {
      name: "Park Rusovce",
      address: "Park Rusovce, Bratislava",
      coordinates: [48.0536, 17.1513],
    },
    image: "/placeholder.svg?height=600&width=800&text=Combat Training",
    category: "training",
    recurring: true,
    icon: CalendarRange,
    visible: true,
  },
  {
    id: 6,
    title: "Tréning lukostrelby",
    description: "Špecializovaný tréning zameraný na techniky lukostrelby používané rímskymi auxiliárnymi jednotkami.",
    startDate: "2025-06-03T14:00:00",
    endDate: "2025-06-03T17:00:00",
    location: {
      name: "Lesný park",
      address: "Lesný park, Bratislava",
      coordinates: [48.1836, 17.0778],
    },
    image: "/placeholder.svg?height=600&width=800&text=Archery Training",
    category: "training",
    recurring: true,
    icon: CalendarRange,
    visible: true,
  },
  {
    id: 7,
    title: "Workshop výroby zbrane",
    description: "Praktický workshop výroby replík rímskych zbraní a brnenia pod vedením skúsených remeselníkov.",
    startDate: "2025-07-15T10:00:00",
    endDate: "2025-07-15T17:00:00",
    location: {
      name: "Remeselnícke centrum",
      address: "Remeselnícke centrum, Bratislava",
      coordinates: [48.1486, 17.1077],
    },
    image: "/placeholder.svg?height=600&width=800&text=Weapon Crafting",
    category: "workshop",
    recurring: false,
    icon: CalendarRange,
    visible: true,
  },
  {
    id: 8,
    title: "Večerné stretnutie legionárov",
    description: "Neformálne stretnutie členov s diskusiou o historických zdrojoch a plánovaní ďalších aktivít.",
    startDate: "2025-06-20T19:00:00",
    endDate: "2025-06-20T21:30:00",
    location: {
      name: "Klub Petržalka",
      address: "Kultúrny dom Petržalka, Bratislava",
      coordinates: [48.1173, 17.1115],
    },
    image: "/placeholder.svg?height=600&width=800&text=Legion Meeting",
    category: "meeting",
    recurring: false,
    icon: CalendarDays,
    visible: true,
  },
]

// Helper function to get only the events marked as visible.
export const getVisibleEvents = (): Event[] => {
  return eventsData.filter((event) => event.visible !== false)
}

// Weekly training dates
export const weeklyTrainingDates = [
  new Date(2025, 4, 16, 17, 0),
  new Date(2025, 4, 23, 17, 0),
  new Date(2025, 4, 30, 17, 0),
  new Date(2025, 5, 6, 17, 0),
]

// Club meeting dates
export const clubMeetingDates = [new Date(2025, 5, 2, 18, 0), new Date(2025, 6, 7, 18, 0)]

// Generate calendar events from the main events data
export const generateCalendarEvents = (): CalendarEvent[] => {
  const calendarEvents: CalendarEvent[] = []

  weeklyTrainingDates.forEach((date, index) => {
    calendarEvents.push({
      id: 100 + index,
      title: "Týždenný tréning",
      description: "Pravidelný tréning pre všetkých členov.",
      location: "Sad Janka Kráľa, Bratislava",
      date: date,
      type: "training",
      parentId: 1,
    })
  })

  clubMeetingDates.forEach((date, index) => {
    calendarEvents.push({
      id: 200 + index,
      title: "Club meetings in Devin",
      description: "Regular club meetings for all members.",
      location: "Devín Castle, Bratislava",
      date: date,
      type: "meeting",
      parentId: 2,
    })
  })

  const festivalEvents = eventsData.filter((e) => e.category === "reenactment" && e.visible !== false)
  festivalEvents.forEach((event) => {
    calendarEvents.push({
      id: event.id + 300,
      title: event.title,
      description: event.description,
      location: `${event.location.name}, ${event.location.address}`,
      date: new Date(event.startDate),
      endDate: new Date(event.endDate),
      type: "festival",
      parentId: event.id,
    })
  })

  return calendarEvents
}

// Generate map locations from visible events
export const generateMapLocations = () => {
  return getVisibleEvents().map((event) => ({
    id: event.id,
    position: event.location.coordinates || [48.1486, 17.1077] as [number, number], // Default Bratislava coordinates
    title: event.title,
    description: `${event.recurring ? "Recurring event" : "One-time event"} at ${event.location.name}`,
    type: event.category,
  }))
}
