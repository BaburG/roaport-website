import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/data";

export async function GET() {
  try {
    const posts = await fetchPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
