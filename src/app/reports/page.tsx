import { Suspense } from 'react'
import { ReportTable } from './report-table'
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPosts } from "@/lib/data"
import { Post } from "@/data/posts"


export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hazard Reports',
  description: 'List of all hazard reports',
}

async function getReports(): Promise<Post[]> {
  try {
    return await fetchPosts()
  } catch (error) {
    console.error("Failed to fetch reports:", error)
    return []
  }
}

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Hazard Reports</h1>
      <Suspense fallback={<TableSkeleton />}>
        <ReportTable reports={reports} />
      </Suspense>
    </div>
  )
}

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

