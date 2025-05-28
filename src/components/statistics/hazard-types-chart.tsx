"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HazardTypesChartProps {
  timeRange: string
}

export default function HazardTypesChart({ timeRange }: HazardTypesChartProps) {
  // Sample data that changes based on the selected time range
  const getData = () => {
    const multiplier = timeRange === "week" ? 1 : timeRange === "month" ? 4 : 48

    return [
      { name: "Potholes", value: 42 * multiplier, fill: "#4A90E2" },
      { name: "Damaged Signs", value: 28 * multiplier, fill: "#6BBDF0" },
      { name: "Damaged Sidewalk", value: 22 * multiplier, fill: "#F5A623" },
      { name: "Other", value: 16 * multiplier, fill: "#9013FE" },
    ]
  }

  const data = getData()

  return (
    <div className="w-full h-[300px]">
      <ChartContainer
        config={{
          value: {
            label: "Count",
            color: "#4A90E2",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="#4A90E2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
