'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { Globe, Users, TrendingUp } from 'lucide-react'

// World map topology data URL
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

// Mock visitor data by country - replace with actual GA4 API calls
const mockCountryData = [
  { country: 'Slovakia', iso: 'SVK', users: 2847, coordinates: [19.699, 48.669], growth: 12 },
  { country: 'Czech Republic', iso: 'CZE', users: 1523, coordinates: [15.473, 49.817], growth: 8 },
  { country: 'Hungary', iso: 'HUN', users: 891, coordinates: [19.503, 47.162], growth: -3 },
  { country: 'Austria', iso: 'AUT', users: 634, coordinates: [14.550, 47.516], growth: 15 },
  { country: 'Poland', iso: 'POL', users: 445, coordinates: [19.145, 51.919], growth: 6 },
  { country: 'Germany', iso: 'DEU', users: 387, coordinates: [10.451, 51.165], growth: 22 },
  { country: 'Ukraine', iso: 'UKR', users: 234, coordinates: [31.166, 48.379], growth: -8 },
  { country: 'Romania', iso: 'ROU', users: 189, coordinates: [24.967, 45.943], growth: 4 },
  { country: 'Slovenia', iso: 'SVN', users: 156, coordinates: [14.996, 46.151], growth: 11 },
  { country: 'Croatia', iso: 'HRV', users: 134, coordinates: [15.982, 45.815], growth: 7 }
]

const getCountryColor = (users: number) => {
  if (users > 2000) return '#7f1d1d' // Very dark red
  if (users > 1000) return '#991b1b' // Dark red
  if (users > 500) return '#b91c1c'  // Red
  if (users > 200) return '#dc2626'  // Light red
  if (users > 50) return '#ef4444'   // Lighter red
  return '#374151' // Gray for no data
}

const getCountryOpacity = (users: number) => {
  if (users > 2000) return 0.9
  if (users > 1000) return 0.8
  if (users > 500) return 0.7
  if (users > 200) return 0.6
  if (users > 50) return 0.5
  return 0.3
}

export default function WorldMapVisitors() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  const totalUsers = mockCountryData.reduce((sum, country) => sum + country.users, 0)

  const getCountryData = (countryName: string) => {
    return mockCountryData.find(country =>
      country.country.toLowerCase().includes(countryName.toLowerCase()) ||
      country.iso === countryName
    )
  }

  return (
    <div className="space-y-4">
      {/* World Map */}
      <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5" />
            Global Visitors Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{totalUsers.toLocaleString()}</div>
                <div className="text-sm text-white/70">Total Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{mockCountryData.length}</div>
                <div className="text-sm text-white/70">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">🇸🇰 Slovakia</div>
                <div className="text-sm text-white/70">Top Country</div>
              </div>
            </div>

            {/* Interactive World Map */}
            <div className="w-full h-96 bg-gray-900/50 rounded-lg overflow-hidden">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 150,
                  center: [15, 50] // Centered on Central Europe
                }}
                width={800}
                height={400}
                className="w-full h-full"
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryData = getCountryData(geo.properties.NAME)
                      const users = countryData?.users || 0

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getCountryColor(users)}
                          fillOpacity={getCountryOpacity(users)}
                          stroke="#1f2937"
                          strokeWidth={0.5}
                          onMouseEnter={() => {
                            setHoveredCountry(geo.properties.NAME)
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry(null)
                          }}
                          onClick={() => {
                            if (countryData) {
                              setSelectedCountry(geo.properties.NAME)
                            }
                          }}
                          className="cursor-pointer hover:stroke-red-400 hover:stroke-2 transition-all duration-200"
                        />
                      )
                    })
                  }
                </Geographies>

                {/* Markers for top countries */}
                {mockCountryData.slice(0, 5).map((country) => (
                  <Marker
                    key={country.iso}
                    coordinates={country.coordinates}
                  >
                    <circle
                      r={Math.max(3, Math.log(country.users) * 2)}
                      fill="#ef4444"
                      fillOpacity={0.8}
                      stroke="#fff"
                      strokeWidth={1}
                      className="animate-pulse"
                    />
                  </Marker>
                ))}
              </ComposableMap>

              {/* Hover tooltip */}
              {hoveredCountry && (
                <div className="absolute top-4 left-4 bg-gray-900/95 text-white p-2 rounded-md border border-red-800/20 pointer-events-none">
                  <div className="font-medium">{hoveredCountry}</div>
                  {getCountryData(hoveredCountry) && (
                    <div className="text-sm text-red-400">
                      {getCountryData(hoveredCountry)?.users.toLocaleString()} visitors
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                <span>No data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>50-200</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>200-500</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-700 rounded"></div>
                <span>500-1000</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-800 rounded"></div>
                <span>1000+</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Countries List */}
      <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            Top Countries by Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCountryData.slice(0, 8).map((country, index) => (
              <div key={country.iso} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-white/60 font-mono text-sm min-w-[2rem]">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-white">{country.country}</div>
                    <div className="text-sm text-white/70">{country.iso}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-400">{country.users.toLocaleString()}</div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${country.growth > 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    <TrendingUp className={`w-3 h-3 ${country.growth < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(country.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}