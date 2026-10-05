import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAuthFromRequest, unauthorized } from "@/lib/auth";
import { imageExtensions, validateUpload } from "@/lib/portfolioUpload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await getAuthFromRequest(req))) return unauthorized();
  let body;
  try { body = await req.json(); } catch { return Response.json({ message: "ข้อมูลไฟล์ไม่ถูกต้อง" }, { status: 400 }); }
  const message = validateUpload(body?.type, body?.size);
  if (message) return Response.json({ message }, { status: 400 });
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return Response.json({ message: "ยังไม่ได้ตั้งค่าพื้นที่เก็บรูปภาพ R2 กรุณาตั้งค่าก่อนอัปโหลด" }, { status: 503 });
  }
  try {
    const publicUrl = new URL(publicBase);
    if (publicUrl.protocol !== "https:" || publicUrl.search || publicUrl.hash) throw new Error("Invalid public URL");
    const key = `portfolio/${crypto.randomUUID()}.${imageExtensions[body.type]}`;
    const client = new S3Client({ region: "auto", endpoint: `https://${accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId, secretAccessKey }, requestChecksumCalculation: "WHEN_REQUIRED" });
    const uploadUrl = await getSignedUrl(client, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: body.type, ContentLength: body.size }), { expiresIn: 300, signableHeaders: new Set(["content-type"]) });
    return Response.json({ uploadUrl, imageUrl: `${publicBase}/${key}` }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "เตรียมอัปโหลดไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า R2" }, { status: 500 });
  }
}
