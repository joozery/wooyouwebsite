"use client";

import { useId, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { validateUpload } from "@/lib/portfolioUpload";

export function PortfolioImageUpload({ multiple = false, disabled, remaining = 1, label, onUploaded, onBusy }: {
  label?: string;
  multiple?: boolean;
  disabled?: boolean;
  remaining?: number;
  onUploaded: (url: string) => void;
  onBusy: (busy: boolean) => void;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function upload(files: File[]) {
    if (!files.length) return;
    setError("");
    if (files.length > remaining) { setError(`เพิ่มได้อีก ${remaining} ภาพ`); return; }
    for (const file of files) {
      const message = validateUpload(file.type, file.size);
      if (message) { setError(`${file.name}: ${message}`); return; }
    }
    setBusy(true); onBusy(true);
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`กำลังอัปโหลด ${index + 1}/${files.length} · ${file.name}`);
        const response = await fetch("/api/uploads/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: file.type, size: file.size }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "อัปโหลดไม่สำเร็จ");
        const uploadResponse = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        if (!uploadResponse.ok) throw new Error(`อัปโหลด ${file.name} ไม่สำเร็จ กรุณาลองอีกครั้ง`);
        onUploaded(data.imageUrl);
      }
    } catch (error) { setError(error instanceof TypeError ? "เชื่อมต่อพื้นที่เก็บรูปไม่ได้ กรุณาตรวจสอบ CORS ของ R2" : error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ"); }
    finally { setBusy(false); onBusy(false); setProgress(""); }
  }

  return <div className="space-y-2">
    <label htmlFor={id} className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 text-center ${disabled || busy || remaining === 0 ? "opacity-50" : "cursor-pointer hover:bg-indigo-50"}`}>
      {busy ? <Loader2 className="size-6 animate-spin text-indigo-500" /> : <UploadCloud className="size-6 text-indigo-500" />}
      <span className="text-sm font-medium text-indigo-700">{busy ? progress : label ?? (multiple ? "เลือกภาพสไลด์จากเครื่อง" : "เลือกภาพปกจากเครื่อง")}</span>
      <span className="text-xs text-slate-400">JPG, PNG, WebP, AVIF · ไม่เกิน 10 MB ต่อภาพ{multiple && " · เลือกได้หลายไฟล์"}</span>
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} disabled={disabled || busy || remaining === 0} className="sr-only" onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void upload(files); }} />
    </label>
    {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
  </div>;
}
