"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, User, FileText, Tag, Save, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { ReportItem, VerificationStatus, ReportStatus } from "./types"
import ReportImage from "./report-image"
import { toast } from "sonner"

interface ReportDetailProps {
  report: ReportItem
}

export default function ReportDetail({ report }: ReportDetailProps) {
  const router = useRouter()
  const [verification, setVerification] = useState<VerificationStatus>(report.verification)
  const [status, setStatus] = useState<ReportStatus>(report.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verification,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update report')
      }

      toast.success('Report updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Error updating report:', error)
      toast.error('Failed to update report')
    } finally {
      setIsUpdating(false)
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

  const hasChanges = verification !== report.verification || status !== report.status

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
        
        <div className="flex items-center gap-4">
          <Badge className={`${getVerificationBadgeColor(report.verification)} font-normal`}>
            {formatVerificationStatus(report.verification)}
          </Badge>
          <Badge className={`${getStatusBadgeColor(report.status)} font-normal`}>
            {formatReportStatus(report.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Image and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report #{report.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <ReportImage 
                imageUrl={report.imageUrl} 
                alt={report.name || `Report ${report.id}`}
                wrapperClassName="relative w-full h-full cursor-pointer"
                imageClassName="object-cover transition-opacity duration-300"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{report.name || "Unnamed Report"}</h3>
                {report.description && (
                  <p className="text-muted-foreground mt-1">{report.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(report.dateCreated)}
              </div>
              
              {report.username && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {report.username}
                </div>
              )}
              
              {report.type && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  {report.type}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location and Actions */}
        <div className="space-y-6">
          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{report.location.address}</p>
                <p className="text-sm text-muted-foreground">
                  {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                </p>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const url = `https://maps.google.com/?q=${report.location.latitude},${report.location.longitude}`
                  window.open(url, '_blank')
                }}
              >
                Open in Google Maps
              </Button>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Status</label>
                <Select value={verification} onValueChange={(value: VerificationStatus) => setVerification(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_verification">Pending Verification</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Report Status</label>
                <Select value={status} onValueChange={(value: ReportStatus) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_provision">In Provision</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={!hasChanges || isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 