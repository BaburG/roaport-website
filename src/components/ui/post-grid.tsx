import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Post } from "@/data/posts"
import Image from "next/image"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient;

export async function PostGrid() {
 
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


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Uploaded Images</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

function PostCard({ post }: { post: Post }) {
    return (
        <Card>
            <CardHeader className="p-0">
                <AspectRatio ratio={4 / 3}>
                    <Image
                        src={post.imageUrl}
                        alt={post.name}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                </AspectRatio>
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{post.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-1">
                    <strong>Location:</strong> ({post.longitude.toFixed(4)}, {post.latitude.toFixed(4)})
                </p>
                <p className="text-sm text-muted-foreground">
                    <strong>Date Created:</strong> {new Date(post.dateCreated).toLocaleString()}
                </p>
            </CardContent>
        </Card>
    )
}

