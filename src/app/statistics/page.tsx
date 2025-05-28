import type { Metadata } from "next"
import StatisticsOverview from "@/components/statistics/statistics-overview"

export const metadata: Metadata = {
  title: "Public Statistics | Roaport",
  description: "Key performance indicators showcasing the effectiveness of our road hazard reporting system.",
}

export default function StatisticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2E4C] mb-2">Public Statistics</h1>
        <p className="text-muted-foreground">
          Explore key performance indicators showcasing the effectiveness of our road hazard reporting system and user
          engagement.
        </p>
      </div>
      <StatisticsOverview />
    </div>
  )
}
