import { Post } from "@/data/posts"
import { prisma } from "@/lib/prisma";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

function getBoundingBox(lat: number, lon: number, distanceKm: number) {
    const R = 6371;
    const latRad = lat * Math.PI / 180;
    const lonRad = lon * Math.PI / 180;
    
    const distanceRad = distanceKm / R;
    
    let minLat = latRad - distanceRad;
    let maxLat = latRad + distanceRad;
    
    let minLon, maxLon;
    if (minLat > -Math.PI/2 && maxLat < Math.PI/2) {
        const deltaLon = Math.asin(Math.sin(distanceRad) / Math.cos(latRad));
        minLon = lonRad - deltaLon;
        maxLon = lonRad + deltaLon;
    } else {
        minLat = Math.max(minLat, -Math.PI/2);
        maxLat = Math.min(maxLat, Math.PI/2);
        minLon = -Math.PI;
        maxLon = Math.PI;
    }
    
    return {
        minLat: minLat * 180 / Math.PI,
        maxLat: maxLat * 180 / Math.PI,
        minLon: minLon * 180 / Math.PI,
        maxLon: maxLon * 180 / Math.PI
    };
}

export async function fetchPosts(userLat?: number, userLon?: number, maxDistance: number = 3, verified: boolean = false) {
    let whereClause: any = {};
    
    if (userLat !== undefined && userLon !== undefined) {
        const box = getBoundingBox(userLat, userLon, maxDistance);
        whereClause = {
            AND: [
                { latitude: { gte: box.minLat } },
                { latitude: { lte: box.maxLat } },
                { longitude: { gte: box.minLon } },
                { longitude: { lte: box.maxLon } }
            ]
        };
    }
    if (verified) {
        whereClause = {
            ...whereClause,
            verified: { not: null }
        };
    }

    const data = await prisma.reports.findMany({
        where: whereClause
    });

    let posts: Post[] = data.map(report => ({
        id: report.id.toString(),
        name: report.name,
        imageUrl: `https://img.roaport.com/${report.file_name}`,
        longitude: report.longitude,
        latitude: report.latitude,
        dateCreated: report.date_created ? new Date(report.date_created).toISOString() : "",
        type: report.type ?? "",
        description: report.detail ?? "",
        username: report.username,
        verified: report.verified ? report.verified.toISOString() : ""
    }));

    if (userLat !== undefined && userLon !== undefined) {
        posts = posts.filter(post => {
            const distance = calculateDistance(
                userLat,
                userLon,
                post.latitude,
                post.longitude
            );
            return distance <= maxDistance;
        });
    }

    return posts;
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