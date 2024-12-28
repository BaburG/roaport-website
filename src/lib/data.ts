import { Post } from "@/data/posts"
import { PrismaClient } from "@prisma/client"



export async function fetchPosts() {
    const prisma = new PrismaClient;

    const data = await prisma.reports.findMany({

    })
    
    const posts: Post[] = data.map(report => ({
        id: report.id.toString(),
        name: report.name,
        imageUrl: `https://img.roaport.com/${report.file_name}`, // Assuming imageUrl is constructed like this
        longitude: report.longitude,
        latitude: report.latitude,
        dateCreated: report.date_created ? new Date(report.date_created).toISOString() : "", // Ensure string format
    }));
    return posts
}