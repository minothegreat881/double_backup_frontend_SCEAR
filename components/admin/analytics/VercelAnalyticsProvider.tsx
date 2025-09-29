'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AnalyticsRealTimeData, AnalyticsReportData } from '@/lib/vercel-analytics'

// Context for sharing analytics data across components
interface AnalyticsContextType {
  realTimeData: AnalyticsRealTimeData | null
  reportData: AnalyticsReportData | null
  isLoading: boolean
  isLiveDataAvailable: boolean
  lastUpdated: Date | null
  error: string | null
  refreshData: () => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

// Mock data as fallback
const mockRealTimeData: AnalyticsRealTimeData = {
  activeUsers: 2,
  usersByCountry: [
    { country: 'Slovakia', users: 7, flag: '🇸🇰' },
  ],
  usersByDevice: [
    { deviceCategory: 'mobile', users: 5 },
    { deviceCategory: 'desktop', users: 2 },
  ],
  usersByOperatingSystem: [
    { operatingSystem: 'Android', users: 3 },
    { operatingSystem: 'Windows', users: 2 },
    { operatingSystem: 'iOS', users: 2 },
  ],
}

const mockReportData: AnalyticsReportData = {
  totalUsers: 7,
  totalSessions: 118,
  pageViews: 148,
  bounceRate: 0.14,
  avgSessionDuration: 185,
  usersByAge: [
    { ageGroup: '25-34', users: 3 },
    { ageGroup: '18-24', users: 2 },
    { ageGroup: '35-44', users: 2 },
  ],
  usersByGender: [
    { gender: 'male', users: 4 },
    { gender: 'female', users: 3 },
  ],
  topPages: [
    { page: '/', views: 18 },
    { page: '/gallery', views: 15 },
    { page: '/history', views: 12 },
    { page: '/admin', views: 9 },
    { page: '/admin/dashboard', views: 6 },
  ],
  trafficSources: [
    { source: '(direct)', users: 5 },
    { source: 'vercel.com', users: 2 },
  ],
}

interface VercelAnalyticsProviderProps {
  children: ReactNode
}

export function VercelAnalyticsProvider({ children }: VercelAnalyticsProviderProps) {
  const [realTimeData, setRealTimeData] = useState<AnalyticsRealTimeData | null>(null)
  const [reportData, setReportData] = useState<AnalyticsReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiveDataAvailable, setIsLiveDataAvailable] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔍 Loading Vercel Analytics data...')
      const response = await fetch('/api/vercel-analytics')
      const result = await response.json()

      if (result.success) {
        console.log('✅ Vercel Analytics data loaded successfully')
        setRealTimeData(result.realTimeData)
        setReportData(result.reportData)
        setIsLiveDataAvailable(result.isLiveDataAvailable)
        setLastUpdated(new Date(result.lastUpdated))
      } else {
        console.log('⚠️ Vercel Analytics failed, using mock data')
        setRealTimeData(mockRealTimeData)
        setReportData(mockReportData)
        setIsLiveDataAvailable(false)
        setError(result.error || 'Failed to load analytics data')
      }
    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')

      // Fallback to mock data on error
      setRealTimeData(mockRealTimeData)
      setReportData(mockReportData)
      setIsLiveDataAvailable(false)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    await loadData()
  }

  // Initial data load
  useEffect(() => {
    loadData()
  }, [])

  // Auto-refresh every 30 seconds for real-time data
  useEffect(() => {
    if (!isLiveDataAvailable) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/vercel-analytics')
        const result = await response.json()

        if (result.success) {
          setRealTimeData(result.realTimeData)
          setLastUpdated(new Date(result.lastUpdated))
        }
      } catch (err) {
        console.error('Error refreshing real-time data:', err)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isLiveDataAvailable])

  const value: AnalyticsContextType = {
    realTimeData,
    reportData,
    isLoading,
    isLiveDataAvailable,
    lastUpdated,
    error,
    refreshData,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

// Hook to use analytics data
export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within VercelAnalyticsProvider')
  }
  return context
}

// Status indicator component
export function AnalyticsStatus() {
  const { isLiveDataAvailable, lastUpdated, error, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-white/70">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        Loading analytics...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-400">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Error: {error.substring(0, 50)}...
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isLiveDataAvailable ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
      <span className="text-white/70">
        {isLiveDataAvailable ? 'Live Vercel Data' : 'Demo Data'}
        {lastUpdated && (
          <span className="ml-2">
            • Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </span>
    </div>
  )
}