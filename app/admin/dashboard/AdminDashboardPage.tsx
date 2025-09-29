"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Calendar, ImageIcon, LayoutDashboard, Activity, Menu, X, BarChart3, BookOpen, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import EventsManager from "@/components/admin/events-manager"
import ActivitiesManager from "@/components/admin/activities-manager"
import GalleryManager from "@/components/admin/gallery-manager"
import HistoryArticlesManager from "@/components/admin/history-articles-manager"
import AdminLogo from "@/components/admin/admin-logo"
import DashboardOverview from "@/components/admin/dashboard-overview"
import UserBehaviorDashboard from "@/components/admin/analytics/UserBehaviorDashboard"
import HeroImagesManager from "@/components/admin/hero-images-manager"
import { cn } from "@/lib/utils"

type AdminView = "dashboard" | "events" | "activities" | "gallery" | "history" | "analytics" | "hero-images"

const navigationItems = [
  { name: "Dashboard", view: "dashboard", icon: LayoutDashboard },
  { name: "Events", view: "events", icon: Calendar },
  { name: "Activities", view: "activities", icon: Activity },
  { name: "Gallery", view: "gallery", icon: ImageIcon },
  { name: "History", view: "history", icon: BookOpen },
  { name: "Hero Images", view: "hero-images", icon: Image },
  { name: "Analytics", view: "analytics", icon: BarChart3 },
]

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<AdminView>("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const authStatus = localStorage.getItem("scear-admin-auth")
    if (authStatus !== "authenticated") {
      router.push("/admin")
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      })
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("scear-admin-auth")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/admin")
  }

  const renderContent = (): ReactNode => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />
      case "events":
        return <EventsManager />
      case "activities":
        return <ActivitiesManager />
      case "gallery":
        return <GalleryManager />
      case "history":
        return <HistoryArticlesManager />
      case "analytics":
        return <UserBehaviorDashboard />
      case "hero-images":
        return <HeroImagesManager />
      default:
        return <DashboardOverview />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/90">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-red-800/20">
        <div className="flex items-center gap-2">
          <AdminLogo showText={false} />
          <h1 className="text-lg font-bold">S.C.E.A.R. Admin</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-red-800/20"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop: Always visible, Mobile: Overlay */}
        <aside className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64
          flex-shrink-0 bg-gray-800/95 lg:bg-gray-800/50 backdrop-blur-sm text-white
          flex flex-col border-r border-red-800/20 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'lg:mt-0' : ''} lg:mt-0
        `}>
          <div className="h-20 flex items-center justify-center px-4 border-b border-red-800/30 bg-gradient-to-r from-red-800/10 to-red-700/10">
            <div className="flex items-center gap-2">
              <AdminLogo showText={false} />
              <h1 className="text-lg font-bold">S.C.E.A.R. Admin</h1>
            </div>
          </div>
          <nav className="flex-grow px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => {
                  setActiveView(item.view as AdminView)
                  setIsMobileMenuOpen(false) // Close mobile menu after selection
                }}
                className={cn(
                  "w-full justify-start text-base h-12 touch-manipulation",
                  activeView === item.view
                    ? "bg-red-800/50 text-white"
                    : "text-white/80 hover:bg-red-800/20 hover:text-white",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t border-red-800/30 bg-gradient-to-r from-red-800/5 to-red-700/5">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/80 hover:bg-red-800/20 hover:text-white h-12 touch-manipulation"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" /> Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content - Mobile optimized */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen lg:h-screen bg-gray-900 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black pointer-events-none"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-800/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-600/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
