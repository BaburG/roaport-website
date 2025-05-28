"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HazardTypeDataItem {
  name: string;
  value: number;
  fill?: string; // Optional fill color, can be added if needed by specific designs
}
interface HazardTypesChartProps {
  // timeRange: string // Removed timeRange
  data: HazardTypeDataItem[]; // Accept array of { name: string, value: number, fill?: string }
}

// export default function HazardTypesChart({ timeRange }: HazardTypesChartProps) { // Old signature
export default function HazardTypesChart({ data }: HazardTypesChartProps) { // New signature
  // const data = getData() // Removed old data fetching

  if (!data || data.length === 0) {
    return <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">No data available for hazard types.</div>;
  }

  // Define a default fill color or use colors from data if provided
  const defaultFillColor = "#4A90E2";

  return (
    <div className="w-full h-[300px]">
      <ChartContainer
        config={{
          value: {
            label: "Count",
            color: defaultFillColor, // Use a consistent color or derive from data
          },
          // If types have specific colors, they can be configured here, e.g.:
          // Potholes: { label: "Potholes", color: "#someColor" },
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {/* If individual bar colors are needed based on data[i].fill */}
              {/* {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill || defaultFillColor} />))} */}
              {/* For a single color bar chart, just set fill on <Bar> */}
            </Bar>
            {/* Ensure the <Bar> component has a fill. It can be static or dynamic per bar. */}
            {/* If using a single color for all bars: */}
            <Bar dataKey="value" fill={defaultFillColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
