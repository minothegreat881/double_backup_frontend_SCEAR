import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

type StatsCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export default function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-transparent p-4 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-white/90">{title}</CardTitle>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
      </CardHeader>
      <CardContent className="bg-transparent px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="text-xl sm:text-2xl font-bold text-red-400">{value}</div>
        {description && <p className="text-xs text-white/70 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
