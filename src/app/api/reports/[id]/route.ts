import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

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
    
    if (verification) {
      if (verification === "verified") {
        updateData.verified = new Date()
      } else if (verification === "pending_verification") {
        updateData.verified = null
      }
    }

    if (status) {
      // Convert the status to the database format (uppercase with spaces)
      switch (status) {
        case "in_provision":
          updateData.status = "IN PROVISION"
          break
        case "fixed":
          updateData.status = "FIXED"
          break
        case "rejected":
          updateData.status = "REJECTED"
          break
        default:
          updateData.status = "PENDING"
      }
    }

    // Update the report
    const updatedReport = await prisma.reports.update({
      where: { id: reportId },
      data: updateData
    })

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