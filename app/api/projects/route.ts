import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

// GET /api/projects — public
export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  return Response.json(projects);
}

// POST /api/projects — admin only
export async function POST(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();

  await connectDB();
  const body = await req.json();
  const project = await Project.create(body);
  return Response.json(project, { status: 201 });
}
