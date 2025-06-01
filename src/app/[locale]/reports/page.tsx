import { Post } from "@/data/posts"
import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { ReportTable } from './report-table'

export const dynamic = 'force-dynamic'

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export default async function ReportsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  const titles: Record<string, string> = {
    en: "Hazard Reports",
    tr: "Tehlike Bildirimleri"
  };

  let reports: Post[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/posts`, {
      next: {
        revalidate: 60 // Revalidate every 60 seconds
      }
    });
    if (response.ok) {
      reports = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch reports:", error);
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{titles[locale]}</h1>
      <Suspense fallback={<TableSkeleton />}>
        <ReportTable reports={reports} locale={locale} />
      </Suspense>
    </div>
  )
} 