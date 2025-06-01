import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { fetchReportById } from "@/lib/data"
import ReportDetail from "@/components/reports/report-detail"

export const metadata: Metadata = {
  title: "Report Details | Roaport",
  description: "View and manage detailed information about a road hazard report.",
}

interface ReportDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const reportId = parseInt(id);
  
  if (isNaN(reportId)) {
    notFound();
  }

  const report = await fetchReportById(reportId);
  
  if (!report) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReportDetail report={report} />
    </div>
  )
} 