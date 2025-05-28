"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface RepairTimeMetricProps {
  timeRange: string
}

export default function RepairTimeMetric({ timeRange }: RepairTimeMetricProps) {
  // Sample data that changes based on the selected time range
  const getRepairTime = () => {
    if (timeRange === "week") {
      return { days: 3, hours: 8, trend: "down", percent: 12 }
    } else if (timeRange === "month") {
      return { days: 3, hours: 14, trend: "down", percent: 8 }
    } else {
      return { days: 4, hours: 2, trend: "down", percent: 15 }
    }
  }

  const { days, hours, trend, percent } = getRepairTime()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Average Time to Repair</CardDescription>
        <CardTitle className="text-4xl flex items-center">
          <Clock className="mr-2 h-6 w-6 text-[#4A90E2]" />
          {days}d {hours}h
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <span className={`text-[#60D394] inline-flex items-center`}>
            {trend === "down" ? "↓" : "↑"} {percent}%
          </span>{" "}
          from previous {timeRange}
        </div>
      </CardContent>
    </Card>
  )
}
