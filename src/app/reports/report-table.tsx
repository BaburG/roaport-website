'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Post } from "@/data/posts"

export function ReportTable({ reports }: { reports: Post[] }) {
  const router = useRouter()

  const handleView = (id: string) => {
    router.push(`/posts/${id}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>
              <Image
                src={report.imageUrl}
                alt={report.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
                unoptimized
              />
            </TableCell>
            <TableCell className="font-medium">{report.name}</TableCell>
            <TableCell>{report.type}</TableCell>
            <TableCell>{new Date(report.dateCreated).toLocaleDateString()}</TableCell>
            <TableCell>{`${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}</TableCell>
            <TableCell>{report.username}</TableCell>
            <TableCell>{report.verified ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleView(report.id)}>
                  View
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

