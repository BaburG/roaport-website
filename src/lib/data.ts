import { Post } from "@/data/posts"
import { prisma } from "@/lib/prisma";
import { PrismaClient } from '@prisma/client';
import type { reports as PrismaReport } from '@prisma/client'; // Import the Prisma-generated type
import type { ReportItem, Location, VerificationStatus, ReportStatus } from '@/components/reports/types';

const prismaClient = new PrismaClient();

// Helper to transform Prisma report to ReportItem
function transformReport(report: PrismaReport): ReportItem {
  const status: ReportStatus = report.verified ? 'fixed' : 'pending';
  const verification: VerificationStatus = report.verified ? 'verified' : 'pending_verification';
  
  // Construct imageUrl, assuming file_name is just the name and needs a path prefix
  // Adjust this logic if your file_name already includes the full path or needs different handling
  const imageUrl = report.bucket_name && report.file_name ? `/uploads/${report.bucket_name}/${report.file_name}` : '/placeholder.svg';
  
  const location: Location = {
    latitude: report.latitude,
    longitude: report.longitude,
    // Using report.name for address as a placeholder. Adjust if a better field is available or can be constructed.
    address: report.name || 'Address not available',
  };

  return {
    id: report.id.toString(), // Convert Int to string for ReportItem id
    name: report.name,
    imageUrl,
    location,
    dateCreated: report.date_created || new Date(), // Handle null date_created
    verification,
    status,
    description: report.detail || undefined,
    type: report.type || undefined,
    username: report.username || undefined,
  };
}

export async function fetchReportsFromDB(): Promise<ReportItem[]> {
  try {
    const dbReports = await prismaClient.reports.findMany({
      orderBy: {
        date_created: 'desc', // Optional: order by date
      },
      // Add any other conditions or includes if necessary
    });
    return dbReports.map(transformReport);
  } catch (error) {
    console.error("Failed to fetch reports from DB:", error);
    return []; // Return empty array on error
  }
}

// You might also want a function to fetch a single report by ID
export async function fetchReportById(id: number): Promise<ReportItem | null> {
  try {
    const report = await prismaClient.reports.findUnique({
      where: { id },
    });
    return report ? transformReport(report) : null;
  } catch (error) {
    console.error(`Failed to fetch report with id ${id}:`, error);
    return null;
  }
}

export async function fetchPosts() {

    const data = await prisma.reports.findMany({

    })
    

    const posts: Post[] = data.map(report => ({
        id: report.id.toString(),
        name: report.name,
        imageUrl: `https://img.roaport.com/${report.file_name}`, // Assuming imageUrl is constructed like this
        longitude: report.longitude,
        latitude: report.latitude,
        dateCreated: report.date_created ? new Date(report.date_created).toISOString() : "", // Ensure string format
        type: report.type ?? "",
        description: report.detail ?? "",
        username: report.username,
        verified: report.verified ? report.verified.toISOString() : ""
    }));
    return posts
}

export async function fetchPostById(id: string): Promise<Post | null> {
    const report = await prisma.reports.findUnique({
      where: { id: parseInt(id) },
    });
  
    if (!report) {
      return null;
    }
  
    const post: Post = {
      id: report.id.toString(),
      name: report.name,
      imageUrl: `https://img.roaport.com/${report.file_name}`,
      longitude: report.longitude,
      latitude: report.latitude,
      dateCreated: report.date_created ? new Date(report.date_created).toISOString() : "",
      type: report.type ?? "",
      description: report.detail ?? "",
      username: report.username,
      verified: report.verified ? report.verified.toISOString() : "",
    };
  
    return post;
  }

  export async function fetchScores() {
    const data = await prisma.uploadScoreboard.findMany({
      take: 10,
      orderBy: {
        total: 'desc',
      },
      select: {
        username: true,
        total: true,
      },
    });
    return data;
  }