"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
// The CSS import has been moved to EventsClientPage.tsx

if (typeof window !== "undefined") {
  // This is a common workaround for Leaflet's icon issue in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

type EventMapProps = {
  locations: {
    id: number
    position: [number, number]
    title: string
    category: string
  }[]
  selectedEventId?: number | null
  onMarkerClick?: (eventId: number) => void
}

const getMarkerIcon = (category: string, isSelected: boolean) => {
  const iconSize: [number, number] = isSelected ? [30, 45] : [25, 41]
  const iconAnchor: [number, number] = isSelected ? [15, 45] : [12, 41]

  let iconUrl
  switch (category) {
    case "reenactment":
      iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
      break
    case "training":
      iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png"
      break
    case "exhibition":
      iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
      break
    case "workshop":
      iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
      break
    default:
      iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png"
  }

  return new L.Icon({
    iconUrl,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

function MapRecenter({
  locations,
  selectedEventId,
}: { locations: EventMapProps["locations"]; selectedEventId: number | null | undefined }) {
  const map = useMap()

  useEffect(() => {
    if (selectedEventId) {
      const selectedLocation = locations.find((loc) => loc.id === selectedEventId)
      if (selectedLocation) {
        map.setView(selectedLocation.position, 13, { animate: true })
      }
    } else if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => loc.position))
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true })
      }
    }
  }, [map, locations, selectedEventId])

  return null
}

export default function EventMap({ locations, selectedEventId, onMarkerClick }: EventMapProps) {
  const defaultCenter: [number, number] = [48.669, 19.699]
  const defaultZoom = 7

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.position}
          icon={getMarkerIcon(location.category, location.id === selectedEventId)}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) {
                onMarkerClick(location.id)
              }
            },
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{location.title}</h3>
              <p className="capitalize">{location.category}</p>
              <button
                className="mt-2 text-xs text-red-800 font-medium hover:underline"
                onClick={() => {
                  if (onMarkerClick) {
                    onMarkerClick(location.id)
                  }
                }}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapRecenter locations={locations} selectedEventId={selectedEventId} />
    </MapContainer>
  )
}
