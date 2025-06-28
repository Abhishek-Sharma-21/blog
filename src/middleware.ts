import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session/session";
import { updateSession } from "@/lib/session/updateSession";

// List of routes to protect
const protectedPaths = ["/profile", "/post/create-post", "/post/edit", "/post/"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only run protection on specified routes
  if (
    protectedPaths.some(path =>
      path === "/post/"
        ? /^\/post\/[^/]+$/.test(pathname) // protect /post/[slug] but not /post/create-post or /post/edit
        : pathname.startsWith(path)
    )
  ) {
    // 1. Get the session cookie from the request
    const sessionToken = req.cookies.get("session")?.value;

    // 2. If no session cookie, redirect to auth
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // 3. Decrypt and validate the session token
    const session = await decrypt(sessionToken);

    // 4. If session is invalid or expired, redirect to auth
    if (!session || !session.userId) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // 5. If user is already authenticated and tries to access /auth, redirect to home
    if (pathname === '/auth' && session) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 6. Use updateSession to refresh the session expiration (sliding window)
    return await updateSession(req);
  }

  // If not a protected route, just continue
  return NextResponse.next();
}

// Optionally, use the matcher config to only run middleware on protected routes
export const config = {
    matcher: [
    
      "/profile/:path*",
      "/post/create-post",
      "/post/edit/:path*",
      "/post/:slug", // protect /post/[slug]
      "/auth",
    
    ],
  };