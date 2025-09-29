'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  MapPin,
  TrendingUp
} from 'lucide-react'
import { useAnalytics } from './VercelAnalyticsProvider'

// Mock real-time data - replace with actual GA4 API calls
const mockRealTimeData = {
  activeUsers: 23,
  totalVisits: 15847,
  todayVisits: 234,
  topCountries: [
    { country: 'Slovakia', users: 156, flag: '🇸🇰' },
    { country: 'Czech Republic', users: 89, flag: '🇨🇿' },
    { country: 'Hungary', users: 45, flag: '🇭🇺' },
    { country: 'Austria', users: 23, flag: '🇦🇹' },
    { country: 'Poland', users: 18, flag: '🇵🇱' }
  ],
  devices: {
    mobile: 67,
    desktop: 28,
    tablet: 5
  },
  operatingSystems: [
    { os: 'Windows', users: 145, percentage: 45 },
    { os: 'Android', users: 98, percentage: 30 },
    { os: 'iOS', users: 67, percentage: 21 },
    { os: 'macOS', users: 13, percentage: 4 }
  ],
  browsers: [
    { browser: 'Chrome', users: 201, percentage: 62 },
    { browser: 'Safari', users: 89, percentage: 27 },
    { browser: 'Firefox', users: 23, percentage: 7 },
    { browser: 'Edge', users: 13, percentage: 4 }
  ]
}

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: number
  isLive?: boolean
}

const StatsCard = ({ title, value, icon: Icon, description, trend, isLive }: StatsCardProps) => (
  <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20 shadow-sm relative overflow-hidden">
    {isLive && (
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    )}
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-transparent p-4 sm:p-6">
      <CardTitle className="text-xs sm:text-sm font-medium text-white/90">{title}</CardTitle>
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
    </CardHeader>
    <CardContent className="bg-transparent px-4 sm:px-6 pb-4 sm:pb-6">
      <div className="text-xl sm:text-2xl font-bold text-red-400 flex items-center gap-2">
        {value}
        {trend !== undefined && (
          <span className={`text-xs flex items-center ${trend > 0 ? 'text-green-400' : 'text-orange-400'}`}>
            <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {description && <p className="text-xs text-white/70 mt-1">{description}</p>}
    </CardContent>
  </Card>
)

export default function RealTimeStatsCards() {
  const { realTimeData, reportData, isLoading, isLiveDataAvailable } = useAnalytics()

  // Use real data when available, fallback to mock data
  const activeUsers = realTimeData?.activeUsers || mockRealTimeData.activeUsers
  const totalUsers = reportData?.totalUsers || mockRealTimeData.totalVisits
  const pageViews = reportData?.pageViews || mockRealTimeData.todayVisits
  const topCountries = realTimeData?.usersByCountry || mockRealTimeData.topCountries

  const stats = {
    activeUsers,
    totalVisits: totalUsers,
    todayVisits: pageViews,
    topCountries,
    devices: {
      mobile: realTimeData?.usersByDevice?.find(d => d.deviceCategory === 'mobile')?.users || mockRealTimeData.devices.mobile,
      desktop: realTimeData?.usersByDevice?.find(d => d.deviceCategory === 'desktop')?.users || mockRealTimeData.devices.desktop,
      tablet: realTimeData?.usersByDevice?.find(d => d.deviceCategory === 'tablet')?.users || mockRealTimeData.devices.tablet
    },
    browsers: mockRealTimeData.browsers,
    operatingSystems: realTimeData?.usersByOperatingSystem || mockRealTimeData.operatingSystems
  }

  return (
    <div className="space-y-6">
      {/* Real-time Core Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          description="Currently online"
          isLive={true}
        />
        <StatsCard
          title="Total Visits"
          value={stats.totalVisits.toLocaleString()}
          icon={Eye}
          description="All-time page views"
          trend={12}
        />
        <StatsCard
          title="Today's Visits"
          value={stats.todayVisits}
          icon={Users}
          description="Visits in last 24h"
          trend={8}
        />
        <StatsCard
          title="Top Country"
          value={`${stats.topCountries[0].flag} ${stats.topCountries[0].users}`}
          icon={Globe}
          description={stats.topCountries[0].country}
        />
      </div>

      {/* Device Breakdown */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Countries */}
        <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-white/80 text-sm">{country.country}</span>
                  </div>
                  <span className="text-red-400 font-bold">{country.users}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Devices */}
        <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Smartphone className="w-5 h-5" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </span>
                  <span className="text-red-400 font-bold">{stats.devices.mobile}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.devices.mobile}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </span>
                  <span className="text-red-400 font-bold">{stats.devices.desktop}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.devices.desktop}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Tablet</span>
                  <span className="text-red-400 font-bold">{stats.devices.tablet}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.devices.tablet}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Monitor className="w-5 h-5" />
              Operating Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.operatingSystems.map((os) => {
                const totalUsers = stats.operatingSystems.reduce((sum, item) => sum + (item.users || 0), 0)
                const percentage = totalUsers > 0 ? Math.round((os.users / totalUsers) * 100) : 0
                const osName = os.operatingSystem || os.os

                return (
                  <div key={osName} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">{osName}</span>
                      <span className="text-red-400 font-bold">{os.users} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Browser Breakdown */}
      <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5" />
            Browser Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.browsers.map((browser) => (
              <div key={browser.browser} className="text-center space-y-2">
                <div className="text-lg font-bold text-red-400">{browser.users}</div>
                <div className="text-sm text-white/80">{browser.browser}</div>
                <div className="text-xs text-white/70">{browser.percentage}%</div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div
                    className="bg-red-600 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${browser.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}