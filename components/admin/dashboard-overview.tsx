"use client"

import { useState, useEffect } from "react"
import { Calendar, ImageIcon, BookOpen, Users, Activity } from "lucide-react"
import StatsCard from "./stats-card"
import EventsChart from "./events-chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, parseISO, isFuture } from "date-fns"
import Image from "next/image"

type Event = {
  id: number
  title: string
  startDate: string
  location: { name: string }
}

type Activity = {
  id: string
  title: string
  startDate: string
  location: { name: string }
  maxParticipants: number
  currentParticipants: number
}

type GalleryItem = { id: number }
type Article = { id: number }

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalActivities: 0,
    totalGalleryItems: 0,
    totalArticles: 0,
    totalParticipants: 0,
  })
  const [events, setEvents] = useState<Event[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [nextEvent, setNextEvent] = useState<Event | null>(null)
  const [nextActivity, setNextActivity] = useState<Activity | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load from localStorage as fallback
        const savedEventsString = localStorage.getItem("scear-events")
        const savedActivitiesString = localStorage.getItem("scear-activities")
        const savedGalleryString = localStorage.getItem("scear-gallery")
        const savedArticlesString = localStorage.getItem("scear-articles")

        const savedEvents: Event[] = savedEventsString ? JSON.parse(savedEventsString) : []
        const savedActivities: Activity[] = savedActivitiesString ? JSON.parse(savedActivitiesString) : []
        const savedGallery: GalleryItem[] = savedGalleryString ? JSON.parse(savedGalleryString) : []
        const savedArticles: Article[] = savedArticlesString ? JSON.parse(savedArticlesString) : []

        setEvents(savedEvents)
        setActivities(savedActivities)

        // Calculate total participants from activities
        const totalParticipants = savedActivities.reduce((total, activity) => total + (activity.currentParticipants || 0), 0)

        setStats({
          totalEvents: savedEvents.length,
          totalActivities: savedActivities.length,
          totalGalleryItems: savedGallery.length,
          totalArticles: savedArticles.length,
          totalParticipants: totalParticipants,
        })

        // Find next upcoming event
        const upcomingEvents = savedEvents
          .filter((event) => isFuture(parseISO(event.startDate)))
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

        if (upcomingEvents.length > 0) {
          setNextEvent(upcomingEvents[0])
        }

        // Find next upcoming activity
        const upcomingActivities = savedActivities
          .filter((activity) => isFuture(parseISO(activity.startDate)))
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

        if (upcomingActivities.length > 0) {
          setNextActivity(upcomingActivities[0])
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    loadData()
  }, [])


  return (
    <div className="space-y-4 sm:space-y-6 bg-transparent min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} description="All scheduled events" />
        <StatsCard title="Total Activities" value={stats.totalActivities} icon={Activity} description="All scheduled activities" />
        <StatsCard
          title="Gallery Images"
          value={stats.totalGalleryItems}
          icon={ImageIcon}
          description="Images in the media library"
        />
        <StatsCard
          title="History Articles"
          value={stats.totalArticles}
          icon={BookOpen}
          description="Published historical articles"
        />
        <StatsCard
          title="Activity Participants"
          value={stats.totalParticipants}
          icon={Users}
          description="Current participants in activities"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EventsChart events={events} />
        </div>
        <div className="space-y-4">
          <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
            <CardHeader>
              <CardTitle className="text-white">Next Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
              {nextEvent ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-800">{nextEvent.title}</h3>
                  <p className="text-sm text-white/70">
                    {format(parseISO(nextEvent.startDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm text-white/70">Location: {nextEvent.location.name}</p>
                </div>
              ) : (
                <p className="text-center text-white/70 py-4">No upcoming events scheduled.</p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
            <CardHeader>
              <CardTitle className="text-white">Next Upcoming Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {nextActivity ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-800">{nextActivity.title}</h3>
                  <p className="text-sm text-white/70">
                    {format(parseISO(nextActivity.startDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm text-white/70">Location: {nextActivity.location.name}</p>
                  <p className="text-sm text-white/70">
                    Participants: {nextActivity.currentParticipants}/{nextActivity.maxParticipants}
                  </p>
                </div>
              ) : (
                <p className="text-center text-white/70 py-4">No upcoming activities scheduled.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}
