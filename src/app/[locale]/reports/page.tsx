"use client"

import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Post } from "@/data/posts"
import Image from 'next/image'

export default function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [reports, setReports] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = React.use(params);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReports();
  }, []);

  const titles: Record<string, string> = {
    en: "Hazard Reports",
    tr: "Tehlike Bildirimleri"
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{titles[locale]}</h1>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="w-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Image</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Location</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 relative">
                      <Image 
                        src={report.imageUrl} 
                        alt={report.name} 
                        width={64}
                        height={64}
                        className="rounded-md object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(report.dateCreated).toLocaleDateString(locale)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.verified ? 'Verified' : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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