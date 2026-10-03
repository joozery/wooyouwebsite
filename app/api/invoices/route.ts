import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";

// GET /api/invoices — admin only
export async function GET(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();

  await connectDB();
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  return Response.json(invoices);
}

// POST /api/invoices — admin only
export async function POST(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();

  await connectDB();
  const body = await req.json();
  const invoice = await Invoice.create(body);
  return Response.json(invoice, { status: 201 });
}
