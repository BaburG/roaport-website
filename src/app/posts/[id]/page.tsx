import { Suspense } from "react";
import { fetchPostById } from "@/lib/data";
import { PostDetailSkeleton } from "@/components/ui/post-detail-skeleton";
import { InteractivePostDetail } from "@/components/InteractivePostDetail";
import { Metadata } from "next";

// Generate metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await fetchPostById(params.id);
  return {
    title: post ? `${post.name} | Hazard Report` : "Hazard Report Details",
  };
}

// Post detail component
async function PostDetail({ id }: { id: string }) {
  const post = await fetchPostById(id);

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <h1 className="text-2xl font-bold">Post not found.</h1>
      </div>
    );
  }

  return <InteractivePostDetail post={post} />;
}

// Main component
export default async function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Hazard Report Details</h1>
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail id={params.id} />
      </Suspense>
    </main>
  );
}

