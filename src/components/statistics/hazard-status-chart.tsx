"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ReportStatus } from "@/components/reports/types"; // Import ReportStatus

interface HazardStatusChartProps {
  // timeRange: string // Removed timeRange
  data: Record<ReportStatus, number>; // Accept aggregated data
}

// Updated statusConfig to reflect desired chart labels
const statusConfig: Record<ReportStatus, { name: string; fill: string; chartLabel?: string }> = {
  pending: { 
    name: "Pending", // Internal key from ReportStatus
    fill: "#F5A623", // Orange/Yellow for pending
    chartLabel: "Pending Verification / Not Fixed" // Label for the chart
  },
  fixed: { 
    name: "Fixed", // Internal key from ReportStatus
    fill: "#60D394", // Green for fixed
    chartLabel: "Fixed / Verified" // Label for the chart
  },
};

// export default function HazardStatusChart({ timeRange }: HazardStatusChartProps) { // Old signature
export default function HazardStatusChart({ data: rawData }: HazardStatusChartProps) { // New signature
  
  const chartData = Object.entries(rawData)
    .map(([statusKey, value]) => {
      const config = statusConfig[statusKey as ReportStatus];
      // Use chartLabel for display if available, otherwise use name
      return config ? { name: config.chartLabel || config.name, value, fill: config.fill } : null;
    })
    .filter(item => item !== null && item.value > 0) as { name: string; value: number; fill: string }[];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0 || total === 0) {
    return <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">No relevant hazard status data available.</div>;
  }

  // Dynamically build the ChartContainer config from statusConfig for items present in chartData
  const chartContainerConfig = chartData.reduce((acc: Record<string, { label: string; color: string }>, item) => {
    // Find the original status key by matching chartLabel or name back to statusConfig
    const originalStatusKey = Object.keys(statusConfig).find(key => 
      (statusConfig[key as ReportStatus].chartLabel || statusConfig[key as ReportStatus].name) === item.name
    ) as ReportStatus | undefined;

    if (originalStatusKey) {
      // Use the original status key (e.g., 'pending', 'fixed') for the ChartContainer config keys
      // This makes the config consistent with how `ChartStyle` might expect to find theme colors.
      acc[originalStatusKey] = { 
        label: item.name, // This is the display name like "Pending Verification / Not Fixed"
        color: item.fill,
      };
    }
    return acc;
  }, {}); // Removed 'as any', provided a more specific type for acc and initial value

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartContainerConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex justify-center mt-4 gap-6 flex-wrap">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
            <span className="text-sm">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
