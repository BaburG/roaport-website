"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HazardStatusChart from "./hazard-status-chart"
import HazardTypesChart from "./hazard-types-chart"
import RepairTimeMetric from "./repair-time-metric"
import UserEngagementChart from "./user-engagement-chart"

export default function StatisticsOverview() {
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#1A2E4C]">Overview</h2>
        <Tabs defaultValue="month" value={timeRange} onValueChange={setTimeRange} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Hazards</CardDescription>
            <CardTitle className="text-4xl">
              {timeRange === "week" ? "127" : timeRange === "month" ? "583" : "6,247"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-[#60D394] inline-flex items-center">
                +{timeRange === "week" ? "12" : timeRange === "month" ? "48" : "342"}
              </span>{" "}
              from previous {timeRange}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-4xl">
              {timeRange === "week" ? "842" : timeRange === "month" ? "3,156" : "24,891"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-[#60D394] inline-flex items-center">
                +{timeRange === "week" ? "56" : timeRange === "month" ? "214" : "1,876"}
              </span>{" "}
              from previous {timeRange}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reports per User</CardDescription>
            <CardTitle className="text-4xl">
              {timeRange === "week" ? "1.8" : timeRange === "month" ? "2.3" : "3.1"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-[#4A90E2] inline-flex items-center">
                {timeRange === "week" ? "+0.2" : timeRange === "month" ? "+0.3" : "+0.5"}
              </span>{" "}
              from previous {timeRange}
            </div>
          </CardContent>
        </Card>

        <RepairTimeMetric timeRange={timeRange} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hazard Status</CardTitle>
            <CardDescription>Distribution of reported, in provision, and fixed hazards</CardDescription>
          </CardHeader>
          <CardContent>
            <HazardStatusChart timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hazard Types</CardTitle>
            <CardDescription>Breakdown of hazards by category</CardDescription>
          </CardHeader>
          <CardContent>
            <HazardTypesChart timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Active users and reports submitted over time</CardDescription>
        </CardHeader>
        <CardContent>
          <UserEngagementChart timeRange={timeRange} />
        </CardContent>
      </Card>
    </div>
  )
}
