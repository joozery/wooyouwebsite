"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save, Loader2, ArrowUp, ArrowDown, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioImageUpload } from "@/components/admin/PortfolioImageUpload";
import { storyLocales, validStory, type StoryContent, type StoryLocale, type StoryText } from "@/lib/story";

const languageNames = { th: "ไทย", en: "English", ja: "日本語", ko: "한국어", zh: "中文" };
const fields: { key: keyof StoryText; label: string }[] = [
  { key: "titleLine1", label: "หัวข้อบรรทัดแรก" }, { key: "titleLine2", label: "หัวข้อบรรทัดที่สอง" },
  { key: "subtitle", label: "คำอธิบายใต้หัวข้อ" }, { key: "heading", label: "หัวข้อเนื้อหา" },
  { key: "body", label: "เนื้อหาเรื่องราว" }, { key: "cta", label: "ข้อความปุ่ม" },
];

export default function StoryAdminPage() {
  const [content, setContent] = useState<StoryContent | null>(null);
  const [revision, setRevision] = useState(0);
  const [saved, setSaved] = useState("");
  const [locale, setLocale] = useState<StoryLocale>("th");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dirty = content !== null && JSON.stringify(content) !== saved;

  async function load() {
    setLoading(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/story", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "โหลดข้อมูลไม่สำเร็จ");
      setContent(data.content); setRevision(data.revision); setSaved(JSON.stringify(data.content));
    } catch (error) { setError(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  function change(key: keyof StoryText, value: string) {
    setContent((previous) => previous ? { ...previous, texts: { ...previous.texts, [locale]: { ...previous.texts[locale], [key]: value } } } : previous);
    setNotice("");
  }
  async function save() {
    if (!validStory(content)) { setError("กรอกข้อความให้ครบทุกภาษา และใช้ลิงก์ภายในเว็บไซต์ เช่น /about"); return; }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/story", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, revision }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "บันทึกไม่สำเร็จ");
      setContent(data.content); setRevision(data.revision); setSaved(JSON.stringify(data.content)); setNotice("บันทึกเรียบร้อยแล้ว ข้อมูลอัปเดตบนหน้าแรก");
    } catch (error) { setError(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ"); }
    finally { setSaving(false); }
  }
  function move(index: number, direction: number) {
    setContent((previous) => {
      if (!previous) return previous;
      const images = [...previous.images];
      [images[index], images[index + direction]] = [images[index + direction], images[index]];
      return { ...previous, images };
    });
  }

  return <div className="min-w-0 w-full space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="mb-2 text-xs font-semibold tracking-widest text-indigo-500">HOME · OUR STORY</p><h1 className="text-2xl font-bold sm:text-3xl">เรื่องราวของเรา</h1><p className="mt-2 text-sm text-slate-500">จัดการ section Who We Are / Our Story บนหน้าแรก</p></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline" className="h-11 rounded-xl"><Link href="/#our-story" target="_blank">ดูหน้าเว็บ<ExternalLink className="size-4" /></Link></Button><Button onClick={() => void save()} disabled={!content || loading || saving || uploading || !dirty} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700">{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}บันทึกการเปลี่ยนแปลง</Button></div></div>
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}<Button variant="outline" disabled={uploading || saving} onClick={() => { if (!dirty || confirm("โหลดข้อมูลใหม่และทิ้งการแก้ไขที่ยังไม่บันทึก?")) void load(); }}>โหลดใหม่</Button></div>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
    {loading ? <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-indigo-500" /></div> : content && <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="size-4 accent-indigo-600" checked={content.isVisible} disabled={saving} onChange={(e) => setContent({ ...content, isVisible: e.target.checked })} />แสดง section บนหน้าแรก</label><span className="text-xs text-slate-400">{dirty ? "มีการแก้ไขที่ยังไม่บันทึก" : "ข้อมูลปัจจุบัน"}</span></div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"><h2 className="font-semibold">ข้อความและปุ่ม</h2><p className="mt-1 text-xs leading-6 text-slate-400">เลือกภาษาเพื่อแก้ไขข้อความ · รูปภาพและลิงก์ปุ่มใช้ร่วมกันทุกภาษา</p><div className="mt-4 flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="ภาษาเนื้อหา">{storyLocales.map((language) => <button type="button" key={language} aria-pressed={locale === language} onClick={() => setLocale(language)} className={`min-h-10 rounded-lg px-3 text-sm ${locale === language ? "bg-white font-medium text-indigo-600 shadow-sm" : "text-slate-500"}`}>{languageNames[language]}</button>)}</div>
          <fieldset disabled={saving} className="mt-5 space-y-4">{fields.map(({ key, label }) => <div key={key} className="space-y-2"><Label htmlFor={`story-${key}`}>{label} *</Label>{key === "body" ? <Textarea id={`story-${key}`} rows={7} value={content.texts[locale][key]} onChange={(e) => change(key, e.target.value)} /> : <Input id={`story-${key}`} maxLength={300} value={content.texts[locale][key]} onChange={(e) => change(key, e.target.value)} />}</div>)}<div className="space-y-2"><Label htmlFor="story-href">ลิงก์ปุ่ม</Label><Input id="story-href" value={content.buttonHref} onChange={(e) => setContent({ ...content, buttonHref: e.target.value })} placeholder="/about" /><p className="text-xs text-slate-400">ใช้ลิงก์ภายในเว็บ เช่น /about หรือ /contact</p></div></fieldset>
        </section>
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"><h2 className="font-semibold">ภาพเรื่องราวของเรา</h2><p className="mb-5 mt-1 text-xs leading-6 text-slate-400">อัปโหลดผ่าน R2 · สูงสุด 20 ภาพ · แสดงเป็นแถบภาพเคลื่อนตาม scroll</p><PortfolioImageUpload label="เลือกภาพเรื่องราวจากเครื่อง" multiple remaining={20 - content.images.length} disabled={saving || uploading} onBusy={setUploading} onUploaded={(src) => setContent((previous) => previous ? { ...previous, images: [...previous.images, { id: crypto.randomUUID(), src, width: 360, alt: "" }] } : previous)} />
          <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">{content.images.map((image, index) => <div key={image.id} className="min-w-0 overflow-hidden rounded-xl border border-slate-200"><div className="relative aspect-video bg-slate-50"><Image src={image.src} alt={image.alt || `ภาพ ${index + 1}`} fill sizes="320px" className="object-cover" /></div><div className="space-y-3 p-3"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">ภาพ {index + 1}</span><div className="flex"><Button variant="ghost" size="icon" className="size-10" aria-label={`เลื่อนภาพ ${index + 1} ไปก่อนหน้า`} disabled={saving || uploading || index === 0} onClick={() => move(index, -1)}><ArrowUp className="size-4" /></Button><Button variant="ghost" size="icon" className="size-10" aria-label={`เลื่อนภาพ ${index + 1} ไปถัดไป`} disabled={saving || uploading || index === content.images.length - 1} onClick={() => move(index, 1)}><ArrowDown className="size-4" /></Button><Button variant="ghost" size="icon" className="size-10 text-rose-500" aria-label={`นำภาพ ${index + 1} ออก`} disabled={saving || uploading} onClick={() => setContent({ ...content, images: content.images.filter((p) => p.id !== image.id) })}><Trash2 className="size-4" /></Button></div></div><div className="space-y-1"><Label htmlFor={`width-${image.id}`} className="text-xs">ความกว้าง {image.width} px</Label><input id={`width-${image.id}`} type="range" min="180" max="600" step="20" className="w-full accent-indigo-600" value={image.width} disabled={saving} onChange={(e) => setContent({ ...content, images: content.images.map((p) => p.id === image.id ? { ...p, width: Number(e.target.value) } : p) })} /></div><Input aria-label={`คำอธิบายภาพ ${index + 1}`} maxLength={300} placeholder="คำอธิบายภาพสำหรับผู้ใช้ screen reader" value={image.alt} disabled={saving} onChange={(e) => setContent({ ...content, images: content.images.map((p) => p.id === image.id ? { ...p, alt: e.target.value } : p) })} /></div></div>)}</div>
          {content.images.length === 0 && <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีภาพ · แถบภาพจะถูกซ่อนเมื่อบันทึก</p>}
        </section>
      </div>
    </>}
  </div>;
}
