import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./session";

export async function updateSession(req: NextRequest) {
    const session = req.cookies.get('session')?.value;
    if (!session) return;

    // Set new expiration: 10 minutes from now
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const exp = Math.floor(newExpiry.getTime() / 1000); // JWT exp is in seconds

    // Decrypt and update session payload
    const parsed = await decrypt(session);
    if (!parsed) return;

    // Update the payload with new exp
    parsed.exp = exp;

    const res = NextResponse.next();
    res.cookies.set(
        "session",
        await encrypt(parsed), // encrypt with new exp
        {
            httpOnly: true,
            expires: newExpiry,
        }
    );
    return res;
}