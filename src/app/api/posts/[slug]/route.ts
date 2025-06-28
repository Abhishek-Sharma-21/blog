import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, usersTable } from "@/lib/db/schema";
import { getSession } from "@/lib/session/getSession";
import { eq, and } from "drizzle-orm";

// GET - Fetch a single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await db
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
      .where(eq(posts.slug, params.slug))
      .limit(1);

    if (!post.length) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post: post[0] });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    // Check if post exists and user is the author
    const existingPost = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.slug, params.slug),
          eq(posts.authorId, session.userId)
        )
      )
      .limit(1);

    if (!existingPost.length) {
      return NextResponse.json(
        { error: "Post not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    // Create new slug from title
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const updatedPost = await db
      .update(posts)
      .set({
        title,
        description,
        slug: newSlug,
        content,
        updatedAt: new Date(),
      })
      .where(eq(posts.slug, params.slug))
      .returning();

    return NextResponse.json({ post: updatedPost[0] });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if post exists and user is the author
    const existingPost = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.slug, params.slug),
          eq(posts.authorId, session.userId)
        )
      )
      .limit(1);

    if (!existingPost.length) {
      return NextResponse.json(
        { error: "Post not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    await db.delete(posts).where(eq(posts.slug, params.slug));

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
} 