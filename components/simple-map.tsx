"use client"

import { useState, useEffect } from "react"

type SimpleMapProps = {
  locations: {
    id: number
    position: [number, number]
    title: string
    description: string
    type: string
  }[]
  selectedLocationId?: number
  onMarkerClick?: (locationId: number) => void
}

export default function SimpleMap({ locations, selectedLocationId, onMarkerClick }: SimpleMapProps) {
  const [isClient, setIsClient] = useState(false)

  // Get the selected location or default to the first one
  const selectedLocation = selectedLocationId ? locations.find((loc) => loc.id === selectedLocationId) : locations[0]

  // Default center of Slovakia if no location is selected
  const center = selectedLocation ? selectedLocation.position : [48.669, 19.699]

  // Create the OpenStreetMap URL with markers
  const createMapUrl = () => {
    const baseUrl = "https://www.openstreetmap.org/export/embed.html"
    const bbox = getBoundingBox(locations.map((loc) => loc.position))
    return `${baseUrl}?bbox=${bbox}&layer=mapnik&marker=${center[0]},${center[1]}`
  }

  // Calculate a bounding box that includes all locations
  const getBoundingBox = (positions: [number, number][]) => {
    if (positions.length === 0) return "16.84,48.10,17.20,48.22" // Default Bratislava area

    let minLat = positions[0][0]
    let maxLat = positions[0][0]
    let minLng = positions[0][1]
    let maxLng = positions[0][1]

    positions.forEach((pos) => {
      minLat = Math.min(minLat, pos[0])
      maxLat = Math.max(maxLat, pos[0])
      minLng = Math.min(minLng, pos[1])
      maxLng = Math.max(maxLng, pos[1])
    })

    // Add some padding
    const latPadding = (maxLat - minLat) * 0.1
    const lngPadding = (maxLng - minLng) * 0.1

    return `${minLng - lngPadding},${minLat - latPadding},${maxLng + lngPadding},${maxLat + latPadding}`
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-stone-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={createMapUrl()}
        style={{ border: "1px solid #ccc", borderRadius: "0.5rem" }}
        title="Training Locations Map"
      />

      {/* Location info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 m-4 rounded-lg shadow-md">
        <h3 className="font-bold">{selectedLocation?.title}</h3>
        <p className="text-sm text-stone-600">{selectedLocation?.description}</p>
        <div className="mt-2 text-xs">
          <a
            href={`https://www.openstreetmap.org/?mlat=${center[0]}&mlon=${center[1]}&zoom=15`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-800 hover:underline"
          >
            View larger map
          </a>
        </div>
      </div>

      {/* Location selector */}
      <div className="absolute top-0 right-0 bg-white/90 p-2 m-4 rounded-lg shadow-md">
        <select
          className="text-sm p-1 border rounded"
          value={selectedLocationId || locations[0]?.id}
          onChange={(e) => onMarkerClick && onMarkerClick(Number(e.target.value))}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
