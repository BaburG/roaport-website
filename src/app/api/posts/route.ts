import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/posts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const maxDistance = searchParams.get('maxDistance');
    const verified = searchParams.get('verified') === 'true';

    const posts = await fetchPosts(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined,
      maxDistance ? parseFloat(maxDistance) : 3,
      verified
    );

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts", message: error }, 
      { status: 500 }
    );
  }
}
