import { Suspense } from "react"
import EventsClientPage from "./EventsClientPage"

export const metadata = {
  title: "Podujatia | S.C.E.A.R.",
  description: "Nadchádzajúce podujatia a rekonštrukcie našej historicko-vojenskej skupiny rímskych pomocných zborov",
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Načítavam podujatia...</p>
        </div>
      </div>
    }>
      <EventsClientPage />
    </Suspense>
  )
}
