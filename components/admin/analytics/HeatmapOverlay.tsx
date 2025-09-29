'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, MousePointer, Flame, Settings } from 'lucide-react'

// Mock heatmap click data - replace with actual tracking data
const mockHeatmapClicks = [
  { x: 150, y: 200, clicks: 45, element: 'nav-menu' },
  { x: 300, y: 180, clicks: 67, element: 'hero-cta' },
  { x: 250, y: 400, clicks: 89, element: 'content-link' },
  { x: 180, y: 600, clicks: 34, element: 'footer-contact' },
  { x: 420, y: 300, clicks: 56, element: 'sidebar-widget' },
  { x: 350, y: 250, clicks: 78, element: 'main-article' },
  { x: 280, y: 520, clicks: 23, element: 'social-share' },
  { x: 150, y: 800, clicks: 91, element: 'newsletter-signup' },
  { x: 380, y: 450, clicks: 67, element: 'related-content' },
  { x: 220, y: 350, clicks: 45, element: 'image-gallery' }
]

interface HeatmapPoint {
  x: number
  y: number
  clicks: number
  element: string
}

interface HeatmapOverlayProps {
  isVisible: boolean
  onToggle: () => void
}

const getHeatIntensity = (clicks: number) => {
  if (clicks > 80) return 'very-hot'
  if (clicks > 60) return 'hot'
  if (clicks > 40) return 'warm'
  if (clicks > 20) return 'cool'
  return 'cold'
}

const getHeatColor = (intensity: string) => {
  switch (intensity) {
    case 'very-hot': return 'rgba(239, 68, 68, 0.9)' // Red
    case 'hot': return 'rgba(249, 115, 22, 0.8)'     // Orange
    case 'warm': return 'rgba(245, 158, 11, 0.7)'    // Amber
    case 'cool': return 'rgba(59, 130, 246, 0.6)'    // Blue
    default: return 'rgba(107, 114, 128, 0.5)'       // Gray
  }
}

const getHeatSize = (clicks: number) => {
  const baseSize = 20
  const scaleFactor = clicks / 10
  return Math.min(Math.max(baseSize + scaleFactor, 15), 60)
}

export default function HeatmapOverlay({ isVisible, onToggle }: HeatmapOverlayProps) {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null)
  const [heatmapData, setHeatmapData] = useState(mockHeatmapClicks)

  return (
    <>
      {/* Heatmap Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={onToggle}
          variant={isVisible ? 'default' : 'outline'}
          className="bg-red-800 hover:bg-red-900 text-white border-red-700"
        >
          <Flame className="w-4 h-4 mr-2" />
          {isVisible ? 'Hide Heatmap' : 'Show Heatmap'}
        </Button>
      </div>

      {/* Heatmap Overlay */}
      {isVisible && (
        <>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/20 z-40 pointer-events-none" />

          {/* Heatmap points */}
          <div className="fixed inset-0 z-45 pointer-events-none">
            {heatmapData.map((point, index) => {
              const intensity = getHeatIntensity(point.clicks)
              const size = getHeatSize(point.clicks)
              const color = getHeatColor(intensity)

              return (
                <div
                  key={index}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: point.x,
                    top: point.y,
                    width: size,
                    height: size,
                  }}
                  onClick={() => setSelectedPoint(point)}
                >
                  {/* Heat circle */}
                  <div
                    className="w-full h-full rounded-full animate-pulse"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 ${size/2}px ${color}`,
                    }}
                  />

                  {/* Click count label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">
                    {point.clicks}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Heatmap Legend */}
          <div className="fixed bottom-4 left-4 z-50 bg-gray-900/95 backdrop-blur-sm border border-red-800/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="font-semibold text-white">Click Heatmap</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-white/80">Very Hot (80+ clicks)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-white/80">Hot (60-80 clicks)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-white/80">Warm (40-60 clicks)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-white/80">Cool (20-40 clicks)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <span className="text-white/80">Cold (1-20 clicks)</span>
              </div>
            </div>
          </div>

          {/* Click Details Modal */}
          {selectedPoint && (
            <div
              className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setSelectedPoint(null)}
            >
              <Card
                className="bg-gray-900 border border-red-800/20 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MousePointer className="w-5 h-5" />
                    Click Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/70">Element</div>
                      <div className="font-semibold text-white">{selectedPoint.element}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">Total Clicks</div>
                      <div className="font-semibold text-red-400">{selectedPoint.clicks}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">Position X</div>
                      <div className="font-semibold text-white">{selectedPoint.x}px</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">Position Y</div>
                      <div className="font-semibold text-white">{selectedPoint.y}px</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm text-white/70 mb-2">Heat Intensity</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: getHeatColor(getHeatIntensity(selectedPoint.clicks)) }}
                      />
                      <span className="font-semibold text-white capitalize">
                        {getHeatIntensity(selectedPoint.clicks).replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedPoint(null)}
                    className="w-full bg-red-800 hover:bg-red-900"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </>
  )
}

// Hook for using heatmap in pages
export const useHeatmap = () => {
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false)

  const toggleHeatmap = () => {
    setIsHeatmapVisible(!isHeatmapVisible)
  }

  return {
    isHeatmapVisible,
    toggleHeatmap,
    HeatmapComponent: () => (
      <HeatmapOverlay
        isVisible={isHeatmapVisible}
        onToggle={toggleHeatmap}
      />
    )
  }
}