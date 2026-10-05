import { NextRequest } from "next/server";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Story from "@/lib/models/Story";
import { validStory } from "@/lib/story";
import { getStory } from "@/lib/storyServer";

export async function GET(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  try { return Response.json(await getStory(true), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ message: "โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่" }, { status: 503 }); }
}
export async function PUT(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  let body;
  try { body = await req.json(); } catch { return Response.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 }); }
  if (!validStory(body?.content) || !Number.isInteger(body?.revision) || body.revision < 0) return Response.json({ message: "กรอกข้อความให้ครบทั้ง 5 ภาษา และตรวจสอบรูปภาพกับลิงก์ปุ่ม" }, { status: 400 });
  try {
    await connectDB();
    const doc = await Story.findOneAndUpdate({ key: "home-story", revision: body.revision }, { $set: { content: body.content }, $inc: { revision: 1 } }, { new: true, upsert: body.revision === 0, runValidators: true });
    if (!doc) return Response.json({ message: "ข้อมูลเปลี่ยนจากหน้าต่างอื่น กรุณาโหลดใหม่ก่อนบันทึก" }, { status: 409 });
    return Response.json({ content: doc.content, revision: doc.revision });
  } catch (error) {
    const conflict = error && typeof error === "object" && "code" in error && error.code === 11000;
    return Response.json({ message: conflict ? "ข้อมูลเปลี่ยนจากหน้าต่างอื่น กรุณาโหลดใหม่ก่อนบันทึก" : "บันทึกไม่สำเร็จ กรุณาลองใหม่" }, { status: conflict ? 409 : 503 });
  }
}
