"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink, Loader2, Images } from "lucide-react";
import { PortfolioImageUpload } from "@/components/admin/PortfolioImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { portfolioCategories, validPortfolioImage, type PortfolioProject } from "@/lib/portfolio";

const categories = portfolioCategories.filter((c) => c.id !== "all");
const empty = (): PortfolioProject => ({ id: "", title: "", subtitle: "", description: "", category: "website", image: "", gallery: [], tags: "", isVisible: true });

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty());
  const [gallery, setGallery] = useState("");
  const [formError, setFormError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/portfolio?admin=1", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "โหลดผลงานไม่สำเร็จ");
      setProjects(data.projects); setRevision(data.revision); setReady(true);
    } catch (error) { setError(error instanceof Error ? error.message : "โหลดผลงานไม่สำเร็จ"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function persist(next: PortfolioProject[]) {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/portfolio", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projects: next, revision }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "บันทึกไม่สำเร็จ");
      setProjects(data.projects); setRevision(data.revision); setNotice("บันทึกแล้ว ข้อมูลอัปเดตบนหน้า Portfolio");
      return true;
    } catch (error) { setError(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ"); return false; }
    finally { setSaving(false); }
  }
  function edit(project?: PortfolioProject) {
    setEditing(project?.id ?? null); setForm(project ? { ...project } : empty());
    setGallery(project?.gallery.join("\n") ?? ""); setFormError(""); setOpen(true);
  }
  async function save() {
    const images = gallery.split("\n").map((value) => value.trim()).filter(Boolean);
    const cover = form.image.trim();
    if (!form.title.trim() || !validPortfolioImage(cover) || images.some((image) => !validPortfolioImage(image)) || images.length > 20) {
      setFormError("กรอกชื่อและภาพปกให้ถูกต้อง ภาพสไลด์ใส่ได้สูงสุด 20 ภาพ"); return;
    }
    const project = { ...form, id: editing ?? crypto.randomUUID(), title: form.title.trim(), image: cover, gallery: images.length ? images : [cover] };
    const next = editing ? projects.map((p) => p.id === editing ? project : p) : [...projects, project];
    if (await persist(next)) setOpen(false);
  }
  async function remove(project: PortfolioProject) {
    if (confirm(`ลบผลงาน “${project.title}” ออกจากเว็บไซต์?`)) await persist(projects.filter((p) => p.id !== project.id));
  }
  async function move(id: string, direction: number) {
    const index = projects.findIndex((p) => p.id === id);
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects]; [next[index], next[target]] = [next[target], next[index]];
    await persist(next);
  }
  const filtered = projects.filter((p) => (category === "all" || category === p.category) && `${p.title} ${p.subtitle} ${p.tags}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="min-w-0 w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="mb-2 text-xs font-semibold tracking-widest text-indigo-500">WEBSITE PORTFOLIO</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">ผลงานบนเว็บไซต์</h1><p className="mt-2 text-sm text-slate-500">จัดการภาพ รายละเอียด และลำดับผลงานที่แสดงบนหน้า Portfolio</p></div>
        <div className="flex flex-wrap gap-2"><Button asChild variant="outline" className="h-11 rounded-xl"><Link href="/portfolio" target="_blank">ดูหน้าเว็บ<ExternalLink className="size-4" /></Link></Button><Button disabled={!ready || saving} onClick={() => edit()} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700"><Plus className="size-4" />เพิ่มผลงาน</Button></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">{[{ label: "ผลงานทั้งหมด", count: projects.length }, { label: "แสดงบนเว็บไซต์", count: projects.filter((p) => p.isVisible).length }, { label: "ซ่อนไว้", count: projects.filter((p) => !p.isVisible).length }].map((item, index) => <div key={item.label} className={`rounded-2xl border p-5 ${index === 0 ? "border-indigo-100 bg-indigo-50/70" : "border-slate-200 bg-white"}`}><p className="text-sm text-slate-500">{item.label}</p><p className="mt-3 text-3xl font-semibold">{loading ? "—" : item.count}<span className="ml-2 text-xs font-normal text-slate-400">ผลงาน</span></p></div>)}</div>
      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}<Button variant="outline" disabled={saving} onClick={() => void load()}>โหลดใหม่</Button></div>}
      {notice && <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="space-y-4 border-b border-slate-100 p-4 sm:p-6"><div><h2 className="font-semibold">รายการผลงาน</h2><p className="mt-1 text-xs leading-6 text-slate-400">เรียงตามลำดับที่แสดงจริง · ผลงานที่เปิดแสดง 5 รายการแรกอยู่ในส่วนภาพสไลด์</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-3.5 size-4 text-slate-400" /><Input aria-label="ค้นหาผลงาน" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="ค้นหาชื่อผลงานหรือแท็ก" className="h-11 rounded-xl pl-9" /></div><select aria-label="กรองหมวดหมู่" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="all">ทุกหมวดหมู่</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div></div>
        {loading ? <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-indigo-500" /></div> : visible.length === 0 ? <div className="py-16 text-center text-sm text-slate-400"><Images className="mx-auto mb-3 size-8" />{ready ? "ไม่พบผลงาน" : "ยังโหลดข้อมูลไม่ได้"}</div> : <div className="divide-y divide-slate-100">{visible.map((project) => {
          const index = projects.findIndex((p) => p.id === project.id);
          return <article key={project.id} className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4"><span className="text-xs text-slate-400 tabular-nums">{String(index + 1).padStart(2, "0")}</span><div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50"><Image src={project.image} alt={project.title} fill sizes="112px" className="object-cover" /></div><div className="min-w-0"><p className="break-words font-semibold text-slate-800">{project.title}</p><p className="mt-1 break-words text-xs text-slate-500">{project.subtitle}</p><div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-600">{categories.find((c) => c.id === project.category)?.label}</span><span className="py-1 text-slate-400">{project.gallery.length} ภาพ</span></div></div></div>
            <div className="flex flex-wrap items-center gap-1"><Button variant="ghost" disabled={saving} className={`min-h-11 ${project.isVisible ? "text-emerald-600" : "text-slate-400"}`} onClick={() => void persist(projects.map((p) => p.id === project.id ? { ...p, isVisible: !p.isVisible } : p))}>{project.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{project.isVisible ? "แสดง" : "ซ่อน"}</Button><Button variant="ghost" size="icon" className="size-11" aria-label={`เลื่อน ${project.title} ขึ้น`} disabled={saving || index === 0} onClick={() => void move(project.id, -1)}><ArrowUp className="size-4" /></Button><Button variant="ghost" size="icon" className="size-11" aria-label={`เลื่อน ${project.title} ลง`} disabled={saving || index === projects.length - 1} onClick={() => void move(project.id, 1)}><ArrowDown className="size-4" /></Button><Button variant="ghost" size="icon" className="size-11" aria-label={`แก้ไข ${project.title}`} disabled={saving} onClick={() => edit(project)}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" className="size-11 text-rose-500" aria-label={`ลบ ${project.title}`} disabled={saving} onClick={() => void remove(project)}><Trash2 className="size-4" /></Button></div>
          </article>;
        })}</div>}
        {filtered.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4 text-xs text-slate-500"><span>หน้า {currentPage} / {pages} · {filtered.length} ผลงาน</span><div className="flex gap-2"><Button variant="outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>ก่อนหน้า</Button><Button variant="outline" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>ถัดไป</Button></div></div>}
      </section>
      <Dialog open={open} onOpenChange={(value) => { if (!saving && !uploading) setOpen(value); }}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>{editing ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}</DialogTitle><DialogDescription>บันทึกแล้วข้อมูลจะปรากฏบนหน้า Portfolio ตามลำดับที่จัดไว้</DialogDescription></DialogHeader>
        <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="portfolio-title">ชื่อผลงาน *</Label><Input id="portfolio-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="portfolio-category">หมวดหมู่</Label><select id="portfolio-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9 w-full rounded-md border bg-white px-3 text-sm">{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div></div>
        <div className="space-y-2"><Label htmlFor="portfolio-subtitle">คำอธิบายสั้น</Label><Input id="portfolio-subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="เช่น Corporate Website & Digital Experience" /></div>
        <div className="space-y-2"><Label htmlFor="portfolio-description">รายละเอียดผลงาน</Label><Textarea id="portfolio-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-2"><Label>ภาพปก *</Label><PortfolioImageUpload disabled={saving || uploading} onBusy={setUploading} onUploaded={(image) => setForm((previous) => ({ ...previous, image }))} />{form.image && validPortfolioImage(form.image) && <div className="relative h-40 overflow-hidden rounded-xl border bg-slate-50"><Image src={form.image} alt="ตัวอย่างภาพปก" fill sizes="600px" className="object-contain" /></div>}</div>
        <div className="space-y-3"><Label>ภาพสไลด์</Label><PortfolioImageUpload multiple remaining={20 - gallery.split("\n").filter(Boolean).length} disabled={saving || uploading} onBusy={setUploading} onUploaded={(image) => setGallery((previous) => previous ? `${previous}\n${image}` : image)} /><p className="text-xs text-slate-400">สูงสุด 20 ภาพ · เรียงจากซ้ายไปขวา · ถ้าไม่มีภาพสไลด์จะใช้ภาพปก</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{gallery.split("\n").filter(Boolean).map((image, index, images) => <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-slate-200"><div className="relative aspect-video bg-slate-50"><Image src={image} alt={`ภาพสไลด์ ${index + 1}`} fill sizes="200px" className="object-cover" /></div><div className="flex items-center justify-between gap-1 p-1"><span className="pl-2 text-xs text-slate-400">{index + 1}</span><div className="flex"><Button variant="ghost" size="icon" className="size-9" aria-label={`เลื่อนภาพ ${index + 1} ไปก่อนหน้า`} disabled={index === 0 || uploading || saving} onClick={() => { const next = [...images]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setGallery(next.join("\n")); }}><ArrowUp className="size-3" /></Button><Button variant="ghost" size="icon" className="size-9" aria-label={`เลื่อนภาพ ${index + 1} ไปถัดไป`} disabled={index === images.length - 1 || uploading || saving} onClick={() => { const next = [...images]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; setGallery(next.join("\n")); }}><ArrowDown className="size-3" /></Button><Button variant="ghost" size="icon" className="size-9 text-rose-500" aria-label={`นำภาพ ${index + 1} ออกจากสไลด์`} disabled={uploading || saving} onClick={() => setGallery(images.filter((_, i) => i !== index).join("\n"))}><Trash2 className="size-3" /></Button></div></div></div>)}</div>
        </div>
        <div className="space-y-2"><Label htmlFor="portfolio-tags">แท็ก</Label><Input id="portfolio-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Website · Booking · Travel" /></div>
        <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} className="size-4 accent-indigo-600" />แสดงผลงานบนเว็บไซต์</label>
        {(formError || error) && <p role="alert" className="text-sm text-rose-600">{formError || error}</p>}</div>
        <DialogFooter><Button variant="outline" disabled={saving || uploading} onClick={() => setOpen(false)}>ยกเลิก</Button><Button disabled={saving || uploading} onClick={() => void save()} className="bg-indigo-600 hover:bg-indigo-700">{saving && <Loader2 className="size-4 animate-spin" />}บันทึกผลงาน</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
