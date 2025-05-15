"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HazardStatusChartProps {
  timeRange: string
}

export default function HazardStatusChart({ timeRange }: HazardStatusChartProps) {
  // Sample data that changes based on the selected time range
  const getData = () => {
    if (timeRange === "week") {
      return [
        { name: "Reported", value: 52, fill: "#4A90E2" },
        { name: "In Provision", value: 38, fill: "#F5A623" },
        { name: "Fixed", value: 37, fill: "#60D394" },
      ]
    } else if (timeRange === "month") {
      return [
        { name: "Reported", value: 243, fill: "#4A90E2" },
        { name: "In Provision", value: 167, fill: "#F5A623" },
        { name: "Fixed", value: 173, fill: "#60D394" },
      ]
    } else {
      return [
        { name: "Reported", value: 2547, fill: "#4A90E2" },
        { name: "In Provision", value: 1823, fill: "#F5A623" },
        { name: "Fixed", value: 1877, fill: "#60D394" },
      ]
    }
  }

  const data = getData()
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-[300px]">
      <ChartContainer
        config={{
          reported: {
            label: "Reported",
            color: "#4A90E2",
          },
          inProvision: {
            label: "In Provision",
            color: "#F5A623",
          },
          fixed: {
            label: "Fixed",
            color: "#60D394",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex justify-center mt-4 gap-6">
        {data.map((item, index) => (
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
