import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { encrypt } from "@/lib/session/session";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Find user by email
  const [user] = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, email));

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  // Ensure password is not null
  if (!user.password) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

//set session
const sessionToken = await encrypt({userId: user.id, username: user.name, email: user.email});
const oneDay = 60 * 60 * 24;

const cookieStore = await cookies();
cookieStore.set("session", sessionToken, {
  httpOnly: true,
  sameSite: "strict",
  maxAge: oneDay
});

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}