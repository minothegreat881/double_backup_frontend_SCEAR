'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  MousePointer,
  Eye,
  Clock,
  Users,
  TrendingUp,
  Map,
  BarChart3,
  Activity
} from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import RealTimeStatsCards from './RealTimeStatsCards'
import WorldMapVisitors from './WorldMapVisitors'
import { VercelAnalyticsProvider } from './VercelAnalyticsProvider'

// Mock data - replace with actual GA4 API calls
const mockHeatmapData = [
  { page: '/historia', clicks: 245, avgTime: 120, bounceRate: 25 },
  { page: '/podujatia', clicks: 189, avgTime: 85, bounceRate: 35 },
  { page: '/pridajte-sa-k-nam', clicks: 156, avgTime: 95, bounceRate: 45 },
  { page: '/sluzby', clicks: 134, avgTime: 75, bounceRate: 40 },
  { page: '/galeria', clicks: 98, avgTime: 180, bounceRate: 20 }
]


const mockClickHeatmap = [
  { element: 'nav-podujatia', clicks: 89, page: '/podujatia' },
  { element: 'hero-cta', clicks: 67, page: '/' },
  { element: 'footer-contact', clicks: 45, page: 'all' },
  { element: 'historie-článok', clicks: 156, page: '/historia' },
  { element: 'join-form', clicks: 34, page: '/pridajte-sa-k-nam' }
]

const mockUserJourney = [
  { step: 1, page: 'Domov', users: 1000, dropoff: 15 },
  { step: 2, page: 'História', users: 850, dropoff: 12 },
  { step: 3, page: 'Podujatia', users: 748, dropoff: 20 },
  { step: 4, page: 'Pridajte sa k nám', users: 598, dropoff: 35 },
  { step: 5, page: 'Registrácia', users: 389, dropoff: 0 }
]

const COLORS = ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5']

export default function UserBehaviorDashboard() {
  return (
    <VercelAnalyticsProvider>
      <UserBehaviorDashboardContent />
    </VercelAnalyticsProvider>
  )
}

function UserBehaviorDashboardContent() {
  const [activeTab, setActiveTab] = useState('realtime')
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Behavior Analytics</h2>
          <p className="text-white/70">Detailed insights into how users interact with your site</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '1d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('1d')}
            size="sm"
          >
            24h
          </Button>
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
            size="sm"
          >
            7d
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
            size="sm"
          >
            30d
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="geography" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Geography
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Click Heatmap
          </TabsTrigger>
          <TabsTrigger value="journey" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            User Journey
          </TabsTrigger>
        </TabsList>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <RealTimeStatsCards />
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <WorldMapVisitors />
        </TabsContent>

        {/* Click Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page Click Analysis */}
            <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MousePointer className="w-5 h-5" />
                  Most Clicked Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockHeatmapData}>
                    <XAxis dataKey="page" stroke="#ffffff" fontSize={12} />
                    <YAxis stroke="#ffffff" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        borderColor: '#991b1b',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Element Click Breakdown */}
            <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="w-5 h-5" />
                  Most Clicked Elements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClickHeatmap.map((item, index) => (
                    <div key={item.element} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{item.element}</p>
                        <p className="text-sm text-white/70">{item.page}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-400">{item.clicks}</p>
                        <p className="text-xs text-white/70">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        {/* User Journey Tab */}
        <TabsContent value="journey" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Map className="w-5 h-5" />
                User Journey Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockUserJourney.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{step.page}</h4>
                          <span className="text-red-400 font-bold">{step.users} users</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${(step.users / 1000) * 100}%` }}
                            />
                          </div>
                          {step.dropoff > 0 && (
                            <span className="text-orange-400 text-sm">-{step.dropoff}% dropoff</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < mockUserJourney.length - 1 && (
                      <div className="ml-4 w-0.5 h-6 bg-red-800"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  Avg. Time on Page
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHeatmapData.map((page) => (
                    <div key={page.page} className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">{page.page}</span>
                      <span className="text-red-400 font-bold">{page.avgTime}s</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  Bounce Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHeatmapData.map((page) => (
                    <div key={page.page} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">{page.page}</span>
                        <span className={`font-bold ${page.bounceRate > 40 ? 'text-orange-400' : 'text-green-400'}`}>
                          {page.bounceRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5" />
                  Engagement Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-red-400">8.7</div>
                  <p className="text-white/70">Overall site engagement</p>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}