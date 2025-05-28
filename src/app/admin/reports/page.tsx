import type { Metadata } from "next"
import ReportList from "@/components/reports/report-list"
import { fetchReportsFromDB } from "@/lib/data"; // Import data fetching function

export const metadata: Metadata = {
  title: "Report View | Roaport",
  description: "View and manage road hazard reports in a comprehensive list view.",
}

// Make the component async to fetch data
export default async function ReportsPage() {
  const reports = await fetchReportsFromDB(); // Fetch reports from DB

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2E4C] mb-2">Report View</h1>
        <p className="text-muted-foreground">
          Browse and filter road hazard reports submitted by users across the platform.
        </p>
      </div>
      {/* Pass fetched reports to ReportList */}
      <ReportList initialReports={reports} /> 
    </div>
  )
}
