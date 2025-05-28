"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HazardStatusChart from "./hazard-status-chart"
import HazardTypesChart from "./hazard-types-chart"
import UserEngagementChart from "./user-engagement-chart"
import type { ReportItem, ReportStatus } from "@/components/reports/types"

interface StatisticsOverviewProps {
  reports: ReportItem[];
}

export default function StatisticsOverview({ reports = [] }: StatisticsOverviewProps) {
  const totalHazards = reports.length;

  // Aggregate active users based on unique usernames
  const uniqueUsernames = new Set(reports.map(report => report.username).filter(username => username));
  const activeUsers = uniqueUsernames.size;
  const reportsPerUser = activeUsers > 0 ? (totalHazards / activeUsers).toFixed(1) : "0.0";
  
  // hazardStatusCounts is already correctly using report.status which is derived in transformReport
  const hazardStatusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {} as Record<ReportStatus, number>); // Ensure ReportStatus is imported and used here

  // Aggregate hazard types data from report.type
  const hazardTypesCounts = reports.reduce((acc, report) => {
    const type = report.type || "Unknown"; // Default to "Unknown" if type is null/undefined
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hazardTypesData = Object.entries(hazardTypesCounts).map(([name, value]) => ({
    name,
    value,
  }));
  
  // User Engagement Data: Group reports by month for simplicity
  // This requires date-fns or similar for robust date manipulation, or manual extraction.
  // For now, let's create a simplified version that groups by month name.
  const engagementByMonth: Record<string, { month: string, year: number, users: Set<string>, reports: number }> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // Define monthNames here

  reports.forEach(report => {
    const date = new Date(report.dateCreated);
    const year = date.getFullYear();
    const monthNum = date.getMonth(); // 0-indexed
    const monthName = monthNames[monthNum];
    const key = `${year}-${monthName}`;

    if (!engagementByMonth[key]) {
      engagementByMonth[key] = { month: monthName, year: year, users: new Set(), reports: 0 };
    }
    if (report.username) {
      engagementByMonth[key].users.add(report.username);
    }
    engagementByMonth[key].reports += 1;
  });

  const userEngagementData = Object.values(engagementByMonth)
    .map(item => ({ name: `${item.month} ${item.year}`, users: item.users.size, reports: item.reports }))
    .sort((a,b) => {
        const [aMonthStr, aYearStr] = a.name.split(" ");
        const [bMonthStr, bYearStr] = b.name.split(" ");
        const aYear = parseInt(aYearStr);
        const bYear = parseInt(bYearStr);
        
        if (aYear !== bYear) return aYear - bYear;
        // monthNames should be accessible here now
        return monthNames.indexOf(aMonthStr) - monthNames.indexOf(bMonthStr);
    });


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#1A2E4C]">Overview</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Hazards</CardDescription>
            <CardTitle className="text-4xl">
              {totalHazards}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Current total reported hazards.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-4xl">
              {activeUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Unique users submitting reports.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reports per User</CardDescription>
            <CardTitle className="text-4xl">
              {reportsPerUser}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Average reports per active user.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hazard Status Distribution</CardTitle>
            <CardDescription>Overview of fixed/verified vs. pending verification/not fixed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <HazardStatusChart data={hazardStatusCounts} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hazard Types</CardTitle>
            <CardDescription>Breakdown of hazards by category</CardDescription>
          </CardHeader>
          <CardContent>
            <HazardTypesChart data={hazardTypesData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Users and reports submitted over time</CardDescription>
        </CardHeader>
        <CardContent>
          <UserEngagementChart data={userEngagementData} />
        </CardContent>
      </Card>
    </div>
  )
}
