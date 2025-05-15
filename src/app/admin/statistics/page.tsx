import type { Metadata } from "next"
import StatisticsOverview from "@/components/statistics/statistics-overview"

export const metadata: Metadata = {
  title: "Admin Statistics | Roaport",
  description: "Administrative dashboard for monitoring and analyzing road hazard reporting system performance.",
}

export default function AdminStatisticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2E4C] mb-2">Admin Statistics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive administrative dashboard for monitoring system performance, user engagement, and detailed analytics.
        </p>
      </div>
      <StatisticsOverview />
    </div>
  )
} 