import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClientLogo from "@/lib/models/ClientLogo";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

// GET /api/client-logos — public
export async function GET() {
  await connectDB();
  const logos = await ClientLogo.find({ isVisible: true }).sort({ order: 1 });
  return Response.json(logos);
}

// POST /api/client-logos — admin only
export async function POST(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();

  await connectDB();
  const body = await req.json();
  const logo = await ClientLogo.create(body);
  return Response.json(logo, { status: 201 });
}

// DELETE /api/client-logos?id=xxx — admin only
export async function DELETE(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ message: "id required" }, { status: 400 });

  await connectDB();
  await ClientLogo.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
