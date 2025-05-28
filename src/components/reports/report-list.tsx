"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockReports } from "./mock-data"
import type { ReportItem, VerificationStatus, ReportStatus } from "./types"
import ReportImage from "./report-image"
import { formatDate } from "@/lib/utils"

export default function ReportList() {
  const [reports, setReports] = useState<ReportItem[]>(mockReports)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const reportsPerPage = 10

  // Filter reports based on search query and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesVerification = verificationFilter === "all" || report.verification === verificationFilter

    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesVerification && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)

  // Handle page change
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Get badge color based on verification status
  const getVerificationBadgeColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "verified_by_ml":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "waiting_ml_verification":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "waiting_human_verification":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Get badge color based on report status
  const getStatusBadgeColor = (status: ReportStatus) => {
    switch (status) {
      case "verified":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "in_provision":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "fixed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Format verification status for display
  const formatVerificationStatus = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "verified_by_ml":
        return "Verified by ML"
      case "waiting_ml_verification":
        return "Waiting ML Verification"
      case "waiting_human_verification":
        return "Waiting Human Verification"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  // Format report status for display
  const formatReportStatus = (status: ReportStatus) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "in_provision":
        return "In Provision"
      case "fixed":
        return "Fixed"
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
              placeholder="Search by location or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verifications</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="verified_by_ml">Verified by ML</SelectItem>
                  <SelectItem value="waiting_ml_verification">Waiting ML Verification</SelectItem>
                  <SelectItem value="waiting_human_verification">Waiting Human Verification</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="in_provision">In Provision</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <ReportImage imageUrl={report.imageUrl} alt={`Report ${report.id}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{report.location.address}</div>
                      <div className="text-xs text-muted-foreground">
                        {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No reports found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
