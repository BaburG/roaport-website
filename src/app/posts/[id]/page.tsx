import { Suspense } from "react"
import { fetchPostById } from "@/lib/data"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { PostDetailSkeleton } from "@/components/ui/post-detail-skeleton"
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await fetchPostById(params.id)
  return {
    title: post ? `${post.name} | Hazard Report` : 'Hazard Report Details',
  }
}

async function PostDetail({ id }: { id: string }) {
  const post = await fetchPostById(id)

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-2xl font-bold">Post not found.</h1>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0 relative group">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <p className="text-white text-lg font-semibold">{post.name}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-3xl font-bold mb-6">{post.username}</CardTitle>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>
                ({post.longitude.toFixed(4)}, {post.latitude.toFixed(4)})
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Type of Hazard</h3>
            <div className="flex items-center space-x-2 text-sm">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span>{post.type}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{post.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Date Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Created: {new Date(post.dateCreated).toLocaleString()}</span>
              </div>
              {post.verified && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified: {new Date(post.verified).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 p-6">
        <Button variant="outline" className="w-28">
          Reject
        </Button>
        <Button variant="default" className="w-28">
          Approve
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Hazard Report Details</h1>
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail id={params.id} />
      </Suspense>
    </main>
  )
}

