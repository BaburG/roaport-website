'use client'

import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Post } from "@/data/posts"
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n'

export function ReportTable({ reports, locale }: { reports: Post[], locale: string }) {
  const router = useRouter();
  const t = useTranslations('ReportsPage.columns');

  const handleView = (id: string) => {
    router.push(`/posts/${id}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('type')}</TableHead>
          <TableHead>{t('dateCreated')}</TableHead>
          <TableHead>{t('location')}</TableHead>
          <TableHead>{t('username')}</TableHead>
          <TableHead>{t('status')}</TableHead>
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
              />
            </TableCell>
            <TableCell className="font-medium">{report.name}</TableCell>
            <TableCell>{report.type}</TableCell>
            <TableCell>{new Date(report.dateCreated).toLocaleDateString(locale)}</TableCell>
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