"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, Calculator, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Wallet, CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  notes?: string;
}

const incomeCategories = ["รายได้จากโปรเจค", "ค่าบริการรายเดือน", "ค่าที่ปรึกษา", "รายได้อื่นๆ"];
const expenseCategories = ["เงินเดือน", "ค่าเช่า", "ค่าซอฟต์แวร์", "ค่าการตลาด", "ค่าสาธารณูปโภค", "ค่าอุปกรณ์", "ค่าใช้จ่ายอื่นๆ"];

const emptyForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  type: "income" as Transaction["type"],
  category: "", description: "", amount: 0, notes: "",
});

export default function AccountingPage() {
  const [list, setList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/accounting`);
      const data = await r.json();
      setList(Array.isArray(data) ? data : []);
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const periodList = list.filter((t) => !month || t.date?.slice(0, 7) === month);
  const filtered = periodList.filter((t) => {
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  }).sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const totalIncome = periodList.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = periodList.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categories = form.type === "income" ? incomeCategories : expenseCategories;

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(t: Transaction) {
    setEditing(t);
    setForm({ date: t.date?.slice(0, 10) ?? "", type: t.type, category: t.category, description: t.description, amount: t.amount, notes: t.notes ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`${API}/accounting/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/accounting`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบรายการนี้?")) return;
    await fetch(`${API}/accounting/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-indigo-500">FINANCE & ACCOUNTING</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">บัญชีรายรับ–รายจ่าย</h1>
          <p className="mt-2 text-sm text-slate-500">ติดตามเงินเข้า เงินออก และจัดการรายการบัญชีในที่เดียว</p>
        </div>
        <Button onClick={openAdd} className="h-11 rounded-xl bg-indigo-600 px-5 text-white shadow-sm hover:bg-indigo-700"><PlusCircle className="size-4" />เพิ่มรายการบัญชี</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-indigo-900">ยอดคงเหลือสุทธิ</p>
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-indigo-600"><Wallet className="size-5" /></span>
          </div>
          <p className={`mt-5 break-words text-3xl font-semibold tracking-tight tabular-nums ${balance >= 0 ? "text-indigo-950" : "text-red-600"}`}>{loading ? "—" : `฿${balance.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`}</p>
          <p className="mt-3 text-xs text-indigo-500">รายรับหักรายจ่าย · {month ? `เดือน ${month}` : "ทุกช่วงเวลา"}</p>
        </div>
        {[
          { label: "รายรับรวม", amount: totalIncome, type: "income", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "รายจ่ายรวม", amount: totalExpense, type: "expense", icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((item) => (
          <div key={item.type} className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">{item.label}</p>
              <span className={`flex size-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}><item.icon className="size-5" /></span>
            </div>
            <p className="mt-5 break-words text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{loading ? "—" : `฿${item.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`}</p>
            <p className="mt-3 text-xs text-slate-400">{loading ? "กำลังโหลด…" : `${periodList.filter((t) => t.type === item.type).length} รายการ`} · {month ? `เดือน ${month}` : "ทุกช่วงเวลา"}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="space-y-5 border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">รายการเคลื่อนไหว</h2>
              <p className="mt-1 text-xs text-slate-400">เรียงจากวันที่ล่าสุด</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{loading ? "กำลังโหลด" : `${filtered.length} รายการ`}</span>
          </div>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 xl:w-auto" role="group" aria-label="กรองประเภทรายการ">
              {(["all", "income", "expense"] as const).map((type) => (
                <button key={type} type="button" aria-pressed={filterType === type} onClick={() => setFilterType(type)} className={`min-h-10 rounded-lg px-4 text-sm font-medium transition-colors ${filterType === type ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{type === "all" ? "ทั้งหมด" : type === "income" ? "รายรับ" : "รายจ่าย"}</button>
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1 xl:w-64">
                <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-400" />
                <Input aria-label="ค้นหารายการบัญชี" placeholder="ค้นหารายละเอียดหรือหมวดหมู่" className="h-11 rounded-xl border-slate-200 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <Input type="month" aria-label="กรองเดือน" className="h-11 min-w-0 rounded-xl border-slate-200 sm:w-44" value={month} onChange={(e) => setMonth(e.target.value)} />
                {month && <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label="แสดงทุกเดือน" onClick={() => setMonth("")}><X className="size-4" /></Button>}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-sm text-slate-400"><Loader2 className="size-6 animate-spin text-indigo-500" />กำลังโหลดรายการบัญชี…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50"><Calculator className="size-6 text-slate-400" /></span>
            <p className="font-medium text-slate-700">{list.length ? "ไม่พบรายการที่ตรงกับตัวกรอง" : "เริ่มบันทึกบัญชีของคุณ"}</p>
            <p className="mt-2 text-sm text-slate-400">{list.length ? "ลองเปลี่ยนคำค้นหา ประเภท หรือเดือนที่เลือก" : "เพิ่มรายรับหรือรายจ่ายเพื่อดูภาพรวมการเงิน"}</p>
            <Button variant="outline" className="mt-5 h-11 rounded-xl" onClick={list.length ? () => { setSearch(""); setMonth(""); setFilterType("all"); } : openAdd}>{list.length ? "ล้างตัวกรอง" : "เพิ่มรายการแรก"}</Button>
          </div>
        ) : (
          <Table className="admin-mobile-list" role="table">
            <TableHeader><TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="px-6">รายละเอียด</TableHead><TableHead>หมวดหมู่</TableHead><TableHead>วันที่</TableHead><TableHead>ประเภท</TableHead><TableHead className="text-right">จำนวนเงิน</TableHead><TableHead className="px-6 text-right">จัดการ</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/60">
                  <TableCell data-label="รายละเอียด" className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{t.type === "income" ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}</span>
                      <div className="min-w-0"><p className="max-w-72 whitespace-normal break-words font-medium text-slate-800">{t.description}</p>{t.notes && <p className="mt-1 max-w-72 whitespace-normal break-words text-xs text-slate-400">{t.notes}</p>}</div>
                    </div>
                  </TableCell>
                  <TableCell data-label="หมวดหมู่" className="text-slate-500">{t.category || "—"}</TableCell>
                  <TableCell data-label="วันที่" className="text-slate-500"><div className="flex items-center gap-2"><CalendarDays className="size-3.5 text-slate-400" />{t.date?.slice(0, 10) || "—"}</div></TableCell>
                  <TableCell data-label="ประเภท"><Badge variant="outline" className={`rounded-full border-0 px-2.5 py-1 ${t.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{t.type === "income" ? "รายรับ" : "รายจ่าย"}</Badge></TableCell>
                  <TableCell data-label="จำนวนเงิน" className={`text-right font-semibold tabular-nums ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>{t.type === "income" ? "+" : "−"}฿{t.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell data-label="จัดการ" className="px-6"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" className="size-9 rounded-lg text-slate-400 hover:text-indigo-600" aria-label="แก้ไขรายการ" onClick={() => openEdit(t)}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" className="size-9 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="ลบรายการ" onClick={() => del(t.id)}><Trash2 className="size-4" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && filtered.length > 0 && <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:px-6">แสดง {filtered.length} จาก {periodList.length} รายการในช่วงเวลาที่เลือก</div>}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "แก้ไขรายการบัญชี" : "เพิ่มรายการบัญชี"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>ประเภท</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Transaction["type"], category: "" })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">รายรับ</SelectItem>
                    <SelectItem value="expense">รายจ่าย</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>วันที่</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>หมวดหมู่</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>รายละเอียด *</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>จำนวนเงิน (฿)</Label>
              <Input type="number" min={0} step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>หมายเหตุ</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={save} disabled={saving || !form.description}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
