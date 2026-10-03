import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<unknown> }) {
  await connectDB();
  const { slug } = (await params) as { slug: string };
  const blog = await Blog.findOne({ slug, published: true });
  if (!blog) return Response.json({ message: "Not found" }, { status: 404 });
  return Response.json(blog);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<unknown> }) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  await connectDB();
  const { slug } = (await params) as { slug: string };
  const body = await req.json();
  if (body.published && !body.publishedAt) body.publishedAt = new Date();
  const blog = await Blog.findOneAndUpdate({ slug }, body, { new: true });
  if (!blog) return Response.json({ message: "Not found" }, { status: 404 });
  return Response.json(blog);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<unknown> }) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  await connectDB();
  const { slug } = (await params) as { slug: string };
  await Blog.findOneAndDelete({ slug });
  return Response.json({ ok: true });
}
