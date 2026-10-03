"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Printer, Plus, Trash2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const API = process.env.NEXT_PUBLIC_API_URL;

interface QuotationItem {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
}

interface FormData {
  quotationNumber: string;
  customerName: string;
  customerAddress: string;
  customerTaxId: string;
  date: string;
  validUntil: string;
  items: QuotationItem[];
  discount: number;
  notes: string;
  status: string;
  includeVat: boolean;
  includeWht: boolean;
}

interface Customer {
  id: string;
  name?: string;
  companyName?: string;
  address?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  zipCode?: string;
  taxId?: string;
}

interface Settings {
  companyName?: string;
  companyAddress?: string;
  taxId?: string;
  logo?: string;
  signature?: string;
}

const emptyItem = (): QuotationItem => ({
  name: "", description: "", quantity: 1, unit: "", price: 0, discount: 0,
});

const defaultForm = (): FormData => ({
  quotationNumber: "",
  customerName: "", customerAddress: "", customerTaxId: "",
  date: new Date().toISOString().split("T")[0],
  validUntil: "",
  items: [emptyItem()],
  discount: 0, notes: "", status: "pending",
  includeVat: true, includeWht: false,
});

export function QuotationDocForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const docRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<Settings | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<FormData>(defaultForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, customersRes] = await Promise.all([
          fetch(`${API}/settings`).then((r) => r.json()).catch(() => ({})),
          fetch(`${API}/customers`).then((r) => r.json()).catch(() => []),
        ]);
        setSettings(settingsRes);
        setCustomers(Array.isArray(customersRes) ? customersRes : []);

        if (isEditing && id) {
          const q = await fetch(`${API}/quotations/${id}`).then((r) => r.json());
          const items = (q.items ?? []).map((item: Partial<QuotationItem>) => ({
            name: item.name ?? "",
            description: item.description ?? "",
            quantity: item.quantity ?? 1,
            unit: item.unit ?? "",
            price: item.price ?? 0,
            discount: item.discount ?? 0,
          }));
          setFormData({
            quotationNumber: q.quotationNumber ?? "",
            customerName: q.customerName ?? "",
            customerAddress: q.customerAddress ?? "",
            customerTaxId: q.customerTaxId ?? "",
            date: q.date ? new Date(q.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            validUntil: q.validUntil ? new Date(q.validUntil).toISOString().split("T")[0] : "",
            items: items.length ? items : [emptyItem()],
            discount: q.discount ?? 0,
            notes: q.notes ?? "",
            status: q.status ?? "pending",
            includeVat: q.includeVat !== undefined ? q.includeVat : true,
            includeWht: q.includeWht ?? false,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [id, isEditing]);

  function handleCustomerSelect(customerId: string) {
    const c = customers.find((x) => x.id === customerId);
    if (!c) return;
    const address = [c.address, c.subdistrict, c.district, c.province, c.zipCode].filter(Boolean).join(" ");
    setFormData((f) => ({
      ...f,
      customerName: c.name ?? c.companyName ?? "",
      customerAddress: address,
      customerTaxId: c.taxId ?? "",
    }));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  function handleItemChange(i: number, field: keyof QuotationItem, value: string | number) {
    setFormData((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: typeof value === "string" && ["quantity", "price", "discount"].includes(field) ? parseFloat(value) || 0 : value };
      return { ...f, items };
    });
  }

  function addItem() {
    setFormData((f) => ({ ...f, items: [...f.items, emptyItem()] }));
  }

  function removeItem(i: number) {
    setFormData((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }));
  }

  const subtotal = formData.items.reduce((s, it) => s + (it.quantity * it.price) - it.discount, 0);
  const afterDiscount = subtotal - (Number(formData.discount) || 0);
  const vat = formData.includeVat ? afterDiscount * 0.07 : 0;
  const wht = formData.includeWht ? afterDiscount * 0.03 : 0;
  const total = afterDiscount + vat;
  const netPayable = total - wht;

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        ...formData,
        subtotal, vat, wht, total: formData.includeWht ? netPayable : total,
        date: new Date(formData.date),
        validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
      };
      if (isEditing) {
        await fetch(`${API}/quotations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch(`${API}/quotations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      router.push("/admin/quotations");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    if (!docRef.current) return;
    const content = docRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8"/>
      <title>ใบเสนอราคา ${formData.quotationNumber}</title>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sarabun', sans-serif; font-size: 13px; background: white; }
        input, textarea, select { display: none; }
        .print-value { display: inline; }
        @media print { @page { size: A4; margin: 0; } body { margin: 0; } }
      </style>
    </head><body>${content}</body></html>`);
    win.document.close();
    win.onload = () => win.print();
  }

  const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      {/* Top bar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center no-print">
        <Button variant="ghost" onClick={() => router.push("/admin/quotations")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้ารายการ
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="bg-black hover:bg-slate-800 text-white">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "บันทึกการเปลี่ยนแปลง" : "บันทึกใบเสนอราคา"}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            พิมพ์ / PDF
          </Button>
        </div>
      </div>

      {/* A4 Document */}
      <div
        ref={docRef}
        className="w-[210mm] min-h-[297mm] mx-auto bg-white p-[40px] shadow-lg text-black text-sm relative flex flex-col"
      >
        {/* Header */}
        <header className="flex justify-between items-start mb-10">
          <div className="flex gap-4 max-w-[60%]">
            {settings?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo} alt="Logo" className="w-[80px] h-[80px] object-contain" />
            ) : (
              <div className="w-[80px] h-[80px] bg-slate-50 rounded border border-slate-200 flex items-center justify-center text-slate-300">
                <Building className="w-8 h-8" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">{settings?.companyName ?? "WOOYOU CREATIVE CO., LTD."}</h1>
              <p className="text-sm whitespace-pre-wrap leading-relaxed mt-1">{settings?.companyAddress ?? ""}</p>
              {settings?.taxId && <p className="text-sm mt-1">เลขประจำตัวผู้เสียภาษี: {settings.taxId}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold tracking-tight mb-2">ใบเสนอราคา</h2>
            <div className="flex justify-end items-center gap-2">
              <span className="font-semibold text-slate-600">เลขที่:</span>
              <input
                value={formData.quotationNumber}
                onChange={(e) => setFormData((f) => ({ ...f, quotationNumber: e.target.value }))}
                placeholder="Auto Generated"
                className="font-bold text-lg text-right border-none focus:ring-0 p-0 bg-transparent w-40 outline-none"
              />
            </div>
          </div>
        </header>

        {/* Customer & Date info */}
        <section className="flex justify-between items-start mb-8">
          <div className="w-[60%] space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <label className="font-bold w-16 shrink-0">ลูกค้า</label>
              {customers.length > 0 && (
                <div className="flex-1 no-print">
                  <Select onValueChange={handleCustomerSelect}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="เลือกจากรายชื่อลูกค้า..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name ?? c.companyName ?? "—"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleInput}
              placeholder="ชื่อลูกค้า / บริษัท"
              className="w-full font-bold border-none focus:ring-0 p-0 text-base placeholder:font-normal placeholder:text-slate-300 bg-transparent outline-none block"
            />
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleInput}
              placeholder="ที่อยู่..."
              rows={2}
              className="w-full border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300 block leading-relaxed outline-none"
            />
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm">เลขประจำตัวผู้เสียภาษี:</span>
              <input
                name="customerTaxId"
                value={formData.customerTaxId}
                onChange={handleInput}
                placeholder="-"
                className="flex-1 border-none focus:ring-0 p-0 bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="w-[35%] space-y-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-bold">วันที่:</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInput}
                className="text-right border-none focus:ring-0 p-0 bg-transparent w-[140px] outline-none"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">ยืนราคาถึง:</span>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInput}
                className="text-right border-none focus:ring-0 p-0 bg-transparent w-[140px] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Items table */}
        <section className="mb-6 flex-1">
          <table className="w-full">
            <thead>
              <tr className="border-b border-t border-slate-200">
                <th className="py-3 text-center w-[5%] text-slate-500 font-medium">#</th>
                <th className="py-3 text-left w-[38%] text-slate-500 font-medium">ชื่อสินค้า / รายละเอียด</th>
                <th className="py-3 text-center w-[9%] text-slate-500 font-medium">จำนวน</th>
                <th className="py-3 text-center w-[9%] text-slate-500 font-medium">หน่วย</th>
                <th className="py-3 text-right w-[14%] text-slate-500 font-medium">ราคา/หน่วย</th>
                <th className="py-3 text-right w-[10%] text-slate-500 font-medium">ส่วนลด</th>
                <th className="py-3 text-right w-[10%] text-slate-500 font-medium">รวม</th>
                <th className="w-[5%] no-print" />
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="py-3 text-center text-slate-400">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <input
                      value={item.name}
                      onChange={(e) => handleItemChange(i, "name", e.target.value)}
                      placeholder="ชื่อสินค้า/บริการ"
                      className="w-full font-bold bg-transparent border-none focus:ring-0 p-0 mb-1 placeholder:font-normal placeholder:text-slate-300 outline-none"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => handleItemChange(i, "description", e.target.value)}
                      placeholder="รายละเอียดเพิ่มเติม..."
                      rows={1}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden text-xs text-slate-600 leading-relaxed placeholder:text-slate-300 outline-none"
                      onInput={(e) => {
                        const t = e.currentTarget;
                        t.style.height = "auto";
                        t.style.height = t.scrollHeight + "px";
                      }}
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
                      className="w-full text-center bg-transparent border-none focus:ring-0 p-0 outline-none"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      value={item.unit}
                      onChange={(e) => handleItemChange(i, "unit", e.target.value)}
                      placeholder="หน่วย"
                      className="w-full text-center bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-300 outline-none"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(i, "price", e.target.value)}
                      className="w-full text-right bg-transparent border-none focus:ring-0 p-0 outline-none"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(i, "discount", e.target.value)}
                      placeholder="0.00"
                      className="w-full text-right bg-transparent border-none focus:ring-0 p-0 text-slate-500 placeholder:text-slate-300 outline-none"
                    />
                  </td>
                  <td className="py-3 text-right font-medium">
                    {fmt((item.quantity * item.price) - item.discount)}
                  </td>
                  <td className="py-3 text-center no-print">
                    <button
                      onClick={() => removeItem(i)}
                      className="h-6 w-6 text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 no-print">
            <Button variant="outline" size="sm" onClick={addItem} className="text-slate-500 border-dashed">
              <Plus className="mr-2 h-4 w-4" />เพิ่มรายการ
            </Button>
          </div>
        </section>

        {/* Totals */}
        <section className="flex justify-end mt-4">
          <div className="w-[240px] space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">รวมเป็นเงิน</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">ส่วนลดท้ายบิล</span>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInput}
                className="text-right border-b border-dotted border-slate-400 focus:border-black outline-none w-24 py-0 text-sm bg-transparent"
              />
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ยอดหลังหักส่วนลด</span>
              <span className="font-semibold">{fmt(afterDiscount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">ภาษีมูลค่าเพิ่ม (7%)</span>
                <input
                  type="checkbox"
                  checked={formData.includeVat}
                  onChange={(e) => setFormData((f) => ({ ...f, includeVat: e.target.checked }))}
                  className="h-3 w-3 rounded border-gray-300 no-print"
                />
              </div>
              <span className={`font-semibold ${formData.includeVat ? "" : "text-slate-400"}`}>
                {fmt(vat)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">หัก ณ ที่จ่าย (3%)</span>
                <input
                  type="checkbox"
                  checked={formData.includeWht}
                  onChange={(e) => setFormData((f) => ({ ...f, includeWht: e.target.checked }))}
                  className="h-3 w-3 rounded border-gray-300 no-print"
                />
              </div>
              <span className={`font-semibold ${formData.includeWht ? "text-red-600" : "text-slate-400"}`}>
                {formData.includeWht ? "-" : ""}{fmt(wht)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-black pt-1.5 mt-1">
              <span>ยอดชำระสุทธิ</span>
              <span>{fmt(formData.includeWht ? netPayable : total)}</span>
            </div>
          </div>
        </section>

        {/* Notes + Signatures */}
        <div className="mt-auto pt-8">
          <div className="mb-8">
            <p className="font-bold mb-1 text-sm">หมายเหตุ:</p>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInput}
              rows={3}
              placeholder="ระบุเงื่อนไขการชำระเงิน..."
              className="w-full border-none p-0 resize-none bg-transparent text-sm placeholder:text-slate-300 leading-relaxed outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm">
            <div className="flex flex-col justify-between h-32">
              <p className="font-bold px-2">ในนาม {formData.customerName || "ลูกค้า"}</p>
              <div className="flex gap-4 items-end mt-auto">
                <div className="flex-1 text-center">
                  <div className="border-b border-slate-300 h-8" />
                  <p className="mt-2 font-bold text-xs">ผู้สั่งซื้อสินค้า</p>
                </div>
                <div className="w-24 text-center">
                  <div className="border-b border-slate-300 h-8 flex items-end justify-center pb-1 text-xs font-medium">
                    {today}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">วันที่</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between h-32">
              <p className="font-bold px-2 text-right">ในนาม {settings?.companyName ?? "บริษัท"}</p>
              <div className="flex gap-4 items-end mt-auto">
                <div className="flex-1 text-center relative">
                  {settings?.signature && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.signature}
                      alt="Signature"
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 max-h-[60px] object-contain mix-blend-multiply"
                    />
                  )}
                  <div className="border-b border-slate-300 h-8" />
                  <p className="mt-2 font-bold text-xs">ผู้อนุมัติ</p>
                </div>
                <div className="w-24 text-center">
                  <div className="border-b border-slate-300 h-8 flex items-end justify-center pb-1 text-xs font-medium">
                    {today}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">วันที่</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
