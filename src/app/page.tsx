import { PostGrid } from "@/components/ui/post-grid"

export const dynamic = 'force-dynamic';

export default function Home() {

  return (
    <main className="min-h-screen bg-background">
      <PostGrid />
    </main>
  )
}

