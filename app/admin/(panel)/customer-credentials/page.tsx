"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, KeyRound, Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Credential {
  id: string;
  customerName: string;
  serviceName: string;
  serviceType: "hosting" | "domain" | "email" | "social" | "other";
  url?: string;
  username: string;
  password: string;
  notes?: string;
}

const serviceTypeLabels: Record<string, string> = {
  hosting: "Hosting", domain: "Domain", email: "Email",
  social: "Social Media", other: "อื่นๆ",
};

const emptyForm = () => ({
  customerName: "", serviceName: "", serviceType: "hosting" as Credential["serviceType"],
  url: "", username: "", password: "", notes: "",
});

export default function CustomerCredentialsPage() {
  const [list, setList] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  async function load() {
    try {
      const r = await fetch(`${API}/credentials`);
      setList(await r.json());
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((c) =>
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.serviceName?.toLowerCase().includes(search.toLowerCase())
  );

  function toggleReveal(id: string) {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(c: Credential) {
    setEditing(c);
    setForm({ customerName: c.customerName, serviceName: c.serviceName, serviceType: c.serviceType, url: c.url ?? "", username: c.username, password: c.password, notes: c.notes ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/credentials/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/credentials`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบข้อมูล Credential นี้?")) return;
    await fetch(`${API}/credentials/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Credential ลูกค้า</h1>
          <p className="text-muted-foreground text-sm mt-1">เก็บข้อมูล Username/Password บริการต่างๆ ของลูกค้า</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />เพิ่ม Credential</Button>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        ข้อมูลในส่วนนี้เป็นความลับ กรุณาไม่แชร์กับบุคคลภายนอก
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="ค้นหาลูกค้า, บริการ..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <KeyRound className="size-10 mb-3 opacity-30" /><p>ยังไม่มีข้อมูล Credential</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table className="admin-mobile-list" role="table">
            <TableHeader>
              <TableRow>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>บริการ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell data-label="ลูกค้า" className="font-medium">{c.customerName}</TableCell>
                  <TableCell data-label="บริการ">
                    <div>
                      <p className="text-sm">{c.serviceName}</p>
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[140px] block">{c.url}</a>}
                    </div>
                  </TableCell>
                  <TableCell data-label="ประเภท">
                    <Badge variant="outline">{serviceTypeLabels[c.serviceType] ?? c.serviceType}</Badge>
                  </TableCell>
                  <TableCell data-label="Username">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono">{c.username}</span>
                      <Button size="icon" variant="ghost" className="size-6" aria-label="คัดลอกชื่อผู้ใช้" onClick={() => copyToClipboard(c.username)}>
                        <Copy className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell data-label="Password">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono">{revealedIds.has(c.id) ? c.password : "••••••••"}</span>
                      <Button size="icon" variant="ghost" className="size-6" aria-label="แสดงหรือซ่อนรหัสผ่าน" onClick={() => toggleReveal(c.id)}>
                        {revealedIds.has(c.id) ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="size-6" aria-label="คัดลอกรหัสผ่าน" onClick={() => copyToClipboard(c.password)}>
                        <Copy className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell data-label="จัดการ">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" aria-label="แก้ไขรายการ" onClick={() => openEdit(c)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" aria-label="ลบรายการ" onClick={() => del(c.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "แก้ไข Credential" : "เพิ่ม Credential ใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="col-span-full space-y-1.5">
                <Label>ลูกค้า *</Label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>ชื่อบริการ *</Label>
                <Input placeholder="เช่น Hostinger, Facebook" value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>ประเภท</Label>
                <Select value={form.serviceType} onValueChange={(v) => setForm({ ...form, serviceType: v as Credential["serviceType"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(serviceTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>URL / ลิงก์เข้าใช้งาน</Label>
              <Input placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Username / Email *</Label>
                <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Password *</Label>
                <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>หมายเหตุ</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.customerName || !form.serviceName || !form.username || !form.password}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
