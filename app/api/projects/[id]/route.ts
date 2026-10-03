import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<unknown> }) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  await connectDB();
  const { id } = (await params) as { id: string };
  const body = await req.json();
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
  if (!project) return Response.json({ message: "Not found" }, { status: 404 });
  return Response.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<unknown> }) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  await connectDB();
  const { id } = (await params) as { id: string };
  await Project.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
