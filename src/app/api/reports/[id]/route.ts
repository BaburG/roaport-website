import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NotificationService } from '@/services/notification.service'

interface UpdateReportBody {
  verification?: "verified" | "pending_verification"
  status?: "pending" | "in_provision" | "fixed" | "rejected"
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const reportId = parseInt(id)
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 })
    }

    const body: UpdateReportBody = await request.json()
    const { verification, status } = body

    // Validate input
    if (!verification && !status) {
      return NextResponse.json(
        { error: "At least one field must be provided" },
        { status: 400 }
      )
    }

    // Check if report exists
    const existingReport = await prisma.reports.findUnique({
      where: { id: reportId }
    })

    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: {
      verified?: Date | null;
      status?: string;
    } = {}
    
    // Track what changed for notifications
    let verificationChanged = false
    let statusChanged = false
    let notificationTitle = ''
    let notificationBody = ''
    
    if (verification) {
      const currentlyVerified = existingReport.verified !== null
      const willBeVerified = verification === "verified"
      
      if (currentlyVerified !== willBeVerified) {
        verificationChanged = true
        if (verification === "verified") {
          updateData.verified = new Date()
          notificationTitle = 'Report Verified'
          notificationBody = `Your report "${existingReport.name}" has been successfully verified.`
        } else if (verification === "pending_verification") {
          updateData.verified = null
          notificationTitle = 'Report Verification Cancelled'
          notificationBody = `Verification for your report "${existingReport.name}" has been cancelled.`
        }
      }
    }

    if (status) {
      // Convert the status to the database format (uppercase with spaces)
      let newDbStatus = ""
      switch (status) {
        case "in_provision":
          newDbStatus = "IN PROVISION"
          break
        case "fixed":
          newDbStatus = "FIXED"
          break
        case "rejected":
          newDbStatus = "REJECTED"
          break
        default:
          newDbStatus = "PENDING"
      }
      
      if (existingReport.status !== newDbStatus) {
        statusChanged = true
        updateData.status = newDbStatus
        
        // Set notification based on status change
        switch (status) {
          case "in_provision":
            notificationTitle = 'Report In Progress'
            notificationBody = `Your report "${existingReport.name}" is now being processed.`
            break
          case "fixed":
            notificationTitle = 'Report Resolved'
            notificationBody = `Your report "${existingReport.name}" has been successfully resolved!`
            break
          case "rejected":
            notificationTitle = 'Report Rejected'
            notificationBody = `Your report "${existingReport.name}" has been rejected.`
            break
          case "pending":
            notificationTitle = 'Report Status Updated'
            notificationBody = `Your report "${existingReport.name}" status has been updated to pending.`
            break
        }
      }
    }

    // Update the report
    const updatedReport = await prisma.reports.update({
      where: { id: reportId },
      data: updateData
    })

    // Send notification if there were changes and notification_token exists
    if ((verificationChanged || statusChanged) && existingReport.notification_token) {
      try {
        await NotificationService.sendPushNotification(
          existingReport.notification_token,
          {
            title: notificationTitle,
            body: notificationBody,
            data: {
              reportId: updatedReport.id,
              type: updatedReport.type,
              verification: verification || (existingReport.verified ? 'verified' : 'pending_verification'),
              status: status || 'pending'
            }
          }
        );
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      message: "Report updated successfully",
      report: updatedReport
    })

  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 