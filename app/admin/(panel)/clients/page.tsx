"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const API = process.env.NEXT_PUBLIC_API_URL;

interface ClientLogo {
  id: string;
  _id?: string;
  name: string;
  imageUrl: string;
  order: number;
  isVisible: boolean;
}

const emptyForm = () => ({ name: "", imageUrl: "", order: 0, isVisible: true });

export default function ClientsPage() {
  const [list, setList] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ClientLogo | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/client-logos`);
      const data = await r.json();
      const logos = Array.isArray(data) ? data : [];
      setList(logos.map((l: ClientLogo) => ({ ...l, id: l.id ?? l._id ?? "" })).sort((a: ClientLogo, b: ClientLogo) => a.order - b.order));
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm({ ...emptyForm(), order: list.length + 1 }); setOpen(true); }
  function openEdit(c: ClientLogo) {
    setEditing(c);
    setForm({ name: c.name, imageUrl: c.imageUrl, order: c.order, isVisible: c.isVisible });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/client-logos/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/client-logos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบโลโก้นี้?")) return;
    await fetch(`${API}/client-logos/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggleVisible(c: ClientLogo) {
    await fetch(`${API}/client-logos/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, isVisible: !c.isVisible }),
    });
    await load();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Logos</h1>
          <p className="text-muted-foreground text-sm mt-1">จัดการโลโก้ลูกค้าที่แสดงบนเว็บไซต์</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />เพิ่มโลโก้</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : list.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ImageIcon className="size-10 mb-3 opacity-30" /><p>ยังไม่มีโลโก้ลูกค้า</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => (
            <Card key={c.id} className={`overflow-hidden transition-opacity ${!c.isVisible ? "opacity-50" : ""}`}>
              <CardContent className="p-3">
                <div className="relative h-24 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden mb-3 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="max-h-16 max-w-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="size-8 text-gray-300" />
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-muted-foreground">ลำดับ {c.order}</span>
                      <Badge variant="outline" className={c.isVisible ? "bg-green-50 text-green-700 border-green-200 text-xs py-0" : "text-xs py-0"}>
                        {c.isVisible ? "แสดง" : "ซ่อน"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <Button size="icon" variant="ghost" className="size-7" title={c.isVisible ? "ซ่อน" : "แสดง"} onClick={() => toggleVisible(c)}>
                      {c.isVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="size-7" onClick={() => openEdit(c)}><Pencil className="size-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" onClick={() => del(c.id)}><Trash2 className="size-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "แก้ไขโลโก้" : "เพิ่มโลโก้ใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>ชื่อบริษัท/แบรนด์ *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>URL รูปโลโก้ *</Label>
              <Input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            {form.imageUrl && (
              <div className="h-20 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrl} alt="preview" className="max-h-full max-w-full object-contain p-2" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>ลำดับแสดงผล</Label>
              <Input type="number" min={1} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isVisible} onCheckedChange={(v) => setForm({ ...form, isVisible: v })} />
              <Label>แสดงบนเว็บไซต์</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.name || !form.imageUrl}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
