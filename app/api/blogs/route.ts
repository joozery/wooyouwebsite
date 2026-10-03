import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

// GET /api/blogs — public (published only)
export async function GET() {
  await connectDB();
  const blogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1 })
    .select("-content");
  return Response.json(blogs);
}

// POST /api/blogs — admin only
export async function POST(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();

  await connectDB();
  const body = await req.json();
  if (body.published && !body.publishedAt) {
    body.publishedAt = new Date();
  }
  const blog = await Blog.create(body);
  return Response.json(blog, { status: 201 });
}
