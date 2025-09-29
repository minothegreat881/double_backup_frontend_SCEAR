import { Suspense } from "react"
import JoinUsClientPage from "./JoinUsClientPage"

export const metadata = {
  title: "Pridaj sa k nám | S.C.E.A.R.",
  description: "Pridajte sa k našej skupine rekonštruktérov rímskych pomocných zborov",
}

export default function JoinUsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Načítavam stránku...</p>
        </div>
      </div>
    }>
      <JoinUsClientPage />
    </Suspense>
  )
}
