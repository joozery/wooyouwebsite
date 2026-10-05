"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, ScrollText } from "lucide-react";
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

interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  date: string;
  amount: number;
  paymentMethod: "cash" | "transfer" | "cheque" | "other";
  referenceNumber?: string;
  status: "issued" | "cancelled";
  notes?: string;
}

const statusMap = {
  issued:    { label: "ออกแล้ว", className: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "ยกเลิก",  className: "bg-red-50 text-red-700 border-red-200" },
};

const paymentLabels: Record<string, string> = {
  cash: "เงินสด", transfer: "โอนเงิน", cheque: "เช็ค", other: "อื่นๆ",
};

const emptyForm = () => ({
  customerName: "", date: new Date().toISOString().slice(0, 10),
  amount: 0, paymentMethod: "transfer" as Receipt["paymentMethod"],
  referenceNumber: "", status: "issued" as Receipt["status"], notes: "",
});

export default function ReceiptsPage() {
  const [list, setList] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Receipt | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/receipts`);
      setList(await r.json());
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((r) =>
    r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    r.receiptNumber?.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(r: Receipt) {
    setEditing(r);
    setForm({ customerName: r.customerName, date: r.date?.slice(0, 10) ?? "", amount: r.amount, paymentMethod: r.paymentMethod, referenceNumber: r.referenceNumber ?? "", status: r.status, notes: r.notes ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/receipts/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/receipts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบใบเสร็จนี้?")) return;
    await fetch(`${API}/receipts/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ใบเสร็จรับเงิน</h1>
          <p className="text-muted-foreground text-sm mt-1">จัดการใบเสร็จรับเงินทั้งหมด</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />สร้างใบเสร็จ</Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="ค้นหาเลขที่, ชื่อลูกค้า..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ScrollText className="size-10 mb-3 opacity-30" /><p>ยังไม่มีใบเสร็จ</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table className="admin-mobile-list" role="table">
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่ใบเสร็จ</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ช่องทางชำระ</TableHead>
                <TableHead>เลขอ้างอิง</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell data-label="เลขที่ใบเสร็จ" className="font-medium">{r.receiptNumber || "—"}</TableCell>
                  <TableCell data-label="ลูกค้า">{r.customerName}</TableCell>
                  <TableCell data-label="วันที่" className="text-muted-foreground text-sm">{r.date?.slice(0, 10)}</TableCell>
                  <TableCell data-label="ช่องทางชำระ">{paymentLabels[r.paymentMethod] ?? r.paymentMethod}</TableCell>
                  <TableCell data-label="เลขอ้างอิง" className="text-muted-foreground text-sm">{r.referenceNumber || "—"}</TableCell>
                  <TableCell data-label="จำนวนเงิน" className="font-semibold">฿{r.amount?.toLocaleString("th-TH")}</TableCell>
                  <TableCell data-label="สถานะ">
                    <Badge variant="outline" className={statusMap[r.status]?.className}>
                      {statusMap[r.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="จัดการ">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" aria-label="แก้ไขรายการ" onClick={() => openEdit(r)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" aria-label="ลบรายการ" onClick={() => del(r.id)}><Trash2 className="size-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "แก้ไขใบเสร็จ" : "สร้างใบเสร็จใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>ชื่อลูกค้า *</Label>
              <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>วันที่</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>จำนวนเงิน (฿)</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>ช่องทางชำระ</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v as Receipt["paymentMethod"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>สถานะ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Receipt["status"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>เลขอ้างอิง / เลขที่โอน</Label>
              <Input value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} />
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
