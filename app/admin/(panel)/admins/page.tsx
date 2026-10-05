"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role: "superadmin" | "admin" | "editor";
  status: "active" | "inactive";
  lastLogin?: string;
}

const roleMap = {
  superadmin: { label: "Super Admin", className: "bg-purple-50 text-purple-700 border-purple-200" },
  admin:      { label: "Admin",       className: "bg-blue-50 text-blue-700 border-blue-200" },
  editor:     { label: "Editor",      className: "bg-gray-100 text-gray-600 border-gray-200" },
};

const emptyForm = () => ({
  name: "", email: "", phone: "", position: "",
  role: "admin" as Admin["role"], status: "active" as Admin["status"], password: "",
});

export default function AdminsPage() {
  const [list, setList] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/admins`);
      setList(await r.json());
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(a: Admin) {
    setEditing(a);
    setForm({ name: a.name, email: a.email, phone: a.phone ?? "", position: a.position ?? "", role: a.role, status: a.status, password: "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const body = { ...form };
    if (!body.password) delete (body as { password?: string }).password;
    if (editing) {
      await fetch(`${API}/admins/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch(`${API}/admins`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบผู้ดูแลระบบคนนี้?")) return;
    await fetch(`${API}/admins/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ผู้ดูแลระบบ</h1>
          <p className="text-muted-foreground text-sm mt-1">จัดการบัญชีผู้ดูแลระบบ</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />เพิ่มผู้ดูแล</Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="ค้นหาชื่อ, อีเมล..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ShieldCheck className="size-10 mb-3 opacity-30" /><p>ยังไม่มีผู้ดูแลระบบ</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table className="admin-mobile-list" role="table">
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>สิทธิ์</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>เข้าใช้ล่าสุด</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell data-label="ชื่อ" className="font-medium">{a.name}</TableCell>
                  <TableCell data-label="อีเมล" className="text-muted-foreground text-sm">{a.email}</TableCell>
                  <TableCell data-label="ตำแหน่ง" className="text-muted-foreground text-sm">{a.position || "—"}</TableCell>
                  <TableCell data-label="สิทธิ์">
                    <Badge variant="outline" className={roleMap[a.role]?.className ?? ""}>
                      {roleMap[a.role]?.label ?? a.role}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="สถานะ">
                    <Badge variant="outline" className={a.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500"}>
                      {a.status === "active" ? "ใช้งาน" : "ปิดใช้"}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="เข้าใช้ล่าสุด" className="text-muted-foreground text-xs">{a.lastLogin?.slice(0, 10) ?? "—"}</TableCell>
                  <TableCell data-label="จัดการ">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" aria-label="แก้ไขรายการ" onClick={() => openEdit(a)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" aria-label="ลบรายการ" onClick={() => del(a.id)}><Trash2 className="size-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "แก้ไขผู้ดูแลระบบ" : "เพิ่มผู้ดูแลระบบ"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 py-2">
            <div className="col-span-full space-y-1.5"><Label>ชื่อ-นามสกุล *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>อีเมล *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>เบอร์โทร</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>ตำแหน่ง</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label>สิทธิ์</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Admin["role"] })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(roleMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>สถานะ</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Admin["status"] })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ปิดใช้</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-full space-y-1.5">
              <Label>{editing ? "รหัสผ่านใหม่ (ว่างไว้ = ไม่เปลี่ยน)" : "รหัสผ่าน *"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.name || !form.email || (!editing && !form.password)}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
