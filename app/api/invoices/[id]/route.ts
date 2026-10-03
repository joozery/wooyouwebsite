import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<unknown> }) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  await connectDB();
  const { id } = (await params) as { id: string };
  const body = await req.json();
  const invoice = await Invoice.findByIdAndUpdate(id, body, { new: true });
  if (!invoice) return Response.json({ message: "Not found" }, { status: 404 });
  return Response.json(invoice);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<unknown> }) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  await connectDB();
  const { id } = (await params) as { id: string };
  await Invoice.findByIdAndDelete(id);
  return Response.json({ ok: true });
}
