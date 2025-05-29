import type { Metadata } from "next"
import ReportList from "@/components/reports/report-list"
import { fetchReportsFromDB } from "@/lib/data"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Report View | Roaport",
  description: "View and manage road hazard reports in a comprehensive list view.",
}

export default async function ReportsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const reports = await fetchReportsFromDB();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2E4C] mb-2">Report View</h1>
        <p className="text-muted-foreground">
          Browse and filter road hazard reports submitted by users across the platform.
        </p>
      </div>
      <ReportList initialReports={reports} />
    </div>
  )
}
