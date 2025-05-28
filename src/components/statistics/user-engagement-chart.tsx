"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface UserEngagementDataItem {
  name: string; // e.g., "Jan", "Feb" or "Week 1", "Mon"
  users: number;
  reports: number;
}

interface UserEngagementChartProps {
  // timeRange: string // Removed timeRange
  data: UserEngagementDataItem[]; // Accept array of { name: string, users: number, reports: number }
}

// export default function UserEngagementChart({ timeRange }: UserEngagementChartProps) { // Old signature
export default function UserEngagementChart({ data }: UserEngagementChartProps) { // New signature
  // const data = getData() // Removed old data fetching

  if (!data || data.length === 0) {
    return <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">No data available for user engagement.</div>;
  }

  return (
    <div className="w-full h-[400px]">
      <ChartContainer
        config={{
          users: {
            label: "Active Users",
            color: "#4A90E2", // Or use: "hsl(var(--chart-1))"
          },
          reports: {
            label: "Reports Submitted",
            color: "#60D394", // Or use: "hsl(var(--chart-2))"
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data} // Use the passed-in data
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
              stroke="var(--color-users)" // Ensure this CSS variable is defined if using it
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="reports" 
              stroke="var(--color-reports)" // Ensure this CSS variable is defined
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
