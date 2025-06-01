"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ReportItem, VerificationStatus, ReportStatus } from "./types"
import ReportImage from "./report-image"
import { formatDate } from "@/lib/utils"

interface ReportListProps {
  initialReports: ReportItem[];
}

export default function ReportList({ initialReports }: ReportListProps) {
  const router = useRouter()
  const [reports, setReports] = useState<ReportItem[]>(initialReports)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    setReports(initialReports)
    setCurrentPage(1)
  }, [initialReports])

  const reportsPerPage = 10

  const filteredReports = reports.filter((report) => {
    const lowerSearchQuery = searchQuery.toLowerCase()
    const matchesSearch = 
      (report.name?.toLowerCase().includes(lowerSearchQuery)) ||
      (report.location.address.toLowerCase().includes(lowerSearchQuery)) ||
      (report.id.toLowerCase().includes(lowerSearchQuery))

    const matchesVerification = verificationFilter === "all" || report.verification === verificationFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesVerification && matchesStatus
  })

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReportsOnPage = filteredReports.slice(indexOfFirstReport, indexOfLastReport)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const getVerificationBadgeColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusBadgeColor = (status: ReportStatus) => {
    switch (status) {
      case "fixed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "in_provision":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatVerificationStatus = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "pending_verification":
        return "Pending Verification"
      default:
        return status
    }
  }

  const formatReportStatus = (status: ReportStatus) => {
    switch (status) {
      case "fixed":
        return "Fixed"
      case "in_provision":
        return "In Provision"
      case "pending":
        return "Pending"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Verification Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verifications</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending_verification">Pending Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Report Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_provision">In Provision</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name/Location</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReportsOnPage.length > 0 ? (
                currentReportsOnPage.map((report) => (
                  <TableRow 
                    key={report.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/admin/reports/${report.id}`)}
                  >
                    <TableCell>
                      <ReportImage imageUrl={report.imageUrl} alt={report.name || `Report ${report.id}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{report.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">
                        {report.location.address} ({report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)})
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(report.dateCreated)}</TableCell>
                    <TableCell>
                      <Badge className={`${getVerificationBadgeColor(report.verification)} font-normal`}>
                        {formatVerificationStatus(report.verification)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(report.status)} font-normal`}>
                        {formatReportStatus(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.type || "N/A"}</TableCell>
                    <TableCell>{report.username || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No reports found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredReports.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} of{" "}
              {filteredReports.length} reports
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
