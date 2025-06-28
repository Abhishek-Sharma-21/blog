import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: any) {
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt();

  // Use exp from payload if present, otherwise default to 10 minutes
  if (payload.exp) {
    jwt.setExpirationTime(payload.exp);
  } else {
    jwt.setExpirationTime(Math.floor(Date.now() / 1000) + 10 * 60); // 10 minutes from now
  }

  return jwt.sign(encodedKey);
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}