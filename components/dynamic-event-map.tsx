"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type EventMap from "./event-map"

const MapPlaceholder = () => (
  <div className="flex items-center justify-center h-full w-full bg-stone-100 rounded-lg">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-stone-600">Loading map...</p>
    </div>
  </div>
)

const LoadedEventMap = dynamic(() => import("@/components/event-map"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
})

export default function DynamicEventMap(props: ComponentProps<typeof EventMap>) {
  return <LoadedEventMap {...props} />
}
