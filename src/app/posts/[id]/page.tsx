import type { Metadata } from "next";
import { Suspense } from "react";

import { fetchPostById } from "@/lib/data";
import { PostDetailSkeleton } from "@/components/ui/post-detail-skeleton";
import { InteractivePostDetail } from "@/components/InteractivePostDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostById(id);

  return {
    title: post ? `${post.name} | Hazard Report` : "Hazard Report Details",
  };
}

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

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Hazard Report Details</h1>
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail id={id} />
      </Suspense>
    </main>
  );
}
