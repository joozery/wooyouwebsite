"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, FileText, Loader2, MoreVertical, Edit,
  CheckCircle, XCircle, FilePlus2, ScrollText, FileSpreadsheet,
  Hash, CalendarDays, Banknote, Clock, Printer, ChevronRight,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: "pending" | "approved" | "rejected";
}

type DialogType = "invoice" | "tax-invoice" | "receipt" | null;

const statusCfg = {
  pending:  { label: "รอการอนุมัติ", dot: "bg-amber-400",  pill: "bg-amber-50 text-amber-700 border-amber-200/80" },
  approved: { label: "อนุมัติแล้ว",  dot: "bg-green-500",  pill: "bg-green-50 text-green-700 border-green-200/80" },
  rejected: { label: "ปฏิเสธ",       dot: "bg-red-400",    pill: "bg-red-50 text-red-600 border-red-200/80" },
};

function fmt(n: number) {
  return (n ?? 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function QuotationsPage() {
  const router = useRouter();
  const [list, setList]       = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  // quick-create dialog
  const [dialogType, setDialogType]   = useState<DialogType>(null);
  const [srcQuote, setSrcQuote]       = useState<Quotation | null>(null);
  const [saving, setSaving]           = useState(false);

  // invoice form
  const [invForm, setInvForm] = useState({ customerName: "", date: "", dueDate: "", total: 0, status: "draft", notes: "" });
  // tax-invoice form
  const [taxForm, setTaxForm] = useState({ customerName: "", taxId: "", date: "", total: 0, vat: 0, grandTotal: 0, status: "draft", notes: "" });
  // receipt form
  const [recForm, setRecForm] = useState({ customerName: "", date: "", amount: 0, paymentMethod: "transfer", referenceNumber: "", notes: "" });

  async function load() {
    try {
      const r = await fetch(`${API}/quotations`);
      const data = await r.json();
      setList(Array.isArray(data) ? data : []);
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    await fetch(`${API}/quotations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  function openDialog(type: DialogType, q: Quotation) {
    setSrcQuote(q);
    const today = new Date().toISOString().slice(0, 10);
    if (type === "invoice") {
      setInvForm({ customerName: q.customerName, date: today, dueDate: addDays(30), total: q.total ?? 0, status: "draft", notes: "" });
    } else if (type === "tax-invoice") {
      const vat = Math.round((q.total ?? 0) * 7 / 100);
      setTaxForm({ customerName: q.customerName, taxId: "", date: today, total: q.total ?? 0, vat, grandTotal: (q.total ?? 0) + vat, status: "draft", notes: "" });
    } else if (type === "receipt") {
      setRecForm({ customerName: q.customerName, date: today, amount: q.total ?? 0, paymentMethod: "transfer", referenceNumber: "", notes: "" });
    }
    setDialogType(type);
  }

  async function saveDialog() {
    setSaving(true);
    try {
      if (dialogType === "invoice") {
        await fetch(`${API}/invoices`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...invForm, quotationId: srcQuote?.id }) });
      } else if (dialogType === "tax-invoice") {
        await fetch(`${API}/tax-invoices`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...taxForm, quotationId: srcQuote?.id }) });
      } else if (dialogType === "receipt") {
        await fetch(`${API}/receipts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...recForm, quotationId: srcQuote?.id }) });
      }
    } finally {
      setSaving(false);
      setDialogType(null);
    }
  }

  const filtered = list.filter((q) =>
    q.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    q.quotationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const totalApproved = list.filter((q) => q.status === "approved").length;
  const totalPending  = list.filter((q) => q.status === "pending").length;
  const totalValue    = list.filter((q) => q.status === "approved").reduce((s, q) => s + (q.total ?? 0), 0);

  const dialogTitle: Record<NonNullable<DialogType>, string> = {
    "invoice":     "สร้างใบแจ้งหนี้",
    "tax-invoice": "สร้างใบกำกับภาษี",
    "receipt":     "สร้างใบเสร็จรับเงิน",
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ใบเสนอราคา</h1>
          </div>
          <p className="text-sm text-gray-500 ml-10">จัดการและออกเอกสารจากใบเสนอราคา</p>
        </div>
        <Button
          onClick={() => router.push("/admin/quotations/new")}
          className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          สร้างใบเสนอราคา
        </Button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "รออนุมัติ",   value: `${totalPending} ใบ`,   icon: Clock,      iconBg: "bg-amber-50",  iconColor: "text-amber-500",  border: "border-amber-100" },
          { label: "อนุมัติแล้ว", value: `${totalApproved} ใบ`,  icon: CheckCircle,iconBg: "bg-green-50",  iconColor: "text-green-500",  border: "border-green-100" },
          { label: "มูลค่าอนุมัติ",value: `฿${fmt(totalValue)}`, icon: Banknote,   iconBg: "bg-indigo-50", iconColor: "text-indigo-500", border: "border-indigo-100" },
        ].map((s) => (
          <div key={s.label} className={cn("bg-white rounded-xl border p-4 flex items-center gap-4 shadow-sm", s.border)}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.iconBg)}>
              <s.icon className={cn("w-5 h-5", s.iconColor)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ใบ หรือชื่อลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">ล้าง</button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="text-sm">กำลังโหลดข้อมูล...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">ยังไม่มีใบเสนอราคา</p>
            <button onClick={() => router.push("/admin/quotations/new")} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              สร้างใบแรก <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">เลขที่</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ลูกค้า</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">วันที่</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ยอดรวม</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">สถานะ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((q) => {
                const s = statusCfg[q.status] ?? statusCfg.pending;
                return (
                  <tr key={q.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-gray-300" />
                        <span className="font-semibold text-gray-800 text-[13px]">{q.quotationNumber || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{q.customerName}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                        <CalendarDays className="w-3 h-3 text-gray-300" />
                        {q.date ? new Date(q.date).toLocaleDateString("th-TH") : "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">฿{fmt(q.total)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border", s.pill)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit button */}
                        <button
                          onClick={() => router.push(`/admin/quotations/edit/${q.id}`)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
                          title="แก้ไข"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Print button */}
                        <button
                          onClick={() => router.push(`/admin/quotations/edit/${q.id}`)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
                          title="พิมพ์ / PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Three-dot menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-60">

                            {/* ── Status ── */}
                            <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">สถานะ</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => updateStatus(q.id, "approved")}
                              className="gap-2 text-green-700 focus:bg-green-50 focus:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              อนุมัติใบเสนอราคา
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(q.id, "rejected")}
                              className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                              ไม่อนุมัติ
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* ── Create document ── */}
                            <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">ออกเอกสาร</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openDialog("invoice", q)}
                              className="gap-2"
                            >
                              <FilePlus2 className="w-4 h-4 text-blue-500" />
                              สร้างใบแจ้งหนี้
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDialog("tax-invoice", q)}
                              className="gap-2"
                            >
                              <FileSpreadsheet className="w-4 h-4 text-teal-500" />
                              สร้างใบกำกับภาษี
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDialog("receipt", q)}
                              className="gap-2"
                            >
                              <ScrollText className="w-4 h-4 text-green-500" />
                              สร้างใบเสร็จรับเงิน
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* ── Actions ── */}
                            <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">จัดการ</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/quotations/edit/${q.id}`)}
                              className="gap-2"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                              แก้ไขใบเสนอราคา
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/quotations/edit/${q.id}`)}
                              className="gap-2"
                            >
                              <Printer className="w-4 h-4 text-gray-500" />
                              พิมพ์ / ดาวน์โหลด PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400">แสดง {filtered.length} จาก {list.length} รายการ</p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          Quick-create Dialog (Invoice / Tax-Invoice / Receipt)
      ═══════════════════════════════════════════════ */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {dialogType === "invoice"     && <FilePlus2    className="w-4 h-4 text-blue-500" />}
              {dialogType === "tax-invoice" && <FileSpreadsheet className="w-4 h-4 text-teal-500" />}
              {dialogType === "receipt"     && <ScrollText   className="w-4 h-4 text-green-500" />}
              {dialogType && dialogTitle[dialogType]}
              {srcQuote && (
                <span className="ml-1 text-[11px] font-normal text-gray-400">
                  จาก #{srcQuote.quotationNumber || srcQuote.id.slice(-6)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-4">

            {/* ── Invoice form ── */}
            {dialogType === "invoice" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">ชื่อลูกค้า / บริษัท</Label>
                  <Input value={invForm.customerName} onChange={(e) => setInvForm({ ...invForm, customerName: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วันที่ออก</Label>
                    <Input type="date" value={invForm.date} onChange={(e) => setInvForm({ ...invForm, date: e.target.value })} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วันครบกำหนด</Label>
                    <Input type="date" value={invForm.dueDate} onChange={(e) => setInvForm({ ...invForm, dueDate: e.target.value })} className="h-9 text-sm" />
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">ยอดรวม (฿)</Label>
                  <Input type="number" value={invForm.total} onChange={(e) => setInvForm({ ...invForm, total: Number(e.target.value) })} className="h-9 text-sm bg-white font-bold text-indigo-700" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">สถานะ</Label>
                  <Select value={invForm.status} onValueChange={(v) => setInvForm({ ...invForm, status: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">ร่าง</SelectItem>
                      <SelectItem value="sent">ส่งแล้ว</SelectItem>
                      <SelectItem value="paid">จ่ายแล้ว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">หมายเหตุ</Label>
                  <Textarea rows={2} value={invForm.notes} onChange={(e) => setInvForm({ ...invForm, notes: e.target.value })} className="text-sm resize-none" />
                </div>
              </>
            )}

            {/* ── Tax-invoice form ── */}
            {dialogType === "tax-invoice" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">ชื่อลูกค้า / บริษัท</Label>
                  <Input value={taxForm.customerName} onChange={(e) => setTaxForm({ ...taxForm, customerName: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">เลขประจำตัวผู้เสียภาษี</Label>
                  <Input value={taxForm.taxId} onChange={(e) => setTaxForm({ ...taxForm, taxId: e.target.value })} placeholder="0-0000-00000-00-0" className="h-9 text-sm font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วันที่ออก</Label>
                    <Input type="date" value={taxForm.date} onChange={(e) => setTaxForm({ ...taxForm, date: e.target.value })} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">สถานะ</Label>
                    <Select value={taxForm.status} onValueChange={(v) => setTaxForm({ ...taxForm, status: v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">ร่าง</SelectItem>
                        <SelectItem value="issued">ออกแล้ว</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">ยอดเงิน</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">ก่อน VAT (฿)</Label>
                      <Input
                        type="number" value={taxForm.total}
                        onChange={(e) => {
                          const total = Number(e.target.value);
                          const vat   = Math.round(total * 7 / 100);
                          setTaxForm((f) => ({ ...f, total, vat, grandTotal: total + vat }));
                        }}
                        className="h-9 text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">VAT 7% (฿)</Label>
                      <Input type="number" value={taxForm.vat} readOnly className="h-9 text-sm bg-white text-teal-700 font-medium cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">รวมสุทธิ (฿)</Label>
                      <Input type="number" value={taxForm.grandTotal} readOnly className="h-9 text-sm bg-white text-indigo-700 font-bold cursor-not-allowed" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">หมายเหตุ</Label>
                  <Textarea rows={2} value={taxForm.notes} onChange={(e) => setTaxForm({ ...taxForm, notes: e.target.value })} className="text-sm resize-none" />
                </div>
              </>
            )}

            {/* ── Receipt form ── */}
            {dialogType === "receipt" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">ชื่อลูกค้า / บริษัท</Label>
                  <Input value={recForm.customerName} onChange={(e) => setRecForm({ ...recForm, customerName: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วันที่รับเงิน</Label>
                    <Input type="date" value={recForm.date} onChange={(e) => setRecForm({ ...recForm, date: e.target.value })} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วิธีชำระ</Label>
                    <Select value={recForm.paymentMethod} onValueChange={(v) => setRecForm({ ...recForm, paymentMethod: v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">เงินสด</SelectItem>
                        <SelectItem value="transfer">โอนเงิน</SelectItem>
                        <SelectItem value="cheque">เช็ค</SelectItem>
                        <SelectItem value="other">อื่นๆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">ยอดรับเงิน (฿)</Label>
                  <Input type="number" value={recForm.amount} onChange={(e) => setRecForm({ ...recForm, amount: Number(e.target.value) })} className="h-9 text-sm bg-white font-bold text-green-700" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">เลขที่อ้างอิง</Label>
                  <Input value={recForm.referenceNumber} onChange={(e) => setRecForm({ ...recForm, referenceNumber: e.target.value })} placeholder="เลขที่โอน / เลขเช็ค" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">หมายเหตุ</Label>
                  <Textarea rows={2} value={recForm.notes} onChange={(e) => setRecForm({ ...recForm, notes: e.target.value })} className="text-sm resize-none" />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogType(null)} className="h-9 text-sm">ยกเลิก</Button>
            <Button
              onClick={saveDialog}
              disabled={saving}
              className="h-9 text-sm bg-gray-900 hover:bg-gray-800 text-white"
            >
              {saving && <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />}
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
