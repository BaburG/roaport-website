import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Post } from "@/data/posts"
import Image from "next/image"
import { fetchPosts } from "@/lib/data"
import Link from "next/link"



export async function PostGrid() {
    const posts: Post[] = await fetchPosts();


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
        <Link href={`/posts/${post.id}`}>
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
                    <CardTitle className="text-xl mb-2">{post.username}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-1">
                        <strong>Location:</strong> ({post.longitude.toFixed(4)}, {post.latitude.toFixed(4)})
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                        <strong>Type:</strong> {post.type}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                        <strong>Description:</strong> {post.description}
                    </p><p className="text-sm text-muted-foreground mb-1">
                        <strong>Date Created:</strong> {new Date(post.dateCreated).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <strong>Date Verified:</strong> {post.verified != "" ? new Date(post.verified).toLocaleString() : "Not Verified"}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

