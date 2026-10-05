"use client";

import { useState } from "react";
import { Loader2, Save, Globe, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    companyName: "Wooyou Creative",
    companyNameEn: "Wooyou Creative Co., Ltd.",
    taxId: "",
    address: "",
    phone: "",
    email: "contact@wooyoucreative.com",
    website: "https://wooyoucreative.com",
    logo: "",
  });

  const [invoice, setInvoice] = useState({
    prefix: "INV",
    taxInvoicePrefix: "TAX",
    receiptPrefix: "REC",
    quotationPrefix: "QT",
    vatRate: 7,
    bankName: "",
    bankAccount: "",
    bankBranch: "",
    paymentNote: "",
  });

  async function saveSettings() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ตั้งค่าระบบ</h1>
        <p className="text-muted-foreground text-sm mt-1">ข้อมูลบริษัทและการตั้งค่าทั่วไป</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="size-4" />ข้อมูลบริษัท
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>ชื่อบริษัท (ภาษาไทย)</Label>
              <Input value={general.companyName} onChange={(e) => setGeneral({ ...general, companyName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>ชื่อบริษัท (ภาษาอังกฤษ)</Label>
              <Input value={general.companyNameEn} onChange={(e) => setGeneral({ ...general, companyNameEn: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>เลขประจำตัวผู้เสียภาษี</Label>
              <Input value={general.taxId} onChange={(e) => setGeneral({ ...general, taxId: e.target.value })} placeholder="0105565..." />
            </div>
            <div className="space-y-1.5">
              <Label><Phone className="inline size-3 mr-1" />เบอร์โทร</Label>
              <Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label><Mail className="inline size-3 mr-1" />อีเมล</Label>
              <Input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label><Globe className="inline size-3 mr-1" />เว็บไซต์</Label>
              <Input value={general.website} onChange={(e) => setGeneral({ ...general, website: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label><MapPin className="inline size-3 mr-1" />ที่อยู่</Label>
            <Textarea rows={2} value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>URL โลโก้บริษัท</Label>
            <Input placeholder="https://..." value={general.logo} onChange={(e) => setGeneral({ ...general, logo: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ตั้งค่าเอกสาร</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Prefix ใบแจ้งหนี้</Label>
              <Input value={invoice.prefix} onChange={(e) => setInvoice({ ...invoice, prefix: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Prefix ใบกำกับภาษี</Label>
              <Input value={invoice.taxInvoicePrefix} onChange={(e) => setInvoice({ ...invoice, taxInvoicePrefix: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Prefix ใบเสร็จ</Label>
              <Input value={invoice.receiptPrefix} onChange={(e) => setInvoice({ ...invoice, receiptPrefix: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Prefix ใบเสนอราคา</Label>
              <Input value={invoice.quotationPrefix} onChange={(e) => setInvoice({ ...invoice, quotationPrefix: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5 w-32">
            <Label>VAT (%)</Label>
            <Input type="number" min={0} max={100} value={invoice.vatRate} onChange={(e) => setInvoice({ ...invoice, vatRate: Number(e.target.value) })} />
          </div>

          <Separator />
          <p className="text-sm font-medium">ข้อมูลบัญชีธนาคาร</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>ชื่อธนาคาร</Label>
              <Input placeholder="กสิกรไทย" value={invoice.bankName} onChange={(e) => setInvoice({ ...invoice, bankName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>เลขบัญชี</Label>
              <Input value={invoice.bankAccount} onChange={(e) => setInvoice({ ...invoice, bankAccount: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>สาขา</Label>
              <Input value={invoice.bankBranch} onChange={(e) => setInvoice({ ...invoice, bankBranch: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>หมายเหตุการชำระเงิน</Label>
            <Textarea rows={2} value={invoice.paymentNote} onChange={(e) => setInvoice({ ...invoice, paymentNote: e.target.value })} placeholder="กรุณาโอนเงินภายใน 30 วัน..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          บันทึกการตั้งค่า
        </Button>
        {saved && <span className="text-sm text-emerald-600">บันทึกแล้ว</span>}
      </div>
    </div>
  );
}
