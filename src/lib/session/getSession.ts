import { decrypt } from "@/lib/session/session";
import { cookies } from "next/headers";


export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    
    if (!session) return null;
    return await decrypt(session);
}