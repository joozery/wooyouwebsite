"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, Users, Building2, UserRound, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  type: "company" | "individual";
  notes?: string;
}

const empty = { name: "", contactPerson: "", email: "", phone: "", address: "", taxId: "", type: "company" as "company" | "individual", notes: "" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | Customer["type"]>("all");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(empty);

  async function load() {
    setError("");
    try {
      const r = await fetch(`${API}/customers`);
      if (!r.ok) throw new Error("โหลดข้อมูลลูกค้าไม่สำเร็จ กรุณาลองอีกครั้ง");
      const data = await r.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      setError("โหลดข้อมูลลูกค้าไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = customers.filter((c) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = [c.name, c.contactPerson, c.email, c.phone, c.taxId].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (filterType === "all" || c.type === filterType);
  });

  function openAdd() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(c: Customer) {
    setEditing(c);
    setForm({ name: c.name, contactPerson: c.contactPerson, email: c.email, phone: c.phone, address: c.address, taxId: c.taxId, type: c.type as "company" | "individual", notes: c.notes ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/customers/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/customers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบลูกค้านี้?")) return;
    await fetch(`${API}/customers/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-w-0 w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-indigo-500">CUSTOMER DIRECTORY</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">จัดการลูกค้า</h1>
          <p className="mt-2 text-sm text-slate-500">ข้อมูลลูกค้า ผู้ติดต่อ และรายละเอียดสำหรับออกเอกสาร</p>
        </div>
        <Button onClick={openAdd} className="h-11 rounded-xl bg-indigo-600 px-5 hover:bg-indigo-700"><PlusCircle className="size-4" />เพิ่มลูกค้าใหม่</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "ลูกค้าทั้งหมด", count: customers.length, icon: Users, accent: "bg-indigo-50/70 border-indigo-100", iconColor: "bg-white text-indigo-600" },
          { label: "ลูกค้าบริษัท", count: customers.filter((c) => c.type === "company").length, icon: Building2, accent: "bg-white border-slate-200/80", iconColor: "bg-blue-50 text-blue-600" },
          { label: "ลูกค้าบุคคล", count: customers.filter((c) => c.type === "individual").length, icon: UserRound, accent: "bg-white border-slate-200/80", iconColor: "bg-emerald-50 text-emerald-600" },
        ].map((item) => (
          <div key={item.label} className={`min-w-0 rounded-2xl border p-5 sm:p-6 ${item.accent}`}>
            <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-600">{item.label}</p><span className={`flex size-10 items-center justify-center rounded-xl ${item.iconColor}`}><item.icon className="size-5" /></span></div>
            <div className="mt-4 flex items-baseline gap-2"><p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{loading || error ? "—" : item.count}</p><span className="text-xs text-slate-400">ราย</span></div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="space-y-5 border-b border-slate-100 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-900">รายชื่อลูกค้า</h2><p className="mt-1 text-xs text-slate-400">ค้นหาและจัดการข้อมูลผู้ติดต่อ</p></div><span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{loading || error ? "—" : filtered.length} ราย</span></div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 lg:w-auto" role="group" aria-label="กรองประเภทลูกค้า">
              {(["all", "company", "individual"] as const).map((type) => <button key={type} type="button" aria-pressed={filterType === type} onClick={() => setFilterType(type)} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition-colors ${filterType === type ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{type === "all" ? "ทั้งหมด" : type === "company" ? "บริษัท" : "บุคคล"}</button>)}
            </div>
            <div className="relative min-w-0 lg:w-80"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-400" /><Input aria-label="ค้นหาลูกค้า" placeholder="ค้นหาชื่อ ผู้ติดต่อ อีเมล หรือเบอร์โทร" className="h-11 rounded-xl border-slate-200 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-sm text-slate-400"><Loader2 className="size-6 animate-spin text-indigo-500" />กำลังโหลดข้อมูลลูกค้า…</div>
        ) : error ? (
          <div className="px-4 py-16 text-center" role="alert"><p className="text-sm text-rose-600">{error}</p><Button variant="outline" className="mt-4 h-11 rounded-xl" onClick={() => { setLoading(true); void load(); }}>ลองอีกครั้ง</Button></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-16 text-center"><span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50"><Users className="size-6 text-slate-400" /></span><p className="font-medium text-slate-700">{customers.length ? "ไม่พบลูกค้าที่ตรงกับตัวกรอง" : "เริ่มเพิ่มลูกค้ารายแรก"}</p><p className="mt-2 text-sm text-slate-400">{customers.length ? "ลองเปลี่ยนคำค้นหาหรือประเภทลูกค้า" : "เก็บข้อมูลติดต่อไว้ในที่เดียว เพื่อให้ทีมทำงานต่อได้ง่าย"}</p><Button variant="outline" className="mt-5 h-11 rounded-xl" onClick={customers.length ? () => { setSearch(""); setFilterType("all"); } : openAdd}>{customers.length ? "ล้างตัวกรอง" : "เพิ่มลูกค้าใหม่"}</Button></div>
        ) : (
          <Table className="admin-mobile-list" role="table">
            <TableHeader><TableRow className="bg-slate-50/70 hover:bg-slate-50/70"><TableHead className="px-6">ลูกค้า</TableHead><TableHead>ผู้ติดต่อหลัก</TableHead><TableHead>ช่องทางติดต่อ</TableHead><TableHead>เลขประจำตัวผู้เสียภาษี</TableHead><TableHead>ประเภท</TableHead><TableHead className="px-6 text-right">จัดการ</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/60">
                  <TableCell data-label="ลูกค้า" className="px-6 py-4"><div className="flex items-center gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${c.type === "company" ? "bg-indigo-50 text-indigo-500" : "bg-emerald-50 text-emerald-600"}`}>{c.type === "company" ? <Building2 className="size-5" /> : <UserRound className="size-5" />}</span><div className="min-w-0"><p className="max-w-64 whitespace-normal break-words font-medium text-slate-800">{c.name}</p>{c.address && <p className="mt-1 line-clamp-1 max-w-64 whitespace-normal text-xs text-slate-400" title={c.address}>{c.address}</p>}</div></div></TableCell>
                  <TableCell data-label="ผู้ติดต่อหลัก" className="text-slate-600">{c.contactPerson || "—"}</TableCell>
                  <TableCell data-label="ช่องทางติดต่อ"><div className="space-y-2 text-sm">{c.email ? <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600"><Mail className="size-3.5 shrink-0 text-slate-400" /><span className="max-w-60 whitespace-normal break-all">{c.email}</span></a> : <p className="text-xs text-slate-400">ไม่มีอีเมล</p>}{c.phone ? <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600"><Phone className="size-3.5 shrink-0 text-slate-400" /><span>{c.phone}</span></a> : <p className="text-xs text-slate-400">ไม่มีเบอร์โทร</p>}</div></TableCell>
                  <TableCell data-label="เลขประจำตัวผู้เสียภาษี" className="font-mono text-xs text-slate-500">{c.taxId || "—"}</TableCell>
                  <TableCell data-label="ประเภท"><Badge variant="outline" className={`rounded-full border-0 px-2.5 py-1 ${c.type === "company" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-700"}`}>{c.type === "company" ? "บริษัท" : "บุคคล"}</Badge></TableCell>
                  <TableCell data-label="จัดการ" className="px-6"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" className="size-9 rounded-lg text-slate-400 hover:text-indigo-600" aria-label={`แก้ไขลูกค้า ${c.name}`} onClick={() => openEdit(c)}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" className="size-9 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`ลบลูกค้า ${c.name}`} onClick={() => del(c.id)}><Trash2 className="size-4" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && !error && filtered.length > 0 && <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:px-6">แสดง {filtered.length} จาก {customers.length} ราย</div>}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}</DialogTitle><DialogDescription>ข้อมูลสำหรับติดต่อและออกเอกสารให้ลูกค้า</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-full space-y-1.5">
                <Label>ชื่อบริษัท/ลูกค้า *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>ผู้ติดต่อหลัก</Label>
                <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>ประเภท</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "company" | "individual" })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">บริษัท</SelectItem>
                    <SelectItem value="individual">บุคคล</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>อีเมล *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>เบอร์โทร *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>เลขประจำตัวผู้เสียภาษี</Label>
                <Input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>ที่อยู่</Label>
              <Textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>หมายเหตุ</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={save} disabled={saving || !form.name || !form.email || !form.phone}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
