import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Portfolio from "@/lib/models/Portfolio";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";
import { defaultPortfolioProjects, portfolioCategories, validPortfolioImage, type PortfolioProject } from "@/lib/portfolio";

const key = "website-portfolio";

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin") === "1";
  if (admin && !(await getAuthFromRequest(req))) return unauthorized();
  try {
    await connectDB();
    const document = await Portfolio.findOne({ key });
    const projects: PortfolioProject[] = document ? document.projects.toObject() : defaultPortfolioProjects;
    return Response.json({ projects: admin ? projects : projects.filter((p) => p.isVisible), revision: document?.revision ?? 0 }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "เชื่อมต่อฐานข้อมูลไม่ได้ กรุณาลองใหม่" }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  let body;
  try { body = await req.json(); } catch { return Response.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 }); }
  if (!Array.isArray(body.projects) || body.projects.length > 200 || !Number.isInteger(body.revision) || body.revision < 0) {
    return Response.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  const ids = new Set<string>();
  const projects: PortfolioProject[] = [];
  for (const p of body.projects) {
    if (!p || typeof p.id !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(p.id) || ids.has(p.id)
      || typeof p.title !== "string" || !p.title.trim() || p.title.length > 200
      || !portfolioCategories.some((c) => c.id !== "all" && c.id === p.category)
      || typeof p.image !== "string" || !validPortfolioImage(p.image)
      || !Array.isArray(p.gallery) || p.gallery.length < 1 || p.gallery.length > 20 || !p.gallery.every((image: unknown) => typeof image === "string" && validPortfolioImage(image))
      || typeof p.isVisible !== "boolean"
      || ![p.subtitle, p.description, p.tags].every((value) => typeof value === "string" && value.length <= 10000)) {
      return Response.json({ message: "ตรวจสอบชื่อ หมวดหมู่ และรูปภาพของผลงาน" }, { status: 400 });
    }
    ids.add(p.id);
    projects.push({ id: p.id, title: p.title.trim(), category: p.category, subtitle: p.subtitle, description: p.description, image: p.image, gallery: p.gallery, tags: p.tags, isVisible: p.isVisible });
  }
  try {
    await connectDB();
    const document = await Portfolio.findOneAndUpdate({ key, revision: body.revision }, { $set: { projects }, $inc: { revision: 1 } }, { new: true, upsert: body.revision === 0, runValidators: true });
    if (!document) return Response.json({ message: "ข้อมูลถูกแก้ไขจากหน้าต่างอื่น กรุณาโหลดใหม่ก่อนบันทึก" }, { status: 409 });
    return Response.json({ projects: document.projects, revision: document.revision });
  } catch (error) {
    const conflict = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
    return Response.json({ message: conflict ? "ข้อมูลถูกแก้ไขจากหน้าต่างอื่น กรุณาโหลดใหม่ก่อนบันทึก" : "บันทึกไม่สำเร็จ กรุณาลองใหม่" }, { status: conflict ? 409 : 503 });
  }
}
