"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, FileText } from "lucide-react";
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
}

const statusMap = {
  draft:     { label: "ร่าง",        className: "bg-gray-100 text-gray-600 border-gray-200" },
  sent:      { label: "ส่งแล้ว",     className: "bg-blue-50 text-blue-700 border-blue-200" },
  paid:      { label: "จ่ายแล้ว",    className: "bg-green-50 text-green-700 border-green-200" },
  overdue:   { label: "เกินกำหนด",  className: "bg-red-50 text-red-700 border-red-200" },
  cancelled: { label: "ยกเลิก",      className: "bg-orange-50 text-orange-700 border-orange-200" },
};

const emptyForm = () => ({ customerName: "", date: new Date().toISOString().slice(0, 10), dueDate: "", total: 0, status: "draft" as Invoice["status"], notes: "" });

export default function InvoicesPage() {
  const [list, setList] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    const r = await fetch(`${API}/invoices`);
    setList(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((inv) =>
    inv.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = list.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = list.filter((i) => i.status === "sent").reduce((s, i) => s + i.total, 0);

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(inv: Invoice) {
    setEditing(inv);
    setForm({ customerName: inv.customerName, date: inv.date?.slice(0, 10) ?? "", dueDate: inv.dueDate?.slice(0, 10) ?? "", total: inv.total, status: inv.status, notes: inv.notes ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/invoices/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/invoices`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบใบแจ้งหนี้นี้?")) return;
    await fetch(`${API}/invoices/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ใบแจ้งหนี้</h1>
          <p className="text-muted-foreground text-sm mt-1">จัดการใบแจ้งหนี้ทั้งหมด</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />สร้างใบแจ้งหนี้</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">มูลค่าทั้งหมด</p>
          <p className="text-2xl font-bold mt-1">฿{list.reduce((s, i) => s + i.total, 0).toLocaleString("th-TH")}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">จ่ายแล้ว</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">฿{totalPaid.toLocaleString("th-TH")}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">รอชำระ</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">฿{totalPending.toLocaleString("th-TH")}</p>
        </CardContent></Card>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="ค้นหาเลขที่, ชื่อลูกค้า..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="size-10 mb-3 opacity-30" /><p>ยังไม่มีใบแจ้งหนี้</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table className="admin-mobile-list" role="table">
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ครบกำหนด</TableHead>
                <TableHead>มูลค่า</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell data-label="เลขที่" className="font-medium">{inv.invoiceNumber || "—"}</TableCell>
                  <TableCell data-label="ลูกค้า">{inv.customerName}</TableCell>
                  <TableCell data-label="วันที่" className="text-muted-foreground text-sm">{inv.date?.slice(0, 10)}</TableCell>
                  <TableCell data-label="ครบกำหนด" className="text-muted-foreground text-sm">{inv.dueDate?.slice(0, 10) || "—"}</TableCell>
                  <TableCell data-label="มูลค่า">฿{inv.total?.toLocaleString("th-TH")}</TableCell>
                  <TableCell data-label="สถานะ">
                    <Badge variant="outline" className={statusMap[inv.status]?.className}>
                      {statusMap[inv.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="จัดการ">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" aria-label="แก้ไขรายการ" onClick={() => openEdit(inv)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" aria-label="ลบรายการ" onClick={() => del(inv.id)}><Trash2 className="size-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "แก้ไขใบแจ้งหนี้" : "สร้างใบแจ้งหนี้ใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>ชื่อลูกค้า *</Label>
              <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>วันที่ออก</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>ครบกำหนด</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>มูลค่า (฿)</Label>
                <Input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>สถานะ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Invoice["status"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>หมายเหตุ</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.customerName}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
