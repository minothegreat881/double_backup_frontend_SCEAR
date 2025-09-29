"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMemo } from "react"
import { format, parseISO } from "date-fns"

type Event = {
  startDate: string
}

type EventsChartProps = {
  events: Event[]
}

export default function EventsChart({ events }: EventsChartProps) {
  const data = useMemo(() => {
    const monthCounts: { [key: string]: number } = {}

    events.forEach((event) => {
      try {
        const month = format(parseISO(event.startDate), "yyyy-MM")
        monthCounts[month] = (monthCounts[month] || 0) + 1
      } catch (error) {
        console.error("Invalid date format for event:", event)
      }
    })

    const sortedMonths = Object.keys(monthCounts).sort()

    return sortedMonths.map((month) => ({
      name: format(new Date(`${month}-01`), "MMM"),
      total: monthCounts[month],
    }))
  }, [events])

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-red-800/20">
      <CardHeader>
        <CardTitle className="text-white">Events Overview</CardTitle>
        <CardDescription className="text-white/70">Number of events per month.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#ffffff" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#ffffff"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                borderColor: "#991b1b",
                color: "#ffffff",
              }}
              cursor={{ fill: "rgba(153, 27, 27, 0.1)" }}
            />
            <Legend wrapperStyle={{ color: "#ffffff" }} />
            <Bar dataKey="total" fill="#b91c1c" radius={[4, 4, 0, 0]} name="Events" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
