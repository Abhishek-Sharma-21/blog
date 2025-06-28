import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, usersTable } from "@/lib/db/schema";
import { getSession } from "@/lib/session/getSession";
import { eq } from "drizzle-orm";

// GET - Fetch all posts with author information
export async function GET() {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        slug: posts.slug,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(posts)
      .leftJoin(usersTable, eq(posts.authorId, usersTable.id))
      .orderBy(posts.createdAt);

    return NextResponse.json({ posts: allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, content } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Title, description, and content are required" },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = await db.insert(posts).values({
      title,
      description,
      slug,
      content,
      authorId: session.userId,
    }).returning();

    return NextResponse.json({ post: newPost[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
} 