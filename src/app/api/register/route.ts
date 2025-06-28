import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { encrypt } from "@/lib/session/session";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!; // Add this to your .env

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const [user] = await db.insert(usersTable).values({
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  }).returning();

//set session
const sessionToken = await encrypt({userId: user.id, username: user.name, email: user.email});

const oneDay = 60 * 60 * 24; // 1 day in seconds
const cookieStore = await cookies();
cookieStore.set("session", sessionToken, {
  httpOnly: true,
  sameSite: "strict",
  maxAge: oneDay,
});

 return new Response(JSON.stringify({ success: true }), {
   status: 201,

 });
}