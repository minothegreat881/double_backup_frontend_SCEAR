import type React from "react"
import { Button } from "@/components/ui/button"

// Define icon components (replace with actual implementations)
const TrainingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-dumbbell"
  >
    <path d="M5 5H2" />
    <path d="M22 5h-3" />
    <path d="M5 19H2" />
    <path d="M22 19h-3" />
    <circle cx="6.5" cy="12" r="4.5" />
    <circle cx="17.5" cy="12" r="4.5" />
    <path d="M11 12h2" />
  </svg>
)
const CraftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-pen-tool"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="m2 2 7.586 7.586" />
  </svg>
)
const PerformanceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-activity"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)
const WorkshopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-wrench-screwdriver"
  >
    <path d="m15.3 14.7 2.1-2.1" />
    <path d="m9.69 9.69 2.1-2.1" />
    <path d="M3.27 3.27a2.83 2.83 0 1 1 4 4l-1.5 1.5" />
    <path d="M15 7l-1.5 1.5a2.83 2.83 0 1 1 4 4l-1.5 1.5" />
    <path d="m12 12 5.66 5.66a2.83 2.83 0 1 1-4-4L12 12z" />
  </svg>
)
const RomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-landmark"
  >
    <path d="M2 20h20" />
    <path d="M4 12v8" />
    <path d="M20 12v8" />
    <path d="M10 12v8" />
    <path d="M14 12v8" />
    <path d="M2 12l10-8 10 8" />
    <path d="M7 7V4" />
    <path d="M17 7V4" />
  </svg>
)

interface FeatureCardProps {
  id: number
  title: string
  description: string
}

interface FeatureCardsProps {
  cards: FeatureCardProps[]
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
        >
          <div className="bg-red-900 p-8 flex flex-col items-center text-center flex-grow">
            <div className="w-32 h-32 mb-6 bg-red-800 rounded-md p-2">
              {card.id === 1 && <TrainingIcon />}
              {card.id === 2 && <CraftIcon />}
              {card.id === 3 && <PerformanceIcon />}
              {card.id === 4 && <WorkshopIcon />}
              {card.id === 5 && <RomeIcon />}
            </div>

            <h3 className="text-xl font-bold mb-3 text-amber-300">{card.title}</h3>
            <p className="text-white text-sm leading-relaxed">{card.description}</p>
          </div>

          <Button
            variant="ghost"
            className="w-full py-4 rounded-none bg-amber-50 text-red-900 hover:bg-amber-100 hover:text-red-800"
          >
            Learn More
          </Button>
        </div>
      ))}
    </div>
  )
}

export default FeatureCards
