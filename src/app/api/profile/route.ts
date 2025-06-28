import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/getSession";
import { db } from "@/lib/db";
import { usersTable, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get user info
    const user = await db.select().from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Get user's posts
    const userPosts = await db.select().from(posts).where(eq(posts.authorId, session.userId));
    return NextResponse.json({ user: user[0], posts: userPosts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
} 