import { Post } from "@/data/posts"
import { prisma } from "@/lib/prisma";



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