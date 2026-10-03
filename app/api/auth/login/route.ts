import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ message: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  await connectDB();

  const admin = await Admin.findOne({ email, status: "active" }).select("+password");

  if (!admin || admin.password !== password) {
    return Response.json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  await admin.save();

  const token = await signToken({ id: String(admin._id), email: admin.email });

  const body = JSON.stringify({
    ok: true,
    admin: { name: admin.name, email: admin.email, role: admin.role },
  });

  const headers = new Headers({ "Content-Type": "application/json" });
  headers.set(
    "Set-Cookie",
    `admin_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );

  return new Response(body, { status: 200, headers });
}
