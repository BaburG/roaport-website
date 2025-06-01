'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Post } from "@/data/posts"

export function ReportTable({ reports, locale }: { reports: Post[], locale: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const reportsPerPage = 10

  // Sort reports based on selected order
  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.dateCreated).getTime()
    const dateB = new Date(b.dateCreated).getTime()
    
    if (sortOrder === 'newest') {
      return dateB - dateA // Newest first
    } else {
      return dateA - dateB // Oldest first
    }
  })

  const totalPages = Math.ceil(sortedReports.length / reportsPerPage)
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = sortedReports.slice(indexOfFirstReport, indexOfLastReport)

  const handleImageClick = (imageUrl: string, name: string) => {
    setSelectedImage({ url: imageUrl, alt: name })
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const handleSortChange = (value: 'newest' | 'oldest') => {
    setSortOrder(value)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const translations = {
    en: {
      image: "Image",
      type: "Type", 
      date: "Date",
      location: "Location",
      status: "Status",
      verified: "Verified",
      pending: "Pending",
      noReports: "No reports found",
      showing: "Showing",
      of: "of",
      reports: "reports",
      sortBy: "Sort by",
      newest: "Newest first",
      oldest: "Oldest first"
    },
    tr: {
      image: "Görsel",
      type: "Tür",
      date: "Tarih", 
      location: "Konum",
      status: "Durum",
      verified: "Doğrulandı",
      pending: "Beklemede",
      noReports: "Rapor bulunamadı",
      showing: "Gösterilen",
      of: "/",
      reports: "rapor",
      sortBy: "Sırala",
      newest: "Yeniden eskiye",
      oldest: "Eskiden yeniye"
    }
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">{t.noReports}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{t.sortBy}:</span>
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.newest}</SelectItem>
              <SelectItem value="oldest">{t.oldest}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{t.image}</TableHead>
                <TableHead>{t.type}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.location}</TableHead>
                <TableHead>{t.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div 
                      className="w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity shadow-sm border"
                      onClick={() => handleImageClick(report.imageUrl, report.name)}
                    >
                      <Image
                        src={report.imageUrl}
                        alt={report.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{report.type}</TableCell>
                  <TableCell>
                    {new Date(report.dateCreated).toLocaleDateString(locale)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="text-xs text-muted-foreground">
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={report.verified ? "default" : "secondary"}
                      className={report.verified ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    >
                      {report.verified ? t.verified : t.pending}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            {t.showing} {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, sortedReports.length)} {t.of} {sortedReports.length} {t.reports}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                const isCurrentPage = pageNumber === currentPage
                
                // Show first page, last page, current page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(pageNumber)
                        }}
                        isActive={isCurrentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                
                // Show ellipsis
                if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <span className="px-3 py-2">...</span>
                    </PaginationItem>
                  )
                }
                
                return null
              })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeModal}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          {selectedImage && (
            <div className="relative w-full h-[60vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 