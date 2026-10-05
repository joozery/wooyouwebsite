"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  author: string;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
}

const emptyForm = () => ({
  title: "", slug: "", excerpt: "", content: "", coverImage: "",
  tags: "", author: "", published: false,
});

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9฀-๿]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function BlogsPage() {
  const [list, setList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/blogs?all=1`);
      const data = await r.json();
      setList(Array.isArray(data) ? data : []);
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(b: Blog) {
    setEditing(b);
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: "", coverImage: b.coverImage ?? "", tags: b.tags?.join(", ") ?? "", author: b.author, published: b.published });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const body = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editing) {
      await fetch(`${API}/blogs/${editing.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch(`${API}/blogs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบบทความนี้?")) return;
    await fetch(`${API}/blogs/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">บทความ (Blogs)</h1>
          <p className="text-muted-foreground text-sm mt-1">จัดการบทความและเนื้อหาบนเว็บไซต์</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />เขียนบทความ</Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="ค้นหาหัวข้อ, ผู้เขียน..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <BookOpen className="size-10 mb-3 opacity-30" /><p>ยังไม่มีบทความ</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table className="admin-mobile-list" role="table">
            <TableHeader>
              <TableRow>
                <TableHead>หัวข้อ</TableHead>
                <TableHead>ผู้เขียน</TableHead>
                <TableHead>แท็ก</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell data-label="หัวข้อ">
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell data-label="ผู้เขียน" className="text-muted-foreground text-sm">{b.author}</TableCell>
                  <TableCell data-label="แท็ก">
                    <div className="flex flex-wrap gap-1">
                      {b.tags?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                      {b.tags?.length > 2 && <span className="text-xs text-muted-foreground">+{b.tags.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell data-label="สถานะ">
                    <Badge variant="outline" className={b.published ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600"}>
                      {b.published ? "เผยแพร่" : "ร่าง"}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="วันที่" className="text-muted-foreground text-sm">{(b.publishedAt ?? b.createdAt)?.slice(0, 10)}</TableCell>
                  <TableCell data-label="จัดการ">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" aria-label="แก้ไขรายการ" onClick={() => openEdit(b)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" aria-label="ลบรายการ" onClick={() => del(b.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "แก้ไขบทความ" : "เขียนบทความใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label>หัวข้อบทความ *</Label>
              <Input value={form.title} onChange={(e) => {
                const title = e.target.value;
                setForm({ ...form, title, slug: editing ? form.slug : toSlug(title) });
              }} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>คำอธิบายย่อ (Excerpt)</Label>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>เนื้อหา (Markdown)</Label>
              <Textarea rows={8} className="font-mono text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="# หัวข้อ&#10;&#10;เนื้อหาบทความ..." />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>รูปปก (URL)</Label>
                <Input placeholder="https://..." value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>ผู้เขียน</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>แท็ก (คั่นด้วยคอมมา)</Label>
              <Input placeholder="Next.js, Web Design, ERP" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label>เผยแพร่บทความ</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.title || !form.slug}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
