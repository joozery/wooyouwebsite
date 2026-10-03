"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle, Loader2, Search, Pencil, Trash2,
  FileSpreadsheet, TrendingUp, Banknote, CircleDot,
  ChevronRight, CalendarDays, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL;

interface TaxInvoice {
  id: string;
  taxInvoiceNumber: string;
  customerName: string;
  taxId: string;
  date: string;
  total: number;
  vat: number;
  grandTotal: number;
  status: "draft" | "issued" | "cancelled";
  notes?: string;
}

const statusMap = {
  draft:     { label: "ร่าง",     dot: "bg-gray-400",  pill: "bg-gray-100 text-gray-600 border-gray-200/80" },
  issued:    { label: "ออกแล้ว", dot: "bg-blue-500",  pill: "bg-blue-50 text-blue-700 border-blue-200/80" },
  cancelled: { label: "ยกเลิก",  dot: "bg-red-400",   pill: "bg-red-50 text-red-600 border-red-200/80" },
};

const emptyForm = () => ({
  customerName: "", taxId: "",
  date: new Date().toISOString().slice(0, 10),
  total: 0, vat: 0, grandTotal: 0,
  status: "draft" as TaxInvoice["status"], notes: "",
});

function fmt(n: number) {
  return (n ?? 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TaxInvoicesPage() {
  const [list, setList]       = useState<TaxInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState<TaxInvoice | null>(null);
  const [form, setForm]       = useState(emptyForm());

  async function load() {
    try {
      const r = await fetch(`${API}/tax-invoices`);
      const data = await r.json();
      setList(Array.isArray(data) ? data : []);
    } catch { setList([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = list.filter((t) =>
    t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    t.taxInvoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.taxId?.includes(search)
  );

  function calcVat(total: number) {
    const vat = Math.round(total * 7 / 100);
    setForm((f) => ({ ...f, total, vat, grandTotal: total + vat }));
  }

  function openAdd() { setEditing(null); setForm(emptyForm()); setOpen(true); }
  function openEdit(t: TaxInvoice) {
    setEditing(t);
    setForm({
      customerName: t.customerName, taxId: t.taxId ?? "",
      date: t.date?.slice(0, 10) ?? "",
      total: t.total ?? 0, vat: t.vat ?? 0, grandTotal: t.grandTotal ?? 0,
      status: t.status, notes: t.notes ?? "",
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url    = editing ? `${API}/tax-invoices/${editing.id}` : `${API}/tax-invoices`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setOpen(false); await load(); setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("ลบใบกำกับภาษีนี้?")) return;
    await fetch(`${API}/tax-invoices/${id}`, { method: "DELETE" });
    await load();
  }

  // summary stats
  const totalIssued    = list.filter((t) => t.status === "issued").length;
  const totalVat       = list.reduce((s, t) => s + (t.vat ?? 0), 0);
  const totalGrand     = list.filter((t) => t.status === "issued").reduce((s, t) => s + (t.grandTotal ?? 0), 0);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ใบกำกับภาษี</h1>
          </div>
          <p className="text-sm text-gray-500 ml-10">จัดการใบกำกับภาษีมูลค่าเพิ่ม (VAT 7%)</p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          สร้างใบกำกับภาษี
        </Button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "ออกแล้ว",
            value: `${totalIssued} ใบ`,
            icon: CircleDot,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            border: "border-blue-100",
          },
          {
            label: "VAT รวมทั้งหมด",
            value: `฿${fmt(totalVat)}`,
            icon: TrendingUp,
            iconBg: "bg-teal-50",
            iconColor: "text-teal-500",
            border: "border-teal-100",
          },
          {
            label: "ยอดรวม (ออกแล้ว)",
            value: `฿${fmt(totalGrand)}`,
            icon: Banknote,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-500",
            border: "border-indigo-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn("bg-white rounded-xl border p-4 flex items-center gap-4 shadow-sm", s.border)}
          >
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
            placeholder="ค้นหาเลขที่ใบ, ชื่อลูกค้า, เลขภาษี..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-gray-400 hover:text-gray-600 shrink-0"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            <span className="text-sm">กำลังโหลดข้อมูล...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">ยังไม่มีใบกำกับภาษี</p>
            <button
              onClick={openAdd}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              สร้างใบแรก <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">เลขที่</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ลูกค้า</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">เลขภาษี</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">วันที่</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ก่อน VAT</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">VAT 7%</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ยอดรวม</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">สถานะ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => {
                const s = statusMap[t.status] ?? statusMap.draft;
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-gray-300" />
                        <span className="font-semibold text-gray-800 text-[13px]">
                          {t.taxInvoiceNumber || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{t.customerName}</td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-[12px]">{t.taxId || "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                        <CalendarDays className="w-3 h-3 text-gray-300" />
                        {t.date?.slice(0, 10) ?? "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-600">฿{fmt(t.total)}</td>
                    <td className="px-5 py-3.5 text-right text-teal-600 font-medium">฿{fmt(t.vat)}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">฿{fmt(t.grandTotal)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border", s.pill)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(t)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => del(t.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              แสดง {filtered.length} จาก {list.length} รายการ
            </p>
          </div>
        )}
      </div>

      {/* ── Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
              </div>
              {editing ? "แก้ไขใบกำกับภาษี" : "สร้างใบกำกับภาษีใหม่"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Customer + Tax ID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">ชื่อลูกค้า / บริษัท *</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="บริษัท ABC จำกัด"
                  className="h-9 text-sm"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">เลขประจำตัวผู้เสียภาษี</Label>
                <Input
                  value={form.taxId}
                  onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                  placeholder="0-0000-00000-00-0"
                  className="h-9 text-sm font-mono"
                />
              </div>
            </div>

            {/* Date + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">วันที่ออก</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">สถานะ</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TaxInvoice["status"] })}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        <span className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full", v.dot)} />
                          {v.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount section */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">ยอดเงิน</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">ยอดก่อน VAT (฿)</Label>
                  <Input
                    type="number"
                    value={form.total}
                    onChange={(e) => calcVat(Number(e.target.value))}
                    className="h-9 text-sm bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">VAT 7% (฿)</Label>
                  <Input
                    type="number"
                    value={form.vat}
                    readOnly
                    className="h-9 text-sm bg-white text-teal-700 font-medium cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">ยอดรวมสุทธิ (฿)</Label>
                  <Input
                    type="number"
                    value={form.grandTotal}
                    readOnly
                    className="h-9 text-sm bg-white text-indigo-700 font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">หมายเหตุ</Label>
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                className="text-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="h-9 text-sm">
              ยกเลิก
            </Button>
            <Button
              onClick={save}
              disabled={saving || !form.customerName}
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
