"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface UserEngagementChartProps {
  timeRange: string
}

export default function UserEngagementChart({ timeRange }: UserEngagementChartProps) {
  // Generate sample data based on the selected time range
  const getData = () => {
    if (timeRange === "week") {
      return [
        { name: "Mon", users: 120, reports: 215 },
        { name: "Tue", users: 132, reports: 251 },
        { name: "Wed", users: 101, reports: 178 },
        { name: "Thu", users: 134, reports: 234 },
        { name: "Fri", users: 190, reports: 327 },
        { name: "Sat", users: 230, reports: 402 },
        { name: "Sun", users: 210, reports: 375 },
      ]
    } else if (timeRange === "month") {
      return [
        { name: "Week 1", users: 720, reports: 1245 },
        { name: "Week 2", users: 832, reports: 1451 },
        { name: "Week 3", users: 901, reports: 1678 },
        { name: "Week 4", users: 934, reports: 1734 },
      ]
    } else {
      return [
        { name: "Jan", users: 2720, reports: 5245 },
        { name: "Feb", users: 2832, reports: 5451 },
        { name: "Mar", users: 3901, reports: 7678 },
        { name: "Apr", users: 3934, reports: 7734 },
        { name: "May", users: 4120, reports: 8215 },
        { name: "Jun", users: 4532, reports: 9251 },
        { name: "Jul", users: 4301, reports: 8978 },
        { name: "Aug", users: 4534, reports: 9234 },
        { name: "Sep", users: 4890, reports: 10327 },
        { name: "Oct", users: 5230, reports: 11402 },
        { name: "Nov", users: 5410, reports: 11875 },
        { name: "Dec", users: 5650, reports: 12450 },
      ]
    }
  }

  const data = getData()

  return (
    <div className="w-full h-[400px]">
      <ChartContainer
        config={{
          users: {
            label: "Active Users",
            color: "#4A90E2",
          },
          reports: {
            label: "Reports Submitted",
            color: "#60D394",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="users"
              stroke="var(--color-users)"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line yAxisId="right" type="monotone" dataKey="reports" stroke="var(--color-reports)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
