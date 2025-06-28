import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, usersTable } from "@/lib/db/schema";
import { eq, or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ posts: [] });
    }

    const searchTerm = `%${query.trim()}%`;

    const searchResults = await db
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
      .where(
        or(
          ilike(posts.title, searchTerm),
          ilike(posts.description, searchTerm),
          ilike(posts.content, searchTerm)
        )
      )
      .orderBy(posts.createdAt);

    return NextResponse.json({ posts: searchResults });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
} 