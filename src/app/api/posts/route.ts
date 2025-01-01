import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.reports.findMany();

    const formattedPosts = posts.map((report) => ({
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
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
