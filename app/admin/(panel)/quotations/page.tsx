"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, FileText, Loader2, MoreVertical, Edit,
  CheckCircle, XCircle, FilePlus2, ScrollText, FileSpreadsheet,
  CalendarDays, Banknote, Clock, Printer, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
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
  const [statusFilter, setStatusFilter] = useState<"all" | Quotation["status"]>("all");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const r = await fetch(`${API}/quotations`);
      if (!r.ok) throw new Error("Unable to load quotations");
      const data = await r.json();
      setList(Array.isArray(data) ? data : []);
    } catch { setError("โหลดใบเสนอราคาไม่สำเร็จ กรุณาลองอีกครั้ง"); } finally { setLoading(false); }
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

  const periodList = list.filter((q) => !month || q.date?.slice(0, 7) === month);
  const filtered = periodList.filter((q) => {
    const query = search.trim().toLowerCase();
    return (q.customerName?.toLowerCase().includes(query) || q.quotationNumber?.toLowerCase().includes(query)) && (statusFilter === "all" || q.status === statusFilter);
  }).sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);
  const visiblePages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);

  const totalApproved = periodList.filter((q) => q.status === "approved").length;
  const totalPending = periodList.filter((q) => q.status === "pending").length;
  const totalValue = periodList.filter((q) => q.status === "approved").reduce((sum, q) => sum + (q.total ?? 0), 0);

  const dialogTitle: Record<NonNullable<DialogType>, string> = {
    "invoice":     "สร้างใบแจ้งหนี้",
    "tax-invoice": "สร้างใบกำกับภาษี",
    "receipt":     "สร้างใบเสร็จรับเงิน",
  };

  return (
    <div className="min-w-0 w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-indigo-500">SALES DOCUMENTS</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">ใบเสนอราคา</h1>
          <p className="mt-2 text-sm text-slate-500">ติดตามสถานะใบเสนอราคา และสร้างเอกสารต่อเนื่องได้ในที่เดียว</p>
        </div>
        <Button onClick={() => router.push("/admin/quotations/new")} className="h-11 rounded-xl bg-indigo-600 px-5 shadow-sm hover:bg-indigo-700"><Plus className="size-4" />สร้างใบเสนอราคา</Button>
      </div>

      <div className="grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "ใบเสนอราคาทั้งหมด", value: periodList.length.toLocaleString("th-TH"), unit: "ใบ", icon: FileText, bg: "bg-slate-100", color: "text-slate-500", featured: false },
          { label: "รอการอนุมัติ", value: totalPending.toLocaleString("th-TH"), unit: "ใบ", icon: Clock, bg: "bg-amber-50", color: "text-amber-600", featured: false },
          { label: "อนุมัติแล้ว", value: totalApproved.toLocaleString("th-TH"), unit: "ใบ", icon: CheckCircle, bg: "bg-emerald-50", color: "text-emerald-600", featured: false },
          { label: "มูลค่าที่อนุมัติ", value: `฿${fmt(totalValue)}`, unit: "", icon: Banknote, bg: "bg-white", color: "text-indigo-600", featured: true },
        ].map((item) => (
          <div key={item.label} className={cn("min-w-0 rounded-2xl border p-5", item.featured ? "border-indigo-100 bg-indigo-50/70" : "border-slate-200/80 bg-white")}>
            <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-600">{item.label}</p><span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", item.bg, item.color)}><item.icon className="size-5" /></span></div>
            <div className="mt-4 flex min-w-0 items-baseline gap-2"><p className={cn("min-w-0 break-words text-2xl font-semibold tracking-tight tabular-nums", item.featured ? "text-indigo-950" : "text-slate-900")}>{loading || error ? "—" : item.value}</p>{item.unit && <span className="text-xs text-slate-400">{item.unit}</span>}</div>
            <p className="mt-2 text-xs text-slate-400">{month ? `เดือน ${month}` : "ทุกช่วงเวลา"}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="space-y-5 border-b border-slate-100 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-900">รายการใบเสนอราคา</h2><p className="mt-1 text-xs text-slate-400">เรียงจากวันที่ล่าสุด · จัดการสถานะและออกเอกสารจากเมนูของแต่ละรายการ</p></div><span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{loading || error ? "—" : filtered.length} รายการ</span></div>
          <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:grid-cols-4 2xl:w-auto" role="group" aria-label="กรองสถานะใบเสนอราคา">
              {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                <button key={status} type="button" aria-pressed={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(1); }} className={cn("min-h-10 rounded-lg px-3 text-sm font-medium transition-colors", statusFilter === status ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900")}>{status === "all" ? "ทั้งหมด" : statusCfg[status].label}</button>
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1 2xl:w-64"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-400" /><Input aria-label="ค้นหาใบเสนอราคา" placeholder="ค้นหาเลขที่เอกสาร หรือชื่อลูกค้า" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="h-11 rounded-xl border-slate-200 pl-9" /></div>
              <div className="flex min-w-0 items-center gap-2"><Input type="month" aria-label="กรองเดือนที่ออกใบเสนอราคา" value={month} onChange={(e) => { setMonth(e.target.value); setPage(1); }} className="h-11 min-w-0 rounded-xl border-slate-200 sm:w-44" />{month && <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label="แสดงทุกเดือน" onClick={() => { setMonth(""); setPage(1); }}><X className="size-4" /></Button>}</div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="text-sm">กำลังโหลดข้อมูล...</span>
          </div>
        ) : error ? (
          <div role="alert" className="px-4 py-16 text-center"><p className="text-sm text-rose-600">{error}</p><Button variant="outline" className="mt-4 h-11 rounded-xl" onClick={() => { setLoading(true); void load(); }}>ลองอีกครั้ง</Button></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50"><FileText className="size-6 text-slate-400" /></span>
            <p className="font-medium text-slate-700">{list.length ? "ไม่พบใบเสนอราคาที่ตรงกับตัวกรอง" : "สร้างใบเสนอราคาฉบับแรก"}</p>
            <p className="mt-2 text-sm text-slate-400">{list.length ? "ลองเปลี่ยนคำค้นหา สถานะ หรือเดือนที่เลือก" : "เริ่มจัดทำเอกสารและติดตามการอนุมัติของลูกค้า"}</p>
            <Button variant="outline" className="mt-5 h-11 rounded-xl" onClick={list.length ? () => { setSearch(""); setMonth(""); setStatusFilter("all"); setPage(1); } : () => router.push("/admin/quotations/new")}>{list.length ? "ล้างตัวกรอง" : "สร้างใบเสนอราคา"}</Button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto"><table role="table" className="admin-mobile-list w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">เลขที่</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ลูกค้า</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">วันที่</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ยอดรวม</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">สถานะ</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((q) => {
                const s = statusCfg[q.status] ?? statusCfg.pending;
                return (
                  <tr key={q.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td data-label="เลขที่" className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500"><FileText className="size-4" /></span>
                        <button onClick={() => router.push(`/admin/quotations/edit/${q.id}`)} className="break-all text-left font-semibold text-slate-800 hover:text-indigo-600">{q.quotationNumber || "—"}</button>
                      </div>
                    </td>
                    <td data-label="ลูกค้า" className="max-w-72 break-words px-5 py-4 text-slate-600">{q.customerName}</td>
                    <td data-label="วันที่" className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                        <CalendarDays className="w-3 h-3 text-gray-300" />
                        {q.date ? new Date(q.date).toLocaleDateString("th-TH") : "—"}
                      </div>
                    </td>
                    <td data-label="ยอดรวม" className="px-5 py-4 text-right font-semibold text-slate-900 tabular-nums">฿{fmt(q.total)}</td>
                    <td data-label="สถานะ" className="px-5 py-3.5 text-center">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border", s.pill)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                        {s.label}
                      </span>
                    </td>
                    <td data-label="จัดการ" className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit button */}
                        <button
                          onClick={() => router.push(`/admin/quotations/edit/${q.id}`)}
                          className="size-9 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-100"
                          aria-label="แก้ไขใบเสนอราคา" title="แก้ไข"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Print button */}
                        <button
                          onClick={() => router.push(`/admin/quotations/edit/${q.id}`)}
                          className="size-9 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-100"
                          aria-label="เปิดเอกสารสำหรับพิมพ์หรือ PDF" title="พิมพ์ / PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Three-dot menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button aria-label="เมนูจัดการใบเสนอราคา" className="size-9 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
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
          </table></div>
        )}

        {/* Footer */}
        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <p aria-live="polite">แสดง {offset + 1}–{offset + paginated.length} จาก {filtered.length} รายการ</p>
              <label className="flex items-center gap-2">ต่อหน้า
                <select aria-label="จำนวนรายการต่อหน้า" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="min-h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>
            <nav aria-label="หน้ารายการใบเสนอราคา" className="flex flex-wrap items-center gap-1">
              <Button variant="outline" size="icon" className="size-10 rounded-lg" disabled={currentPage === 1} aria-label="หน้าก่อนหน้า" onClick={() => setPage(currentPage - 1)}><ChevronLeft className="size-4" /></Button>
              {visiblePages.map((value, index) => (
                <span key={value} className="flex items-center gap-1">
                  {index > 0 && value - visiblePages[index - 1] > 1 && <span className="px-1 text-slate-400" aria-hidden="true">…</span>}
                  <Button variant={value === currentPage ? "default" : "ghost"} className={cn("size-10 rounded-lg p-0", value === currentPage && "bg-indigo-600 hover:bg-indigo-700")} aria-label={`หน้า ${value}`} aria-current={value === currentPage ? "page" : undefined} onClick={() => setPage(value)}>{value}</Button>
                </span>
              ))}
              <Button variant="outline" size="icon" className="size-10 rounded-lg" disabled={currentPage === totalPages} aria-label="หน้าถัดไป" onClick={() => setPage(currentPage + 1)}><ChevronRight className="size-4" /></Button>
            </nav>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════
          Quick-create Dialog (Invoice / Tax-Invoice / Receipt)
      ═══════════════════════════════════════════════ */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2 pr-6 text-base">
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
            <DialogDescription>ตรวจสอบข้อมูลก่อนบันทึกเอกสารที่สร้างจากใบเสนอราคานี้</DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-4">

            {/* ── Invoice form ── */}
            {dialogType === "invoice" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">ชื่อลูกค้า / บริษัท</Label>
                  <Input value={invForm.customerName} onChange={(e) => setInvForm({ ...invForm, customerName: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    <SelectTrigger className="w-full h-9 text-sm"><SelectValue /></SelectTrigger>
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วันที่ออก</Label>
                    <Input type="date" value={taxForm.date} onChange={(e) => setTaxForm({ ...taxForm, date: e.target.value })} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">สถานะ</Label>
                    <Select value={taxForm.status} onValueChange={(v) => setTaxForm({ ...taxForm, status: v })}>
                      <SelectTrigger className="w-full h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">ร่าง</SelectItem>
                        <SelectItem value="issued">ออกแล้ว</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">ยอดเงิน</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วันที่รับเงิน</Label>
                    <Input type="date" value={recForm.date} onChange={(e) => setRecForm({ ...recForm, date: e.target.value })} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">วิธีชำระ</Label>
                    <Select value={recForm.paymentMethod} onValueChange={(v) => setRecForm({ ...recForm, paymentMethod: v })}>
                      <SelectTrigger className="w-full h-9 text-sm"><SelectValue /></SelectTrigger>
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
              className="h-11 rounded-xl bg-indigo-600 text-sm text-white hover:bg-indigo-700"
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
