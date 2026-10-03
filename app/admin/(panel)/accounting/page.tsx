"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, Search, Pencil, Trash2, Calculator, TrendingUp, TrendingDown } from "lucide-react";
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
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/accounting`);
      setList(await r.json());
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((t) => {
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  const totalIncome = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">บัญชีรายรับ-รายจ่าย</h1>
          <p className="text-muted-foreground text-sm mt-1">บันทึกรายการรายรับและรายจ่าย</p>
        </div>
        <Button onClick={openAdd}><PlusCircle className="mr-2 size-4" />บันทึกรายการ</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-5 pb-4 flex items-start gap-3">
          <TrendingUp className="size-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">รายรับรวม</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">฿{totalIncome.toLocaleString("th-TH")}</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4 flex items-start gap-3">
          <TrendingDown className="size-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">รายจ่ายรวม</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">฿{totalExpense.toLocaleString("th-TH")}</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4 flex items-start gap-3">
          <Calculator className="size-5 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">กำไรสุทธิ</p>
            <p className={`text-xl font-bold mt-0.5 ${balance >= 0 ? "text-indigo-600" : "text-red-600"}`}>
              ฿{balance.toLocaleString("th-TH")}
            </p>
          </div>
        </CardContent></Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="ค้นหารายการ..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {(["all", "income", "expense"] as const).map((t) => (
            <Button key={t} size="sm" variant={filterType === t ? "default" : "outline"} onClick={() => setFilterType(t)}>
              {t === "all" ? "ทั้งหมด" : t === "income" ? "รายรับ" : "รายจ่าย"}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Calculator className="size-10 mb-3 opacity-30" /><p>ยังไม่มีรายการ</p>
        </CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>จำนวน</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground text-sm">{t.date?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={t.type === "income" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                      {t.type === "income" ? "รายรับ" : "รายจ่าย"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{t.category}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell className={`font-semibold ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                    {t.type === "income" ? "+" : "-"}฿{t.amount?.toLocaleString("th-TH")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => openEdit(t)}><Pencil className="size-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:bg-red-50" onClick={() => del(t.id)}><Trash2 className="size-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "แก้ไขรายการ" : "บันทึกรายการใหม่"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ประเภท</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Transaction["type"], category: "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <SelectTrigger><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
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
              <Input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>หมายเหตุ</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={save} disabled={saving || !form.description}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
