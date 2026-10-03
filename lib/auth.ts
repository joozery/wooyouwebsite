import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const EXPIRES_IN = "7d";

export async function signToken(payload: { id: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as { id: string; email: string };
}

export async function getAuthFromRequest(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
    ?? req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function unauthorized() {
  return Response.json({ message: "Unauthorized" }, { status: 401 });
}
