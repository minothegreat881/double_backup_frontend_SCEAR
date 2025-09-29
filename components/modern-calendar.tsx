"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Check, X, RefreshCw, Clock, MapPin } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
  addDays,
  isSameMonth,
} from "date-fns"
import { sk } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Event = {
  id: number
  title: string
  description: string
  location: string
  date: Date
  endDate?: Date
  type: string
}

type ModernCalendarProps = {
  events: Event[]
  onEventClick?: (eventId: number) => void
  isAdmin?: boolean
}

export default function ModernCalendar({ events, onEventClick, isAdmin = false }: ModernCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isGoogleSyncDialogOpen, setIsGoogleSyncDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSynced, setIsSynced] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Get the first day of the month
  const firstDayOfMonth = startOfMonth(currentMonth)

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startingDayOfWeek = getDay(firstDayOfMonth)

  // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
  const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

  // Get days from previous month to fill the first week
  const daysFromPreviousMonth = Array.from({ length: adjustedStartingDay }).map((_, i) => {
    return addDays(firstDayOfMonth, -adjustedStartingDay + i)
  })

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: endOfMonth(currentMonth),
  })

  // Calculate how many days we need from the next month to complete the grid
  const remainingDays = (7 - ((daysFromPreviousMonth.length + daysInMonth.length) % 7)) % 7

  // Get days from next month
  const daysFromNextMonth = Array.from({ length: remainingDays }).map((_, i) => {
    return addDays(endOfMonth(currentMonth), i + 1)
  })

  // Combine all days
  const allDays = [...daysFromPreviousMonth, ...daysInMonth, ...daysFromNextMonth]

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      if (event.endDate) {
        // Multi-day event
        const eventStart = new Date(event.date)
        const eventEnd = new Date(event.endDate)
        return day >= eventStart && day <= eventEnd
      }
      // Single day event
      return isSameDay(new Date(event.date), day)
    })
  }

  const handleSyncWithGoogle = () => {
    setIsSyncing(true)
    // Simulate API call to Google Calendar
    setTimeout(() => {
      setIsSyncing(false)
      setIsSynced(true)
      setIsGoogleSyncDialogOpen(false)
    }, 2000)
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64 bg-stone-100 rounded-lg">
        <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <Card className="w-full shadow-md border-0 overflow-hidden bg-white rounded-xl">
      <CardHeader className="pb-2 bg-gradient-to-r from-red-900 to-red-700 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Kalendár udalostí
          </CardTitle>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white/20 text-white hover:bg-white/30 border-0 text-xs py-1 h-7"
              onClick={() => setIsGoogleSyncDialogOpen(true)}
            >
              {isSynced ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Synchronizované</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  <span>Synchronizovať</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <div className="relative">
        {/* Hovered event preview */}
        {hoveredEvent && (
          <div className="absolute top-2 right-2 z-10 bg-white rounded-lg shadow-xl p-4 w-64 border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{hoveredEvent.title}</h3>
              <Badge
                className={`${
                  hoveredEvent.type === "training"
                    ? "bg-red-100 text-red-800"
                    : hoveredEvent.type === "festival"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {hoveredEvent.type.charAt(0).toUpperCase() + hoveredEvent.type.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-stone-500" />
                <span>
                  {format(new Date(hoveredEvent.date), "PPP", { locale: sk })}{" "}
                  {format(new Date(hoveredEvent.date), "HH:mm")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-stone-500" />
                <span>{hoveredEvent.location}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-stone-600 line-clamp-2">{hoveredEvent.description}</p>
          </div>
        )}

        <CardContent className="p-2 sm:p-4">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 sm:h-7 sm:w-7 border-stone-300 touch-manipulation" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm sm:text-base font-bold text-center flex-1 px-2">{format(currentMonth, "LLLL yyyy", { locale: sk })}</h2>
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 sm:h-7 sm:w-7 border-stone-300 touch-manipulation" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs font-medium text-stone-500 mb-1 sm:mb-2">
            <div className="py-1 text-xs">Po</div>
            <div className="py-1 text-xs">Ut</div>
            <div className="py-1 text-xs">St</div>
            <div className="py-1 text-xs">Št</div>
            <div className="py-1 text-xs">Pi</div>
            <div className="py-1 text-xs">So</div>
            <div className="py-1 text-xs">Ne</div>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {allDays.map((day, index) => {
              const dayEvents = getEventsForDay(day)
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
              const isCurrentDay = isToday(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)

              return (
                <div
                  key={index}
                  className={`min-h-[3rem] sm:min-h-[4rem] p-0.5 sm:p-1 rounded-lg transition-all overflow-hidden touch-manipulation ${
                    isSelected
                      ? "bg-red-50 border-2 border-red-800 shadow-sm"
                      : isCurrentDay
                        ? "bg-stone-100 border border-red-300 shadow-sm"
                        : isCurrentMonth
                          ? "bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm"
                          : "bg-stone-50 border border-stone-100 text-stone-400"
                  }`}
                  onClick={() => {
                    setSelectedDate(day)
                    if (dayEvents.length > 0 && onEventClick) {
                      onEventClick(dayEvents[0].id)
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-center text-xs ${
                        isCurrentDay
                          ? "bg-red-800 text-white font-bold"
                          : isCurrentMonth
                            ? "font-medium"
                            : "text-stone-400"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {isAdmin && isCurrentMonth && (
                      <Button variant="ghost" size="icon" className="h-4 w-4 opacity-0 hover:opacity-100">
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                    {dayEvents.slice(0, 1).map((event) => (
                      <div
                        key={event.id}
                        className={`text-[10px] sm:text-xs truncate rounded px-0.5 sm:px-1 py-0.5 cursor-pointer touch-manipulation ${
                          event.type === "training"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : event.type === "festival"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick && onEventClick(event.id)
                        }}
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 1 && (
                      <div
                        className="text-[10px] sm:text-xs text-stone-500 font-medium bg-stone-100 rounded px-0.5 sm:px-1 py-0.5 hover:bg-stone-200 cursor-pointer touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (dayEvents.length > 0 && onEventClick) {
                            onEventClick(dayEvents[0].id)
                          }
                        }}
                      >
                        +{dayEvents.length - 1}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-2 border-t flex justify-between bg-stone-50 px-2 sm:px-4 py-2 text-xs">
        <div className="flex gap-1 sm:gap-2">
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-0 text-[10px] sm:text-xs py-0 px-1 sm:px-2">
            Tréning
          </Badge>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 text-[10px] sm:text-xs py-0 px-1 sm:px-2">
            Stretnutie
          </Badge>
        </div>
        <Button variant="link" size="sm" className="text-red-800 text-[10px] sm:text-xs h-5 p-0 touch-manipulation">
          Zobraziť všetky
        </Button>
      </CardFooter>

      {/* Google Calendar Sync Dialog */}
      <Dialog open={isGoogleSyncDialogOpen} onOpenChange={setIsGoogleSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Synchronizácia s Google Kalendárom</DialogTitle>
            <DialogDescription>
              Prepojte svoj Google Kalendár s kalendárom S.C.E.A.R. pre automatickú synchronizáciu všetkých udalostí.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center p-4 border rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-8 w-8 text-red-800" />
                <div className="text-xl font-medium">S.C.E.A.R.</div>
              </div>
              <div className="mx-4 text-stone-400">→</div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                  <path
                    d="M6 16.5h12M6 12.5h12M6 8.5h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div className="text-xl font-medium">Google Kalendár</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Automatická synchronizácia všetkých udalostí</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Upozornenia na nadchádzajúce tréningy a podujatia</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Zdieľanie kalendára s ostatnými členmi</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoogleSyncDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Zrušiť
            </Button>
            <Button onClick={handleSyncWithGoogle} disabled={isSyncing} className="bg-red-800 hover:bg-red-900">
              {isSyncing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Synchronizujem...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchronizovať
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
