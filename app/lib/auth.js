// lib/auth.js
import { SignJWT, jwtVerify } from "jose";

export async function signToken(payload) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // one hour

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export async function verifyAuth(token) {
  try {
    //console.log("Verifying token with secret:", process.env.JWT_SECRET ? "Secret exists" : "No secret");
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
   // console.log("Token verification successful:", verified.payload);
    return verified.payload;
  } catch (err) {
   // console.error("Token verification failed:", err.message);
    throw new Error("Your token has expired.");
  }
}
